import RadixChart from '../charts/RadixChart.js';
import SVGUtils from '../utils/SVGUtils.js';
import Chart from './Chart.js'

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

  #centerX
  #centerY
  #radius

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

    this.#draw(data)
  }

  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {
    this.#drawRuler()
  }

  #drawRuler() {
    // const NUMBER_OF_DIVIDERS = 72
    // const STEP = 5
    //
    // const wrapper = SVGUtils.SVGGroup()
    //
    // let startAngle = this.#anscendantShift
    // for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
    //   let startPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius, Utils.degreeToRadian(startAngle))
    //   let endPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius + RadixChart.RULER_LENGTH / (i % 2 + 1), Utils.degreeToRadian(startAngle))
    //   const line = SVGUtils.SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    //   line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
    //   line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    //   wrapper.appendChild(line);
    //
    //   startAngle += STEP
    // }
    //
    // const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius);
    // circle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    // circle.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    // wrapper.appendChild(circle);
    //
    // this.#root.appendChild(wrapper)
  }
}

export {
  TransitChart as
  default
}
