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
    this.#root = this.createSVGGroup(`${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}`)
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

    this.#draw(data)
  }



  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {
    this.#drawBackground()
  }

  /*
   * Draw  background
   */
  #drawBackground() {
    const centerX = this.#settings.CHART_WIDTH / 2
    const centerY = this.#settings.CHART_HEIGHT / 2
    const radius = Math.min(centerX, centerY) - this.#settings.CHART_PADDING

    const LARGE_ARC_FLAG = 1;
    const start = 0; //degree
    const end = 359.9999; //degree
    const hemisphere = this.SVGSegment(centerX, centerY, radius - radius / this.#settings.RADIX_INNER_CIRCLE_RADIUS_RATIO, start, end, radius / this.#settings.RADIX_OUTER_CIRCLE_RADIUS_RATIO, LARGE_ARC_FLAG);
    hemisphere.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : this.#settings.CHART_BACKGROUND_COLOR);
    this.#root.appendChild(hemisphere);
  }
}

export {
  RadixChart as
  default
}
