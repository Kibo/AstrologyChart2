import Chart from './Chart.js'

/**
 * @class
 * @classdesc Points and cups are displayed from outside the Universe.
 * @public
 * @extends {Chart}
 */
class TransitChart extends Chart {

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
    this.#root = this.createSVGGroup(`${this.#settings.HTML_ELEMENT_ID}-${this.#settings.TRANSIT_ID}`)
    SVGDocument.appendChild(this.#root);
  }

  // ## PRIVATE ##############################

}

export {
  TransitChart as
  default
}
