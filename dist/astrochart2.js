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
/* harmony import */ var _points_Point_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../points/Point.js */ "./src/points/Point.js");





/**
 * @class
 * @classdesc Points and cups are displayed inside the Universe.
 * @public
 * @extends {Chart}
 */
class RadixChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_2__["default"] {

  /*
   * Inner circle radius ratio
   * @constant
   * @type {Number}
   * @default 8
   */
  static INNER_CIRCLE_RADIUS_RATIO = 8;

  /*
   * Outer circle radius ratio
   * @constant
   * @type {Number}
   * @default 2
   */
  static OUTER_CIRCLE_RADIUS_RATIO = 2;


  /*
   * The length of the pointers in the ruler
   * @constant
   * @type {Number}
   * @default 10
   */
  static RULER_LENGTH = 10

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
    this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING
    this.#root = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()
    this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}`)
    SVGDocument.appendChild(this.#root);

    return this
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

    this.#anscendantShift = (data.cusps[0].position + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].DEG_180)
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
    this.#drawRuler()
    this.#drawMainAxis([{
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_AS,
        position: data.cusps[0].position
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_IC,
        position: data.cusps[3].position
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_DS,
        position: data.cusps[6].position
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MC,
        position: data.cusps[9].position
      },
    ])
    this.#drawPoints(data.points)
    this.#drawBorders()
  }

  #drawBackground() {
    const MASK_ID = `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}-background-mask-1`

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const mask = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGMask(MASK_ID)
    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radius)
    outerCircle.setAttribute('fill', "white")
    mask.appendChild(outerCircle)

    const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radius / RadixChart.OUTER_CIRCLE_RADIUS_RATIO)
    innerCircle.setAttribute('fill', "black")
    mask.appendChild(innerCircle)
    wrapper.appendChild(mask)

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radius)
    circle.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : this.#settings.CHART_BACKGROUND_COLOR);
    circle.setAttribute("mask", this.#settings.CHART_STROKE_ONLY ? "none" : `url(#${MASK_ID})`);
    wrapper.appendChild(circle)

    this.#root.appendChild(wrapper)
  }

  #drawAstrologicalSigns() {
    const NUMBER_OF_ASTROLOGICAL_SIGNS = 12
    const STEP = 30 //degree
    const COLORS_SIGNS = [this.#settings.COLOR_ARIES, this.#settings.COLOR_TAURUS, this.#settings.COLOR_GEMINI, this.#settings.COLOR_CANCER, this.#settings.COLOR_LEO, this.#settings.COLOR_VIRGO, this.#settings.COLOR_LIBRA, this.#settings.COLOR_SCORPIO, this.#settings.COLOR_SAGITTARIUS, this.#settings.COLOR_CAPRICORN, this.#settings.COLOR_AQUARIUS, this.#settings.COLOR_PISCES]
    const SYMBOL_SIGNS = [_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_ARIES, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_TAURUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_GEMINI, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_CANCER, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_LEO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_VIRGO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_LIBRA, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_SCORPIO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_SAGITTARIUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_CAPRICORN, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_AQUARIUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_PISCES]

    const makeSymbol = (symbolIndex, angleInDegree) => {
      let position = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#radius - (this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO) / 2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(angleInDegree + STEP / 2, this.#anscendantShift))
      let symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(SYMBOL_SIGNS[symbolIndex], position.x, position.y, 8)
      symbol.setAttribute("stroke", this.#settings.CHART_SIGNS_COLOR);
      symbol.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      return symbol
    }

    const makeSegment = (symbolIndex, angleFromInDegree, angleToInDegree) => {
      let a1 = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(angleFromInDegree, this.#anscendantShift)
      let a2 = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(angleToInDegree, this.#anscendantShift)
      let segment = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSegment(this.#centerX, this.#centerY, this.#radius, a1, a2, this.#radius - this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO);
      segment.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : COLORS_SIGNS[symbolIndex]);
      segment.setAttribute("stroke", this.#settings.CHART_STROKE_ONLY ? this.#settings.CIRCLE_COLOR : "none");
      segment.setAttribute("stroke-width", this.#settings.CHART_STROKE_ONLY ? this.#settings.CHART_STROKE : 0);
      return segment
    }

    let startAngle = 0
    let endAngle = startAngle + STEP

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    for (let i = 0; i < NUMBER_OF_ASTROLOGICAL_SIGNS; i++) {

      let segment = makeSegment(i, startAngle, endAngle)
      wrapper.appendChild(segment);

      let symbol = makeSymbol(i, startAngle)
      wrapper.appendChild(symbol);

      startAngle += STEP;
      endAngle = startAngle + STEP
    }

    this.#root.appendChild(wrapper)
  }

  #drawRuler() {
    const NUMBER_OF_DIVIDERS = 72
    const STEP = 5

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const rulerRadius = (this.#radius - (this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO + RadixChart.RULER_LENGTH));

    let startAngle = this.#anscendantShift
    for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, rulerRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(startAngle))

      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, rulerRadius + RadixChart.RULER_LENGTH / (i % 2 + 1), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(startAngle))

      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);

      startAngle += STEP
    }

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, rulerRadius);
    circle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    circle.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    wrapper.appendChild(circle);

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw main axis
   * @param {Array} axisList
   */
  #drawMainAxis(axisList) {
    const AXIS_LENGTH = 10

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    for (const axis of axisList) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#radius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(axis.position, this.#anscendantShift))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#radius + AXIS_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(axis.position, this.#anscendantShift))
      let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
      wrapper.appendChild(line);

      let textPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#radius + AXIS_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(axis.position, this.#anscendantShift))
      let path = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(axis.name, textPoint.x, textPoint.y, {
        ...this.#settings
      })
      path.setAttribute("stroke", this.#settings.CHART_TEXT_COLOR);
      path.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
      wrapper.appendChild(path);

    }

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw points
   * @param {Array} points - [{"name":String, "position":Number}]
   */
  #drawPoints(points) {    
    const TODO = 40
    const POINT_RADIUS = this.#radius - (this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO + TODO)
    const innerCircleRadius = this.#radius - this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()
    const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].calculatePositionWithoutOverlapping(points, this.#settings.CHART_POINT_COLLISION_RADIUS, POINT_RADIUS)
    for (const pointData of points) {
      const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_3__["default"](pointData)
      const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, innerCircleRadius - 1.5 * RadixChart.RULER_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(point.getPosition(), this.#anscendantShift))
      const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, POINT_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(positions[point.getName()], this.#anscendantShift))

      // ruler mark
      const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#radius - (this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO + RadixChart.RULER_LENGTH), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(point.getPosition(), this.#anscendantShift))
      const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
      rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(rulerLine);

      // symbol
      const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y)
      symbol.setAttribute("stroke", this.#settings.CHART_POINTS_COLOR);
      symbol.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(symbol);

      // pointer
      const pointerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, POINT_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(positions[point.getName()], this.#anscendantShift))
      const pointerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(pointPosition.x, pointPosition.y, pointerLineEndPosition.x, pointerLineEndPosition.y)
      pointerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      pointerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE / 2);
      wrapper.appendChild(pointerLine);
    }

    this.#root.appendChild(wrapper)
  }

  #drawBorders() {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radius - this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO)
    innerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    innerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(innerCircle)

    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radius)
    outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(outerCircle)

    const centerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radius / RadixChart.OUTER_CIRCLE_RADIUS_RATIO)
    centerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    centerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(centerCircle)

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

/***/ "./src/points/Point.js":
/*!*****************************!*\
  !*** ./src/points/Point.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Point)
/* harmony export */ });
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");


/**
 * @class
 * @classdesc Represents a planet or point of interest in the chart
 * @public
 */
class Point {

  #name
  #position
  #isRetrograde

  /**
   * @constructs
   * @param {Object} data
   */
  constructor( data ) {
    this.#name = data.name ?? "Unknown"
    this.#position = data.position ?? 0
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
  * Get position
  *
  * @return {Number}
  */
  getPosition(){
    return this.#position
  }

  /**
  * Get symbol
  * @param {Number} xPos
  * @param {Number} yPos
  *
  * @return {SVGElement}
  */
  getSymbol(xPos, yPos){
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()
    const symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(this.#name, xPos, yPos)
    wrapper.appendChild(symbol)
    return wrapper
  }

}




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
/* harmony import */ var _constants_Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/Universe.js */ "./src/settings/constants/Universe.js");
/* harmony import */ var _constants_Radix_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/Radix.js */ "./src/settings/constants/Radix.js");
/* harmony import */ var _constants_Transit_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants/Transit.js */ "./src/settings/constants/Transit.js");
/* harmony import */ var _constants_Colors_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants/Colors.js */ "./src/settings/constants/Colors.js");





const SETTINGS = Object.assign({}, _constants_Universe_js__WEBPACK_IMPORTED_MODULE_0__, _constants_Radix_js__WEBPACK_IMPORTED_MODULE_1__, _constants_Transit_js__WEBPACK_IMPORTED_MODULE_2__, _constants_Colors_js__WEBPACK_IMPORTED_MODULE_3__);




/***/ }),

/***/ "./src/settings/constants/Colors.js":
/*!******************************************!*\
  !*** ./src/settings/constants/Colors.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CHART_BACKGROUND_COLOR": () => (/* binding */ CHART_BACKGROUND_COLOR),
/* harmony export */   "CHART_CIRCLE_COLOR": () => (/* binding */ CHART_CIRCLE_COLOR),
/* harmony export */   "CHART_LINE_COLOR": () => (/* binding */ CHART_LINE_COLOR),
/* harmony export */   "CHART_POINTS_COLOR": () => (/* binding */ CHART_POINTS_COLOR),
/* harmony export */   "CHART_SIGNS_COLOR": () => (/* binding */ CHART_SIGNS_COLOR),
/* harmony export */   "CHART_TEXT_COLOR": () => (/* binding */ CHART_TEXT_COLOR),
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
* Chart background color
* @constant
* @type {String}
* @default #fff
*/
const CHART_BACKGROUND_COLOR = "#fff";

/*
* Default color of circles in charts
* @constant
* @type {String}
* @default #333
*/
const CHART_CIRCLE_COLOR = "#333";

/*
* Default color of lines in charts
* @constant
* @type {String}
* @default #333
*/
const CHART_LINE_COLOR = "#333";

/*
* Default color of text in charts
* @constant
* @type {String}
* @default #333
*/
const CHART_TEXT_COLOR = "#333";

/*
* Default color of signs in charts (arise symbol, taurus symbol, ...)
* @constant
* @type {String}
* @default #000
*/
const CHART_SIGNS_COLOR = "#000";

/*
* Default color of signs in charts (arise symbol, taurus symbol, ...)
* @constant
* @type {String}
* @default #000
*/
const CHART_POINTS_COLOR = "#000";

/*
* Aries color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_ARIES = "#FF4500";

/*
* Taurus color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_TAURUS = "#8B4513";

/*
* Geminy color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_GEMINI= "#87CEEB";

/*
* Cancer color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_CANCER = "#27AE60";

/*
* Leo color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_LEO = "#FF4500";

/*
* Virgo color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_VIRGO = "#8B4513";

/*
* Libra color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_LIBRA = "#87CEEB";

/*
* Scorpio color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_SCORPIO = "#27AE60";

/*
* Sagittarius color
* @constant
* @type {String}
* @default #FF4500
*/
const COLOR_SAGITTARIUS = "#FF4500";

/*
* Capricorn color
* @constant
* @type {String}
* @default #8B4513
*/
const COLOR_CAPRICORN = "#8B4513";

/*
* Aquarius color
* @constant
* @type {String}
* @default #87CEEB
*/
const COLOR_AQUARIUS = "#87CEEB";

/*
* Pisces color
* @constant
* @type {String}
* @default #27AE60
*/
const COLOR_PISCES = "#27AE60";

/*
* Color of circles in charts
* @constant
* @type {String}
* @default #333
*/
const CIRCLE_COLOR = "#333";


/***/ }),

/***/ "./src/settings/constants/Radix.js":
/*!*****************************************!*\
  !*** ./src/settings/constants/Radix.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RADIX_ID": () => (/* binding */ RADIX_ID)
/* harmony export */ });
/*
* Radix chart element ID
* @constant
* @type {String}
* @default radix
*/
const RADIX_ID = "radix"


/***/ }),

/***/ "./src/settings/constants/Transit.js":
/*!*******************************************!*\
  !*** ./src/settings/constants/Transit.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TRANSIT_ID": () => (/* binding */ TRANSIT_ID)
/* harmony export */ });
/*
* Transit chart element ID
* @constant
* @type {String}
* @default transit
*/
const TRANSIT_ID = "transit"


/***/ }),

/***/ "./src/settings/constants/Universe.js":
/*!********************************************!*\
  !*** ./src/settings/constants/Universe.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CHART_MAIN_STROKE": () => (/* binding */ CHART_MAIN_STROKE),
/* harmony export */   "CHART_PADDING": () => (/* binding */ CHART_PADDING),
/* harmony export */   "CHART_POINT_COLLISION_RADIUS": () => (/* binding */ CHART_POINT_COLLISION_RADIUS),
/* harmony export */   "CHART_STROKE": () => (/* binding */ CHART_STROKE),
/* harmony export */   "CHART_STROKE_ONLY": () => (/* binding */ CHART_STROKE_ONLY),
/* harmony export */   "CHART_VIEWBOX_HEIGHT": () => (/* binding */ CHART_VIEWBOX_HEIGHT),
/* harmony export */   "CHART_VIEWBOX_WIDTH": () => (/* binding */ CHART_VIEWBOX_WIDTH)
/* harmony export */ });
/**
* Chart padding
* @constant
* @type {Number}
* @default 10px
*/
const CHART_PADDING = 40

