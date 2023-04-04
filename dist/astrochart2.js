/*!
 * 
 *       astrochart2
 *       A JavaScript for generating Astrology charts.
 *       Version: 0.0.1
 *       Author: Tom Jurman (tomasjurman@kibo.cz)
 *       Licence: GNUv3 (https://www.gnu.org/licenses/gpl-3.0.en.html)
 *
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["astrology"] = factory();
	else
		root["astrology"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/charts/Chart.js":
/*!*****************************!*\
  !*** ./src/charts/Chart.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Chart)
/* harmony export */ });
/**
 * @class
 * @classdesc An abstract class for all type of Chart
 * @public
 * @hideconstructor
 * @abstract
 */
class Chart {

  //#settings

  /**
   * @constructs
   * @param {Object} settings
   */
  constructor(settings) {
    //this.#settings = settings
  }

  /**
   * Check if the data is valid
   * @throws {Error} - if the data is undefined.
   * @param {Object} data
   * @return {Object} - {isValid:boolean, message:String}
   */
  validateData(data) {
    if (!data) {
      throw new Error("Mising param data.")
    }

    if (!Array.isArray(data.points)) {
      return {
        isValid: false,
        message: "points is not Array."
      }
    }

    if (!Array.isArray(data.cusps)) {
      return {
        isValid: false,
        message: "cups is not Array."
      }
    }

    if (data.cusps.length !== 12) {
      return {
        isValid: false,
        message: "cusps.length !== 12"
      }
    }

    for (let point of data.points) {
      if (typeof point.name !== 'string') {
        return {
          isValid: false,
          message: "point.name !== 'string'"
        }
      }
      if (point.name.length === 0) {
        return {
          isValid: false,
          message: "point.name.length == 0"
        }
      }
      if (typeof point.position !== 'number') {
        return {
          isValid: false,
          message: "point.position !== 'number'"
        }
      }
    }

    for (let cusp of data.cusps) {
      if (typeof cusp.position !== 'number') {
        return {
          isValid: false,
          message: "cusp.position !== 'number'"
        }
      }
    }

    return {
      isValid: true,
      message: ""
    }
  }

  /**
   * @abstract
   */
  setData(data) {
    throw new Error("Must be implemented by subclass.");
  }

  /**
   * @abstract
   */
  getPoints() {
    throw new Error("Must be implemented by subclass.");
  }

  /**
   * @abstract
   */
  getPoint(name) {
    throw new Error("Must be implemented by subclass.");
  }

  /**
   * @abstract
   */
  getAspects() {
    throw new Error("Must be implemented by subclass.");
  }

  /**
   * @abstract
   */
  animateTo(data) {
    throw new Error("Must be implemented by subclass.");
  }

  // ## PROTECTED ##############################
      
}




/***/ }),

/***/ "./src/charts/RadixChart.js":
/*!**********************************!*\
  !*** ./src/charts/RadixChart.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RadixChart)
/* harmony export */ });
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _Chart_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Chart.js */ "./src/charts/Chart.js");




/**
 * @class
 * @classdesc Points and cups are displayed inside the Universe.
 * @public
 * @extends {Chart}
 */
class RadixChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_2__["default"] {

  #settings
  #root

  /*
   * Shift the Ascendant to the 0 degree on The Chart
   */
  #anscendantShift
  #centerX
  #centerY
  #radius

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
    this.#centerX = this.#settings.CHART_WIDTH / 2
    this.#centerY = this.#settings.CHART_HEIGHT / 2
    this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING
    this.#root = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()
    this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}`)
    SVGDocument.appendChild(this.#root);
  }

  /**
   * Set chart data
   * @throws {Error} - if the data is not valid.
   * @param {Object} data
   * @return {RadixChart}
   */
  setData(data) {
    let status = this.validateData(data)
    if (!status.isValid) {
      throw new Error(status.messages)
    }

    this.#anscendantShift = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].DEG_360 - data.cusps[0].position
    this.#draw(data)
  }



  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {
    this.#drawBackground()
    this.#drawAstrologicalSigns()
  }

  #drawBackground() {
    //TODO - circle + mask (transparent inner circle)
    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radius)
    circle.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : this.#settings.RADIX_BACKGROUND_COLOR);
    this.#root.appendChild(circle)
  }

  #drawAstrologicalSigns() {
    const NUMBER_OF_ASTROLOGICAL_SIGNS = 12
    const STEP = 30 //degree
    const COLORS_SIGNS = [this.#settings.COLOR_ARIES, this.#settings.COLOR_TAURUS, this.#settings.COLOR_GEMINI, this.#settings.COLOR_CANCER, this.#settings.COLOR_LEO, this.#settings.COLOR_VIRGO, this.#settings.COLOR_LIBRA, this.#settings.COLOR_SCORPIO, this.#settings.COLOR_SAGITTARIUS, this.#settings.COLOR_CAPRICORN, this.#settings.COLOR_AQUARIUS, this.#settings.COLOR_PISCES]
    let start = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].angleWithShifts(this.#anscendantShift, this.#settings.CHART_ROTATION)
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()
    for (let i = 0; i < 4; i++) {
      let segment = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSegment(this.#centerX, this.#centerY, this.#radius, start, start + STEP, this.#radius - this.#radius / this.#settings.RADIX_INNER_CIRCLE_RADIUS_RATIO);

      segment.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : COLORS_SIGNS[i]);
      segment.setAttribute("stroke", this.#settings.CHART_STROKE_ONLY ? this.#settings.CIRCLE_COLOR : "none");
      segment.setAttribute("stroke-width", this.#settings.CHART_STROKE_ONLY ? this.#settings.STROKE : 0);

      wrapper.appendChild(segment);

      start += STEP;
    }

    this.#root.appendChild(wrapper)
  }


}




/***/ }),

/***/ "./src/charts/TransitChart.js":
/*!************************************!*\
  !*** ./src/charts/TransitChart.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TransitChart)
/* harmony export */ });
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _Chart_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Chart.js */ "./src/charts/Chart.js");



/**
 * @class
 * @classdesc Points and cups are displayed from outside the Universe.
 * @public
 * @extends {Chart}
 */
class TransitChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_1__["default"] {

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
    this.#root = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()
    this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.TRANSIT_ID}`)
    SVGDocument.appendChild(this.#root);
  }

  // ## PRIVATE ##############################

}




