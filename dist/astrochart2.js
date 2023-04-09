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
      const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, innerCircleRadius-1.5*RadixChart.RULER_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(point.getPosition(), this.#anscendantShift))
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
const CHART_POINT_COLLISION_RADIUS = 4

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
   * @param {Number} pointRadius - point radius
   * @param {Number} radius - circle radius
   *
   * @return {Object} - {"Moon":30, "Sun":60, "Mercury":86, ...}
   */
  static calculatePositionWithoutOverlapping(points, pointRadius, circleRadius) {
    const pointWidth = 2 * pointRadius
    const circleCircumference = 2 * Math.PI * circleRadius
    const pointsCircumference = points.length * pointWidth
    if (pointsCircumference > circleCircumference) {
      throw new Error(`There is no place on the circle to place points.`)
    }

    points.sort((a, b) => {
      return a.position - b.position
    })

    const numberOfCellsInScalar = Math.floor(circleCircumference / pointWidth)
    const cellWidth = DEG_360/numberOfCellsInScalar
    const scalar = new Array(numberOfCellsInScalar)

    for (const point of points) {
      let idx = Math.floor(point.position / pointWidth)

      while (scalar[idx] !== undefined) {
        idx = (idx + 1) % numberOfCellsInScalar
      }

      scalar[idx] = point
    }

    console.log(scalar)

    return scalar.reduce((accumulator, point, currentIndex) => {

      // a Point has a space to draw itself at the precise position.
      if (scalar[(currentIndex - 1) % numberOfCellsInScalar] === undefined && scalar[(currentIndex + 1) % numberOfCellsInScalar] === undefined) {
        accumulator[point.name] = point.position
        return accumulator
      }

      accumulator[point.name] = (currentIndex * pointWidth) - pointRadius
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7QUN0SlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7O0FDTlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4RHNEO0FBQ2pCO0FBQ0s7QUFDSTs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EseUNBQXlDOztBQUV6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFDQUFxQyxFQUFFLG9FQUFlLFlBQVksOEJBQThCO0FBQ2hHLHdCQUF3QixzRUFBb0I7QUFDNUM7O0FBRUEsc0JBQXNCLDZEQUFVO0FBQ2hDLHdCQUF3QiwrREFBWTs7QUFFcEM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFLQzs7Ozs7Ozs7Ozs7Ozs7O0FDM0VEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7OztBQzNkRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjLFFBQVEsR0FBRztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsYUFBYSxPQUFPLFdBQVcsc0JBQXNCLEdBQUcsc0JBQXNCO0FBQzlFLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjLFFBQVEsR0FBRztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUssSUFBSTtBQUNUO0FBQ0E7O0FBS0M7Ozs7Ozs7VUNqSEQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ042Qzs7QUFFakIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvQ2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9SYWRpeENoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvVHJhbnNpdENoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9wb2ludHMvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL0NvbG9ycy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1JhZGl4LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvVHJhbnNpdC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1VuaXZlcnNlLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91bml2ZXJzZS9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvU1ZHVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL1V0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhc3Ryb2xvZ3lcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiYXN0cm9sb2d5XCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEFuIGFic3RyYWN0IGNsYXNzIGZvciBhbGwgdHlwZSBvZiBDaGFydFxuICogQHB1YmxpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQGFic3RyYWN0XG4gKi9cbmNsYXNzIENoYXJ0IHtcblxuICAvLyNzZXR0aW5nc1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgLy90aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGRhdGEgaXMgdmFsaWRcbiAgICogQHRocm93cyB7RXJyb3J9IC0gaWYgdGhlIGRhdGEgaXMgdW5kZWZpbmVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge2lzVmFsaWQ6Ym9vbGVhbiwgbWVzc2FnZTpTdHJpbmd9XG4gICAqL1xuICB2YWxpZGF0ZURhdGEoZGF0YSkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzaW5nIHBhcmFtIGRhdGEuXCIpXG4gICAgfVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEucG9pbnRzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwicG9pbnRzIGlzIG5vdCBBcnJheS5cIlxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLmN1c3BzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwiY3VwcyBpcyBub3QgQXJyYXkuXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5jdXNwcy5sZW5ndGggIT09IDEyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJjdXNwcy5sZW5ndGggIT09IDEyXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBwb2ludCBvZiBkYXRhLnBvaW50cykge1xuICAgICAgaWYgKHR5cGVvZiBwb2ludC5uYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQubmFtZSAhPT0gJ3N0cmluZydcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocG9pbnQubmFtZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50Lm5hbWUubGVuZ3RoID09IDBcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBvaW50LnBvc2l0aW9uICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQucG9zaXRpb24gIT09ICdudW1iZXInXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGN1c3Agb2YgZGF0YS5jdXNwcykge1xuICAgICAgaWYgKHR5cGVvZiBjdXNwLnBvc2l0aW9uICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiY3VzcC5wb3NpdGlvbiAhPT0gJ251bWJlcidcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBtZXNzYWdlOiBcIlwiXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc2V0RGF0YShkYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRQb2ludHMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRQb2ludChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRBc3BlY3RzKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgYW5pbWF0ZVRvKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8vICMjIFBST1RFQ1RFRCAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxufVxuXG5leHBvcnQge1xuICBDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuaW1wb3J0IFBvaW50IGZyb20gJy4uL3BvaW50cy9Qb2ludC5qcydcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUG9pbnRzIGFuZCBjdXBzIGFyZSBkaXNwbGF5ZWQgaW5zaWRlIHRoZSBVbml2ZXJzZS5cbiAqIEBwdWJsaWNcbiAqIEBleHRlbmRzIHtDaGFydH1cbiAqL1xuY2xhc3MgUmFkaXhDaGFydCBleHRlbmRzIENoYXJ0IHtcblxuICAvKlxuICAgKiBJbm5lciBjaXJjbGUgcmFkaXVzIHJhdGlvXG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAZGVmYXVsdCA4XG4gICAqL1xuICBzdGF0aWMgSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTyA9IDg7XG5cbiAgLypcbiAgICogT3V0ZXIgY2lyY2xlIHJhZGl1cyByYXRpb1xuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMlxuICAgKi9cbiAgc3RhdGljIE9VVEVSX0NJUkNMRV9SQURJVVNfUkFUSU8gPSAyO1xuXG5cbiAgLypcbiAgICogVGhlIGxlbmd0aCBvZiB0aGUgcG9pbnRlcnMgaW4gdGhlIHJ1bGVyXG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAZGVmYXVsdCAxMFxuICAgKi9cbiAgc3RhdGljIFJVTEVSX0xFTkdUSCA9IDEwXG5cbiAgI3NldHRpbmdzXG4gICNyb290XG5cbiAgLypcbiAgICogU2hpZnQgdGhlIEFzY2VuZGFudCB0byB0aGUgMCBkZWdyZWUgb24gVGhlIENoYXJ0XG4gICAqL1xuICAjYW5zY2VuZGFudFNoaWZ0XG4gICNjZW50ZXJYXG4gICNjZW50ZXJZXG4gICNyYWRpdXNcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtTVkdEb2N1bWVudH0gU1ZHRG9jdW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihTVkdEb2N1bWVudCwgc2V0dGluZ3MpIHtcblxuICAgIGlmICghU1ZHRG9jdW1lbnQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBTVkdEb2N1bWVudC4nKVxuICAgIH1cblxuICAgIGlmICghc2V0dGluZ3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHNldHRpbmdzLicpXG4gICAgfVxuXG4gICAgc3VwZXIoc2V0dGluZ3MpXG5cbiAgICB0aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuICAgIHRoaXMuI3Jvb3QgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgdGhpcy4jcm9vdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuUkFESVhfSUR9YClcbiAgICBTVkdEb2N1bWVudC5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogU2V0IGNoYXJ0IGRhdGFcbiAgICogQHRocm93cyB7RXJyb3J9IC0gaWYgdGhlIGRhdGEgaXMgbm90IHZhbGlkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxuICAgKi9cbiAgc2V0RGF0YShkYXRhKSB7XG4gICAgbGV0IHN0YXR1cyA9IHRoaXMudmFsaWRhdGVEYXRhKGRhdGEpXG4gICAgaWYgKCFzdGF0dXMuaXNWYWxpZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHN0YXR1cy5tZXNzYWdlcylcbiAgICB9XG5cbiAgICB0aGlzLiNhbnNjZW5kYW50U2hpZnQgPSAoZGF0YS5jdXNwc1swXS5wb3NpdGlvbiArIFV0aWxzLkRFR18xODApXG4gICAgdGhpcy4jZHJhdyhkYXRhKVxuICB9XG5cbiAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAvKlxuICAgKiBEcmF3IHJhZGl4IGNoYXJ0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICAjZHJhdyhkYXRhKSB7XG4gICAgdGhpcy4jZHJhd0JhY2tncm91bmQoKVxuICAgIHRoaXMuI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpXG4gICAgdGhpcy4jZHJhd1J1bGVyKClcbiAgICB0aGlzLiNkcmF3TWFpbkF4aXMoW3tcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLFxuICAgICAgICBwb3NpdGlvbjogZGF0YS5jdXNwc1swXS5wb3NpdGlvblxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0lDLFxuICAgICAgICBwb3NpdGlvbjogZGF0YS5jdXNwc1szXS5wb3NpdGlvblxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0RTLFxuICAgICAgICBwb3NpdGlvbjogZGF0YS5jdXNwc1s2XS5wb3NpdGlvblxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxuICAgICAgICBwb3NpdGlvbjogZGF0YS5jdXNwc1s5XS5wb3NpdGlvblxuICAgICAgfSxcbiAgICBdKVxuICAgIHRoaXMuI2RyYXdQb2ludHMoZGF0YS5wb2ludHMpXG4gICAgdGhpcy4jZHJhd0JvcmRlcnMoKVxuICB9XG5cbiAgI2RyYXdCYWNrZ3JvdW5kKCkge1xuICAgIGNvbnN0IE1BU0tfSUQgPSBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuUkFESVhfSUR9LWJhY2tncm91bmQtbWFzay0xYFxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IG1hc2sgPSBTVkdVdGlscy5TVkdNYXNrKE1BU0tfSUQpXG4gICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzKVxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwid2hpdGVcIilcbiAgICBtYXNrLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgY29uc3QgaW5uZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5PVVRFUl9DSVJDTEVfUkFESVVTX1JBVElPKVxuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwiYmxhY2tcIilcbiAgICBtYXNrLmFwcGVuZENoaWxkKGlubmVyQ2lyY2xlKVxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobWFzaylcblxuICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMpXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX0JBQ0tHUk9VTkRfQ09MT1IpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJtYXNrXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBgdXJsKCMke01BU0tfSUR9KWApO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpIHtcbiAgICBjb25zdCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TID0gMTJcbiAgICBjb25zdCBTVEVQID0gMzAgLy9kZWdyZWVcbiAgICBjb25zdCBDT0xPUlNfU0lHTlMgPSBbdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVJJRVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1RBVVJVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfR0VNSU5JLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQU5DRVIsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xFTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVklSR08sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xJQlJBLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQ09SUElPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQUdJVFRBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FQUklDT1JOLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUVVBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfUElTQ0VTXVxuICAgIGNvbnN0IFNZTUJPTF9TSUdOUyA9IFtTVkdVdGlscy5TWU1CT0xfQVJJRVMsIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVMsIFNWR1V0aWxzLlNZTUJPTF9HRU1JTkksIFNWR1V0aWxzLlNZTUJPTF9DQU5DRVIsIFNWR1V0aWxzLlNZTUJPTF9MRU8sIFNWR1V0aWxzLlNZTUJPTF9WSVJHTywgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBLCBTVkdVdGlscy5TWU1CT0xfU0NPUlBJTywgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTLCBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOLCBTVkdVdGlscy5TWU1CT0xfQVFVQVJJVVMsIFNWR1V0aWxzLlNZTUJPTF9QSVNDRVNdXG5cbiAgICBjb25zdCBtYWtlU3ltYm9sID0gKHN5bWJvbEluZGV4LCBhbmdsZUluRGVncmVlKSA9PiB7XG4gICAgICBsZXQgcG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cyAtICh0aGlzLiNyYWRpdXMgLyBSYWRpeENoYXJ0LklOTkVSX0NJUkNMRV9SQURJVVNfUkFUSU8pIC8gMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVJbkRlZ3JlZSArIFNURVAgLyAyLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgbGV0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChTWU1CT0xfU0lHTlNbc3ltYm9sSW5kZXhdLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55LCA4KVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TSUdOU19DT0xPUik7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICByZXR1cm4gc3ltYm9sXG4gICAgfVxuXG4gICAgY29uc3QgbWFrZVNlZ21lbnQgPSAoc3ltYm9sSW5kZXgsIGFuZ2xlRnJvbUluRGVncmVlLCBhbmdsZVRvSW5EZWdyZWUpID0+IHtcbiAgICAgIGxldCBhMSA9IFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlRnJvbUluRGVncmVlLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpXG4gICAgICBsZXQgYTIgPSBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZVRvSW5EZWdyZWUsIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdClcbiAgICAgIGxldCBzZWdtZW50ID0gU1ZHVXRpbHMuU1ZHU2VnbWVudCh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMsIGExLCBhMiwgdGhpcy4jcmFkaXVzIC0gdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPKTtcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogQ09MT1JTX1NJR05TW3N5bWJvbEluZGV4XSk7XG4gICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLkNJUkNMRV9DT0xPUiA6IFwibm9uZVwiKTtcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIDogMCk7XG4gICAgICByZXR1cm4gc2VnbWVudFxuICAgIH1cblxuICAgIGxldCBzdGFydEFuZ2xlID0gMFxuICAgIGxldCBlbmRBbmdsZSA9IHN0YXJ0QW5nbGUgKyBTVEVQXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TOyBpKyspIHtcblxuICAgICAgbGV0IHNlZ21lbnQgPSBtYWtlU2VnbWVudChpLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VnbWVudCk7XG5cbiAgICAgIGxldCBzeW1ib2wgPSBtYWtlU3ltYm9sKGksIHN0YXJ0QW5nbGUpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUDtcbiAgICAgIGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd1J1bGVyKCkge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9ESVZJREVSUyA9IDcyXG4gICAgY29uc3QgU1RFUCA9IDVcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCBydWxlclJhZGl1cyA9ICh0aGlzLiNyYWRpdXMgLSAodGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPICsgUmFkaXhDaGFydC5SVUxFUl9MRU5HVEgpKTtcblxuICAgIGxldCBzdGFydEFuZ2xlID0gdGhpcy4jYW5zY2VuZGFudFNoaWZ0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfRElWSURFUlM7IGkrKykge1xuICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJ1bGVyUmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcblxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCBydWxlclJhZGl1cyArIFJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RIIC8gKGkgJSAyICsgMSksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuXG4gICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xuXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVBcbiAgICB9XG5cbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcnVsZXJSYWRpdXMpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBtYWluIGF4aXNcbiAgICogQHBhcmFtIHtBcnJheX0gYXhpc0xpc3RcbiAgICovXG4gICNkcmF3TWFpbkF4aXMoYXhpc0xpc3QpIHtcbiAgICBjb25zdCBBWElTX0xFTkdUSCA9IDEwXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgZm9yIChjb25zdCBheGlzIG9mIGF4aXNMaXN0KSB7XG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLnBvc2l0aW9uLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMgKyBBWElTX0xFTkdUSCwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5wb3NpdGlvbiwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGxldCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIGxldCB0ZXh0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cyArIEFYSVNfTEVOR1RILCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLnBvc2l0aW9uLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgbGV0IHBhdGggPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCwgdGV4dFBvaW50LnksIHtcbiAgICAgICAgLi4udGhpcy4jc2V0dGluZ3NcbiAgICAgIH0pXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9URVhUX0NPTE9SKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aCk7XG5cbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IHBvaW50c1xuICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgLSBbe1wibmFtZVwiOlN0cmluZywgXCJwb3NpdGlvblwiOk51bWJlcn1dXG4gICAqL1xuICAjZHJhd1BvaW50cyhwb2ludHMpIHtcbiAgICBjb25zdCBUT0RPID0gNDBcbiAgICBjb25zdCBQT0lOVF9SQURJVVMgPSB0aGlzLiNyYWRpdXMgLSAodGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPICsgVE9ETylcbiAgICBjb25zdCBpbm5lckNpcmNsZVJhZGl1cyA9IHRoaXMuI3JhZGl1cyAtIHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJT1xuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgY29uc3QgcG9zaXRpb25zID0gVXRpbHMuY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBQT0lOVF9SQURJVVMpXG4gICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XG5cbiAgICAgIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KHBvaW50RGF0YSlcbiAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIGlubmVyQ2lyY2xlUmFkaXVzLTEuNSpSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSCwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0UG9zaXRpb24oKSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGNvbnN0IHN5bWJvbFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCBQT0lOVF9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuXG4gICAgICAvLyBydWxlciBtYXJrXG4gICAgICBjb25zdCBydWxlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jcmFkaXVzIC0gKHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTyArIFJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RIKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0UG9zaXRpb24oKSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGNvbnN0IHJ1bGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIHJ1bGVyTGluZUVuZFBvc2l0aW9uLngsIHJ1bGVyTGluZUVuZFBvc2l0aW9uLnkpXG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChydWxlckxpbmUpO1xuXG4gICAgICAvLyBzeW1ib2xcbiAgICAgIGNvbnN0IHN5bWJvbCA9IHBvaW50LmdldFN5bWJvbChzeW1ib2xQb3NpdGlvbi54LCBzeW1ib2xQb3NpdGlvbi55KVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QT0lOVFNfQ09MT1IpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xuXG4gICAgICAvLyBwb2ludGVyXG4gICAgICBjb25zdCBwb2ludGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCBQT0lOVF9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgY29uc3QgcG9pbnRlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCBwb2ludGVyTGluZUVuZFBvc2l0aW9uLngsIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueSlcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgLyAyKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocG9pbnRlckxpbmUpO1xuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNkcmF3Qm9yZGVycygpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgaW5uZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzIC0gdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPKVxuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChpbm5lckNpcmNsZSlcblxuICAgIGNvbnN0IG91dGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cylcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpXG5cbiAgICBjb25zdCBjZW50ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5PVVRFUl9DSVJDTEVfUkFESVVTX1JBVElPKVxuICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNlbnRlckNpcmNsZSlcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG59XG5cbmV4cG9ydCB7XG4gIFJhZGl4Q2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBmcm9tIG91dHNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBUcmFuc2l0Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XG5cbiAgI3NldHRpbmdzXG4gICNyb290XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7U1ZHRG9jdW1lbnR9IFNWR0RvY3VtZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3IoU1ZHRG9jdW1lbnQsIHNldHRpbmdzKSB7XG5cbiAgICBpZiAoIVNWR0RvY3VtZW50IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gU1ZHRG9jdW1lbnQuJylcbiAgICB9XG5cbiAgICBpZiAoIXNldHRpbmdzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBzZXR0aW5ncy4nKVxuICAgIH1cblxuICAgIHN1cGVyKHNldHRpbmdzKVxuXG5cbiAgICB0aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX0lEfWApXG4gICAgU1ZHRG9jdW1lbnQuYXBwZW5kQ2hpbGQodGhpcy4jcm9vdCk7XG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG59XG5cbmV4cG9ydCB7XG4gIFRyYW5zaXRDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBSZXByZXNlbnRzIGEgcGxhbmV0IG9yIHBvaW50IG9mIGludGVyZXN0IGluIHRoZSBjaGFydFxuICogQHB1YmxpY1xuICovXG5jbGFzcyBQb2ludCB7XG5cbiAgI25hbWVcbiAgI3Bvc2l0aW9uXG4gICNpc1JldHJvZ3JhZGVcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIGNvbnN0cnVjdG9yKCBkYXRhICkge1xuICAgIHRoaXMuI25hbWUgPSBkYXRhLm5hbWUgPz8gXCJVbmtub3duXCJcbiAgICB0aGlzLiNwb3NpdGlvbiA9IGRhdGEucG9zaXRpb24gPz8gMFxuICAgIHRoaXMuI2lzUmV0cm9ncmFkZSA9IGRhdGEuaXNSZXRyb2dyYWRlID8/IGZhbHNlXG4gIH1cblxuICAvKipcbiAgKiBHZXQgbmFtZVxuICAqXG4gICogQHJldHVybiB7U3RyaW5nfVxuICAqL1xuICBnZXROYW1lKCl7XG4gICAgcmV0dXJuIHRoaXMuI25hbWVcbiAgfVxuXG4gIC8qKlxuICAqIElzIHJldHJvZ3JhZGVcbiAgKlxuICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICovXG4gIGlzUmV0cm9ncmFkZSgpe1xuICAgIHJldHVybiB0aGlzLiNpc1JldHJvZ3JhZGVcbiAgfVxuXG4gIC8qKlxuICAqIEdldCBwb3NpdGlvblxuICAqXG4gICogQHJldHVybiB7TnVtYmVyfVxuICAqL1xuICBnZXRQb3NpdGlvbigpe1xuICAgIHJldHVybiB0aGlzLiNwb3NpdGlvblxuICB9XG5cbiAgLyoqXG4gICogR2V0IHN5bWJvbFxuICAqIEBwYXJhbSB7TnVtYmVyfSB4UG9zXG4gICogQHBhcmFtIHtOdW1iZXJ9IHlQb3NcbiAgKlxuICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9XG4gICovXG4gIGdldFN5bWJvbCh4UG9zLCB5UG9zKXtcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgIGNvbnN0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbCh0aGlzLiNuYW1lLCB4UG9zLCB5UG9zKVxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKVxuICAgIHJldHVybiB3cmFwcGVyXG4gIH1cblxufVxuXG5leHBvcnQge1xuICBQb2ludCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgKiBhcyBVbml2ZXJzZSBmcm9tIFwiLi9jb25zdGFudHMvVW5pdmVyc2UuanNcIlxuaW1wb3J0ICogYXMgUmFkaXggZnJvbSBcIi4vY29uc3RhbnRzL1JhZGl4LmpzXCJcbmltcG9ydCAqIGFzIFRyYW5zaXQgZnJvbSBcIi4vY29uc3RhbnRzL1RyYW5zaXQuanNcIlxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gXCIuL2NvbnN0YW50cy9Db2xvcnMuanNcIlxuXG5jb25zdCBTRVRUSU5HUyA9IE9iamVjdC5hc3NpZ24oe30sIFVuaXZlcnNlLCBSYWRpeCwgVHJhbnNpdCwgQ29sb3JzKTtcblxuZXhwb3J0IHtcbiAgU0VUVElOR1MgYXNcbiAgZGVmYXVsdFxufVxuIiwiLyoqXG4qIENoYXJ0IGJhY2tncm91bmQgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNmZmZcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfQkFDS0dST1VORF9DT0xPUiA9IFwiI2ZmZlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0NJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGxpbmVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9MSU5FX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgdGV4dCBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVEVYVF9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHNpZ25zIGluIGNoYXJ0cyAoYXJpc2Ugc3ltYm9sLCB0YXVydXMgc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NJR05TX0NPTE9SID0gXCIjMDAwXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2Ygc2lnbnMgaW4gY2hhcnRzIChhcmlzZSBzeW1ib2wsIHRhdXJ1cyBzeW1ib2wsIC4uLilcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMwMDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfUE9JTlRTX0NPTE9SID0gXCIjMDAwXCI7XG5cbi8qXG4qIEFyaWVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0FSSUVTID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIFRhdXJ1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9UQVVSVVMgPSBcIiM4QjQ1MTNcIjtcblxuLypcbiogR2VtaW55IGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0dFTUlOST0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIENhbmNlciBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9DQU5DRVIgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogTGVvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xFTyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBWaXJnbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9WSVJHTyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBMaWJyYSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9MSUJSQSA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBTY29ycGlvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1NDT1JQSU8gPSBcIiMyN0FFNjBcIjtcblxuLypcbiogU2FnaXR0YXJpdXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0FHSVRUQVJJVVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogQ2Fwcmljb3JuIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBUFJJQ09STiA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBBcXVhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUVVBUklVUyA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBQaXNjZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfUElTQ0VTID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIENvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuIiwiLypcbiogUmFkaXggY2hhcnQgZWxlbWVudCBJRFxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgcmFkaXhcbiovXG5leHBvcnQgY29uc3QgUkFESVhfSUQgPSBcInJhZGl4XCJcbiIsIi8qXG4qIFRyYW5zaXQgY2hhcnQgZWxlbWVudCBJRFxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgdHJhbnNpdFxuKi9cbmV4cG9ydCBjb25zdCBUUkFOU0lUX0lEID0gXCJ0cmFuc2l0XCJcbiIsIi8qKlxuKiBDaGFydCBwYWRkaW5nXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxMHB4XG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BBRERJTkcgPSA0MFxuXG4vKipcbiogU1ZHIHZpZXdCb3ggd2lkdGhcbiogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvQXR0cmlidXRlL3ZpZXdCb3hcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDgwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9WSUVXQk9YX1dJRFRIID0gODAwXG5cbi8qKlxuKiBTVkcgdmlld0JveCBoZWlnaHRcbiogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvQXR0cmlidXRlL3ZpZXdCb3hcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDgwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9WSUVXQk9YX0hFSUdIVCA9IDgwMFxuXG4vKipcbiogQSBwb2ludCBjb2xsaXNpb24gcmFkaXVzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BPSU5UX0NPTExJU0lPTl9SQURJVVMgPSA0XG5cbi8qXG4qIExpbmUgc3RyZW5ndGhcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDFcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfU1RST0tFID0gMVxuXG4vKlxuKiBMaW5lIHN0cmVuZ3RoIG9mIHRoZSBtYWluIGxpbmVzLiBGb3IgaW5zdGFuY2UgbWFpbiBheGlzLCBtYWluIGNpcmNsZXNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDFcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfTUFJTl9TVFJPS0UgPSAyXG5cbi8qKlxuKiBObyBmaWxsLCBvbmx5IHN0cm9rZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge2Jvb2xlYW59XG4qIEBkZWZhdWx0IGZhbHNlXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRV9PTkxZID0gZmFsc2U7XG4iLCJpbXBvcnQgRGVmYXVsdFNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyc7XG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnO1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuLi9jaGFydHMvVHJhbnNpdENoYXJ0LmpzJztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQW4gd3JhcHBlciBmb3IgYWxsIHBhcnRzIG9mIGdyYXBoLlxuICogQHB1YmxpY1xuICovXG5jbGFzcyBVbml2ZXJzZSB7XG5cbiAgI1NWR0RvY3VtZW50XG4gICNzZXR0aW5nc1xuICAjcmFkaXhcbiAgI3RyYW5zaXRcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGh0bWxFbGVtZW50SUQgLSBJRCBvZiB0aGUgcm9vdCBlbGVtZW50IHdpdGhvdXQgdGhlICMgc2lnblxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gQW4gb2JqZWN0IHRoYXQgb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IHNldHRpbmdzIHZhbHVlc1xuICAgKi9cbiAgY29uc3RydWN0b3IoaHRtbEVsZW1lbnRJRCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICBpZiAodHlwZW9mIGh0bWxFbGVtZW50SUQgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgcmVxdWlyZWQgcGFyYW1ldGVyIGlzIG1pc3NpbmcuJylcbiAgICB9XG5cbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm90IGZpbmQgYSBIVE1MIGVsZW1lbnQgd2l0aCBJRCAnICsgaHRtbEVsZW1lbnRJRClcbiAgICB9XG5cbiAgICB0aGlzLiNzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRTZXR0aW5ncywgb3B0aW9ucywge0hUTUxfRUxFTUVOVF9JRDpodG1sRWxlbWVudElEfSk7XG4gICAgdGhpcy4jU1ZHRG9jdW1lbnQgPSBTVkdVdGlscy5TVkdEb2N1bWVudCh0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRILCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVClcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChodG1sRWxlbWVudElEKS5hcHBlbmRDaGlsZCh0aGlzLiNTVkdEb2N1bWVudCk7XG5cbiAgICB0aGlzLiNyYWRpeCA9IG5ldyBSYWRpeENoYXJ0KHRoaXMuI1NWR0RvY3VtZW50LCB0aGlzLiNzZXR0aW5ncylcbiAgICB0aGlzLiN0cmFuc2l0ID0gbmV3IFRyYW5zaXRDaGFydCh0aGlzLiNTVkdEb2N1bWVudCwgdGhpcy4jc2V0dGluZ3MpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gIyMgUFVCTElDICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qKlxuICAgKiBHZXQgUmFkaXggY2hhcnRcbiAgICogQHJldHVybiB7UmFkaXhDaGFydH1cbiAgICovXG4gIHJhZGl4KCkge1xuICAgIHJldHVybiB0aGlzLiNyYWRpeFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBUcmFuc2l0IGNoYXJ0XG4gICAqIEByZXR1cm4ge1RyYW5zaXRDaGFydH1cbiAgICovXG4gIHRyYW5zaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RyYW5zaXRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCBzZXR0aW5nc1xuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBnZXRTZXR0aW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy4jc2V0dGluZ3NcbiAgfVxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbn1cblxuZXhwb3J0IHtcbiAgVW5pdmVyc2UgYXNcbiAgZGVmYXVsdFxufVxuIiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgU1ZHIHV0aWxpdHkgY2xhc3NcbiAqIEBwdWJsaWNcbiAqIEBzdGF0aWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgU1ZHVXRpbHMge1xuXG4gIHN0YXRpYyBTVkdfTkFNRVNQQUNFID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG5cbiAgc3RhdGljIFNZTUJPTF9BUklFUyA9IFwiQXJpZXNcIjtcbiAgc3RhdGljIFNZTUJPTF9UQVVSVVMgPSBcIlRhdXJ1c1wiO1xuICBzdGF0aWMgU1lNQk9MX0dFTUlOSSA9IFwiR2VtaW5pXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0FOQ0VSID0gXCJDYW5jZXJcIjtcbiAgc3RhdGljIFNZTUJPTF9MRU8gPSBcIkxlb1wiO1xuICBzdGF0aWMgU1lNQk9MX1ZJUkdPID0gXCJWaXJnb1wiO1xuICBzdGF0aWMgU1lNQk9MX0xJQlJBID0gXCJMaWJyYVwiO1xuICBzdGF0aWMgU1lNQk9MX1NDT1JQSU8gPSBcIlNjb3JwaW9cIjtcbiAgc3RhdGljIFNZTUJPTF9TQUdJVFRBUklVUyA9IFwiU2FnaXR0YXJpdXNcIjtcbiAgc3RhdGljIFNZTUJPTF9DQVBSSUNPUk4gPSBcIkNhcHJpY29yblwiO1xuICBzdGF0aWMgU1lNQk9MX0FRVUFSSVVTID0gXCJBcXVhcml1c1wiO1xuICBzdGF0aWMgU1lNQk9MX1BJU0NFUyA9IFwiUGlzY2VzXCI7XG5cbiAgc3RhdGljIFNZTUJPTF9DVVNQXzEgPSBcIjFcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzIgPSBcIjJcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzMgPSBcIjNcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzQgPSBcIjRcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzUgPSBcIjVcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzYgPSBcIjZcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzcgPSBcIjdcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzggPSBcIjhcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzkgPSBcIjlcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzEwID0gXCIxMFwiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfMTEgPSBcIjExXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF8xMiA9IFwiMTJcIjtcblxuICBzdGF0aWMgU1lNQk9MX0FTID0gXCJBc1wiO1xuICBzdGF0aWMgU1lNQk9MX0RTID0gXCJEc1wiO1xuICBzdGF0aWMgU1lNQk9MX01DID0gXCJNY1wiO1xuICBzdGF0aWMgU1lNQk9MX0lDID0gXCJJY1wiO1xuXG4gIHN0YXRpYyBTWU1CT0xfU1VOID0gXCJTdW5cIjtcbiAgc3RhdGljIFNZTUJPTF9NT09OID0gXCJNb29uXCI7XG4gIHN0YXRpYyBTWU1CT0xfTUVSQ1VSWSA9IFwiTWVyY3VyeVwiO1xuICBzdGF0aWMgU1lNQk9MX1ZFTlVTID0gXCJWZW51c1wiO1xuICBzdGF0aWMgU1lNQk9MX01BUlMgPSBcIk1hcnNcIjtcbiAgc3RhdGljIFNZTUJPTF9KVVBJVEVSID0gXCJKdXBpdGVyXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0FUVVJOID0gXCJTYXR1cm5cIjtcbiAgc3RhdGljIFNZTUJPTF9VUkFOVVMgPSBcIlVyYW51c1wiO1xuICBzdGF0aWMgU1lNQk9MX05FUFRVTkUgPSBcIk5lcHR1bmVcIjtcbiAgc3RhdGljIFNZTUJPTF9QTFVUTyA9IFwiUGx1dG9cIjtcbiAgc3RhdGljIFNZTUJPTF9DSElST04gPSBcIkNoaXJvblwiO1xuICBzdGF0aWMgU1lNQk9MX0xJTElUSCA9IFwiTGlsaXRoXCI7XG4gIHN0YXRpYyBTWU1CT0xfTk5PREUgPSBcIk5Ob2RlXCI7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBTVkdVdGlscykge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBkb2N1bWVudFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR0RvY3VtZW50KHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJzdmdcIik7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnMnLCBTVkdVdGlscy5TVkdfTkFNRVNQQUNFKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2ZXJzaW9uJywgXCIxLjFcIik7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIFwiMCAwIFwiICsgd2lkdGggKyBcIiBcIiArIGhlaWdodCk7XG4gICAgcmV0dXJuIHN2Z1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBncm91cCBlbGVtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR0dyb3VwKCkge1xuICAgIGNvbnN0IGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJnXCIpO1xuICAgIHJldHVybiBnXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIHBhdGggZWxlbWVudFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdQYXRoKCkge1xuICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJwYXRoXCIpO1xuICAgIHJldHVybiBwYXRoXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIG1hc2sgZWxlbWVudFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbGVtZW50SURcbiAgICpcbiAgICogQHJldHVybiB7U1ZHTWFza0VsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHTWFzayhlbGVtZW50SUQpIHtcbiAgICBjb25zdCBtYXNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwibWFza1wiKTtcbiAgICBtYXNrLnNldEF0dHJpYnV0ZShcImlkXCIsIGVsZW1lbnRJRClcbiAgICByZXR1cm4gbWFza1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyBjaXJjdWxhciBzZWN0b3JcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2ludH0geCAtIGNpcmNsZSB4IGNlbnRlciBwb3NpdGlvblxuICAgKiBAcGFyYW0ge2ludH0geSAtIGNpcmNsZSB5IGNlbnRlciBwb3NpdGlvblxuICAgKiBAcGFyYW0ge2ludH0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1cyBpbiBweFxuICAgKiBAcGFyYW0ge2ludH0gYTEgLSBhbmdsZUZyb20gaW4gcmFkaWFuc1xuICAgKiBAcGFyYW0ge2ludH0gYTIgLSBhbmdsZVRvIGluIHJhZGlhbnNcbiAgICogQHBhcmFtIHtpbnR9IHRoaWNrbmVzcyAtIGZyb20gb3V0c2lkZSB0byBjZW50ZXIgaW4gcHhcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gc2VnbWVudFxuICAgKi9cbiAgc3RhdGljIFNWR1NlZ21lbnQoeCwgeSwgcmFkaXVzLCBhMSwgYTIsIHRoaWNrbmVzcywgbEZsYWcsIHNGbGFnKSB7XG4gICAgLy8gQHNlZSBTVkcgUGF0aCBhcmM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9TVkcvcGF0aHMuaHRtbCNQYXRoRGF0YVxuICAgIGNvbnN0IExBUkdFX0FSQ19GTEFHID0gbEZsYWcgfHwgMDtcbiAgICBjb25zdCBTV0VFVF9GTEFHID0gc0ZsYWcgfHwgMDtcblxuICAgIGNvbnN0IHNlZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJwYXRoXCIpO1xuICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZFwiLCBcIk0gXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguc2luKGExKSkgKyBcIiBBIFwiICsgcmFkaXVzICsgXCIsIFwiICsgcmFkaXVzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIFNXRUVUX0ZMQUcgKyBcIiwgXCIgKyAoeCArIHJhZGl1cyAqIE1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoeSArIHJhZGl1cyAqIE1hdGguc2luKGEyKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiAtTWF0aC5zaW4oYTIpKSArIFwiIEEgXCIgKyB0aGlja25lc3MgKyBcIiwgXCIgKyB0aGlja25lc3MgKyBcIiwwICxcIiArIExBUkdFX0FSQ19GTEFHICsgXCIsIFwiICsgMSArIFwiLCBcIiArICh4ICsgdGhpY2tuZXNzICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICh5ICsgdGhpY2tuZXNzICogTWF0aC5zaW4oYTEpKSk7XG4gICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICByZXR1cm4gc2VnbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgY2lyY2xlXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtpbnR9IGN4XG4gICAqIEBwYXJhbSB7aW50fSBjeVxuICAgKiBAcGFyYW0ge2ludH0gcmFkaXVzXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGNpcmNsZVxuICAgKi9cbiAgc3RhdGljIFNWR0NpcmNsZShjeCwgY3ksIHJhZGl1cykge1xuICAgIGNvbnN0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImNpcmNsZVwiKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3hcIiwgY3gpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBjeSk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInJcIiwgcmFkaXVzKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgcmV0dXJuIGNpcmNsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgbGluZVxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0geDFcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MlxuICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gbGluZVxuICAgKi9cbiAgc3RhdGljIFNWR0xpbmUoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwibGluZVwiKTtcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcIngxXCIsIHgxKTtcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkxXCIsIHkxKTtcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcIngyXCIsIHgyKTtcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkyXCIsIHkyKTtcbiAgICByZXR1cm4gbGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgc3ltYm9sXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4UG9zXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5UG9zXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHU3ltYm9sKG5hbWUsIHhQb3MsIHlQb3MpIHtcbiAgICBzd2l0Y2ggKG5hbWUpIHtcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVM6XG4gICAgICAgIHJldHVybiBhc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0RTOlxuICAgICAgICByZXR1cm4gZHNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQzpcbiAgICAgICAgcmV0dXJuIG1jU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSUM6XG4gICAgICAgIHJldHVybiBpY1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVJJRVM6XG4gICAgICAgIHJldHVybiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVUzpcbiAgICAgICAgcmV0dXJuIHRhdXJ1c1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSTpcbiAgICAgICAgcmV0dXJuIGdlbWluaVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUjpcbiAgICAgICAgcmV0dXJuIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xFTzpcbiAgICAgICAgcmV0dXJuIGxlb1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZJUkdPOlxuICAgICAgICByZXR1cm4gdmlyZ29TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUJSQTpcbiAgICAgICAgcmV0dXJuIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0NPUlBJTzpcbiAgICAgICAgcmV0dXJuIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUzpcbiAgICAgICAgcmV0dXJuIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOOlxuICAgICAgICByZXR1cm4gY2Fwcmljb3JuU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVFVQVJJVVM6XG4gICAgICAgIHJldHVybiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFUzpcbiAgICAgICAgcmV0dXJuIHBpc2Nlc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc3QgdW5rbm93blN5bWJvbCA9IFNWR1V0aWxzLlNWR0NpcmNsZSh4UG9zLCB5UG9zLCA4KVxuICAgICAgICByZXR1cm4gdW5rbm93blN5bWJvbFxuICAgIH1cblxuICAgIC8qXG4gICAgICogQXNjZW5kYW50IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtNDsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0yOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTAuNTYzMDc4LC0xLjEyNjE1MjcgLTEuNjg5MjI4LC0wLjU2MzA3NjUgLTEuNjg5MjI5LDAgLTEuNjg5MjMsMC41NjMwNzY1IC0wLjU2MzA3NiwxLjEyNjE1MjcgMC41NjMwNzYsMS4xMjYxNTI3MiAxLjEyNjE1NCwwLjU2MzA3NjM2IDIuODE1MzgxLDAuNTYzMDc2MzUgMS4xMjYxNTIsMC41NjMwNzY0NyAwLjU2MzA3OCwxLjEyNjE1MjYgMCwwLjU2MzA3NjMgLTAuNTYzMDc4LDEuMTI2MTUyOCAtMS42ODkyMjgsMC41NjMwNzY0IC0xLjY4OTIyOSwwIC0xLjY4OTIzLC0wLjU2MzA3NjQgLTAuNTYzMDc2LC0xLjEyNjE1MjggbSAtNi43NTY5MTYsLTEwLjEzNTM3NCAtNC41MDQ2MTEsMTEuODI0NjAzMiBtIDQuNTA0NjExLC0xMS44MjQ2MDMyIDQuNTA0NjExLDExLjgyNDYwMzIgbSAtNy4zMTk5OTI1LC0zLjk0MTUzNDU3IDUuNjMwNzYyNSwwXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBEZXNjZW5kYW50IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAyMjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0xOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTAuNTYyNSwtMS4xMjUgLTEuNjg3NSwtMC41NjI1IC0xLjY4NzUsMCAtMS42ODc1LDAuNTYyNSAtMC41NjI1LDEuMTI1IDAuNTYyNSwxLjEyNSAxLjEyNSwwLjU2MjUgMi44MTI1LDAuNTYyNSAxLjEyNSwwLjU2MjUgMC41NjI1LDEuMTI1IDAsMC41NjI1IC0wLjU2MjUsMS4xMjUgLTEuNjg3NSwwLjU2MjUgLTEuNjg3NSwwIC0xLjY4NzUsLTAuNTYyNSAtMC41NjI1LC0xLjEyNSBtIC0xMS4yNSwtMTAuMTI1IDAsMTEuODEyNSBtIDAsLTExLjgxMjUgMy45Mzc1LDAgMS42ODc1LDAuNTYyNSAxLjEyNSwxLjEyNSAwLjU2MjUsMS4xMjUgMC41NjI1LDEuNjg3NSAwLDIuODEyNSAtMC41NjI1LDEuNjg3NSAtMC41NjI1LDEuMTI1IC0xLjEyNSwxLjEyNSAtMS42ODc1LDAuNTYyNSAtMy45Mzc1LDBcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1lZGl1bSBjb2VsaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtY1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTEuMDA0MDg1LC0xLjAwNDA4NDUgLTEuMDA0MDg0LC0wLjUwMjA0MjMgLTEuNTA2MTI3LDAgLTEuMDA0MDg1LDAuNTAyMDQyMyAtMS4wMDQwODQsMS4wMDQwODQ1IC0wLjUwMjA0MywxLjUwNjEyNjg5IDAsMS4wMDQwODQ1OCAwLjUwMjA0MywxLjUwNjEyNjgzIDEuMDA0MDg0LDEuMDA0MDg0NiAxLjAwNDA4NSwwLjUwMjA0MjMgMS41MDYxMjcsMCAxLjAwNDA4NCwtMC41MDIwNDIzIDEuMDA0MDg1LC0xLjAwNDA4NDYgbSAtMTcuNTcxNDgsLTkuMDM2NzYxMiAwLDEwLjU0Mjg4ODEgbSAwLC0xMC41NDI4ODgxIDQuMDE2MzM4LDEwLjU0Mjg4ODEgbSA0LjAxNjMzOCwtMTAuNTQyODg4MSAtNC4wMTYzMzgsMTAuNTQyODg4MSBtIDQuMDE2MzM4LC0xMC41NDI4ODgxIDAsMTAuNTQyODg4MVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogSW1tdW0gY29lbGkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gaWNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDg7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSA5OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTEuMjA4ODUyLC0xLjIwODg1MTQgLTEuMjA4ODUxLC0wLjYwNDQyNTggLTEuODEzMjc4LDAgLTEuMjA4ODUyLDAuNjA0NDI1OCAtMS4yMDg4NSwxLjIwODg1MTQgLTAuNjA0NDI2LDEuODEzMjc3MTUgMCwxLjIwODg1MTM1IDAuNjA0NDI2LDEuODEzMjc3MiAxLjIwODg1LDEuMjA4ODUxMyAxLjIwODg1MiwwLjYwNDQyNTkgMS44MTMyNzgsMCAxLjIwODg1MSwtMC42MDQ0MjU5IDEuMjA4ODUyLC0xLjIwODg1MTMgbSAtMTEuNDg0MDkwMiwtMTAuODc5NjYyOSAwLDEyLjY5Mjk0MDFcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEFyaWVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFyaWVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0yOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTAuOSwtMC45IDAsLTEuOCAwLjksLTEuOCAxLjgsLTAuODk5OTk5OCAxLjgsMCAxLjgsMC44OTk5OTk4IDAuOSwwLjkgMC45LDEuOCAwLjksNC41IG0gLTksLTUuNCAxLjgsLTEuOCAxLjgsMCAxLjgsMC45IDAuOSwwLjkgMC45LDEuOCAwLjksMy42IDAsOS45IG0gOC4xLC0xMi42IDAuOSwtMC45IDAsLTEuOCAtMC45LC0xLjggLTEuOCwtMC44OTk5OTk4IC0xLjgsMCAtMS44LDAuODk5OTk5OCAtMC45LDAuOSAtMC45LDEuOCAtMC45LDQuNSBtIDksLTUuNCAtMS44LC0xLjggLTEuOCwwIC0xLjgsMC45IC0wLjksMC45IC0wLjksMS44IC0wLjksMy42IDAsOS45XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBUYXVydXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdGF1cnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0xMTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDEsNCAxLDIgMiwyIDMsMSA0LDAgMywtMSAyLC0yIDEsLTIgMSwtNCBtIC0xOCwwIDEsMyAxLDIgMiwyIDMsMSA0LDAgMywtMSAyLC0yIDEsLTIgMSwtMyBtIC0xMSw4IC0yLDEgLTEsMSAtMSwyIDAsMyAxLDIgMiwyIDIsMSAyLDAgMiwtMSAyLC0yIDEsLTIgMCwtMyAtMSwtMiAtMSwtMSAtMiwtMSBtIC00LDEgLTIsMSAtMSwyIDAsMyAxLDMgbSA4LDAgMSwtMyAwLC0zIC0xLC0yIC0yLC0xXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBHZW1pbmkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtNjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC02OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMCwxMS41NDY0MTQgbSAwLjk2MjIwMTEsLTEwLjU4NDIxMjkgMCw5LjYyMjAxMTcgbSA3LjY5NzYwOTcsLTkuNjIyMDExNyAwLDkuNjIyMDExNyBtIDAuOTYyMjAxLC0xMC41ODQyMTI4IDAsMTEuNTQ2NDE0IG0gLTEzLjQ3MDgxNjUsLTE0LjQzMzAxNzIgMS45MjQ0MDIzLDEuOTI0NDAyIDEuOTI0NDAyNCwwLjk2MjIwMTIgMi44ODY2MDM4LDAuOTYyMjAxMSAzLjg0ODgwNCwwIDIuODg2NjA0LC0wLjk2MjIwMTEgMS45MjQ0MDIsLTAuOTYyMjAxMiAxLjkyNDQwMywtMS45MjQ0MDIgbSAtMTcuMzE5NjIxNSwxNy4zMTk2MjA3IDEuOTI0NDAyMywtMS45MjQ0MDI0IDEuOTI0NDAyNCwtMC45NjIyMDExIDIuODg2NjAzOCwtMC45NjIyMDEyIDMuODQ4ODA0LDAgMi44ODY2MDQsMC45NjIyMDEyIDEuOTI0NDAyLDAuOTYyMjAxMSAxLjkyNDQwMywxLjkyNDQwMjRcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENhbmNlciBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYW5jZXJTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0xNSwwIC0yLDEgLTEsMiAwLDIgMSwyIDIsMSAyLDAgMiwtMSAxLC0yIDAsLTIgLTEsLTIgMTEsMCBtIC0xOCwzIDEsMiAxLDEgMiwxIG0gNCwtNCAtMSwtMiAtMSwtMSAtMiwtMSBtIC00LDE1IDE1LDAgMiwtMSAxLC0yIDAsLTIgLTEsLTIgLTIsLTEgLTIsMCAtMiwxIC0xLDIgMCwyIDEsMiAtMTEsMCBtIDE4LC0zIC0xLC0yIC0xLC0xIC0yLC0xIG0gLTQsNCAxLDIgMSwxIDIsMVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogTGVvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTM7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSA0OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTIsLTEgLTEsMCAtMiwxIC0xLDIgMCwxIDEsMiAyLDEgMSwwIDIsLTEgMSwtMiAwLC0xIC0xLC0yIC01LC01IC0xLC0yIDAsLTMgMSwtMiAyLC0xIDMsLTEgNCwwIDQsMSAyLDIgMSwyIDAsMyAtMSwzIC0zLDMgLTEsMiAwLDIgMSwyIDIsMCAxLC0xIDEsLTIgbSAtMTMsLTUgLTIsLTMgLTEsLTIgMCwtMyAxLC0yIDEsLTEgbSA3LC0xIDMsMSAyLDIgMSwyIDAsMyAtMSwzIC0yLDNcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFZpcmdvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC01OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMi41ODk0ODY4LC0yLjU4OTQ4NjggMS43MjYzMjQ1LDIuNTg5NDg2OCAwLDkuNDk0Nzg0NyBtIC0yLjU4OTQ4NjgsLTExLjIyMTEwOTIgMS43MjYzMjQ1LDIuNTg5NDg2NyAwLDguNjMxNjIyNSBtIDAuODYzMTYyMywtOS40OTQ3ODQ3IDIuNTg5NDg2NywtMi41ODk0ODY4IDEuNzI2MzI0NTEsMi41ODk0ODY4IDAsOC42MzE2MjI0IG0gLTIuNTg5NDg2NzEsLTEwLjM1Nzk0NjkgMS43MjYzMjQ0NywyLjU4OTQ4NjcgMCw3Ljc2ODQ2MDIgbSAwLjg2MzE2MjI0LC04LjYzMTYyMjQgMi41ODk0ODY3OSwtMi41ODk0ODY4IDEuNzI2MzI0NCwyLjU4OTQ4NjggMCwxMy44MTA1OTU5IG0gLTIuNTg5NDg2NywtMTUuNTM2OTIwNCAxLjcyNjMyNDUsMi41ODk0ODY3IDAsMTIuOTQ3NDMzNyBtIDAuODYzMTYyMiwtMTMuODEwNTk1OSAyLjU4OTQ4NjgsLTIuNTg5NDg2OCAwLjg2MzE2MjIsMS43MjYzMjQ1IDAuODYzMTYyMywyLjU4OTQ4NjggMCwyLjU4OTQ4NjcgLTAuODYzMTYyMywyLjU4OTQ4NjczIC0wLjg2MzE2MjIsMS43MjYzMjQ0NyAtMS43MjYzMjQ1LDEuNzI2MzI0NSAtMi41ODk0ODY3LDEuNzI2MzI0NSAtNC4zMTU4MTEzLDEuNzI2MzI0NSBtIDcuNzY4NDYwMiwtMTUuNTM2OTIwNCAwLjg2MzE2MjMsMC44NjMxNjIyIDAuODYzMTYyMiwyLjU4OTQ4NjggMCwyLjU4OTQ4NjcgLTAuODYzMTYyMiwyLjU4OTQ4NjczIC0wLjg2MzE2MjMsMS43MjYzMjQ0NyAtMS43MjYzMjQ1LDEuNzI2MzI0NSAtMi41ODk0ODY3LDEuNzI2MzI0NSAtMy40NTI2NDksMS43MjYzMjQ1XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBMaWJyYSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsaWJyYVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTI7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtODsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIGMgMC43NTE5LDFlLTUgMS4zOTI0LDAuMTIyMjcgMS45MzE2LDAuMzUxNTYgMC42NjE5LDAuMjg0OTUgMS4yMTM0LDAuNjM4NTQgMS42NjYsMS4wNjI1IDAuNDgzOCwwLjQ1NDgxIDAuODUzLDAuOTcyNTUgMS4xMTcyLDEuNTY2NDEgMC4yNDY3LDAuNTY2MTIgMC4zNzExLDEuMTczOTcgMC4zNzExLDEuODM3ODkgMCwwLjY0MTEzIC0wLjEyNDQsMS4yMzk0OCAtMC4zNzMsMS44MDg1OSAtMC4xNjI0LDAuMzYzMDUgLTAuMzYzMSwwLjY5NzI1IC0wLjYwNTUsMS4wMDU4NiBsIC0wLjYzNjcsMC44MDg2IDQuMzc4OSwwIDAsMC42NzE4NyAtNS40MDI0LDAgMCwtMC45MTc5NyBjIDAuMjE3MywtMC4xMzg1IDAuNDM3OSwtMC4yNzI0NCAwLjYzNjcsLTAuNDQ3MjYgMC40MjE1LC0wLjM2ODc2IDAuNzUyOSwtMC44Mjc4NCAwLjk4ODMsLTEuMzU1NDcgMC4yMjE1LC0wLjUwMDc0IDAuMzM0LC0xLjAzNTggMC4zMzQsLTEuNTg1OTQgMCwtMC41NTY1MyAtMC4xMTIyLC0xLjA5NDM0IC0wLjMzNCwtMS41OTU3IGwgLTAsLTAuMDAyIDAsLTAuMDA0IGMgLTAuMjI5MiwtMC40OTkwMSAtMC41NTgxLC0wLjk0Nzc4IC0wLjk3NDYsLTEuMzM3ODkgbCAtMCwtMC4wMDIgLTAsLTAuMDAyIGMgLTAuMzk2NywtMC4zNjE1NSAtMC44Njc5LC0wLjY1NzIzIC0xLjQwNjIsLTAuODg0NzYgbCAtMCwwIGMgLTAuNDk4NCwtMC4yMDkwMyAtMS4wNjIyLC0wLjMwNjYzIC0xLjY4MTcsLTAuMzA2NjQgLTAuNTkyNiwxZS01IC0xLjE1MjYsMC4xMDAwOCAtMS42Njk5LDAuMzAyNzMgbCAtMCwwIGMgLTAuNTI2MSwwLjIwNzk5IC0xLjAwMzIsMC41MDY3IC0xLjQxOTksMC44ODg2NyBsIC0wLDAuMDAyIC0wLDAuMDAyIGMgLTAuNDE2NiwwLjM5MDExIC0wLjc0NTQsMC44Mzg4NyAtMC45NzQ2LDEuMzM3ODkgbCAwLDAuMDA0IC0wLDAuMDAyIGMgLTAuMjIxOCwwLjUwMTM2IC0wLjMzNCwxLjAzOTE1IC0wLjMzNCwxLjU5NTcgMCwwLjU1MDE1IDAuMTEyNSwxLjA4NTE5IDAuMzM0LDEuNTg1OTQgbCAwLDAuMDAyIDAsMC4wMDQgYyAwLjIyOSwwLjQ5ODU1IDAuNTU3NCwwLjk0OTExIDAuOTc0NiwxLjMzOTg0IDAuMTg3NiwwLjE3NDgyIDAuNDE0MywwLjMxNDg0IDAuNjM2NywwLjQ1NzAzIGwgMCwwLjkxNzk3IC01LjM5MDYsMCAwLC0wLjY3MTg3IDQuMzc4OSwwIC0wLjYzNjcsLTAuODA4NiBjIC0wLjI0MjgsLTAuMzA5MDQgLTAuNDQzLC0wLjY0NDE4IC0wLjYwNTUsLTEuMDA3ODEgLTAuMjQ4NywtMC41NjkxMSAtMC4zNzMxLC0xLjE2NTUyIC0wLjM3MzEsLTEuODA2NjQgMCwtMC42NjM5MSAwLjEyNDQsLTEuMjcxNzggMC4zNzExLC0xLjgzNzg5IGwgMCwtMC4wMDIgYyAzZS00LC01LjhlLTQgLTJlLTQsLTEwZS00IDAsLTAuMDAyIDAuMjY0MSwtMC41OTIxOCAwLjYzMjYsLTEuMTA4NzEgMS4xMTUzLC0xLjU2MjUgMC40ODQ3LC0wLjQ1NTcxIDEuMDMzMiwtMC44MDU4NSAxLjY1NjIsLTEuMDU4NTkgMC41ODYxLC0wLjIzNDg4IDEuMjI5NCwtMC4zNTU0NiAxLjk0MTQsLTAuMzU1NDcgeiBtIC03Ljg0OTYsMTMuNDU4OTkgMTUuNjk5MiwwIDAsMC42NzE4NyAtMTUuNjk5MiwwIHpcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNjb3JwaW8gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2NvcnBpb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtNDsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDIuMzc4MTEwMSwtMi4zNzgxMTAxIDIuMzc4MTEwMSwyLjM3ODExMDEgMCw5LjUxMjQ0MDQgbSAtMy4xNzA4MTM1LC0xMS4wOTc4NDcxIDIuMzc4MTEwMSwyLjM3ODExMDEgMCw4LjcxOTczNyBtIDAuNzkyNzAzNCwtOS41MTI0NDA0IDIuMzc4MTEwMSwtMi4zNzgxMTAxIDIuMzc4MTEwMDcsMi4zNzgxMTAxIDAsOS41MTI0NDA0IG0gLTMuMTcwODEzNDcsLTExLjA5Nzg0NzEgMi4zNzgxMTAxLDIuMzc4MTEwMSAwLDguNzE5NzM3IG0gMC43OTI3MDMzNywtOS41MTI0NDA0IDIuMzc4MTEwMTMsLTIuMzc4MTEwMSAyLjM3ODExMDEsMi4zNzgxMTAxIDAsOC43MTk3MzcgMS41ODU0MDY3LDEuNTg1NDA2OCBtIC00Ljc1NjIyMDIsLTExLjg5MDU1MDUgMi4zNzgxMTAxLDIuMzc4MTEwMSAwLDguNzE5NzM3IDEuNTg1NDA2NywxLjU4NTQwNjcgMi4zNzgxMTAxLC0yLjM3ODExMDFcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNhZ2l0dGFyaXVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSA3OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMTcuMTE0NDQsMTcuMTE0NDQgbSAxNy4xMTQ0NCwtMTcuMTE0NDQgLTMuMjA4OTU3NSwxLjA2OTY1MjUgLTYuNDE3OTE1LDAgbSA3LjQ4NzU2NzUsMS4wNjk2NTI1IC0zLjIwODk1NzUsMCAtNC4yNzg2MSwtMS4wNjk2NTI1IG0gOS42MjY4NzI1LC0xLjA2OTY1MjUgLTEuMDY5NjUyNSwzLjIwODk1NzUgMCw2LjQxNzkxNTA0IG0gLTEuMDY5NjUyNSwtNy40ODc1Njc1NCAwLDMuMjA4OTU3NSAxLjA2OTY1MjUsNC4yNzg2MTAwNCBtIC04LjU1NzIyLDAgLTcuNDg3NTY3NSwwIG0gNi40MTc5MTUsMS4wNjk2NTI0NiAtMy4yMDg5NTc1LDAgLTMuMjA4OTU3NSwtMS4wNjk2NTI0NiBtIDcuNDg3NTY3NSwwIDAsNy40ODc1Njc0NiBtIC0xLjA2OTY1MjUsLTYuNDE3OTE1IDAsMy4yMDg5NTc1IDEuMDY5NjUyNSwzLjIwODk1NzVcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENhcHJpY29ybiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYXByaWNvcm5TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTM7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAxLjgwNDc2MzMsLTMuNjA5NTI2NyA0LjUxMTkwODQsOS4wMjM4MTY4IG0gLTQuNTExOTA4NCwtNy4yMTkwNTM0IDQuNTExOTA4NCw5LjAyMzgxNjcgMi43MDcxNDUsLTYuMzE2NjcxNyA0LjUxMTkwODQsMCAyLjcwNzE0NSwtMC45MDIzODE3IDAuOTAyMzgxNywtMS44MDQ3NjMzIDAsLTEuODA0NzYzNCAtMC45MDIzODE3LC0xLjgwNDc2MzMgLTEuODA0NzYzNCwtMC45MDIzODE3IC0wLjkwMjM4MTYsMCAtMS44MDQ3NjM0LDAuOTAyMzgxNyAtMC45MDIzODE3LDEuODA0NzYzMyAwLDEuODA0NzYzNCAwLjkwMjM4MTcsMi43MDcxNDUgMC45MDIzODE3LDEuODA0NzYzMzYgMC45MDIzODE3LDIuNzA3MTQ1MDQgMCwyLjcwNzE0NSAtMS44MDQ3NjM0LDEuODA0NzYzMyBtIDEuODA0NzYzNCwtMTYuMjQyODcwMSAtMC45MDIzODE3LDAuOTAyMzgxNyAtMC45MDIzODE3LDEuODA0NzYzMyAwLDEuODA0NzYzNCAxLjgwNDc2MzQsMy42MDk1MjY3IDAuOTAyMzgxNiwyLjcwNzE0NSAwLDIuNzA3MTQ1IC0wLjkwMjM4MTYsMS44MDQ3NjM0IC0xLjgwNDc2MzQsMC45MDIzODE2XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBcXVhcml1cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTg7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMjsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDIuODg2NjAzNSwtMi44ODY2MDM1IDMuODQ4ODA0NywxLjkyNDQwMjMgbSAtNC44MTEwMDU5LC0wLjk2MjIwMTEgMy44NDg4MDQ3LDEuOTI0NDAyMyAyLjg4NjYwMzUsLTIuODg2NjAzNSAyLjg4NjYwMzUsMS45MjQ0MDIzIG0gLTMuODQ4ODA0NjcsLTAuOTYyMjAxMSAyLjg4NjYwMzQ3LDEuOTI0NDAyMyAyLjg4NjYwMzUsLTIuODg2NjAzNSAxLjkyNDQwMjQsMS45MjQ0MDIzIG0gLTIuODg2NjAzNSwtMC45NjIyMDExIDEuOTI0NDAyMywxLjkyNDQwMjMgMi44ODY2MDM1LC0yLjg4NjYwMzUgbSAtMTcuMzE5NjIxLDguNjU5ODEwNSAyLjg4NjYwMzUsLTIuODg2NjAzNDggMy44NDg4MDQ3LDEuOTI0NDAyMzggbSAtNC44MTEwMDU5LC0wLjk2MjIwMTIxIDMuODQ4ODA0NywxLjkyNDQwMjMxIDIuODg2NjAzNSwtMi44ODY2MDM0OCAyLjg4NjYwMzUsMS45MjQ0MDIzOCBtIC0zLjg0ODgwNDY3LC0wLjk2MjIwMTIxIDIuODg2NjAzNDcsMS45MjQ0MDIzMSAyLjg4NjYwMzUsLTIuODg2NjAzNDggMS45MjQ0MDI0LDEuOTI0NDAyMzggbSAtMi44ODY2MDM1LC0wLjk2MjIwMTIxIDEuOTI0NDAyMywxLjkyNDQwMjMxIDIuODg2NjAzNSwtMi44ODY2MDM0OFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogUGlzY2VzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBpc2Nlc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTg7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtODsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDQsMiAyLDIgMSwzIDAsMyAtMSwzIC0yLDIgLTQsMiBtIDAsLTE3IDMsMSAyLDEgMiwyIDEsMyBtIDAsMyAtMSwzIC0yLDIgLTIsMSAtMywxIG0gMTYsLTE3IC0zLDEgLTIsMSAtMiwyIC0xLDMgbSAwLDMgMSwzIDIsMiAyLDEgMywxIG0gMCwtMTcgLTQsMiAtMiwyIC0xLDMgMCwzIDEsMyAyLDIgNCwyIG0gLTE3LC05IDE4LDAgbSAtMTgsMSAxOCwwXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gIH1cblxufVxuXG5leHBvcnQge1xuICBTVkdVdGlscyBhc1xuICBkZWZhdWx0XG59XG4iLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFV0aWxzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFV0aWxzKSB7XG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgREVHXzM2MCA9IDM2MFxuICBzdGF0aWMgREVHXzE4MCA9IDE4MFxuXG4gIC8qKlxuICAgKiBJbnZlcnRlZCBkZWdyZWUgdG8gcmFkaWFuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5kZWdyZWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNoaWZ0SW5EZWdyZWVcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGRlZ3JlZVRvUmFkaWFuID0gZnVuY3Rpb24oYW5nbGVJbkRlZ3JlZSwgc2hpZnRJbkRlZ3JlZSA9IDApIHtcbiAgICByZXR1cm4gKChzaGlmdEluRGVncmVlIC0gYW5nbGVJbkRlZ3JlZSkgJSAzNjApICogTWF0aC5QSSAvIDE4MFxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHJhZGlhbiB0byBkZWdyZWVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaWFuXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIHN0YXRpYyByYWRpYW5Ub0RlZ3JlZSA9IGZ1bmN0aW9uKHJhZGlhbikge1xuICAgIHJldHVybiAocmFkaWFuICogMTgwIC8gTWF0aC5QSSkgJSAzNjBcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGEgcG9zaXRpb24gb2YgdGhlIHBvaW50IG9uIHRoZSBjaXJjbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjeCAtIGNlbnRlciB4XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjeSAtIGNlbnRlciB5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZUluUmFkaWFuc1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge3g6TnVtYmVyLCB5Ok51bWJlcn1cbiAgICovXG4gIHN0YXRpYyBwb3NpdGlvbk9uQ2lyY2xlKGN4LCBjeSwgcmFkaXVzLCBhbmdsZUluUmFkaWFucykge1xuICAgIHJldHVybiB7XG4gICAgICB4OiBNYXRoLnJvdW5kKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKSArIGN4KSxcbiAgICAgIHk6IE1hdGgucm91bmQocmFkaXVzICogTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpICsgY3kpXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIG5ldyBwb3NpdGlvbiBvZiBwb2ludHMgb24gY2lyY2xlIHdpdGhvdXQgb3ZlcmxhcHBpbmcgZWFjaCBvdGhlclxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBJZiB0aGVyZSBpcyBubyBwbGFjZSBvbiB0aGUgY2lyY2xlIHRvIHBsYWNlIHBvaW50cy5cbiAgICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIC0gW3tuYW1lOlwiYVwiLCBwb3NpdGlvbjoxMH0sIHtuYW1lOlwiYlwiLCBwb3NpdGlvbjoyMH1dXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb2ludFJhZGl1cyAtIHBvaW50IHJhZGl1c1xuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1c1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge1wiTW9vblwiOjMwLCBcIlN1blwiOjYwLCBcIk1lcmN1cnlcIjo4NiwgLi4ufVxuICAgKi9cbiAgc3RhdGljIGNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgcG9pbnRSYWRpdXMsIGNpcmNsZVJhZGl1cykge1xuICAgIGNvbnN0IHBvaW50V2lkdGggPSAyICogcG9pbnRSYWRpdXNcbiAgICBjb25zdCBjaXJjbGVDaXJjdW1mZXJlbmNlID0gMiAqIE1hdGguUEkgKiBjaXJjbGVSYWRpdXNcbiAgICBjb25zdCBwb2ludHNDaXJjdW1mZXJlbmNlID0gcG9pbnRzLmxlbmd0aCAqIHBvaW50V2lkdGhcbiAgICBpZiAocG9pbnRzQ2lyY3VtZmVyZW5jZSA+IGNpcmNsZUNpcmN1bWZlcmVuY2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlcmUgaXMgbm8gcGxhY2Ugb24gdGhlIGNpcmNsZSB0byBwbGFjZSBwb2ludHMuYClcbiAgICB9XG5cbiAgICBwb2ludHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEucG9zaXRpb24gLSBiLnBvc2l0aW9uXG4gICAgfSlcblxuICAgIGNvbnN0IG51bWJlck9mQ2VsbHNJblNjYWxhciA9IE1hdGguZmxvb3IoY2lyY2xlQ2lyY3VtZmVyZW5jZSAvIHBvaW50V2lkdGgpXG4gICAgY29uc3QgY2VsbFdpZHRoID0gREVHXzM2MC9udW1iZXJPZkNlbGxzSW5TY2FsYXJcbiAgICBjb25zdCBzY2FsYXIgPSBuZXcgQXJyYXkobnVtYmVyT2ZDZWxsc0luU2NhbGFyKVxuXG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBwb2ludHMpIHtcbiAgICAgIGxldCBpZHggPSBNYXRoLmZsb29yKHBvaW50LnBvc2l0aW9uIC8gcG9pbnRXaWR0aClcblxuICAgICAgd2hpbGUgKHNjYWxhcltpZHhdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWR4ID0gKGlkeCArIDEpICUgbnVtYmVyT2ZDZWxsc0luU2NhbGFyXG4gICAgICB9XG5cbiAgICAgIHNjYWxhcltpZHhdID0gcG9pbnRcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhzY2FsYXIpXG5cbiAgICByZXR1cm4gc2NhbGFyLnJlZHVjZSgoYWNjdW11bGF0b3IsIHBvaW50LCBjdXJyZW50SW5kZXgpID0+IHtcblxuICAgICAgLy8gYSBQb2ludCBoYXMgYSBzcGFjZSB0byBkcmF3IGl0c2VsZiBhdCB0aGUgcHJlY2lzZSBwb3NpdGlvbi5cbiAgICAgIGlmIChzY2FsYXJbKGN1cnJlbnRJbmRleCAtIDEpICUgbnVtYmVyT2ZDZWxsc0luU2NhbGFyXSA9PT0gdW5kZWZpbmVkICYmIHNjYWxhclsoY3VycmVudEluZGV4ICsgMSkgJSBudW1iZXJPZkNlbGxzSW5TY2FsYXJdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYWNjdW11bGF0b3JbcG9pbnQubmFtZV0gPSBwb2ludC5wb3NpdGlvblxuICAgICAgICByZXR1cm4gYWNjdW11bGF0b3JcbiAgICAgIH1cblxuICAgICAgYWNjdW11bGF0b3JbcG9pbnQubmFtZV0gPSAoY3VycmVudEluZGV4ICogcG9pbnRXaWR0aCkgLSBwb2ludFJhZGl1c1xuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yXG4gICAgfSwge30pXG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgVXRpbHMgYXNcbiAgZGVmYXVsdFxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi91bml2ZXJzZS9Vbml2ZXJzZS5qcydcblxuZXhwb3J0IHtVbml2ZXJzZSBhcyBcIkNoYXJ0XCJ9XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=