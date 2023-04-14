import SVGUtils from '../utils/SVGUtils.js';

/**
 * @class
 * @classdesc Represents a planet or point of interest in the chart
 * @public
 */
class Point {

  #name
  #angle
  #isRetrograde

  /**
   * @constructs
   * @param {Object} data
   */
  constructor( data ) {
    this.#name = data.name ?? "Unknown"
    this.#angle = data.angle ?? 0
    this.#isRetrograde = data.isRetrograde ?? false
  }

  /**
  * Get name
  *
  * @return {String}
  */
  getName(){
    return this.#name
  }

  /**
  * Is retrograde
  *
  * @return {Boolean}
  */
  isRetrograde(){
    return this.#isRetrograde
  }

  /**
  * Get angle
  *
  * @return {Number}
  */
  getAngle(){
    return this.#angle
  }

  /**
  * Get symbol
  * @param {Number} xPos
  * @param {Number} yPos
  * @param {Number} [scale]
  *
  * @return {SVGElement}
  */
  getSymbol(xPos, yPos, scale){
    const wrapper = SVGUtils.SVGGroup()
    const symbol = SVGUtils.SVGSymbol(this.#name, xPos, yPos, scale)
    wrapper.appendChild(symbol)
    return wrapper
  }

}

export {
  Point as
  default
}