/***/ }),

/***/ "./src/settings/Colors.js":
/*!********************************!*\
  !*** ./src/settings/Colors.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CIRCLE_COLOR": () => (/* binding */ CIRCLE_COLOR),
/* harmony export */   "COLOR_AQUARIUS": () => (/* binding */ COLOR_AQUARIUS),
/* harmony export */   "COLOR_ARIES": () => (/* binding */ COLOR_ARIES),
/* harmony export */   "COLOR_CANCER": () => (/* binding */ COLOR_CANCER),
/* harmony export */   "COLOR_CAPRICORN": () => (/* binding */ COLOR_CAPRICORN),
/* harmony export */   "COLOR_GEMINI": () => (/* binding */ COLOR_GEMINI),
/* harmony export */   "COLOR_LEO": () => (/* binding */ COLOR_LEO),
/* harmony export */   "COLOR_LIBRA": () => (/* binding */ COLOR_LIBRA),
/* harmony export */   "COLOR_PISCES": () => (/* binding */ COLOR_PISCES),
/* harmony export */   "COLOR_SAGITTARIUS": () => (/* binding */ COLOR_SAGITTARIUS),
/* harmony export */   "COLOR_SCORPIO": () => (/* binding */ COLOR_SCORPIO),
/* harmony export */   "COLOR_TAURUS": () => (/* binding */ COLOR_TAURUS),
/* harmony export */   "COLOR_VIRGO": () => (/* binding */ COLOR_VIRGO)
/* harmony export */ });
/**
* Aries color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_ARIES = "#FF4500";

/**
* Taurus color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_TAURUS = "#8B4513";

/**
* Geminy color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_GEMINI= "#87CEEB";

/**
* Cancer color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_CANCER = "#27AE60";

/**
* Leo color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_LEO = "#FF4500";

/**
* Virgo color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_VIRGO = "#8B4513";

/**
* Libra color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_LIBRA = "#87CEEB";

/**
* Scorpio color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_SCORPIO = "#27AE60";

/**
* Sagittarius color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_SAGITTARIUS = "#FF4500";

/**
* Capricorn color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_CAPRICORN = "#8B4513";

/**
* Aquarius color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_AQUARIUS = "#87CEEB";

/**
* Pisces color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_PISCES = "#27AE60";

/**
* Color of circles in charts
* @constant
* @type {String}
* @default #333
*/
const CIRCLE_COLOR = "#333";


/***/ }),

/***/ "./src/settings/DefaultSettings.js":
/*!*****************************************!*\
  !*** ./src/settings/DefaultSettings.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SETTINGS)
/* harmony export */ });
/* harmony import */ var _Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Universe.js */ "./src/settings/Universe.js");
/* harmony import */ var _Radix_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Radix.js */ "./src/settings/Radix.js");
/* harmony import */ var _Transit_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Transit.js */ "./src/settings/Transit.js");
/* harmony import */ var _Colors_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Colors.js */ "./src/settings/Colors.js");





const SETTINGS = Object.assign({}, _Universe_js__WEBPACK_IMPORTED_MODULE_0__, _Radix_js__WEBPACK_IMPORTED_MODULE_1__, _Transit_js__WEBPACK_IMPORTED_MODULE_2__, _Colors_js__WEBPACK_IMPORTED_MODULE_3__ );




/***/ }),

/***/ "./src/settings/Radix.js":
/*!*******************************!*\
  !*** ./src/settings/Radix.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RADIX_BACKGROUND_COLOR": () => (/* binding */ RADIX_BACKGROUND_COLOR),
