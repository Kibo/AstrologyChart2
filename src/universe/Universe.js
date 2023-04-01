import * as defaultSettings from '../settings/DefaultSettings.js';

/**
 * @class
 * @classdesc An wrapper for all parts of graph.
 * @public
 */
class Universe {

  #radixChart
  #transitChart
  #settings
  #paper

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

    this.#settings = Object.assign({}, options);
    this.#settings = Object.assign({}, {...defaultSettings }, options);
    this.#paper = this.#createSVGDocument(htmlElementID, this.#settings.WIDTH, this.#settings.HEIGHT)
    document.getElementById(htmlElementID).appendChild(this.#paper);

    return this
  }

  // ## PUBLIC ##############################

  /**
   * Set data for radix chart
   *
   * @throws {Error} - Data is not valid.
   * @param {Object} data
   * @return {RadixChart}
   */
  setRadixData(data) {
    console.log(data)
  }

  /**
   * Set data for transit chart
   *
   * @throws {Error} - Data is not valid.
   * @param {Object} data
   * @return {TransitChart}
   */
  setTransitData(data) {

  }

  /**
   * Get Radix chart
   * @return {RadixChart}
   */
  getRadix() {
    return this.#radixChart
  }

  /**
   * Get Transit chart
   * @return {TransitChart}
   */
  getTransit() {
    return this.#transitChart
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
   * @param {String} htmlElementID
   * @param {Number} width
   * @param {Number} height
   * @return {SVGDocument}
   */
  #createSVGDocument(htmlElementID, width, height) {
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
