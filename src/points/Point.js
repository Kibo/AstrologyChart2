import SVGUtils from '../utils/SVGUtils.js';
import Utils from '../utils/Utils.js';

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
      throw new Error("Bad param cusps. ")
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

    if (this.#settings.POINT_PROPERTIES_SHOW == false) {
      return wrapper //======>
    }

    const chartCenterX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    const chartCenterY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    const angleFromSymbolToCenter = Utils.positionToAngle(xPos, yPos, chartCenterX, chartCenterY)

    // point properties - angle in sign
    const textRadius = 1.4 * scale * this.#settings.POINT_COLLISION_RADIUS
    const textPosition = Utils.positionOnCircle(xPos, yPos, textRadius, Utils.degreeToRadian(-angleFromSymbolToCenter))
    const textWrapper = SVGUtils.SVGGroup()
    // It is possible to rotate the text, when uncomment a line bellow.
    //textWrapper.setAttribute("transform", `rotate(${angleFromSymbolToCenter},${textPosition.x},${textPosition.y})`)
    const text = SVGUtils.SVGText(textPosition.x, textPosition.y, this.getAngleInSign(), scale)
    text.setAttribute("text-anchor", "middle") // start, middle, end
    text.setAttribute("dominant-baseline", "middle")
    text.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
    text.setAttribute("font-size", this.#settings.POINT_PROPERTIES_FONT_SIZE);
    text.setAttribute("stroke", this.#settings.POINT_PROPERTIES_COLOR);
    text.setAttribute("stroke-width", this.#settings.POINT_PROPERTIES_TEXT_STROKE);
    textWrapper.appendChild(text)

    wrapper.appendChild(textWrapper)

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
