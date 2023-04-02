import Chart from './Chart.js'

/**
 * @class
 * @classdesc Points and cups are displayed inside the Universe.
 * @public
 * @extends {Chart}
 */
class RadixChart extends Chart{

  #SVGDocument
  #settings
  #root

  constructor( SVGDocument, settings) {

    if(!SVGDocument instanceof SVGElement){
      throw Error('Bad param SVGDocument.')
    }

    if(!settings){
      throw Error('Bad param settings.')
    }

    super()

    this.#SVGDocument = SVGDocument
    this.#settings = settings
    this.#root = this.createSVGGroup(`${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}`)
    this.#SVGDocument.appendChild( this.#root );
  }



  // ## PRIVATE ##############################

}

export {
  RadixChart as
  default
}
