/*!
 * 
 *       astrochart2
 *       A JavaScript for generating Astrology charts.
 *       Version: 0.1.0
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
  #innerCircleRadius
  #centerCircleRadius
  #rullerCircleRadius

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
    this.#innerCircleRadius = this.#radius - this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO
    this.#centerCircleRadius = this.#radius / RadixChart.OUTER_CIRCLE_RADIUS_RATIO
    this.#rullerCircleRadius = this.#radius - (this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO + RadixChart.RULER_LENGTH)

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
    this.#drawCusps(data.cusps)
    this.#drawBorders()
  }

  #drawBackground() {
    const MASK_ID = `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}-background-mask-1`

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const mask = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGMask(MASK_ID)
    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radius)
    outerCircle.setAttribute('fill', "white")
    mask.appendChild(outerCircle)

    const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#centerCircleRadius)
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
      let symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(SYMBOL_SIGNS[symbolIndex], position.x, position.y, this.#settings.RADIX_SIGNS_SCALE)
      symbol.setAttribute("stroke", this.#settings.CHART_SIGNS_COLOR);
      symbol.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      return symbol
    }

    const makeSegment = (symbolIndex, angleFromInDegree, angleToInDegree) => {
      let a1 = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(angleFromInDegree, this.#anscendantShift)
      let a2 = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(angleToInDegree, this.#anscendantShift)
      let segment = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSegment(this.#centerX, this.#centerY, this.#radius, a1, a2, this.#innerCircleRadius);
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

    let startAngle = this.#anscendantShift
    for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(startAngle))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius + RadixChart.RULER_LENGTH / (i % 2 + 1), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(startAngle))
      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);

      startAngle += STEP
    }

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius);
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
    const POINT_RADIUS = this.#innerCircleRadius - (4*RadixChart.RULER_LENGTH)

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()
    const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].calculatePositionWithoutOverlapping(points, this.#settings.CHART_POINT_COLLISION_RADIUS, POINT_RADIUS)
    for (const pointData of points) {
      const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_3__["default"](pointData)
      const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#innerCircleRadius - 1.5 * RadixChart.RULER_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(point.getPosition(), this.#anscendantShift))
      const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, POINT_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(positions[point.getName()], this.#anscendantShift))

      // ruler mark
      const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#rullerCircleRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(point.getPosition(), this.#anscendantShift))
      const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
      rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(rulerLine);

      // symbol
      const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y, this.#settings.RADIX_POINTS_SCALE)
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

  /*
   * Draw points
   * @param {Array} cusps - [{"position":Number}]
   */
  #drawCusps(cusps){
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const textRadius = 30

    for(let i = 0; i < cusps.length; i++ ){
      const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#centerCircleRadius, cusps[i].position)
      const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius, cusps[i].position)
      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);
    }

    this.#root.appendChild(wrapper)
  }

  #drawBorders() {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#innerCircleRadius)
    innerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    innerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(innerCircle)

    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#radius)
    outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(outerCircle)

    const centerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGCircle(this.#centerX, this.#centerY, this.#centerCircleRadius)
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
  * @param {Number} [scale]
  *
  * @return {SVGElement}
  */
  getSymbol(xPos, yPos, scale){
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()
    const symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(this.#name, xPos, yPos, scale)
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
const CHART_LINE_COLOR = "#666";

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
/* harmony export */   "RADIX_ID": () => (/* binding */ RADIX_ID),
/* harmony export */   "RADIX_POINTS_SCALE": () => (/* binding */ RADIX_POINTS_SCALE),
/* harmony export */   "RADIX_SIGNS_SCALE": () => (/* binding */ RADIX_SIGNS_SCALE)
/* harmony export */ });
/*
* Radix chart element ID
* @constant
* @type {String}
* @default radix
*/
const RADIX_ID = "radix"

/*
* Scale points ratio
* @constant
* @type {Number}
* @default 1
*/
const RADIX_POINTS_SCALE = 1

/*
* Scale signs ratio
* @constant
* @type {Number}
* @default 1
*/
const RADIX_SIGNS_SCALE = 1


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
  static SVGSymbol(name, xPos, yPos, scale = 1) {
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
        return ariesSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_TAURUS:
        return taurusSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_GEMINI:
        return geminiSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_CANCER:
        return cancerSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_LEO:
        return leoSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_VIRGO:
        return virgoSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_LIBRA:
        return libraSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_SCORPIO:
        return scorpioSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_SAGITTARIUS:
        return sagittariusSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_CAPRICORN:
        return capricornSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_AQUARIUS:
        return aquariusSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_PISCES:
        return piscesSymbol(xPos, yPos, scale)
        break;

      case SVGUtils.SYMBOL_SUN:
        return sunSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_MOON:
        return moonSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_MERCURY:
        return mercurySymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_VENUS:
        return venusSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_MARS:
        return marsSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_JUPITER:
        return jupiterSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_SATURN:
        return saturnSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_URANUS:
        return uranusSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NEPTUNE:
        return neptuneSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_PLUTO:
        return plutoSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_CHIRON:
        return chironSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_LILITH:
        return lilithSymbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NNODE:
        return nnodeSymbol(xPos, yPos, scale)
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
    function ariesSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -9; //px
      const Y_SHIFT = -2; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -0.9,-0.9 0,-1.8 0.9,-1.8 1.8,-0.8999998 1.8,0 1.8,0.8999998 0.9,0.9 0.9,1.8 0.9,4.5 m -9,-5.4 1.8,-1.8 1.8,0 1.8,0.9 0.9,0.9 0.9,1.8 0.9,3.6 0,9.9 m 8.1,-12.6 0.9,-0.9 0,-1.8 -0.9,-1.8 -1.8,-0.8999998 -1.8,0 -1.8,0.8999998 -0.9,0.9 -0.9,1.8 -0.9,4.5 m 9,-5.4 -1.8,-1.8 -1.8,0 -1.8,0.9 -0.9,0.9 -0.9,1.8 -0.9,3.6 0,9.9");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Taurus symbol
     */
    function taurusSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -9; //px
      const Y_SHIFT = -11; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 1,4 1,2 2,2 3,1 4,0 3,-1 2,-2 1,-2 1,-4 m -18,0 1,3 1,2 2,2 3,1 4,0 3,-1 2,-2 1,-2 1,-3 m -11,8 -2,1 -1,1 -1,2 0,3 1,2 2,2 2,1 2,0 2,-1 2,-2 1,-2 0,-3 -1,-2 -1,-1 -2,-1 m -4,1 -2,1 -1,2 0,3 1,3 m 8,0 1,-3 0,-3 -1,-2 -2,-1");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Gemini symbol
     */
    function geminiSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -5; //px
      const Y_SHIFT = -6; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 0,11.546414 m 0.9622011,-10.5842129 0,9.6220117 m 7.6976097,-9.6220117 0,9.6220117 m 0.962201,-10.5842128 0,11.546414 m -13.4708165,-14.4330172 1.9244023,1.924402 1.9244024,0.9622012 2.8866038,0.9622011 3.848804,0 2.886604,-0.9622011 1.924402,-0.9622012 1.924403,-1.924402 m -17.3196215,17.3196207 1.9244023,-1.9244024 1.9244024,-0.9622011 2.8866038,-0.9622012 3.848804,0 2.886604,0.9622012 1.924402,0.9622011 1.924403,1.9244024");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Cancer symbol
     */
    function cancerSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 9; //px
      const Y_SHIFT = -9; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -15,0 -2,1 -1,2 0,2 1,2 2,1 2,0 2,-1 1,-2 0,-2 -1,-2 11,0 m -18,3 1,2 1,1 2,1 m 4,-4 -1,-2 -1,-1 -2,-1 m -4,15 15,0 2,-1 1,-2 0,-2 -1,-2 -2,-1 -2,0 -2,1 -1,2 0,2 1,2 -11,0 m 18,-3 -1,-2 -1,-1 -2,-1 m -4,4 1,2 1,1 2,1");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Leo symbol
     */
    function leoSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -3; //px
      const Y_SHIFT = 4; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " -2,-1 -1,0 -2,1 -1,2 0,1 1,2 2,1 1,0 2,-1 1,-2 0,-1 -1,-2 -5,-5 -1,-2 0,-3 1,-2 2,-1 3,-1 4,0 4,1 2,2 1,2 0,3 -1,3 -3,3 -1,2 0,2 1,2 2,0 1,-1 1,-2 m -13,-5 -2,-3 -1,-2 0,-3 1,-2 1,-1 m 7,-1 3,1 2,2 1,2 0,3 -1,3 -2,3");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Virgo symbol
     */
    function virgoSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -9; //px
      const Y_SHIFT = -5; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 2.5894868,-2.5894868 1.7263245,2.5894868 0,9.4947847 m -2.5894868,-11.2211092 1.7263245,2.5894867 0,8.6316225 m 0.8631623,-9.4947847 2.5894867,-2.5894868 1.72632451,2.5894868 0,8.6316224 m -2.58948671,-10.3579469 1.72632447,2.5894867 0,7.7684602 m 0.86316224,-8.6316224 2.58948679,-2.5894868 1.7263244,2.5894868 0,13.8105959 m -2.5894867,-15.5369204 1.7263245,2.5894867 0,12.9474337 m 0.8631622,-13.8105959 2.5894868,-2.5894868 0.8631622,1.7263245 0.8631623,2.5894868 0,2.5894867 -0.8631623,2.58948673 -0.8631622,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -4.3158113,1.7263245 m 7.7684602,-15.5369204 0.8631623,0.8631622 0.8631622,2.5894868 0,2.5894867 -0.8631622,2.58948673 -0.8631623,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -3.452649,1.7263245");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Libra symbol
     */
    function libraSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 0; //px
      const Y_SHIFT = -8; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " c 0.7519,1e-5 1.3924,0.12227 1.9316,0.35156 0.6619,0.28495 1.2134,0.63854 1.666,1.0625 0.4838,0.45481 0.853,0.97255 1.1172,1.56641 0.2467,0.56612 0.3711,1.17397 0.3711,1.83789 0,0.64113 -0.1244,1.23948 -0.373,1.80859 -0.1624,0.36305 -0.3631,0.69725 -0.6055,1.00586 l -0.6367,0.8086 4.3789,0 0,0.67187 -5.4024,0 0,-0.91797 c 0.2173,-0.1385 0.4379,-0.27244 0.6367,-0.44726 0.4215,-0.36876 0.7529,-0.82784 0.9883,-1.35547 0.2215,-0.50074 0.334,-1.0358 0.334,-1.58594 0,-0.55653 -0.1122,-1.09434 -0.334,-1.5957 l -0,-0.002 0,-0.004 c -0.2292,-0.49901 -0.5581,-0.94778 -0.9746,-1.33789 l -0,-0.002 -0,-0.002 c -0.3967,-0.36155 -0.8679,-0.65723 -1.4062,-0.88476 l -0,0 c -0.4984,-0.20903 -1.0622,-0.30663 -1.6817,-0.30664 -0.5926,1e-5 -1.1526,0.10008 -1.6699,0.30273 l -0,0 c -0.5261,0.20799 -1.0032,0.5067 -1.4199,0.88867 l -0,0.002 -0,0.002 c -0.4166,0.39011 -0.7454,0.83887 -0.9746,1.33789 l 0,0.004 -0,0.002 c -0.2218,0.50136 -0.334,1.03915 -0.334,1.5957 0,0.55015 0.1125,1.08519 0.334,1.58594 l 0,0.002 0,0.004 c 0.229,0.49855 0.5574,0.94911 0.9746,1.33984 0.1876,0.17482 0.4143,0.31484 0.6367,0.45703 l 0,0.91797 -5.3906,0 0,-0.67187 4.3789,0 -0.6367,-0.8086 c -0.2428,-0.30904 -0.443,-0.64418 -0.6055,-1.00781 -0.2487,-0.56911 -0.3731,-1.16552 -0.3731,-1.80664 0,-0.66391 0.1244,-1.27178 0.3711,-1.83789 l 0,-0.002 c 3e-4,-5.8e-4 -2e-4,-10e-4 0,-0.002 0.2641,-0.59218 0.6326,-1.10871 1.1153,-1.5625 0.4847,-0.45571 1.0332,-0.80585 1.6562,-1.05859 0.5861,-0.23488 1.2294,-0.35546 1.9414,-0.35547 z m -7.8496,13.45899 15.6992,0 0,0.67187 -15.6992,0 z");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Scorpio symbol
     */
    function scorpioSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -9; //px
      const Y_SHIFT = -4; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m " + x + ", " + y + " 2.3781101,-2.3781101 2.3781101,2.3781101 0,9.5124404 m -3.1708135,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.7927034,-9.5124404 2.3781101,-2.3781101 2.37811007,2.3781101 0,9.5124404 m -3.17081347,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.79270337,-9.5124404 2.37811013,-2.3781101 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854068 m -4.7562202,-11.8905505 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854067 2.3781101,-2.3781101");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Sagittarius symbol
     */
    function sagittariusSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 7; //px
      const Y_SHIFT = -9; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale
      const path = SVGUtils.SVGPath()

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      path.setAttribute("d", "m " + x + ", " + y + " -17.11444,17.11444 m 17.11444,-17.11444 -3.2089575,1.0696525 -6.417915,0 m 7.4875675,1.0696525 -3.2089575,0 -4.27861,-1.0696525 m 9.6268725,-1.0696525 -1.0696525,3.2089575 0,6.41791504 m -1.0696525,-7.48756754 0,3.2089575 1.0696525,4.27861004 m -8.55722,0 -7.4875675,0 m 6.417915,1.06965246 -3.2089575,0 -3.2089575,-1.06965246 m 7.4875675,0 0,7.48756746 m -1.0696525,-6.417915 0,3.2089575 1.0696525,3.2089575");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Capricorn symbol
     */
    function capricornSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -9; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale
      const path = SVGUtils.SVGPath()

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      path.setAttribute("d", "m " + x + ", " + y + " 1.8047633,-3.6095267 4.5119084,9.0238168 m -4.5119084,-7.2190534 4.5119084,9.0238167 2.707145,-6.3166717 4.5119084,0 2.707145,-0.9023817 0.9023817,-1.8047633 0,-1.8047634 -0.9023817,-1.8047633 -1.8047634,-0.9023817 -0.9023816,0 -1.8047634,0.9023817 -0.9023817,1.8047633 0,1.8047634 0.9023817,2.707145 0.9023817,1.80476336 0.9023817,2.70714504 0,2.707145 -1.8047634,1.8047633 m 1.8047634,-16.2428701 -0.9023817,0.9023817 -0.9023817,1.8047633 0,1.8047634 1.8047634,3.6095267 0.9023816,2.707145 0,2.707145 -0.9023816,1.8047634 -1.8047634,0.9023816");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Aquarius symbol
     */
    function aquariusSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -8; //px
      const Y_SHIFT = -2; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale
      const path = SVGUtils.SVGPath()

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      path.setAttribute("d", "m " + x + ", " + y + " 2.8866035,-2.8866035 3.8488047,1.9244023 m -4.8110059,-0.9622011 3.8488047,1.9244023 2.8866035,-2.8866035 2.8866035,1.9244023 m -3.84880467,-0.9622011 2.88660347,1.9244023 2.8866035,-2.8866035 1.9244024,1.9244023 m -2.8866035,-0.9622011 1.9244023,1.9244023 2.8866035,-2.8866035 m -17.319621,8.6598105 2.8866035,-2.88660348 3.8488047,1.92440238 m -4.8110059,-0.96220121 3.8488047,1.92440231 2.8866035,-2.88660348 2.8866035,1.92440238 m -3.84880467,-0.96220121 2.88660347,1.92440231 2.8866035,-2.88660348 1.9244024,1.92440238 m -2.8866035,-0.96220121 1.9244023,1.92440231 2.8866035,-2.88660348");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Pisces symbol
     */
    function piscesSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -8; //px
      const Y_SHIFT = -8; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale
      const path = SVGUtils.SVGPath()

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      path.setAttribute("d", "m " + x + ", " + y + " 4,2 2,2 1,3 0,3 -1,3 -2,2 -4,2 m 0,-17 3,1 2,1 2,2 1,3 m 0,3 -1,3 -2,2 -2,1 -3,1 m 16,-17 -3,1 -2,1 -2,2 -1,3 m 0,3 1,3 2,2 2,1 3,1 m 0,-17 -4,2 -2,2 -1,3 0,3 1,3 2,2 4,2 m -17,-9 18,0 m -18,1 18,0");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Sun symbol
     */
    function sunSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -1; //px
      const Y_SHIFT = -7; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -2.18182,0.727268 -2.181819,1.454543 -1.454552,2.18182 -0.727268,2.181819 0,2.181819 0.727268,2.181819 1.454552,2.18182 2.181819,1.454544 2.18182,0.727276 2.18181,0 2.18182,-0.727276 2.181819,-1.454544 1.454552,-2.18182 0.727268,-2.181819 0,-2.181819 -0.727268,-2.181819 -1.454552,-2.18182 -2.181819,-1.454543 -2.18182,-0.727268 -2.18181,0 m 0.727267,6.54545 -0.727267,0.727276 0,0.727275 0.727267,0.727268 0.727276,0 0.727267,-0.727268 0,-0.727275 -0.727267,-0.727276 -0.727276,0 m 0,0.727276 0,0.727275 0.727276,0 0,-0.727275 -0.727276,0");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Moon symbol
     */
    function moonSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -4; //px
      const Y_SHIFT = -7; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " a 7.4969283,7.4969283 0 0 1 0,14.327462 7.4969283,7.4969283 0 1 0 0,-14.327462 z");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Mercury symbol
     */
    function mercurySymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -2; //px
      const Y_SHIFT = 7; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

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
    function venusSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 2.3; //px
      const Y_SHIFT = 7; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -4.937669,0.03973 m 2.448972,2.364607 0,-5.79014 c -3.109546,-0.0085 -5.624617,-2.534212 -5.620187,-5.64208 0.0044,-3.107706 2.526514,-5.621689 5.635582,-5.621689 3.109068,0 5.631152,2.513983 5.635582,5.621689 0.0044,3.107868 -2.510641,5.633586 -5.620187,5.64208");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Mars symbol
     */
    function marsSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 3; //px
      const Y_SHIFT = -3.7; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " c -5.247438,-4.150623 -11.6993,3.205518 -7.018807,7.886007 4.680494,4.680488 12.036628,-1.771382 7.885999,-7.018816 z m 0,0 0.433597,0.433595 3.996566,-4.217419 m -3.239802,-0.05521 3.295015,0 0.110427,3.681507");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Jupiter symbol
     */
    function jupiterSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -6; //px
      const Y_SHIFT = -2; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " c -0.43473,0 -1.30422,-0.40572 -1.30422,-2.02857 0,-1.62285 1.73897,-3.2457 3.47792,-3.2457 1.73897,0 3.47792,1.21715 3.47792,4.05713 0,2.83999 -2.1737,7.30283 -6.52108,7.30283 m 12.17269,0 -12.60745,0 m 9.99902,-11.76567 0,15.82279");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Saturn symbol
     */
    function saturnSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 4; //px
      const Y_SHIFT = 7; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " c -0.52222,0.52221 -1.04445,1.04444 -1.56666,1.04444 -0.52222,0 -1.56667,-0.52223 -1.56667,-1.56667 0,-1.04443 0.52223,-2.08887 1.56667,-3.13332 1.04444,-1.04443 2.08888,-3.13331 2.08888,-5.22219 0,-2.08888 -1.04444,-4.17776 -3.13332,-4.17776 -1.97566,0 -3.65555,1.04444 -4.69998,3.13333 m -2.55515,-5.87499 6.26664,0 m -3.71149,-2.48054 0,15.14438");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Uranus symbol
     */
    function uranusSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -5; //px
      const Y_SHIFT = -6; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

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
    function neptuneSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 4; //px
      const Y_SHIFT = -6; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " 1.77059,-2.36312 2.31872,1.8045 m -14.44264,-0.20006 2.34113,-1.77418 1.74085,2.38595 m -1.80013,-1.77265 c -1.23776,8.40975 0.82518,9.67121 4.95106,9.67121 4.12589,0 6.18883,-1.26146 4.95107,-9.67121 m -7.05334,3.17005 2.03997,-2.12559 2.08565,2.07903 m -5.32406,9.91162 6.60142,0 m -3.30071,-12.19414 0,15.55803");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Pluto symbol
     */
    function plutoSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 6; //px
      const Y_SHIFT = -7; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

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
    function chironSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 4; //px
      const Y_SHIFT = 3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

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
    function lilithSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 2; //px
      const Y_SHIFT = 3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -2.525435,-1.12853 -1.464752,-1.79539 -0.808138,-2.20576 0.151526,-2.05188 0.909156,-1.5389 1.010173,-1.02593 0.909157,-0.56427 1.363735,-0.61556 m 2.315327,-0.39055 -1.716301,0.54716 -1.7163,1.09431 -1.1442,1.64146 -0.572102,1.64146 0,1.64146 0.572102,1.64147 1.1442,1.64145 1.7163,1.09432 1.716301,0.54715 m 0,-11.49024 -2.2884,0 -2.288401,0.54716 -1.716302,1.09431 -1.144201,1.64146 -0.5721,1.64146 0,1.64146 0.5721,1.64147 1.144201,1.64145 1.716302,1.09432 2.288401,0.54715 2.2884,0 m -4.36712,-0.4752 0,6.44307 m -2.709107,-3.41101 5.616025,0");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * NNode symbol
     */
    function nnodeSymbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -3; //px
      const Y_SHIFT = 3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 -0.6666667,1.3333333 0,0.6666667 0.6666667,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666666,-1.3333333 0,-0.6666667 -0.6666666,-1.3333333 -2,-2.66666665 -0.6666667,-1.99999995 0,-1.3333334 0.6666667,-2 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,2 0,1.3333334 -0.6666667,1.99999995 -2,2.66666665 -0.6666666,1.3333333 0,0.6666667 0.6666666,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666667,-1.3333333 0,-0.6666667 -0.6666667,-1.3333333 -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 m -7.9999999,-6 0.6666667,-1.3333333 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,1.3333333");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0SlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7OztBQ3RCUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4RHNEO0FBQ2pCO0FBQ047QUFDVztBQUNJOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSx5Q0FBeUM7O0FBRXpDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDLEVBQUUsb0VBQWU7QUFDdEQ7QUFDQSxLQUFLO0FBQ0wsd0JBQXdCLHNFQUFvQjtBQUM1Qzs7QUFFQSxzQkFBc0IsNkRBQVU7QUFDaEMsd0JBQXdCLCtEQUFZOztBQUVwQztBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFLQzs7Ozs7Ozs7Ozs7Ozs7O0FDOUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwyQkFBMkI7QUFDM0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQix5QkFBeUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIseUJBQXlCO0FBQ3pCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0IseUJBQXlCO0FBQ3pCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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O1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QztBQUNIO0FBQ047QUFDVztBQUNJOztBQUVvQiIsInNvdXJjZXMiOlsid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9DaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1JhZGl4Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3BvaW50cy9Qb2ludC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvQ29sb3JzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvUmFkaXguanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9UcmFuc2l0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3VuaXZlcnNlL1VuaXZlcnNlLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9TVkdVdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJhc3Ryb2xvZ3lcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQW4gYWJzdHJhY3QgY2xhc3MgZm9yIGFsbCB0eXBlIG9mIENoYXJ0XG4gKiBAcHVibGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKiBAYWJzdHJhY3RcbiAqL1xuY2xhc3MgQ2hhcnQge1xuXG4gIC8vI3NldHRpbmdzXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcbiAgICAvL3RoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgZGF0YSBpcyB2YWxpZFxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyB1bmRlZmluZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7aXNWYWxpZDpib29sZWFuLCBtZXNzYWdlOlN0cmluZ31cbiAgICovXG4gIHZhbGlkYXRlRGF0YShkYXRhKSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNpbmcgcGFyYW0gZGF0YS5cIilcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5wb2ludHMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJwb2ludHMgaXMgbm90IEFycmF5LlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEuY3VzcHMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJjdXBzIGlzIG5vdCBBcnJheS5cIlxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhLmN1c3BzLmxlbmd0aCAhPT0gMTIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcImN1c3BzLmxlbmd0aCAhPT0gMTJcIlxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IHBvaW50IG9mIGRhdGEucG9pbnRzKSB7XG4gICAgICBpZiAodHlwZW9mIHBvaW50Lm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lICE9PSAnc3RyaW5nJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwb2ludC5uYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQubmFtZS5sZW5ndGggPT0gMFwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcG9pbnQucG9zaXRpb24gIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5wb3NpdGlvbiAhPT0gJ251bWJlcidcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgY3VzcCBvZiBkYXRhLmN1c3BzKSB7XG4gICAgICBpZiAodHlwZW9mIGN1c3AucG9zaXRpb24gIT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJjdXNwLnBvc2l0aW9uICE9PSAnbnVtYmVyJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6IFwiXCJcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldFBvaW50cygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldFBvaW50KG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldEFzcGVjdHMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBhbmltYXRlVG8oZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLy8gIyMgUFJPVEVDVEVEICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG59XG5cbmV4cG9ydCB7XG4gIENoYXJ0IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXG5pbXBvcnQgUG9pbnQgZnJvbSAnLi4vcG9pbnRzL1BvaW50LmpzJ1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBQb2ludHMgYW5kIGN1cHMgYXJlIGRpc3BsYXllZCBpbnNpZGUgdGhlIFVuaXZlcnNlLlxuICogQHB1YmxpY1xuICogQGV4dGVuZHMge0NoYXJ0fVxuICovXG5jbGFzcyBSYWRpeENoYXJ0IGV4dGVuZHMgQ2hhcnQge1xuXG4gIC8qXG4gICAqIElubmVyIGNpcmNsZSByYWRpdXMgcmF0aW9cbiAgICogQGNvbnN0YW50XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDhcbiAgICovXG4gIHN0YXRpYyBJTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPID0gODtcblxuICAvKlxuICAgKiBPdXRlciBjaXJjbGUgcmFkaXVzIHJhdGlvXG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAZGVmYXVsdCAyXG4gICAqL1xuICBzdGF0aWMgT1VURVJfQ0lSQ0xFX1JBRElVU19SQVRJTyA9IDI7XG5cblxuICAvKlxuICAgKiBUaGUgbGVuZ3RoIG9mIHRoZSBwb2ludGVycyBpbiB0aGUgcnVsZXJcbiAgICogQGNvbnN0YW50XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDEwXG4gICAqL1xuICBzdGF0aWMgUlVMRVJfTEVOR1RIID0gMTBcblxuICAjc2V0dGluZ3NcbiAgI3Jvb3RcblxuICAvKlxuICAgKiBTaGlmdCB0aGUgQXNjZW5kYW50IHRvIHRoZSAwIGRlZ3JlZSBvbiBUaGUgQ2hhcnRcbiAgICovXG4gICNhbnNjZW5kYW50U2hpZnRcbiAgI2NlbnRlclhcbiAgI2NlbnRlcllcbiAgI3JhZGl1c1xuICAjaW5uZXJDaXJjbGVSYWRpdXNcbiAgI2NlbnRlckNpcmNsZVJhZGl1c1xuICAjcnVsbGVyQ2lyY2xlUmFkaXVzXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7U1ZHRG9jdW1lbnR9IFNWR0RvY3VtZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3IoU1ZHRG9jdW1lbnQsIHNldHRpbmdzKSB7XG5cbiAgICBpZiAoIVNWR0RvY3VtZW50IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gU1ZHRG9jdW1lbnQuJylcbiAgICB9XG5cbiAgICBpZiAoIXNldHRpbmdzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBzZXR0aW5ncy4nKVxuICAgIH1cblxuICAgIHN1cGVyKHNldHRpbmdzKVxuXG4gICAgdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMuI2NlbnRlclggPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxuICAgIHRoaXMuI2NlbnRlclkgPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDJcbiAgICB0aGlzLiNyYWRpdXMgPSBNYXRoLm1pbih0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZKSAtIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BBRERJTkdcbiAgICB0aGlzLiNpbm5lckNpcmNsZVJhZGl1cyA9IHRoaXMuI3JhZGl1cyAtIHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJT1xuICAgIHRoaXMuI2NlbnRlckNpcmNsZVJhZGl1cyA9IHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuT1VURVJfQ0lSQ0xFX1JBRElVU19SQVRJT1xuICAgIHRoaXMuI3J1bGxlckNpcmNsZVJhZGl1cyA9IHRoaXMuI3JhZGl1cyAtICh0aGlzLiNyYWRpdXMgLyBSYWRpeENoYXJ0LklOTkVSX0NJUkNMRV9SQURJVVNfUkFUSU8gKyBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSClcblxuICAgIHRoaXMuI3Jvb3QgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgdGhpcy4jcm9vdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuUkFESVhfSUR9YClcbiAgICBTVkdEb2N1bWVudC5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogU2V0IGNoYXJ0IGRhdGFcbiAgICogQHRocm93cyB7RXJyb3J9IC0gaWYgdGhlIGRhdGEgaXMgbm90IHZhbGlkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxuICAgKi9cbiAgc2V0RGF0YShkYXRhKSB7XG4gICAgbGV0IHN0YXR1cyA9IHRoaXMudmFsaWRhdGVEYXRhKGRhdGEpXG4gICAgaWYgKCFzdGF0dXMuaXNWYWxpZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHN0YXR1cy5tZXNzYWdlcylcbiAgICB9XG5cbiAgICB0aGlzLiNhbnNjZW5kYW50U2hpZnQgPSAoZGF0YS5jdXNwc1swXS5wb3NpdGlvbiArIFV0aWxzLkRFR18xODApXG4gICAgdGhpcy4jZHJhdyhkYXRhKVxuICB9XG5cbiAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAvKlxuICAgKiBEcmF3IHJhZGl4IGNoYXJ0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICAjZHJhdyhkYXRhKSB7XG4gICAgdGhpcy4jZHJhd0JhY2tncm91bmQoKVxuICAgIHRoaXMuI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpXG4gICAgdGhpcy4jZHJhd1J1bGVyKClcbiAgICB0aGlzLiNkcmF3TWFpbkF4aXMoW3tcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLFxuICAgICAgICBwb3NpdGlvbjogZGF0YS5jdXNwc1swXS5wb3NpdGlvblxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0lDLFxuICAgICAgICBwb3NpdGlvbjogZGF0YS5jdXNwc1szXS5wb3NpdGlvblxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0RTLFxuICAgICAgICBwb3NpdGlvbjogZGF0YS5jdXNwc1s2XS5wb3NpdGlvblxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxuICAgICAgICBwb3NpdGlvbjogZGF0YS5jdXNwc1s5XS5wb3NpdGlvblxuICAgICAgfSxcbiAgICBdKVxuICAgIHRoaXMuI2RyYXdQb2ludHMoZGF0YS5wb2ludHMpXG4gICAgdGhpcy4jZHJhd0N1c3BzKGRhdGEuY3VzcHMpXG4gICAgdGhpcy4jZHJhd0JvcmRlcnMoKVxuICB9XG5cbiAgI2RyYXdCYWNrZ3JvdW5kKCkge1xuICAgIGNvbnN0IE1BU0tfSUQgPSBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuUkFESVhfSUR9LWJhY2tncm91bmQtbWFzay0xYFxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IG1hc2sgPSBTVkdVdGlscy5TVkdNYXNrKE1BU0tfSUQpXG4gICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzKVxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwid2hpdGVcIilcbiAgICBtYXNrLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgY29uc3QgaW5uZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jY2VudGVyQ2lyY2xlUmFkaXVzKVxuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwiYmxhY2tcIilcbiAgICBtYXNrLmFwcGVuZENoaWxkKGlubmVyQ2lyY2xlKVxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobWFzaylcblxuICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMpXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX0JBQ0tHUk9VTkRfQ09MT1IpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJtYXNrXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBgdXJsKCMke01BU0tfSUR9KWApO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpIHtcbiAgICBjb25zdCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TID0gMTJcbiAgICBjb25zdCBTVEVQID0gMzAgLy9kZWdyZWVcbiAgICBjb25zdCBDT0xPUlNfU0lHTlMgPSBbdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVJJRVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1RBVVJVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfR0VNSU5JLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQU5DRVIsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xFTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVklSR08sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xJQlJBLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQ09SUElPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQUdJVFRBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FQUklDT1JOLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUVVBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfUElTQ0VTXVxuICAgIGNvbnN0IFNZTUJPTF9TSUdOUyA9IFtTVkdVdGlscy5TWU1CT0xfQVJJRVMsIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVMsIFNWR1V0aWxzLlNZTUJPTF9HRU1JTkksIFNWR1V0aWxzLlNZTUJPTF9DQU5DRVIsIFNWR1V0aWxzLlNZTUJPTF9MRU8sIFNWR1V0aWxzLlNZTUJPTF9WSVJHTywgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBLCBTVkdVdGlscy5TWU1CT0xfU0NPUlBJTywgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTLCBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOLCBTVkdVdGlscy5TWU1CT0xfQVFVQVJJVVMsIFNWR1V0aWxzLlNZTUJPTF9QSVNDRVNdXG5cbiAgICBjb25zdCBtYWtlU3ltYm9sID0gKHN5bWJvbEluZGV4LCBhbmdsZUluRGVncmVlKSA9PiB7XG4gICAgICBsZXQgcG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cyAtICh0aGlzLiNyYWRpdXMgLyBSYWRpeENoYXJ0LklOTkVSX0NJUkNMRV9SQURJVVNfUkFUSU8pIC8gMiwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVJbkRlZ3JlZSArIFNURVAgLyAyLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgbGV0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChTWU1CT0xfU0lHTlNbc3ltYm9sSW5kZXhdLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55LCB0aGlzLiNzZXR0aW5ncy5SQURJWF9TSUdOU19TQ0FMRSlcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU0lHTlNfQ09MT1IpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgcmV0dXJuIHN5bWJvbFxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VTZWdtZW50ID0gKHN5bWJvbEluZGV4LCBhbmdsZUZyb21JbkRlZ3JlZSwgYW5nbGVUb0luRGVncmVlKSA9PiB7XG4gICAgICBsZXQgYTEgPSBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZUZyb21JbkRlZ3JlZSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KVxuICAgICAgbGV0IGEyID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVUb0luRGVncmVlLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpXG4gICAgICBsZXQgc2VnbWVudCA9IFNWR1V0aWxzLlNWR1NlZ21lbnQodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzLCBhMSwgYTIsIHRoaXMuI2lubmVyQ2lyY2xlUmFkaXVzKTtcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogQ09MT1JTX1NJR05TW3N5bWJvbEluZGV4XSk7XG4gICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLkNJUkNMRV9DT0xPUiA6IFwibm9uZVwiKTtcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIDogMCk7XG4gICAgICByZXR1cm4gc2VnbWVudFxuICAgIH1cblxuICAgIGxldCBzdGFydEFuZ2xlID0gMFxuICAgIGxldCBlbmRBbmdsZSA9IHN0YXJ0QW5nbGUgKyBTVEVQXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TOyBpKyspIHtcblxuICAgICAgbGV0IHNlZ21lbnQgPSBtYWtlU2VnbWVudChpLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VnbWVudCk7XG5cbiAgICAgIGxldCBzeW1ib2wgPSBtYWtlU3ltYm9sKGksIHN0YXJ0QW5nbGUpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUDtcbiAgICAgIGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd1J1bGVyKCkge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9ESVZJREVSUyA9IDcyXG4gICAgY29uc3QgU1RFUCA9IDVcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuI2Fuc2NlbmRhbnRTaGlmdFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0RJVklERVJTOyBpKyspIHtcbiAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNydWxsZXJDaXJjbGVSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNydWxsZXJDaXJjbGVSYWRpdXMgKyBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSCAvIChpICUgMiArIDEpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUFxuICAgIH1cblxuICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNydWxsZXJDaXJjbGVSYWRpdXMpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBtYWluIGF4aXNcbiAgICogQHBhcmFtIHtBcnJheX0gYXhpc0xpc3RcbiAgICovXG4gICNkcmF3TWFpbkF4aXMoYXhpc0xpc3QpIHtcbiAgICBjb25zdCBBWElTX0xFTkdUSCA9IDEwXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgZm9yIChjb25zdCBheGlzIG9mIGF4aXNMaXN0KSB7XG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLnBvc2l0aW9uLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMgKyBBWElTX0xFTkdUSCwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5wb3NpdGlvbiwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGxldCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIGxldCB0ZXh0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cyArIEFYSVNfTEVOR1RILCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLnBvc2l0aW9uLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgbGV0IHBhdGggPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCwgdGV4dFBvaW50LnksIHtcbiAgICAgICAgLi4udGhpcy4jc2V0dGluZ3NcbiAgICAgIH0pXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9URVhUX0NPTE9SKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aCk7XG5cbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IHBvaW50c1xuICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgLSBbe1wibmFtZVwiOlN0cmluZywgXCJwb3NpdGlvblwiOk51bWJlcn1dXG4gICAqL1xuICAjZHJhd1BvaW50cyhwb2ludHMpIHtcbiAgICBjb25zdCBQT0lOVF9SQURJVVMgPSB0aGlzLiNpbm5lckNpcmNsZVJhZGl1cyAtICg0KlJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RIKVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICBjb25zdCBwb3NpdGlvbnMgPSBVdGlscy5jYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UX0NPTExJU0lPTl9SQURJVVMsIFBPSU5UX1JBRElVUylcbiAgICBmb3IgKGNvbnN0IHBvaW50RGF0YSBvZiBwb2ludHMpIHtcbiAgICAgIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KHBvaW50RGF0YSlcbiAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2lubmVyQ2lyY2xlUmFkaXVzIC0gMS41ICogUmFkaXhDaGFydC5SVUxFUl9MRU5HVEgsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldFBvc2l0aW9uKCksIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgUE9JTlRfUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcblxuICAgICAgLy8gcnVsZXIgbWFya1xuICAgICAgY29uc3QgcnVsZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI3J1bGxlckNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0UG9zaXRpb24oKSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGNvbnN0IHJ1bGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIHJ1bGVyTGluZUVuZFBvc2l0aW9uLngsIHJ1bGVyTGluZUVuZFBvc2l0aW9uLnkpXG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChydWxlckxpbmUpO1xuXG4gICAgICAvLyBzeW1ib2xcbiAgICAgIGNvbnN0IHN5bWJvbCA9IHBvaW50LmdldFN5bWJvbChzeW1ib2xQb3NpdGlvbi54LCBzeW1ib2xQb3NpdGlvbi55LCB0aGlzLiNzZXR0aW5ncy5SQURJWF9QT0lOVFNfU0NBTEUpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UU19DT0xPUik7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgLy8gcG9pbnRlclxuICAgICAgLy9pZiAocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0gIT0gcG9pbnREYXRhLnBvc2l0aW9uKSB7XG4gICAgICBjb25zdCBwb2ludGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCBQT0lOVF9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgY29uc3QgcG9pbnRlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgLyAyKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocG9pbnRlckxpbmUpO1xuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgcG9pbnRzXG4gICAqIEBwYXJhbSB7QXJyYXl9IGN1c3BzIC0gW3tcInBvc2l0aW9uXCI6TnVtYmVyfV1cbiAgICovXG4gICNkcmF3Q3VzcHMoY3VzcHMpe1xuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCB0ZXh0UmFkaXVzID0gMzBcblxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjdXNwcy5sZW5ndGg7IGkrKyApe1xuICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2NlbnRlckNpcmNsZVJhZGl1cywgY3VzcHNbaV0ucG9zaXRpb24pXG4gICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3J1bGxlckNpcmNsZVJhZGl1cywgY3VzcHNbaV0ucG9zaXRpb24pXG4gICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvcy54LCBzdGFydFBvcy55LCBlbmRQb3MueCwgZW5kUG9zLnkpXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNkcmF3Qm9yZGVycygpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgaW5uZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jaW5uZXJDaXJjbGVSYWRpdXMpXG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGlubmVyQ2lyY2xlKVxuXG4gICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzKVxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgIGNvbnN0IGNlbnRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNjZW50ZXJDaXJjbGVSYWRpdXMpXG4gICAgY2VudGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2VudGVyQ2lyY2xlKVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbn1cblxuZXhwb3J0IHtcbiAgUmFkaXhDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBvaW50cyBhbmQgY3VwcyBhcmUgZGlzcGxheWVkIGZyb20gb3V0c2lkZSB0aGUgVW5pdmVyc2UuXG4gKiBAcHVibGljXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XG4gKi9cbmNsYXNzIFRyYW5zaXRDaGFydCBleHRlbmRzIENoYXJ0IHtcblxuICAjc2V0dGluZ3NcbiAgI3Jvb3RcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtTVkdEb2N1bWVudH0gU1ZHRG9jdW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihTVkdEb2N1bWVudCwgc2V0dGluZ3MpIHtcblxuICAgIGlmICghU1ZHRG9jdW1lbnQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBTVkdEb2N1bWVudC4nKVxuICAgIH1cblxuICAgIGlmICghc2V0dGluZ3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHNldHRpbmdzLicpXG4gICAgfVxuXG4gICAgc3VwZXIoc2V0dGluZ3MpXG5cblxuICAgIHRoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLiNyb290ID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgIHRoaXMuI3Jvb3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlRSQU5TSVRfSUR9YClcbiAgICBTVkdEb2N1bWVudC5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcbiAgfVxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbn1cblxuZXhwb3J0IHtcbiAgVHJhbnNpdENoYXJ0IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFJlcHJlc2VudHMgYSBwbGFuZXQgb3IgcG9pbnQgb2YgaW50ZXJlc3QgaW4gdGhlIGNoYXJ0XG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFBvaW50IHtcblxuICAjbmFtZVxuICAjcG9zaXRpb25cbiAgI2lzUmV0cm9ncmFkZVxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgY29uc3RydWN0b3IoIGRhdGEgKSB7XG4gICAgdGhpcy4jbmFtZSA9IGRhdGEubmFtZSA/PyBcIlVua25vd25cIlxuICAgIHRoaXMuI3Bvc2l0aW9uID0gZGF0YS5wb3NpdGlvbiA/PyAwXG4gICAgdGhpcy4jaXNSZXRyb2dyYWRlID0gZGF0YS5pc1JldHJvZ3JhZGUgPz8gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAqIEdldCBuYW1lXG4gICpcbiAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICovXG4gIGdldE5hbWUoKXtcbiAgICByZXR1cm4gdGhpcy4jbmFtZVxuICB9XG5cbiAgLyoqXG4gICogSXMgcmV0cm9ncmFkZVxuICAqXG4gICogQHJldHVybiB7Qm9vbGVhbn1cbiAgKi9cbiAgaXNSZXRyb2dyYWRlKCl7XG4gICAgcmV0dXJuIHRoaXMuI2lzUmV0cm9ncmFkZVxuICB9XG5cbiAgLyoqXG4gICogR2V0IHBvc2l0aW9uXG4gICpcbiAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICovXG4gIGdldFBvc2l0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMuI3Bvc2l0aW9uXG4gIH1cblxuICAvKipcbiAgKiBHZXQgc3ltYm9sXG4gICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcbiAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xuICAqIEBwYXJhbSB7TnVtYmVyfSBbc2NhbGVdXG4gICpcbiAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxuICAqL1xuICBnZXRTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpe1xuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgY29uc3Qgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKHRoaXMuI25hbWUsIHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKVxuICAgIHJldHVybiB3cmFwcGVyXG4gIH1cblxufVxuXG5leHBvcnQge1xuICBQb2ludCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgKiBhcyBVbml2ZXJzZSBmcm9tIFwiLi9jb25zdGFudHMvVW5pdmVyc2UuanNcIlxuaW1wb3J0ICogYXMgUmFkaXggZnJvbSBcIi4vY29uc3RhbnRzL1JhZGl4LmpzXCJcbmltcG9ydCAqIGFzIFRyYW5zaXQgZnJvbSBcIi4vY29uc3RhbnRzL1RyYW5zaXQuanNcIlxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gXCIuL2NvbnN0YW50cy9Db2xvcnMuanNcIlxuXG5jb25zdCBTRVRUSU5HUyA9IE9iamVjdC5hc3NpZ24oe30sIFVuaXZlcnNlLCBSYWRpeCwgVHJhbnNpdCwgQ29sb3JzKTtcblxuZXhwb3J0IHtcbiAgU0VUVElOR1MgYXNcbiAgZGVmYXVsdFxufVxuIiwiLyoqXG4qIENoYXJ0IGJhY2tncm91bmQgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNmZmZcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfQkFDS0dST1VORF9DT0xPUiA9IFwiI2ZmZlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0NJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGxpbmVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9MSU5FX0NPTE9SID0gXCIjNjY2XCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgdGV4dCBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVEVYVF9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHNpZ25zIGluIGNoYXJ0cyAoYXJpc2Ugc3ltYm9sLCB0YXVydXMgc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NJR05TX0NPTE9SID0gXCIjMDAwXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2Ygc2lnbnMgaW4gY2hhcnRzIChhcmlzZSBzeW1ib2wsIHRhdXJ1cyBzeW1ib2wsIC4uLilcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMwMDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfUE9JTlRTX0NPTE9SID0gXCIjMDAwXCI7XG5cbi8qXG4qIEFyaWVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0FSSUVTID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIFRhdXJ1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9UQVVSVVMgPSBcIiM4QjQ1MTNcIjtcblxuLypcbiogR2VtaW55IGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0dFTUlOST0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIENhbmNlciBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9DQU5DRVIgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogTGVvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xFTyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBWaXJnbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9WSVJHTyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBMaWJyYSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9MSUJSQSA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBTY29ycGlvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1NDT1JQSU8gPSBcIiMyN0FFNjBcIjtcblxuLypcbiogU2FnaXR0YXJpdXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0FHSVRUQVJJVVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogQ2Fwcmljb3JuIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBUFJJQ09STiA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBBcXVhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUVVBUklVUyA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBQaXNjZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfUElTQ0VTID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIENvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuIiwiLypcbiogUmFkaXggY2hhcnQgZWxlbWVudCBJRFxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgcmFkaXhcbiovXG5leHBvcnQgY29uc3QgUkFESVhfSUQgPSBcInJhZGl4XCJcblxuLypcbiogU2NhbGUgcG9pbnRzIHJhdGlvXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX1BPSU5UU19TQ0FMRSA9IDFcblxuLypcbiogU2NhbGUgc2lnbnMgcmF0aW9cbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDFcbiovXG5leHBvcnQgY29uc3QgUkFESVhfU0lHTlNfU0NBTEUgPSAxXG4iLCIvKlxuKiBUcmFuc2l0IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHRyYW5zaXRcbiovXG5leHBvcnQgY29uc3QgVFJBTlNJVF9JRCA9IFwidHJhbnNpdFwiXG4iLCIvKipcbiogQ2hhcnQgcGFkZGluZ1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMTBweFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QQURESU5HID0gNDBcblxuLyoqXG4qIFNWRyB2aWV3Qm94IHdpZHRoXG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9XSURUSCA9IDgwMFxuXG4vKipcbiogU1ZHIHZpZXdCb3ggaGVpZ2h0XG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9IRUlHSFQgPSA4MDBcblxuLyoqXG4qIEEgcG9pbnQgY29sbGlzaW9uIHJhZGl1c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMlxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QT0lOVF9DT0xMSVNJT05fUkFESVVTID0gMTJcblxuLypcbiogTGluZSBzdHJlbmd0aFxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0UgPSAxXG5cbi8qXG4qIExpbmUgc3RyZW5ndGggb2YgdGhlIG1haW4gbGluZXMuIEZvciBpbnN0YW5jZSBwb2ludHMsIG1haW4gYXhpcywgbWFpbiBjaXJjbGVzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX01BSU5fU1RST0tFID0gMlxuXG4vKipcbiogTm8gZmlsbCwgb25seSBzdHJva2VcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtib29sZWFufVxuKiBAZGVmYXVsdCBmYWxzZVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfT05MWSA9IGZhbHNlO1xuIiwiaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XG5pbXBvcnQgVHJhbnNpdENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiB3cmFwcGVyIGZvciBhbGwgcGFydHMgb2YgZ3JhcGguXG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFVuaXZlcnNlIHtcblxuICAjU1ZHRG9jdW1lbnRcbiAgI3NldHRpbmdzXG4gICNyYWRpeFxuICAjdHJhbnNpdFxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbEVsZW1lbnRJRCAtIElEIG9mIHRoZSByb290IGVsZW1lbnQgd2l0aG91dCB0aGUgIyBzaWduXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBBbiBvYmplY3QgdGhhdCBvdmVycmlkZXMgdGhlIGRlZmF1bHQgc2V0dGluZ3MgdmFsdWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihodG1sRWxlbWVudElELCBvcHRpb25zID0ge30pIHtcblxuICAgIGlmICh0eXBlb2YgaHRtbEVsZW1lbnRJRCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSByZXF1aXJlZCBwYXJhbWV0ZXIgaXMgbWlzc2luZy4nKVxuICAgIH1cblxuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEVsZW1lbnRJRCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fub3QgZmluZCBhIEhUTUwgZWxlbWVudCB3aXRoIElEICcgKyBodG1sRWxlbWVudElEKVxuICAgIH1cblxuICAgIHRoaXMuI3NldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdFNldHRpbmdzLCBvcHRpb25zLCB7XG4gICAgICBIVE1MX0VMRU1FTlRfSUQ6IGh0bWxFbGVtZW50SURcbiAgICB9KTtcbiAgICB0aGlzLiNTVkdEb2N1bWVudCA9IFNWR1V0aWxzLlNWR0RvY3VtZW50KHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEgsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpLmFwcGVuZENoaWxkKHRoaXMuI1NWR0RvY3VtZW50KTtcblxuICAgIHRoaXMuI3JhZGl4ID0gbmV3IFJhZGl4Q2hhcnQodGhpcy4jU1ZHRG9jdW1lbnQsIHRoaXMuI3NldHRpbmdzKVxuICAgIHRoaXMuI3RyYW5zaXQgPSBuZXcgVHJhbnNpdENoYXJ0KHRoaXMuI1NWR0RvY3VtZW50LCB0aGlzLiNzZXR0aW5ncylcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyAjIyBQVUJMSUMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLyoqXG4gICAqIEdldCBSYWRpeCBjaGFydFxuICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxuICAgKi9cbiAgcmFkaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JhZGl4XG4gIH1cblxuICAvKipcbiAgICogR2V0IFRyYW5zaXQgY2hhcnRcbiAgICogQHJldHVybiB7VHJhbnNpdENoYXJ0fVxuICAgKi9cbiAgdHJhbnNpdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHJhbnNpdFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHNldHRpbmdzXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldFNldHRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLiNzZXR0aW5nc1xuICB9XG4gIFxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG59XG5cbmV4cG9ydCB7XG4gIFVuaXZlcnNlIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFNWRyB1dGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFNWR1V0aWxzIHtcblxuICBzdGF0aWMgU1ZHX05BTUVTUEFDRSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuXG4gIHN0YXRpYyBTWU1CT0xfQVJJRVMgPSBcIkFyaWVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfVEFVUlVTID0gXCJUYXVydXNcIjtcbiAgc3RhdGljIFNZTUJPTF9HRU1JTkkgPSBcIkdlbWluaVwiO1xuICBzdGF0aWMgU1lNQk9MX0NBTkNFUiA9IFwiQ2FuY2VyXCI7XG4gIHN0YXRpYyBTWU1CT0xfTEVPID0gXCJMZW9cIjtcbiAgc3RhdGljIFNZTUJPTF9WSVJHTyA9IFwiVmlyZ29cIjtcbiAgc3RhdGljIFNZTUJPTF9MSUJSQSA9IFwiTGlicmFcIjtcbiAgc3RhdGljIFNZTUJPTF9TQ09SUElPID0gXCJTY29ycGlvXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0FHSVRUQVJJVVMgPSBcIlNhZ2l0dGFyaXVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOID0gXCJDYXByaWNvcm5cIjtcbiAgc3RhdGljIFNZTUJPTF9BUVVBUklVUyA9IFwiQXF1YXJpdXNcIjtcbiAgc3RhdGljIFNZTUJPTF9QSVNDRVMgPSBcIlBpc2Nlc1wiO1xuXG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF8xID0gXCIxXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF8yID0gXCIyXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF8zID0gXCIzXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF80ID0gXCI0XCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF81ID0gXCI1XCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF82ID0gXCI2XCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF83ID0gXCI3XCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF84ID0gXCI4XCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF85ID0gXCI5XCI7XG4gIHN0YXRpYyBTWU1CT0xfQ1VTUF8xMCA9IFwiMTBcIjtcbiAgc3RhdGljIFNZTUJPTF9DVVNQXzExID0gXCIxMVwiO1xuICBzdGF0aWMgU1lNQk9MX0NVU1BfMTIgPSBcIjEyXCI7XG5cbiAgc3RhdGljIFNZTUJPTF9BUyA9IFwiQXNcIjtcbiAgc3RhdGljIFNZTUJPTF9EUyA9IFwiRHNcIjtcbiAgc3RhdGljIFNZTUJPTF9NQyA9IFwiTWNcIjtcbiAgc3RhdGljIFNZTUJPTF9JQyA9IFwiSWNcIjtcblxuICBzdGF0aWMgU1lNQk9MX1NVTiA9IFwiU3VuXCI7XG4gIHN0YXRpYyBTWU1CT0xfTU9PTiA9IFwiTW9vblwiO1xuICBzdGF0aWMgU1lNQk9MX01FUkNVUlkgPSBcIk1lcmN1cnlcIjtcbiAgc3RhdGljIFNZTUJPTF9WRU5VUyA9IFwiVmVudXNcIjtcbiAgc3RhdGljIFNZTUJPTF9NQVJTID0gXCJNYXJzXCI7XG4gIHN0YXRpYyBTWU1CT0xfSlVQSVRFUiA9IFwiSnVwaXRlclwiO1xuICBzdGF0aWMgU1lNQk9MX1NBVFVSTiA9IFwiU2F0dXJuXCI7XG4gIHN0YXRpYyBTWU1CT0xfVVJBTlVTID0gXCJVcmFudXNcIjtcbiAgc3RhdGljIFNZTUJPTF9ORVBUVU5FID0gXCJOZXB0dW5lXCI7XG4gIHN0YXRpYyBTWU1CT0xfUExVVE8gPSBcIlBsdXRvXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0hJUk9OID0gXCJDaGlyb25cIjtcbiAgc3RhdGljIFNZTUJPTF9MSUxJVEggPSBcIkxpbGl0aFwiO1xuICBzdGF0aWMgU1lNQk9MX05OT0RFID0gXCJOTm9kZVwiO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgU1ZHVXRpbHMpIHtcbiAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgZG9jdW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdEb2N1bWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdEb2N1bWVudCh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwic3ZnXCIpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmVyc2lvbicsIFwiMS4xXCIpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBcIjAgMCBcIiArIHdpZHRoICsgXCIgXCIgKyBoZWlnaHQpO1xuICAgIHJldHVybiBzdmdcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgZ3JvdXAgZWxlbWVudFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdHcm91cCgpIHtcbiAgICBjb25zdCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiZ1wiKTtcbiAgICByZXR1cm4gZ1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBwYXRoIGVsZW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHUGF0aCgpIHtcbiAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwicGF0aFwiKTtcbiAgICByZXR1cm4gcGF0aFxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBtYXNrIGVsZW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudElEXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR01hc2tFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR01hc2soZWxlbWVudElEKSB7XG4gICAgY29uc3QgbWFzayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcIm1hc2tcIik7XG4gICAgbWFzay5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBlbGVtZW50SUQpXG4gICAgcmV0dXJuIG1hc2tcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgY2lyY3VsYXIgc2VjdG9yXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtpbnR9IHggLSBjaXJjbGUgeCBjZW50ZXIgcG9zaXRpb25cbiAgICogQHBhcmFtIHtpbnR9IHkgLSBjaXJjbGUgeSBjZW50ZXIgcG9zaXRpb25cbiAgICogQHBhcmFtIHtpbnR9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXMgaW4gcHhcbiAgICogQHBhcmFtIHtpbnR9IGExIC0gYW5nbGVGcm9tIGluIHJhZGlhbnNcbiAgICogQHBhcmFtIHtpbnR9IGEyIC0gYW5nbGVUbyBpbiByYWRpYW5zXG4gICAqIEBwYXJhbSB7aW50fSB0aGlja25lc3MgLSBmcm9tIG91dHNpZGUgdG8gY2VudGVyIGluIHB4XG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IHNlZ21lbnRcbiAgICovXG4gIHN0YXRpYyBTVkdTZWdtZW50KHgsIHksIHJhZGl1cywgYTEsIGEyLCB0aGlja25lc3MsIGxGbGFnLCBzRmxhZykge1xuICAgIC8vIEBzZWUgU1ZHIFBhdGggYXJjOiBodHRwczovL3d3dy53My5vcmcvVFIvU1ZHL3BhdGhzLmh0bWwjUGF0aERhdGFcbiAgICBjb25zdCBMQVJHRV9BUkNfRkxBRyA9IGxGbGFnIHx8IDA7XG4gICAgY29uc3QgU1dFRVRfRkxBRyA9IHNGbGFnIHx8IDA7XG5cbiAgICBjb25zdCBzZWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwicGF0aFwiKTtcbiAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImRcIiwgXCJNIFwiICsgKHggKyB0aGlja25lc3MgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKHkgKyB0aGlja25lc3MgKiBNYXRoLnNpbihhMSkpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiBNYXRoLnNpbihhMSkpICsgXCIgQSBcIiArIHJhZGl1cyArIFwiLCBcIiArIHJhZGl1cyArIFwiLDAgLFwiICsgTEFSR0VfQVJDX0ZMQUcgKyBcIiwgXCIgKyBTV0VFVF9GTEFHICsgXCIsIFwiICsgKHggKyByYWRpdXMgKiBNYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKHkgKyByYWRpdXMgKiBNYXRoLnNpbihhMikpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIC1NYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguc2luKGEyKSkgKyBcIiBBIFwiICsgdGhpY2tuZXNzICsgXCIsIFwiICsgdGhpY2tuZXNzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIDEgKyBcIiwgXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkpO1xuICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgcmV0dXJuIHNlZ21lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU1ZHIGNpcmNsZVxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7aW50fSBjeFxuICAgKiBAcGFyYW0ge2ludH0gY3lcbiAgICogQHBhcmFtIHtpbnR9IHJhZGl1c1xuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBjaXJjbGVcbiAgICovXG4gIHN0YXRpYyBTVkdDaXJjbGUoY3gsIGN5LCByYWRpdXMpIHtcbiAgICBjb25zdCBjaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJjaXJjbGVcIik7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN4XCIsIGN4KTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3lcIiwgY3kpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJyXCIsIHJhZGl1cyk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgIHJldHVybiBjaXJjbGU7XG4gIH1cblxuICAvKipcbiAgICogU1ZHIGxpbmVcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MlxuICAgKiBAcGFyYW0ge051bWJlcn0geDJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGxpbmVcbiAgICovXG4gIHN0YXRpYyBTVkdMaW5lKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImxpbmVcIik7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MVwiLCB4MSk7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MVwiLCB5MSk7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MlwiLCB4Mik7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MlwiLCB5Mik7XG4gICAgcmV0dXJuIGxpbmU7XG4gIH1cblxuICAvKipcbiAgICogU1ZHIHN5bWJvbFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge051bWJlcn0geFBvc1xuICAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR1N5bWJvbChuYW1lLCB4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICBzd2l0Y2ggKG5hbWUpIHtcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVM6XG4gICAgICAgIHJldHVybiBhc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0RTOlxuICAgICAgICByZXR1cm4gZHNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQzpcbiAgICAgICAgcmV0dXJuIG1jU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSUM6XG4gICAgICAgIHJldHVybiBpY1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVJJRVM6XG4gICAgICAgIHJldHVybiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVM6XG4gICAgICAgIHJldHVybiB0YXVydXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfR0VNSU5JOlxuICAgICAgICByZXR1cm4gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUjpcbiAgICAgICAgcmV0dXJuIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MRU86XG4gICAgICAgIHJldHVybiBsZW9TeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVklSR086XG4gICAgICAgIHJldHVybiB2aXJnb1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUJSQTpcbiAgICAgICAgcmV0dXJuIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU86XG4gICAgICAgIHJldHVybiBzY29ycGlvU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTOlxuICAgICAgICByZXR1cm4gc2FnaXR0YXJpdXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOOlxuICAgICAgICByZXR1cm4gY2Fwcmljb3JuU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTOlxuICAgICAgICByZXR1cm4gYXF1YXJpdXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUElTQ0VTOlxuICAgICAgICByZXR1cm4gcGlzY2VzU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU1VOOlxuICAgICAgICByZXR1cm4gc3VuU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01PT046XG4gICAgICAgIHJldHVybiBtb29uU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01FUkNVUlk6XG4gICAgICAgIHJldHVybiBtZXJjdXJ5U3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTOlxuICAgICAgICByZXR1cm4gdmVudXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUFSUzpcbiAgICAgICAgcmV0dXJuIG1hcnNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUjpcbiAgICAgICAgcmV0dXJuIGp1cGl0ZXJTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FUVVJOOlxuICAgICAgICByZXR1cm4gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VUzpcbiAgICAgICAgcmV0dXJuIHVyYW51c1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FOlxuICAgICAgICByZXR1cm4gbmVwdHVuZVN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcbiAgICAgICAgcmV0dXJuIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NISVJPTjpcbiAgICAgICAgcmV0dXJuIGNoaXJvblN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUxJVEg6XG4gICAgICAgIHJldHVybiBsaWxpdGhTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTk5PREU6XG4gICAgICAgIHJldHVybiBubm9kZVN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnN0IHVua25vd25TeW1ib2wgPSBTVkdVdGlscy5TVkdDaXJjbGUoeFBvcywgeVBvcywgOClcbiAgICAgICAgcmV0dXJuIHVua25vd25TeW1ib2xcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEFzY2VuZGFudCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTQ7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMjsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0wLjU2MzA3OCwtMS4xMjYxNTI3IC0xLjY4OTIyOCwtMC41NjMwNzY1IC0xLjY4OTIyOSwwIC0xLjY4OTIzLDAuNTYzMDc2NSAtMC41NjMwNzYsMS4xMjYxNTI3IDAuNTYzMDc2LDEuMTI2MTUyNzIgMS4xMjYxNTQsMC41NjMwNzYzNiAyLjgxNTM4MSwwLjU2MzA3NjM1IDEuMTI2MTUyLDAuNTYzMDc2NDcgMC41NjMwNzgsMS4xMjYxNTI2IDAsMC41NjMwNzYzIC0wLjU2MzA3OCwxLjEyNjE1MjggLTEuNjg5MjI4LDAuNTYzMDc2NCAtMS42ODkyMjksMCAtMS42ODkyMywtMC41NjMwNzY0IC0wLjU2MzA3NiwtMS4xMjYxNTI4IG0gLTYuNzU2OTE2LC0xMC4xMzUzNzQgLTQuNTA0NjExLDExLjgyNDYwMzIgbSA0LjUwNDYxMSwtMTEuODI0NjAzMiA0LjUwNDYxMSwxMS44MjQ2MDMyIG0gLTcuMzE5OTkyNSwtMy45NDE1MzQ1NyA1LjYzMDc2MjUsMFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogRGVzY2VuZGFudCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gMjI7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0wLjU2MjUsLTEuMTI1IC0xLjY4NzUsLTAuNTYyNSAtMS42ODc1LDAgLTEuNjg3NSwwLjU2MjUgLTAuNTYyNSwxLjEyNSAwLjU2MjUsMS4xMjUgMS4xMjUsMC41NjI1IDIuODEyNSwwLjU2MjUgMS4xMjUsMC41NjI1IDAuNTYyNSwxLjEyNSAwLDAuNTYyNSAtMC41NjI1LDEuMTI1IC0xLjY4NzUsMC41NjI1IC0xLjY4NzUsMCAtMS42ODc1LC0wLjU2MjUgLTAuNTYyNSwtMS4xMjUgbSAtMTEuMjUsLTEwLjEyNSAwLDExLjgxMjUgbSAwLC0xMS44MTI1IDMuOTM3NSwwIDEuNjg3NSwwLjU2MjUgMS4xMjUsMS4xMjUgMC41NjI1LDEuMTI1IDAuNTYyNSwxLjY4NzUgMCwyLjgxMjUgLTAuNTYyNSwxLjY4NzUgLTAuNTYyNSwxLjEyNSAtMS4xMjUsMS4xMjUgLTEuNjg3NSwwLjU2MjUgLTMuOTM3NSwwXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBNZWRpdW0gY29lbGkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0xLjAwNDA4NSwtMS4wMDQwODQ1IC0xLjAwNDA4NCwtMC41MDIwNDIzIC0xLjUwNjEyNywwIC0xLjAwNDA4NSwwLjUwMjA0MjMgLTEuMDA0MDg0LDEuMDA0MDg0NSAtMC41MDIwNDMsMS41MDYxMjY4OSAwLDEuMDA0MDg0NTggMC41MDIwNDMsMS41MDYxMjY4MyAxLjAwNDA4NCwxLjAwNDA4NDYgMS4wMDQwODUsMC41MDIwNDIzIDEuNTA2MTI3LDAgMS4wMDQwODQsLTAuNTAyMDQyMyAxLjAwNDA4NSwtMS4wMDQwODQ2IG0gLTE3LjU3MTQ4LC05LjAzNjc2MTIgMCwxMC41NDI4ODgxIG0gMCwtMTAuNTQyODg4MSA0LjAxNjMzOCwxMC41NDI4ODgxIG0gNC4wMTYzMzgsLTEwLjU0Mjg4ODEgLTQuMDE2MzM4LDEwLjU0Mjg4ODEgbSA0LjAxNjMzOCwtMTAuNTQyODg4MSAwLDEwLjU0Mjg4ODFcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEltbXVtIGNvZWxpIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGljU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSA4OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gOTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlRcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0xLjIwODg1MiwtMS4yMDg4NTE0IC0xLjIwODg1MSwtMC42MDQ0MjU4IC0xLjgxMzI3OCwwIC0xLjIwODg1MiwwLjYwNDQyNTggLTEuMjA4ODUsMS4yMDg4NTE0IC0wLjYwNDQyNiwxLjgxMzI3NzE1IDAsMS4yMDg4NTEzNSAwLjYwNDQyNiwxLjgxMzI3NzIgMS4yMDg4NSwxLjIwODg1MTMgMS4yMDg4NTIsMC42MDQ0MjU5IDEuODEzMjc4LDAgMS4yMDg4NTEsLTAuNjA0NDI1OSAxLjIwODg1MiwtMS4yMDg4NTEzIG0gLTExLjQ4NDA5MDIsLTEwLjg3OTY2MjkgMCwxMi42OTI5NDAxXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBcmllcyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0yOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTAuOSwtMC45IDAsLTEuOCAwLjksLTEuOCAxLjgsLTAuODk5OTk5OCAxLjgsMCAxLjgsMC44OTk5OTk4IDAuOSwwLjkgMC45LDEuOCAwLjksNC41IG0gLTksLTUuNCAxLjgsLTEuOCAxLjgsMCAxLjgsMC45IDAuOSwwLjkgMC45LDEuOCAwLjksMy42IDAsOS45IG0gOC4xLC0xMi42IDAuOSwtMC45IDAsLTEuOCAtMC45LC0xLjggLTEuOCwtMC44OTk5OTk4IC0xLjgsMCAtMS44LDAuODk5OTk5OCAtMC45LDAuOSAtMC45LDEuOCAtMC45LDQuNSBtIDksLTUuNCAtMS44LC0xLjggLTEuOCwwIC0xLjgsMC45IC0wLjksMC45IC0wLjksMS44IC0wLjksMy42IDAsOS45XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFRhdXJ1cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0YXVydXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMTE7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAxLDQgMSwyIDIsMiAzLDEgNCwwIDMsLTEgMiwtMiAxLC0yIDEsLTQgbSAtMTgsMCAxLDMgMSwyIDIsMiAzLDEgNCwwIDMsLTEgMiwtMiAxLC0yIDEsLTMgbSAtMTEsOCAtMiwxIC0xLDEgLTEsMiAwLDMgMSwyIDIsMiAyLDEgMiwwIDIsLTEgMiwtMiAxLC0yIDAsLTMgLTEsLTIgLTEsLTEgLTIsLTEgbSAtNCwxIC0yLDEgLTEsMiAwLDMgMSwzIG0gOCwwIDEsLTMgMCwtMyAtMSwtMiAtMiwtMVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBHZW1pbmkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC01OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTY7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAwLDExLjU0NjQxNCBtIDAuOTYyMjAxMSwtMTAuNTg0MjEyOSAwLDkuNjIyMDExNyBtIDcuNjk3NjA5NywtOS42MjIwMTE3IDAsOS42MjIwMTE3IG0gMC45NjIyMDEsLTEwLjU4NDIxMjggMCwxMS41NDY0MTQgbSAtMTMuNDcwODE2NSwtMTQuNDMzMDE3MiAxLjkyNDQwMjMsMS45MjQ0MDIgMS45MjQ0MDI0LDAuOTYyMjAxMiAyLjg4NjYwMzgsMC45NjIyMDExIDMuODQ4ODA0LDAgMi44ODY2MDQsLTAuOTYyMjAxMSAxLjkyNDQwMiwtMC45NjIyMDEyIDEuOTI0NDAzLC0xLjkyNDQwMiBtIC0xNy4zMTk2MjE1LDE3LjMxOTYyMDcgMS45MjQ0MDIzLC0xLjkyNDQwMjQgMS45MjQ0MDI0LC0wLjk2MjIwMTEgMi44ODY2MDM4LC0wLjk2MjIwMTIgMy44NDg4MDQsMCAyLjg4NjYwNCwwLjk2MjIwMTIgMS45MjQ0MDIsMC45NjIyMDExIDEuOTI0NDAzLDEuOTI0NDAyNFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDYW5jZXIgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2FuY2VyU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0xNSwwIC0yLDEgLTEsMiAwLDIgMSwyIDIsMSAyLDAgMiwtMSAxLC0yIDAsLTIgLTEsLTIgMTEsMCBtIC0xOCwzIDEsMiAxLDEgMiwxIG0gNCwtNCAtMSwtMiAtMSwtMSAtMiwtMSBtIC00LDE1IDE1LDAgMiwtMSAxLC0yIDAsLTIgLTEsLTIgLTIsLTEgLTIsMCAtMiwxIC0xLDIgMCwyIDEsMiAtMTEsMCBtIDE4LC0zIC0xLC0yIC0xLC0xIC0yLC0xIG0gLTQsNCAxLDIgMSwxIDIsMVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBMZW8gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVvU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC0zOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gNDsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0yLC0xIC0xLDAgLTIsMSAtMSwyIDAsMSAxLDIgMiwxIDEsMCAyLC0xIDEsLTIgMCwtMSAtMSwtMiAtNSwtNSAtMSwtMiAwLC0zIDEsLTIgMiwtMSAzLC0xIDQsMCA0LDEgMiwyIDEsMiAwLDMgLTEsMyAtMywzIC0xLDIgMCwyIDEsMiAyLDAgMSwtMSAxLC0yIG0gLTEzLC01IC0yLC0zIC0xLC0yIDAsLTMgMSwtMiAxLC0xIG0gNywtMSAzLDEgMiwyIDEsMiAwLDMgLTEsMyAtMiwzXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFZpcmdvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTU7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAyLjU4OTQ4NjgsLTIuNTg5NDg2OCAxLjcyNjMyNDUsMi41ODk0ODY4IDAsOS40OTQ3ODQ3IG0gLTIuNTg5NDg2OCwtMTEuMjIxMTA5MiAxLjcyNjMyNDUsMi41ODk0ODY3IDAsOC42MzE2MjI1IG0gMC44NjMxNjIzLC05LjQ5NDc4NDcgMi41ODk0ODY3LC0yLjU4OTQ4NjggMS43MjYzMjQ1MSwyLjU4OTQ4NjggMCw4LjYzMTYyMjQgbSAtMi41ODk0ODY3MSwtMTAuMzU3OTQ2OSAxLjcyNjMyNDQ3LDIuNTg5NDg2NyAwLDcuNzY4NDYwMiBtIDAuODYzMTYyMjQsLTguNjMxNjIyNCAyLjU4OTQ4Njc5LC0yLjU4OTQ4NjggMS43MjYzMjQ0LDIuNTg5NDg2OCAwLDEzLjgxMDU5NTkgbSAtMi41ODk0ODY3LC0xNS41MzY5MjA0IDEuNzI2MzI0NSwyLjU4OTQ4NjcgMCwxMi45NDc0MzM3IG0gMC44NjMxNjIyLC0xMy44MTA1OTU5IDIuNTg5NDg2OCwtMi41ODk0ODY4IDAuODYzMTYyMiwxLjcyNjMyNDUgMC44NjMxNjIzLDIuNTg5NDg2OCAwLDIuNTg5NDg2NyAtMC44NjMxNjIzLDIuNTg5NDg2NzMgLTAuODYzMTYyMiwxLjcyNjMyNDQ3IC0xLjcyNjMyNDUsMS43MjYzMjQ1IC0yLjU4OTQ4NjcsMS43MjYzMjQ1IC00LjMxNTgxMTMsMS43MjYzMjQ1IG0gNy43Njg0NjAyLC0xNS41MzY5MjA0IDAuODYzMTYyMywwLjg2MzE2MjIgMC44NjMxNjIyLDIuNTg5NDg2OCAwLDIuNTg5NDg2NyAtMC44NjMxNjIyLDIuNTg5NDg2NzMgLTAuODYzMTYyMywxLjcyNjMyNDQ3IC0xLjcyNjMyNDUsMS43MjYzMjQ1IC0yLjU4OTQ4NjcsMS43MjYzMjQ1IC0zLjQ1MjY0OSwxLjcyNjMyNDVcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogTGlicmEgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGlicmFTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gMDsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC04OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgYyAwLjc1MTksMWUtNSAxLjM5MjQsMC4xMjIyNyAxLjkzMTYsMC4zNTE1NiAwLjY2MTksMC4yODQ5NSAxLjIxMzQsMC42Mzg1NCAxLjY2NiwxLjA2MjUgMC40ODM4LDAuNDU0ODEgMC44NTMsMC45NzI1NSAxLjExNzIsMS41NjY0MSAwLjI0NjcsMC41NjYxMiAwLjM3MTEsMS4xNzM5NyAwLjM3MTEsMS44Mzc4OSAwLDAuNjQxMTMgLTAuMTI0NCwxLjIzOTQ4IC0wLjM3MywxLjgwODU5IC0wLjE2MjQsMC4zNjMwNSAtMC4zNjMxLDAuNjk3MjUgLTAuNjA1NSwxLjAwNTg2IGwgLTAuNjM2NywwLjgwODYgNC4zNzg5LDAgMCwwLjY3MTg3IC01LjQwMjQsMCAwLC0wLjkxNzk3IGMgMC4yMTczLC0wLjEzODUgMC40Mzc5LC0wLjI3MjQ0IDAuNjM2NywtMC40NDcyNiAwLjQyMTUsLTAuMzY4NzYgMC43NTI5LC0wLjgyNzg0IDAuOTg4MywtMS4zNTU0NyAwLjIyMTUsLTAuNTAwNzQgMC4zMzQsLTEuMDM1OCAwLjMzNCwtMS41ODU5NCAwLC0wLjU1NjUzIC0wLjExMjIsLTEuMDk0MzQgLTAuMzM0LC0xLjU5NTcgbCAtMCwtMC4wMDIgMCwtMC4wMDQgYyAtMC4yMjkyLC0wLjQ5OTAxIC0wLjU1ODEsLTAuOTQ3NzggLTAuOTc0NiwtMS4zMzc4OSBsIC0wLC0wLjAwMiAtMCwtMC4wMDIgYyAtMC4zOTY3LC0wLjM2MTU1IC0wLjg2NzksLTAuNjU3MjMgLTEuNDA2MiwtMC44ODQ3NiBsIC0wLDAgYyAtMC40OTg0LC0wLjIwOTAzIC0xLjA2MjIsLTAuMzA2NjMgLTEuNjgxNywtMC4zMDY2NCAtMC41OTI2LDFlLTUgLTEuMTUyNiwwLjEwMDA4IC0xLjY2OTksMC4zMDI3MyBsIC0wLDAgYyAtMC41MjYxLDAuMjA3OTkgLTEuMDAzMiwwLjUwNjcgLTEuNDE5OSwwLjg4ODY3IGwgLTAsMC4wMDIgLTAsMC4wMDIgYyAtMC40MTY2LDAuMzkwMTEgLTAuNzQ1NCwwLjgzODg3IC0wLjk3NDYsMS4zMzc4OSBsIDAsMC4wMDQgLTAsMC4wMDIgYyAtMC4yMjE4LDAuNTAxMzYgLTAuMzM0LDEuMDM5MTUgLTAuMzM0LDEuNTk1NyAwLDAuNTUwMTUgMC4xMTI1LDEuMDg1MTkgMC4zMzQsMS41ODU5NCBsIDAsMC4wMDIgMCwwLjAwNCBjIDAuMjI5LDAuNDk4NTUgMC41NTc0LDAuOTQ5MTEgMC45NzQ2LDEuMzM5ODQgMC4xODc2LDAuMTc0ODIgMC40MTQzLDAuMzE0ODQgMC42MzY3LDAuNDU3MDMgbCAwLDAuOTE3OTcgLTUuMzkwNiwwIDAsLTAuNjcxODcgNC4zNzg5LDAgLTAuNjM2NywtMC44MDg2IGMgLTAuMjQyOCwtMC4zMDkwNCAtMC40NDMsLTAuNjQ0MTggLTAuNjA1NSwtMS4wMDc4MSAtMC4yNDg3LC0wLjU2OTExIC0wLjM3MzEsLTEuMTY1NTIgLTAuMzczMSwtMS44MDY2NCAwLC0wLjY2MzkxIDAuMTI0NCwtMS4yNzE3OCAwLjM3MTEsLTEuODM3ODkgbCAwLC0wLjAwMiBjIDNlLTQsLTUuOGUtNCAtMmUtNCwtMTBlLTQgMCwtMC4wMDIgMC4yNjQxLC0wLjU5MjE4IDAuNjMyNiwtMS4xMDg3MSAxLjExNTMsLTEuNTYyNSAwLjQ4NDcsLTAuNDU1NzEgMS4wMzMyLC0wLjgwNTg1IDEuNjU2MiwtMS4wNTg1OSAwLjU4NjEsLTAuMjM0ODggMS4yMjk0LC0wLjM1NTQ2IDEuOTQxNCwtMC4zNTU0NyB6IG0gLTcuODQ5NiwxMy40NTg5OSAxNS42OTkyLDAgMCwwLjY3MTg3IC0xNS42OTkyLDAgelwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTY29ycGlvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtNDsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDIuMzc4MTEwMSwtMi4zNzgxMTAxIDIuMzc4MTEwMSwyLjM3ODExMDEgMCw5LjUxMjQ0MDQgbSAtMy4xNzA4MTM1LC0xMS4wOTc4NDcxIDIuMzc4MTEwMSwyLjM3ODExMDEgMCw4LjcxOTczNyBtIDAuNzkyNzAzNCwtOS41MTI0NDA0IDIuMzc4MTEwMSwtMi4zNzgxMTAxIDIuMzc4MTEwMDcsMi4zNzgxMTAxIDAsOS41MTI0NDA0IG0gLTMuMTcwODEzNDcsLTExLjA5Nzg0NzEgMi4zNzgxMTAxLDIuMzc4MTEwMSAwLDguNzE5NzM3IG0gMC43OTI3MDMzNywtOS41MTI0NDA0IDIuMzc4MTEwMTMsLTIuMzc4MTEwMSAyLjM3ODExMDEsMi4zNzgxMTAxIDAsOC43MTk3MzcgMS41ODU0MDY3LDEuNTg1NDA2OCBtIC00Ljc1NjIyMDIsLTExLjg5MDU1MDUgMi4zNzgxMTAxLDIuMzc4MTEwMSAwLDguNzE5NzM3IDEuNTg1NDA2NywxLjU4NTQwNjcgMi4zNzgxMTAxLC0yLjM3ODExMDFcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogU2FnaXR0YXJpdXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2FnaXR0YXJpdXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gNzsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTE3LjExNDQ0LDE3LjExNDQ0IG0gMTcuMTE0NDQsLTE3LjExNDQ0IC0zLjIwODk1NzUsMS4wNjk2NTI1IC02LjQxNzkxNSwwIG0gNy40ODc1Njc1LDEuMDY5NjUyNSAtMy4yMDg5NTc1LDAgLTQuMjc4NjEsLTEuMDY5NjUyNSBtIDkuNjI2ODcyNSwtMS4wNjk2NTI1IC0xLjA2OTY1MjUsMy4yMDg5NTc1IDAsNi40MTc5MTUwNCBtIC0xLjA2OTY1MjUsLTcuNDg3NTY3NTQgMCwzLjIwODk1NzUgMS4wNjk2NTI1LDQuMjc4NjEwMDQgbSAtOC41NTcyMiwwIC03LjQ4NzU2NzUsMCBtIDYuNDE3OTE1LDEuMDY5NjUyNDYgLTMuMjA4OTU3NSwwIC0zLjIwODk1NzUsLTEuMDY5NjUyNDYgbSA3LjQ4NzU2NzUsMCAwLDcuNDg3NTY3NDYgbSAtMS4wNjk2NTI1LC02LjQxNzkxNSAwLDMuMjA4OTU3NSAxLjA2OTY1MjUsMy4yMDg5NTc1XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENhcHJpY29ybiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYXByaWNvcm5TeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDEuODA0NzYzMywtMy42MDk1MjY3IDQuNTExOTA4NCw5LjAyMzgxNjggbSAtNC41MTE5MDg0LC03LjIxOTA1MzQgNC41MTE5MDg0LDkuMDIzODE2NyAyLjcwNzE0NSwtNi4zMTY2NzE3IDQuNTExOTA4NCwwIDIuNzA3MTQ1LC0wLjkwMjM4MTcgMC45MDIzODE3LC0xLjgwNDc2MzMgMCwtMS44MDQ3NjM0IC0wLjkwMjM4MTcsLTEuODA0NzYzMyAtMS44MDQ3NjM0LC0wLjkwMjM4MTcgLTAuOTAyMzgxNiwwIC0xLjgwNDc2MzQsMC45MDIzODE3IC0wLjkwMjM4MTcsMS44MDQ3NjMzIDAsMS44MDQ3NjM0IDAuOTAyMzgxNywyLjcwNzE0NSAwLjkwMjM4MTcsMS44MDQ3NjMzNiAwLjkwMjM4MTcsMi43MDcxNDUwNCAwLDIuNzA3MTQ1IC0xLjgwNDc2MzQsMS44MDQ3NjMzIG0gMS44MDQ3NjM0LC0xNi4yNDI4NzAxIC0wLjkwMjM4MTcsMC45MDIzODE3IC0wLjkwMjM4MTcsMS44MDQ3NjMzIDAsMS44MDQ3NjM0IDEuODA0NzYzNCwzLjYwOTUyNjcgMC45MDIzODE2LDIuNzA3MTQ1IDAsMi43MDcxNDUgLTAuOTAyMzgxNiwxLjgwNDc2MzQgLTEuODA0NzYzNCwwLjkwMjM4MTZcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogQXF1YXJpdXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXF1YXJpdXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTg7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMjsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDIuODg2NjAzNSwtMi44ODY2MDM1IDMuODQ4ODA0NywxLjkyNDQwMjMgbSAtNC44MTEwMDU5LC0wLjk2MjIwMTEgMy44NDg4MDQ3LDEuOTI0NDAyMyAyLjg4NjYwMzUsLTIuODg2NjAzNSAyLjg4NjYwMzUsMS45MjQ0MDIzIG0gLTMuODQ4ODA0NjcsLTAuOTYyMjAxMSAyLjg4NjYwMzQ3LDEuOTI0NDAyMyAyLjg4NjYwMzUsLTIuODg2NjAzNSAxLjkyNDQwMjQsMS45MjQ0MDIzIG0gLTIuODg2NjAzNSwtMC45NjIyMDExIDEuOTI0NDAyMywxLjkyNDQwMjMgMi44ODY2MDM1LC0yLjg4NjYwMzUgbSAtMTcuMzE5NjIxLDguNjU5ODEwNSAyLjg4NjYwMzUsLTIuODg2NjAzNDggMy44NDg4MDQ3LDEuOTI0NDAyMzggbSAtNC44MTEwMDU5LC0wLjk2MjIwMTIxIDMuODQ4ODA0NywxLjkyNDQwMjMxIDIuODg2NjAzNSwtMi44ODY2MDM0OCAyLjg4NjYwMzUsMS45MjQ0MDIzOCBtIC0zLjg0ODgwNDY3LC0wLjk2MjIwMTIxIDIuODg2NjAzNDcsMS45MjQ0MDIzMSAyLjg4NjYwMzUsLTIuODg2NjAzNDggMS45MjQ0MDI0LDEuOTI0NDAyMzggbSAtMi44ODY2MDM1LC0wLjk2MjIwMTIxIDEuOTI0NDAyMywxLjkyNDQwMjMxIDIuODg2NjAzNSwtMi44ODY2MDM0OFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBQaXNjZXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGlzY2VzU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC04OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTg7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiA0LDIgMiwyIDEsMyAwLDMgLTEsMyAtMiwyIC00LDIgbSAwLC0xNyAzLDEgMiwxIDIsMiAxLDMgbSAwLDMgLTEsMyAtMiwyIC0yLDEgLTMsMSBtIDE2LC0xNyAtMywxIC0yLDEgLTIsMiAtMSwzIG0gMCwzIDEsMyAyLDIgMiwxIDMsMSBtIDAsLTE3IC00LDIgLTIsMiAtMSwzIDAsMyAxLDMgMiwyIDQsMiBtIC0xNywtOSAxOCwwIG0gLTE4LDEgMTgsMFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTdW4gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3VuU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC0xOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTc7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0yLjE4MTgyLDAuNzI3MjY4IC0yLjE4MTgxOSwxLjQ1NDU0MyAtMS40NTQ1NTIsMi4xODE4MiAtMC43MjcyNjgsMi4xODE4MTkgMCwyLjE4MTgxOSAwLjcyNzI2OCwyLjE4MTgxOSAxLjQ1NDU1MiwyLjE4MTgyIDIuMTgxODE5LDEuNDU0NTQ0IDIuMTgxODIsMC43MjcyNzYgMi4xODE4MSwwIDIuMTgxODIsLTAuNzI3Mjc2IDIuMTgxODE5LC0xLjQ1NDU0NCAxLjQ1NDU1MiwtMi4xODE4MiAwLjcyNzI2OCwtMi4xODE4MTkgMCwtMi4xODE4MTkgLTAuNzI3MjY4LC0yLjE4MTgxOSAtMS40NTQ1NTIsLTIuMTgxODIgLTIuMTgxODE5LC0xLjQ1NDU0MyAtMi4xODE4MiwtMC43MjcyNjggLTIuMTgxODEsMCBtIDAuNzI3MjY3LDYuNTQ1NDUgLTAuNzI3MjY3LDAuNzI3Mjc2IDAsMC43MjcyNzUgMC43MjcyNjcsMC43MjcyNjggMC43MjcyNzYsMCAwLjcyNzI2NywtMC43MjcyNjggMCwtMC43MjcyNzUgLTAuNzI3MjY3LC0wLjcyNzI3NiAtMC43MjcyNzYsMCBtIDAsMC43MjcyNzYgMCwwLjcyNzI3NSAwLjcyNzI3NiwwIDAsLTAuNzI3Mjc1IC0wLjcyNzI3NiwwXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1vb24gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbW9vblN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtNDsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC03OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiBhIDcuNDk2OTI4Myw3LjQ5NjkyODMgMCAwIDEgMCwxNC4zMjc0NjIgNy40OTY5MjgzLDcuNDk2OTI4MyAwIDEgMCAwLC0xNC4zMjc0NjIgelwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBNZXJjdXJ5IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1lcmN1cnlTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTI7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSA3OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiA0LjI2MDExLDAgbSAtMi4xMzAwNSwtMi45ODIwNyAwLDUuMTEyMTMgbSA0LjcwMzEyLC05Ljc5ODMgYSA0LjcwMzE1LDQuNzAzMTUgMCAwIDEgLTQuNzAzMTUsNC43MDMxNCA0LjcwMzE1LDQuNzAzMTUgMCAwIDEgLTQuNzAzMTQsLTQuNzAzMTQgNC43MDMxNSw0LjcwMzE1IDAgMCAxIDQuNzAzMTQsLTQuNzAzMTUgNC43MDMxNSw0LjcwMzE1IDAgMCAxIDQuNzAzMTUsNC43MDMxNSB6XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgY29uc3QgY3Jvd25YU2hpZnQgPSA2OyAvL3B4XG4gICAgICBjb25zdCBjcm93bllTaGlmdCA9IC0xNjsgLy9weFxuICAgICAgY29uc3QgY3Jvd24gPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIGNyb3duLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyAoeCArIGNyb3duWFNoaWZ0KSArIFwiLCBcIiArICh5ICsgY3Jvd25ZU2hpZnQpICsgXCIgYSAzLjk3MTc4NTUsMy45NzE3ODU1IDAgMCAxIC0zLjk1NTQxLDMuNTkwNTQgMy45NzE3ODU1LDMuOTcxNzg1NSAwIDAgMSAtMy45NTE4NSwtMy41OTQ0NVwiKTtcbiAgICAgIGNyb3duLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChjcm93bilcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFZlbnVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHZlbnVzU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDIuMzsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IDc7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC00LjkzNzY2OSwwLjAzOTczIG0gMi40NDg5NzIsMi4zNjQ2MDcgMCwtNS43OTAxNCBjIC0zLjEwOTU0NiwtMC4wMDg1IC01LjYyNDYxNywtMi41MzQyMTIgLTUuNjIwMTg3LC01LjY0MjA4IDAuMDA0NCwtMy4xMDc3MDYgMi41MjY1MTQsLTUuNjIxNjg5IDUuNjM1NTgyLC01LjYyMTY4OSAzLjEwOTA2OCwwIDUuNjMxMTUyLDIuNTEzOTgzIDUuNjM1NTgyLDUuNjIxNjg5IDAuMDA0NCwzLjEwNzg2OCAtMi41MTA2NDEsNS42MzM1ODYgLTUuNjIwMTg3LDUuNjQyMDhcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogTWFycyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYXJzU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDM7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMy43OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiBjIC01LjI0NzQzOCwtNC4xNTA2MjMgLTExLjY5OTMsMy4yMDU1MTggLTcuMDE4ODA3LDcuODg2MDA3IDQuNjgwNDk0LDQuNjgwNDg4IDEyLjAzNjYyOCwtMS43NzEzODIgNy44ODU5OTksLTcuMDE4ODE2IHogbSAwLDAgMC40MzM1OTcsMC40MzM1OTUgMy45OTY1NjYsLTQuMjE3NDE5IG0gLTMuMjM5ODAyLC0wLjA1NTIxIDMuMjk1MDE1LDAgMC4xMTA0MjcsMy42ODE1MDdcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogSnVwaXRlciBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBqdXBpdGVyU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC02OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTI7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIGMgLTAuNDM0NzMsMCAtMS4zMDQyMiwtMC40MDU3MiAtMS4zMDQyMiwtMi4wMjg1NyAwLC0xLjYyMjg1IDEuNzM4OTcsLTMuMjQ1NyAzLjQ3NzkyLC0zLjI0NTcgMS43Mzg5NywwIDMuNDc3OTIsMS4yMTcxNSAzLjQ3NzkyLDQuMDU3MTMgMCwyLjgzOTk5IC0yLjE3MzcsNy4zMDI4MyAtNi41MjEwOCw3LjMwMjgzIG0gMTIuMTcyNjksMCAtMTIuNjA3NDUsMCBtIDkuOTk5MDIsLTExLjc2NTY3IDAsMTUuODIyNzlcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogU2F0dXJuIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNhdHVyblN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSA0OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gNzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgYyAtMC41MjIyMiwwLjUyMjIxIC0xLjA0NDQ1LDEuMDQ0NDQgLTEuNTY2NjYsMS4wNDQ0NCAtMC41MjIyMiwwIC0xLjU2NjY3LC0wLjUyMjIzIC0xLjU2NjY3LC0xLjU2NjY3IDAsLTEuMDQ0NDMgMC41MjIyMywtMi4wODg4NyAxLjU2NjY3LC0zLjEzMzMyIDEuMDQ0NDQsLTEuMDQ0NDMgMi4wODg4OCwtMy4xMzMzMSAyLjA4ODg4LC01LjIyMjE5IDAsLTIuMDg4ODggLTEuMDQ0NDQsLTQuMTc3NzYgLTMuMTMzMzIsLTQuMTc3NzYgLTEuOTc1NjYsMCAtMy42NTU1NSwxLjA0NDQ0IC00LjY5OTk4LDMuMTMzMzMgbSAtMi41NTUxNSwtNS44NzQ5OSA2LjI2NjY0LDAgbSAtMy43MTE0OSwtMi40ODA1NCAwLDE1LjE0NDM4XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFVyYW51cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cmFudXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTU7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtNjsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IGhvcm5zID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBob3Jucy5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAgMCwxMC4yMzgyNCBtIDEwLjIzNjMzLC0xMC4zMjc2NCAwLDEwLjIzODI0IG0gLTEwLjI2NjA2LC00LjYzOTQgMTAuMjMwODUsMCBtIC01LjA2NDE1LC01LjUxNTMyIDAsMTEuOTQ5ODVcIik7XG4gICAgICBob3Jucy5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaG9ybnMpXG5cbiAgICAgIGNvbnN0IGJvZHlYU2hpZnQgPSA3OyAvL3B4XG4gICAgICBjb25zdCBib2R5WVNoaWZ0ID0gMTM7IC8vcHhcbiAgICAgIGNvbnN0IGJvZHkgPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIGJvZHkuc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArICh4ICsgYm9keVhTaGlmdCkgKyBcIiwgXCIgKyAoeSArIGJvZHlZU2hpZnQpICsgXCIgYSAxLjgzODQzNzcsMS44Mzg0Mzc3IDAgMCAxIC0xLjgzODQ0LDEuODM4NDMgMS44Mzg0Mzc3LDEuODM4NDM3NyAwIDAgMSAtMS44Mzg0MiwtMS44Mzg0MyAxLjgzODQzNzcsMS44Mzg0Mzc3IDAgMCAxIDEuODM4NDIsLTEuODM4NDQgMS44Mzg0Mzc3LDEuODM4NDM3NyAwIDAgMSAxLjgzODQ0LDEuODM4NDQgelwiKTtcbiAgICAgIGJvZHkuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGJvZHkpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBOZXB0dW5lIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5lcHR1bmVTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gNDsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC02OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAxLjc3MDU5LC0yLjM2MzEyIDIuMzE4NzIsMS44MDQ1IG0gLTE0LjQ0MjY0LC0wLjIwMDA2IDIuMzQxMTMsLTEuNzc0MTggMS43NDA4NSwyLjM4NTk1IG0gLTEuODAwMTMsLTEuNzcyNjUgYyAtMS4yMzc3Niw4LjQwOTc1IDAuODI1MTgsOS42NzEyMSA0Ljk1MTA2LDkuNjcxMjEgNC4xMjU4OSwwIDYuMTg4ODMsLTEuMjYxNDYgNC45NTEwNywtOS42NzEyMSBtIC03LjA1MzM0LDMuMTcwMDUgMi4wMzk5NywtMi4xMjU1OSAyLjA4NTY1LDIuMDc5MDMgbSAtNS4zMjQwNiw5LjkxMTYyIDYuNjAxNDIsMCBtIC0zLjMwMDcxLC0xMi4xOTQxNCAwLDE1LjU1ODAzXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFBsdXRvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDY7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtNzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IGJvZHkgPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIGJvZHkuc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgYSA1Ljc2NzY4NTYsNS43Njc2ODU2IDAgMCAxIC0yLjg4Mzg1LDQuOTk0OTYgNS43Njc2ODU2LDUuNzY3Njg1NiAwIDAgMSAtNS43Njc2OCwwIDUuNzY3Njg1Niw1Ljc2NzY4NTYgMCAwIDEgLTIuODgzODUsLTQuOTk0OTYgbSA1Ljc2NzcxLDEzLjkzODU4IDAsLTguMTcwODggbSAtMy44NDUxMiw0LjMyNTc2IDcuNjkwMjQsMFwiKTtcbiAgICAgIGJvZHkuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGJvZHkpXG5cbiAgICAgIGNvbnN0IGhlYWRYU2hpZnQgPSAtMi40OyAvL3B4XG4gICAgICBjb25zdCBoZWFkWVNoaWZ0ID0gLTE7IC8vcHhcbiAgICAgIGNvbnN0IGhlYWQgPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIGhlYWQuc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArICh4ICsgaGVhZFhTaGlmdCkgKyBcIiwgXCIgKyAoeSArIGhlYWRZU2hpZnQpICsgXCIgYSAzLjM2NDQ4MzQsMy4zNjQ0ODM0IDAgMCAxIC0zLjM2NDQ4LDMuMzY0NDkgMy4zNjQ0ODM0LDMuMzY0NDgzNCAwIDAgMSAtMy4zNjQ0OCwtMy4zNjQ0OSAzLjM2NDQ4MzQsMy4zNjQ0ODM0IDAgMCAxIDMuMzY0NDgsLTMuMzY0NDggMy4zNjQ0ODM0LDMuMzY0NDgzNCAwIDAgMSAzLjM2NDQ4LDMuMzY0NDggelwiKTtcbiAgICAgIGhlYWQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGhlYWQpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDaGlyb24gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2hpcm9uU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDQ7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAzOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgYm9keSA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgYm9keS5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiBhIDMuODc2NDcyNSwzLjA2NzUyNDkgMCAwIDEgLTMuODc2NDczLDMuMDY3NTI1IDMuODc2NDcyNSwzLjA2NzUyNDkgMCAwIDEgLTMuODc2NDcyLC0zLjA2NzUyNSAzLjg3NjQ3MjUsMy4wNjc1MjQ5IDAgMCAxIDMuODc2NDcyLC0zLjA2NzUyNSAzLjg3NjQ3MjUsMy4wNjc1MjQ5IDAgMCAxIDMuODc2NDczLDMuMDY3NTI1IHpcIik7XG4gICAgICBib2R5LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChib2R5KVxuXG4gICAgICBjb25zdCBoZWFkWFNoaWZ0ID0gMDsgLy9weFxuICAgICAgY29uc3QgaGVhZFlTaGlmdCA9IC0xNC41OyAvL3B4XG4gICAgICBjb25zdCBoZWFkID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBoZWFkLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyAoeCArIGhlYWRYU2hpZnQpICsgXCIsIFwiICsgKHkgKyBoZWFkWVNoaWZ0KSArIFwiICAgLTMuOTQyOTk3LDQuMjQzODQ0IDQuMTEwODQ5LDMuNjU2MTUxIG0gLTQuODY3NTY5LC05LjAwOTQ2OCAwLDExLjcyNzI1MVwiKTtcbiAgICAgIGhlYWQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGhlYWQpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBMaWxpdGggc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGlsaXRoU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDI7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAzOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMi41MjU0MzUsLTEuMTI4NTMgLTEuNDY0NzUyLC0xLjc5NTM5IC0wLjgwODEzOCwtMi4yMDU3NiAwLjE1MTUyNiwtMi4wNTE4OCAwLjkwOTE1NiwtMS41Mzg5IDEuMDEwMTczLC0xLjAyNTkzIDAuOTA5MTU3LC0wLjU2NDI3IDEuMzYzNzM1LC0wLjYxNTU2IG0gMi4zMTUzMjcsLTAuMzkwNTUgLTEuNzE2MzAxLDAuNTQ3MTYgLTEuNzE2MywxLjA5NDMxIC0xLjE0NDIsMS42NDE0NiAtMC41NzIxMDIsMS42NDE0NiAwLDEuNjQxNDYgMC41NzIxMDIsMS42NDE0NyAxLjE0NDIsMS42NDE0NSAxLjcxNjMsMS4wOTQzMiAxLjcxNjMwMSwwLjU0NzE1IG0gMCwtMTEuNDkwMjQgLTIuMjg4NCwwIC0yLjI4ODQwMSwwLjU0NzE2IC0xLjcxNjMwMiwxLjA5NDMxIC0xLjE0NDIwMSwxLjY0MTQ2IC0wLjU3MjEsMS42NDE0NiAwLDEuNjQxNDYgMC41NzIxLDEuNjQxNDcgMS4xNDQyMDEsMS42NDE0NSAxLjcxNjMwMiwxLjA5NDMyIDIuMjg4NDAxLDAuNTQ3MTUgMi4yODg0LDAgbSAtNC4zNjcxMiwtMC40NzUyIDAsNi40NDMwNyBtIC0yLjcwOTEwNywtMy40MTEwMSA1LjYxNjAyNSwwXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE5Ob2RlIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5ub2RlU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC0zOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gMzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTEuMzMzMzMzNCwtMC42NjY2NjY3IC0wLjY2NjY2NjYsMCAtMS4zMzMzMzM0LDAuNjY2NjY2NyAtMC42NjY2NjY3LDEuMzMzMzMzMyAwLDAuNjY2NjY2NyAwLjY2NjY2NjcsMS4zMzMzMzMzIDEuMzMzMzMzNCwwLjY2NjY2NjcgMC42NjY2NjY2LDAgMS4zMzMzMzM0LC0wLjY2NjY2NjcgMC42NjY2NjY2LC0xLjMzMzMzMzMgMCwtMC42NjY2NjY3IC0wLjY2NjY2NjYsLTEuMzMzMzMzMyAtMiwtMi42NjY2NjY2NSAtMC42NjY2NjY3LC0xLjk5OTk5OTk1IDAsLTEuMzMzMzMzNCAwLjY2NjY2NjcsLTIgMS4zMzMzMzMzLC0xLjMzMzMzMzMgMiwtMC42NjY2NjY3IDIuNjY2NjY2NiwwIDIsMC42NjY2NjY3IDEuMzMzMzMzMywxLjMzMzMzMzMgMC42NjY2NjY3LDIgMCwxLjMzMzMzMzQgLTAuNjY2NjY2NywxLjk5OTk5OTk1IC0yLDIuNjY2NjY2NjUgLTAuNjY2NjY2NiwxLjMzMzMzMzMgMCwwLjY2NjY2NjcgMC42NjY2NjY2LDEuMzMzMzMzMyAxLjMzMzMzMzQsMC42NjY2NjY3IDAuNjY2NjY2NiwwIDEuMzMzMzMzNCwtMC42NjY2NjY3IDAuNjY2NjY2NywtMS4zMzMzMzMzIDAsLTAuNjY2NjY2NyAtMC42NjY2NjY3LC0xLjMzMzMzMzMgLTEuMzMzMzMzNCwtMC42NjY2NjY3IC0wLjY2NjY2NjYsMCAtMS4zMzMzMzM0LDAuNjY2NjY2NyBtIC03Ljk5OTk5OTksLTYgMC42NjY2NjY3LC0xLjMzMzMzMzMgMS4zMzMzMzMzLC0xLjMzMzMzMzMgMiwtMC42NjY2NjY3IDIuNjY2NjY2NiwwIDIsMC42NjY2NjY3IDEuMzMzMzMzMywxLjMzMzMzMzMgMC42NjY2NjY3LDEuMzMzMzMzM1wiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFNWR1V0aWxzIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFV0aWxpdHkgY2xhc3NcbiAqIEBwdWJsaWNcbiAqIEBzdGF0aWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgVXRpbHMge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgVXRpbHMpIHtcbiAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBERUdfMzYwID0gMzYwXG4gIHN0YXRpYyBERUdfMTgwID0gMTgwXG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHJhbmRvbSBJRFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZW5lcmF0ZVVuaXF1ZUlkID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcmFuZG9tTnVtYmVyID0gTWF0aC5yYW5kb20oKSAqIDEwMDAwMDA7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCB1bmlxdWVJZCA9IGBpZF8ke3JhbmRvbU51bWJlcn1fJHt0aW1lc3RhbXB9YDtcbiAgICByZXR1cm4gdW5pcXVlSWQ7XG4gIH1cblxuICAvKipcbiAgICogSW52ZXJ0ZWQgZGVncmVlIHRvIHJhZGlhblxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZUluZGVncmVlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaGlmdEluRGVncmVlXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIHN0YXRpYyBkZWdyZWVUb1JhZGlhbiA9IGZ1bmN0aW9uKGFuZ2xlSW5EZWdyZWUsIHNoaWZ0SW5EZWdyZWUgPSAwKSB7XG4gICAgcmV0dXJuIChzaGlmdEluRGVncmVlIC0gYW5nbGVJbkRlZ3JlZSkgKiBNYXRoLlBJIC8gMTgwXG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgcmFkaWFuIHRvIGRlZ3JlZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5cbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIHJhZGlhblRvRGVncmVlID0gZnVuY3Rpb24ocmFkaWFuKSB7XG4gICAgcmV0dXJuIChyYWRpYW4gKiAxODAgLyBNYXRoLlBJKVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgb24gdGhlIGNpcmNsZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGN4IC0gY2VudGVyIHhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGN5IC0gY2VudGVyIHlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5SYWRpYW5zXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7eDpOdW1iZXIsIHk6TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIHBvc2l0aW9uT25DaXJjbGUoY3gsIGN5LCByYWRpdXMsIGFuZ2xlSW5SYWRpYW5zKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IChyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZUluUmFkaWFucykgKyBjeCksXG4gICAgICB5OiAocmFkaXVzICogTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpICsgY3kpXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIG5ldyBwb3NpdGlvbiBvZiBwb2ludHMgb24gY2lyY2xlIHdpdGhvdXQgb3ZlcmxhcHBpbmcgZWFjaCBvdGhlclxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBJZiB0aGVyZSBpcyBubyBwbGFjZSBvbiB0aGUgY2lyY2xlIHRvIHBsYWNlIHBvaW50cy5cbiAgICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIC0gW3tuYW1lOlwiYVwiLCBwb3NpdGlvbjoxMH0sIHtuYW1lOlwiYlwiLCBwb3NpdGlvbjoyMH1dXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjb2xsaXNpb25SYWRpdXMgLSBwb2ludCByYWRpdXNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXNcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHtcIk1vb25cIjozMCwgXCJTdW5cIjo2MCwgXCJNZXJjdXJ5XCI6ODYsIC4uLn1cbiAgICovXG4gIHN0YXRpYyBjYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIGNvbGxpc2lvblJhZGl1cywgY2lyY2xlUmFkaXVzKSB7XG4gICAgY29uc3QgU1RFUCA9IDEgLy9kZWdyZWVcblxuICAgIGNvbnN0IGNlbGxXaWR0aCA9IDEwIC8vZGVncmVlXG4gICAgY29uc3QgbnVtYmVyT2ZDZWxscyA9IFV0aWxzLkRFR18zNjAgLyBjZWxsV2lkdGhcbiAgICBjb25zdCBmcmVxdWVuY3kgPSBuZXcgQXJyYXkoIG51bWJlck9mQ2VsbHMgKS5maWxsKDApXG4gICAgZm9yKGNvbnN0IHBvaW50IG9mIHBvaW50cyl7XG4gICAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IocG9pbnQucG9zaXRpb24gLyBjZWxsV2lkdGgpXG4gICAgICBmcmVxdWVuY3lbaW5kZXhdICs9IDFcbiAgICB9XG5cbiAgICAvLyBJbiB0aGlzIGFsZ29yaXRobSB0aGUgb3JkZXIgb2YgcG9pbnRzIGlzIGNydWNpYWwuXG4gICAgLy8gQXQgdGhhdCBwb2ludCBpbiB0aGUgY2lyY2xlLCB3aGVyZSB0aGUgcGVyaW9kIGNoYW5nZXMgaW4gdGhlIGNpcmNsZSAoZm9yIGluc3RhbmNlOlszNTgsMzU5LDAsMV0pLCB0aGUgcG9pbnRzIGFyZSBhcnJhbmdlZCBpbiBpbmNvcnJlY3Qgb3JkZXIuXG4gICAgLy8gQXMgYSBzdGFydGluZyBwb2ludCwgSSB0cnkgdG8gZmluZCBhIHBsYWNlIHdoZXJlIHRoZXJlIGFyZSBubyBwb2ludHMuIFRoaXMgcGxhY2UgSSB1c2UgYXMgU1RBUlRfQU5HTEUuICBcbiAgICBjb25zdCBTVEFSVF9BTkdMRSA9IGNlbGxXaWR0aCAqIGZyZXF1ZW5jeS5maW5kSW5kZXgoIGNvdW50ID0+IGNvdW50ID09IDAgKVxuXG4gICAgY29uc3QgX3BvaW50cyA9IHBvaW50cy5tYXAocG9pbnQgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogcG9pbnQubmFtZSxcbiAgICAgICAgcG9zaXRpb246IHBvaW50LnBvc2l0aW9uIDwgU1RBUlRfQU5HTEUgPyBwb2ludC5wb3NpdGlvbiArIFV0aWxzLkRFR18zNjAgOiBwb2ludC5wb3NpdGlvblxuICAgICAgfVxuICAgIH0pXG5cbiAgICBfcG9pbnRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnBvc2l0aW9uIC0gYi5wb3NpdGlvblxuICAgIH0pXG5cbiAgICAvLyBSZWN1cnNpdmUgZnVuY3Rpb25cbiAgICBjb25zdCBhcnJhbmdlUG9pbnRzID0gKCkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGxuID0gX3BvaW50cy5sZW5ndGg7IGkgPCBsbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKDAsIDAsIGNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oX3BvaW50c1tpXS5wb3NpdGlvbikpXG4gICAgICAgIF9wb2ludHNbaV0ueCA9IHBvaW50UG9zaXRpb24ueFxuICAgICAgICBfcG9pbnRzW2ldLnkgPSBwb2ludFBvc2l0aW9uLnlcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KF9wb2ludHNbaV0ueCAtIF9wb2ludHNbal0ueCwgMikgKyBNYXRoLnBvdyhfcG9pbnRzW2ldLnkgLSBfcG9pbnRzW2pdLnksIDIpKTtcbiAgICAgICAgICBpZiAoZGlzdGFuY2UgPCAoMiAqIGNvbGxpc2lvblJhZGl1cykpIHtcbiAgICAgICAgICAgIF9wb2ludHNbaV0ucG9zaXRpb24gKz0gU1RFUFxuICAgICAgICAgICAgX3BvaW50c1tqXS5wb3NpdGlvbiAtPSBTVEVQXG4gICAgICAgICAgICBhcnJhbmdlUG9pbnRzKCkgLy89PT09PT0+IFJlY3Vyc2l2ZSBjYWxsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXJyYW5nZVBvaW50cygpXG5cbiAgICByZXR1cm4gX3BvaW50cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBwb2ludCwgY3VycmVudEluZGV4KSA9PiB7XG4gICAgICBhY2N1bXVsYXRvcltwb2ludC5uYW1lXSA9IHBvaW50LnBvc2l0aW9uXG4gICAgICByZXR1cm4gYWNjdW11bGF0b3JcbiAgICB9LCB7fSlcbiAgfVxufVxuXG5leHBvcnQge1xuICBVdGlscyBhc1xuICBkZWZhdWx0XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBVbml2ZXJzZSBmcm9tICcuL3VuaXZlcnNlL1VuaXZlcnNlLmpzJ1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4vdXRpbHMvU1ZHVXRpbHMuanMnXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi91dGlscy9VdGlscy5qcydcbmltcG9ydCBSYWRpeENoYXJ0IGZyb20gJy4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnXG5pbXBvcnQgVHJhbnNpdENoYXJ0IGZyb20gJy4vY2hhcnRzL1RyYW5zaXRDaGFydC5qcydcblxuZXhwb3J0IHtVbml2ZXJzZSBhcyBcIkNoYXJ0XCIsIFNWR1V0aWxzLCBVdGlscywgUmFkaXhDaGFydCwgVHJhbnNpdENoYXJ0fVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9