/* harmony export */   "RADIX_ID": () => (/* binding */ RADIX_ID),
/* harmony export */   "RADIX_INNER_CIRCLE_RADIUS_RATIO": () => (/* binding */ RADIX_INNER_CIRCLE_RADIUS_RATIO),
/* harmony export */   "RADIX_OUTER_CIRCLE_RADIUS_RATIO": () => (/* binding */ RADIX_OUTER_CIRCLE_RADIUS_RATIO)
/* harmony export */ });
/**
* Radix chart element ID
* @constant
* @type {String}
* @default radix
*/
const RADIX_ID = "radix"

/**
* Radix background color
* @constant
* @type {String}
* @default #fff
*/
const RADIX_BACKGROUND_COLOR = "#fff";

// radius / OUTER_CIRCLE_RADIUS_RATIO
const RADIX_OUTER_CIRCLE_RADIUS_RATIO = 2;

// radius - radius/INNER_CIRCLE_RADIUS_RATIO
const RADIX_INNER_CIRCLE_RADIUS_RATIO = 8;


/***/ }),

/***/ "./src/settings/Transit.js":
/*!*********************************!*\
  !*** ./src/settings/Transit.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TRANSIT_ID": () => (/* binding */ TRANSIT_ID)
/* harmony export */ });
/**
* Transit chart element ID
* @constant
* @type {String}
* @default transit
*/
const TRANSIT_ID = "transit"


/***/ }),

/***/ "./src/settings/Universe.js":
/*!**********************************!*\
  !*** ./src/settings/Universe.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CHART_HEIGHT": () => (/* binding */ CHART_HEIGHT),
/* harmony export */   "CHART_PADDING": () => (/* binding */ CHART_PADDING),
/* harmony export */   "CHART_ROTATION": () => (/* binding */ CHART_ROTATION),
/* harmony export */   "CHART_STROKE_ONLY": () => (/* binding */ CHART_STROKE_ONLY),
/* harmony export */   "CHART_WIDTH": () => (/* binding */ CHART_WIDTH),
/* harmony export */   "STROKE": () => (/* binding */ STROKE)
/* harmony export */ });
/**
* Chart width
* @constant
* @type {Number}
* @default 800
*/
const CHART_WIDTH = 1024

/**
* Chart height
* @constant
* @type {Number}
* @default 800
*/
const CHART_HEIGHT = 1024

/**
* Chart padding
* @constant
* @type {Number}
* @default 10px
*/
const CHART_PADDING = 10

/**
* Rotation of the chart in degree. (0 degree is on the West.)
* @constant
* @type {Number}
* @default 180
*/
const CHART_ROTATION = 180;

/**
* No fill, only stroke
* @constant
* @type {boolean}
* @default false
*/
const CHART_STROKE_ONLY = true;

/**
* Line strength
* @constant
* @type {Number}
* @default 1
*/
const STROKE = 1


/***/ }),

/***/ "./src/universe/Universe.js":
/*!**********************************!*\
  !*** ./src/universe/Universe.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Universe)
/* harmony export */ });
/* harmony import */ var _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settings/DefaultSettings.js */ "./src/settings/DefaultSettings.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../charts/TransitChart.js */ "./src/charts/TransitChart.js");





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

    this.#settings = Object.assign({}, _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_0__["default"], options, {HTML_ELEMENT_ID:htmlElementID});
    this.#SVGDocument = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGDocument(this.#settings.CHART_WIDTH, this.#settings.CHART_HEIGHT)
    document.getElementById(htmlElementID).appendChild(this.#SVGDocument);

    this.#radix = new _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_2__["default"](this.#SVGDocument, this.#settings)
    this.#transit = new _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_3__["default"](this.#SVGDocument, this.#settings)

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

}




/***/ }),

/***/ "./src/utils/SVGUtils.js":
/*!*******************************!*\
  !*** ./src/utils/SVGUtils.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SVGUtils)
/* harmony export */ });
/**
 * @class
 * @classdesc SVG utility class
 * @public
 * @static
 * @hideconstructor
 */
class SVGUtils {

  static SVG_NAMESPACE = "http://www.w3.org/2000/svg"

  constructor() {
    if (this instanceof SVGUtils) {
      throw Error('Sorry, this is a static class and cannot be instantiated.');
    }
  }

  /**
   * Create a SVG document
   *
   * @static
   * @param {Number} width
   * @param {Number} height
   *
   * @return {SVGDocument}
   */
  static SVGDocument(width, height) {
    const svg = document.createElementNS(SVGUtils.SVG_NAMESPACE, "svg");
    svg.setAttribute('xmlns', "http://www.w3.org/2000/xmlns/");
    svg.setAttribute('version', "1.1");
    svg.setAttribute('viewBox', "0 0 " + width + " " + height);
    svg.setAttribute('style', "position: relative; overflow: hidden;");
    return svg
  }

  /**
   * Create a SVG group element
   *
   * @static
   * @return {SVGGroupElement}
   */
  static SVGGroup() {
    const svg = document.createElementNS(SVGUtils.SVG_NAMESPACE, "g");
    return svg
  }

