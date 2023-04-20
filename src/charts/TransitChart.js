import RadixChart from '../charts/RadixChart.js';
import SVGUtils from '../utils/SVGUtils.js';
import Chart from './Chart.js'
import Utils from '../utils/Utils.js';

/**
 * @class
 * @classdesc Points and cups are displayed from outside the Universe.
 * @public
 * @extends {Chart}
 */
class TransitChart extends Chart {

  #radix
  #settings
  #root
  #data

  #centerX
  #centerY
  #radius

  /*
   * @see Chart.cleanUp()
   */
  #beforeCleanUpHook

  /**
   * @constructs
   * @param {RadixChart} radix
   */
  constructor(radix) {
    if (!(radix instanceof RadixChart)) {
      throw new Error('Bad param radix.')
    }

    super(radix.getUniverse().getSettings())

    this.#radix = radix
    this.#settings = this.#radix.getUniverse().getSettings()
    this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING

    this.#root = SVGUtils.SVGGroup()
    this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.TRANSIT_ID}`)
    this.#radix.getUniverse().getSVGDocument().appendChild(this.#root);

    return this
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

    this.#data = data
    this.#draw(data)
  }


  /**
   * Get radius
   *
   * @param {Number}
   */
  getRadius() {
    return this.#radius
  }

  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {

    // radix reDraw
    this.#radix.setRadius(this.#getInnerCircleRadius())

    this.cleanUp(this.#root.getAttribute('id'), this.#beforeCleanUpHook)
    this.#drawBackground()
    this.#drawCusps(data)
    this.#drawRuler()
    this.#drawBorders()
  }

  #drawBackground() {
    const MASK_ID = `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.TRANSIT_ID}-background-mask-1`

    const wrapper = SVGUtils.SVGGroup()

    const mask = SVGUtils.SVGMask(MASK_ID)
    const outerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    outerCircle.setAttribute('fill', "white")
    mask.appendChild(outerCircle)

    const innerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#getInnerCircleRadius())
    innerCircle.setAttribute('fill', "black")
    mask.appendChild(innerCircle)
    wrapper.appendChild(mask)

    const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    circle.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : this.#settings.CHART_BACKGROUND_COLOR);
    circle.setAttribute("mask", this.#settings.CHART_STROKE_ONLY ? "none" : `url(#${MASK_ID})`);
    wrapper.appendChild(circle)

    this.#root.appendChild(wrapper)
  }

  #drawRuler() {
    const NUMBER_OF_DIVIDERS = 72
    const STEP = 5

    const wrapper = SVGUtils.SVGGroup()

    let startAngle = this.#radix.getAscendantShift()
    for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
      let startPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius(), Utils.degreeToRadian(startAngle))
      let endPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius() - RadixChart.RULER_LENGTH / (i % 2 + 1), Utils.degreeToRadian(startAngle))
      const line = SVGUtils.SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);

      startAngle += STEP
    }

    const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius());
    circle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    circle.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    wrapper.appendChild(circle);

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw points
   * @param {Object} data - chart data
   */
  #drawCusps(data) {
    const points = data.points
    const cusps = data.cusps

    const wrapper = SVGUtils.SVGGroup()

    const textRadius = this.getRadius() - ((this.getRadius() - this.#getRullerCircleRadius()) / 2)

    for (let i = 0; i < cusps.length; i++) {
      const startPos = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#getInnerCircleRadius(), Utils.degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))
      const endPos = Utils.positionOnCircle(this.#centerX, this.#centerY, this.getRadius(), Utils.degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))

      const line = SVGUtils.SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR)
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE)
      wrapper.appendChild(line);

      const startCusp = cusps[i].angle
      const endCusp = cusps[(i + 1) % 12].angle
      const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + Utils.DEG_360
      const textAngle = startCusp + gap / 2

      const textPos = Utils.positionOnCircle(this.#centerX, this.#centerY, textRadius, Utils.degreeToRadian(textAngle, this.#radix.getAscendantShift()))
      const text = SVGUtils.SVGText(textPos.x, textPos.y, `${i+1}`)
      text.setAttribute("text-anchor", "middle") // start, middle, end
      text.setAttribute("dominant-baseline", "middle")
      text.setAttribute("font-size", this.#settings.RADIX_POINTS_FONT_SIZE / 2)
      text.setAttribute("fill", this.#settings.CHART_TEXT_COLOR)
      wrapper.appendChild(text)
    }

    this.#root.appendChild(wrapper)
  }

  #drawBorders() {
    const wrapper = SVGUtils.SVGGroup()

    const outerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(outerCircle)

    this.#root.appendChild(wrapper)
  }

  #getInnerCircleRadius() {
    return this.getRadius() - ((this.getRadius() / RadixChart.INNER_CIRCLE_RADIUS_RATIO))
  }

  #getRullerCircleRadius() {
    return this.#getInnerCircleRadius() + RadixChart.RULER_LENGTH
  }
}

export {
  TransitChart as
  default
}
