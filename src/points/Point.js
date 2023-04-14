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
  #cusps
  #settings

  /**
   * @constructs
   * @param {Object} pointData - {name:String, angle:Number, isRetrograde:false}
   * @param {Object} cusps- [{angle:Number}, {angle:Number}, {angle:Number}, ...]
   * @param {Object} settings
   */
  constructor(pointData, cusps, settings) {
    this.#name = pointData.name ?? "Unknown"
    this.#angle = pointData.angle ?? 0
    this.#isRetrograde = pointData.isRetrograde ?? false

    if (!Array.isArray(cusps) || cusps.length != 12) {
      throw new Error("Incorect param cups. ")
    }

    this.#cusps = cusps

    if (!settings) {
      throw new Error('Bad param settings.')
    }

    this.#settings = settings
  }

  /**
   * Get name
   *
   * @return {String}
   */
  getName() {
    return this.#name
  }

  /**
   * Is retrograde
   *
   * @return {Boolean}
   */
  isRetrograde() {
    return this.#isRetrograde
  }

  /**
   * Get angle
   *
   * @return {Number}
   */
  getAngle() {
    return this.#angle
  }

  /**
   * Get symbol
   *
   * @param {Number} xPos
   * @param {Number} yPos
   * @param {Number} [scale]
   * @param {Boolean} [isProperties] - angleInSign, dignities, retrograde
   *
   * @return {SVGElement}
   */
  getSymbol(xPos, yPos, scale = 1, isProperties = true) {
    const wrapper = SVGUtils.SVGGroup()

    const symbol = SVGUtils.SVGSymbol(this.#name, xPos, yPos, scale)
    wrapper.appendChild(symbol)

    if(this.#settings.POINT_PROPERTIES_SHOW == false){
      return wrapper //======>
    }

    // point properties - angle in sign
    const textXPos = xPos + 8 * scale
    const textYPos = yPos - 12 * scale
    const text = SVGUtils.SVGText(textXPos, textYPos, this.getAngleInSign(), scale)
    text.setAttribute("font-size", this.#settings.POINT_PROPERTIES_FONT_SIZE);
    text.setAttribute("stroke", this.#settings.POINT_PROPERTIES_COLOR);
    text.setAttribute("stroke-width", this.#settings.POINT_PROPERTIES_TEXT_STROKE);
    wrapper.appendChild(text)

    return wrapper
  }

  /**
   * Get house number
   *
   * @return {Number}
   */
  getHouseNumber() {}

  /**
   * Get sign number
   * Arise = 1, Taurus = 2, ...Pisces = 12
   *
   * @return {Number}
   */
  getSignNumber() {}

  /**
   * Returns the angle (Integer) in the sign in which it stands.
   *
   * @return {Number}
   */
  getAngleInSign() {
    return Math.round(this.#angle % 30)
  }

}

export {
  Point as
  default
}