  /**
   * SVG circular sector
   *
   * @static
   * @param {int} x - circle x center position
   * @param {int} y - circle y center position
   * @param {int} radius - circle radius in px
   * @param {int} a1 - angleFrom in degree
   * @param {int} a2 - angleTo in degree
   * @param {int} thickness - from outside to center in px
   *
   * @return {SVGElement} segment
   *
   * @see SVG Path arc: https://www.w3.org/TR/SVG/paths.html#PathData
   */
  static SVGSegment(x, y, radius, a1, a2, thickness, lFlag, sFlag) {    
    // @see SVG Path arc: https://www.w3.org/TR/SVG/paths.html#PathData
    const LARGE_ARC_FLAG = lFlag || 0;
    const SWEET_FLAG = sFlag || 0;

    const segment = document.createElementNS(SVGUtils.SVG_NAMESPACE, "path");
    segment.setAttribute("d", "M " + (x + thickness * Math.cos(a1)) + ", " + (y + thickness * Math.sin(a1)) + " l " + ((radius - thickness) * Math.cos(a1)) + ", " + ((radius - thickness) * Math.sin(a1)) + " A " + radius + ", " + radius + ",0 ," + LARGE_ARC_FLAG + ", " + SWEET_FLAG + ", " + (x + radius * Math.cos(a2)) + ", " + (y + radius * Math.sin(a2)) + " l " + ((radius - thickness) * -Math.cos(a2)) + ", " + ((radius - thickness) * -Math.sin(a2)) + " A " + thickness + ", " + thickness + ",0 ," + LARGE_ARC_FLAG + ", " + 1 + ", " + (x + thickness * Math.cos(a1)) + ", " + (y + thickness * Math.sin(a1)));
    segment.setAttribute("fill", "none");
    return segment;
  }

  /**
   * SVG circle
   *
   * @static
   * @param {int} cx
   * @param {int} cy
   * @param {int} radius
   *
   * @return {SVGElement} circle
   */
  static SVGCircle = function circle(cx, cy, radius) {
    const circle = document.createElementNS(SVGUtils.SVG_NAMESPACE, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "none");
    return circle;
  }
}




/***/ }),

