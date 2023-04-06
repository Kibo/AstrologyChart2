import SVGUtils from '../utils/SVGUtils.js';
import Utils from '../utils/Utils.js';
import Chart from './Chart.js'

/**
 * @class
 * @classdesc Points and cups are displayed inside the Universe.
 * @public
 * @extends {Chart}
 */
class RadixChart extends Chart {

  #settings
  #root

  /*
   * Shift the Ascendant to the 0 degree on The Chart
   */
  #anscendantShift
  #centerX
  #centerY
  #radius

  /**
   * @constructs
   * @param {SVGDocument} SVGDocument
   * @param {Object} settings
   */
  constructor(SVGDocument, settings) {

    if (!SVGDocument instanceof SVGElement) {
      throw new Error('Bad param SVGDocument.')
    }

    if (!settings) {
      throw new Error('Bad param settings.')
    }

    super(settings)

    this.#settings = settings
    this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING
    this.#root = SVGUtils.SVGGroup()
    this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}`)
    SVGDocument.appendChild(this.#root);
  }

  /**
   * Set chart data
   * @throws {Error} - if the data is not valid.
   * @param {Object} data
   * @return {RadixChart}
   */
  setData(data) {
    let status = this.validateData(data)
    if (!status.isValid) {
      throw new Error(status.messages)
    }

    this.#anscendantShift = Utils.DEG_360 - data.cusps[0].position
    this.#draw(data)
  }

  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {
    this.#drawBackground()
    this.#drawAstrologicalSigns()
    this.#drawRuler()
    this.#drawMainAxis()
  }

  #drawBackground() {
    const MASK_ID = `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}-background-mask-1`

    const wrapper = SVGUtils.SVGGroup()

    const mask = SVGUtils.SVGMask(MASK_ID)
    const outerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#radius)
    outerCircle.setAttribute('fill', "white")
    mask.appendChild(outerCircle)

    const innerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#radius / this.#settings.RADIX_OUTER_CIRCLE_RADIUS_RATIO)
    innerCircle.setAttribute('fill', "black")
    mask.appendChild(innerCircle)
    wrapper.appendChild(mask)

    const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#radius)
    circle.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : this.#settings.CHART_BACKGROUND_COLOR);
    circle.setAttribute("mask", this.#settings.CHART_STROKE_ONLY ? "none" : `url(#${MASK_ID})`);
    wrapper.appendChild(circle)

    this.#root.appendChild(wrapper)
  }

  #drawAstrologicalSigns() {
    const NUMBER_OF_ASTROLOGICAL_SIGNS = 12
    const STEP = 30 //degree
    const COLORS_SIGNS = [this.#settings.COLOR_ARIES, this.#settings.COLOR_TAURUS, this.#settings.COLOR_GEMINI, this.#settings.COLOR_CANCER, this.#settings.COLOR_LEO, this.#settings.COLOR_VIRGO, this.#settings.COLOR_LIBRA, this.#settings.COLOR_SCORPIO, this.#settings.COLOR_SAGITTARIUS, this.#settings.COLOR_CAPRICORN, this.#settings.COLOR_AQUARIUS, this.#settings.COLOR_PISCES]
    const SYMBOL_SIGNS = [this.#settings.SYMBOL_ARIES, this.#settings.SYMBOL_TAURUS, this.#settings.SYMBOL_GEMINI, this.#settings.SYMBOL_CANCER, this.#settings.SYMBOL_LEO, this.#settings.SYMBOL_VIRGO, this.#settings.SYMBOL_LIBRA, this.#settings.SYMBOL_SCORPIO, this.#settings.SYMBOL_SAGITTARIUS, this.#settings.SYMBOL_CAPRICORN, this.#settings.SYMBOL_AQUARIUS, this.#settings.SYMBOL_PISCES]

    const makeSymbol = (symbolIndex, angleInDegree) => {
      let position = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#radius - (this.#radius / this.#settings.RADIX_INNER_CIRCLE_RADIUS_RATIO) / 2, Utils.degreeToRadian(angleInDegree + STEP / 2, this.#settings.CHART_ROTATION))
      let point = SVGUtils.SVGCircle(position.x, position.y, 8)
      point.setAttribute("stroke", "#333");
      point.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      return point
    }

    const makeSegment = (symbolIndex, angleFromInDegree, angleToInDegree) => {
      let a1 = Utils.degreeToRadian(angleToInDegree, this.#settings.CHART_ROTATION)
      let a2 = Utils.degreeToRadian(angleFromInDegree, this.#settings.CHART_ROTATION)
      let segment = SVGUtils.SVGSegment(this.#centerX, this.#centerY, this.#radius, a1, a2, this.#radius - this.#radius / this.#settings.RADIX_INNER_CIRCLE_RADIUS_RATIO);
      segment.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : COLORS_SIGNS[symbolIndex]);
      segment.setAttribute("stroke", this.#settings.CHART_STROKE_ONLY ? this.#settings.CIRCLE_COLOR : "none");
      segment.setAttribute("stroke-width", this.#settings.CHART_STROKE_ONLY ? this.#settings.CHART_STROKE : 0);
      return segment
    }

    let startAngle = this.#anscendantShift
    let endAngle = startAngle + STEP

    const wrapper = SVGUtils.SVGGroup()

    for (let i = 0; i < NUMBER_OF_ASTROLOGICAL_SIGNS; i++) {

      let segment = makeSegment(i, startAngle, endAngle)
      wrapper.appendChild(segment);

      let symbol = makeSymbol(i, startAngle)
      wrapper.appendChild(symbol);

      startAngle += STEP;
      endAngle = startAngle + STEP
    }

    this.#root.appendChild(wrapper)
  }

  #drawRuler() {
    const RULER_STRENGHT = 10
    const NUMBER_OF_DIVIDERS = 72
    const STEP = 5

    const wrapper = SVGUtils.SVGGroup()

    const rulerRadius = (this.#radius - (this.#radius / this.#settings.RADIX_INNER_CIRCLE_RADIUS_RATIO + RULER_STRENGHT));

    let startAngle = this.#anscendantShift
    for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
      let startPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, rulerRadius, Utils.degreeToRadian(startAngle, this.#settings.CHART_ROTATION))

      let endPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, rulerRadius + RULER_STRENGHT / (i % 2 + 1), Utils.degreeToRadian(startAngle, this.#settings.CHART_ROTATION))

      const line = SVGUtils.SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);

      startAngle += STEP
    }

    const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, rulerRadius);
    circle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    circle.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    wrapper.appendChild(circle);

    this.#root.appendChild(wrapper)
  }

  #drawMainAxis(){

  }
}

export {
  RadixChart as
  default
}
