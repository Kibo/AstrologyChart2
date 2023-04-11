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
    const innerCircleRadius = this.#radius - this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO
    const POINT_RADIUS = innerCircleRadius - (4*RadixChart.RULER_LENGTH)

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
      symbol.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
      wrapper.appendChild(symbol);

      // pointer
      //if (positions[point.getName()] != pointData.position) {
      const pointerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, POINT_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(positions[point.getName()], this.#anscendantShift))
      const pointerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(pointPosition.x, pointPosition.y, (pointPosition.x + pointerLineEndPosition.x) / 2, (pointPosition.y + pointerLineEndPosition.y) / 2)
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
* Line strength of the main lines. For instance points, main axis, main circles
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
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../charts/TransitChart.js */ "./src/charts/TransitChart.js");






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

    this.#settings = Object.assign({}, _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_0__["default"], options, {
      HTML_ELEMENT_ID: htmlElementID
    });
    this.#SVGDocument = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGDocument(this.#settings.CHART_VIEWBOX_WIDTH, this.#settings.CHART_VIEWBOX_HEIGHT)
    document.getElementById(htmlElementID).appendChild(this.#SVGDocument);

    this.#radix = new _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__["default"](this.#SVGDocument, this.#settings)
    this.#transit = new _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__["default"](this.#SVGDocument, this.#settings)

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

      case SVGUtils.SYMBOL_SUN:
        return sunSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_MOON:
        return moonSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_MERCURY:
        return mercurySymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_VENUS:
        return venusSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_MARS:
        return marsSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_JUPITER:
        return jupiterSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SATURN:
        return saturnSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_URANUS:
        return uranusSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_NEPTUNE:
        return neptuneSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_PLUTO:
        return plutoSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_CHIRON:
        return chironSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_LILITH:
        return lilithSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_NNODE:
        return nnodeSymbol(xPos, yPos)
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

    /*
     * Sun symbol
     */
    function sunSymbol(xPos, yPos) {
      const X_SHIFT = -1; //px
      const Y_SHIFT = -7; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -2.18182,0.727268 -2.181819,1.454543 -1.454552,2.18182 -0.727268,2.181819 0,2.181819 0.727268,2.181819 1.454552,2.18182 2.181819,1.454544 2.18182,0.727276 2.18181,0 2.18182,-0.727276 2.181819,-1.454544 1.454552,-2.18182 0.727268,-2.181819 0,-2.181819 -0.727268,-2.181819 -1.454552,-2.18182 -2.181819,-1.454543 -2.18182,-0.727268 -2.18181,0 m 0.727267,6.54545 -0.727267,0.727276 0,0.727275 0.727267,0.727268 0.727276,0 0.727267,-0.727268 0,-0.727275 -0.727267,-0.727276 -0.727276,0 m 0,0.727276 0,0.727275 0.727276,0 0,-0.727275 -0.727276,0");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Moon symbol
     */
    function moonSymbol(xPos, yPos) {
      const X_SHIFT = -4; //px
      const Y_SHIFT = -7; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " a 7.4969283,7.4969283 0 0 1 0,14.327462 7.4969283,7.4969283 0 1 0 0,-14.327462 z");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Mercury symbol
     */
    function mercurySymbol(xPos, yPos) {
      const X_SHIFT = -2; //px
      const Y_SHIFT = 7; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT

      const wrapper = SVGUtils.SVGGroup()

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " 4.26011,0 m -2.13005,-2.98207 0,5.11213 m 4.70312,-9.7983 a 4.70315,4.70315 0 0 1 -4.70315,4.70314 4.70315,4.70315 0 0 1 -4.70314,-4.70314 4.70315,4.70315 0 0 1 4.70314,-4.70315 4.70315,4.70315 0 0 1 4.70315,4.70315 z");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      const crownXShift = 6; //px
      const crownYShift = -16; //px
      const crown = SVGUtils.SVGPath()
      crown.setAttribute("d", "m" + (x + crownXShift) + ", " + (y + crownYShift) + " a 3.9717855,3.9717855 0 0 1 -3.95541,3.59054 3.9717855,3.9717855 0 0 1 -3.95185,-3.59445");
      crown.setAttribute("fill", "none");
      wrapper.appendChild(crown)

      return wrapper
    }

    /*
     * Venus symbol
     */
    function venusSymbol(xPos, yPos) {
      const X_SHIFT = 2; //px
      const Y_SHIFT = 7; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -4.937669,0.03973 m 2.448972,2.364607 0,-5.79014 c -3.109546,-0.0085 -5.624617,-2.534212 -5.620187,-5.64208 0.0044,-3.107706 2.526514,-5.621689 5.635582,-5.621689 3.109068,0 5.631152,2.513983 5.635582,5.621689 0.0044,3.107868 -2.510641,5.633586 -5.620187,5.64208");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Mars symbol
     */
    function marsSymbol(xPos, yPos) {
      const X_SHIFT = 3; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " c -5.247438,-4.150623 -11.6993,3.205518 -7.018807,7.886007 4.680494,4.680488 12.036628,-1.771382 7.885999,-7.018816 z m 0,0 0.433597,0.433595 3.996566,-4.217419 m -3.239802,-0.05521 3.295015,0 0.110427,3.681507");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Jupiter symbol
     */
    function jupiterSymbol(xPos, yPos) {
      const X_SHIFT = -6; //px
      const Y_SHIFT = -2; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " c -0.43473,0 -1.30422,-0.40572 -1.30422,-2.02857 0,-1.62285 1.73897,-3.2457 3.47792,-3.2457 1.73897,0 3.47792,1.21715 3.47792,4.05713 0,2.83999 -2.1737,7.30283 -6.52108,7.30283 m 12.17269,0 -12.60745,0 m 9.99902,-11.76567 0,15.82279");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Saturn symbol
     */
    function saturnSymbol(xPos, yPos) {
      const X_SHIFT = 4; //px
      const Y_SHIFT = 7; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " c -0.52222,0.52221 -1.04445,1.04444 -1.56666,1.04444 -0.52222,0 -1.56667,-0.52223 -1.56667,-1.56667 0,-1.04443 0.52223,-2.08887 1.56667,-3.13332 1.04444,-1.04443 2.08888,-3.13331 2.08888,-5.22219 0,-2.08888 -1.04444,-4.17776 -3.13332,-4.17776 -1.97566,0 -3.65555,1.04444 -4.69998,3.13333 m -2.55515,-5.87499 6.26664,0 m -3.71149,-2.48054 0,15.14438");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Uranus symbol
     */
    function uranusSymbol(xPos, yPos) {
      const X_SHIFT = -5; //px
      const Y_SHIFT = -6; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT

      const wrapper = SVGUtils.SVGGroup()

      const horns = SVGUtils.SVGPath()
      horns.setAttribute("d", "m" + x + ", " + y + "  0,10.23824 m 10.23633,-10.32764 0,10.23824 m -10.26606,-4.6394 10.23085,0 m -5.06415,-5.51532 0,11.94985");
      horns.setAttribute("fill", "none");
      wrapper.appendChild(horns)

      const bodyXShift = 7; //px
      const bodyYShift = 13; //px
      const body = SVGUtils.SVGPath()
      body.setAttribute("d", "m" + (x + bodyXShift) + ", " + (y + bodyYShift) + " a 1.8384377,1.8384377 0 0 1 -1.83844,1.83843 1.8384377,1.8384377 0 0 1 -1.83842,-1.83843 1.8384377,1.8384377 0 0 1 1.83842,-1.83844 1.8384377,1.8384377 0 0 1 1.83844,1.83844 z");
      body.setAttribute("fill", "none");
      wrapper.appendChild(body)

      return wrapper

    }

    /*
     * Neptune symbol
     */
    function neptuneSymbol(xPos, yPos) {
      const X_SHIFT = 4; //px
      const Y_SHIFT = -6; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " 1.77059,-2.36312 2.31872,1.8045 m -14.44264,-0.20006 2.34113,-1.77418 1.74085,2.38595 m -1.80013,-1.77265 c -1.23776,8.40975 0.82518,9.67121 4.95106,9.67121 4.12589,0 6.18883,-1.26146 4.95107,-9.67121 m -7.05334,3.17005 2.03997,-2.12559 2.08565,2.07903 m -5.32406,9.91162 6.60142,0 m -3.30071,-12.19414 0,15.55803");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * Pluto symbol
     */
    function plutoSymbol(xPos, yPos) {
      const X_SHIFT = 6; //px
      const Y_SHIFT = -7; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT

      const wrapper = SVGUtils.SVGGroup()

      const body = SVGUtils.SVGPath()
      body.setAttribute("d", "m" + x + ", " + y + " a 5.7676856,5.7676856 0 0 1 -2.88385,4.99496 5.7676856,5.7676856 0 0 1 -5.76768,0 5.7676856,5.7676856 0 0 1 -2.88385,-4.99496 m 5.76771,13.93858 0,-8.17088 m -3.84512,4.32576 7.69024,0");
      body.setAttribute("fill", "none");
      wrapper.appendChild(body)

      const headXShift = -2.4; //px
      const headYShift = -1; //px
      const head = SVGUtils.SVGPath()
      head.setAttribute("d", "m" + (x + headXShift) + ", " + (y + headYShift) + " a 3.3644834,3.3644834 0 0 1 -3.36448,3.36449 3.3644834,3.3644834 0 0 1 -3.36448,-3.36449 3.3644834,3.3644834 0 0 1 3.36448,-3.36448 3.3644834,3.3644834 0 0 1 3.36448,3.36448 z");
      head.setAttribute("fill", "none");
      wrapper.appendChild(head)

      return wrapper
    }

    /*
     * Chiron symbol
     */
    function chironSymbol(xPos, yPos) {
      const X_SHIFT = 4; //px
      const Y_SHIFT = 3; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT

      const wrapper = SVGUtils.SVGGroup()

      const body = SVGUtils.SVGPath()
      body.setAttribute("d", "m" + x + ", " + y + " a 3.8764725,3.0675249 0 0 1 -3.876473,3.067525 3.8764725,3.0675249 0 0 1 -3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876473,3.067525 z");
      body.setAttribute("fill", "none");
      wrapper.appendChild(body)

      const headXShift = 0; //px
      const headYShift = -14.5; //px
      const head = SVGUtils.SVGPath()
      head.setAttribute("d", "m" + (x + headXShift) + ", " + (y + headYShift) + "   -3.942997,4.243844 4.110849,3.656151 m -4.867569,-9.009468 0,11.727251");
      head.setAttribute("fill", "none");
      wrapper.appendChild(head)

      return wrapper
    }

    /*
     * Lilith symbol
     */
    function lilithSymbol(xPos, yPos) {
      const X_SHIFT = 2; //px
      const Y_SHIFT = 3; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -2.525435,-1.12853 -1.464752,-1.79539 -0.808138,-2.20576 0.151526,-2.05188 0.909156,-1.5389 1.010173,-1.02593 0.909157,-0.56427 1.363735,-0.61556 m 2.315327,-0.39055 -1.716301,0.54716 -1.7163,1.09431 -1.1442,1.64146 -0.572102,1.64146 0,1.64146 0.572102,1.64147 1.1442,1.64145 1.7163,1.09432 1.716301,0.54715 m 0,-11.49024 -2.2884,0 -2.288401,0.54716 -1.716302,1.09431 -1.144201,1.64146 -0.5721,1.64146 0,1.64146 0.5721,1.64147 1.144201,1.64145 1.716302,1.09432 2.288401,0.54715 2.2884,0 m -4.36712,-0.4752 0,6.44307 m -2.709107,-3.41101 5.616025,0");
      path.setAttribute("fill", "none");
      return path
    }

    /*
     * NNode symbol
     */
    function nnodeSymbol(xPos, yPos) {
      const X_SHIFT = -3; //px
      const Y_SHIFT = 3; //px
      const x = xPos + X_SHIFT
      const y = yPos + Y_SHIFT
      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 -0.6666667,1.3333333 0,0.6666667 0.6666667,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666666,-1.3333333 0,-0.6666667 -0.6666666,-1.3333333 -2,-2.66666665 -0.6666667,-1.99999995 0,-1.3333334 0.6666667,-2 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,2 0,1.3333334 -0.6666667,1.99999995 -2,2.66666665 -0.6666666,1.3333333 0,0.6666667 0.6666666,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666667,-1.3333333 0,-0.6666667 -0.6666667,-1.3333333 -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 m -7.9999999,-6 0.6666667,-1.3333333 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,1.3333333");
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
   * Generate random ID
   *
   * @static
   * @return {String}
   */
  static generateUniqueId = function() {
    const randomNumber = Math.random() * 1000000;
    const timestamp = Date.now();
    const uniqueId = `id_${randomNumber}_${timestamp}`;
    return uniqueId;
  }

  /**
   * Inverted degree to radian
   * @static
   *
   * @param {Number} angleIndegree
   * @param {Number} shiftInDegree
   * @return {Number}
   */
  static degreeToRadian = function(angleInDegree, shiftInDegree = 0) {
    return (shiftInDegree - angleInDegree) * Math.PI / 180
  }

  /**
   * Converts radian to degree
   * @static
   *
   * @param {Number} radian
   * @return {Number}
   */
  static radianToDegree = function(radian) {
    return (radian * 180 / Math.PI)
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
      x: (radius * Math.cos(angleInRadians) + cx),
      y: (radius * Math.sin(angleInRadians) + cy)
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

    const cellWidth = 10 //degree
    const numberOfCells = Utils.DEG_360 / cellWidth
    const frequency = new Array( numberOfCells ).fill(0)
    for(const point of points){
      const index = Math.floor(point.position / cellWidth)
      frequency[index] += 1
    }

    // In this algorithm the order of points is crucial.
    // At that point in the circle, where the period changes in the circle (for instance:[358,359,0,1]), the points are arranged in incorrect order.
    // As a starting point, I try to find a place where there are no points. This place I use as START_ANGLE.  
    const START_ANGLE = cellWidth * frequency.findIndex( count => count == 0 )

    const _points = points.map(point => {
      return {
        name: point.name,
        position: point.position < START_ANGLE ? point.position + Utils.DEG_360 : point.position
      }
    })

    _points.sort((a, b) => {
      return a.position - b.position
    })

    // Recursive function
    const arrangePoints = () => {
      for (let i = 0, ln = _points.length; i < ln; i++) {
        const pointPosition = Utils.positionOnCircle(0, 0, circleRadius, Utils.degreeToRadian(_points[i].position))
        _points[i].x = pointPosition.x
        _points[i].y = pointPosition.y

        for (let j = 0; j < i; j++) {
          const distance = Math.sqrt(Math.pow(_points[i].x - _points[j].x, 2) + Math.pow(_points[i].y - _points[j].y, 2));
          if (distance < (2 * collisionRadius)) {
            _points[i].position += STEP
            _points[j].position -= STEP
            arrangePoints() //======> Recursive call
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
/* harmony export */   "Chart": () => (/* reexport safe */ _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "RadixChart": () => (/* reexport safe */ _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "SVGUtils": () => (/* reexport safe */ _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "TransitChart": () => (/* reexport safe */ _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "Utils": () => (/* reexport safe */ _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./universe/Universe.js */ "./src/universe/Universe.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./charts/TransitChart.js */ "./src/charts/TransitChart.js");








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0cm9jaGFydDIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOzs7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixjQUFjLFFBQVEsR0FBRztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqSTJDO0FBQ047QUFDUjtBQUNROztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLHlCQUF5QixpREFBSzs7QUFFOUI7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhLFFBQVE7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG1FQUFpQjtBQUNsQyxxQ0FBcUMsK0JBQStCLEdBQUcsd0JBQXdCO0FBQy9GOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsT0FBTztBQUNyQixhQUFhLFFBQVE7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzREFBc0QsK0RBQWE7QUFDbkU7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsb0VBQWtCO0FBQ2hDO0FBQ0EsT0FBTztBQUNQO0FBQ0EsY0FBYyxvRUFBa0I7QUFDaEM7QUFDQSxPQUFPO0FBQ1A7QUFDQSxjQUFjLG9FQUFrQjtBQUNoQztBQUNBLE9BQU87QUFDUDtBQUNBLGNBQWMsb0VBQWtCO0FBQ2hDO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLCtCQUErQixHQUFHLHdCQUF3Qjs7QUFFakYsb0JBQW9CLG1FQUFpQjs7QUFFckMsaUJBQWlCLGtFQUFnQjtBQUNqQyx3QkFBd0Isb0VBQWtCO0FBQzFDO0FBQ0E7O0FBRUEsd0JBQXdCLG9FQUFrQjtBQUMxQztBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLG9FQUFrQjtBQUNyQztBQUNBLG9GQUFvRixRQUFRO0FBQzVGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsdUVBQXFCLEVBQUUsd0VBQXNCLEVBQUUsd0VBQXNCLEVBQUUsd0VBQXNCLEVBQUUscUVBQW1CLEVBQUUsdUVBQXFCLEVBQUUsdUVBQXFCLEVBQUUseUVBQXVCLEVBQUUsNkVBQTJCLEVBQUUsMkVBQXlCLEVBQUUsMEVBQXdCLEVBQUUsd0VBQXNCOztBQUU3VDtBQUNBLHFCQUFxQix3RUFBc0IseUdBQXlHLHNFQUFvQjtBQUN4SyxtQkFBbUIsb0VBQWtCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxzRUFBb0I7QUFDbkMsZUFBZSxzRUFBb0I7QUFDbkMsb0JBQW9CLHFFQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsb0JBQW9CLG1FQUFpQjs7QUFFckMsb0JBQW9CLGtDQUFrQzs7QUFFdEQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsbUVBQWlCOztBQUVyQzs7QUFFQTtBQUNBLG9CQUFvQix3QkFBd0I7QUFDNUMsdUJBQXVCLHdFQUFzQiw0Q0FBNEMsc0VBQW9COztBQUU3RyxxQkFBcUIsd0VBQXNCLG9GQUFvRixzRUFBb0I7O0FBRW5KLG1CQUFtQixrRUFBZ0I7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUJBQW1CLG9FQUFrQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsbUVBQWlCOztBQUVyQztBQUNBLHVCQUF1Qix3RUFBc0IsNkNBQTZDLHNFQUFvQjtBQUM5RyxxQkFBcUIsd0VBQXNCLDJEQUEyRCxzRUFBb0I7QUFDMUgsaUJBQWlCLGtFQUFnQjtBQUNqQztBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLHdFQUFzQiwyREFBMkQsc0VBQW9CO0FBQzNILGlCQUFpQixvRUFBa0I7QUFDbkM7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTyxXQUFXLGlDQUFpQztBQUNoRTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsbUVBQWlCO0FBQ3JDLHNCQUFzQiwyRkFBeUM7QUFDL0Q7QUFDQSx3QkFBd0Isd0RBQUs7QUFDN0IsNEJBQTRCLHdFQUFzQixrRkFBa0Ysc0VBQW9CO0FBQ3hKLDZCQUE2Qix3RUFBc0IsNkNBQTZDLHNFQUFvQjs7QUFFcEg7QUFDQSxtQ0FBbUMsd0VBQXNCLCtIQUErSCxzRUFBb0I7QUFDNU0sd0JBQXdCLGtFQUFnQjtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUNBQXFDLHdFQUFzQiw2Q0FBNkMsc0VBQW9CO0FBQzVILDBCQUEwQixrRUFBZ0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixtRUFBaUI7O0FBRXJDLHdCQUF3QixvRUFBa0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBLHdCQUF3QixvRUFBa0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBLHlCQUF5QixvRUFBa0I7QUFDM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN1QyQztBQUNkOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLDJCQUEyQixpREFBSzs7QUFFaEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxhQUFhO0FBQzFCLGFBQWEsUUFBUTtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0EsaUJBQWlCLG1FQUFpQjtBQUNsQyxxQ0FBcUMsK0JBQStCLEdBQUcsMEJBQTBCO0FBQ2pHO0FBQ0E7O0FBRUE7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3QzJDOztBQUU1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxvQkFBb0IsbUVBQWlCO0FBQ3JDLG1CQUFtQixvRUFBa0I7QUFDckM7QUFDQTtBQUNBOztBQUVBOztBQUtDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckVrRDtBQUNOO0FBQ0k7QUFDRjs7QUFFL0MsaUNBQWlDLEVBQUUsbURBQVEsRUFBRSxnREFBSyxFQUFFLGtEQUFPLEVBQUUsaURBQU07O0FBS2xFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7QUN0SlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7O0FDTlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeERzRDtBQUNqQjtBQUNOO0FBQ1c7QUFDSTs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EseUNBQXlDOztBQUV6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFDQUFxQyxFQUFFLG9FQUFlO0FBQ3REO0FBQ0EsS0FBSztBQUNMLHdCQUF3QixzRUFBb0I7QUFDNUM7O0FBRUEsc0JBQXNCLDZEQUFVO0FBQ2hDLHdCQUF3QiwrREFBWTs7QUFFcEM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7OztBQzlFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEI7QUFDQSxjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEI7QUFDQSxjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLHlCQUF5QjtBQUN6QjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekI7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QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVDtBQUNBOztBQUtDOzs7Ozs7O1VDMUlEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QztBQUNIO0FBQ047QUFDVztBQUNJOztBQUVvQiIsInNvdXJjZXMiOlsid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9DaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1JhZGl4Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3BvaW50cy9Qb2ludC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvQ29sb3JzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvUmFkaXguanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9UcmFuc2l0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3VuaXZlcnNlL1VuaXZlcnNlLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9TVkdVdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJhc3Ryb2xvZ3lcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQW4gYWJzdHJhY3QgY2xhc3MgZm9yIGFsbCB0eXBlIG9mIENoYXJ0XG4gKiBAcHVibGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKiBAYWJzdHJhY3RcbiAqL1xuY2xhc3MgQ2hhcnQge1xuXG4gIC8vI3NldHRpbmdzXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICAvL3RoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZGF0YSBpcyB2YWxpZFxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyB1bmRlZmluZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7aXNWYWxpZDpib29sZWFuLCBtZXNzYWdlOlN0cmluZ31cbiAgICovXG4gIHZhbGlkYXRlRGF0YShkYXRhKSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNpbmcgcGFyYW0gZGF0YS5cIilcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5wb2ludHMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJwb2ludHMgaXMgbm90IEFycmF5LlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuY3VzcHMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJjdXBzIGlzIG5vdCBBcnJheS5cIlxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhLmN1c3BzLmxlbmd0aCAhPT0gMTIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcImN1c3BzLmxlbmd0aCAhPT0gMTJcIlxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IHBvaW50IG9mIGRhdGEucG9pbnRzKSB7XG4gICAgICBpZiAodHlwZW9mIHBvaW50Lm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lICE9PSAnc3RyaW5nJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwb2ludC5uYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQubmFtZS5sZW5ndGggPT0gMFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcG9pbnQucG9zaXRpb24gIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5wb3NpdGlvbiAhPT0gJ251bWJlcidcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgY3VzcCBvZiBkYXRhLmN1c3BzKSB7XG4gICAgICBpZiAodHlwZW9mIGN1c3AucG9zaXRpb24gIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJjdXNwLnBvc2l0aW9uICE9PSAnbnVtYmVyJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6IFwiXCJcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldFBvaW50cygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldFBvaW50KG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldEFzcGVjdHMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBhbmltYXRlVG8oZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLy8gIyMgUFJPVEVDVEVEICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG59XG5cbmV4cG9ydCB7XG4gIENoYXJ0IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBpbnNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBSYWRpeENoYXJ0IGV4dGVuZHMgQ2hhcnQge1xuXG4gIC8qXG4gICAqIElubmVyIGNpcmNsZSByYWRpdXMgcmF0aW9cbiAgICogQGNvbnN0YW50XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDhcbiAgICovXG4gIHN0YXRpYyBJTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPID0gODtcblxuICAvKlxuICAgKiBPdXRlciBjaXJjbGUgcmFkaXVzIHJhdGlvXG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAZGVmYXVsdCAyXG4gICAqL1xuICBzdGF0aWMgT1VURVJfQ0lSQ0xFX1JBRElVU19SQVRJTyA9IDI7XG5cblxuICAvKlxuICAgKiBUaGUgbGVuZ3RoIG9mIHRoZSBwb2ludGVycyBpbiB0aGUgcnVsZXJcbiAgICogQGNvbnN0YW50XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDEwXG4gICAqL1xuICBzdGF0aWMgUlVMRVJfTEVOR1RIID0gMTBcblxuICAjc2V0dGluZ3NcbiAgI3Jvb3RcblxuICAvKlxuICAgKiBTaGlmdCB0aGUgQXNjZW5kYW50IHRvIHRoZSAwIGRlZ3JlZSBvbiBUaGUgQ2hhcnRcbiAgICovXG4gICNhbnNjZW5kYW50U2hpZnRcbiAgI2NlbnRlclhcbiAgI2NlbnRlcllcbiAgI3JhZGl1c1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1NWR0RvY3VtZW50fSBTVkdEb2N1bWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKFNWR0RvY3VtZW50LCBzZXR0aW5ncykge1xuXG4gICAgaWYgKCFTVkdEb2N1bWVudCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIFNWR0RvY3VtZW50LicpXG4gICAgfVxuXG4gICAgaWYgKCFzZXR0aW5ncykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gc2V0dGluZ3MuJylcbiAgICB9XG5cbiAgICBzdXBlcihzZXR0aW5ncylcblxuICAgIHRoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLiNjZW50ZXJYID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcbiAgICB0aGlzLiNjZW50ZXJZID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG4gICAgdGhpcy4jcmFkaXVzID0gTWF0aC5taW4odGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSkgLSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QQURESU5HXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH1gKVxuICAgIFNWR0RvY3VtZW50LmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2VzKVxuICAgIH1cblxuICAgIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCA9IChkYXRhLmN1c3BzWzBdLnBvc2l0aW9uICsgVXRpbHMuREVHXzE4MClcbiAgICB0aGlzLiNkcmF3KGRhdGEpXG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qXG4gICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gICNkcmF3KGRhdGEpIHtcbiAgICB0aGlzLiNkcmF3QmFja2dyb3VuZCgpXG4gICAgdGhpcy4jZHJhd0FzdHJvbG9naWNhbFNpZ25zKClcbiAgICB0aGlzLiNkcmF3UnVsZXIoKVxuICAgIHRoaXMuI2RyYXdNYWluQXhpcyhbe1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfQVMsXG4gICAgICAgIHBvc2l0aW9uOiBkYXRhLmN1c3BzWzBdLnBvc2l0aW9uXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfSUMsXG4gICAgICAgIHBvc2l0aW9uOiBkYXRhLmN1c3BzWzNdLnBvc2l0aW9uXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfRFMsXG4gICAgICAgIHBvc2l0aW9uOiBkYXRhLmN1c3BzWzZdLnBvc2l0aW9uXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfTUMsXG4gICAgICAgIHBvc2l0aW9uOiBkYXRhLmN1c3BzWzldLnBvc2l0aW9uXG4gICAgICB9LFxuICAgIF0pXG4gICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhLnBvaW50cylcbiAgICB0aGlzLiNkcmF3Qm9yZGVycygpXG4gIH1cblxuICAjZHJhd0JhY2tncm91bmQoKSB7XG4gICAgY29uc3QgTUFTS19JRCA9IGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH0tYmFja2dyb3VuZC1tYXNrLTFgXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgbWFzayA9IFNWR1V0aWxzLlNWR01hc2soTUFTS19JRClcbiAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMpXG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgXCJ3aGl0ZVwiKVxuICAgIG1hc2suYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpXG5cbiAgICBjb25zdCBpbm5lckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMgLyBSYWRpeENoYXJ0Lk9VVEVSX0NJUkNMRV9SQURJVVNfUkFUSU8pXG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgXCJibGFja1wiKVxuICAgIG1hc2suYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChtYXNrKVxuXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cylcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQkFDS0dST1VORF9DT0xPUik7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcIm1hc2tcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IGB1cmwoIyR7TUFTS19JRH0pYCk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpXG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd0FzdHJvbG9naWNhbFNpZ25zKCkge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9BU1RST0xPR0lDQUxfU0lHTlMgPSAxMlxuICAgIGNvbnN0IFNURVAgPSAzMCAvL2RlZ3JlZVxuICAgIGNvbnN0IENPTE9SU19TSUdOUyA9IFt0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUklFUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVEFVUlVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9HRU1JTkksIHRoaXMuI3NldHRpbmdzLkNPTE9SX0NBTkNFUiwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfTEVPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9WSVJHTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfTElCUkEsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1NDT1JQSU8sIHRoaXMuI3NldHRpbmdzLkNPTE9SX1NBR0lUVEFSSVVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQVBSSUNPUk4sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0FRVUFSSVVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9QSVNDRVNdXG4gICAgY29uc3QgU1lNQk9MX1NJR05TID0gW1NWR1V0aWxzLlNZTUJPTF9BUklFUywgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVUywgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSSwgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUiwgU1ZHVXRpbHMuU1lNQk9MX0xFTywgU1ZHVXRpbHMuU1lNQk9MX1ZJUkdPLCBTVkdVdGlscy5TWU1CT0xfTElCUkEsIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPLCBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVMsIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk4sIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVUywgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFU11cblxuICAgIGNvbnN0IG1ha2VTeW1ib2wgPSAoc3ltYm9sSW5kZXgsIGFuZ2xlSW5EZWdyZWUpID0+IHtcbiAgICAgIGxldCBwb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzIC0gKHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTykgLyAyLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZUluRGVncmVlICsgU1RFUCAvIDIsIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBsZXQgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKFNZTUJPTF9TSUdOU1tzeW1ib2xJbmRleF0sIHBvc2l0aW9uLngsIHBvc2l0aW9uLnksIDgpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NJR05TX0NPTE9SKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHJldHVybiBzeW1ib2xcbiAgICB9XG5cbiAgICBjb25zdCBtYWtlU2VnbWVudCA9IChzeW1ib2xJbmRleCwgYW5nbGVGcm9tSW5EZWdyZWUsIGFuZ2xlVG9JbkRlZ3JlZSkgPT4ge1xuICAgICAgbGV0IGExID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVGcm9tSW5EZWdyZWUsIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdClcbiAgICAgIGxldCBhMiA9IFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlVG9JbkRlZ3JlZSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KVxuICAgICAgbGV0IHNlZ21lbnQgPSBTVkdVdGlscy5TVkdTZWdtZW50KHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cywgYTEsIGEyLCB0aGlzLiNyYWRpdXMgLSB0aGlzLiNyYWRpdXMgLyBSYWRpeENoYXJ0LklOTkVSX0NJUkNMRV9SQURJVVNfUkFUSU8pO1xuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBDT0xPUlNfU0lHTlNbc3ltYm9sSW5kZXhdKTtcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0lSQ0xFX0NPTE9SIDogXCJub25lXCIpO1xuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgOiAwKTtcbiAgICAgIHJldHVybiBzZWdtZW50XG4gICAgfVxuXG4gICAgbGV0IHN0YXJ0QW5nbGUgPSAwXG4gICAgbGV0IGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTUJFUl9PRl9BU1RST0xPR0lDQUxfU0lHTlM7IGkrKykge1xuXG4gICAgICBsZXQgc2VnbWVudCA9IG1ha2VTZWdtZW50KGksIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzZWdtZW50KTtcblxuICAgICAgbGV0IHN5bWJvbCA9IG1ha2VTeW1ib2woaSwgc3RhcnRBbmdsZSlcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgc3RhcnRBbmdsZSArPSBTVEVQO1xuICAgICAgZW5kQW5nbGUgPSBzdGFydEFuZ2xlICsgU1RFUFxuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNkcmF3UnVsZXIoKSB7XG4gICAgY29uc3QgTlVNQkVSX09GX0RJVklERVJTID0gNzJcbiAgICBjb25zdCBTVEVQID0gNVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHJ1bGVyUmFkaXVzID0gKHRoaXMuI3JhZGl1cyAtICh0aGlzLiNyYWRpdXMgLyBSYWRpeENoYXJ0LklOTkVSX0NJUkNMRV9SQURJVVNfUkFUSU8gKyBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSCkpO1xuXG4gICAgbGV0IHN0YXJ0QW5nbGUgPSB0aGlzLiNhbnNjZW5kYW50U2hpZnRcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTUJFUl9PRl9ESVZJREVSUzsgaSsrKSB7XG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgcnVsZXJSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuXG4gICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHJ1bGVyUmFkaXVzICsgUmFkaXhDaGFydC5SVUxFUl9MRU5HVEggLyAoaSAlIDIgKyAxKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXG5cbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUFxuICAgIH1cblxuICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCBydWxlclJhZGl1cyk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSk7XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IG1haW4gYXhpc1xuICAgKiBAcGFyYW0ge0FycmF5fSBheGlzTGlzdFxuICAgKi9cbiAgI2RyYXdNYWluQXhpcyhheGlzTGlzdCkge1xuICAgIGNvbnN0IEFYSVNfTEVOR1RIID0gMTBcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBmb3IgKGNvbnN0IGF4aXMgb2YgYXhpc0xpc3QpIHtcbiAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMucG9zaXRpb24sIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cyArIEFYSVNfTEVOR1RILCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLnBvc2l0aW9uLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgbGV0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgbGV0IHRleHRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzICsgQVhJU19MRU5HVEgsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMucG9zaXRpb24sIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBsZXQgcGF0aCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54LCB0ZXh0UG9pbnQueSwge1xuICAgICAgICAuLi50aGlzLiNzZXR0aW5nc1xuICAgICAgfSlcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1RFWFRfQ09MT1IpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKTtcblxuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgcG9pbnRzXG4gICAqIEBwYXJhbSB7QXJyYXl9IHBvaW50cyAtIFt7XCJuYW1lXCI6U3RyaW5nLCBcInBvc2l0aW9uXCI6TnVtYmVyfV1cbiAgICovXG4gICNkcmF3UG9pbnRzKHBvaW50cykge1xuICAgIGNvbnN0IGlubmVyQ2lyY2xlUmFkaXVzID0gdGhpcy4jcmFkaXVzIC0gdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPXG4gICAgY29uc3QgUE9JTlRfUkFESVVTID0gaW5uZXJDaXJjbGVSYWRpdXMgLSAoNCpSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSClcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgY29uc3QgcG9zaXRpb25zID0gVXRpbHMuY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBQT0lOVF9SQURJVVMpXG4gICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XG4gICAgICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChwb2ludERhdGEpXG4gICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCBpbm5lckNpcmNsZVJhZGl1cyAtIDEuNSAqIFJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RILCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRQb3NpdGlvbigpLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgY29uc3Qgc3ltYm9sUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIFBPSU5UX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG5cbiAgICAgIC8vIHJ1bGVyIG1hcmtcbiAgICAgIGNvbnN0IHJ1bGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNyYWRpdXMgLSAodGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPICsgUmFkaXhDaGFydC5SVUxFUl9MRU5HVEgpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRQb3NpdGlvbigpLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgY29uc3QgcnVsZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueCwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueSlcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHJ1bGVyTGluZSk7XG5cbiAgICAgIC8vIHN5bWJvbFxuICAgICAgY29uc3Qgc3ltYm9sID0gcG9pbnQuZ2V0U3ltYm9sKHN5bWJvbFBvc2l0aW9uLngsIHN5bWJvbFBvc2l0aW9uLnkpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UU19DT0xPUik7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgLy8gcG9pbnRlclxuICAgICAgLy9pZiAocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0gIT0gcG9pbnREYXRhLnBvc2l0aW9uKSB7XG4gICAgICBjb25zdCBwb2ludGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCBQT0lOVF9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgY29uc3QgcG9pbnRlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgLyAyKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocG9pbnRlckxpbmUpO1xuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNkcmF3Qm9yZGVycygpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgaW5uZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzIC0gdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPKVxuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChpbm5lckNpcmNsZSlcblxuICAgIGNvbnN0IG91dGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cylcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpXG5cbiAgICBjb25zdCBjZW50ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5PVVRFUl9DSVJDTEVfUkFESVVTX1JBVElPKVxuICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNlbnRlckNpcmNsZSlcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG59XG5cbmV4cG9ydCB7XG4gIFJhZGl4Q2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBmcm9tIG91dHNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBUcmFuc2l0Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XG5cbiAgI3NldHRpbmdzXG4gICNyb290XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7U1ZHRG9jdW1lbnR9IFNWR0RvY3VtZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3IoU1ZHRG9jdW1lbnQsIHNldHRpbmdzKSB7XG5cbiAgICBpZiAoIVNWR0RvY3VtZW50IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gU1ZHRG9jdW1lbnQuJylcbiAgICB9XG5cbiAgICBpZiAoIXNldHRpbmdzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBzZXR0aW5ncy4nKVxuICAgIH1cblxuICAgIHN1cGVyKHNldHRpbmdzKVxuXG5cbiAgICB0aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX0lEfWApXG4gICAgU1ZHRG9jdW1lbnQuYXBwZW5kQ2hpbGQodGhpcy4jcm9vdCk7XG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG59XG5cbmV4cG9ydCB7XG4gIFRyYW5zaXRDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBSZXByZXNlbnRzIGEgcGxhbmV0IG9yIHBvaW50IG9mIGludGVyZXN0IGluIHRoZSBjaGFydFxuICogQHB1YmxpY1xuICovXG5jbGFzcyBQb2ludCB7XG5cbiAgI25hbWVcbiAgI3Bvc2l0aW9uXG4gICNpc1JldHJvZ3JhZGVcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIGNvbnN0cnVjdG9yKCBkYXRhICkge1xuICAgIHRoaXMuI25hbWUgPSBkYXRhLm5hbWUgPz8gXCJVbmtub3duXCJcbiAgICB0aGlzLiNwb3NpdGlvbiA9IGRhdGEucG9zaXRpb24gPz8gMFxuICAgIHRoaXMuI2lzUmV0cm9ncmFkZSA9IGRhdGEuaXNSZXRyb2dyYWRlID8/IGZhbHNlXG4gIH1cblxuICAvKipcbiAgKiBHZXQgbmFtZVxuICAqXG4gICogQHJldHVybiB7U3RyaW5nfVxuICAqL1xuICBnZXROYW1lKCl7XG4gICAgcmV0dXJuIHRoaXMuI25hbWVcbiAgfVxuXG4gIC8qKlxuICAqIElzIHJldHJvZ3JhZGVcbiAgKlxuICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICovXG4gIGlzUmV0cm9ncmFkZSgpe1xuICAgIHJldHVybiB0aGlzLiNpc1JldHJvZ3JhZGVcbiAgfVxuXG4gIC8qKlxuICAqIEdldCBwb3NpdGlvblxuICAqXG4gICogQHJldHVybiB7TnVtYmVyfVxuICAqL1xuICBnZXRQb3NpdGlvbigpe1xuICAgIHJldHVybiB0aGlzLiNwb3NpdGlvblxuICB9XG5cbiAgLyoqXG4gICogR2V0IHN5bWJvbFxuICAqIEBwYXJhbSB7TnVtYmVyfSB4UG9zXG4gICogQHBhcmFtIHtOdW1iZXJ9IHlQb3NcbiAgKlxuICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9XG4gICovXG4gIGdldFN5bWJvbCh4UG9zLCB5UG9zKXtcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgIGNvbnN0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbCh0aGlzLiNuYW1lLCB4UG9zLCB5UG9zKVxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKVxuICAgIHJldHVybiB3cmFwcGVyXG4gIH1cblxufVxuXG5leHBvcnQge1xuICBQb2ludCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgKiBhcyBVbml2ZXJzZSBmcm9tIFwiLi9jb25zdGFudHMvVW5pdmVyc2UuanNcIlxuaW1wb3J0ICogYXMgUmFkaXggZnJvbSBcIi4vY29uc3RhbnRzL1JhZGl4LmpzXCJcbmltcG9ydCAqIGFzIFRyYW5zaXQgZnJvbSBcIi4vY29uc3RhbnRzL1RyYW5zaXQuanNcIlxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gXCIuL2NvbnN0YW50cy9Db2xvcnMuanNcIlxuXG5jb25zdCBTRVRUSU5HUyA9IE9iamVjdC5hc3NpZ24oe30sIFVuaXZlcnNlLCBSYWRpeCwgVHJhbnNpdCwgQ29sb3JzKTtcblxuZXhwb3J0IHtcbiAgU0VUVElOR1MgYXNcbiAgZGVmYXVsdFxufVxuIiwiLyoqXG4qIENoYXJ0IGJhY2tncm91bmQgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNmZmZcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfQkFDS0dST1VORF9DT0xPUiA9IFwiI2ZmZlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0NJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGxpbmVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9MSU5FX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgdGV4dCBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVEVYVF9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHNpZ25zIGluIGNoYXJ0cyAoYXJpc2Ugc3ltYm9sLCB0YXVydXMgc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NJR05TX0NPTE9SID0gXCIjMDAwXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2Ygc2lnbnMgaW4gY2hhcnRzIChhcmlzZSBzeW1ib2wsIHRhdXJ1cyBzeW1ib2wsIC4uLilcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMwMDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfUE9JTlRTX0NPTE9SID0gXCIjMDAwXCI7XG5cbi8qXG4qIEFyaWVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0FSSUVTID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIFRhdXJ1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9UQVVSVVMgPSBcIiM4QjQ1MTNcIjtcblxuLypcbiogR2VtaW55IGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0dFTUlOST0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIENhbmNlciBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9DQU5DRVIgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogTGVvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xFTyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBWaXJnbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9WSVJHTyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBMaWJyYSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9MSUJSQSA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBTY29ycGlvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1NDT1JQSU8gPSBcIiMyN0FFNjBcIjtcblxuLypcbiogU2FnaXR0YXJpdXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0FHSVRUQVJJVVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogQ2Fwcmljb3JuIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBUFJJQ09STiA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBBcXVhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUVVBUklVUyA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBQaXNjZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfUElTQ0VTID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIENvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuIiwiLypcbiogUmFkaXggY2hhcnQgZWxlbWVudCBJRFxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgcmFkaXhcbiovXG5leHBvcnQgY29uc3QgUkFESVhfSUQgPSBcInJhZGl4XCJcbiIsIi8qXG4qIFRyYW5zaXQgY2hhcnQgZWxlbWVudCBJRFxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgdHJhbnNpdFxuKi9cbmV4cG9ydCBjb25zdCBUUkFOU0lUX0lEID0gXCJ0cmFuc2l0XCJcbiIsIi8qKlxuKiBDaGFydCBwYWRkaW5nXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxMHB4XG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BBRERJTkcgPSA0MFxuXG4vKipcbiogU1ZHIHZpZXdCb3ggd2lkdGhcbiogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvQXR0cmlidXRlL3ZpZXdCb3hcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDgwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9WSUVXQk9YX1dJRFRIID0gODAwXG5cbi8qKlxuKiBTVkcgdmlld0JveCBoZWlnaHRcbiogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvQXR0cmlidXRlL3ZpZXdCb3hcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDgwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9WSUVXQk9YX0hFSUdIVCA9IDgwMFxuXG4vKipcbiogQSBwb2ludCBjb2xsaXNpb24gcmFkaXVzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BPSU5UX0NPTExJU0lPTl9SQURJVVMgPSAxMlxuXG4vKlxuKiBMaW5lIHN0cmVuZ3RoXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRSA9IDFcblxuLypcbiogTGluZSBzdHJlbmd0aCBvZiB0aGUgbWFpbiBsaW5lcy4gRm9yIGluc3RhbmNlIHBvaW50cywgbWFpbiBheGlzLCBtYWluIGNpcmNsZXNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDFcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfTUFJTl9TVFJPS0UgPSAyXG5cbi8qKlxuKiBObyBmaWxsLCBvbmx5IHN0cm9rZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge2Jvb2xlYW59XG4qIEBkZWZhdWx0IGZhbHNlXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRV9PTkxZID0gZmFsc2U7XG4iLCJpbXBvcnQgRGVmYXVsdFNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyc7XG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcbmltcG9ydCBSYWRpeENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJztcbmltcG9ydCBUcmFuc2l0Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1RyYW5zaXRDaGFydC5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEFuIHdyYXBwZXIgZm9yIGFsbCBwYXJ0cyBvZiBncmFwaC5cbiAqIEBwdWJsaWNcbiAqL1xuY2xhc3MgVW5pdmVyc2Uge1xuXG4gICNTVkdEb2N1bWVudFxuICAjc2V0dGluZ3NcbiAgI3JhZGl4XG4gICN0cmFuc2l0XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBodG1sRWxlbWVudElEIC0gSUQgb2YgdGhlIHJvb3QgZWxlbWVudCB3aXRob3V0IHRoZSAjIHNpZ25cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIEFuIG9iamVjdCB0aGF0IG92ZXJyaWRlcyB0aGUgZGVmYXVsdCBzZXR0aW5ncyB2YWx1ZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKGh0bWxFbGVtZW50SUQsIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgaWYgKHR5cGVvZiBodG1sRWxlbWVudElEICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIHJlcXVpcmVkIHBhcmFtZXRlciBpcyBtaXNzaW5nLicpXG4gICAgfVxuXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChodG1sRWxlbWVudElEKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5vdCBmaW5kIGEgSFRNTCBlbGVtZW50IHdpdGggSUQgJyArIGh0bWxFbGVtZW50SUQpXG4gICAgfVxuXG4gICAgdGhpcy4jc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0U2V0dGluZ3MsIG9wdGlvbnMsIHtcbiAgICAgIEhUTUxfRUxFTUVOVF9JRDogaHRtbEVsZW1lbnRJRFxuICAgIH0pO1xuICAgIHRoaXMuI1NWR0RvY3VtZW50ID0gU1ZHVXRpbHMuU1ZHRG9jdW1lbnQodGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQpXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEVsZW1lbnRJRCkuYXBwZW5kQ2hpbGQodGhpcy4jU1ZHRG9jdW1lbnQpO1xuXG4gICAgdGhpcy4jcmFkaXggPSBuZXcgUmFkaXhDaGFydCh0aGlzLiNTVkdEb2N1bWVudCwgdGhpcy4jc2V0dGluZ3MpXG4gICAgdGhpcy4jdHJhbnNpdCA9IG5ldyBUcmFuc2l0Q2hhcnQodGhpcy4jU1ZHRG9jdW1lbnQsIHRoaXMuI3NldHRpbmdzKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vICMjIFBVQkxJQyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAvKipcbiAgICogR2V0IFJhZGl4IGNoYXJ0XG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICByYWRpeCgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmFkaXhcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgVHJhbnNpdCBjaGFydFxuICAgKiBAcmV0dXJuIHtUcmFuc2l0Q2hhcnR9XG4gICAqL1xuICB0cmFuc2l0KCkge1xuICAgIHJldHVybiB0aGlzLiN0cmFuc2l0XG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgc2V0dGluZ3NcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0U2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NldHRpbmdzXG4gIH1cbiAgXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbn1cblxuZXhwb3J0IHtcbiAgVW5pdmVyc2UgYXNcbiAgZGVmYXVsdFxufVxuIiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgU1ZHIHV0aWxpdHkgY2xhc3NcbiAqIEBwdWJsaWNcbiAqIEBzdGF0aWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgU1ZHVXRpbHMge1xuXG4gIHN0YXRpYyBTVkdfTkFNRVNQQUNFID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG5cbiAgc3RhdGljIFNZTUJPTF9BUklFUyA9IFwiQXJpZXNcIjtcbiAgc3RhdGljIFNZTUJPTF9UQVVSVVMgPSBcIlRhdXJ1c1wiO1xuICBzdGF0aWMgU1lNQk9MX0dFTUlOSSA9IFwiR2VtaW5pXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0FOQ0VSID0gXCJDYW5jZXJcIjtcbiAgc3RhdGljIFNZTUJPTF9MRU8gPSBcIkxlb1wiO1xuICBzdGF0aWMgU1lNQk9MX1ZJUkdPID0gXCJWaXJnb1wiO1xuICBzdGF0aWMgU1lNQk9MX0xJQlJBID0gXCJMaWJyYVwiO1xuICBzdGF0aWMgU1lNQk9MX1NDT1JQSU8gPSBcIlNjb3JwaW9cIjtcbiAgc3RhdGljIFNZTUJPTF9TQUdJVFRBUklVUyA9IFwiU2FnaXR0YXJpdXNcIjtcbiAgc3RhdGljIFNZTUJPTF9DQVBSSUNPUk4gPSBcIkNhcHJpY29yblwiO1xuICBzdGF0aWMgU1lNQk9MX0FRVUFSSVVTID0gXCJBcXVhcml1c1wiO1xuICBzdGF0aWMgU1lNQk9MX1BJU0NFUyA9IFwiUGlzY2VzXCI7XG5cbiAgc3RhdGljIFNZTUJPTF9DVVNQXzEgPSBcIjFcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzIgPSBcIjJcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzMgPSBcIjNcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzQgPSBcIjRcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzUgPSBcIjVcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzYgPSBcIjZcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzcgPSBcIjdcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzggPSBcIjhcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzkgPSBcIjlcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzEwID0gXCIxMFwiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfMTEgPSBcIjExXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF8xMiA9IFwiMTJcIjtcblxuICBzdGF0aWMgU1lNQk9MX0FTID0gXCJBc1wiO1xuICBzdGF0aWMgU1lNQk9MX0RTID0gXCJEc1wiO1xuICBzdGF0aWMgU1lNQk9MX01DID0gXCJNY1wiO1xuICBzdGF0aWMgU1lNQk9MX0lDID0gXCJJY1wiO1xuXG4gIHN0YXRpYyBTWU1CT0xfU1VOID0gXCJTdW5cIjtcbiAgc3RhdGljIFNZTUJPTF9NT09OID0gXCJNb29uXCI7XG4gIHN0YXRpYyBTWU1CT0xfTUVSQ1VSWSA9IFwiTWVyY3VyeVwiO1xuICBzdGF0aWMgU1lNQk9MX1ZFTlVTID0gXCJWZW51c1wiO1xuICBzdGF0aWMgU1lNQk9MX01BUlMgPSBcIk1hcnNcIjtcbiAgc3RhdGljIFNZTUJPTF9KVVBJVEVSID0gXCJKdXBpdGVyXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0FUVVJOID0gXCJTYXR1cm5cIjtcbiAgc3RhdGljIFNZTUJPTF9VUkFOVVMgPSBcIlVyYW51c1wiO1xuICBzdGF0aWMgU1lNQk9MX05FUFRVTkUgPSBcIk5lcHR1bmVcIjtcbiAgc3RhdGljIFNZTUJPTF9QTFVUTyA9IFwiUGx1dG9cIjtcbiAgc3RhdGljIFNZTUJPTF9DSElST04gPSBcIkNoaXJvblwiO1xuICBzdGF0aWMgU1lNQk9MX0xJTElUSCA9IFwiTGlsaXRoXCI7XG4gIHN0YXRpYyBTWU1CT0xfTk5PREUgPSBcIk5Ob2RlXCI7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBTVkdVdGlscykge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBkb2N1bWVudFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR0RvY3VtZW50KHdpZHRoLCBoZWlnaHQpIHtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJzdmdcIik7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnMnLCBTVkdVdGlscy5TVkdfTkFNRVNQQUNFKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2ZXJzaW9uJywgXCIxLjFcIik7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIFwiMCAwIFwiICsgd2lkdGggKyBcIiBcIiArIGhlaWdodCk7XG4gICAgcmV0dXJuIHN2Z1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBncm91cCBlbGVtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR0dyb3VwKCkge1xuICAgIGNvbnN0IGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJnXCIpO1xuICAgIHJldHVybiBnXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIHBhdGggZWxlbWVudFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdQYXRoKCkge1xuICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJwYXRoXCIpO1xuICAgIHJldHVybiBwYXRoXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIG1hc2sgZWxlbWVudFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbGVtZW50SURcbiAgICpcbiAgICogQHJldHVybiB7U1ZHTWFza0VsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHTWFzayhlbGVtZW50SUQpIHtcbiAgICBjb25zdCBtYXNrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwibWFza1wiKTtcbiAgICBtYXNrLnNldEF0dHJpYnV0ZShcImlkXCIsIGVsZW1lbnRJRClcbiAgICByZXR1cm4gbWFza1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyBjaXJjdWxhciBzZWN0b3JcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2ludH0geCAtIGNpcmNsZSB4IGNlbnRlciBwb3NpdGlvblxuICAgKiBAcGFyYW0ge2ludH0geSAtIGNpcmNsZSB5IGNlbnRlciBwb3NpdGlvblxuICAgKiBAcGFyYW0ge2ludH0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1cyBpbiBweFxuICAgKiBAcGFyYW0ge2ludH0gYTEgLSBhbmdsZUZyb20gaW4gcmFkaWFuc1xuICAgKiBAcGFyYW0ge2ludH0gYTIgLSBhbmdsZVRvIGluIHJhZGlhbnNcbiAgICogQHBhcmFtIHtpbnR9IHRoaWNrbmVzcyAtIGZyb20gb3V0c2lkZSB0byBjZW50ZXIgaW4gcHhcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gc2VnbWVudFxuICAgKi9cbiAgc3RhdGljIFNWR1NlZ21lbnQoeCwgeSwgcmFkaXVzLCBhMSwgYTIsIHRoaWNrbmVzcywgbEZsYWcsIHNGbGFnKSB7XG4gICAgLy8gQHNlZSBTVkcgUGF0aCBhcmM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9TVkcvcGF0aHMuaHRtbCNQYXRoRGF0YVxuICAgIGNvbnN0IExBUkdFX0FSQ19GTEFHID0gbEZsYWcgfHwgMDtcbiAgICBjb25zdCBTV0VFVF9GTEFHID0gc0ZsYWcgfHwgMDtcblxuICAgIGNvbnN0IHNlZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJwYXRoXCIpO1xuICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZFwiLCBcIk0gXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguc2luKGExKSkgKyBcIiBBIFwiICsgcmFkaXVzICsgXCIsIFwiICsgcmFkaXVzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIFNXRUVUX0ZMQUcgKyBcIiwgXCIgKyAoeCArIHJhZGl1cyAqIE1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoeSArIHJhZGl1cyAqIE1hdGguc2luKGEyKSkgKyBcIiBsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguY29zKGEyKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiAtTWF0aC5zaW4oYTIpKSArIFwiIEEgXCIgKyB0aGlja25lc3MgKyBcIiwgXCIgKyB0aGlja25lc3MgKyBcIiwwICxcIiArIExBUkdFX0FSQ19GTEFHICsgXCIsIFwiICsgMSArIFwiLCBcIiArICh4ICsgdGhpY2tuZXNzICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICh5ICsgdGhpY2tuZXNzICogTWF0aC5zaW4oYTEpKSk7XG4gICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICByZXR1cm4gc2VnbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgY2lyY2xlXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtpbnR9IGN4XG4gICAqIEBwYXJhbSB7aW50fSBjeVxuICAgKiBAcGFyYW0ge2ludH0gcmFkaXVzXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGNpcmNsZVxuICAgKi9cbiAgc3RhdGljIFNWR0NpcmNsZShjeCwgY3ksIHJhZGl1cykge1xuICAgIGNvbnN0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImNpcmNsZVwiKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3hcIiwgY3gpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBjeSk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInJcIiwgcmFkaXVzKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgcmV0dXJuIGNpcmNsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgbGluZVxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0geDFcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MlxuICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gbGluZVxuICAgKi9cbiAgc3RhdGljIFNWR0xpbmUoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwibGluZVwiKTtcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcIngxXCIsIHgxKTtcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkxXCIsIHkxKTtcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcIngyXCIsIHgyKTtcbiAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkyXCIsIHkyKTtcbiAgICByZXR1cm4gbGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgc3ltYm9sXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4UG9zXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5UG9zXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHU3ltYm9sKG5hbWUsIHhQb3MsIHlQb3MpIHtcbiAgICBzd2l0Y2ggKG5hbWUpIHtcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVM6XG4gICAgICAgIHJldHVybiBhc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0RTOlxuICAgICAgICByZXR1cm4gZHNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQzpcbiAgICAgICAgcmV0dXJuIG1jU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSUM6XG4gICAgICAgIHJldHVybiBpY1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVJJRVM6XG4gICAgICAgIHJldHVybiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVUzpcbiAgICAgICAgcmV0dXJuIHRhdXJ1c1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSTpcbiAgICAgICAgcmV0dXJuIGdlbWluaVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUjpcbiAgICAgICAgcmV0dXJuIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xFTzpcbiAgICAgICAgcmV0dXJuIGxlb1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZJUkdPOlxuICAgICAgICByZXR1cm4gdmlyZ29TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUJSQTpcbiAgICAgICAgcmV0dXJuIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0NPUlBJTzpcbiAgICAgICAgcmV0dXJuIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUzpcbiAgICAgICAgcmV0dXJuIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOOlxuICAgICAgICByZXR1cm4gY2Fwcmljb3JuU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVFVQVJJVVM6XG4gICAgICAgIHJldHVybiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFUzpcbiAgICAgICAgcmV0dXJuIHBpc2Nlc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU1VOOlxuICAgICAgICByZXR1cm4gc3VuU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTU9PTjpcbiAgICAgICAgcmV0dXJuIG1vb25TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NRVJDVVJZOlxuICAgICAgICByZXR1cm4gbWVyY3VyeVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTOlxuICAgICAgICByZXR1cm4gdmVudXNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQVJTOlxuICAgICAgICByZXR1cm4gbWFyc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0pVUElURVI6XG4gICAgICAgIHJldHVybiBqdXBpdGVyU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FUVVJOOlxuICAgICAgICByZXR1cm4gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVVJBTlVTOlxuICAgICAgICByZXR1cm4gdXJhbnVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTkVQVFVORTpcbiAgICAgICAgcmV0dXJuIG5lcHR1bmVTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcbiAgICAgICAgcmV0dXJuIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0hJUk9OOlxuICAgICAgICByZXR1cm4gY2hpcm9uU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTElMSVRIOlxuICAgICAgICByZXR1cm4gbGlsaXRoU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTk5PREU6XG4gICAgICAgIHJldHVybiBubm9kZVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc3QgdW5rbm93blN5bWJvbCA9IFNWR1V0aWxzLlNWR0NpcmNsZSh4UG9zLCB5UG9zLCA4KVxuICAgICAgICByZXR1cm4gdW5rbm93blN5bWJvbFxuICAgIH1cblxuICAgIC8qXG4gICAgICogQXNjZW5kYW50IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtNDsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0yOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTAuNTYzMDc4LC0xLjEyNjE1MjcgLTEuNjg5MjI4LC0wLjU2MzA3NjUgLTEuNjg5MjI5LDAgLTEuNjg5MjMsMC41NjMwNzY1IC0wLjU2MzA3NiwxLjEyNjE1MjcgMC41NjMwNzYsMS4xMjYxNTI3MiAxLjEyNjE1NCwwLjU2MzA3NjM2IDIuODE1MzgxLDAuNTYzMDc2MzUgMS4xMjYxNTIsMC41NjMwNzY0NyAwLjU2MzA3OCwxLjEyNjE1MjYgMCwwLjU2MzA3NjMgLTAuNTYzMDc4LDEuMTI2MTUyOCAtMS42ODkyMjgsMC41NjMwNzY0IC0xLjY4OTIyOSwwIC0xLjY4OTIzLC0wLjU2MzA3NjQgLTAuNTYzMDc2LC0xLjEyNjE1MjggbSAtNi43NTY5MTYsLTEwLjEzNTM3NCAtNC41MDQ2MTEsMTEuODI0NjAzMiBtIDQuNTA0NjExLC0xMS44MjQ2MDMyIDQuNTA0NjExLDExLjgyNDYwMzIgbSAtNy4zMTk5OTI1LC0zLjk0MTUzNDU3IDUuNjMwNzYyNSwwXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBEZXNjZW5kYW50IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAyMjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0xOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTAuNTYyNSwtMS4xMjUgLTEuNjg3NSwtMC41NjI1IC0xLjY4NzUsMCAtMS42ODc1LDAuNTYyNSAtMC41NjI1LDEuMTI1IDAuNTYyNSwxLjEyNSAxLjEyNSwwLjU2MjUgMi44MTI1LDAuNTYyNSAxLjEyNSwwLjU2MjUgMC41NjI1LDEuMTI1IDAsMC41NjI1IC0wLjU2MjUsMS4xMjUgLTEuNjg3NSwwLjU2MjUgLTEuNjg3NSwwIC0xLjY4NzUsLTAuNTYyNSAtMC41NjI1LC0xLjEyNSBtIC0xMS4yNSwtMTAuMTI1IDAsMTEuODEyNSBtIDAsLTExLjgxMjUgMy45Mzc1LDAgMS42ODc1LDAuNTYyNSAxLjEyNSwxLjEyNSAwLjU2MjUsMS4xMjUgMC41NjI1LDEuNjg3NSAwLDIuODEyNSAtMC41NjI1LDEuNjg3NSAtMC41NjI1LDEuMTI1IC0xLjEyNSwxLjEyNSAtMS42ODc1LDAuNTYyNSAtMy45Mzc1LDBcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1lZGl1bSBjb2VsaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtY1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTEuMDA0MDg1LC0xLjAwNDA4NDUgLTEuMDA0MDg0LC0wLjUwMjA0MjMgLTEuNTA2MTI3LDAgLTEuMDA0MDg1LDAuNTAyMDQyMyAtMS4wMDQwODQsMS4wMDQwODQ1IC0wLjUwMjA0MywxLjUwNjEyNjg5IDAsMS4wMDQwODQ1OCAwLjUwMjA0MywxLjUwNjEyNjgzIDEuMDA0MDg0LDEuMDA0MDg0NiAxLjAwNDA4NSwwLjUwMjA0MjMgMS41MDYxMjcsMCAxLjAwNDA4NCwtMC41MDIwNDIzIDEuMDA0MDg1LC0xLjAwNDA4NDYgbSAtMTcuNTcxNDgsLTkuMDM2NzYxMiAwLDEwLjU0Mjg4ODEgbSAwLC0xMC41NDI4ODgxIDQuMDE2MzM4LDEwLjU0Mjg4ODEgbSA0LjAxNjMzOCwtMTAuNTQyODg4MSAtNC4wMTYzMzgsMTAuNTQyODg4MSBtIDQuMDE2MzM4LC0xMC41NDI4ODgxIDAsMTAuNTQyODg4MVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogSW1tdW0gY29lbGkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gaWNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDg7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSA5OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTEuMjA4ODUyLC0xLjIwODg1MTQgLTEuMjA4ODUxLC0wLjYwNDQyNTggLTEuODEzMjc4LDAgLTEuMjA4ODUyLDAuNjA0NDI1OCAtMS4yMDg4NSwxLjIwODg1MTQgLTAuNjA0NDI2LDEuODEzMjc3MTUgMCwxLjIwODg1MTM1IDAuNjA0NDI2LDEuODEzMjc3MiAxLjIwODg1LDEuMjA4ODUxMyAxLjIwODg1MiwwLjYwNDQyNTkgMS44MTMyNzgsMCAxLjIwODg1MSwtMC42MDQ0MjU5IDEuMjA4ODUyLC0xLjIwODg1MTMgbSAtMTEuNDg0MDkwMiwtMTAuODc5NjYyOSAwLDEyLjY5Mjk0MDFcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEFyaWVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFyaWVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0yOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTAuOSwtMC45IDAsLTEuOCAwLjksLTEuOCAxLjgsLTAuODk5OTk5OCAxLjgsMCAxLjgsMC44OTk5OTk4IDAuOSwwLjkgMC45LDEuOCAwLjksNC41IG0gLTksLTUuNCAxLjgsLTEuOCAxLjgsMCAxLjgsMC45IDAuOSwwLjkgMC45LDEuOCAwLjksMy42IDAsOS45IG0gOC4xLC0xMi42IDAuOSwtMC45IDAsLTEuOCAtMC45LC0xLjggLTEuOCwtMC44OTk5OTk4IC0xLjgsMCAtMS44LDAuODk5OTk5OCAtMC45LDAuOSAtMC45LDEuOCAtMC45LDQuNSBtIDksLTUuNCAtMS44LC0xLjggLTEuOCwwIC0xLjgsMC45IC0wLjksMC45IC0wLjksMS44IC0wLjksMy42IDAsOS45XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBUYXVydXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdGF1cnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0xMTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDEsNCAxLDIgMiwyIDMsMSA0LDAgMywtMSAyLC0yIDEsLTIgMSwtNCBtIC0xOCwwIDEsMyAxLDIgMiwyIDMsMSA0LDAgMywtMSAyLC0yIDEsLTIgMSwtMyBtIC0xMSw4IC0yLDEgLTEsMSAtMSwyIDAsMyAxLDIgMiwyIDIsMSAyLDAgMiwtMSAyLC0yIDEsLTIgMCwtMyAtMSwtMiAtMSwtMSAtMiwtMSBtIC00LDEgLTIsMSAtMSwyIDAsMyAxLDMgbSA4LDAgMSwtMyAwLC0zIC0xLC0yIC0yLC0xXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBHZW1pbmkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtNjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC02OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMCwxMS41NDY0MTQgbSAwLjk2MjIwMTEsLTEwLjU4NDIxMjkgMCw5LjYyMjAxMTcgbSA3LjY5NzYwOTcsLTkuNjIyMDExNyAwLDkuNjIyMDExNyBtIDAuOTYyMjAxLC0xMC41ODQyMTI4IDAsMTEuNTQ2NDE0IG0gLTEzLjQ3MDgxNjUsLTE0LjQzMzAxNzIgMS45MjQ0MDIzLDEuOTI0NDAyIDEuOTI0NDAyNCwwLjk2MjIwMTIgMi44ODY2MDM4LDAuOTYyMjAxMSAzLjg0ODgwNCwwIDIuODg2NjA0LC0wLjk2MjIwMTEgMS45MjQ0MDIsLTAuOTYyMjAxMiAxLjkyNDQwMywtMS45MjQ0MDIgbSAtMTcuMzE5NjIxNSwxNy4zMTk2MjA3IDEuOTI0NDAyMywtMS45MjQ0MDI0IDEuOTI0NDAyNCwtMC45NjIyMDExIDIuODg2NjAzOCwtMC45NjIyMDEyIDMuODQ4ODA0LDAgMi44ODY2MDQsMC45NjIyMDEyIDEuOTI0NDAyLDAuOTYyMjAxMSAxLjkyNDQwMywxLjkyNDQwMjRcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENhbmNlciBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYW5jZXJTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0xNSwwIC0yLDEgLTEsMiAwLDIgMSwyIDIsMSAyLDAgMiwtMSAxLC0yIDAsLTIgLTEsLTIgMTEsMCBtIC0xOCwzIDEsMiAxLDEgMiwxIG0gNCwtNCAtMSwtMiAtMSwtMSAtMiwtMSBtIC00LDE1IDE1LDAgMiwtMSAxLC0yIDAsLTIgLTEsLTIgLTIsLTEgLTIsMCAtMiwxIC0xLDIgMCwyIDEsMiAtMTEsMCBtIDE4LC0zIC0xLC0yIC0xLC0xIC0yLC0xIG0gLTQsNCAxLDIgMSwxIDIsMVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogTGVvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTM7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSA0OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTIsLTEgLTEsMCAtMiwxIC0xLDIgMCwxIDEsMiAyLDEgMSwwIDIsLTEgMSwtMiAwLC0xIC0xLC0yIC01LC01IC0xLC0yIDAsLTMgMSwtMiAyLC0xIDMsLTEgNCwwIDQsMSAyLDIgMSwyIDAsMyAtMSwzIC0zLDMgLTEsMiAwLDIgMSwyIDIsMCAxLC0xIDEsLTIgbSAtMTMsLTUgLTIsLTMgLTEsLTIgMCwtMyAxLC0yIDEsLTEgbSA3LC0xIDMsMSAyLDIgMSwyIDAsMyAtMSwzIC0yLDNcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFZpcmdvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC01OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMi41ODk0ODY4LC0yLjU4OTQ4NjggMS43MjYzMjQ1LDIuNTg5NDg2OCAwLDkuNDk0Nzg0NyBtIC0yLjU4OTQ4NjgsLTExLjIyMTEwOTIgMS43MjYzMjQ1LDIuNTg5NDg2NyAwLDguNjMxNjIyNSBtIDAuODYzMTYyMywtOS40OTQ3ODQ3IDIuNTg5NDg2NywtMi41ODk0ODY4IDEuNzI2MzI0NTEsMi41ODk0ODY4IDAsOC42MzE2MjI0IG0gLTIuNTg5NDg2NzEsLTEwLjM1Nzk0NjkgMS43MjYzMjQ0NywyLjU4OTQ4NjcgMCw3Ljc2ODQ2MDIgbSAwLjg2MzE2MjI0LC04LjYzMTYyMjQgMi41ODk0ODY3OSwtMi41ODk0ODY4IDEuNzI2MzI0NCwyLjU4OTQ4NjggMCwxMy44MTA1OTU5IG0gLTIuNTg5NDg2NywtMTUuNTM2OTIwNCAxLjcyNjMyNDUsMi41ODk0ODY3IDAsMTIuOTQ3NDMzNyBtIDAuODYzMTYyMiwtMTMuODEwNTk1OSAyLjU4OTQ4NjgsLTIuNTg5NDg2OCAwLjg2MzE2MjIsMS43MjYzMjQ1IDAuODYzMTYyMywyLjU4OTQ4NjggMCwyLjU4OTQ4NjcgLTAuODYzMTYyMywyLjU4OTQ4NjczIC0wLjg2MzE2MjIsMS43MjYzMjQ0NyAtMS43MjYzMjQ1LDEuNzI2MzI0NSAtMi41ODk0ODY3LDEuNzI2MzI0NSAtNC4zMTU4MTEzLDEuNzI2MzI0NSBtIDcuNzY4NDYwMiwtMTUuNTM2OTIwNCAwLjg2MzE2MjMsMC44NjMxNjIyIDAuODYzMTYyMiwyLjU4OTQ4NjggMCwyLjU4OTQ4NjcgLTAuODYzMTYyMiwyLjU4OTQ4NjczIC0wLjg2MzE2MjMsMS43MjYzMjQ0NyAtMS43MjYzMjQ1LDEuNzI2MzI0NSAtMi41ODk0ODY3LDEuNzI2MzI0NSAtMy40NTI2NDksMS43MjYzMjQ1XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBMaWJyYSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsaWJyYVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTI7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtODsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIGMgMC43NTE5LDFlLTUgMS4zOTI0LDAuMTIyMjcgMS45MzE2LDAuMzUxNTYgMC42NjE5LDAuMjg0OTUgMS4yMTM0LDAuNjM4NTQgMS42NjYsMS4wNjI1IDAuNDgzOCwwLjQ1NDgxIDAuODUzLDAuOTcyNTUgMS4xMTcyLDEuNTY2NDEgMC4yNDY3LDAuNTY2MTIgMC4zNzExLDEuMTczOTcgMC4zNzExLDEuODM3ODkgMCwwLjY0MTEzIC0wLjEyNDQsMS4yMzk0OCAtMC4zNzMsMS44MDg1OSAtMC4xNjI0LDAuMzYzMDUgLTAuMzYzMSwwLjY5NzI1IC0wLjYwNTUsMS4wMDU4NiBsIC0wLjYzNjcsMC44MDg2IDQuMzc4OSwwIDAsMC42NzE4NyAtNS40MDI0LDAgMCwtMC45MTc5NyBjIDAuMjE3MywtMC4xMzg1IDAuNDM3OSwtMC4yNzI0NCAwLjYzNjcsLTAuNDQ3MjYgMC40MjE1LC0wLjM2ODc2IDAuNzUyOSwtMC44Mjc4NCAwLjk4ODMsLTEuMzU1NDcgMC4yMjE1LC0wLjUwMDc0IDAuMzM0LC0xLjAzNTggMC4zMzQsLTEuNTg1OTQgMCwtMC41NTY1MyAtMC4xMTIyLC0xLjA5NDM0IC0wLjMzNCwtMS41OTU3IGwgLTAsLTAuMDAyIDAsLTAuMDA0IGMgLTAuMjI5MiwtMC40OTkwMSAtMC41NTgxLC0wLjk0Nzc4IC0wLjk3NDYsLTEuMzM3ODkgbCAtMCwtMC4wMDIgLTAsLTAuMDAyIGMgLTAuMzk2NywtMC4zNjE1NSAtMC44Njc5LC0wLjY1NzIzIC0xLjQwNjIsLTAuODg0NzYgbCAtMCwwIGMgLTAuNDk4NCwtMC4yMDkwMyAtMS4wNjIyLC0wLjMwNjYzIC0xLjY4MTcsLTAuMzA2NjQgLTAuNTkyNiwxZS01IC0xLjE1MjYsMC4xMDAwOCAtMS42Njk5LDAuMzAyNzMgbCAtMCwwIGMgLTAuNTI2MSwwLjIwNzk5IC0xLjAwMzIsMC41MDY3IC0xLjQxOTksMC44ODg2NyBsIC0wLDAuMDAyIC0wLDAuMDAyIGMgLTAuNDE2NiwwLjM5MDExIC0wLjc0NTQsMC44Mzg4NyAtMC45NzQ2LDEuMzM3ODkgbCAwLDAuMDA0IC0wLDAuMDAyIGMgLTAuMjIxOCwwLjUwMTM2IC0wLjMzNCwxLjAzOTE1IC0wLjMzNCwxLjU5NTcgMCwwLjU1MDE1IDAuMTEyNSwxLjA4NTE5IDAuMzM0LDEuNTg1OTQgbCAwLDAuMDAyIDAsMC4wMDQgYyAwLjIyOSwwLjQ5ODU1IDAuNTU3NCwwLjk0OTExIDAuOTc0NiwxLjMzOTg0IDAuMTg3NiwwLjE3NDgyIDAuNDE0MywwLjMxNDg0IDAuNjM2NywwLjQ1NzAzIGwgMCwwLjkxNzk3IC01LjM5MDYsMCAwLC0wLjY3MTg3IDQuMzc4OSwwIC0wLjYzNjcsLTAuODA4NiBjIC0wLjI0MjgsLTAuMzA5MDQgLTAuNDQzLC0wLjY0NDE4IC0wLjYwNTUsLTEuMDA3ODEgLTAuMjQ4NywtMC41NjkxMSAtMC4zNzMxLC0xLjE2NTUyIC0wLjM3MzEsLTEuODA2NjQgMCwtMC42NjM5MSAwLjEyNDQsLTEuMjcxNzggMC4zNzExLC0xLjgzNzg5IGwgMCwtMC4wMDIgYyAzZS00LC01LjhlLTQgLTJlLTQsLTEwZS00IDAsLTAuMDAyIDAuMjY0MSwtMC41OTIxOCAwLjYzMjYsLTEuMTA4NzEgMS4xMTUzLC0xLjU2MjUgMC40ODQ3LC0wLjQ1NTcxIDEuMDMzMiwtMC44MDU4NSAxLjY1NjIsLTEuMDU4NTkgMC41ODYxLC0wLjIzNDg4IDEuMjI5NCwtMC4zNTU0NiAxLjk0MTQsLTAuMzU1NDcgeiBtIC03Ljg0OTYsMTMuNDU4OTkgMTUuNjk5MiwwIDAsMC42NzE4NyAtMTUuNjk5MiwwIHpcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNjb3JwaW8gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2NvcnBpb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtNDsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDIuMzc4MTEwMSwtMi4zNzgxMTAxIDIuMzc4MTEwMSwyLjM3ODExMDEgMCw5LjUxMjQ0MDQgbSAtMy4xNzA4MTM1LC0xMS4wOTc4NDcxIDIuMzc4MTEwMSwyLjM3ODExMDEgMCw4LjcxOTczNyBtIDAuNzkyNzAzNCwtOS41MTI0NDA0IDIuMzc4MTEwMSwtMi4zNzgxMTAxIDIuMzc4MTEwMDcsMi4zNzgxMTAxIDAsOS41MTI0NDA0IG0gLTMuMTcwODEzNDcsLTExLjA5Nzg0NzEgMi4zNzgxMTAxLDIuMzc4MTEwMSAwLDguNzE5NzM3IG0gMC43OTI3MDMzNywtOS41MTI0NDA0IDIuMzc4MTEwMTMsLTIuMzc4MTEwMSAyLjM3ODExMDEsMi4zNzgxMTAxIDAsOC43MTk3MzcgMS41ODU0MDY3LDEuNTg1NDA2OCBtIC00Ljc1NjIyMDIsLTExLjg5MDU1MDUgMi4zNzgxMTAxLDIuMzc4MTEwMSAwLDguNzE5NzM3IDEuNTg1NDA2NywxLjU4NTQwNjcgMi4zNzgxMTAxLC0yLjM3ODExMDFcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNhZ2l0dGFyaXVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSA3OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMTcuMTE0NDQsMTcuMTE0NDQgbSAxNy4xMTQ0NCwtMTcuMTE0NDQgLTMuMjA4OTU3NSwxLjA2OTY1MjUgLTYuNDE3OTE1LDAgbSA3LjQ4NzU2NzUsMS4wNjk2NTI1IC0zLjIwODk1NzUsMCAtNC4yNzg2MSwtMS4wNjk2NTI1IG0gOS42MjY4NzI1LC0xLjA2OTY1MjUgLTEuMDY5NjUyNSwzLjIwODk1NzUgMCw2LjQxNzkxNTA0IG0gLTEuMDY5NjUyNSwtNy40ODc1Njc1NCAwLDMuMjA4OTU3NSAxLjA2OTY1MjUsNC4yNzg2MTAwNCBtIC04LjU1NzIyLDAgLTcuNDg3NTY3NSwwIG0gNi40MTc5MTUsMS4wNjk2NTI0NiAtMy4yMDg5NTc1LDAgLTMuMjA4OTU3NSwtMS4wNjk2NTI0NiBtIDcuNDg3NTY3NSwwIDAsNy40ODc1Njc0NiBtIC0xLjA2OTY1MjUsLTYuNDE3OTE1IDAsMy4yMDg5NTc1IDEuMDY5NjUyNSwzLjIwODk1NzVcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENhcHJpY29ybiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYXByaWNvcm5TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTM7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAxLjgwNDc2MzMsLTMuNjA5NTI2NyA0LjUxMTkwODQsOS4wMjM4MTY4IG0gLTQuNTExOTA4NCwtNy4yMTkwNTM0IDQuNTExOTA4NCw5LjAyMzgxNjcgMi43MDcxNDUsLTYuMzE2NjcxNyA0LjUxMTkwODQsMCAyLjcwNzE0NSwtMC45MDIzODE3IDAuOTAyMzgxNywtMS44MDQ3NjMzIDAsLTEuODA0NzYzNCAtMC45MDIzODE3LC0xLjgwNDc2MzMgLTEuODA0NzYzNCwtMC45MDIzODE3IC0wLjkwMjM4MTYsMCAtMS44MDQ3NjM0LDAuOTAyMzgxNyAtMC45MDIzODE3LDEuODA0NzYzMyAwLDEuODA0NzYzNCAwLjkwMjM4MTcsMi43MDcxNDUgMC45MDIzODE3LDEuODA0NzYzMzYgMC45MDIzODE3LDIuNzA3MTQ1MDQgMCwyLjcwNzE0NSAtMS44MDQ3NjM0LDEuODA0NzYzMyBtIDEuODA0NzYzNCwtMTYuMjQyODcwMSAtMC45MDIzODE3LDAuOTAyMzgxNyAtMC45MDIzODE3LDEuODA0NzYzMyAwLDEuODA0NzYzNCAxLjgwNDc2MzQsMy42MDk1MjY3IDAuOTAyMzgxNiwyLjcwNzE0NSAwLDIuNzA3MTQ1IC0wLjkwMjM4MTYsMS44MDQ3NjM0IC0xLjgwNDc2MzQsMC45MDIzODE2XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBcXVhcml1cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTg7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMjsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDIuODg2NjAzNSwtMi44ODY2MDM1IDMuODQ4ODA0NywxLjkyNDQwMjMgbSAtNC44MTEwMDU5LC0wLjk2MjIwMTEgMy44NDg4MDQ3LDEuOTI0NDAyMyAyLjg4NjYwMzUsLTIuODg2NjAzNSAyLjg4NjYwMzUsMS45MjQ0MDIzIG0gLTMuODQ4ODA0NjcsLTAuOTYyMjAxMSAyLjg4NjYwMzQ3LDEuOTI0NDAyMyAyLjg4NjYwMzUsLTIuODg2NjAzNSAxLjkyNDQwMjQsMS45MjQ0MDIzIG0gLTIuODg2NjAzNSwtMC45NjIyMDExIDEuOTI0NDAyMywxLjkyNDQwMjMgMi44ODY2MDM1LC0yLjg4NjYwMzUgbSAtMTcuMzE5NjIxLDguNjU5ODEwNSAyLjg4NjYwMzUsLTIuODg2NjAzNDggMy44NDg4MDQ3LDEuOTI0NDAyMzggbSAtNC44MTEwMDU5LC0wLjk2MjIwMTIxIDMuODQ4ODA0NywxLjkyNDQwMjMxIDIuODg2NjAzNSwtMi44ODY2MDM0OCAyLjg4NjYwMzUsMS45MjQ0MDIzOCBtIC0zLjg0ODgwNDY3LC0wLjk2MjIwMTIxIDIuODg2NjAzNDcsMS45MjQ0MDIzMSAyLjg4NjYwMzUsLTIuODg2NjAzNDggMS45MjQ0MDI0LDEuOTI0NDAyMzggbSAtMi44ODY2MDM1LC0wLjk2MjIwMTIxIDEuOTI0NDAyMywxLjkyNDQwMjMxIDIuODg2NjAzNSwtMi44ODY2MDM0OFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogUGlzY2VzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBpc2Nlc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTg7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtODsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDQsMiAyLDIgMSwzIDAsMyAtMSwzIC0yLDIgLTQsMiBtIDAsLTE3IDMsMSAyLDEgMiwyIDEsMyBtIDAsMyAtMSwzIC0yLDIgLTIsMSAtMywxIG0gMTYsLTE3IC0zLDEgLTIsMSAtMiwyIC0xLDMgbSAwLDMgMSwzIDIsMiAyLDEgMywxIG0gMCwtMTcgLTQsMiAtMiwyIC0xLDMgMCwzIDEsMyAyLDIgNCwyIG0gLTE3LC05IDE4LDAgbSAtMTgsMSAxOCwwXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTdW4gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3VuU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtMTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC03OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMi4xODE4MiwwLjcyNzI2OCAtMi4xODE4MTksMS40NTQ1NDMgLTEuNDU0NTUyLDIuMTgxODIgLTAuNzI3MjY4LDIuMTgxODE5IDAsMi4xODE4MTkgMC43MjcyNjgsMi4xODE4MTkgMS40NTQ1NTIsMi4xODE4MiAyLjE4MTgxOSwxLjQ1NDU0NCAyLjE4MTgyLDAuNzI3Mjc2IDIuMTgxODEsMCAyLjE4MTgyLC0wLjcyNzI3NiAyLjE4MTgxOSwtMS40NTQ1NDQgMS40NTQ1NTIsLTIuMTgxODIgMC43MjcyNjgsLTIuMTgxODE5IDAsLTIuMTgxODE5IC0wLjcyNzI2OCwtMi4xODE4MTkgLTEuNDU0NTUyLC0yLjE4MTgyIC0yLjE4MTgxOSwtMS40NTQ1NDMgLTIuMTgxODIsLTAuNzI3MjY4IC0yLjE4MTgxLDAgbSAwLjcyNzI2Nyw2LjU0NTQ1IC0wLjcyNzI2NywwLjcyNzI3NiAwLDAuNzI3Mjc1IDAuNzI3MjY3LDAuNzI3MjY4IDAuNzI3Mjc2LDAgMC43MjcyNjcsLTAuNzI3MjY4IDAsLTAuNzI3Mjc1IC0wLjcyNzI2NywtMC43MjcyNzYgLTAuNzI3Mjc2LDAgbSAwLDAuNzI3Mjc2IDAsMC43MjcyNzUgMC43MjcyNzYsMCAwLC0wLjcyNzI3NSAtMC43MjcyNzYsMFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogTW9vbiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtb29uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtNDsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC03OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiBhIDcuNDk2OTI4Myw3LjQ5NjkyODMgMCAwIDEgMCwxNC4zMjc0NjIgNy40OTY5MjgzLDcuNDk2OTI4MyAwIDEgMCAwLC0xNC4zMjc0NjIgelwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogTWVyY3VyeSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtZXJjdXJ5U3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtMjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IDc7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgNC4yNjAxMSwwIG0gLTIuMTMwMDUsLTIuOTgyMDcgMCw1LjExMjEzIG0gNC43MDMxMiwtOS43OTgzIGEgNC43MDMxNSw0LjcwMzE1IDAgMCAxIC00LjcwMzE1LDQuNzAzMTQgNC43MDMxNSw0LjcwMzE1IDAgMCAxIC00LjcwMzE0LC00LjcwMzE0IDQuNzAzMTUsNC43MDMxNSAwIDAgMSA0LjcwMzE0LC00LjcwMzE1IDQuNzAzMTUsNC43MDMxNSAwIDAgMSA0LjcwMzE1LDQuNzAzMTUgelwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIGNvbnN0IGNyb3duWFNoaWZ0ID0gNjsgLy9weFxuICAgICAgY29uc3QgY3Jvd25ZU2hpZnQgPSAtMTY7IC8vcHhcbiAgICAgIGNvbnN0IGNyb3duID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBjcm93bi5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgKHggKyBjcm93blhTaGlmdCkgKyBcIiwgXCIgKyAoeSArIGNyb3duWVNoaWZ0KSArIFwiIGEgMy45NzE3ODU1LDMuOTcxNzg1NSAwIDAgMSAtMy45NTU0MSwzLjU5MDU0IDMuOTcxNzg1NSwzLjk3MTc4NTUgMCAwIDEgLTMuOTUxODUsLTMuNTk0NDVcIik7XG4gICAgICBjcm93bi5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY3Jvd24pXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBWZW51cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB2ZW51c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gMjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IDc7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC00LjkzNzY2OSwwLjAzOTczIG0gMi40NDg5NzIsMi4zNjQ2MDcgMCwtNS43OTAxNCBjIC0zLjEwOTU0NiwtMC4wMDg1IC01LjYyNDYxNywtMi41MzQyMTIgLTUuNjIwMTg3LC01LjY0MjA4IDAuMDA0NCwtMy4xMDc3MDYgMi41MjY1MTQsLTUuNjIxNjg5IDUuNjM1NTgyLC01LjYyMTY4OSAzLjEwOTA2OCwwIDUuNjMxMTUyLDIuNTEzOTgzIDUuNjM1NTgyLDUuNjIxNjg5IDAuMDA0NCwzLjEwNzg2OCAtMi41MTA2NDEsNS42MzM1ODYgLTUuNjIwMTg3LDUuNjQyMDhcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1hcnMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFyc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gMzsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0zOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiBjIC01LjI0NzQzOCwtNC4xNTA2MjMgLTExLjY5OTMsMy4yMDU1MTggLTcuMDE4ODA3LDcuODg2MDA3IDQuNjgwNDk0LDQuNjgwNDg4IDEyLjAzNjYyOCwtMS43NzEzODIgNy44ODU5OTksLTcuMDE4ODE2IHogbSAwLDAgMC40MzM1OTcsMC40MzM1OTUgMy45OTY1NjYsLTQuMjE3NDE5IG0gLTMuMjM5ODAyLC0wLjA1NTIxIDMuMjk1MDE1LDAgMC4xMTA0MjcsMy42ODE1MDdcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEp1cGl0ZXIgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24ganVwaXRlclN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTY7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMjsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgYyAtMC40MzQ3MywwIC0xLjMwNDIyLC0wLjQwNTcyIC0xLjMwNDIyLC0yLjAyODU3IDAsLTEuNjIyODUgMS43Mzg5NywtMy4yNDU3IDMuNDc3OTIsLTMuMjQ1NyAxLjczODk3LDAgMy40Nzc5MiwxLjIxNzE1IDMuNDc3OTIsNC4wNTcxMyAwLDIuODM5OTkgLTIuMTczNyw3LjMwMjgzIC02LjUyMTA4LDcuMzAyODMgbSAxMi4xNzI2OSwwIC0xMi42MDc0NSwwIG0gOS45OTkwMiwtMTEuNzY1NjcgMCwxNS44MjI3OVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogU2F0dXJuIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNhdHVyblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gNDsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IDc7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIGMgLTAuNTIyMjIsMC41MjIyMSAtMS4wNDQ0NSwxLjA0NDQ0IC0xLjU2NjY2LDEuMDQ0NDQgLTAuNTIyMjIsMCAtMS41NjY2NywtMC41MjIyMyAtMS41NjY2NywtMS41NjY2NyAwLC0xLjA0NDQzIDAuNTIyMjMsLTIuMDg4ODcgMS41NjY2NywtMy4xMzMzMiAxLjA0NDQ0LC0xLjA0NDQzIDIuMDg4ODgsLTMuMTMzMzEgMi4wODg4OCwtNS4yMjIxOSAwLC0yLjA4ODg4IC0xLjA0NDQ0LC00LjE3Nzc2IC0zLjEzMzMyLC00LjE3Nzc2IC0xLjk3NTY2LDAgLTMuNjU1NTUsMS4wNDQ0NCAtNC42OTk5OCwzLjEzMzMzIG0gLTIuNTU1MTUsLTUuODc0OTkgNi4yNjY2NCwwIG0gLTMuNzExNDksLTIuNDgwNTQgMCwxNS4xNDQzOFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogVXJhbnVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVyYW51c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTU7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtNjsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgICAgY29uc3QgaG9ybnMgPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIGhvcm5zLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiICAwLDEwLjIzODI0IG0gMTAuMjM2MzMsLTEwLjMyNzY0IDAsMTAuMjM4MjQgbSAtMTAuMjY2MDYsLTQuNjM5NCAxMC4yMzA4NSwwIG0gLTUuMDY0MTUsLTUuNTE1MzIgMCwxMS45NDk4NVwiKTtcbiAgICAgIGhvcm5zLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChob3JucylcblxuICAgICAgY29uc3QgYm9keVhTaGlmdCA9IDc7IC8vcHhcbiAgICAgIGNvbnN0IGJvZHlZU2hpZnQgPSAxMzsgLy9weFxuICAgICAgY29uc3QgYm9keSA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgYm9keS5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgKHggKyBib2R5WFNoaWZ0KSArIFwiLCBcIiArICh5ICsgYm9keVlTaGlmdCkgKyBcIiBhIDEuODM4NDM3NywxLjgzODQzNzcgMCAwIDEgLTEuODM4NDQsMS44Mzg0MyAxLjgzODQzNzcsMS44Mzg0Mzc3IDAgMCAxIC0xLjgzODQyLC0xLjgzODQzIDEuODM4NDM3NywxLjgzODQzNzcgMCAwIDEgMS44Mzg0MiwtMS44Mzg0NCAxLjgzODQzNzcsMS44Mzg0Mzc3IDAgMCAxIDEuODM4NDQsMS44Mzg0NCB6XCIpO1xuICAgICAgYm9keS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoYm9keSlcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcblxuICAgIH1cblxuICAgIC8qXG4gICAgICogTmVwdHVuZSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSA0OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTY7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDEuNzcwNTksLTIuMzYzMTIgMi4zMTg3MiwxLjgwNDUgbSAtMTQuNDQyNjQsLTAuMjAwMDYgMi4zNDExMywtMS43NzQxOCAxLjc0MDg1LDIuMzg1OTUgbSAtMS44MDAxMywtMS43NzI2NSBjIC0xLjIzNzc2LDguNDA5NzUgMC44MjUxOCw5LjY3MTIxIDQuOTUxMDYsOS42NzEyMSA0LjEyNTg5LDAgNi4xODg4MywtMS4yNjE0NiA0Ljk1MTA3LC05LjY3MTIxIG0gLTcuMDUzMzQsMy4xNzAwNSAyLjAzOTk3LC0yLjEyNTU5IDIuMDg1NjUsMi4wNzkwMyBtIC01LjMyNDA2LDkuOTExNjIgNi42MDE0MiwwIG0gLTMuMzAwNzEsLTEyLjE5NDE0IDAsMTUuNTU4MDNcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFBsdXRvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSA2OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTc7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVFxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICAgIGNvbnN0IGJvZHkgPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIGJvZHkuc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgYSA1Ljc2NzY4NTYsNS43Njc2ODU2IDAgMCAxIC0yLjg4Mzg1LDQuOTk0OTYgNS43Njc2ODU2LDUuNzY3Njg1NiAwIDAgMSAtNS43Njc2OCwwIDUuNzY3Njg1Niw1Ljc2NzY4NTYgMCAwIDEgLTIuODgzODUsLTQuOTk0OTYgbSA1Ljc2NzcxLDEzLjkzODU4IDAsLTguMTcwODggbSAtMy44NDUxMiw0LjMyNTc2IDcuNjkwMjQsMFwiKTtcbiAgICAgIGJvZHkuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGJvZHkpXG5cbiAgICAgIGNvbnN0IGhlYWRYU2hpZnQgPSAtMi40OyAvL3B4XG4gICAgICBjb25zdCBoZWFkWVNoaWZ0ID0gLTE7IC8vcHhcbiAgICAgIGNvbnN0IGhlYWQgPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIGhlYWQuc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArICh4ICsgaGVhZFhTaGlmdCkgKyBcIiwgXCIgKyAoeSArIGhlYWRZU2hpZnQpICsgXCIgYSAzLjM2NDQ4MzQsMy4zNjQ0ODM0IDAgMCAxIC0zLjM2NDQ4LDMuMzY0NDkgMy4zNjQ0ODM0LDMuMzY0NDgzNCAwIDAgMSAtMy4zNjQ0OCwtMy4zNjQ0OSAzLjM2NDQ4MzQsMy4zNjQ0ODM0IDAgMCAxIDMuMzY0NDgsLTMuMzY0NDggMy4zNjQ0ODM0LDMuMzY0NDgzNCAwIDAgMSAzLjM2NDQ4LDMuMzY0NDggelwiKTtcbiAgICAgIGhlYWQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGhlYWQpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDaGlyb24gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2hpcm9uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSA0OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gMzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgICAgY29uc3QgYm9keSA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgYm9keS5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiBhIDMuODc2NDcyNSwzLjA2NzUyNDkgMCAwIDEgLTMuODc2NDczLDMuMDY3NTI1IDMuODc2NDcyNSwzLjA2NzUyNDkgMCAwIDEgLTMuODc2NDcyLC0zLjA2NzUyNSAzLjg3NjQ3MjUsMy4wNjc1MjQ5IDAgMCAxIDMuODc2NDcyLC0zLjA2NzUyNSAzLjg3NjQ3MjUsMy4wNjc1MjQ5IDAgMCAxIDMuODc2NDczLDMuMDY3NTI1IHpcIik7XG4gICAgICBib2R5LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChib2R5KVxuXG4gICAgICBjb25zdCBoZWFkWFNoaWZ0ID0gMDsgLy9weFxuICAgICAgY29uc3QgaGVhZFlTaGlmdCA9IC0xNC41OyAvL3B4XG4gICAgICBjb25zdCBoZWFkID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBoZWFkLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyAoeCArIGhlYWRYU2hpZnQpICsgXCIsIFwiICsgKHkgKyBoZWFkWVNoaWZ0KSArIFwiICAgLTMuOTQyOTk3LDQuMjQzODQ0IDQuMTEwODQ5LDMuNjU2MTUxIG0gLTQuODY3NTY5LC05LjAwOTQ2OCAwLDExLjcyNzI1MVwiKTtcbiAgICAgIGhlYWQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGhlYWQpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBMaWxpdGggc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGlsaXRoU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAyOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gMzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTIuNTI1NDM1LC0xLjEyODUzIC0xLjQ2NDc1MiwtMS43OTUzOSAtMC44MDgxMzgsLTIuMjA1NzYgMC4xNTE1MjYsLTIuMDUxODggMC45MDkxNTYsLTEuNTM4OSAxLjAxMDE3MywtMS4wMjU5MyAwLjkwOTE1NywtMC41NjQyNyAxLjM2MzczNSwtMC42MTU1NiBtIDIuMzE1MzI3LC0wLjM5MDU1IC0xLjcxNjMwMSwwLjU0NzE2IC0xLjcxNjMsMS4wOTQzMSAtMS4xNDQyLDEuNjQxNDYgLTAuNTcyMTAyLDEuNjQxNDYgMCwxLjY0MTQ2IDAuNTcyMTAyLDEuNjQxNDcgMS4xNDQyLDEuNjQxNDUgMS43MTYzLDEuMDk0MzIgMS43MTYzMDEsMC41NDcxNSBtIDAsLTExLjQ5MDI0IC0yLjI4ODQsMCAtMi4yODg0MDEsMC41NDcxNiAtMS43MTYzMDIsMS4wOTQzMSAtMS4xNDQyMDEsMS42NDE0NiAtMC41NzIxLDEuNjQxNDYgMCwxLjY0MTQ2IDAuNTcyMSwxLjY0MTQ3IDEuMTQ0MjAxLDEuNjQxNDUgMS43MTYzMDIsMS4wOTQzMiAyLjI4ODQwMSwwLjU0NzE1IDIuMjg4NCwwIG0gLTQuMzY3MTIsLTAuNDc1MiAwLDYuNDQzMDcgbSAtMi43MDkxMDcsLTMuNDExMDEgNS42MTYwMjUsMFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogTk5vZGUgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbm5vZGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC0zOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gMzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTEuMzMzMzMzNCwtMC42NjY2NjY3IC0wLjY2NjY2NjYsMCAtMS4zMzMzMzM0LDAuNjY2NjY2NyAtMC42NjY2NjY3LDEuMzMzMzMzMyAwLDAuNjY2NjY2NyAwLjY2NjY2NjcsMS4zMzMzMzMzIDEuMzMzMzMzNCwwLjY2NjY2NjcgMC42NjY2NjY2LDAgMS4zMzMzMzM0LC0wLjY2NjY2NjcgMC42NjY2NjY2LC0xLjMzMzMzMzMgMCwtMC42NjY2NjY3IC0wLjY2NjY2NjYsLTEuMzMzMzMzMyAtMiwtMi42NjY2NjY2NSAtMC42NjY2NjY3LC0xLjk5OTk5OTk1IDAsLTEuMzMzMzMzNCAwLjY2NjY2NjcsLTIgMS4zMzMzMzMzLC0xLjMzMzMzMzMgMiwtMC42NjY2NjY3IDIuNjY2NjY2NiwwIDIsMC42NjY2NjY3IDEuMzMzMzMzMywxLjMzMzMzMzMgMC42NjY2NjY3LDIgMCwxLjMzMzMzMzQgLTAuNjY2NjY2NywxLjk5OTk5OTk1IC0yLDIuNjY2NjY2NjUgLTAuNjY2NjY2NiwxLjMzMzMzMzMgMCwwLjY2NjY2NjcgMC42NjY2NjY2LDEuMzMzMzMzMyAxLjMzMzMzMzQsMC42NjY2NjY3IDAuNjY2NjY2NiwwIDEuMzMzMzMzNCwtMC42NjY2NjY3IDAuNjY2NjY2NywtMS4zMzMzMzMzIDAsLTAuNjY2NjY2NyAtMC42NjY2NjY3LC0xLjMzMzMzMzMgLTEuMzMzMzMzNCwtMC42NjY2NjY3IC0wLjY2NjY2NjYsMCAtMS4zMzMzMzM0LDAuNjY2NjY2NyBtIC03Ljk5OTk5OTksLTYgMC42NjY2NjY3LC0xLjMzMzMzMzMgMS4zMzMzMzMzLC0xLjMzMzMzMzMgMiwtMC42NjY2NjY3IDIuNjY2NjY2NiwwIDIsMC42NjY2NjY3IDEuMzMzMzMzMywxLjMzMzMzMzMgMC42NjY2NjY3LDEuMzMzMzMzM1wiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQge1xuICBTVkdVdGlscyBhc1xuICBkZWZhdWx0XG59XG4iLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFV0aWxzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFV0aWxzKSB7XG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgREVHXzM2MCA9IDM2MFxuICBzdGF0aWMgREVHXzE4MCA9IDE4MFxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSByYW5kb20gSURcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2VuZXJhdGVVbmlxdWVJZCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHJhbmRvbU51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgY29uc3QgdW5pcXVlSWQgPSBgaWRfJHtyYW5kb21OdW1iZXJ9XyR7dGltZXN0YW1wfWA7XG4gICAgcmV0dXJuIHVuaXF1ZUlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEludmVydGVkIGRlZ3JlZSB0byByYWRpYW5cbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVJbmRlZ3JlZVxuICAgKiBAcGFyYW0ge051bWJlcn0gc2hpZnRJbkRlZ3JlZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgZGVncmVlVG9SYWRpYW4gPSBmdW5jdGlvbihhbmdsZUluRGVncmVlLCBzaGlmdEluRGVncmVlID0gMCkge1xuICAgIHJldHVybiAoc2hpZnRJbkRlZ3JlZSAtIGFuZ2xlSW5EZWdyZWUpICogTWF0aC5QSSAvIDE4MFxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHJhZGlhbiB0byBkZWdyZWVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaWFuXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIHN0YXRpYyByYWRpYW5Ub0RlZ3JlZSA9IGZ1bmN0aW9uKHJhZGlhbikge1xuICAgIHJldHVybiAocmFkaWFuICogMTgwIC8gTWF0aC5QSSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGEgcG9zaXRpb24gb2YgdGhlIHBvaW50IG9uIHRoZSBjaXJjbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjeCAtIGNlbnRlciB4XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjeSAtIGNlbnRlciB5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZUluUmFkaWFuc1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge3g6TnVtYmVyLCB5Ok51bWJlcn1cbiAgICovXG4gIHN0YXRpYyBwb3NpdGlvbk9uQ2lyY2xlKGN4LCBjeSwgcmFkaXVzLCBhbmdsZUluUmFkaWFucykge1xuICAgIHJldHVybiB7XG4gICAgICB4OiAocmFkaXVzICogTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpICsgY3gpLFxuICAgICAgeTogKHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKSArIGN5KVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBuZXcgcG9zaXRpb24gb2YgcG9pbnRzIG9uIGNpcmNsZSB3aXRob3V0IG92ZXJsYXBwaW5nIGVhY2ggb3RoZXJcbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IC0gSWYgdGhlcmUgaXMgbm8gcGxhY2Ugb24gdGhlIGNpcmNsZSB0byBwbGFjZSBwb2ludHMuXG4gICAqIEBwYXJhbSB7QXJyYXl9IHBvaW50cyAtIFt7bmFtZTpcImFcIiwgcG9zaXRpb246MTB9LCB7bmFtZTpcImJcIiwgcG9zaXRpb246MjB9XVxuICAgKiBAcGFyYW0ge051bWJlcn0gY29sbGlzaW9uUmFkaXVzIC0gcG9pbnQgcmFkaXVzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7XCJNb29uXCI6MzAsIFwiU3VuXCI6NjAsIFwiTWVyY3VyeVwiOjg2LCAuLi59XG4gICAqL1xuICBzdGF0aWMgY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCBjb2xsaXNpb25SYWRpdXMsIGNpcmNsZVJhZGl1cykge1xuICAgIGNvbnN0IFNURVAgPSAxIC8vZGVncmVlXG5cbiAgICBjb25zdCBjZWxsV2lkdGggPSAxMCAvL2RlZ3JlZVxuICAgIGNvbnN0IG51bWJlck9mQ2VsbHMgPSBVdGlscy5ERUdfMzYwIC8gY2VsbFdpZHRoXG4gICAgY29uc3QgZnJlcXVlbmN5ID0gbmV3IEFycmF5KCBudW1iZXJPZkNlbGxzICkuZmlsbCgwKVxuICAgIGZvcihjb25zdCBwb2ludCBvZiBwb2ludHMpe1xuICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKHBvaW50LnBvc2l0aW9uIC8gY2VsbFdpZHRoKVxuICAgICAgZnJlcXVlbmN5W2luZGV4XSArPSAxXG4gICAgfVxuXG4gICAgLy8gSW4gdGhpcyBhbGdvcml0aG0gdGhlIG9yZGVyIG9mIHBvaW50cyBpcyBjcnVjaWFsLlxuICAgIC8vIEF0IHRoYXQgcG9pbnQgaW4gdGhlIGNpcmNsZSwgd2hlcmUgdGhlIHBlcmlvZCBjaGFuZ2VzIGluIHRoZSBjaXJjbGUgKGZvciBpbnN0YW5jZTpbMzU4LDM1OSwwLDFdKSwgdGhlIHBvaW50cyBhcmUgYXJyYW5nZWQgaW4gaW5jb3JyZWN0IG9yZGVyLlxuICAgIC8vIEFzIGEgc3RhcnRpbmcgcG9pbnQsIEkgdHJ5IHRvIGZpbmQgYSBwbGFjZSB3aGVyZSB0aGVyZSBhcmUgbm8gcG9pbnRzLiBUaGlzIHBsYWNlIEkgdXNlIGFzIFNUQVJUX0FOR0xFLiAgXG4gICAgY29uc3QgU1RBUlRfQU5HTEUgPSBjZWxsV2lkdGggKiBmcmVxdWVuY3kuZmluZEluZGV4KCBjb3VudCA9PiBjb3VudCA9PSAwIClcblxuICAgIGNvbnN0IF9wb2ludHMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IHBvaW50Lm5hbWUsXG4gICAgICAgIHBvc2l0aW9uOiBwb2ludC5wb3NpdGlvbiA8IFNUQVJUX0FOR0xFID8gcG9pbnQucG9zaXRpb24gKyBVdGlscy5ERUdfMzYwIDogcG9pbnQucG9zaXRpb25cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgX3BvaW50cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5wb3NpdGlvbiAtIGIucG9zaXRpb25cbiAgICB9KVxuXG4gICAgLy8gUmVjdXJzaXZlIGZ1bmN0aW9uXG4gICAgY29uc3QgYXJyYW5nZVBvaW50cyA9ICgpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsbiA9IF9wb2ludHMubGVuZ3RoOyBpIDwgbG47IGkrKykge1xuICAgICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSgwLCAwLCBjaXJjbGVSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKF9wb2ludHNbaV0ucG9zaXRpb24pKVxuICAgICAgICBfcG9pbnRzW2ldLnggPSBwb2ludFBvc2l0aW9uLnhcbiAgICAgICAgX3BvaW50c1tpXS55ID0gcG9pbnRQb3NpdGlvbi55XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhfcG9pbnRzW2ldLnggLSBfcG9pbnRzW2pdLngsIDIpICsgTWF0aC5wb3coX3BvaW50c1tpXS55IC0gX3BvaW50c1tqXS55LCAyKSk7XG4gICAgICAgICAgaWYgKGRpc3RhbmNlIDwgKDIgKiBjb2xsaXNpb25SYWRpdXMpKSB7XG4gICAgICAgICAgICBfcG9pbnRzW2ldLnBvc2l0aW9uICs9IFNURVBcbiAgICAgICAgICAgIF9wb2ludHNbal0ucG9zaXRpb24gLT0gU1RFUFxuICAgICAgICAgICAgYXJyYW5nZVBvaW50cygpIC8vPT09PT09PiBSZWN1cnNpdmUgY2FsbFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGFycmFuZ2VQb2ludHMoKVxuXG4gICAgcmV0dXJuIF9wb2ludHMucmVkdWNlKChhY2N1bXVsYXRvciwgcG9pbnQsIGN1cnJlbnRJbmRleCkgPT4ge1xuICAgICAgYWNjdW11bGF0b3JbcG9pbnQubmFtZV0gPSBwb2ludC5wb3NpdGlvblxuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yXG4gICAgfSwge30pXG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgVXRpbHMgYXNcbiAgZGVmYXVsdFxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi91bml2ZXJzZS9Vbml2ZXJzZS5qcydcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuL3V0aWxzL1NWR1V0aWxzLmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMvVXRpbHMuanMnXG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJ1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnXG5cbmV4cG9ydCB7VW5pdmVyc2UgYXMgXCJDaGFydFwiLCBTVkdVdGlscywgVXRpbHMsIFJhZGl4Q2hhcnQsIFRyYW5zaXRDaGFydH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==