/***/ "./src/utils/Utils.js":
/*!****************************!*\
  !*** ./src/utils/Utils.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Utils)
/* harmony export */ });
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




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Chart": () => (/* reexport safe */ _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./universe/Universe.js */ "./src/universe/Universe.js");




})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEdrQztBQUNOO0FBQ0k7QUFDRjs7QUFFckMsaUNBQWlDLEVBQUUseUNBQVEsRUFBRSxzQ0FBSyxFQUFFLHdDQUFPLEVBQUUsdUNBQU07O0FBS2xFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDTzs7QUFFUDtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7QUNwQlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNB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c3Ryb2xvZ3kvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvQ2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9SYWRpeENoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvVHJhbnNpdENoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9Db2xvcnMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvUmFkaXguanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL1RyYW5zaXQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL1VuaXZlcnNlLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91bml2ZXJzZS9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvU1ZHVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL1V0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhc3Ryb2xvZ3lcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiYXN0cm9sb2d5XCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEFuIGFic3RyYWN0IGNsYXNzIGZvciBhbGwgdHlwZSBvZiBDaGFydFxuICogQHB1YmxpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQGFic3RyYWN0XG4gKi9cbmNsYXNzIENoYXJ0IHtcblxuICAvLyNzZXR0aW5nc1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgLy90aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGRhdGEgaXMgdmFsaWRcbiAgICogQHRocm93cyB7RXJyb3J9IC0gaWYgdGhlIGRhdGEgaXMgdW5kZWZpbmVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge2lzVmFsaWQ6Ym9vbGVhbiwgbWVzc2FnZTpTdHJpbmd9XG4gICAqL1xuICB2YWxpZGF0ZURhdGEoZGF0YSkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzaW5nIHBhcmFtIGRhdGEuXCIpXG4gICAgfVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEucG9pbnRzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwicG9pbnRzIGlzIG5vdCBBcnJheS5cIlxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLmN1c3BzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwiY3VwcyBpcyBub3QgQXJyYXkuXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5jdXNwcy5sZW5ndGggIT09IDEyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJjdXNwcy5sZW5ndGggIT09IDEyXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBwb2ludCBvZiBkYXRhLnBvaW50cykge1xuICAgICAgaWYgKHR5cGVvZiBwb2ludC5uYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQubmFtZSAhPT0gJ3N0cmluZydcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocG9pbnQubmFtZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50Lm5hbWUubGVuZ3RoID09IDBcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBvaW50LnBvc2l0aW9uICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQucG9zaXRpb24gIT09ICdudW1iZXInXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGN1c3Agb2YgZGF0YS5jdXNwcykge1xuICAgICAgaWYgKHR5cGVvZiBjdXNwLnBvc2l0aW9uICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiY3VzcC5wb3NpdGlvbiAhPT0gJ251bWJlcidcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBtZXNzYWdlOiBcIlwiXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc2V0RGF0YShkYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRQb2ludHMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRQb2ludChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRBc3BlY3RzKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgYW5pbWF0ZVRvKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8vICMjIFBST1RFQ1RFRCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiAgICAgIFxufVxuXG5leHBvcnQge1xuICBDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBpbnNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBSYWRpeENoYXJ0IGV4dGVuZHMgQ2hhcnQge1xuXG4gICNzZXR0aW5nc1xuICAjcm9vdFxuXG4gIC8qXG4gICAqIFNoaWZ0IHRoZSBBc2NlbmRhbnQgdG8gdGhlIDAgZGVncmVlIG9uIFRoZSBDaGFydFxuICAgKi9cbiAgI2Fuc2NlbmRhbnRTaGlmdFxuICAjY2VudGVyWFxuICAjY2VudGVyWVxuICAjcmFkaXVzXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7U1ZHRG9jdW1lbnR9IFNWR0RvY3VtZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3IoU1ZHRG9jdW1lbnQsIHNldHRpbmdzKSB7XG5cbiAgICBpZiAoIVNWR0RvY3VtZW50IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gU1ZHRG9jdW1lbnQuJylcbiAgICB9XG5cbiAgICBpZiAoIXNldHRpbmdzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBzZXR0aW5ncy4nKVxuICAgIH1cblxuICAgIHN1cGVyKHNldHRpbmdzKVxuXG4gICAgdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMuI2NlbnRlclggPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9XSURUSCAvIDJcbiAgICB0aGlzLiNjZW50ZXJZID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfSEVJR0hUIC8gMlxuICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuICAgIHRoaXMuI3Jvb3QgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgdGhpcy4jcm9vdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuUkFESVhfSUR9YClcbiAgICBTVkdEb2N1bWVudC5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2VzKVxuICAgIH1cblxuICAgIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCA9IFV0aWxzLkRFR18zNjAgLSBkYXRhLmN1c3BzWzBdLnBvc2l0aW9uXG4gICAgdGhpcy4jZHJhdyhkYXRhKVxuICB9XG5cblxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLypcbiAgICogRHJhdyByYWRpeCBjaGFydFxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgI2RyYXcoZGF0YSkge1xuICAgIHRoaXMuI2RyYXdCYWNrZ3JvdW5kKClcbiAgICB0aGlzLiNkcmF3QXN0cm9sb2dpY2FsU2lnbnMoKVxuICB9XG5cbiAgI2RyYXdCYWNrZ3JvdW5kKCkge1xuICAgIC8vVE9ETyAtIGNpcmNsZSArIG1hc2sgKHRyYW5zcGFyZW50IGlubmVyIGNpcmNsZSlcbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzKVxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiB0aGlzLiNzZXR0aW5ncy5SQURJWF9CQUNLR1JPVU5EX0NPTE9SKTtcbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKGNpcmNsZSlcbiAgfVxuXG4gICNkcmF3QXN0cm9sb2dpY2FsU2lnbnMoKSB7XG4gICAgY29uc3QgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUyA9IDEyXG4gICAgY29uc3QgU1RFUCA9IDMwIC8vZGVncmVlXG4gICAgY29uc3QgQ09MT1JTX1NJR05TID0gW3RoaXMuI3NldHRpbmdzLkNPTE9SX0FSSUVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9UQVVSVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0dFTUlOSSwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FOQ0VSLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9MRU8sIHRoaXMuI3NldHRpbmdzLkNPTE9SX1ZJUkdPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9MSUJSQSwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfU0NPUlBJTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfU0FHSVRUQVJJVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0NBUFJJQ09STiwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVFVQVJJVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1BJU0NFU11cbiAgICBsZXQgc3RhcnQgPSBVdGlscy5hbmdsZVdpdGhTaGlmdHModGhpcy4jYW5zY2VuZGFudFNoaWZ0LCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9ST1RBVElPTilcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICBsZXQgc2VnbWVudCA9IFNWR1V0aWxzLlNWR1NlZ21lbnQodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzLCBzdGFydCwgc3RhcnQgKyBTVEVQLCB0aGlzLiNyYWRpdXMgLSB0aGlzLiNyYWRpdXMgLyB0aGlzLiNzZXR0aW5ncy5SQURJWF9JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPKTtcblxuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBDT0xPUlNfU0lHTlNbaV0pO1xuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyB0aGlzLiNzZXR0aW5ncy5DSVJDTEVfQ09MT1IgOiBcIm5vbmVcIik7XG4gICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLlNUUk9LRSA6IDApO1xuXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHNlZ21lbnQpO1xuXG4gICAgICBzdGFydCArPSBTVEVQO1xuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG5cbn1cblxuZXhwb3J0IHtcbiAgUmFkaXhDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBvaW50cyBhbmQgY3VwcyBhcmUgZGlzcGxheWVkIGZyb20gb3V0c2lkZSB0aGUgVW5pdmVyc2UuXG4gKiBAcHVibGljXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XG4gKi9cbmNsYXNzIFRyYW5zaXRDaGFydCBleHRlbmRzIENoYXJ0IHtcblxuICAjc2V0dGluZ3NcbiAgI3Jvb3RcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtTVkdEb2N1bWVudH0gU1ZHRG9jdW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihTVkdEb2N1bWVudCwgc2V0dGluZ3MpIHtcblxuICAgIGlmICghU1ZHRG9jdW1lbnQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBTVkdEb2N1bWVudC4nKVxuICAgIH1cblxuICAgIGlmICghc2V0dGluZ3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHNldHRpbmdzLicpXG4gICAgfVxuXG4gICAgc3VwZXIoc2V0dGluZ3MpXG5cblxuICAgIHRoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLiNyb290ID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgIHRoaXMuI3Jvb3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlRSQU5TSVRfSUR9YClcbiAgICBTVkdEb2N1bWVudC5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcbiAgfVxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbn1cblxuZXhwb3J0IHtcbiAgVHJhbnNpdENoYXJ0IGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuKiBBcmllcyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUklFUyA9IFwiI0ZGNDUwMFwiO1xuXG4vKipcbiogVGF1cnVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1RBVVJVUyA9IFwiIzhCNDUxM1wiO1xuXG4vKipcbiogR2VtaW55IGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0dFTUlOST0gXCIjODdDRUVCXCI7XG5cbi8qKlxuKiBDYW5jZXIgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQ0FOQ0VSID0gXCIjMjdBRTYwXCI7XG5cbi8qKlxuKiBMZW8gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfTEVPID0gXCIjRkY0NTAwXCI7XG5cbi8qKlxuKiBWaXJnbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9WSVJHTyA9IFwiIzhCNDUxM1wiO1xuXG4vKipcbiogTGlicmEgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4N0NFRUJcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfTElCUkEgPSBcIiM4N0NFRUJcIjtcblxuLyoqXG4qIFNjb3JwaW8gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0NPUlBJTyA9IFwiIzI3QUU2MFwiO1xuXG4vKipcbiogU2FnaXR0YXJpdXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0FHSVRUQVJJVVMgPSBcIiNGRjQ1MDBcIjtcblxuLyoqXG4qIENhcHJpY29ybiBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9DQVBSSUNPUk4gPSBcIiM4QjQ1MTNcIjtcblxuLyoqXG4qIEFxdWFyaXVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0FRVUFSSVVTID0gXCIjODdDRUVCXCI7XG5cbi8qKlxuKiBQaXNjZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfUElTQ0VTID0gXCIjMjdBRTYwXCI7XG5cbi8qKlxuKiBDb2xvciBvZiBjaXJjbGVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSVJDTEVfQ09MT1IgPSBcIiMzMzNcIjtcbiIsImltcG9ydCAqIGFzIFVuaXZlcnNlIGZyb20gXCIuL1VuaXZlcnNlLmpzXCJcbmltcG9ydCAqIGFzIFJhZGl4IGZyb20gXCIuL1JhZGl4LmpzXCJcbmltcG9ydCAqIGFzIFRyYW5zaXQgZnJvbSBcIi4vVHJhbnNpdC5qc1wiXG5pbXBvcnQgKiBhcyBDb2xvcnMgZnJvbSBcIi4vQ29sb3JzLmpzXCJcblxuY29uc3QgU0VUVElOR1MgPSBPYmplY3QuYXNzaWduKHt9LCBVbml2ZXJzZSwgUmFkaXgsIFRyYW5zaXQsIENvbG9ycyApO1xuXG5leHBvcnQge1xuICBTRVRUSU5HUyBhc1xuICBkZWZhdWx0XG59XG4iLCIvKipcbiogUmFkaXggY2hhcnQgZWxlbWVudCBJRFxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgcmFkaXhcbiovXG5leHBvcnQgY29uc3QgUkFESVhfSUQgPSBcInJhZGl4XCJcblxuLyoqXG4qIFJhZGl4IGJhY2tncm91bmQgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNmZmZcbiovXG5leHBvcnQgY29uc3QgUkFESVhfQkFDS0dST1VORF9DT0xPUiA9IFwiI2ZmZlwiO1xuXG4vLyByYWRpdXMgLyBPVVRFUl9DSVJDTEVfUkFESVVTX1JBVElPXG5leHBvcnQgY29uc3QgUkFESVhfT1VURVJfQ0lSQ0xFX1JBRElVU19SQVRJTyA9IDI7XG5cbi8vIHJhZGl1cyAtIHJhZGl1cy9JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPXG5leHBvcnQgY29uc3QgUkFESVhfSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTyA9IDg7XG4iLCIvKipcbiogVHJhbnNpdCBjaGFydCBlbGVtZW50IElEXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCB0cmFuc2l0XG4qL1xuZXhwb3J0IGNvbnN0IFRSQU5TSVRfSUQgPSBcInRyYW5zaXRcIlxuIiwiLyoqXG4qIENoYXJ0IHdpZHRoXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfV0lEVEggPSAxMDI0XG5cbi8qKlxuKiBDaGFydCBoZWlnaHRcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDgwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9IRUlHSFQgPSAxMDI0XG5cbi8qKlxuKiBDaGFydCBwYWRkaW5nXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxMHB4XG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BBRERJTkcgPSAxMFxuXG4vKipcbiogUm90YXRpb24gb2YgdGhlIGNoYXJ0IGluIGRlZ3JlZS4gKDAgZGVncmVlIGlzIG9uIHRoZSBXZXN0LilcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDE4MFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9ST1RBVElPTiA9IDE4MDtcblxuLyoqXG4qIE5vIGZpbGwsIG9ubHkgc3Ryb2tlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Ym9vbGVhbn1cbiogQGRlZmF1bHQgZmFsc2VcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfU1RST0tFX09OTFkgPSB0cnVlO1xuXG4vKipcbiogTGluZSBzdHJlbmd0aFxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMVxuKi9cbmV4cG9ydCBjb25zdCBTVFJPS0UgPSAxXG4iLCJpbXBvcnQgRGVmYXVsdFNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyc7XG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnO1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuLi9jaGFydHMvVHJhbnNpdENoYXJ0LmpzJztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQW4gd3JhcHBlciBmb3IgYWxsIHBhcnRzIG9mIGdyYXBoLlxuICogQHB1YmxpY1xuICovXG5jbGFzcyBVbml2ZXJzZSB7XG5cbiAgI1NWR0RvY3VtZW50XG4gICNzZXR0aW5nc1xuICAjcmFkaXhcbiAgI3RyYW5zaXRcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGh0bWxFbGVtZW50SUQgLSBJRCBvZiB0aGUgcm9vdCBlbGVtZW50IHdpdGhvdXQgdGhlICMgc2lnblxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gQW4gb2JqZWN0IHRoYXQgb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IHNldHRpbmdzIHZhbHVlc1xuICAgKi9cbiAgY29uc3RydWN0b3IoaHRtbEVsZW1lbnRJRCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICBpZiAodHlwZW9mIGh0bWxFbGVtZW50SUQgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgcmVxdWlyZWQgcGFyYW1ldGVyIGlzIG1pc3NpbmcuJylcbiAgICB9XG5cbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm90IGZpbmQgYSBIVE1MIGVsZW1lbnQgd2l0aCBJRCAnICsgaHRtbEVsZW1lbnRJRClcbiAgICB9XG5cbiAgICB0aGlzLiNzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRTZXR0aW5ncywgb3B0aW9ucywge0hUTUxfRUxFTUVOVF9JRDpodG1sRWxlbWVudElEfSk7XG4gICAgdGhpcy4jU1ZHRG9jdW1lbnQgPSBTVkdVdGlscy5TVkdEb2N1bWVudCh0aGlzLiNzZXR0aW5ncy5DSEFSVF9XSURUSCwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfSEVJR0hUKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpLmFwcGVuZENoaWxkKHRoaXMuI1NWR0RvY3VtZW50KTtcblxuICAgIHRoaXMuI3JhZGl4ID0gbmV3IFJhZGl4Q2hhcnQodGhpcy4jU1ZHRG9jdW1lbnQsIHRoaXMuI3NldHRpbmdzKVxuICAgIHRoaXMuI3RyYW5zaXQgPSBuZXcgVHJhbnNpdENoYXJ0KHRoaXMuI1NWR0RvY3VtZW50LCB0aGlzLiNzZXR0aW5ncylcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyAjIyBQVUJMSUMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLyoqXG4gICAqIEdldCBSYWRpeCBjaGFydFxuICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxuICAgKi9cbiAgcmFkaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JhZGl4XG4gIH1cblxuICAvKipcbiAgICogR2V0IFRyYW5zaXQgY2hhcnRcbiAgICogQHJldHVybiB7VHJhbnNpdENoYXJ0fVxuICAgKi9cbiAgdHJhbnNpdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHJhbnNpdFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHNldHRpbmdzXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldFNldHRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLiNzZXR0aW5nc1xuICB9XG5cbiAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxufVxuXG5leHBvcnQge1xuICBVbml2ZXJzZSBhc1xuICBkZWZhdWx0XG59XG4iLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBTVkcgdXRpbGl0eSBjbGFzc1xuICogQHB1YmxpY1xuICogQHN0YXRpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBTVkdVdGlscyB7XG5cbiAgc3RhdGljIFNWR19OQU1FU1BBQ0UgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFNWR1V0aWxzKSB7XG4gICAgICB0aHJvdyBFcnJvcignU29ycnksIHRoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBkb2N1bWVudFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR0RvY3VtZW50KHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJzdmdcIik7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnMnLCBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvXCIpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZlcnNpb24nLCBcIjEuMVwiKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgXCIwIDAgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCdzdHlsZScsIFwicG9zaXRpb246IHJlbGF0aXZlOyBvdmVyZmxvdzogaGlkZGVuO1wiKTtcbiAgICByZXR1cm4gc3ZnXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIGdyb3VwIGVsZW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHR3JvdXAoKSB7XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiZ1wiKTtcbiAgICByZXR1cm4gc3ZnXG4gIH1cblxuICAvKipcbiAgICogU1ZHIGNpcmN1bGFyIHNlY3RvclxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7aW50fSB4IC0gY2lyY2xlIHggY2VudGVyIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7aW50fSB5IC0gY2lyY2xlIHkgY2VudGVyIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7aW50fSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzIGluIHB4XG4gICAqIEBwYXJhbSB7aW50fSBhMSAtIGFuZ2xlRnJvbSBpbiBkZWdyZWVcbiAgICogQHBhcmFtIHtpbnR9IGEyIC0gYW5nbGVUbyBpbiBkZWdyZWVcbiAgICogQHBhcmFtIHtpbnR9IHRoaWNrbmVzcyAtIGZyb20gb3V0c2lkZSB0byBjZW50ZXIgaW4gcHhcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gc2VnbWVudFxuICAgKlxuICAgKiBAc2VlIFNWRyBQYXRoIGFyYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL1NWRy9wYXRocy5odG1sI1BhdGhEYXRhXG4gICAqL1xuICBzdGF0aWMgU1ZHU2VnbWVudCh4LCB5LCByYWRpdXMsIGExLCBhMiwgdGhpY2tuZXNzLCBsRmxhZywgc0ZsYWcpIHsgICAgXG4gICAgLy8gQHNlZSBTVkcgUGF0aCBhcmM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9TVkcvcGF0aHMuaHRtbCNQYXRoRGF0YVxuICAgIGNvbnN0IExBUkdFX0FSQ19GTEFHID0gbEZsYWcgfHwgMDtcbiAgICBjb25zdCBTV0VFVF9GTEFHID0gc0ZsYWcgfHwgMDtcblxuICAgIGNvbnN0IHNlZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJwYXRoXCIpO1xuICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZFwiLCBcIk0gXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguc2luKGExKSkgKyBcIiBBIFwiICsgcmFkaXVzICsgXCIsIFwiICsgcmFkaXVzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIFNXRUVUX0ZMQUcgKyBcIiwgXCIgKyAoeCArIHJhZGl1cyAqIE1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoeSArIHJhZGl1cyAqIE1hdGguc2luKGEyKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiAtTWF0aC5zaW4oYTIpKSArIFwiIEEgXCIgKyB0aGlja25lc3MgKyBcIiwgXCIgKyB0aGlja25lc3MgKyBcIiwwICxcIiArIExBUkdFX0FSQ19GTEFHICsgXCIsIFwiICsgMSArIFwiLCBcIiArICh4ICsgdGhpY2tuZXNzICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICh5ICsgdGhpY2tuZXNzICogTWF0aC5zaW4oYTEpKSk7XG4gICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICByZXR1cm4gc2VnbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgY2lyY2xlXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtpbnR9IGN4XG4gICAqIEBwYXJhbSB7aW50fSBjeVxuICAgKiBAcGFyYW0ge2ludH0gcmFkaXVzXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGNpcmNsZVxuICAgKi9cbiAgc3RhdGljIFNWR0NpcmNsZSA9IGZ1bmN0aW9uIGNpcmNsZShjeCwgY3ksIHJhZGl1cykge1xuICAgIGNvbnN0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImNpcmNsZVwiKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3hcIiwgY3gpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBjeSk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInJcIiwgcmFkaXVzKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgcmV0dXJuIGNpcmNsZTtcbiAgfVxufVxuXG5leHBvcnQge1xuICBTVkdVdGlscyBhc1xuICBkZWZhdWx0XG59XG4iLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFV0aWxzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFV0aWxzKSB7XG4gICAgICB0aHJvdyBFcnJvcignU29ycnksIHRoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIERFR18zNjAgPSAzNjBcblxuICAvKipcbiAgICogQ29udmVydHMgZGVncmVlIHRvIHJhZGlhblxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkZWdyZWVcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGRlZ3JlZVRvUmFkaWFuID0gZnVuY3Rpb24oZGVncmVlKSB7XG4gICAgcmV0dXJuIGRlZ3JlZSAqIE1hdGguUEkgLyAxODA7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgcmFkaWFuIHRvIGRlZ3JlZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5cbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIHJhZGlhblRvRGVncmVlID0gZnVuY3Rpb24ocmFkaWFuKSB7XG4gICAgcmV0dXJuIHJhZGlhbiAqIDE4MCAvIE1hdGguUEk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGFuZ2xlIHdpdGggdGhlIGNoYXJ0IHNoaWZ0c1xuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZVxuICAgKiBAcGFyYW0ge051bWJlcn0gc2hpZnRcbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfSBkZWdyZWVcbiAgICovXG4gIHN0YXRpYyBhbmdsZVdpdGhTaGlmdHMoYW5nbGUsIHNoaWZ0ID0gMCl7XG4gICAgICByZXR1cm4gKChzaGlmdCAtIGFuZ2xlKSAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwXG4gIH1cblxuXG59XG5cbmV4cG9ydCB7XG4gIFV0aWxzIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFVuaXZlcnNlIGZyb20gJy4vdW5pdmVyc2UvVW5pdmVyc2UuanMnXG5cbmV4cG9ydCB7VW5pdmVyc2UgYXMgXCJDaGFydFwifVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9