/**
* SVG viewBox width
* @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
* @constant
* @type {Number}
* @default 800
*/
const CHART_VIEWBOX_WIDTH = 800

/**
* SVG viewBox height
* @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
* @constant
* @type {Number}
* @default 800
*/
const CHART_VIEWBOX_HEIGHT = 800

/**
* A point collision radius
* @constant
* @type {Number}
* @default 2
*/
const CHART_POINT_COLLISION_RADIUS = 12

/*
* Line strength
* @constant
* @type {Number}
* @default 1
*/
const CHART_STROKE = 1

/*
* Line strength of the main lines. For instance main axis, main circles
* @constant
* @type {Number}
* @default 1
*/
const CHART_MAIN_STROKE = 2

/**
* No fill, only stroke
* @constant
* @type {boolean}
* @default false
*/
const CHART_STROKE_ONLY = false;


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
    this.#SVGDocument = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGDocument(this.#settings.CHART_VIEWBOX_WIDTH, this.#settings.CHART_VIEWBOX_HEIGHT)
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

  static SYMBOL_ARIES = "Aries";
  static SYMBOL_TAURUS = "Taurus";
  static SYMBOL_GEMINI = "Gemini";
  static SYMBOL_CANCER = "Cancer";
  static SYMBOL_LEO = "Leo";
  static SYMBOL_VIRGO = "Virgo";
  static SYMBOL_LIBRA = "Libra";
  static SYMBOL_SCORPIO = "Scorpio";
  static SYMBOL_SAGITTARIUS = "Sagittarius";
  static SYMBOL_CAPRICORN = "Capricorn";
  static SYMBOL_AQUARIUS = "Aquarius";
  static SYMBOL_PISCES = "Pisces";

  static SYMBOL_CUSP_1 = "1";
  static SYMBOL_CUSP_2 = "2";
  static SYMBOL_CUSP_3 = "3";
  static SYMBOL_CUSP_4 = "4";
  static SYMBOL_CUSP_5 = "5";
  static SYMBOL_CUSP_6 = "6";
  static SYMBOL_CUSP_7 = "7";
  static SYMBOL_CUSP_8 = "8";
  static SYMBOL_CUSP_9 = "9";
  static SYMBOL_CUSP_10 = "10";
  static SYMBOL_CUSP_11 = "11";
  static SYMBOL_CUSP_12 = "12";

  static SYMBOL_AS = "As";
  static SYMBOL_DS = "Ds";
  static SYMBOL_MC = "Mc";
  static SYMBOL_IC = "Ic";

  static SYMBOL_SUN = "Sun";
  static SYMBOL_MOON = "Moon";
  static SYMBOL_MERCURY = "Mercury";
  static SYMBOL_VENUS = "Venus";
  static SYMBOL_MARS = "Mars";
  static SYMBOL_JUPITER = "Jupiter";
  static SYMBOL_SATURN = "Saturn";
  static SYMBOL_URANUS = "Uranus";
  static SYMBOL_NEPTUNE = "Neptune";
  static SYMBOL_PLUTO = "Pluto";
  static SYMBOL_CHIRON = "Chiron";
  static SYMBOL_LILITH = "Lilith";
  static SYMBOL_NNODE = "NNode";

  constructor() {
    if (this instanceof SVGUtils) {
      throw Error('This is a static class and cannot be instantiated.');
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
    svg.setAttribute('xmlns', SVGUtils.SVG_NAMESPACE);
    svg.setAttribute('version', "1.1");
    svg.setAttribute('viewBox', "0 0 " + width + " " + height);
    return svg
  }

  /**
   * Create a SVG group element
   *
   * @static
   * @return {SVGGroupElement}
   */
  static SVGGroup() {
    const g = document.createElementNS(SVGUtils.SVG_NAMESPACE, "g");
    return g
  }

  /**
   * Create a SVG path element
   *
   * @static
   * @return {SVGGroupElement}
   */
  static SVGPath() {
    const path = document.createElementNS(SVGUtils.SVG_NAMESPACE, "path");
    return path
  }

  /**
   * Create a SVG mask element
   *
   * @static
   * @param {String} elementID
   *
   * @return {SVGMaskElement}
   */
  static SVGMask(elementID) {
    const mask = document.createElementNS(SVGUtils.SVG_NAMESPACE, "mask");
    mask.setAttribute("id", elementID)
    return mask
  }

  /**
   * SVG circular sector
   *
   * @static
   * @param {int} x - circle x center position
   * @param {int} y - circle y center position
   * @param {int} radius - circle radius in px
   * @param {int} a1 - angleFrom in radians
   * @param {int} a2 - angleTo in radians
   * @param {int} thickness - from outside to center in px
   *
   * @return {SVGElement} segment
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
  static SVGCircle(cx, cy, radius) {
    const circle = document.createElementNS(SVGUtils.SVG_NAMESPACE, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "none");
    return circle;
  }

  /**
   * SVG line
   *
   * @param {Number} x1
   * @param {Number} y2
   * @param {Number} x2
   * @param {Number} y2
   *
   * @return {SVGElement} line
   */
  static SVGLine(x1, y1, x2, y2) {
    const line = document.createElementNS(SVGUtils.SVG_NAMESPACE, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    return line;
  }

  /**
   * SVG symbol
   *
   * @param {String} name
   * @param {Number} xPos
   * @param {Number} yPos
   *
   * @return {SVGElement}
   */
  static SVGSymbol(name, xPos, yPos) {
    switch (name) {

      case SVGUtils.SYMBOL_AS:
        return asSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_DS:
        return dsSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_MC:
        return mcSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_IC:
        return icSymbol(xPos, yPos)
        break;

      case SVGUtils.SYMBOL_ARIES:
        return ariesSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_TAURUS:
        return taurusSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_GEMINI:
        return geminiSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_CANCER:
        return cancerSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_LEO:
        return leoSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_VIRGO:
        return virgoSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_LIBRA:
        return libraSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SCORPIO:
        return scorpioSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SAGITTARIUS:
        return sagittariusSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_CAPRICORN:
        return capricornSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_AQUARIUS:
        return aquariusSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_PISCES:
        return piscesSymbol(xPos, yPos)
        break;

      default:
        const unknownSymbol = SVGUtils.SVGCircle(xPos, yPos, 8)
        return unknownSymbol
    }

    /*
     * Ascendant symbol
     */
    function asSymbol(xPos, yPos) {
      const X_SHIFT = -4; //px
      const Y_SHIFT = -2; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -0.563078,-1.1261527 -1.689228,-0.5630765 -1.689229,0 -1.68923,0.5630765 -0.563076,1.1261527 0.563076,1.12615272 1.126154,0.56307636 2.815381,0.56307635 1.126152,0.56307647 0.563078,1.1261526 0,0.5630763 -0.563078,1.1261528 -1.689228,0.5630764 -1.689229,0 -1.68923,-0.5630764 -0.563076,-1.1261528 m -6.756916,-10.135374 -4.504611,11.8246032 m 4.504611,-11.8246032 4.504611,11.8246032 m -7.3199925,-3.94153457 5.6307625,0");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Descendant symbol
     */
    function dsSymbol(xPos, yPos) {
      const X_SHIFT = 22; //px
      const Y_SHIFT = -1; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -0.5625,-1.125 -1.6875,-0.5625 -1.6875,0 -1.6875,0.5625 -0.5625,1.125 0.5625,1.125 1.125,0.5625 2.8125,0.5625 1.125,0.5625 0.5625,1.125 0,0.5625 -0.5625,1.125 -1.6875,0.5625 -1.6875,0 -1.6875,-0.5625 -0.5625,-1.125 m -11.25,-10.125 0,11.8125 m 0,-11.8125 3.9375,0 1.6875,0.5625 1.125,1.125 0.5625,1.125 0.5625,1.6875 0,2.8125 -0.5625,1.6875 -0.5625,1.125 -1.125,1.125 -1.6875,0.5625 -3.9375,0");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Medium coeli symbol
     */
    function mcSymbol(xPos, yPos) {
      const X_SHIFT = 9; //px
      const Y_SHIFT = -9; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -1.004085,-1.0040845 -1.004084,-0.5020423 -1.506127,0 -1.004085,0.5020423 -1.004084,1.0040845 -0.502043,1.50612689 0,1.00408458 0.502043,1.50612683 1.004084,1.0040846 1.004085,0.5020423 1.506127,0 1.004084,-0.5020423 1.004085,-1.0040846 m -17.57148,-9.0367612 0,10.5428881 m 0,-10.5428881 4.016338,10.5428881 m 4.016338,-10.5428881 -4.016338,10.5428881 m 4.016338,-10.5428881 0,10.5428881");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Immum coeli symbol
     */
    function icSymbol(xPos, yPos) {
      const X_SHIFT = 8; //px
      const Y_SHIFT = 9; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -1.208852,-1.2088514 -1.208851,-0.6044258 -1.813278,0 -1.208852,0.6044258 -1.20885,1.2088514 -0.604426,1.81327715 0,1.20885135 0.604426,1.8132772 1.20885,1.2088513 1.208852,0.6044259 1.813278,0 1.208851,-0.6044259 1.208852,-1.2088513 m -11.4840902,-10.8796629 0,12.6929401");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Aries symbol
     */
    function ariesSymbol(xPos, yPos) {
      const X_SHIFT = -9; //px
      const Y_SHIFT = -2; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -0.9,-0.9 0,-1.8 0.9,-1.8 1.8,-0.8999998 1.8,0 1.8,0.8999998 0.9,0.9 0.9,1.8 0.9,4.5 m -9,-5.4 1.8,-1.8 1.8,0 1.8,0.9 0.9,0.9 0.9,1.8 0.9,3.6 0,9.9 m 8.1,-12.6 0.9,-0.9 0,-1.8 -0.9,-1.8 -1.8,-0.8999998 -1.8,0 -1.8,0.8999998 -0.9,0.9 -0.9,1.8 -0.9,4.5 m 9,-5.4 -1.8,-1.8 -1.8,0 -1.8,0.9 -0.9,0.9 -0.9,1.8 -0.9,3.6 0,9.9");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Taurus symbol
     */
    function taurusSymbol(xPos, yPos) {
      const X_SHIFT = -9; //px
      const Y_SHIFT = -11; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 1,4 1,2 2,2 3,1 4,0 3,-1 2,-2 1,-2 1,-4 m -18,0 1,3 1,2 2,2 3,1 4,0 3,-1 2,-2 1,-2 1,-3 m -11,8 -2,1 -1,1 -1,2 0,3 1,2 2,2 2,1 2,0 2,-1 2,-2 1,-2 0,-3 -1,-2 -1,-1 -2,-1 m -4,1 -2,1 -1,2 0,3 1,3 m 8,0 1,-3 0,-3 -1,-2 -2,-1");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Gemini symbol
     */
    function geminiSymbol(xPos, yPos) {
      const X_SHIFT = -6; //px
      const Y_SHIFT = -6; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 0,11.546414 m 0.9622011,-10.5842129 0,9.6220117 m 7.6976097,-9.6220117 0,9.6220117 m 0.962201,-10.5842128 0,11.546414 m -13.4708165,-14.4330172 1.9244023,1.924402 1.9244024,0.9622012 2.8866038,0.9622011 3.848804,0 2.886604,-0.9622011 1.924402,-0.9622012 1.924403,-1.924402 m -17.3196215,17.3196207 1.9244023,-1.9244024 1.9244024,-0.9622011 2.8866038,-0.9622012 3.848804,0 2.886604,0.9622012 1.924402,0.9622011 1.924403,1.9244024");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Cancer symbol
     */
    function cancerSymbol(xPos, yPos) {
      const X_SHIFT = 9; //px
      const Y_SHIFT = -9; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -15,0 -2,1 -1,2 0,2 1,2 2,1 2,0 2,-1 1,-2 0,-2 -1,-2 11,0 m -18,3 1,2 1,1 2,1 m 4,-4 -1,-2 -1,-1 -2,-1 m -4,15 15,0 2,-1 1,-2 0,-2 -1,-2 -2,-1 -2,0 -2,1 -1,2 0,2 1,2 -11,0 m 18,-3 -1,-2 -1,-1 -2,-1 m -4,4 1,2 1,1 2,1");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Leo symbol
     */
    function leoSymbol(xPos, yPos) {
      const X_SHIFT = -3; //px
      const Y_SHIFT = 4; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -2,-1 -1,0 -2,1 -1,2 0,1 1,2 2,1 1,0 2,-1 1,-2 0,-1 -1,-2 -5,-5 -1,-2 0,-3 1,-2 2,-1 3,-1 4,0 4,1 2,2 1,2 0,3 -1,3 -3,3 -1,2 0,2 1,2 2,0 1,-1 1,-2 m -13,-5 -2,-3 -1,-2 0,-3 1,-2 1,-1 m 7,-1 3,1 2,2 1,2 0,3 -1,3 -2,3");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Virgo symbol
     */
    function virgoSymbol(xPos, yPos) {
      const X_SHIFT = -9; //px
      const Y_SHIFT = -5; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 2.5894868,-2.5894868 1.7263245,2.5894868 0,9.4947847 m -2.5894868,-11.2211092 1.7263245,2.5894867 0,8.6316225 m 0.8631623,-9.4947847 2.5894867,-2.5894868 1.72632451,2.5894868 0,8.6316224 m -2.58948671,-10.3579469 1.72632447,2.5894867 0,7.7684602 m 0.86316224,-8.6316224 2.58948679,-2.5894868 1.7263244,2.5894868 0,13.8105959 m -2.5894867,-15.5369204 1.7263245,2.5894867 0,12.9474337 m 0.8631622,-13.8105959 2.5894868,-2.5894868 0.8631622,1.7263245 0.8631623,2.5894868 0,2.5894867 -0.8631623,2.58948673 -0.8631622,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -4.3158113,1.7263245 m 7.7684602,-15.5369204 0.8631623,0.8631622 0.8631622,2.5894868 0,2.5894867 -0.8631622,2.58948673 -0.8631623,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -3.452649,1.7263245");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Libra symbol
     */
    function libraSymbol(xPos, yPos) {
      const X_SHIFT = -2; //px
      const Y_SHIFT = -8; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " c 0.7519,1e-5 1.3924,0.12227 1.9316,0.35156 0.6619,0.28495 1.2134,0.63854 1.666,1.0625 0.4838,0.45481 0.853,0.97255 1.1172,1.56641 0.2467,0.56612 0.3711,1.17397 0.3711,1.83789 0,0.64113 -0.1244,1.23948 -0.373,1.80859 -0.1624,0.36305 -0.3631,0.69725 -0.6055,1.00586 l -0.6367,0.8086 4.3789,0 0,0.67187 -5.4024,0 0,-0.91797 c 0.2173,-0.1385 0.4379,-0.27244 0.6367,-0.44726 0.4215,-0.36876 0.7529,-0.82784 0.9883,-1.35547 0.2215,-0.50074 0.334,-1.0358 0.334,-1.58594 0,-0.55653 -0.1122,-1.09434 -0.334,-1.5957 l -0,-0.002 0,-0.004 c -0.2292,-0.49901 -0.5581,-0.94778 -0.9746,-1.33789 l -0,-0.002 -0,-0.002 c -0.3967,-0.36155 -0.8679,-0.65723 -1.4062,-0.88476 l -0,0 c -0.4984,-0.20903 -1.0622,-0.30663 -1.6817,-0.30664 -0.5926,1e-5 -1.1526,0.10008 -1.6699,0.30273 l -0,0 c -0.5261,0.20799 -1.0032,0.5067 -1.4199,0.88867 l -0,0.002 -0,0.002 c -0.4166,0.39011 -0.7454,0.83887 -0.9746,1.33789 l 0,0.004 -0,0.002 c -0.2218,0.50136 -0.334,1.03915 -0.334,1.5957 0,0.55015 0.1125,1.08519 0.334,1.58594 l 0,0.002 0,0.004 c 0.229,0.49855 0.5574,0.94911 0.9746,1.33984 0.1876,0.17482 0.4143,0.31484 0.6367,0.45703 l 0,0.91797 -5.3906,0 0,-0.67187 4.3789,0 -0.6367,-0.8086 c -0.2428,-0.30904 -0.443,-0.64418 -0.6055,-1.00781 -0.2487,-0.56911 -0.3731,-1.16552 -0.3731,-1.80664 0,-0.66391 0.1244,-1.27178 0.3711,-1.83789 l 0,-0.002 c 3e-4,-5.8e-4 -2e-4,-10e-4 0,-0.002 0.2641,-0.59218 0.6326,-1.10871 1.1153,-1.5625 0.4847,-0.45571 1.0332,-0.80585 1.6562,-1.05859 0.5861,-0.23488 1.2294,-0.35546 1.9414,-0.35547 z m -7.8496,13.45899 15.6992,0 0,0.67187 -15.6992,0 z");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Scorpio symbol
     */
    function scorpioSymbol(xPos, yPos) {
      const X_SHIFT = -9; //px
      const Y_SHIFT = -4; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 2.3781101,-2.3781101 2.3781101,2.3781101 0,9.5124404 m -3.1708135,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.7927034,-9.5124404 2.3781101,-2.3781101 2.37811007,2.3781101 0,9.5124404 m -3.17081347,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.79270337,-9.5124404 2.37811013,-2.3781101 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854068 m -4.7562202,-11.8905505 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854067 2.3781101,-2.3781101");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Sagittarius symbol
     */
    function sagittariusSymbol(xPos, yPos) {
      const X_SHIFT = 7; //px
      const Y_SHIFT = -9; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -17.11444,17.11444 m 17.11444,-17.11444 -3.2089575,1.0696525 -6.417915,0 m 7.4875675,1.0696525 -3.2089575,0 -4.27861,-1.0696525 m 9.6268725,-1.0696525 -1.0696525,3.2089575 0,6.41791504 m -1.0696525,-7.48756754 0,3.2089575 1.0696525,4.27861004 m -8.55722,0 -7.4875675,0 m 6.417915,1.06965246 -3.2089575,0 -3.2089575,-1.06965246 m 7.4875675,0 0,7.48756746 m -1.0696525,-6.417915 0,3.2089575 1.0696525,3.2089575");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Capricorn symbol
     */
    function capricornSymbol(xPos, yPos) {
      const X_SHIFT = -9; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 1.8047633,-3.6095267 4.5119084,9.0238168 m -4.5119084,-7.2190534 4.5119084,9.0238167 2.707145,-6.3166717 4.5119084,0 2.707145,-0.9023817 0.9023817,-1.8047633 0,-1.8047634 -0.9023817,-1.8047633 -1.8047634,-0.9023817 -0.9023816,0 -1.8047634,0.9023817 -0.9023817,1.8047633 0,1.8047634 0.9023817,2.707145 0.9023817,1.80476336 0.9023817,2.70714504 0,2.707145 -1.8047634,1.8047633 m 1.8047634,-16.2428701 -0.9023817,0.9023817 -0.9023817,1.8047633 0,1.8047634 1.8047634,3.6095267 0.9023816,2.707145 0,2.707145 -0.9023816,1.8047634 -1.8047634,0.9023816");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Aquarius symbol
     */
    function aquariusSymbol(xPos, yPos) {
      const X_SHIFT = -8; //px
      const Y_SHIFT = -2; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 2.8866035,-2.8866035 3.8488047,1.9244023 m -4.8110059,-0.9622011 3.8488047,1.9244023 2.8866035,-2.8866035 2.8866035,1.9244023 m -3.84880467,-0.9622011 2.88660347,1.9244023 2.8866035,-2.8866035 1.9244024,1.9244023 m -2.8866035,-0.9622011 1.9244023,1.9244023 2.8866035,-2.8866035 m -17.319621,8.6598105 2.8866035,-2.88660348 3.8488047,1.92440238 m -4.8110059,-0.96220121 3.8488047,1.92440231 2.8866035,-2.88660348 2.8866035,1.92440238 m -3.84880467,-0.96220121 2.88660347,1.92440231 2.8866035,-2.88660348 1.9244024,1.92440238 m -2.8866035,-0.96220121 1.9244023,1.92440231 2.8866035,-2.88660348");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Pisces symbol
     */
    function piscesSymbol(xPos, yPos) {
      const X_SHIFT = -8; //px
      const Y_SHIFT = -8; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 4,2 2,2 1,3 0,3 -1,3 -2,2 -4,2 m 0,-17 3,1 2,1 2,2 1,3 m 0,3 -1,3 -2,2 -2,1 -3,1 m 16,-17 -3,1 -2,1 -2,2 -1,3 m 0,3 1,3 2,2 2,1 3,1 m 0,-17 -4,2 -2,2 -1,3 0,3 1,3 2,2 4,2 m -17,-9 18,0 m -18,1 18,0");
      path.setAttribute("fill", "none");
      return path
    }

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
      throw Error('This is a static class and cannot be instantiated.');
    }
  }

  static DEG_360 = 360
  static DEG_180 = 180

  /**
   * Inverted degree to radian
   * @static
   *
   * @param {Number} angleIndegree
   * @param {Number} shiftInDegree
   * @return {Number}
   */
  static degreeToRadian = function(angleInDegree, shiftInDegree = 0) {
    return ((shiftInDegree - angleInDegree) % 360) * Math.PI / 180
  }

  /**
   * Converts radian to degree
   * @static
   *
   * @param {Number} radian
   * @return {Number}
   */
  static radianToDegree = function(radian) {
    return (radian * 180 / Math.PI) % 360
  }

  /**
   * Calculates a position of the point on the circle.
   *
   * @param {Number} cx - center x
   * @param {Number} cy - center y
   * @param {Number} radius - circle radius
   * @param {Number} angleInRadians
   *
   * @return {Object} - {x:Number, y:Number}
   */
  static positionOnCircle(cx, cy, radius, angleInRadians) {
    return {
      x: Math.round(radius * Math.cos(angleInRadians) + cx),
      y: Math.round(radius * Math.sin(angleInRadians) + cy)
    };
  }

  /**
   * Calculates new position of points on circle without overlapping each other
   *
   * @throws {Error} - If there is no place on the circle to place points.
   * @param {Array} points - [{name:"a", position:10}, {name:"b", position:20}]
   * @param {Number} collisionRadius - point radius
   * @param {Number} radius - circle radius
   *
   * @return {Object} - {"Moon":30, "Sun":60, "Mercury":86, ...}
   */
  static calculatePositionWithoutOverlapping(points, collisionRadius, circleRadius) {
    const STEP = 1 //degree
    const _points = points.map(p => {
      return {
        ...p
      }
    })
    _points.sort((a, b) => {
      return a.position - b.position
    })

    const arrangePoints = () => {
      for (let i = 0, ln = _points.length; i < ln; i++) {
        const pointPosition = Utils.positionOnCircle(0, 0, circleRadius, Utils.degreeToRadian(_points[i].position))
        _points[i].x = pointPosition.x
        _points[i].y = pointPosition.y

        for (let j = 0; j < i; j++) {
          const distance = Math.sqrt(Math.pow(_points[i].x - _points[j].x, 2) + Math.pow(_points[i].y - _points[j].y, 2));
          if (distance < 2 * collisionRadius) {
            _points[i].position = (_points[i].position + 1)
            _points[j].position = (_points[j].position - 1) 
            arrangePoints()
          }
        }
      }
    }

    arrangePoints()

    return _points.reduce((accumulator, point, currentIndex) => {
      accumulator[point.name] = point.position
      return accumulator
    }, {})
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7OztBQ3RKUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7QUNOUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hEc0Q7QUFDakI7QUFDSztBQUNJOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSx5Q0FBeUM7O0FBRXpDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDLEVBQUUsb0VBQWUsWUFBWSw4QkFBOEI7QUFDaEcsd0JBQXdCLHNFQUFvQjtBQUM1Qzs7QUFFQSxzQkFBc0IsNkRBQVU7QUFDaEMsd0JBQXdCLCtEQUFZOztBQUVwQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUtDOzs7Ozs7Ozs7Ozs7Ozs7QUMzRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFLQzs7Ozs7Ozs7Ozs7Ozs7O0FDM2REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWMsUUFBUSxHQUFHO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsT0FBTztBQUNyQixhQUFhLE9BQU8sV0FBVyxzQkFBc0IsR0FBRyxzQkFBc0I7QUFDOUUsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWMsUUFBUSxHQUFHO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsMkNBQTJDLFFBQVE7QUFDbkQ7QUFDQTtBQUNBOztBQUVBLHdCQUF3QixPQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVDtBQUNBOztBQUtDOzs7Ozs7O1VDNUdEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNONkM7O0FBRWpCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL0NoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvUmFkaXhDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1RyYW5zaXRDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvcG9pbnRzL1BvaW50LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Db2xvcnMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9SYWRpeC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1RyYW5zaXQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdW5pdmVyc2UvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL1NWR1V0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9VdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYXN0cm9sb2d5XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiBhYnN0cmFjdCBjbGFzcyBmb3IgYWxsIHR5cGUgb2YgQ2hhcnRcbiAqIEBwdWJsaWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBhYnN0cmFjdFxuICovXG5jbGFzcyBDaGFydCB7XG5cbiAgLy8jc2V0dGluZ3NcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgIC8vdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBkYXRhIGlzIHZhbGlkXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIHVuZGVmaW5lZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHtpc1ZhbGlkOmJvb2xlYW4sIG1lc3NhZ2U6U3RyaW5nfVxuICAgKi9cbiAgdmFsaWRhdGVEYXRhKGRhdGEpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc2luZyBwYXJhbSBkYXRhLlwiKVxuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLnBvaW50cykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcInBvaW50cyBpcyBub3QgQXJyYXkuXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5jdXNwcykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcImN1cHMgaXMgbm90IEFycmF5LlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY3VzcHMubGVuZ3RoICE9PSAxMikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwiY3VzcHMubGVuZ3RoICE9PSAxMlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgcG9pbnQgb2YgZGF0YS5wb2ludHMpIHtcbiAgICAgIGlmICh0eXBlb2YgcG9pbnQubmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50Lm5hbWUgIT09ICdzdHJpbmcnXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBvaW50Lm5hbWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lLmxlbmd0aCA9PSAwXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBwb2ludC5wb3NpdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50LnBvc2l0aW9uICE9PSAnbnVtYmVyJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBjdXNwIG9mIGRhdGEuY3VzcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgY3VzcC5wb3NpdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImN1c3AucG9zaXRpb24gIT09ICdudW1iZXInXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgICAgbWVzc2FnZTogXCJcIlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHNldERhdGEoZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnRzKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnQobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0QXNwZWN0cygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGFuaW1hdGVUbyhkYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvLyAjIyBQUk9URUNURUQgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbn1cblxuZXhwb3J0IHtcbiAgQ2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgQ2hhcnQgZnJvbSAnLi9DaGFydC5qcydcbmltcG9ydCBQb2ludCBmcm9tICcuLi9wb2ludHMvUG9pbnQuanMnXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBvaW50cyBhbmQgY3VwcyBhcmUgZGlzcGxheWVkIGluc2lkZSB0aGUgVW5pdmVyc2UuXG4gKiBAcHVibGljXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XG4gKi9cbmNsYXNzIFJhZGl4Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XG5cbiAgLypcbiAgICogSW5uZXIgY2lyY2xlIHJhZGl1cyByYXRpb1xuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgOFxuICAgKi9cbiAgc3RhdGljIElOTkVSX0NJUkNMRV9SQURJVVNfUkFUSU8gPSA4O1xuXG4gIC8qXG4gICAqIE91dGVyIGNpcmNsZSByYWRpdXMgcmF0aW9cbiAgICogQGNvbnN0YW50XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDJcbiAgICovXG4gIHN0YXRpYyBPVVRFUl9DSVJDTEVfUkFESVVTX1JBVElPID0gMjtcblxuXG4gIC8qXG4gICAqIFRoZSBsZW5ndGggb2YgdGhlIHBvaW50ZXJzIGluIHRoZSBydWxlclxuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMTBcbiAgICovXG4gIHN0YXRpYyBSVUxFUl9MRU5HVEggPSAxMFxuXG4gICNzZXR0aW5nc1xuICAjcm9vdFxuXG4gIC8qXG4gICAqIFNoaWZ0IHRoZSBBc2NlbmRhbnQgdG8gdGhlIDAgZGVncmVlIG9uIFRoZSBDaGFydFxuICAgKi9cbiAgI2Fuc2NlbmRhbnRTaGlmdFxuICAjY2VudGVyWFxuICAjY2VudGVyWVxuICAjcmFkaXVzXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7U1ZHRG9jdW1lbnR9IFNWR0RvY3VtZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3IoU1ZHRG9jdW1lbnQsIHNldHRpbmdzKSB7XG5cbiAgICBpZiAoIVNWR0RvY3VtZW50IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gU1ZHRG9jdW1lbnQuJylcbiAgICB9XG5cbiAgICBpZiAoIXNldHRpbmdzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBzZXR0aW5ncy4nKVxuICAgIH1cblxuICAgIHN1cGVyKHNldHRpbmdzKVxuXG4gICAgdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMuI2NlbnRlclggPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxuICAgIHRoaXMuI2NlbnRlclkgPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDJcbiAgICB0aGlzLiNyYWRpdXMgPSBNYXRoLm1pbih0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZKSAtIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BBRERJTkdcbiAgICB0aGlzLiNyb290ID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgIHRoaXMuI3Jvb3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfWApXG4gICAgU1ZHRG9jdW1lbnQuYXBwZW5kQ2hpbGQodGhpcy4jcm9vdCk7XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBjaGFydCBkYXRhXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIG5vdCB2YWxpZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybiB7UmFkaXhDaGFydH1cbiAgICovXG4gIHNldERhdGEoZGF0YSkge1xuICAgIGxldCBzdGF0dXMgPSB0aGlzLnZhbGlkYXRlRGF0YShkYXRhKVxuICAgIGlmICghc3RhdHVzLmlzVmFsaWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihzdGF0dXMubWVzc2FnZXMpXG4gICAgfVxuXG4gICAgdGhpcy4jYW5zY2VuZGFudFNoaWZ0ID0gKGRhdGEuY3VzcHNbMF0ucG9zaXRpb24gKyBVdGlscy5ERUdfMTgwKVxuICAgIHRoaXMuI2RyYXcoZGF0YSlcbiAgfVxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLypcbiAgICogRHJhdyByYWRpeCBjaGFydFxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgI2RyYXcoZGF0YSkge1xuICAgIHRoaXMuI2RyYXdCYWNrZ3JvdW5kKClcbiAgICB0aGlzLiNkcmF3QXN0cm9sb2dpY2FsU2lnbnMoKVxuICAgIHRoaXMuI2RyYXdSdWxlcigpXG4gICAgdGhpcy4jZHJhd01haW5BeGlzKFt7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9BUyxcbiAgICAgICAgcG9zaXRpb246IGRhdGEuY3VzcHNbMF0ucG9zaXRpb25cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9JQyxcbiAgICAgICAgcG9zaXRpb246IGRhdGEuY3VzcHNbM10ucG9zaXRpb25cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9EUyxcbiAgICAgICAgcG9zaXRpb246IGRhdGEuY3VzcHNbNl0ucG9zaXRpb25cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9NQyxcbiAgICAgICAgcG9zaXRpb246IGRhdGEuY3VzcHNbOV0ucG9zaXRpb25cbiAgICAgIH0sXG4gICAgXSlcbiAgICB0aGlzLiNkcmF3UG9pbnRzKGRhdGEucG9pbnRzKVxuICAgIHRoaXMuI2RyYXdCb3JkZXJzKClcbiAgfVxuXG4gICNkcmF3QmFja2dyb3VuZCgpIHtcbiAgICBjb25zdCBNQVNLX0lEID0gYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfS1iYWNrZ3JvdW5kLW1hc2stMWBcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCBtYXNrID0gU1ZHVXRpbHMuU1ZHTWFzayhNQVNLX0lEKVxuICAgIGNvbnN0IG91dGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cylcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBcIndoaXRlXCIpXG4gICAgbWFzay5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuT1VURVJfQ0lSQ0xFX1JBRElVU19SQVRJTylcbiAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBcImJsYWNrXCIpXG4gICAgbWFzay5hcHBlbmRDaGlsZChpbm5lckNpcmNsZSlcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG1hc2spXG5cbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzKVxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiB0aGlzLiNzZXR0aW5ncy5DSEFSVF9CQUNLR1JPVU5EX0NPTE9SKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwibWFza1wiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogYHVybCgjJHtNQVNLX0lEfSlgKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSlcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNkcmF3QXN0cm9sb2dpY2FsU2lnbnMoKSB7XG4gICAgY29uc3QgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUyA9IDEyXG4gICAgY29uc3QgU1RFUCA9IDMwIC8vZGVncmVlXG4gICAgY29uc3QgQ09MT1JTX1NJR05TID0gW3RoaXMuI3NldHRpbmdzLkNPTE9SX0FSSUVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9UQVVSVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0dFTUlOSSwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FOQ0VSLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9MRU8sIHRoaXMuI3NldHRpbmdzLkNPTE9SX1ZJUkdPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9MSUJSQSwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfU0NPUlBJTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfU0FHSVRUQVJJVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0NBUFJJQ09STiwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVFVQVJJVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1BJU0NFU11cbiAgICBjb25zdCBTWU1CT0xfU0lHTlMgPSBbU1ZHVXRpbHMuU1lNQk9MX0FSSUVTLCBTVkdVdGlscy5TWU1CT0xfVEFVUlVTLCBTVkdVdGlscy5TWU1CT0xfR0VNSU5JLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSLCBTVkdVdGlscy5TWU1CT0xfTEVPLCBTVkdVdGlscy5TWU1CT0xfVklSR08sIFNWR1V0aWxzLlNZTUJPTF9MSUJSQSwgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU8sIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUywgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STiwgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTLCBTVkdVdGlscy5TWU1CT0xfUElTQ0VTXVxuXG4gICAgY29uc3QgbWFrZVN5bWJvbCA9IChzeW1ib2xJbmRleCwgYW5nbGVJbkRlZ3JlZSkgPT4ge1xuICAgICAgbGV0IHBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMgLSAodGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPKSAvIDIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlSW5EZWdyZWUgKyBTVEVQIC8gMiwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGxldCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSwgOClcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU0lHTlNfQ09MT1IpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgcmV0dXJuIHN5bWJvbFxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VTZWdtZW50ID0gKHN5bWJvbEluZGV4LCBhbmdsZUZyb21JbkRlZ3JlZSwgYW5nbGVUb0luRGVncmVlKSA9PiB7XG4gICAgICBsZXQgYTEgPSBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZUZyb21JbkRlZ3JlZSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KVxuICAgICAgbGV0IGEyID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVUb0luRGVncmVlLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpXG4gICAgICBsZXQgc2VnbWVudCA9IFNWR1V0aWxzLlNWR1NlZ21lbnQodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzLCBhMSwgYTIsIHRoaXMuI3JhZGl1cyAtIHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTyk7XG4gICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IENPTE9SU19TSUdOU1tzeW1ib2xJbmRleF0pO1xuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyB0aGlzLiNzZXR0aW5ncy5DSVJDTEVfQ09MT1IgOiBcIm5vbmVcIik7XG4gICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSA6IDApO1xuICAgICAgcmV0dXJuIHNlZ21lbnRcbiAgICB9XG5cbiAgICBsZXQgc3RhcnRBbmdsZSA9IDBcbiAgICBsZXQgZW5kQW5nbGUgPSBzdGFydEFuZ2xlICsgU1RFUFxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUzsgaSsrKSB7XG5cbiAgICAgIGxldCBzZWdtZW50ID0gbWFrZVNlZ21lbnQoaSwgc3RhcnRBbmdsZSwgZW5kQW5nbGUpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHNlZ21lbnQpO1xuXG4gICAgICBsZXQgc3ltYm9sID0gbWFrZVN5bWJvbChpLCBzdGFydEFuZ2xlKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xuXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVA7XG4gICAgICBlbmRBbmdsZSA9IHN0YXJ0QW5nbGUgKyBTVEVQXG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2RyYXdSdWxlcigpIHtcbiAgICBjb25zdCBOVU1CRVJfT0ZfRElWSURFUlMgPSA3MlxuICAgIGNvbnN0IFNURVAgPSA1XG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgcnVsZXJSYWRpdXMgPSAodGhpcy4jcmFkaXVzIC0gKHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTyArIFJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RIKSk7XG5cbiAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuI2Fuc2NlbmRhbnRTaGlmdFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0RJVklERVJTOyBpKyspIHtcbiAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCBydWxlclJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXG5cbiAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcnVsZXJSYWRpdXMgKyBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSCAvIChpICUgMiArIDEpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcblxuICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgc3RhcnRBbmdsZSArPSBTVEVQXG4gICAgfVxuXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJ1bGVyUmFkaXVzKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgbWFpbiBheGlzXG4gICAqIEBwYXJhbSB7QXJyYXl9IGF4aXNMaXN0XG4gICAqL1xuICAjZHJhd01haW5BeGlzKGF4aXNMaXN0KSB7XG4gICAgY29uc3QgQVhJU19MRU5HVEggPSAxMFxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGZvciAoY29uc3QgYXhpcyBvZiBheGlzTGlzdCkge1xuICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5wb3NpdGlvbiwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzICsgQVhJU19MRU5HVEgsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMucG9zaXRpb24sIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBsZXQgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xuXG4gICAgICBsZXQgdGV4dFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMgKyBBWElTX0xFTkdUSCwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5wb3NpdGlvbiwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGxldCBwYXRoID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LngsIHRleHRQb2ludC55LCB7XG4gICAgICAgIC4uLnRoaXMuI3NldHRpbmdzXG4gICAgICB9KVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVEVYVF9DT0xPUik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpO1xuXG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBwb2ludHNcbiAgICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIC0gW3tcIm5hbWVcIjpTdHJpbmcsIFwicG9zaXRpb25cIjpOdW1iZXJ9XVxuICAgKi9cbiAgI2RyYXdQb2ludHMocG9pbnRzKSB7ICAgIFxuICAgIGNvbnN0IFRPRE8gPSA0MFxuICAgIGNvbnN0IFBPSU5UX1JBRElVUyA9IHRoaXMuI3JhZGl1cyAtICh0aGlzLiNyYWRpdXMgLyBSYWRpeENoYXJ0LklOTkVSX0NJUkNMRV9SQURJVVNfUkFUSU8gKyBUT0RPKVxuICAgIGNvbnN0IGlubmVyQ2lyY2xlUmFkaXVzID0gdGhpcy4jcmFkaXVzIC0gdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICBjb25zdCBwb3NpdGlvbnMgPSBVdGlscy5jYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UX0NPTExJU0lPTl9SQURJVVMsIFBPSU5UX1JBRElVUylcbiAgICBmb3IgKGNvbnN0IHBvaW50RGF0YSBvZiBwb2ludHMpIHtcbiAgICAgIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KHBvaW50RGF0YSlcbiAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIGlubmVyQ2lyY2xlUmFkaXVzIC0gMS41ICogUmFkaXhDaGFydC5SVUxFUl9MRU5HVEgsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldFBvc2l0aW9uKCksIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgUE9JTlRfUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcblxuICAgICAgLy8gcnVsZXIgbWFya1xuICAgICAgY29uc3QgcnVsZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI3JhZGl1cyAtICh0aGlzLiNyYWRpdXMgLyBSYWRpeENoYXJ0LklOTkVSX0NJUkNMRV9SQURJVVNfUkFUSU8gKyBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldFBvc2l0aW9uKCksIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBjb25zdCBydWxlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCBydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55KVxuICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocnVsZXJMaW5lKTtcblxuICAgICAgLy8gc3ltYm9sXG4gICAgICBjb25zdCBzeW1ib2wgPSBwb2ludC5nZXRTeW1ib2woc3ltYm9sUG9zaXRpb24ueCwgc3ltYm9sUG9zaXRpb24ueSlcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUE9JTlRTX0NPTE9SKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgLy8gcG9pbnRlclxuICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgUE9JTlRfUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGNvbnN0IHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54LCBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpXG4gICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIC8gMik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBvaW50ZXJMaW5lKTtcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd0JvcmRlcnMoKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cyAtIHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTylcbiAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXG5cbiAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMpXG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgY29uc3QgY2VudGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuT1VURVJfQ0lSQ0xFX1JBRElVU19SQVRJTylcbiAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgY2VudGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjZW50ZXJDaXJjbGUpXG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxufVxuXG5leHBvcnQge1xuICBSYWRpeENoYXJ0IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgQ2hhcnQgZnJvbSAnLi9DaGFydC5qcydcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUG9pbnRzIGFuZCBjdXBzIGFyZSBkaXNwbGF5ZWQgZnJvbSBvdXRzaWRlIHRoZSBVbml2ZXJzZS5cbiAqIEBwdWJsaWNcbiAqIEBleHRlbmRzIHtDaGFydH1cbiAqL1xuY2xhc3MgVHJhbnNpdENoYXJ0IGV4dGVuZHMgQ2hhcnQge1xuXG4gICNzZXR0aW5nc1xuICAjcm9vdFxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1NWR0RvY3VtZW50fSBTVkdEb2N1bWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKFNWR0RvY3VtZW50LCBzZXR0aW5ncykge1xuXG4gICAgaWYgKCFTVkdEb2N1bWVudCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIFNWR0RvY3VtZW50LicpXG4gICAgfVxuXG4gICAgaWYgKCFzZXR0aW5ncykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gc2V0dGluZ3MuJylcbiAgICB9XG5cbiAgICBzdXBlcihzZXR0aW5ncylcblxuXG4gICAgdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMuI3Jvb3QgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgdGhpcy4jcm9vdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9JRH1gKVxuICAgIFNWR0RvY3VtZW50LmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuICB9XG5cbiAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxufVxuXG5leHBvcnQge1xuICBUcmFuc2l0Q2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUmVwcmVzZW50cyBhIHBsYW5ldCBvciBwb2ludCBvZiBpbnRlcmVzdCBpbiB0aGUgY2hhcnRcbiAqIEBwdWJsaWNcbiAqL1xuY2xhc3MgUG9pbnQge1xuXG4gICNuYW1lXG4gICNwb3NpdGlvblxuICAjaXNSZXRyb2dyYWRlXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBjb25zdHJ1Y3RvciggZGF0YSApIHtcbiAgICB0aGlzLiNuYW1lID0gZGF0YS5uYW1lID8/IFwiVW5rbm93blwiXG4gICAgdGhpcy4jcG9zaXRpb24gPSBkYXRhLnBvc2l0aW9uID8/IDBcbiAgICB0aGlzLiNpc1JldHJvZ3JhZGUgPSBkYXRhLmlzUmV0cm9ncmFkZSA/PyBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICogR2V0IG5hbWVcbiAgKlxuICAqIEByZXR1cm4ge1N0cmluZ31cbiAgKi9cbiAgZ2V0TmFtZSgpe1xuICAgIHJldHVybiB0aGlzLiNuYW1lXG4gIH1cblxuICAvKipcbiAgKiBJcyByZXRyb2dyYWRlXG4gICpcbiAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAqL1xuICBpc1JldHJvZ3JhZGUoKXtcbiAgICByZXR1cm4gdGhpcy4jaXNSZXRyb2dyYWRlXG4gIH1cblxuICAvKipcbiAgKiBHZXQgcG9zaXRpb25cbiAgKlxuICAqIEByZXR1cm4ge051bWJlcn1cbiAgKi9cbiAgZ2V0UG9zaXRpb24oKXtcbiAgICByZXR1cm4gdGhpcy4jcG9zaXRpb25cbiAgfVxuXG4gIC8qKlxuICAqIEdldCBzeW1ib2xcbiAgKiBAcGFyYW0ge051bWJlcn0geFBvc1xuICAqIEBwYXJhbSB7TnVtYmVyfSB5UG9zXG4gICpcbiAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxuICAqL1xuICBnZXRTeW1ib2woeFBvcywgeVBvcyl7XG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICBjb25zdCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2wodGhpcy4jbmFtZSwgeFBvcywgeVBvcylcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbClcbiAgICByZXR1cm4gd3JhcHBlclxuICB9XG5cbn1cblxuZXhwb3J0IHtcbiAgUG9pbnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0ICogYXMgVW5pdmVyc2UgZnJvbSBcIi4vY29uc3RhbnRzL1VuaXZlcnNlLmpzXCJcbmltcG9ydCAqIGFzIFJhZGl4IGZyb20gXCIuL2NvbnN0YW50cy9SYWRpeC5qc1wiXG5pbXBvcnQgKiBhcyBUcmFuc2l0IGZyb20gXCIuL2NvbnN0YW50cy9UcmFuc2l0LmpzXCJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tIFwiLi9jb25zdGFudHMvQ29sb3JzLmpzXCJcblxuY29uc3QgU0VUVElOR1MgPSBPYmplY3QuYXNzaWduKHt9LCBVbml2ZXJzZSwgUmFkaXgsIFRyYW5zaXQsIENvbG9ycyk7XG5cbmV4cG9ydCB7XG4gIFNFVFRJTkdTIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuKiBDaGFydCBiYWNrZ3JvdW5kIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjZmZmXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0JBQ0tHUk9VTkRfQ09MT1IgPSBcIiNmZmZcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBjaXJjbGVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9DSVJDTEVfQ09MT1IgPSBcIiMzMzNcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBsaW5lcyBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfTElORV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHRleHQgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1RFWFRfQ09MT1IgPSBcIiMzMzNcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBzaWducyBpbiBjaGFydHMgKGFyaXNlIHN5bWJvbCwgdGF1cnVzIHN5bWJvbCwgLi4uKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TSUdOU19DT0xPUiA9IFwiIzAwMFwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHNpZ25zIGluIGNoYXJ0cyAoYXJpc2Ugc3ltYm9sLCB0YXVydXMgc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BPSU5UU19DT0xPUiA9IFwiIzAwMFwiO1xuXG4vKlxuKiBBcmllcyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUklFUyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBUYXVydXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4QjQ1MTNcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfVEFVUlVTID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIEdlbWlueSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9HRU1JTkk9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBDYW5jZXIgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQ0FOQ0VSID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIExlbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9MRU8gPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogVmlyZ28gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4QjQ1MTNcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfVklSR08gPSBcIiM4QjQ1MTNcIjtcblxuLypcbiogTGlicmEgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4N0NFRUJcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfTElCUkEgPSBcIiM4N0NFRUJcIjtcblxuLypcbiogU2NvcnBpbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9TQ09SUElPID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIFNhZ2l0dGFyaXVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1NBR0lUVEFSSVVTID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIENhcHJpY29ybiBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9DQVBSSUNPUk4gPSBcIiM4QjQ1MTNcIjtcblxuLypcbiogQXF1YXJpdXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4N0NFRUJcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQVFVQVJJVVMgPSBcIiM4N0NFRUJcIjtcblxuLypcbiogUGlzY2VzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1BJU0NFUyA9IFwiIzI3QUU2MFwiO1xuXG4vKlxuKiBDb2xvciBvZiBjaXJjbGVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSVJDTEVfQ09MT1IgPSBcIiMzMzNcIjtcbiIsIi8qXG4qIFJhZGl4IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHJhZGl4XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX0lEID0gXCJyYWRpeFwiXG4iLCIvKlxuKiBUcmFuc2l0IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHRyYW5zaXRcbiovXG5leHBvcnQgY29uc3QgVFJBTlNJVF9JRCA9IFwidHJhbnNpdFwiXG4iLCIvKipcbiogQ2hhcnQgcGFkZGluZ1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMTBweFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QQURESU5HID0gNDBcblxuLyoqXG4qIFNWRyB2aWV3Qm94IHdpZHRoXG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9XSURUSCA9IDgwMFxuXG4vKipcbiogU1ZHIHZpZXdCb3ggaGVpZ2h0XG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9IRUlHSFQgPSA4MDBcblxuLyoqXG4qIEEgcG9pbnQgY29sbGlzaW9uIHJhZGl1c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMlxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QT0lOVF9DT0xMSVNJT05fUkFESVVTID0gMTJcblxuLypcbiogTGluZSBzdHJlbmd0aFxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0UgPSAxXG5cbi8qXG4qIExpbmUgc3RyZW5ndGggb2YgdGhlIG1haW4gbGluZXMuIEZvciBpbnN0YW5jZSBtYWluIGF4aXMsIG1haW4gY2lyY2xlc1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9NQUlOX1NUUk9LRSA9IDJcblxuLyoqXG4qIE5vIGZpbGwsIG9ubHkgc3Ryb2tlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7Ym9vbGVhbn1cbiogQGRlZmF1bHQgZmFsc2VcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfU1RST0tFX09OTFkgPSBmYWxzZTtcbiIsImltcG9ydCBEZWZhdWx0U2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzJztcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XG5pbXBvcnQgVHJhbnNpdENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiB3cmFwcGVyIGZvciBhbGwgcGFydHMgb2YgZ3JhcGguXG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFVuaXZlcnNlIHtcblxuICAjU1ZHRG9jdW1lbnRcbiAgI3NldHRpbmdzXG4gICNyYWRpeFxuICAjdHJhbnNpdFxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbEVsZW1lbnRJRCAtIElEIG9mIHRoZSByb290IGVsZW1lbnQgd2l0aG91dCB0aGUgIyBzaWduXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBBbiBvYmplY3QgdGhhdCBvdmVycmlkZXMgdGhlIGRlZmF1bHQgc2V0dGluZ3MgdmFsdWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihodG1sRWxlbWVudElELCBvcHRpb25zID0ge30pIHtcblxuICAgIGlmICh0eXBlb2YgaHRtbEVsZW1lbnRJRCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSByZXF1aXJlZCBwYXJhbWV0ZXIgaXMgbWlzc2luZy4nKVxuICAgIH1cblxuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEVsZW1lbnRJRCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fub3QgZmluZCBhIEhUTUwgZWxlbWVudCB3aXRoIElEICcgKyBodG1sRWxlbWVudElEKVxuICAgIH1cblxuICAgIHRoaXMuI3NldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdFNldHRpbmdzLCBvcHRpb25zLCB7SFRNTF9FTEVNRU5UX0lEOmh0bWxFbGVtZW50SUR9KTtcbiAgICB0aGlzLiNTVkdEb2N1bWVudCA9IFNWR1V0aWxzLlNWR0RvY3VtZW50KHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEgsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpLmFwcGVuZENoaWxkKHRoaXMuI1NWR0RvY3VtZW50KTtcblxuICAgIHRoaXMuI3JhZGl4ID0gbmV3IFJhZGl4Q2hhcnQodGhpcy4jU1ZHRG9jdW1lbnQsIHRoaXMuI3NldHRpbmdzKVxuICAgIHRoaXMuI3RyYW5zaXQgPSBuZXcgVHJhbnNpdENoYXJ0KHRoaXMuI1NWR0RvY3VtZW50LCB0aGlzLiNzZXR0aW5ncylcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyAjIyBQVUJMSUMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLyoqXG4gICAqIEdldCBSYWRpeCBjaGFydFxuICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxuICAgKi9cbiAgcmFkaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JhZGl4XG4gIH1cblxuICAvKipcbiAgICogR2V0IFRyYW5zaXQgY2hhcnRcbiAgICogQHJldHVybiB7VHJhbnNpdENoYXJ0fVxuICAgKi9cbiAgdHJhbnNpdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHJhbnNpdFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHNldHRpbmdzXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldFNldHRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLiNzZXR0aW5nc1xuICB9XG5cbiAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxufVxuXG5leHBvcnQge1xuICBVbml2ZXJzZSBhc1xuICBkZWZhdWx0XG59XG4iLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBTVkcgdXRpbGl0eSBjbGFzc1xuICogQHB1YmxpY1xuICogQHN0YXRpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBTVkdVdGlscyB7XG5cbiAgc3RhdGljIFNWR19OQU1FU1BBQ0UgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcblxuICBzdGF0aWMgU1lNQk9MX0FSSUVTID0gXCJBcmllc1wiO1xuICBzdGF0aWMgU1lNQk9MX1RBVVJVUyA9IFwiVGF1cnVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfR0VNSU5JID0gXCJHZW1pbmlcIjtcbiAgc3RhdGljIFNZTUJPTF9DQU5DRVIgPSBcIkNhbmNlclwiO1xuICBzdGF0aWMgU1lNQk9MX0xFTyA9IFwiTGVvXCI7XG4gIHN0YXRpYyBTWU1CT0xfVklSR08gPSBcIlZpcmdvXCI7XG4gIHN0YXRpYyBTWU1CT0xfTElCUkEgPSBcIkxpYnJhXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0NPUlBJTyA9IFwiU2NvcnBpb1wiO1xuICBzdGF0aWMgU1lNQk9MX1NBR0lUVEFSSVVTID0gXCJTYWdpdHRhcml1c1wiO1xuICBzdGF0aWMgU1lNQk9MX0NBUFJJQ09STiA9IFwiQ2Fwcmljb3JuXCI7XG4gIHN0YXRpYyBTWU1CT0xfQVFVQVJJVVMgPSBcIkFxdWFyaXVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfUElTQ0VTID0gXCJQaXNjZXNcIjtcblxuICBzdGF0aWMgU1lNQk9MX0NVU1BfMSA9IFwiMVwiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfMiA9IFwiMlwiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfMyA9IFwiM1wiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfNCA9IFwiNFwiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfNSA9IFwiNVwiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfNiA9IFwiNlwiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfNyA9IFwiN1wiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfOCA9IFwiOFwiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfOSA9IFwiOVwiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfMTAgPSBcIjEwXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF8xMSA9IFwiMTFcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzEyID0gXCIxMlwiO1xuXG4gIHN0YXRpYyBTWU1CT0xfQVMgPSBcIkFzXCI7XG4gIHN0YXRpYyBTWU1CT0xfRFMgPSBcIkRzXCI7XG4gIHN0YXRpYyBTWU1CT0xfTUMgPSBcIk1jXCI7XG4gIHN0YXRpYyBTWU1CT0xfSUMgPSBcIkljXCI7XG5cbiAgc3RhdGljIFNZTUJPTF9TVU4gPSBcIlN1blwiO1xuICBzdGF0aWMgU1lNQk9MX01PT04gPSBcIk1vb25cIjtcbiAgc3RhdGljIFNZTUJPTF9NRVJDVVJZID0gXCJNZXJjdXJ5XCI7XG4gIHN0YXRpYyBTWU1CT0xfVkVOVVMgPSBcIlZlbnVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfTUFSUyA9IFwiTWFyc1wiO1xuICBzdGF0aWMgU1lNQk9MX0pVUElURVIgPSBcIkp1cGl0ZXJcIjtcbiAgc3RhdGljIFNZTUJPTF9TQVRVUk4gPSBcIlNhdHVyblwiO1xuICBzdGF0aWMgU1lNQk9MX1VSQU5VUyA9IFwiVXJhbnVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfTkVQVFVORSA9IFwiTmVwdHVuZVwiO1xuICBzdGF0aWMgU1lNQk9MX1BMVVRPID0gXCJQbHV0b1wiO1xuICBzdGF0aWMgU1lNQk9MX0NISVJPTiA9IFwiQ2hpcm9uXCI7XG4gIHN0YXRpYyBTWU1CT0xfTElMSVRIID0gXCJMaWxpdGhcIjtcbiAgc3RhdGljIFNZTUJPTF9OTk9ERSA9IFwiTk5vZGVcIjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFNWR1V0aWxzKSB7XG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIGRvY3VtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRG9jdW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHRG9jdW1lbnQod2lkdGgsIGhlaWdodCkge1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInN2Z1wiKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd4bWxucycsIFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZlcnNpb24nLCBcIjEuMVwiKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgXCIwIDAgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KTtcbiAgICByZXR1cm4gc3ZnXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIGdyb3VwIGVsZW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHR3JvdXAoKSB7XG4gICAgY29uc3QgZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImdcIik7XG4gICAgcmV0dXJuIGdcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgcGF0aCBlbGVtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR1BhdGgoKSB7XG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XG4gICAgcmV0dXJuIHBhdGhcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgbWFzayBlbGVtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnRJRFxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdNYXNrRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdNYXNrKGVsZW1lbnRJRCkge1xuICAgIGNvbnN0IG1hc2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJtYXNrXCIpO1xuICAgIG1hc2suc2V0QXR0cmlidXRlKFwiaWRcIiwgZWxlbWVudElEKVxuICAgIHJldHVybiBtYXNrXG4gIH1cblxuICAvKipcbiAgICogU1ZHIGNpcmN1bGFyIHNlY3RvclxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7aW50fSB4IC0gY2lyY2xlIHggY2VudGVyIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7aW50fSB5IC0gY2lyY2xlIHkgY2VudGVyIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7aW50fSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzIGluIHB4XG4gICAqIEBwYXJhbSB7aW50fSBhMSAtIGFuZ2xlRnJvbSBpbiByYWRpYW5zXG4gICAqIEBwYXJhbSB7aW50fSBhMiAtIGFuZ2xlVG8gaW4gcmFkaWFuc1xuICAgKiBAcGFyYW0ge2ludH0gdGhpY2tuZXNzIC0gZnJvbSBvdXRzaWRlIHRvIGNlbnRlciBpbiBweFxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBzZWdtZW50XG4gICAqL1xuICBzdGF0aWMgU1ZHU2VnbWVudCh4LCB5LCByYWRpdXMsIGExLCBhMiwgdGhpY2tuZXNzLCBsRmxhZywgc0ZsYWcpIHtcbiAgICAvLyBAc2VlIFNWRyBQYXRoIGFyYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL1NWRy9wYXRocy5odG1sI1BhdGhEYXRhXG4gICAgY29uc3QgTEFSR0VfQVJDX0ZMQUcgPSBsRmxhZyB8fCAwO1xuICAgIGNvbnN0IFNXRUVUX0ZMQUcgPSBzRmxhZyB8fCAwO1xuXG4gICAgY29uc3Qgc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XG4gICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTSBcIiArICh4ICsgdGhpY2tuZXNzICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICh5ICsgdGhpY2tuZXNzICogTWF0aC5zaW4oYTEpKSArIFwiIGwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogTWF0aC5zaW4oYTEpKSArIFwiIEEgXCIgKyByYWRpdXMgKyBcIiwgXCIgKyByYWRpdXMgKyBcIiwwICxcIiArIExBUkdFX0FSQ19GTEFHICsgXCIsIFwiICsgU1dFRVRfRkxBRyArIFwiLCBcIiArICh4ICsgcmFkaXVzICogTWF0aC5jb3MoYTIpKSArIFwiLCBcIiArICh5ICsgcmFkaXVzICogTWF0aC5zaW4oYTIpKSArIFwiIGwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiAtTWF0aC5jb3MoYTIpKSArIFwiLCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIC1NYXRoLnNpbihhMikpICsgXCIgQSBcIiArIHRoaWNrbmVzcyArIFwiLCBcIiArIHRoaWNrbmVzcyArIFwiLDAgLFwiICsgTEFSR0VfQVJDX0ZMQUcgKyBcIiwgXCIgKyAxICsgXCIsIFwiICsgKHggKyB0aGlja25lc3MgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKHkgKyB0aGlja25lc3MgKiBNYXRoLnNpbihhMSkpKTtcbiAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgIHJldHVybiBzZWdtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyBjaXJjbGVcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2ludH0gY3hcbiAgICogQHBhcmFtIHtpbnR9IGN5XG4gICAqIEBwYXJhbSB7aW50fSByYWRpdXNcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gY2lyY2xlXG4gICAqL1xuICBzdGF0aWMgU1ZHQ2lyY2xlKGN4LCBjeSwgcmFkaXVzKSB7XG4gICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiY2lyY2xlXCIpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBjeCk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN5XCIsIGN5KTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiclwiLCByYWRpdXMpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICByZXR1cm4gY2lyY2xlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyBsaW5lXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MVxuICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MlxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBsaW5lXG4gICAqL1xuICBzdGF0aWMgU1ZHTGluZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJsaW5lXCIpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDFcIiwgeDEpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTFcIiwgeTEpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDJcIiwgeDIpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTJcIiwgeTIpO1xuICAgIHJldHVybiBsaW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyBzeW1ib2xcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHlQb3NcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdTeW1ib2wobmFtZSwgeFBvcywgeVBvcykge1xuICAgIHN3aXRjaCAobmFtZSkge1xuXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUzpcbiAgICAgICAgcmV0dXJuIGFzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfRFM6XG4gICAgICAgIHJldHVybiBkc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01DOlxuICAgICAgICByZXR1cm4gbWNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9JQzpcbiAgICAgICAgcmV0dXJuIGljU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUklFUzpcbiAgICAgICAgcmV0dXJuIGFyaWVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVEFVUlVTOlxuICAgICAgICByZXR1cm4gdGF1cnVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfR0VNSU5JOlxuICAgICAgICByZXR1cm4gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSOlxuICAgICAgICByZXR1cm4gY2FuY2VyU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTEVPOlxuICAgICAgICByZXR1cm4gbGVvU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVklSR086XG4gICAgICAgIHJldHVybiB2aXJnb1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBOlxuICAgICAgICByZXR1cm4gbGlicmFTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPOlxuICAgICAgICByZXR1cm4gc2NvcnBpb1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTOlxuICAgICAgICByZXR1cm4gc2FnaXR0YXJpdXNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk46XG4gICAgICAgIHJldHVybiBjYXByaWNvcm5TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVUzpcbiAgICAgICAgcmV0dXJuIGFxdWFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUElTQ0VTOlxuICAgICAgICByZXR1cm4gcGlzY2VzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zdCB1bmtub3duU3ltYm9sID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHhQb3MsIHlQb3MsIDgpXG4gICAgICAgIHJldHVybiB1bmtub3duU3ltYm9sXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBc2NlbmRhbnQgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC00OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTI7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMC41NjMwNzgsLTEuMTI2MTUyNyAtMS42ODkyMjgsLTAuNTYzMDc2NSAtMS42ODkyMjksMCAtMS42ODkyMywwLjU2MzA3NjUgLTAuNTYzMDc2LDEuMTI2MTUyNyAwLjU2MzA3NiwxLjEyNjE1MjcyIDEuMTI2MTU0LDAuNTYzMDc2MzYgMi44MTUzODEsMC41NjMwNzYzNSAxLjEyNjE1MiwwLjU2MzA3NjQ3IDAuNTYzMDc4LDEuMTI2MTUyNiAwLDAuNTYzMDc2MyAtMC41NjMwNzgsMS4xMjYxNTI4IC0xLjY4OTIyOCwwLjU2MzA3NjQgLTEuNjg5MjI5LDAgLTEuNjg5MjMsLTAuNTYzMDc2NCAtMC41NjMwNzYsLTEuMTI2MTUyOCBtIC02Ljc1NjkxNiwtMTAuMTM1Mzc0IC00LjUwNDYxMSwxMS44MjQ2MDMyIG0gNC41MDQ2MTEsLTExLjgyNDYwMzIgNC41MDQ2MTEsMTEuODI0NjAzMiBtIC03LjMxOTk5MjUsLTMuOTQxNTM0NTcgNS42MzA3NjI1LDBcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIERlc2NlbmRhbnQgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gZHNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDIyOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTE7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMC41NjI1LC0xLjEyNSAtMS42ODc1LC0wLjU2MjUgLTEuNjg3NSwwIC0xLjY4NzUsMC41NjI1IC0wLjU2MjUsMS4xMjUgMC41NjI1LDEuMTI1IDEuMTI1LDAuNTYyNSAyLjgxMjUsMC41NjI1IDEuMTI1LDAuNTYyNSAwLjU2MjUsMS4xMjUgMCwwLjU2MjUgLTAuNTYyNSwxLjEyNSAtMS42ODc1LDAuNTYyNSAtMS42ODc1LDAgLTEuNjg3NSwtMC41NjI1IC0wLjU2MjUsLTEuMTI1IG0gLTExLjI1LC0xMC4xMjUgMCwxMS44MTI1IG0gMCwtMTEuODEyNSAzLjkzNzUsMCAxLjY4NzUsMC41NjI1IDEuMTI1LDEuMTI1IDAuNTYyNSwxLjEyNSAwLjU2MjUsMS42ODc1IDAsMi44MTI1IC0wLjU2MjUsMS42ODc1IC0wLjU2MjUsMS4xMjUgLTEuMTI1LDEuMTI1IC0xLjY4NzUsMC41NjI1IC0zLjkzNzUsMFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogTWVkaXVtIGNvZWxpIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1jU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSA5OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMS4wMDQwODUsLTEuMDA0MDg0NSAtMS4wMDQwODQsLTAuNTAyMDQyMyAtMS41MDYxMjcsMCAtMS4wMDQwODUsMC41MDIwNDIzIC0xLjAwNDA4NCwxLjAwNDA4NDUgLTAuNTAyMDQzLDEuNTA2MTI2ODkgMCwxLjAwNDA4NDU4IDAuNTAyMDQzLDEuNTA2MTI2ODMgMS4wMDQwODQsMS4wMDQwODQ2IDEuMDA0MDg1LDAuNTAyMDQyMyAxLjUwNjEyNywwIDEuMDA0MDg0LC0wLjUwMjA0MjMgMS4wMDQwODUsLTEuMDA0MDg0NiBtIC0xNy41NzE0OCwtOS4wMzY3NjEyIDAsMTAuNTQyODg4MSBtIDAsLTEwLjU0Mjg4ODEgNC4wMTYzMzgsMTAuNTQyODg4MSBtIDQuMDE2MzM4LC0xMC41NDI4ODgxIC00LjAxNjMzOCwxMC41NDI4ODgxIG0gNC4wMTYzMzgsLTEwLjU0Mjg4ODEgMCwxMC41NDI4ODgxXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBJbW11bSBjb2VsaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpY1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gODsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IDk7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMS4yMDg4NTIsLTEuMjA4ODUxNCAtMS4yMDg4NTEsLTAuNjA0NDI1OCAtMS44MTMyNzgsMCAtMS4yMDg4NTIsMC42MDQ0MjU4IC0xLjIwODg1LDEuMjA4ODUxNCAtMC42MDQ0MjYsMS44MTMyNzcxNSAwLDEuMjA4ODUxMzUgMC42MDQ0MjYsMS44MTMyNzcyIDEuMjA4ODUsMS4yMDg4NTEzIDEuMjA4ODUyLDAuNjA0NDI1OSAxLjgxMzI3OCwwIDEuMjA4ODUxLC0wLjYwNDQyNTkgMS4yMDg4NTIsLTEuMjA4ODUxMyBtIC0xMS40ODQwOTAyLC0xMC44Nzk2NjI5IDAsMTIuNjkyOTQwMVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogQXJpZXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXJpZXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTI7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMC45LC0wLjkgMCwtMS44IDAuOSwtMS44IDEuOCwtMC44OTk5OTk4IDEuOCwwIDEuOCwwLjg5OTk5OTggMC45LDAuOSAwLjksMS44IDAuOSw0LjUgbSAtOSwtNS40IDEuOCwtMS44IDEuOCwwIDEuOCwwLjkgMC45LDAuOSAwLjksMS44IDAuOSwzLjYgMCw5LjkgbSA4LjEsLTEyLjYgMC45LC0wLjkgMCwtMS44IC0wLjksLTEuOCAtMS44LC0wLjg5OTk5OTggLTEuOCwwIC0xLjgsMC44OTk5OTk4IC0wLjksMC45IC0wLjksMS44IC0wLjksNC41IG0gOSwtNS40IC0xLjgsLTEuOCAtMS44LDAgLTEuOCwwLjkgLTAuOSwwLjkgLTAuOSwxLjggLTAuOSwzLjYgMCw5LjlcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFRhdXJ1cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0YXVydXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTExOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMSw0IDEsMiAyLDIgMywxIDQsMCAzLC0xIDIsLTIgMSwtMiAxLC00IG0gLTE4LDAgMSwzIDEsMiAyLDIgMywxIDQsMCAzLC0xIDIsLTIgMSwtMiAxLC0zIG0gLTExLDggLTIsMSAtMSwxIC0xLDIgMCwzIDEsMiAyLDIgMiwxIDIsMCAyLC0xIDIsLTIgMSwtMiAwLC0zIC0xLC0yIC0xLC0xIC0yLC0xIG0gLTQsMSAtMiwxIC0xLDIgMCwzIDEsMyBtIDgsMCAxLC0zIDAsLTMgLTEsLTIgLTIsLTFcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEdlbWluaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC02OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTY7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAwLDExLjU0NjQxNCBtIDAuOTYyMjAxMSwtMTAuNTg0MjEyOSAwLDkuNjIyMDExNyBtIDcuNjk3NjA5NywtOS42MjIwMTE3IDAsOS42MjIwMTE3IG0gMC45NjIyMDEsLTEwLjU4NDIxMjggMCwxMS41NDY0MTQgbSAtMTMuNDcwODE2NSwtMTQuNDMzMDE3MiAxLjkyNDQwMjMsMS45MjQ0MDIgMS45MjQ0MDI0LDAuOTYyMjAxMiAyLjg4NjYwMzgsMC45NjIyMDExIDMuODQ4ODA0LDAgMi44ODY2MDQsLTAuOTYyMjAxMSAxLjkyNDQwMiwtMC45NjIyMDEyIDEuOTI0NDAzLC0xLjkyNDQwMiBtIC0xNy4zMTk2MjE1LDE3LjMxOTYyMDcgMS45MjQ0MDIzLC0xLjkyNDQwMjQgMS45MjQ0MDI0LC0wLjk2MjIwMTEgMi44ODY2MDM4LC0wLjk2MjIwMTIgMy44NDg4MDQsMCAyLjg4NjYwNCwwLjk2MjIwMTIgMS45MjQ0MDIsMC45NjIyMDExIDEuOTI0NDAzLDEuOTI0NDAyNFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2FuY2VyIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTE1LDAgLTIsMSAtMSwyIDAsMiAxLDIgMiwxIDIsMCAyLC0xIDEsLTIgMCwtMiAtMSwtMiAxMSwwIG0gLTE4LDMgMSwyIDEsMSAyLDEgbSA0LC00IC0xLC0yIC0xLC0xIC0yLC0xIG0gLTQsMTUgMTUsMCAyLC0xIDEsLTIgMCwtMiAtMSwtMiAtMiwtMSAtMiwwIC0yLDEgLTEsMiAwLDIgMSwyIC0xMSwwIG0gMTgsLTMgLTEsLTIgLTEsLTEgLTIsLTEgbSAtNCw0IDEsMiAxLDEgMiwxXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBMZW8gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtMzsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IDQ7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMiwtMSAtMSwwIC0yLDEgLTEsMiAwLDEgMSwyIDIsMSAxLDAgMiwtMSAxLC0yIDAsLTEgLTEsLTIgLTUsLTUgLTEsLTIgMCwtMyAxLC0yIDIsLTEgMywtMSA0LDAgNCwxIDIsMiAxLDIgMCwzIC0xLDMgLTMsMyAtMSwyIDAsMiAxLDIgMiwwIDEsLTEgMSwtMiBtIC0xMywtNSAtMiwtMyAtMSwtMiAwLC0zIDEsLTIgMSwtMSBtIDcsLTEgMywxIDIsMiAxLDIgMCwzIC0xLDMgLTIsM1wiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogVmlyZ28gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdmlyZ29TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTU7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAyLjU4OTQ4NjgsLTIuNTg5NDg2OCAxLjcyNjMyNDUsMi41ODk0ODY4IDAsOS40OTQ3ODQ3IG0gLTIuNTg5NDg2OCwtMTEuMjIxMTA5MiAxLjcyNjMyNDUsMi41ODk0ODY3IDAsOC42MzE2MjI1IG0gMC44NjMxNjIzLC05LjQ5NDc4NDcgMi41ODk0ODY3LC0yLjU4OTQ4NjggMS43MjYzMjQ1MSwyLjU4OTQ4NjggMCw4LjYzMTYyMjQgbSAtMi41ODk0ODY3MSwtMTAuMzU3OTQ2OSAxLjcyNjMyNDQ3LDIuNTg5NDg2NyAwLDcuNzY4NDYwMiBtIDAuODYzMTYyMjQsLTguNjMxNjIyNCAyLjU4OTQ4Njc5LC0yLjU4OTQ4NjggMS43MjYzMjQ0LDIuNTg5NDg2OCAwLDEzLjgxMDU5NTkgbSAtMi41ODk0ODY3LC0xNS41MzY5MjA0IDEuNzI2MzI0NSwyLjU4OTQ4NjcgMCwxMi45NDc0MzM3IG0gMC44NjMxNjIyLC0xMy44MTA1OTU5IDIuNTg5NDg2OCwtMi41ODk0ODY4IDAuODYzMTYyMiwxLjcyNjMyNDUgMC44NjMxNjIzLDIuNTg5NDg2OCAwLDIuNTg5NDg2NyAtMC44NjMxNjIzLDIuNTg5NDg2NzMgLTAuODYzMTYyMiwxLjcyNjMyNDQ3IC0xLjcyNjMyNDUsMS43MjYzMjQ1IC0yLjU4OTQ4NjcsMS43MjYzMjQ1IC00LjMxNTgxMTMsMS43MjYzMjQ1IG0gNy43Njg0NjAyLC0xNS41MzY5MjA0IDAuODYzMTYyMywwLjg2MzE2MjIgMC44NjMxNjIyLDIuNTg5NDg2OCAwLDIuNTg5NDg2NyAtMC44NjMxNjIyLDIuNTg5NDg2NzMgLTAuODYzMTYyMywxLjcyNjMyNDQ3IC0xLjcyNjMyNDUsMS43MjYzMjQ1IC0yLjU4OTQ4NjcsMS43MjYzMjQ1IC0zLjQ1MjY0OSwxLjcyNjMyNDVcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIExpYnJhIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtMjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC04OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgYyAwLjc1MTksMWUtNSAxLjM5MjQsMC4xMjIyNyAxLjkzMTYsMC4zNTE1NiAwLjY2MTksMC4yODQ5NSAxLjIxMzQsMC42Mzg1NCAxLjY2NiwxLjA2MjUgMC40ODM4LDAuNDU0ODEgMC44NTMsMC45NzI1NSAxLjExNzIsMS41NjY0MSAwLjI0NjcsMC41NjYxMiAwLjM3MTEsMS4xNzM5NyAwLjM3MTEsMS44Mzc4OSAwLDAuNjQxMTMgLTAuMTI0NCwxLjIzOTQ4IC0wLjM3MywxLjgwODU5IC0wLjE2MjQsMC4zNjMwNSAtMC4zNjMxLDAuNjk3MjUgLTAuNjA1NSwxLjAwNTg2IGwgLTAuNjM2NywwLjgwODYgNC4zNzg5LDAgMCwwLjY3MTg3IC01LjQwMjQsMCAwLC0wLjkxNzk3IGMgMC4yMTczLC0wLjEzODUgMC40Mzc5LC0wLjI3MjQ0IDAuNjM2NywtMC40NDcyNiAwLjQyMTUsLTAuMzY4NzYgMC43NTI5LC0wLjgyNzg0IDAuOTg4MywtMS4zNTU0NyAwLjIyMTUsLTAuNTAwNzQgMC4zMzQsLTEuMDM1OCAwLjMzNCwtMS41ODU5NCAwLC0wLjU1NjUzIC0wLjExMjIsLTEuMDk0MzQgLTAuMzM0LC0xLjU5NTcgbCAtMCwtMC4wMDIgMCwtMC4wMDQgYyAtMC4yMjkyLC0wLjQ5OTAxIC0wLjU1ODEsLTAuOTQ3NzggLTAuOTc0NiwtMS4zMzc4OSBsIC0wLC0wLjAwMiAtMCwtMC4wMDIgYyAtMC4zOTY3LC0wLjM2MTU1IC0wLjg2NzksLTAuNjU3MjMgLTEuNDA2MiwtMC44ODQ3NiBsIC0wLDAgYyAtMC40OTg0LC0wLjIwOTAzIC0xLjA2MjIsLTAuMzA2NjMgLTEuNjgxNywtMC4zMDY2NCAtMC41OTI2LDFlLTUgLTEuMTUyNiwwLjEwMDA4IC0xLjY2OTksMC4zMDI3MyBsIC0wLDAgYyAtMC41MjYxLDAuMjA3OTkgLTEuMDAzMiwwLjUwNjcgLTEuNDE5OSwwLjg4ODY3IGwgLTAsMC4wMDIgLTAsMC4wMDIgYyAtMC40MTY2LDAuMzkwMTEgLTAuNzQ1NCwwLjgzODg3IC0wLjk3NDYsMS4zMzc4OSBsIDAsMC4wMDQgLTAsMC4wMDIgYyAtMC4yMjE4LDAuNTAxMzYgLTAuMzM0LDEuMDM5MTUgLTAuMzM0LDEuNTk1NyAwLDAuNTUwMTUgMC4xMTI1LDEuMDg1MTkgMC4zMzQsMS41ODU5NCBsIDAsMC4wMDIgMCwwLjAwNCBjIDAuMjI5LDAuNDk4NTUgMC41NTc0LDAuOTQ5MTEgMC45NzQ2LDEuMzM5ODQgMC4xODc2LDAuMTc0ODIgMC40MTQzLDAuMzE0ODQgMC42MzY3LDAuNDU3MDMgbCAwLDAuOTE3OTcgLTUuMzkwNiwwIDAsLTAuNjcxODcgNC4zNzg5LDAgLTAuNjM2NywtMC44MDg2IGMgLTAuMjQyOCwtMC4zMDkwNCAtMC40NDMsLTAuNjQ0MTggLTAuNjA1NSwtMS4wMDc4MSAtMC4yNDg3LC0wLjU2OTExIC0wLjM3MzEsLTEuMTY1NTIgLTAuMzczMSwtMS44MDY2NCAwLC0wLjY2MzkxIDAuMTI0NCwtMS4yNzE3OCAwLjM3MTEsLTEuODM3ODkgbCAwLC0wLjAwMiBjIDNlLTQsLTUuOGUtNCAtMmUtNCwtMTBlLTQgMCwtMC4wMDIgMC4yNjQxLC0wLjU5MjE4IDAuNjMyNiwtMS4xMDg3MSAxLjExNTMsLTEuNTYyNSAwLjQ4NDcsLTAuNDU1NzEgMS4wMzMyLC0wLjgwNTg1IDEuNjU2MiwtMS4wNTg1OSAwLjU4NjEsLTAuMjM0ODggMS4yMjk0LC0wLjM1NTQ2IDEuOTQxNCwtMC4zNTU0NyB6IG0gLTcuODQ5NiwxMy40NTg5OSAxNS42OTkyLDAgMCwwLjY3MTg3IC0xNS42OTkyLDAgelwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogU2NvcnBpbyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzY29ycGlvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC00OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMi4zNzgxMTAxLC0yLjM3ODExMDEgMi4zNzgxMTAxLDIuMzc4MTEwMSAwLDkuNTEyNDQwNCBtIC0zLjE3MDgxMzUsLTExLjA5Nzg0NzEgMi4zNzgxMTAxLDIuMzc4MTEwMSAwLDguNzE5NzM3IG0gMC43OTI3MDM0LC05LjUxMjQ0MDQgMi4zNzgxMTAxLC0yLjM3ODExMDEgMi4zNzgxMTAwNywyLjM3ODExMDEgMCw5LjUxMjQ0MDQgbSAtMy4xNzA4MTM0NywtMTEuMDk3ODQ3MSAyLjM3ODExMDEsMi4zNzgxMTAxIDAsOC43MTk3MzcgbSAwLjc5MjcwMzM3LC05LjUxMjQ0MDQgMi4zNzgxMTAxMywtMi4zNzgxMTAxIDIuMzc4MTEwMSwyLjM3ODExMDEgMCw4LjcxOTczNyAxLjU4NTQwNjcsMS41ODU0MDY4IG0gLTQuNzU2MjIwMiwtMTEuODkwNTUwNSAyLjM3ODExMDEsMi4zNzgxMTAxIDAsOC43MTk3MzcgMS41ODU0MDY3LDEuNTg1NDA2NyAyLjM3ODExMDEsLTIuMzc4MTEwMVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogU2FnaXR0YXJpdXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2FnaXR0YXJpdXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDc7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0xNy4xMTQ0NCwxNy4xMTQ0NCBtIDE3LjExNDQ0LC0xNy4xMTQ0NCAtMy4yMDg5NTc1LDEuMDY5NjUyNSAtNi40MTc5MTUsMCBtIDcuNDg3NTY3NSwxLjA2OTY1MjUgLTMuMjA4OTU3NSwwIC00LjI3ODYxLC0xLjA2OTY1MjUgbSA5LjYyNjg3MjUsLTEuMDY5NjUyNSAtMS4wNjk2NTI1LDMuMjA4OTU3NSAwLDYuNDE3OTE1MDQgbSAtMS4wNjk2NTI1LC03LjQ4NzU2NzU0IDAsMy4yMDg5NTc1IDEuMDY5NjUyNSw0LjI3ODYxMDA0IG0gLTguNTU3MjIsMCAtNy40ODc1Njc1LDAgbSA2LjQxNzkxNSwxLjA2OTY1MjQ2IC0zLjIwODk1NzUsMCAtMy4yMDg5NTc1LC0xLjA2OTY1MjQ2IG0gNy40ODc1Njc1LDAgMCw3LjQ4NzU2NzQ2IG0gLTEuMDY5NjUyNSwtNi40MTc5MTUgMCwzLjIwODk1NzUgMS4wNjk2NTI1LDMuMjA4OTU3NVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2Fwcmljb3JuIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDEuODA0NzYzMywtMy42MDk1MjY3IDQuNTExOTA4NCw5LjAyMzgxNjggbSAtNC41MTE5MDg0LC03LjIxOTA1MzQgNC41MTE5MDg0LDkuMDIzODE2NyAyLjcwNzE0NSwtNi4zMTY2NzE3IDQuNTExOTA4NCwwIDIuNzA3MTQ1LC0wLjkwMjM4MTcgMC45MDIzODE3LC0xLjgwNDc2MzMgMCwtMS44MDQ3NjM0IC0wLjkwMjM4MTcsLTEuODA0NzYzMyAtMS44MDQ3NjM0LC0wLjkwMjM4MTcgLTAuOTAyMzgxNiwwIC0xLjgwNDc2MzQsMC45MDIzODE3IC0wLjkwMjM4MTcsMS44MDQ3NjMzIDAsMS44MDQ3NjM0IDAuOTAyMzgxNywyLjcwNzE0NSAwLjkwMjM4MTcsMS44MDQ3NjMzNiAwLjkwMjM4MTcsMi43MDcxNDUwNCAwLDIuNzA3MTQ1IC0xLjgwNDc2MzQsMS44MDQ3NjMzIG0gMS44MDQ3NjM0LC0xNi4yNDI4NzAxIC0wLjkwMjM4MTcsMC45MDIzODE3IC0wLjkwMjM4MTcsMS44MDQ3NjMzIDAsMS44MDQ3NjM0IDEuODA0NzYzNCwzLjYwOTUyNjcgMC45MDIzODE2LDIuNzA3MTQ1IDAsMi43MDcxNDUgLTAuOTAyMzgxNiwxLjgwNDc2MzQgLTEuODA0NzYzNCwwLjkwMjM4MTZcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEFxdWFyaXVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFxdWFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtODsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0yOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMi44ODY2MDM1LC0yLjg4NjYwMzUgMy44NDg4MDQ3LDEuOTI0NDAyMyBtIC00LjgxMTAwNTksLTAuOTYyMjAxMSAzLjg0ODgwNDcsMS45MjQ0MDIzIDIuODg2NjAzNSwtMi44ODY2MDM1IDIuODg2NjAzNSwxLjkyNDQwMjMgbSAtMy44NDg4MDQ2NywtMC45NjIyMDExIDIuODg2NjAzNDcsMS45MjQ0MDIzIDIuODg2NjAzNSwtMi44ODY2MDM1IDEuOTI0NDAyNCwxLjkyNDQwMjMgbSAtMi44ODY2MDM1LC0wLjk2MjIwMTEgMS45MjQ0MDIzLDEuOTI0NDAyMyAyLjg4NjYwMzUsLTIuODg2NjAzNSBtIC0xNy4zMTk2MjEsOC42NTk4MTA1IDIuODg2NjAzNSwtMi44ODY2MDM0OCAzLjg0ODgwNDcsMS45MjQ0MDIzOCBtIC00LjgxMTAwNTksLTAuOTYyMjAxMjEgMy44NDg4MDQ3LDEuOTI0NDAyMzEgMi44ODY2MDM1LC0yLjg4NjYwMzQ4IDIuODg2NjAzNSwxLjkyNDQwMjM4IG0gLTMuODQ4ODA0NjcsLTAuOTYyMjAxMjEgMi44ODY2MDM0NywxLjkyNDQwMjMxIDIuODg2NjAzNSwtMi44ODY2MDM0OCAxLjkyNDQwMjQsMS45MjQ0MDIzOCBtIC0yLjg4NjYwMzUsLTAuOTYyMjAxMjEgMS45MjQ0MDIzLDEuOTI0NDAyMzEgMi44ODY2MDM1LC0yLjg4NjYwMzQ4XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBQaXNjZXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGlzY2VzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtODsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC04OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgNCwyIDIsMiAxLDMgMCwzIC0xLDMgLTIsMiAtNCwyIG0gMCwtMTcgMywxIDIsMSAyLDIgMSwzIG0gMCwzIC0xLDMgLTIsMiAtMiwxIC0zLDEgbSAxNiwtMTcgLTMsMSAtMiwxIC0yLDIgLTEsMyBtIDAsMyAxLDMgMiwyIDIsMSAzLDEgbSAwLC0xNyAtNCwyIC0yLDIgLTEsMyAwLDMgMSwzIDIsMiA0LDIgbSAtMTcsLTkgMTgsMCBtIC0xOCwxIDE4LDBcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgfVxuXG59XG5cbmV4cG9ydCB7XG4gIFNWR1V0aWxzIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFV0aWxpdHkgY2xhc3NcbiAqIEBwdWJsaWNcbiAqIEBzdGF0aWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgVXRpbHMge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgVXRpbHMpIHtcbiAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBERUdfMzYwID0gMzYwXG4gIHN0YXRpYyBERUdfMTgwID0gMTgwXG5cbiAgLyoqXG4gICAqIEludmVydGVkIGRlZ3JlZSB0byByYWRpYW5cbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVJbmRlZ3JlZVxuICAgKiBAcGFyYW0ge051bWJlcn0gc2hpZnRJbkRlZ3JlZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgZGVncmVlVG9SYWRpYW4gPSBmdW5jdGlvbihhbmdsZUluRGVncmVlLCBzaGlmdEluRGVncmVlID0gMCkge1xuICAgIHJldHVybiAoKHNoaWZ0SW5EZWdyZWUgLSBhbmdsZUluRGVncmVlKSAlIDM2MCkgKiBNYXRoLlBJIC8gMTgwXG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgcmFkaWFuIHRvIGRlZ3JlZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5cbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIHJhZGlhblRvRGVncmVlID0gZnVuY3Rpb24ocmFkaWFuKSB7XG4gICAgcmV0dXJuIChyYWRpYW4gKiAxODAgLyBNYXRoLlBJKSAlIDM2MFxuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgb24gdGhlIGNpcmNsZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGN4IC0gY2VudGVyIHhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGN5IC0gY2VudGVyIHlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5SYWRpYW5zXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7eDpOdW1iZXIsIHk6TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIHBvc2l0aW9uT25DaXJjbGUoY3gsIGN5LCByYWRpdXMsIGFuZ2xlSW5SYWRpYW5zKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IE1hdGgucm91bmQocmFkaXVzICogTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpICsgY3gpLFxuICAgICAgeTogTWF0aC5yb3VuZChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZUluUmFkaWFucykgKyBjeSlcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgbmV3IHBvc2l0aW9uIG9mIHBvaW50cyBvbiBjaXJjbGUgd2l0aG91dCBvdmVybGFwcGluZyBlYWNoIG90aGVyXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIElmIHRoZXJlIGlzIG5vIHBsYWNlIG9uIHRoZSBjaXJjbGUgdG8gcGxhY2UgcG9pbnRzLlxuICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgLSBbe25hbWU6XCJhXCIsIHBvc2l0aW9uOjEwfSwge25hbWU6XCJiXCIsIHBvc2l0aW9uOjIwfV1cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvbGxpc2lvblJhZGl1cyAtIHBvaW50IHJhZGl1c1xuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1c1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge1wiTW9vblwiOjMwLCBcIlN1blwiOjYwLCBcIk1lcmN1cnlcIjo4NiwgLi4ufVxuICAgKi9cbiAgc3RhdGljIGNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgY29sbGlzaW9uUmFkaXVzLCBjaXJjbGVSYWRpdXMpIHtcbiAgICBjb25zdCBTVEVQID0gMSAvL2RlZ3JlZVxuICAgIGNvbnN0IF9wb2ludHMgPSBwb2ludHMubWFwKHAgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ucFxuICAgICAgfVxuICAgIH0pXG4gICAgX3BvaW50cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5wb3NpdGlvbiAtIGIucG9zaXRpb25cbiAgICB9KVxuXG4gICAgY29uc3QgYXJyYW5nZVBvaW50cyA9ICgpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsbiA9IF9wb2ludHMubGVuZ3RoOyBpIDwgbG47IGkrKykge1xuICAgICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSgwLCAwLCBjaXJjbGVSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKF9wb2ludHNbaV0ucG9zaXRpb24pKVxuICAgICAgICBfcG9pbnRzW2ldLnggPSBwb2ludFBvc2l0aW9uLnhcbiAgICAgICAgX3BvaW50c1tpXS55ID0gcG9pbnRQb3NpdGlvbi55XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhfcG9pbnRzW2ldLnggLSBfcG9pbnRzW2pdLngsIDIpICsgTWF0aC5wb3coX3BvaW50c1tpXS55IC0gX3BvaW50c1tqXS55LCAyKSk7XG4gICAgICAgICAgaWYgKGRpc3RhbmNlIDwgMiAqIGNvbGxpc2lvblJhZGl1cykge1xuICAgICAgICAgICAgX3BvaW50c1tpXS5wb3NpdGlvbiA9IChfcG9pbnRzW2ldLnBvc2l0aW9uICsgMSlcbiAgICAgICAgICAgIF9wb2ludHNbal0ucG9zaXRpb24gPSAoX3BvaW50c1tqXS5wb3NpdGlvbiAtIDEpIFxuICAgICAgICAgICAgYXJyYW5nZVBvaW50cygpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXJyYW5nZVBvaW50cygpXG5cbiAgICByZXR1cm4gX3BvaW50cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBwb2ludCwgY3VycmVudEluZGV4KSA9PiB7XG4gICAgICBhY2N1bXVsYXRvcltwb2ludC5uYW1lXSA9IHBvaW50LnBvc2l0aW9uXG4gICAgICByZXR1cm4gYWNjdW11bGF0b3JcbiAgICB9LCB7fSlcbiAgfVxufVxuXG5leHBvcnQge1xuICBVdGlscyBhc1xuICBkZWZhdWx0XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBVbml2ZXJzZSBmcm9tICcuL3VuaXZlcnNlL1VuaXZlcnNlLmpzJ1xuXG5leHBvcnQge1VuaXZlcnNlIGFzIFwiQ2hhcnRcIn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==