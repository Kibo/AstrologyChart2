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
    this.#centerX = this.#settings.CHART_WIDTH / 2
    this.#centerY = this.#settings.CHART_HEIGHT / 2
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
  }

  #drawBackground() {
    //TODO - circle + mask (transparent inner circle)
    const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#radius)
    circle.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : this.#settings.RADIX_BACKGROUND_COLOR);
    this.#root.appendChild(circle)
  }

  #drawAstrologicalSigns() {
    const NUMBER_OF_ASTROLOGICAL_SIGNS = 11
    const STEP = 30 //degree
    const COLORS_SIGNS = [this.#settings.COLOR_ARIES, this.#settings.COLOR_TAURUS, this.#settings.COLOR_GEMINI, this.#settings.COLOR_CANCER, this.#settings.COLOR_LEO, this.#settings.COLOR_VIRGO, this.#settings.COLOR_LIBRA, this.#settings.COLOR_SCORPIO, this.#settings.COLOR_SAGITTARIUS, this.#settings.COLOR_CAPRICORN, this.#settings.COLOR_AQUARIUS, this.#settings.COLOR_PISCES]

    let start = this.#anscendantShift
    let end = start + STEP

    const wrapper = SVGUtils.SVGGroup()
    for (let i = 0; i < NUMBER_OF_ASTROLOGICAL_SIGNS; i++) {

      let a1 = Utils.degreeToRadian(end, this.#settings.CHART_ROTATION)
      let a2 = Utils.degreeToRadian(start, this.#settings.CHART_ROTATION)

      let segment = SVGUtils.SVGSegment(this.#centerX, this.#centerY, this.#radius, a1, a2, this.#radius - this.#radius / this.#settings.RADIX_INNER_CIRCLE_RADIUS_RATIO);

      segment.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : COLORS_SIGNS[i]);
      segment.setAttribute("stroke", this.#settings.CHART_STROKE_ONLY ? this.#settings.CIRCLE_COLOR : "none");
      segment.setAttribute("stroke-width", this.#settings.CHART_STROKE_ONLY ? this.#settings.STROKE : 0);

      wrapper.appendChild(segment);

      start += STEP;
      end = start + STEP
    }

    start = 15 + this.#anscendantShift
    for( let i = 0; i < NUMBER_OF_ASTROLOGICAL_SIGNS; i++ ){
      let position = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#radius - (this.#radius / this.#settings.RADIX_INNER_CIRCLE_RADIUS_RATIO)/2, Utils.degreeToRadian(start,this.#settings.CHART_ROTATION))
      let point = SVGUtils.SVGCircle( position.x, position.y, 8 )
      point.setAttribute("stroke", "#333");
      point.setAttribute("stroke-width", 1);
      wrapper.appendChild( point );
			start += STEP;
    }


    this.#root.appendChild(wrapper)
  }


}

export {
  RadixChart as
  default
}
