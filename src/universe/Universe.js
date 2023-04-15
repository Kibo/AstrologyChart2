import DefaultSettings from '../settings/DefaultSettings.js';
import SVGUtils from '../utils/SVGUtils.js';
import Utils from '../utils/Utils.js';
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

    this.#settings = Object.assign({}, DefaultSettings, options, {
      HTML_ELEMENT_ID: htmlElementID
    });
    this.#SVGDocument = SVGUtils.SVGDocument(this.#settings.CHART_VIEWBOX_WIDTH, this.#settings.CHART_VIEWBOX_HEIGHT)
    document.getElementById(htmlElementID).appendChild(this.#SVGDocument);

    this.#radix = new RadixChart(this.#SVGDocument, this.#settings)
    this.#transit = new TransitChart(this.#SVGDocument, this.#settings)

    this.#loadFont( new FontFace('AstrologySymbols', 'url(../assets/fonts/ttf/AstronomiconFonts_1.1/Astronomicon.ttf)') )

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
  * Load fond to DOM
  */
  async #loadFont( font ){
    try{
      await font.load();
      document.fonts.add(font)
    }catch(e){
      throw new Error(e)
    }
  }
}

export {
  Universe as
  default
}
