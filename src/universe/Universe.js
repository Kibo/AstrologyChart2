import * as defaultSettings from '../settings/DefaultSettings.js';
import RadixChart from '../charts/RadixChart.js';
import TransitChart from '../charts/TransitChart.js';

/**
 * @class
 * @classdesc An wrapper for all parts of graph.
 * @public
 */
class Universe {

  #SVGDocument
  #settings
  #radix
  #transit

  /**
   * @constructs
   * @param {String} htmlElementID - ID of the root element without the # sign
   * @param {Object} [options] - An object that overrides the default settings values
   */
  constructor(htmlElementID, options = {}) {

    if (typeof htmlElementID !== 'string') {
      throw new Error('A required parameter is missing.')
    }

    if (!document.getElementById(htmlElementID)) {
      throw new Error('Canot find a HTML element with ID ' + htmlElementID)
    }

    this.#settings = Object.assign({}, {...defaultSettings }, options, {HTML_ELEMENT_ID:htmlElementID});
    this.#SVGDocument = this.#createSVGDocument(this.#settings.WIDTH, this.#settings.HEIGHT)
    document.getElementById(htmlElementID).appendChild(this.#SVGDocument);

    this.#radix = new RadixChart(this.#SVGDocument, this.#settings)
    this.#transit = new TransitChart(this.#SVGDocument, this.#settings)

    return this
  }

  // ## PUBLIC ##############################

  /**
   * Get Radix chart
   * @return {RadixChart}
   */
  radix() {
    return this.#radix
  }

  /**
   * Get Transit chart
   * @return {TransitChart}
   */
  transit() {
    return this.#transit
  }

  /**
   * Get current settings
   * @return {Object}
   */
  getSettings() {
    return this.#settings
  }

  // ## PRIVATE ##############################

  /*
   * Create a SVG document
   *
   * @private
   * @param {Number} width
   * @param {Number} height
   * @return {SVGDocument}
   */
  #createSVGDocument(width, height) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('xmlns', "http://www.w3.org/2000/xmlns/");
    svg.setAttribute('version', "1.1");
    svg.setAttribute('viewBox', "0 0 " + this.#settings.WIDTH + " " + this.#settings.HEIGHT);
    svg.setAttribute('style', "position: relative; overflow: hidden;");
    return svg
  }
}

export {
  Universe as
  default
}
