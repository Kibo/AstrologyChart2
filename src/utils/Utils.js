/**
 * Utility class
 *
 * @class
 * @public
 * @static
 */
export default class Utils {

  constructor() {
    if (this instanceof Utils) {
      throw Error('Sorry, this is a static class and cannot be instantiated.');
    }
  }

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
}
