/**
 * @class
 * @classdesc Utility class
 * @public
 * @static
 * @hideconstructor
 */
class Utils {

  constructor() {
    if (this instanceof Utils) {
      throw Error('Sorry, this is a static class and cannot be instantiated.');
    }
  }

  static DEG_360 = 360

  /**
   * Converts degree to radian
   * @static
   *
   * @param {Number} degree
   * @return {Number}
   */
  static degreeToRadian = function(degree) {
    return degree * Math.PI / 180;
  }

  /**
   * Converts radian to degree
   * @static
   *
   * @param {Number} radian
   * @return {Number}
   */
  static radianToDegree = function(radian) {
    return radian * 180 / Math.PI;
  }

  /**
   * Calculate angle with the chart shifts
   * @static
   *
   * @param {Number} angle
   * @param {Number} shift
   *
   * @return {Number} degree
   */
  static angleWithShifts(angle, shift = 0){
      return ((shift - angle) % 360) * Math.PI / 180
  }


}

export {
  Utils as
  default
}
