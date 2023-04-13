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
    const POINT_RADIUS = this.#innerCircleRadius - (4 * RadixChart.RULER_LENGTH)

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
  #drawCusps(cusps) {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const textRadius = this.#radius / RadixChart.OUTER_CIRCLE_RADIUS_RATIO + 2* RadixChart.RULER_LENGTH

    for (let i = 0; i < cusps.length; i++) {
      const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#centerCircleRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(cusps[i].position, this.#anscendantShift))
      const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(cusps[i].position, this.#anscendantShift))
      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR)
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE)
      wrapper.appendChild(line);

      const startCusp = cusps[i].position
      const endCusp = cusps[(i + 1) % 12].position
      const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].DEG_360
      const textAngle = startCusp + gap / 2
      const textPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, textRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(textAngle, this.#anscendantShift))
      const text = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(`${i+1}`, textPos.x, textPos.y)
      text.setAttribute("stroke", this.#settings.CHART_TEXT_COLOR)
      text.setAttribute("stroke-width", this.#settings.CHART_STROKE)
      wrapper.appendChild(text)
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
const CHART_TEXT_COLOR = "#666";

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

  static SYMBOL_NUMBER_1 = "1";
  static SYMBOL_NUMBER_2 = "2";
  static SYMBOL_NUMBER_3 = "3";
  static SYMBOL_NUMBER_4 = "4";
  static SYMBOL_NUMBER_5 = "5";
  static SYMBOL_NUMBER_6 = "6";
  static SYMBOL_NUMBER_7 = "7";
  static SYMBOL_NUMBER_8 = "8";
  static SYMBOL_NUMBER_9 = "9";
  static SYMBOL_NUMBER_10 = "10";
  static SYMBOL_NUMBER_11 = "11";
  static SYMBOL_NUMBER_12 = "12";

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

      case SVGUtils.SYMBOL_NUMBER_1:
        return number1Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_2:
        return number2Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_3:
        return number3Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_4:
        return number4Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_5:
        return number5Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_6:
        return number6Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_7:
        return number7Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_8:
        return number8Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_9:
        return number9Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_10:
        return number10Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_11:
        return number11Symbol(xPos, yPos, scale)
        break;
      case SVGUtils.SYMBOL_NUMBER_12:
        return number12Symbol(xPos, yPos, scale)
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

    /*
     * Number 1 symbol
     */
    function number1Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 0; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -2.5128753,7.7578884 1.00515009,0 m 3.01545031,-9.5832737 -1.0051501,1.8253853 -2.51287527,7.7578884 m 3.51802537,-9.5832737 -3.01545031,9.5832737 m 3.01545031,-9.5832737 -1.5077251,1.3690388 -1.50772521,0.9126929 -1.00515009,0.4563463 m 2.5128753,-0.9126927 -1.00515016,0.4563464 -1.50772514,0.4563463");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Number 2 symbol
     */
    function number2Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -1; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " 0,-0.4545454 0.4545454,0 0,0.9090909 -0.9090909,0 0,-0.9090909 0.4545455,-0.9090909 0.4545454,-0.4545455 1.36363637,-0.4545454 1.36363633,0 1.3636364,0.4545454 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -4.5454546,2.72727269 -0.9090909,0.90909091 -0.9090909,1.8181818 m 6.8181818,-9.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -1.36363633,0.9090909 m 1.36363633,-5 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -3.6363637,2.72727269 m -1.3636363,1.81818181 0.4545454,-0.4545454 0.9090909,0 2.27272732,0.4545454 2.27272728,0 0.4545454,-0.4545454 m -5,0 2.27272732,0.9090909 2.27272728,0 m -4.5454546,-0.9090909 2.27272732,1.3636363 1.36363638,0 0.9090909,-0.4545454 0.4545454,-0.9090909 0,-0.4545455");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Number 3 symbol
     */
    function number3Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -1; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " 0,-0.4545454 0.45454549,0 0,0.9090909 -0.90909089,0 0,-0.9090909 0.4545454,-0.9090909 0.45454549,-0.4545455 1.36363636,-0.4545454 1.36363635,0 1.3636364,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.4545455,0.4545454 -0.9090909,0.4545455 -1.36363635,0.4545454 m 2.27272725,-4.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.4545454,0.4545454 m -0.4545455,-3.6363636 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -0.90909095,0.4545454 m -0.9090909,0 0.9090909,0 1.36363635,0.4545455 0.4545455,0.45454542 0.4545454,0.90909091 0,1.36363637 -0.4545454,0.9090909 -0.9090909,0.4545455 -1.3636364,0.4545454 -1.3636364,0 -1.3636363,-0.4545454 -0.4545455,-0.4545455 -0.4545454,-0.9090909 0,-0.90909091 0.9090909,0 0,0.90909091 -0.4545455,0 0,-0.45454546 m 5,-1.81818182 0.4545455,0.90909091 0,1.36363637 -0.4545455,0.9090909 m -1.36363635,-4.0909091 0.90909095,0.4545455 0.4545454,0.90909088 0,1.81818182 -0.4545454,0.9090909 -0.45454549,0.4545455 -0.90909091,0.4545454");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Number 4 symbol
     */
    function number4Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 1; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -2.28678383,7.7750651 0.91471356,0 m 2.74414057,-9.6044922 -0.9147135,1.8294271 -2.28678386,7.7750651 m 3.20149736,-9.6044922 -2.74414057,9.6044922 m 2.74414057,-9.6044922 -7.3177083,6.8603516 7.3177083,0");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Number 5 symbol
     */
    function number5Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 0; //px
      const Y_SHIFT = -4; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -2.27272725,4.5454545 m 2.27272725,-4.5454545 4.54545455,0 m -4.54545455,0.4545454 3.63636365,0 m -4.0909091,0.4545455 2.2727273,0 1.8181818,-0.4545455 0.9090909,-0.4545454 m -6.8181818,4.5454545 0.4545454,-0.4545454 1.3636364,-0.4545455 1.36363636,0 1.36363634,0.4545455 0.4545455,0.4545454 0.4545454,0.90909092 0,1.36363638 -0.4545454,1.3636364 -0.9090909,0.9090909 -1.81818185,0.4545454 -1.36363635,0 -0.9090909,-0.4545454 -0.4545455,-0.4545455 -0.4545454,-0.9090909 0,-0.9090909 0.9090909,0 0,0.9090909 -0.4545455,0 0,-0.45454545 m 5,-2.72727275 0.4545455,0.90909092 0,1.36363638 -0.4545455,1.3636364 -0.9090909,0.9090909 m -0.45454544,-5.4545455 0.90909094,0.4545455 0.4545454,0.9090909 0,1.8181818 -0.4545454,1.3636364 -0.90909094,0.9090909 -0.90909091,0.4545454");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Number 6 symbol
     */
    function number6Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 3; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " 0,-0.4545455 -0.4545455,0 0,0.9090909 0.9090909,0 0,-0.9090909 -0.4545454,-0.9090909 -0.909091,-0.4545454 -1.3636363,0 -1.36363638,0.4545454 -0.90909092,0.9090909 -0.9090909,1.3636364 -0.4545455,1.3636364 -0.4545454,1.81818178 0,1.36363636 0.4545454,1.36363636 0.4545455,0.4545455 0.9090909,0.4545454 1.36363637,0 1.36363633,-0.4545454 0.9090909,-0.9090909 0.4545455,-0.90909096 0,-1.36363636 -0.4545455,-0.90909088 -0.4545454,-0.4545455 -0.9090909,-0.4545454 -1.36363638,0 -0.90909092,0.4545454 -0.4545454,0.4545455 -0.4545455,0.90909088 m 1.36363636,-4.54545458 -0.90909086,1.3636364 -0.4545455,1.3636364 -0.4545455,1.81818178 0,1.81818182 0.4545455,0.9090909 m 4.0909091,-0.4545454 0.4545454,-0.90909096 0,-1.36363636 -0.4545454,-0.90909088 m -0.9090909,-5 -0.90909093,0.4545454 -0.90909091,1.3636364 -0.45454546,0.9090909 -0.4545454,1.3636364 -0.4545455,1.81818178 0,2.27272732 0.4545455,0.9090909 0.4545454,0.4545454 m 1.36363637,0 0.90909093,-0.4545454 0.4545454,-0.4545455 0.4545455,-1.36363636 0,-1.81818182 -0.4545455,-0.90909092 -0.4545454,-0.4545454");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Number 7 symbol
     */
    function number7Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -2; //px
      const Y_SHIFT = -4; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -0.9090909,2.7272727 m 6.8181818,-2.7272727 -0.4545454,1.3636363 -0.909091,1.3636364 -1.8181818,2.2727273 -0.90909088,1.36363633 -0.45454546,1.36363637 -0.45454545,1.8181818 m 0.90909091,-3.63636362 -0.90909091,1.81818182 -0.45454546,1.8181818 m 4.09090905,-6.8181818 -2.72727268,2.72727272 -0.90909091,1.36363637 -0.45454546,0.90909091 -0.45454545,1.8181818 0.90909091,0 m -1.36363641,-8.1818182 1.36363641,-1.3636363 0.90909091,0 2.27272728,1.3636363 m -3.63636365,-0.9090909 1.36363637,0 2.27272728,0.9090909 m -4.5454546,0 0.90909095,-0.4545454 1.36363637,0 2.27272728,0.4545454 0.9090909,0 0.4545455,-0.4545454 0.4545454,-0.9090909");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Number 8 symbol
     */
    function number8Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 0; //px
      const Y_SHIFT = -5; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -1.3631244,0.4543748 -0.4543748,0.4543748 -0.4543748,0.9087496 0,1.3631244 0.4543748,0.9087496 0.9087496,0.4543748 1.3631244,0 1.3631244,-0.4543748 0.9087496,-0.4543748 0.4543748,-0.9087496 0,-1.3631244 -0.4543748,-0.9087496 -0.9087496,-0.4543748 -1.8174992,0 m 0.9087496,0 -2.271874,0.4543748 m 0,0.4543748 -0.4543748,0.9087496 0,1.8174992 0.4543748,0.4543748 m -0.4543748,0 1.3631244,0.4543748 m 0.4543748,0 1.8174992,-0.4543748 m 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.3631244 -0.4543748,-0.9087496 m 0.4543748,0 -1.8174992,-0.4543748 m -0.9087496,0 -0.9087496,0.9087496 -0.4543748,0.9087496 0,1.8174992 0.4543748,0.9087496 m 1.3631244,0 0.9087496,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.8174992 -0.4543748,-0.9087496 m -2.7262488,4.543748 -1.8174992,0.4543748 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 1.3631244,0.4543748 1.8174992,0 1.8174992,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.36312436 -0.4543748,-0.9087496 -0.4543748,-0.45437484 -0.9087496,-0.4543748 m -0.9087496,0 -2.271874,0.4543748 m 0.4543748,0 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 m -0.4543748,0 2.271874,0.4543748 2.7262488,-0.4543748 m 0,-0.4543748 0.4543748,-0.9087496 0,-1.36312436 -0.4543748,-0.9087496 m 0,-0.45437484 -1.3631244,-0.4543748 m -0.9087496,0 -0.9087496,0.4543748 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 0.4543748,0.4543748 m 1.8174992,0 0.9087496,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.81749916 -0.4543748,-0.90874964 -0.4543748,-0.4543748");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Number 9 symbol
     */
    function number9Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = 3; //px
      const Y_SHIFT = -1; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const path = SVGUtils.SVGPath()
      path.setAttribute("d", "m" + x + ", " + y + " -0.4545455,0.9090909 -0.4545454,0.4545455 -0.9090909,0.45454542 -1.36363638,0 -0.90909092,-0.45454542 -0.4545454,-0.4545455 -0.4545455,-0.9090909 0,-1.3636364 0.4545455,-0.9090909 0.90909086,-0.9090909 1.36363637,-0.4545454 1.36363637,0 0.9090909,0.4545454 0.4545455,0.4545455 0.4545454,1.3636363 0,1.3636364 -0.4545454,1.81818182 -0.4545455,1.36363637 -0.9090909,1.36363641 -0.9090909,0.9090909 -1.36363638,0.4545454 -1.36363632,0 -0.909091,-0.4545454 -0.4545454,-0.9090909 0,-0.90909096 0.9090909,0 0,0.90909096 -0.4545455,0 0,-0.4545455 m 1.3636364,-3.1818182 -0.4545454,-0.9090909 0,-1.3636364 0.4545454,-0.9090909 m 4.0909091,-0.4545454 0.4545455,0.9090909 0,1.8181818 -0.4545455,1.81818182 -0.4545455,1.36363637 -0.9090909,1.36363641 m -1.81818178,-2.72727278 -0.45454546,-0.45454542 -0.45454546,-0.9090909 0,-1.8181819 0.45454546,-1.3636363 0.45454546,-0.4545455 0.90909091,-0.4545454 m 1.36363637,0 0.4545454,0.4545454 0.4545455,0.9090909 0,2.2727273 -0.4545455,1.81818182 -0.4545454,1.36363637 -0.4545455,0.90909091 -0.90909087,1.3636364 -0.90909091,0.4545454");
      path.setAttribute("fill", "none");
      wrapper.appendChild(path)

      return wrapper
    }

    /*
     * Number 10 symbol
     */
    function number10Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -3; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const one = SVGUtils.SVGPath()
      one.setAttribute("d", "m" + x + ", " + y + " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915");
      one.setAttribute("fill", "none");
      wrapper.appendChild(one)

      const numberXShift = 6.5; //px
			const numberYShift = -1.5; //px
      const zero = SVGUtils.SVGPath()
      zero.setAttribute("d", "m" + (x + numberXShift) + ", " + (y + numberYShift) + " -1.36363638,0.4545454 -0.90909092,0.9090909 -0.9090909,1.3636364 -0.4545455,1.3636364 -0.4545454,1.81818178 0,1.36363636 0.4545454,1.36363636 0.4545455,0.4545455 0.9090909,0.4545454 0.90909092,0 1.36363638,-0.4545454 0.9090909,-0.9090909 0.9090909,-1.36363641 0.4545455,-1.36363637 0.4545454,-1.81818182 0,-1.3636364 -0.4545454,-1.3636363 -0.4545455,-0.4545455 -0.9090909,-0.4545454 -0.9090909,0 m -1.36363638,0.9090909 -0.90909092,0.9090909 -0.4545454,0.9090909 -0.4545455,1.3636364 -0.4545455,1.81818178 0,1.81818182 0.4545455,0.9090909 m 3.1818182,0 0.9090909,-0.9090909 0.4545454,-0.90909091 0.4545455,-1.36363637 0.4545455,-1.81818182 0,-1.8181818 -0.4545455,-0.9090909 m -1.8181818,-0.9090909 -0.90909093,0.4545454 -0.90909091,1.3636364 -0.45454546,0.9090909 -0.4545454,1.3636364 -0.4545455,1.81818178 0,2.27272732 0.4545455,0.9090909 0.4545454,0.4545454 m 0.90909092,0 0.90909091,-0.4545454 0.90909087,-1.3636364 0.4545455,-0.90909091 0.4545454,-1.36363637 0.4545455,-1.81818182 0,-2.2727273 -0.4545455,-0.9090909 -0.4545454,-0.4545454");
      zero.setAttribute("fill", "none");
      wrapper.appendChild(zero)

      return wrapper
    }

    /*
     * Number 11 symbol
     */
    function number11Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -2; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const one1 = SVGUtils.SVGPath()
      one1.setAttribute("d", "m" + x + ", " + y + " -2.5128753,7.7578884 1.00515009,0 m 3.01545031,-9.5832737 -1.0051501,1.8253853 -2.51287527,7.7578884 m 3.51802537,-9.5832737 -3.01545031,9.5832737 m 3.01545031,-9.5832737 -1.5077251,1.3690388 -1.50772521,0.9126929 -1.00515009,0.4563463 m 2.5128753,-0.9126927 -1.00515016,0.4563464 -1.50772514,0.4563463");
      one1.setAttribute("fill", "none");
      wrapper.appendChild(one1)

      const numberXShift = 6; //px
			const numberYShift = 0; //px
      const one2 = SVGUtils.SVGPath()
      one2.setAttribute("d", "m" + (x + numberXShift) + ", " + (y + numberYShift) + " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915");
      one2.setAttribute("fill", "none");
      wrapper.appendChild(one2)

      return wrapper
    }

    /*
     * Number 12 symbol
     */
    function number12Symbol(xPos, yPos, scale = 1) {
      const X_SHIFT = -2; //px
      const Y_SHIFT = -3; //px
      const x = xPos + X_SHIFT * scale
      const y = yPos + Y_SHIFT * scale

      const wrapper = SVGUtils.SVGGroup()
      wrapper.setAttribute("transform", "translate(" + (-x * (scale - 1)) + "," + (-y * (scale - 1)) + ") scale(" + scale + ")");

      const one = SVGUtils.SVGPath()
      one.setAttribute("d", "m" + x + ", " + y + " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915");
      one.setAttribute("fill", "none");
      wrapper.appendChild(one)

      const numberXShift = 4; //px
			const numberYShift = 1; //px
      const two = SVGUtils.SVGPath()
      two.setAttribute("d", "m" + (x + numberXShift) + ", " + (y + numberYShift) + " 0,-0.4545454 0.4545454,0 0,0.9090909 -0.9090909,0 0,-0.9090909 0.4545455,-0.9090909 0.4545454,-0.4545455 1.36363637,-0.4545454 1.36363633,0 1.3636364,0.4545454 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -4.5454546,2.72727269 -0.9090909,0.90909091 -0.9090909,1.8181818 m 6.8181818,-9.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -1.36363633,0.9090909 m 1.36363633,-5 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -3.6363637,2.72727269 m -1.3636363,1.81818181 0.4545454,-0.4545454 0.9090909,0 2.27272732,0.4545454 2.27272728,0 0.4545454,-0.4545454 m -5,0 2.27272732,0.9090909 2.27272728,0 m -4.5454546,-0.9090909 2.27272732,1.3636363 1.36363638,0 0.9090909,-0.4545454 0.4545454,-0.9090909 0,-0.4545455");
      two.setAttribute("fill", "none");
      wrapper.appendChild(two)

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0cm9jaGFydDIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOzs7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixjQUFjLFFBQVEsR0FBRztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqSTJDO0FBQ047QUFDUjtBQUNROztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLHlCQUF5QixpREFBSzs7QUFFOUI7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhLFFBQVE7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixtRUFBaUI7QUFDbEMscUNBQXFDLCtCQUErQixHQUFHLHdCQUF3QjtBQUMvRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0RBQXNELCtEQUFhO0FBQ25FO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLG9FQUFrQjtBQUNoQztBQUNBLE9BQU87QUFDUDtBQUNBLGNBQWMsb0VBQWtCO0FBQ2hDO0FBQ0EsT0FBTztBQUNQO0FBQ0EsY0FBYyxvRUFBa0I7QUFDaEM7QUFDQSxPQUFPO0FBQ1A7QUFDQSxjQUFjLG9FQUFrQjtBQUNoQztBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLCtCQUErQixHQUFHLHdCQUF3Qjs7QUFFakYsb0JBQW9CLG1FQUFpQjs7QUFFckMsaUJBQWlCLGtFQUFnQjtBQUNqQyx3QkFBd0Isb0VBQWtCO0FBQzFDO0FBQ0E7O0FBRUEsd0JBQXdCLG9FQUFrQjtBQUMxQztBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLG9FQUFrQjtBQUNyQztBQUNBLG9GQUFvRixRQUFRO0FBQzVGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsdUVBQXFCLEVBQUUsd0VBQXNCLEVBQUUsd0VBQXNCLEVBQUUsd0VBQXNCLEVBQUUscUVBQW1CLEVBQUUsdUVBQXFCLEVBQUUsdUVBQXFCLEVBQUUseUVBQXVCLEVBQUUsNkVBQTJCLEVBQUUsMkVBQXlCLEVBQUUsMEVBQXdCLEVBQUUsd0VBQXNCOztBQUU3VDtBQUNBLHFCQUFxQix3RUFBc0IseUdBQXlHLHNFQUFvQjtBQUN4SyxtQkFBbUIsb0VBQWtCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxzRUFBb0I7QUFDbkMsZUFBZSxzRUFBb0I7QUFDbkMsb0JBQW9CLHFFQUFtQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsb0JBQW9CLG1FQUFpQjs7QUFFckMsb0JBQW9CLGtDQUFrQzs7QUFFdEQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsbUVBQWlCOztBQUVyQztBQUNBLG9CQUFvQix3QkFBd0I7QUFDNUMsdUJBQXVCLHdFQUFzQix5REFBeUQsc0VBQW9CO0FBQzFILHFCQUFxQix3RUFBc0IsaUdBQWlHLHNFQUFvQjtBQUNoSyxtQkFBbUIsa0VBQWdCO0FBQ25DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG1CQUFtQixvRUFBa0I7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLG1FQUFpQjs7QUFFckM7QUFDQSx1QkFBdUIsd0VBQXNCLDZDQUE2QyxzRUFBb0I7QUFDOUcscUJBQXFCLHdFQUFzQiwyREFBMkQsc0VBQW9CO0FBQzFILGlCQUFpQixrRUFBZ0I7QUFDakM7QUFDQTtBQUNBOztBQUVBLHNCQUFzQix3RUFBc0IsMkRBQTJELHNFQUFvQjtBQUMzSCxpQkFBaUIsb0VBQWtCO0FBQ25DO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU8sV0FBVyxpQ0FBaUM7QUFDaEU7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixtRUFBaUI7QUFDckMsc0JBQXNCLDJGQUF5QztBQUMvRDtBQUNBLHdCQUF3Qix3REFBSztBQUM3Qiw0QkFBNEIsd0VBQXNCLHdGQUF3RixzRUFBb0I7QUFDOUosNkJBQTZCLHdFQUFzQiw2Q0FBNkMsc0VBQW9COztBQUVwSDtBQUNBLG1DQUFtQyx3RUFBc0IseURBQXlELHNFQUFvQjtBQUN0SSx3QkFBd0Isa0VBQWdCO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQ0FBcUMsd0VBQXNCLDZDQUE2QyxzRUFBb0I7QUFDNUgsMEJBQTBCLGtFQUFnQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU8sVUFBVSxrQkFBa0I7QUFDaEQ7QUFDQTtBQUNBLG9CQUFvQixtRUFBaUI7O0FBRXJDOztBQUVBLG9CQUFvQixrQkFBa0I7QUFDdEMsdUJBQXVCLHdFQUFzQix5REFBeUQsc0VBQW9CO0FBQzFILHFCQUFxQix3RUFBc0IseURBQXlELHNFQUFvQjtBQUN4SCxtQkFBbUIsa0VBQWdCO0FBQ25DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0ZBQXdGLCtEQUFhO0FBQ3JHO0FBQ0Esc0JBQXNCLHdFQUFzQiwyQ0FBMkMsc0VBQW9CO0FBQzNHLG1CQUFtQixvRUFBa0IsSUFBSSxJQUFJO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsbUVBQWlCOztBQUVyQyx3QkFBd0Isb0VBQWtCO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQSx3QkFBd0Isb0VBQWtCO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQSx5QkFBeUIsb0VBQWtCO0FBQzNDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUtDOzs7Ozs7Ozs7Ozs7Ozs7OztBQy9WMkM7QUFDZDs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSwyQkFBMkIsaURBQUs7O0FBRWhDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhLFFBQVE7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBLGlCQUFpQixtRUFBaUI7QUFDbEMscUNBQXFDLCtCQUErQixHQUFHLDBCQUEwQjtBQUNqRztBQUNBOztBQUVBOztBQUVBOztBQUtDOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0MyQzs7QUFFNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixZQUFZLFFBQVE7QUFDcEI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLG9CQUFvQixtRUFBaUI7QUFDckMsbUJBQW1CLG9FQUFrQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0RWtEO0FBQ047QUFDSTtBQUNGOztBQUUvQyxpQ0FBaUMsRUFBRSxtREFBUSxFQUFFLGdEQUFLLEVBQUUsa0RBQU8sRUFBRSxpREFBTTs7QUFLbEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZEO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEpQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7QUN0QlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeERzRDtBQUNqQjtBQUNOO0FBQ1c7QUFDSTs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EseUNBQXlDOztBQUV6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFDQUFxQyxFQUFFLG9FQUFlO0FBQ3REO0FBQ0EsS0FBSztBQUNMLHdCQUF3QixzRUFBb0I7QUFDNUM7O0FBRUEsc0JBQXNCLDZEQUFVO0FBQ2hDLHdCQUF3QiwrREFBWTs7QUFFcEM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7OztBQzlFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEI7QUFDQSxjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEI7QUFDQSxjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDJCQUEyQjtBQUMzQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLHlCQUF5QjtBQUN6QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQix5QkFBeUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQix5QkFBeUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsNEJBQTRCO0FBQzVCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0QkFBNEI7QUFDNUIsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0JBQStCO0FBQy9CLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCO0FBQzVCLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6QjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQix5QkFBeUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QiwwQkFBMEI7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QiwwQkFBMEI7QUFDMUI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnQ0FBZ0M7QUFDaEMsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEI7QUFDOUIsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEI7QUFDOUIsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUtDOzs7Ozs7Ozs7Ozs7Ozs7QUNucENEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGFBQWEsR0FBRyxVQUFVO0FBQ3JEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYyxRQUFRLEdBQUc7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGFBQWEsT0FBTyxXQUFXLHNCQUFzQixHQUFHLHNCQUFzQjtBQUM5RSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYyxRQUFRLEdBQUc7QUFDekI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSwyQ0FBMkMsUUFBUTtBQUNuRDtBQUNBO0FBQ0E7O0FBRUEsd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUssSUFBSTtBQUNUO0FBQ0E7O0FBS0M7Ozs7Ozs7VUMxSUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTjZDO0FBQ0g7QUFDTjtBQUNXO0FBQ0k7O0FBRW9CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL0NoYXJ0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9jaGFydHMvUmFkaXhDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1RyYW5zaXRDaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvcG9pbnRzL1BvaW50LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Db2xvcnMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9SYWRpeC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1RyYW5zaXQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdW5pdmVyc2UvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL1NWR1V0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9VdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYXN0cm9sb2d5XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiBhYnN0cmFjdCBjbGFzcyBmb3IgYWxsIHR5cGUgb2YgQ2hhcnRcbiAqIEBwdWJsaWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBhYnN0cmFjdFxuICovXG5jbGFzcyBDaGFydCB7XG5cbiAgLy8jc2V0dGluZ3NcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgIC8vdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBkYXRhIGlzIHZhbGlkXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIHVuZGVmaW5lZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHtpc1ZhbGlkOmJvb2xlYW4sIG1lc3NhZ2U6U3RyaW5nfVxuICAgKi9cbiAgdmFsaWRhdGVEYXRhKGRhdGEpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc2luZyBwYXJhbSBkYXRhLlwiKVxuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLnBvaW50cykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcInBvaW50cyBpcyBub3QgQXJyYXkuXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5jdXNwcykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcImN1cHMgaXMgbm90IEFycmF5LlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY3VzcHMubGVuZ3RoICE9PSAxMikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwiY3VzcHMubGVuZ3RoICE9PSAxMlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgcG9pbnQgb2YgZGF0YS5wb2ludHMpIHtcbiAgICAgIGlmICh0eXBlb2YgcG9pbnQubmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50Lm5hbWUgIT09ICdzdHJpbmcnXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBvaW50Lm5hbWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lLmxlbmd0aCA9PSAwXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBwb2ludC5wb3NpdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50LnBvc2l0aW9uICE9PSAnbnVtYmVyJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBjdXNwIG9mIGRhdGEuY3VzcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgY3VzcC5wb3NpdGlvbiAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImN1c3AucG9zaXRpb24gIT09ICdudW1iZXInXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgICAgbWVzc2FnZTogXCJcIlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHNldERhdGEoZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnRzKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnQobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0QXNwZWN0cygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGFuaW1hdGVUbyhkYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvLyAjIyBQUk9URUNURUQgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbn1cblxuZXhwb3J0IHtcbiAgQ2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgQ2hhcnQgZnJvbSAnLi9DaGFydC5qcydcbmltcG9ydCBQb2ludCBmcm9tICcuLi9wb2ludHMvUG9pbnQuanMnXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBvaW50cyBhbmQgY3VwcyBhcmUgZGlzcGxheWVkIGluc2lkZSB0aGUgVW5pdmVyc2UuXG4gKiBAcHVibGljXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XG4gKi9cbmNsYXNzIFJhZGl4Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XG5cbiAgLypcbiAgICogSW5uZXIgY2lyY2xlIHJhZGl1cyByYXRpb1xuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgOFxuICAgKi9cbiAgc3RhdGljIElOTkVSX0NJUkNMRV9SQURJVVNfUkFUSU8gPSA4O1xuXG4gIC8qXG4gICAqIE91dGVyIGNpcmNsZSByYWRpdXMgcmF0aW9cbiAgICogQGNvbnN0YW50XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDJcbiAgICovXG4gIHN0YXRpYyBPVVRFUl9DSVJDTEVfUkFESVVTX1JBVElPID0gMjtcblxuXG4gIC8qXG4gICAqIFRoZSBsZW5ndGggb2YgdGhlIHBvaW50ZXJzIGluIHRoZSBydWxlclxuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMTBcbiAgICovXG4gIHN0YXRpYyBSVUxFUl9MRU5HVEggPSAxMFxuXG4gICNzZXR0aW5nc1xuICAjcm9vdFxuXG4gIC8qXG4gICAqIFNoaWZ0IHRoZSBBc2NlbmRhbnQgdG8gdGhlIDAgZGVncmVlIG9uIFRoZSBDaGFydFxuICAgKi9cbiAgI2Fuc2NlbmRhbnRTaGlmdFxuICAjY2VudGVyWFxuICAjY2VudGVyWVxuICAjcmFkaXVzXG4gICNpbm5lckNpcmNsZVJhZGl1c1xuICAjY2VudGVyQ2lyY2xlUmFkaXVzXG4gICNydWxsZXJDaXJjbGVSYWRpdXNcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtTVkdEb2N1bWVudH0gU1ZHRG9jdW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihTVkdEb2N1bWVudCwgc2V0dGluZ3MpIHtcblxuICAgIGlmICghU1ZHRG9jdW1lbnQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBTVkdEb2N1bWVudC4nKVxuICAgIH1cblxuICAgIGlmICghc2V0dGluZ3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHNldHRpbmdzLicpXG4gICAgfVxuXG4gICAgc3VwZXIoc2V0dGluZ3MpXG5cbiAgICB0aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuICAgIHRoaXMuI2lubmVyQ2lyY2xlUmFkaXVzID0gdGhpcy4jcmFkaXVzIC0gdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPXG4gICAgdGhpcy4jY2VudGVyQ2lyY2xlUmFkaXVzID0gdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5PVVRFUl9DSVJDTEVfUkFESVVTX1JBVElPXG4gICAgdGhpcy4jcnVsbGVyQ2lyY2xlUmFkaXVzID0gdGhpcy4jcmFkaXVzIC0gKHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTyArIFJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RIKVxuXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH1gKVxuICAgIFNWR0RvY3VtZW50LmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2VzKVxuICAgIH1cblxuICAgIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCA9IChkYXRhLmN1c3BzWzBdLnBvc2l0aW9uICsgVXRpbHMuREVHXzE4MClcbiAgICB0aGlzLiNkcmF3KGRhdGEpXG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qXG4gICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gICNkcmF3KGRhdGEpIHtcbiAgICB0aGlzLiNkcmF3QmFja2dyb3VuZCgpXG4gICAgdGhpcy4jZHJhd0FzdHJvbG9naWNhbFNpZ25zKClcbiAgICB0aGlzLiNkcmF3UnVsZXIoKVxuICAgIHRoaXMuI2RyYXdNYWluQXhpcyhbe1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfQVMsXG4gICAgICAgIHBvc2l0aW9uOiBkYXRhLmN1c3BzWzBdLnBvc2l0aW9uXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfSUMsXG4gICAgICAgIHBvc2l0aW9uOiBkYXRhLmN1c3BzWzNdLnBvc2l0aW9uXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfRFMsXG4gICAgICAgIHBvc2l0aW9uOiBkYXRhLmN1c3BzWzZdLnBvc2l0aW9uXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfTUMsXG4gICAgICAgIHBvc2l0aW9uOiBkYXRhLmN1c3BzWzldLnBvc2l0aW9uXG4gICAgICB9LFxuICAgIF0pXG4gICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhLnBvaW50cylcbiAgICB0aGlzLiNkcmF3Q3VzcHMoZGF0YS5jdXNwcylcbiAgICB0aGlzLiNkcmF3Qm9yZGVycygpXG4gIH1cblxuICAjZHJhd0JhY2tncm91bmQoKSB7XG4gICAgY29uc3QgTUFTS19JRCA9IGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH0tYmFja2dyb3VuZC1tYXNrLTFgXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgbWFzayA9IFNWR1V0aWxzLlNWR01hc2soTUFTS19JRClcbiAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMpXG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgXCJ3aGl0ZVwiKVxuICAgIG1hc2suYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpXG5cbiAgICBjb25zdCBpbm5lckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNjZW50ZXJDaXJjbGVSYWRpdXMpXG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgXCJibGFja1wiKVxuICAgIG1hc2suYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChtYXNrKVxuXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cylcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQkFDS0dST1VORF9DT0xPUik7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcIm1hc2tcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IGB1cmwoIyR7TUFTS19JRH0pYCk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpXG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd0FzdHJvbG9naWNhbFNpZ25zKCkge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9BU1RST0xPR0lDQUxfU0lHTlMgPSAxMlxuICAgIGNvbnN0IFNURVAgPSAzMCAvL2RlZ3JlZVxuICAgIGNvbnN0IENPTE9SU19TSUdOUyA9IFt0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUklFUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVEFVUlVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9HRU1JTkksIHRoaXMuI3NldHRpbmdzLkNPTE9SX0NBTkNFUiwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfTEVPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9WSVJHTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfTElCUkEsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1NDT1JQSU8sIHRoaXMuI3NldHRpbmdzLkNPTE9SX1NBR0lUVEFSSVVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQVBSSUNPUk4sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0FRVUFSSVVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9QSVNDRVNdXG4gICAgY29uc3QgU1lNQk9MX1NJR05TID0gW1NWR1V0aWxzLlNZTUJPTF9BUklFUywgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVUywgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSSwgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUiwgU1ZHVXRpbHMuU1lNQk9MX0xFTywgU1ZHVXRpbHMuU1lNQk9MX1ZJUkdPLCBTVkdVdGlscy5TWU1CT0xfTElCUkEsIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPLCBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVMsIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk4sIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVUywgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFU11cblxuICAgIGNvbnN0IG1ha2VTeW1ib2wgPSAoc3ltYm9sSW5kZXgsIGFuZ2xlSW5EZWdyZWUpID0+IHtcbiAgICAgIGxldCBwb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzIC0gKHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTykgLyAyLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZUluRGVncmVlICsgU1RFUCAvIDIsIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBsZXQgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKFNZTUJPTF9TSUdOU1tzeW1ib2xJbmRleF0sIHBvc2l0aW9uLngsIHBvc2l0aW9uLnksIHRoaXMuI3NldHRpbmdzLlJBRElYX1NJR05TX1NDQUxFKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TSUdOU19DT0xPUik7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICByZXR1cm4gc3ltYm9sXG4gICAgfVxuXG4gICAgY29uc3QgbWFrZVNlZ21lbnQgPSAoc3ltYm9sSW5kZXgsIGFuZ2xlRnJvbUluRGVncmVlLCBhbmdsZVRvSW5EZWdyZWUpID0+IHtcbiAgICAgIGxldCBhMSA9IFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlRnJvbUluRGVncmVlLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpXG4gICAgICBsZXQgYTIgPSBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZVRvSW5EZWdyZWUsIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdClcbiAgICAgIGxldCBzZWdtZW50ID0gU1ZHVXRpbHMuU1ZHU2VnbWVudCh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMsIGExLCBhMiwgdGhpcy4jaW5uZXJDaXJjbGVSYWRpdXMpO1xuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBDT0xPUlNfU0lHTlNbc3ltYm9sSW5kZXhdKTtcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0lSQ0xFX0NPTE9SIDogXCJub25lXCIpO1xuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgOiAwKTtcbiAgICAgIHJldHVybiBzZWdtZW50XG4gICAgfVxuXG4gICAgbGV0IHN0YXJ0QW5nbGUgPSAwXG4gICAgbGV0IGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTUJFUl9PRl9BU1RST0xPR0lDQUxfU0lHTlM7IGkrKykge1xuXG4gICAgICBsZXQgc2VnbWVudCA9IG1ha2VTZWdtZW50KGksIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzZWdtZW50KTtcblxuICAgICAgbGV0IHN5bWJvbCA9IG1ha2VTeW1ib2woaSwgc3RhcnRBbmdsZSlcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgc3RhcnRBbmdsZSArPSBTVEVQO1xuICAgICAgZW5kQW5nbGUgPSBzdGFydEFuZ2xlICsgU1RFUFxuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNkcmF3UnVsZXIoKSB7XG4gICAgY29uc3QgTlVNQkVSX09GX0RJVklERVJTID0gNzJcbiAgICBjb25zdCBTVEVQID0gNVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGxldCBzdGFydEFuZ2xlID0gdGhpcy4jYW5zY2VuZGFudFNoaWZ0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfRElWSURFUlM7IGkrKykge1xuICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3J1bGxlckNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXG4gICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3J1bGxlckNpcmNsZVJhZGl1cyArIFJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RIIC8gKGkgJSAyICsgMSksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgc3RhcnRBbmdsZSArPSBTVEVQXG4gICAgfVxuXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3J1bGxlckNpcmNsZVJhZGl1cyk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSk7XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IG1haW4gYXhpc1xuICAgKiBAcGFyYW0ge0FycmF5fSBheGlzTGlzdFxuICAgKi9cbiAgI2RyYXdNYWluQXhpcyhheGlzTGlzdCkge1xuICAgIGNvbnN0IEFYSVNfTEVOR1RIID0gMTBcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBmb3IgKGNvbnN0IGF4aXMgb2YgYXhpc0xpc3QpIHtcbiAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMucG9zaXRpb24sIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cyArIEFYSVNfTEVOR1RILCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLnBvc2l0aW9uLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgbGV0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgbGV0IHRleHRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzICsgQVhJU19MRU5HVEgsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMucG9zaXRpb24sIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBsZXQgcGF0aCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54LCB0ZXh0UG9pbnQueSwge1xuICAgICAgICAuLi50aGlzLiNzZXR0aW5nc1xuICAgICAgfSlcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1RFWFRfQ09MT1IpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKTtcblxuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgcG9pbnRzXG4gICAqIEBwYXJhbSB7QXJyYXl9IHBvaW50cyAtIFt7XCJuYW1lXCI6U3RyaW5nLCBcInBvc2l0aW9uXCI6TnVtYmVyfV1cbiAgICovXG4gICNkcmF3UG9pbnRzKHBvaW50cykge1xuICAgIGNvbnN0IFBPSU5UX1JBRElVUyA9IHRoaXMuI2lubmVyQ2lyY2xlUmFkaXVzIC0gKDQgKiBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSClcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgY29uc3QgcG9zaXRpb25zID0gVXRpbHMuY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBQT0lOVF9SQURJVVMpXG4gICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XG4gICAgICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChwb2ludERhdGEpXG4gICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNpbm5lckNpcmNsZVJhZGl1cyAtIDEuNSAqIFJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RILCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRQb3NpdGlvbigpLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgY29uc3Qgc3ltYm9sUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIFBPSU5UX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG5cbiAgICAgIC8vIHJ1bGVyIG1hcmtcbiAgICAgIGNvbnN0IHJ1bGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNydWxsZXJDaXJjbGVSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldFBvc2l0aW9uKCksIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBjb25zdCBydWxlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCBydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55KVxuICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocnVsZXJMaW5lKTtcblxuICAgICAgLy8gc3ltYm9sXG4gICAgICBjb25zdCBzeW1ib2wgPSBwb2ludC5nZXRTeW1ib2woc3ltYm9sUG9zaXRpb24ueCwgc3ltYm9sUG9zaXRpb24ueSwgdGhpcy4jc2V0dGluZ3MuUkFESVhfUE9JTlRTX1NDQUxFKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QT0lOVFNfQ09MT1IpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgIC8vIHBvaW50ZXJcbiAgICAgIC8vaWYgKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldICE9IHBvaW50RGF0YS5wb3NpdGlvbikge1xuICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgUE9JTlRfUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGNvbnN0IHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgKHBvaW50UG9zaXRpb24ueCArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueCkgLyAyLCAocG9pbnRQb3NpdGlvbi55ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi55KSAvIDIpXG4gICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIC8gMik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBvaW50ZXJMaW5lKTtcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IHBvaW50c1xuICAgKiBAcGFyYW0ge0FycmF5fSBjdXNwcyAtIFt7XCJwb3NpdGlvblwiOk51bWJlcn1dXG4gICAqL1xuICAjZHJhd0N1c3BzKGN1c3BzKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHRleHRSYWRpdXMgPSB0aGlzLiNyYWRpdXMgLyBSYWRpeENoYXJ0Lk9VVEVSX0NJUkNMRV9SQURJVVNfUkFUSU8gKyAyKiBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSFxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXNwcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2NlbnRlckNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0ucG9zaXRpb24sIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3J1bGxlckNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0ucG9zaXRpb24sIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvcy54LCBzdGFydFBvcy55LCBlbmRQb3MueCwgZW5kUG9zLnkpXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKVxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgY29uc3Qgc3RhcnRDdXNwID0gY3VzcHNbaV0ucG9zaXRpb25cbiAgICAgIGNvbnN0IGVuZEN1c3AgPSBjdXNwc1soaSArIDEpICUgMTJdLnBvc2l0aW9uXG4gICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxuICAgICAgY29uc3QgdGV4dEFuZ2xlID0gc3RhcnRDdXNwICsgZ2FwIC8gMlxuICAgICAgY29uc3QgdGV4dFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGV4dFJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4odGV4dEFuZ2xlLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgY29uc3QgdGV4dCA9IFNWR1V0aWxzLlNWR1N5bWJvbChgJHtpKzF9YCwgdGV4dFBvcy54LCB0ZXh0UG9zLnkpXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9URVhUX0NPTE9SKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0ZXh0KVxuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNkcmF3Qm9yZGVycygpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgaW5uZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jaW5uZXJDaXJjbGVSYWRpdXMpXG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGlubmVyQ2lyY2xlKVxuXG4gICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzKVxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgIGNvbnN0IGNlbnRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNjZW50ZXJDaXJjbGVSYWRpdXMpXG4gICAgY2VudGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2VudGVyQ2lyY2xlKVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbn1cblxuZXhwb3J0IHtcbiAgUmFkaXhDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBvaW50cyBhbmQgY3VwcyBhcmUgZGlzcGxheWVkIGZyb20gb3V0c2lkZSB0aGUgVW5pdmVyc2UuXG4gKiBAcHVibGljXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XG4gKi9cbmNsYXNzIFRyYW5zaXRDaGFydCBleHRlbmRzIENoYXJ0IHtcblxuICAjc2V0dGluZ3NcbiAgI3Jvb3RcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtTVkdEb2N1bWVudH0gU1ZHRG9jdW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihTVkdEb2N1bWVudCwgc2V0dGluZ3MpIHtcblxuICAgIGlmICghU1ZHRG9jdW1lbnQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBTVkdEb2N1bWVudC4nKVxuICAgIH1cblxuICAgIGlmICghc2V0dGluZ3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHNldHRpbmdzLicpXG4gICAgfVxuXG4gICAgc3VwZXIoc2V0dGluZ3MpXG5cblxuICAgIHRoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLiNyb290ID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgIHRoaXMuI3Jvb3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlRSQU5TSVRfSUR9YClcbiAgICBTVkdEb2N1bWVudC5hcHBlbmRDaGlsZCh0aGlzLiNyb290KTtcbiAgfVxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbn1cblxuZXhwb3J0IHtcbiAgVHJhbnNpdENoYXJ0IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFJlcHJlc2VudHMgYSBwbGFuZXQgb3IgcG9pbnQgb2YgaW50ZXJlc3QgaW4gdGhlIGNoYXJ0XG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFBvaW50IHtcblxuICAjbmFtZVxuICAjcG9zaXRpb25cbiAgI2lzUmV0cm9ncmFkZVxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgY29uc3RydWN0b3IoIGRhdGEgKSB7XG4gICAgdGhpcy4jbmFtZSA9IGRhdGEubmFtZSA/PyBcIlVua25vd25cIlxuICAgIHRoaXMuI3Bvc2l0aW9uID0gZGF0YS5wb3NpdGlvbiA/PyAwXG4gICAgdGhpcy4jaXNSZXRyb2dyYWRlID0gZGF0YS5pc1JldHJvZ3JhZGUgPz8gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAqIEdldCBuYW1lXG4gICpcbiAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICovXG4gIGdldE5hbWUoKXtcbiAgICByZXR1cm4gdGhpcy4jbmFtZVxuICB9XG5cbiAgLyoqXG4gICogSXMgcmV0cm9ncmFkZVxuICAqXG4gICogQHJldHVybiB7Qm9vbGVhbn1cbiAgKi9cbiAgaXNSZXRyb2dyYWRlKCl7XG4gICAgcmV0dXJuIHRoaXMuI2lzUmV0cm9ncmFkZVxuICB9XG5cbiAgLyoqXG4gICogR2V0IHBvc2l0aW9uXG4gICpcbiAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICovXG4gIGdldFBvc2l0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXMuI3Bvc2l0aW9uXG4gIH1cblxuICAvKipcbiAgKiBHZXQgc3ltYm9sXG4gICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcbiAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xuICAqIEBwYXJhbSB7TnVtYmVyfSBbc2NhbGVdXG4gICpcbiAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxuICAqL1xuICBnZXRTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpe1xuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgY29uc3Qgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKHRoaXMuI25hbWUsIHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKVxuICAgIHJldHVybiB3cmFwcGVyXG4gIH1cblxufVxuXG5leHBvcnQge1xuICBQb2ludCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgKiBhcyBVbml2ZXJzZSBmcm9tIFwiLi9jb25zdGFudHMvVW5pdmVyc2UuanNcIlxuaW1wb3J0ICogYXMgUmFkaXggZnJvbSBcIi4vY29uc3RhbnRzL1JhZGl4LmpzXCJcbmltcG9ydCAqIGFzIFRyYW5zaXQgZnJvbSBcIi4vY29uc3RhbnRzL1RyYW5zaXQuanNcIlxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gXCIuL2NvbnN0YW50cy9Db2xvcnMuanNcIlxuXG5jb25zdCBTRVRUSU5HUyA9IE9iamVjdC5hc3NpZ24oe30sIFVuaXZlcnNlLCBSYWRpeCwgVHJhbnNpdCwgQ29sb3JzKTtcblxuZXhwb3J0IHtcbiAgU0VUVElOR1MgYXNcbiAgZGVmYXVsdFxufVxuIiwiLyoqXG4qIENoYXJ0IGJhY2tncm91bmQgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNmZmZcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfQkFDS0dST1VORF9DT0xPUiA9IFwiI2ZmZlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0NJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGxpbmVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9MSU5FX0NPTE9SID0gXCIjNjY2XCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgdGV4dCBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVEVYVF9DT0xPUiA9IFwiIzY2NlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHNpZ25zIGluIGNoYXJ0cyAoYXJpc2Ugc3ltYm9sLCB0YXVydXMgc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NJR05TX0NPTE9SID0gXCIjMDAwXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2Ygc2lnbnMgaW4gY2hhcnRzIChhcmlzZSBzeW1ib2wsIHRhdXJ1cyBzeW1ib2wsIC4uLilcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMwMDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfUE9JTlRTX0NPTE9SID0gXCIjMDAwXCI7XG5cbi8qXG4qIEFyaWVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0FSSUVTID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIFRhdXJ1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9UQVVSVVMgPSBcIiM4QjQ1MTNcIjtcblxuLypcbiogR2VtaW55IGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0dFTUlOST0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIENhbmNlciBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9DQU5DRVIgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogTGVvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xFTyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBWaXJnbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9WSVJHTyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBMaWJyYSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9MSUJSQSA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBTY29ycGlvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1NDT1JQSU8gPSBcIiMyN0FFNjBcIjtcblxuLypcbiogU2FnaXR0YXJpdXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0FHSVRUQVJJVVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogQ2Fwcmljb3JuIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBUFJJQ09STiA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBBcXVhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUVVBUklVUyA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBQaXNjZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfUElTQ0VTID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIENvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuIiwiLypcbiogUmFkaXggY2hhcnQgZWxlbWVudCBJRFxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgcmFkaXhcbiovXG5leHBvcnQgY29uc3QgUkFESVhfSUQgPSBcInJhZGl4XCJcblxuLypcbiogU2NhbGUgcG9pbnRzIHJhdGlvXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX1BPSU5UU19TQ0FMRSA9IDFcblxuLypcbiogU2NhbGUgc2lnbnMgcmF0aW9cbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDFcbiovXG5leHBvcnQgY29uc3QgUkFESVhfU0lHTlNfU0NBTEUgPSAxXG4iLCIvKlxuKiBUcmFuc2l0IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHRyYW5zaXRcbiovXG5leHBvcnQgY29uc3QgVFJBTlNJVF9JRCA9IFwidHJhbnNpdFwiXG4iLCIvKipcbiogQ2hhcnQgcGFkZGluZ1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMTBweFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QQURESU5HID0gNDBcblxuLyoqXG4qIFNWRyB2aWV3Qm94IHdpZHRoXG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9XSURUSCA9IDgwMFxuXG4vKipcbiogU1ZHIHZpZXdCb3ggaGVpZ2h0XG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9IRUlHSFQgPSA4MDBcblxuLyoqXG4qIEEgcG9pbnQgY29sbGlzaW9uIHJhZGl1c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMlxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QT0lOVF9DT0xMSVNJT05fUkFESVVTID0gMTJcblxuLypcbiogTGluZSBzdHJlbmd0aFxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0UgPSAxXG5cbi8qXG4qIExpbmUgc3RyZW5ndGggb2YgdGhlIG1haW4gbGluZXMuIEZvciBpbnN0YW5jZSBwb2ludHMsIG1haW4gYXhpcywgbWFpbiBjaXJjbGVzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX01BSU5fU1RST0tFID0gMlxuXG4vKipcbiogTm8gZmlsbCwgb25seSBzdHJva2VcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtib29sZWFufVxuKiBAZGVmYXVsdCBmYWxzZVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfT05MWSA9IGZhbHNlO1xuIiwiaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XG5pbXBvcnQgVHJhbnNpdENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiB3cmFwcGVyIGZvciBhbGwgcGFydHMgb2YgZ3JhcGguXG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFVuaXZlcnNlIHtcblxuICAjU1ZHRG9jdW1lbnRcbiAgI3NldHRpbmdzXG4gICNyYWRpeFxuICAjdHJhbnNpdFxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbEVsZW1lbnRJRCAtIElEIG9mIHRoZSByb290IGVsZW1lbnQgd2l0aG91dCB0aGUgIyBzaWduXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBBbiBvYmplY3QgdGhhdCBvdmVycmlkZXMgdGhlIGRlZmF1bHQgc2V0dGluZ3MgdmFsdWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihodG1sRWxlbWVudElELCBvcHRpb25zID0ge30pIHtcblxuICAgIGlmICh0eXBlb2YgaHRtbEVsZW1lbnRJRCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSByZXF1aXJlZCBwYXJhbWV0ZXIgaXMgbWlzc2luZy4nKVxuICAgIH1cblxuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEVsZW1lbnRJRCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fub3QgZmluZCBhIEhUTUwgZWxlbWVudCB3aXRoIElEICcgKyBodG1sRWxlbWVudElEKVxuICAgIH1cblxuICAgIHRoaXMuI3NldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdFNldHRpbmdzLCBvcHRpb25zLCB7XG4gICAgICBIVE1MX0VMRU1FTlRfSUQ6IGh0bWxFbGVtZW50SURcbiAgICB9KTtcbiAgICB0aGlzLiNTVkdEb2N1bWVudCA9IFNWR1V0aWxzLlNWR0RvY3VtZW50KHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEgsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpLmFwcGVuZENoaWxkKHRoaXMuI1NWR0RvY3VtZW50KTtcblxuICAgIHRoaXMuI3JhZGl4ID0gbmV3IFJhZGl4Q2hhcnQodGhpcy4jU1ZHRG9jdW1lbnQsIHRoaXMuI3NldHRpbmdzKVxuICAgIHRoaXMuI3RyYW5zaXQgPSBuZXcgVHJhbnNpdENoYXJ0KHRoaXMuI1NWR0RvY3VtZW50LCB0aGlzLiNzZXR0aW5ncylcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyAjIyBQVUJMSUMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLyoqXG4gICAqIEdldCBSYWRpeCBjaGFydFxuICAgKiBAcmV0dXJuIHtSYWRpeENoYXJ0fVxuICAgKi9cbiAgcmFkaXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JhZGl4XG4gIH1cblxuICAvKipcbiAgICogR2V0IFRyYW5zaXQgY2hhcnRcbiAgICogQHJldHVybiB7VHJhbnNpdENoYXJ0fVxuICAgKi9cbiAgdHJhbnNpdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHJhbnNpdFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBjdXJyZW50IHNldHRpbmdzXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldFNldHRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLiNzZXR0aW5nc1xuICB9XG4gIFxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG59XG5cbmV4cG9ydCB7XG4gIFVuaXZlcnNlIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFNWRyB1dGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFNWR1V0aWxzIHtcblxuICBzdGF0aWMgU1ZHX05BTUVTUEFDRSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuXG4gIHN0YXRpYyBTWU1CT0xfQVJJRVMgPSBcIkFyaWVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfVEFVUlVTID0gXCJUYXVydXNcIjtcbiAgc3RhdGljIFNZTUJPTF9HRU1JTkkgPSBcIkdlbWluaVwiO1xuICBzdGF0aWMgU1lNQk9MX0NBTkNFUiA9IFwiQ2FuY2VyXCI7XG4gIHN0YXRpYyBTWU1CT0xfTEVPID0gXCJMZW9cIjtcbiAgc3RhdGljIFNZTUJPTF9WSVJHTyA9IFwiVmlyZ29cIjtcbiAgc3RhdGljIFNZTUJPTF9MSUJSQSA9IFwiTGlicmFcIjtcbiAgc3RhdGljIFNZTUJPTF9TQ09SUElPID0gXCJTY29ycGlvXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0FHSVRUQVJJVVMgPSBcIlNhZ2l0dGFyaXVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOID0gXCJDYXByaWNvcm5cIjtcbiAgc3RhdGljIFNZTUJPTF9BUVVBUklVUyA9IFwiQXF1YXJpdXNcIjtcbiAgc3RhdGljIFNZTUJPTF9QSVNDRVMgPSBcIlBpc2Nlc1wiO1xuXG4gIHN0YXRpYyBTWU1CT0xfTlVNQkVSXzEgPSBcIjFcIjtcbiAgc3RhdGljIFNZTUJPTF9OVU1CRVJfMiA9IFwiMlwiO1xuICBzdGF0aWMgU1lNQk9MX05VTUJFUl8zID0gXCIzXCI7XG4gIHN0YXRpYyBTWU1CT0xfTlVNQkVSXzQgPSBcIjRcIjtcbiAgc3RhdGljIFNZTUJPTF9OVU1CRVJfNSA9IFwiNVwiO1xuICBzdGF0aWMgU1lNQk9MX05VTUJFUl82ID0gXCI2XCI7XG4gIHN0YXRpYyBTWU1CT0xfTlVNQkVSXzcgPSBcIjdcIjtcbiAgc3RhdGljIFNZTUJPTF9OVU1CRVJfOCA9IFwiOFwiO1xuICBzdGF0aWMgU1lNQk9MX05VTUJFUl85ID0gXCI5XCI7XG4gIHN0YXRpYyBTWU1CT0xfTlVNQkVSXzEwID0gXCIxMFwiO1xuICBzdGF0aWMgU1lNQk9MX05VTUJFUl8xMSA9IFwiMTFcIjtcbiAgc3RhdGljIFNZTUJPTF9OVU1CRVJfMTIgPSBcIjEyXCI7XG5cbiAgc3RhdGljIFNZTUJPTF9BUyA9IFwiQXNcIjtcbiAgc3RhdGljIFNZTUJPTF9EUyA9IFwiRHNcIjtcbiAgc3RhdGljIFNZTUJPTF9NQyA9IFwiTWNcIjtcbiAgc3RhdGljIFNZTUJPTF9JQyA9IFwiSWNcIjtcblxuICBzdGF0aWMgU1lNQk9MX1NVTiA9IFwiU3VuXCI7XG4gIHN0YXRpYyBTWU1CT0xfTU9PTiA9IFwiTW9vblwiO1xuICBzdGF0aWMgU1lNQk9MX01FUkNVUlkgPSBcIk1lcmN1cnlcIjtcbiAgc3RhdGljIFNZTUJPTF9WRU5VUyA9IFwiVmVudXNcIjtcbiAgc3RhdGljIFNZTUJPTF9NQVJTID0gXCJNYXJzXCI7XG4gIHN0YXRpYyBTWU1CT0xfSlVQSVRFUiA9IFwiSnVwaXRlclwiO1xuICBzdGF0aWMgU1lNQk9MX1NBVFVSTiA9IFwiU2F0dXJuXCI7XG4gIHN0YXRpYyBTWU1CT0xfVVJBTlVTID0gXCJVcmFudXNcIjtcbiAgc3RhdGljIFNZTUJPTF9ORVBUVU5FID0gXCJOZXB0dW5lXCI7XG4gIHN0YXRpYyBTWU1CT0xfUExVVE8gPSBcIlBsdXRvXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0hJUk9OID0gXCJDaGlyb25cIjtcbiAgc3RhdGljIFNZTUJPTF9MSUxJVEggPSBcIkxpbGl0aFwiO1xuICBzdGF0aWMgU1lNQk9MX05OT0RFID0gXCJOTm9kZVwiO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgU1ZHVXRpbHMpIHtcbiAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgZG9jdW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdEb2N1bWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdEb2N1bWVudCh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwic3ZnXCIpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmVyc2lvbicsIFwiMS4xXCIpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBcIjAgMCBcIiArIHdpZHRoICsgXCIgXCIgKyBoZWlnaHQpO1xuICAgIHJldHVybiBzdmdcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgZ3JvdXAgZWxlbWVudFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdHcm91cCgpIHtcbiAgICBjb25zdCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiZ1wiKTtcbiAgICByZXR1cm4gZ1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBwYXRoIGVsZW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHUGF0aCgpIHtcbiAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwicGF0aFwiKTtcbiAgICByZXR1cm4gcGF0aFxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBtYXNrIGVsZW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudElEXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR01hc2tFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR01hc2soZWxlbWVudElEKSB7XG4gICAgY29uc3QgbWFzayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcIm1hc2tcIik7XG4gICAgbWFzay5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBlbGVtZW50SUQpXG4gICAgcmV0dXJuIG1hc2tcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgY2lyY3VsYXIgc2VjdG9yXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtpbnR9IHggLSBjaXJjbGUgeCBjZW50ZXIgcG9zaXRpb25cbiAgICogQHBhcmFtIHtpbnR9IHkgLSBjaXJjbGUgeSBjZW50ZXIgcG9zaXRpb25cbiAgICogQHBhcmFtIHtpbnR9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXMgaW4gcHhcbiAgICogQHBhcmFtIHtpbnR9IGExIC0gYW5nbGVGcm9tIGluIHJhZGlhbnNcbiAgICogQHBhcmFtIHtpbnR9IGEyIC0gYW5nbGVUbyBpbiByYWRpYW5zXG4gICAqIEBwYXJhbSB7aW50fSB0aGlja25lc3MgLSBmcm9tIG91dHNpZGUgdG8gY2VudGVyIGluIHB4XG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IHNlZ21lbnRcbiAgICovXG4gIHN0YXRpYyBTVkdTZWdtZW50KHgsIHksIHJhZGl1cywgYTEsIGEyLCB0aGlja25lc3MsIGxGbGFnLCBzRmxhZykge1xuICAgIC8vIEBzZWUgU1ZHIFBhdGggYXJjOiBodHRwczovL3d3dy53My5vcmcvVFIvU1ZHL3BhdGhzLmh0bWwjUGF0aERhdGFcbiAgICBjb25zdCBMQVJHRV9BUkNfRkxBRyA9IGxGbGFnIHx8IDA7XG4gICAgY29uc3QgU1dFRVRfRkxBRyA9IHNGbGFnIHx8IDA7XG5cbiAgICBjb25zdCBzZWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwicGF0aFwiKTtcbiAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImRcIiwgXCJNIFwiICsgKHggKyB0aGlja25lc3MgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKHkgKyB0aGlja25lc3MgKiBNYXRoLnNpbihhMSkpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiBNYXRoLnNpbihhMSkpICsgXCIgQSBcIiArIHJhZGl1cyArIFwiLCBcIiArIHJhZGl1cyArIFwiLDAgLFwiICsgTEFSR0VfQVJDX0ZMQUcgKyBcIiwgXCIgKyBTV0VFVF9GTEFHICsgXCIsIFwiICsgKHggKyByYWRpdXMgKiBNYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKHkgKyByYWRpdXMgKiBNYXRoLnNpbihhMikpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIC1NYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguc2luKGEyKSkgKyBcIiBBIFwiICsgdGhpY2tuZXNzICsgXCIsIFwiICsgdGhpY2tuZXNzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIDEgKyBcIiwgXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkpO1xuICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgcmV0dXJuIHNlZ21lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU1ZHIGNpcmNsZVxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7aW50fSBjeFxuICAgKiBAcGFyYW0ge2ludH0gY3lcbiAgICogQHBhcmFtIHtpbnR9IHJhZGl1c1xuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBjaXJjbGVcbiAgICovXG4gIHN0YXRpYyBTVkdDaXJjbGUoY3gsIGN5LCByYWRpdXMpIHtcbiAgICBjb25zdCBjaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJjaXJjbGVcIik7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN4XCIsIGN4KTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3lcIiwgY3kpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJyXCIsIHJhZGl1cyk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgIHJldHVybiBjaXJjbGU7XG4gIH1cblxuICAvKipcbiAgICogU1ZHIGxpbmVcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MlxuICAgKiBAcGFyYW0ge051bWJlcn0geDJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGxpbmVcbiAgICovXG4gIHN0YXRpYyBTVkdMaW5lKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImxpbmVcIik7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MVwiLCB4MSk7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MVwiLCB5MSk7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MlwiLCB4Mik7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MlwiLCB5Mik7XG4gICAgcmV0dXJuIGxpbmU7XG4gIH1cblxuICAvKipcbiAgICogU1ZHIHN5bWJvbFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge051bWJlcn0geFBvc1xuICAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR1N5bWJvbChuYW1lLCB4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICBzd2l0Y2ggKG5hbWUpIHtcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVM6XG4gICAgICAgIHJldHVybiBhc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0RTOlxuICAgICAgICByZXR1cm4gZHNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQzpcbiAgICAgICAgcmV0dXJuIG1jU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSUM6XG4gICAgICAgIHJldHVybiBpY1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVJJRVM6XG4gICAgICAgIHJldHVybiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVM6XG4gICAgICAgIHJldHVybiB0YXVydXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfR0VNSU5JOlxuICAgICAgICByZXR1cm4gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUjpcbiAgICAgICAgcmV0dXJuIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MRU86XG4gICAgICAgIHJldHVybiBsZW9TeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVklSR086XG4gICAgICAgIHJldHVybiB2aXJnb1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUJSQTpcbiAgICAgICAgcmV0dXJuIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU86XG4gICAgICAgIHJldHVybiBzY29ycGlvU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTOlxuICAgICAgICByZXR1cm4gc2FnaXR0YXJpdXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOOlxuICAgICAgICByZXR1cm4gY2Fwcmljb3JuU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTOlxuICAgICAgICByZXR1cm4gYXF1YXJpdXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUElTQ0VTOlxuICAgICAgICByZXR1cm4gcGlzY2VzU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU1VOOlxuICAgICAgICByZXR1cm4gc3VuU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01PT046XG4gICAgICAgIHJldHVybiBtb29uU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01FUkNVUlk6XG4gICAgICAgIHJldHVybiBtZXJjdXJ5U3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTOlxuICAgICAgICByZXR1cm4gdmVudXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUFSUzpcbiAgICAgICAgcmV0dXJuIG1hcnNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUjpcbiAgICAgICAgcmV0dXJuIGp1cGl0ZXJTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FUVVJOOlxuICAgICAgICByZXR1cm4gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VUzpcbiAgICAgICAgcmV0dXJuIHVyYW51c1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FOlxuICAgICAgICByZXR1cm4gbmVwdHVuZVN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcbiAgICAgICAgcmV0dXJuIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NISVJPTjpcbiAgICAgICAgcmV0dXJuIGNoaXJvblN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUxJVEg6XG4gICAgICAgIHJldHVybiBsaWxpdGhTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTk5PREU6XG4gICAgICAgIHJldHVybiBubm9kZVN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05VTUJFUl8xOlxuICAgICAgICByZXR1cm4gbnVtYmVyMVN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9OVU1CRVJfMjpcbiAgICAgICAgcmV0dXJuIG51bWJlcjJTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTlVNQkVSXzM6XG4gICAgICAgIHJldHVybiBudW1iZXIzU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05VTUJFUl80OlxuICAgICAgICByZXR1cm4gbnVtYmVyNFN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9OVU1CRVJfNTpcbiAgICAgICAgcmV0dXJuIG51bWJlcjVTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTlVNQkVSXzY6XG4gICAgICAgIHJldHVybiBudW1iZXI2U3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05VTUJFUl83OlxuICAgICAgICByZXR1cm4gbnVtYmVyN1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9OVU1CRVJfODpcbiAgICAgICAgcmV0dXJuIG51bWJlcjhTeW1ib2woeFBvcywgeVBvcywgc2NhbGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTlVNQkVSXzk6XG4gICAgICAgIHJldHVybiBudW1iZXI5U3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05VTUJFUl8xMDpcbiAgICAgICAgcmV0dXJuIG51bWJlcjEwU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05VTUJFUl8xMTpcbiAgICAgICAgcmV0dXJuIG51bWJlcjExU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05VTUJFUl8xMjpcbiAgICAgICAgcmV0dXJuIG51bWJlcjEyU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlKVxuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc3QgdW5rbm93blN5bWJvbCA9IFNWR1V0aWxzLlNWR0NpcmNsZSh4UG9zLCB5UG9zLCA4KVxuICAgICAgICByZXR1cm4gdW5rbm93blN5bWJvbFxuICAgIH1cblxuICAgIC8qXG4gICAgICogQXNjZW5kYW50IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtNDsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0yOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTAuNTYzMDc4LC0xLjEyNjE1MjcgLTEuNjg5MjI4LC0wLjU2MzA3NjUgLTEuNjg5MjI5LDAgLTEuNjg5MjMsMC41NjMwNzY1IC0wLjU2MzA3NiwxLjEyNjE1MjcgMC41NjMwNzYsMS4xMjYxNTI3MiAxLjEyNjE1NCwwLjU2MzA3NjM2IDIuODE1MzgxLDAuNTYzMDc2MzUgMS4xMjYxNTIsMC41NjMwNzY0NyAwLjU2MzA3OCwxLjEyNjE1MjYgMCwwLjU2MzA3NjMgLTAuNTYzMDc4LDEuMTI2MTUyOCAtMS42ODkyMjgsMC41NjMwNzY0IC0xLjY4OTIyOSwwIC0xLjY4OTIzLC0wLjU2MzA3NjQgLTAuNTYzMDc2LC0xLjEyNjE1MjggbSAtNi43NTY5MTYsLTEwLjEzNTM3NCAtNC41MDQ2MTEsMTEuODI0NjAzMiBtIDQuNTA0NjExLC0xMS44MjQ2MDMyIDQuNTA0NjExLDExLjgyNDYwMzIgbSAtNy4zMTk5OTI1LC0zLjk0MTUzNDU3IDUuNjMwNzYyNSwwXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBEZXNjZW5kYW50IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAyMjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0xOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTAuNTYyNSwtMS4xMjUgLTEuNjg3NSwtMC41NjI1IC0xLjY4NzUsMCAtMS42ODc1LDAuNTYyNSAtMC41NjI1LDEuMTI1IDAuNTYyNSwxLjEyNSAxLjEyNSwwLjU2MjUgMi44MTI1LDAuNTYyNSAxLjEyNSwwLjU2MjUgMC41NjI1LDEuMTI1IDAsMC41NjI1IC0wLjU2MjUsMS4xMjUgLTEuNjg3NSwwLjU2MjUgLTEuNjg3NSwwIC0xLjY4NzUsLTAuNTYyNSAtMC41NjI1LC0xLjEyNSBtIC0xMS4yNSwtMTAuMTI1IDAsMTEuODEyNSBtIDAsLTExLjgxMjUgMy45Mzc1LDAgMS42ODc1LDAuNTYyNSAxLjEyNSwxLjEyNSAwLjU2MjUsMS4xMjUgMC41NjI1LDEuNjg3NSAwLDIuODEyNSAtMC41NjI1LDEuNjg3NSAtMC41NjI1LDEuMTI1IC0xLjEyNSwxLjEyNSAtMS42ODc1LDAuNTYyNSAtMy45Mzc1LDBcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1lZGl1bSBjb2VsaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtY1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTEuMDA0MDg1LC0xLjAwNDA4NDUgLTEuMDA0MDg0LC0wLjUwMjA0MjMgLTEuNTA2MTI3LDAgLTEuMDA0MDg1LDAuNTAyMDQyMyAtMS4wMDQwODQsMS4wMDQwODQ1IC0wLjUwMjA0MywxLjUwNjEyNjg5IDAsMS4wMDQwODQ1OCAwLjUwMjA0MywxLjUwNjEyNjgzIDEuMDA0MDg0LDEuMDA0MDg0NiAxLjAwNDA4NSwwLjUwMjA0MjMgMS41MDYxMjcsMCAxLjAwNDA4NCwtMC41MDIwNDIzIDEuMDA0MDg1LC0xLjAwNDA4NDYgbSAtMTcuNTcxNDgsLTkuMDM2NzYxMiAwLDEwLjU0Mjg4ODEgbSAwLC0xMC41NDI4ODgxIDQuMDE2MzM4LDEwLjU0Mjg4ODEgbSA0LjAxNjMzOCwtMTAuNTQyODg4MSAtNC4wMTYzMzgsMTAuNTQyODg4MSBtIDQuMDE2MzM4LC0xMC41NDI4ODgxIDAsMTAuNTQyODg4MVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICByZXR1cm4gcGF0aFxuICAgIH1cblxuICAgIC8qXG4gICAgICogSW1tdW0gY29lbGkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gaWNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDg7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSA5OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlRcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVFxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTEuMjA4ODUyLC0xLjIwODg1MTQgLTEuMjA4ODUxLC0wLjYwNDQyNTggLTEuODEzMjc4LDAgLTEuMjA4ODUyLDAuNjA0NDI1OCAtMS4yMDg4NSwxLjIwODg1MTQgLTAuNjA0NDI2LDEuODEzMjc3MTUgMCwxLjIwODg1MTM1IDAuNjA0NDI2LDEuODEzMjc3MiAxLjIwODg1LDEuMjA4ODUxMyAxLjIwODg1MiwwLjYwNDQyNTkgMS44MTMyNzgsMCAxLjIwODg1MSwtMC42MDQ0MjU5IDEuMjA4ODUyLC0xLjIwODg1MTMgbSAtMTEuNDg0MDkwMiwtMTAuODc5NjYyOSAwLDEyLjY5Mjk0MDFcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgcmV0dXJuIHBhdGhcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEFyaWVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFyaWVzU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTI7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMC45LC0wLjkgMCwtMS44IDAuOSwtMS44IDEuOCwtMC44OTk5OTk4IDEuOCwwIDEuOCwwLjg5OTk5OTggMC45LDAuOSAwLjksMS44IDAuOSw0LjUgbSAtOSwtNS40IDEuOCwtMS44IDEuOCwwIDEuOCwwLjkgMC45LDAuOSAwLjksMS44IDAuOSwzLjYgMCw5LjkgbSA4LjEsLTEyLjYgMC45LC0wLjkgMCwtMS44IC0wLjksLTEuOCAtMS44LC0wLjg5OTk5OTggLTEuOCwwIC0xLjgsMC44OTk5OTk4IC0wLjksMC45IC0wLjksMS44IC0wLjksNC41IG0gOSwtNS40IC0xLjgsLTEuOCAtMS44LDAgLTEuOCwwLjkgLTAuOSwwLjkgLTAuOSwxLjggLTAuOSwzLjYgMCw5LjlcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogVGF1cnVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRhdXJ1c1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0xMTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDEsNCAxLDIgMiwyIDMsMSA0LDAgMywtMSAyLC0yIDEsLTIgMSwtNCBtIC0xOCwwIDEsMyAxLDIgMiwyIDMsMSA0LDAgMywtMSAyLC0yIDEsLTIgMSwtMyBtIC0xMSw4IC0yLDEgLTEsMSAtMSwyIDAsMyAxLDIgMiwyIDIsMSAyLDAgMiwtMSAyLC0yIDEsLTIgMCwtMyAtMSwtMiAtMSwtMSAtMiwtMSBtIC00LDEgLTIsMSAtMSwyIDAsMyAxLDMgbSA4LDAgMSwtMyAwLC0zIC0xLC0yIC0yLC0xXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEdlbWluaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTU7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtNjsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDAsMTEuNTQ2NDE0IG0gMC45NjIyMDExLC0xMC41ODQyMTI5IDAsOS42MjIwMTE3IG0gNy42OTc2MDk3LC05LjYyMjAxMTcgMCw5LjYyMjAxMTcgbSAwLjk2MjIwMSwtMTAuNTg0MjEyOCAwLDExLjU0NjQxNCBtIC0xMy40NzA4MTY1LC0xNC40MzMwMTcyIDEuOTI0NDAyMywxLjkyNDQwMiAxLjkyNDQwMjQsMC45NjIyMDEyIDIuODg2NjAzOCwwLjk2MjIwMTEgMy44NDg4MDQsMCAyLjg4NjYwNCwtMC45NjIyMDExIDEuOTI0NDAyLC0wLjk2MjIwMTIgMS45MjQ0MDMsLTEuOTI0NDAyIG0gLTE3LjMxOTYyMTUsMTcuMzE5NjIwNyAxLjkyNDQwMjMsLTEuOTI0NDAyNCAxLjkyNDQwMjQsLTAuOTYyMjAxMSAyLjg4NjYwMzgsLTAuOTYyMjAxMiAzLjg0ODgwNCwwIDIuODg2NjA0LDAuOTYyMjAxMiAxLjkyNDQwMiwwLjk2MjIwMTEgMS45MjQ0MDMsMS45MjQ0MDI0XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENhbmNlciBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYW5jZXJTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC05OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTE1LDAgLTIsMSAtMSwyIDAsMiAxLDIgMiwxIDIsMCAyLC0xIDEsLTIgMCwtMiAtMSwtMiAxMSwwIG0gLTE4LDMgMSwyIDEsMSAyLDEgbSA0LC00IC0xLC0yIC0xLC0xIC0yLC0xIG0gLTQsMTUgMTUsMCAyLC0xIDEsLTIgMCwtMiAtMSwtMiAtMiwtMSAtMiwwIC0yLDEgLTEsMiAwLDIgMSwyIC0xMSwwIG0gMTgsLTMgLTEsLTIgLTEsLTEgLTIsLTEgbSAtNCw0IDEsMiAxLDEgMiwxXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIExlbyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsZW9TeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTM7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSA0OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTIsLTEgLTEsMCAtMiwxIC0xLDIgMCwxIDEsMiAyLDEgMSwwIDIsLTEgMSwtMiAwLC0xIC0xLC0yIC01LC01IC0xLC0yIDAsLTMgMSwtMiAyLC0xIDMsLTEgNCwwIDQsMSAyLDIgMSwyIDAsMyAtMSwzIC0zLDMgLTEsMiAwLDIgMSwyIDIsMCAxLC0xIDEsLTIgbSAtMTMsLTUgLTIsLTMgLTEsLTIgMCwtMyAxLC0yIDEsLTEgbSA3LC0xIDMsMSAyLDIgMSwyIDAsMyAtMSwzIC0yLDNcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogVmlyZ28gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdmlyZ29TeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtNTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDIuNTg5NDg2OCwtMi41ODk0ODY4IDEuNzI2MzI0NSwyLjU4OTQ4NjggMCw5LjQ5NDc4NDcgbSAtMi41ODk0ODY4LC0xMS4yMjExMDkyIDEuNzI2MzI0NSwyLjU4OTQ4NjcgMCw4LjYzMTYyMjUgbSAwLjg2MzE2MjMsLTkuNDk0Nzg0NyAyLjU4OTQ4NjcsLTIuNTg5NDg2OCAxLjcyNjMyNDUxLDIuNTg5NDg2OCAwLDguNjMxNjIyNCBtIC0yLjU4OTQ4NjcxLC0xMC4zNTc5NDY5IDEuNzI2MzI0NDcsMi41ODk0ODY3IDAsNy43Njg0NjAyIG0gMC44NjMxNjIyNCwtOC42MzE2MjI0IDIuNTg5NDg2NzksLTIuNTg5NDg2OCAxLjcyNjMyNDQsMi41ODk0ODY4IDAsMTMuODEwNTk1OSBtIC0yLjU4OTQ4NjcsLTE1LjUzNjkyMDQgMS43MjYzMjQ1LDIuNTg5NDg2NyAwLDEyLjk0NzQzMzcgbSAwLjg2MzE2MjIsLTEzLjgxMDU5NTkgMi41ODk0ODY4LC0yLjU4OTQ4NjggMC44NjMxNjIyLDEuNzI2MzI0NSAwLjg2MzE2MjMsMi41ODk0ODY4IDAsMi41ODk0ODY3IC0wLjg2MzE2MjMsMi41ODk0ODY3MyAtMC44NjMxNjIyLDEuNzI2MzI0NDcgLTEuNzI2MzI0NSwxLjcyNjMyNDUgLTIuNTg5NDg2NywxLjcyNjMyNDUgLTQuMzE1ODExMywxLjcyNjMyNDUgbSA3Ljc2ODQ2MDIsLTE1LjUzNjkyMDQgMC44NjMxNjIzLDAuODYzMTYyMiAwLjg2MzE2MjIsMi41ODk0ODY4IDAsMi41ODk0ODY3IC0wLjg2MzE2MjIsMi41ODk0ODY3MyAtMC44NjMxNjIzLDEuNzI2MzI0NDcgLTEuNzI2MzI0NSwxLjcyNjMyNDUgLTIuNTg5NDg2NywxLjcyNjMyNDUgLTMuNDUyNjQ5LDEuNzI2MzI0NVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBMaWJyYSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsaWJyYVN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAwOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTg7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiBjIDAuNzUxOSwxZS01IDEuMzkyNCwwLjEyMjI3IDEuOTMxNiwwLjM1MTU2IDAuNjYxOSwwLjI4NDk1IDEuMjEzNCwwLjYzODU0IDEuNjY2LDEuMDYyNSAwLjQ4MzgsMC40NTQ4MSAwLjg1MywwLjk3MjU1IDEuMTE3MiwxLjU2NjQxIDAuMjQ2NywwLjU2NjEyIDAuMzcxMSwxLjE3Mzk3IDAuMzcxMSwxLjgzNzg5IDAsMC42NDExMyAtMC4xMjQ0LDEuMjM5NDggLTAuMzczLDEuODA4NTkgLTAuMTYyNCwwLjM2MzA1IC0wLjM2MzEsMC42OTcyNSAtMC42MDU1LDEuMDA1ODYgbCAtMC42MzY3LDAuODA4NiA0LjM3ODksMCAwLDAuNjcxODcgLTUuNDAyNCwwIDAsLTAuOTE3OTcgYyAwLjIxNzMsLTAuMTM4NSAwLjQzNzksLTAuMjcyNDQgMC42MzY3LC0wLjQ0NzI2IDAuNDIxNSwtMC4zNjg3NiAwLjc1MjksLTAuODI3ODQgMC45ODgzLC0xLjM1NTQ3IDAuMjIxNSwtMC41MDA3NCAwLjMzNCwtMS4wMzU4IDAuMzM0LC0xLjU4NTk0IDAsLTAuNTU2NTMgLTAuMTEyMiwtMS4wOTQzNCAtMC4zMzQsLTEuNTk1NyBsIC0wLC0wLjAwMiAwLC0wLjAwNCBjIC0wLjIyOTIsLTAuNDk5MDEgLTAuNTU4MSwtMC45NDc3OCAtMC45NzQ2LC0xLjMzNzg5IGwgLTAsLTAuMDAyIC0wLC0wLjAwMiBjIC0wLjM5NjcsLTAuMzYxNTUgLTAuODY3OSwtMC42NTcyMyAtMS40MDYyLC0wLjg4NDc2IGwgLTAsMCBjIC0wLjQ5ODQsLTAuMjA5MDMgLTEuMDYyMiwtMC4zMDY2MyAtMS42ODE3LC0wLjMwNjY0IC0wLjU5MjYsMWUtNSAtMS4xNTI2LDAuMTAwMDggLTEuNjY5OSwwLjMwMjczIGwgLTAsMCBjIC0wLjUyNjEsMC4yMDc5OSAtMS4wMDMyLDAuNTA2NyAtMS40MTk5LDAuODg4NjcgbCAtMCwwLjAwMiAtMCwwLjAwMiBjIC0wLjQxNjYsMC4zOTAxMSAtMC43NDU0LDAuODM4ODcgLTAuOTc0NiwxLjMzNzg5IGwgMCwwLjAwNCAtMCwwLjAwMiBjIC0wLjIyMTgsMC41MDEzNiAtMC4zMzQsMS4wMzkxNSAtMC4zMzQsMS41OTU3IDAsMC41NTAxNSAwLjExMjUsMS4wODUxOSAwLjMzNCwxLjU4NTk0IGwgMCwwLjAwMiAwLDAuMDA0IGMgMC4yMjksMC40OTg1NSAwLjU1NzQsMC45NDkxMSAwLjk3NDYsMS4zMzk4NCAwLjE4NzYsMC4xNzQ4MiAwLjQxNDMsMC4zMTQ4NCAwLjYzNjcsMC40NTcwMyBsIDAsMC45MTc5NyAtNS4zOTA2LDAgMCwtMC42NzE4NyA0LjM3ODksMCAtMC42MzY3LC0wLjgwODYgYyAtMC4yNDI4LC0wLjMwOTA0IC0wLjQ0MywtMC42NDQxOCAtMC42MDU1LC0xLjAwNzgxIC0wLjI0ODcsLTAuNTY5MTEgLTAuMzczMSwtMS4xNjU1MiAtMC4zNzMxLC0xLjgwNjY0IDAsLTAuNjYzOTEgMC4xMjQ0LC0xLjI3MTc4IDAuMzcxMSwtMS44Mzc4OSBsIDAsLTAuMDAyIGMgM2UtNCwtNS44ZS00IC0yZS00LC0xMGUtNCAwLC0wLjAwMiAwLjI2NDEsLTAuNTkyMTggMC42MzI2LC0xLjEwODcxIDEuMTE1MywtMS41NjI1IDAuNDg0NywtMC40NTU3MSAxLjAzMzIsLTAuODA1ODUgMS42NTYyLC0xLjA1ODU5IDAuNTg2MSwtMC4yMzQ4OCAxLjIyOTQsLTAuMzU1NDYgMS45NDE0LC0wLjM1NTQ3IHogbSAtNy44NDk2LDEzLjQ1ODk5IDE1LjY5OTIsMCAwLDAuNjcxODcgLTE1LjY5OTIsMCB6XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNjb3JwaW8gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2NvcnBpb1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC00OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMi4zNzgxMTAxLC0yLjM3ODExMDEgMi4zNzgxMTAxLDIuMzc4MTEwMSAwLDkuNTEyNDQwNCBtIC0zLjE3MDgxMzUsLTExLjA5Nzg0NzEgMi4zNzgxMTAxLDIuMzc4MTEwMSAwLDguNzE5NzM3IG0gMC43OTI3MDM0LC05LjUxMjQ0MDQgMi4zNzgxMTAxLC0yLjM3ODExMDEgMi4zNzgxMTAwNywyLjM3ODExMDEgMCw5LjUxMjQ0MDQgbSAtMy4xNzA4MTM0NywtMTEuMDk3ODQ3MSAyLjM3ODExMDEsMi4zNzgxMTAxIDAsOC43MTk3MzcgbSAwLjc5MjcwMzM3LC05LjUxMjQ0MDQgMi4zNzgxMTAxMywtMi4zNzgxMTAxIDIuMzc4MTEwMSwyLjM3ODExMDEgMCw4LjcxOTczNyAxLjU4NTQwNjcsMS41ODU0MDY4IG0gLTQuNzU2MjIwMiwtMTEuODkwNTUwNSAyLjM3ODExMDEsMi4zNzgxMTAxIDAsOC43MTk3MzcgMS41ODU0MDY3LDEuNTg1NDA2NyAyLjM3ODExMDEsLTIuMzc4MTEwMVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTYWdpdHRhcml1cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzYWdpdHRhcml1c1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSA3OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTk7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtIFwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMTcuMTE0NDQsMTcuMTE0NDQgbSAxNy4xMTQ0NCwtMTcuMTE0NDQgLTMuMjA4OTU3NSwxLjA2OTY1MjUgLTYuNDE3OTE1LDAgbSA3LjQ4NzU2NzUsMS4wNjk2NTI1IC0zLjIwODk1NzUsMCAtNC4yNzg2MSwtMS4wNjk2NTI1IG0gOS42MjY4NzI1LC0xLjA2OTY1MjUgLTEuMDY5NjUyNSwzLjIwODk1NzUgMCw2LjQxNzkxNTA0IG0gLTEuMDY5NjUyNSwtNy40ODc1Njc1NCAwLDMuMjA4OTU3NSAxLjA2OTY1MjUsNC4yNzg2MTAwNCBtIC04LjU1NzIyLDAgLTcuNDg3NTY3NSwwIG0gNi40MTc5MTUsMS4wNjk2NTI0NiAtMy4yMDg5NTc1LDAgLTMuMjA4OTU3NSwtMS4wNjk2NTI0NiBtIDcuNDg3NTY3NSwwIDAsNy40ODc1Njc0NiBtIC0xLjA2OTY1MjUsLTYuNDE3OTE1IDAsMy4yMDg5NTc1IDEuMDY5NjUyNSwzLjIwODk1NzVcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2Fwcmljb3JuIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtOTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0zOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMS44MDQ3NjMzLC0zLjYwOTUyNjcgNC41MTE5MDg0LDkuMDIzODE2OCBtIC00LjUxMTkwODQsLTcuMjE5MDUzNCA0LjUxMTkwODQsOS4wMjM4MTY3IDIuNzA3MTQ1LC02LjMxNjY3MTcgNC41MTE5MDg0LDAgMi43MDcxNDUsLTAuOTAyMzgxNyAwLjkwMjM4MTcsLTEuODA0NzYzMyAwLC0xLjgwNDc2MzQgLTAuOTAyMzgxNywtMS44MDQ3NjMzIC0xLjgwNDc2MzQsLTAuOTAyMzgxNyAtMC45MDIzODE2LDAgLTEuODA0NzYzNCwwLjkwMjM4MTcgLTAuOTAyMzgxNywxLjgwNDc2MzMgMCwxLjgwNDc2MzQgMC45MDIzODE3LDIuNzA3MTQ1IDAuOTAyMzgxNywxLjgwNDc2MzM2IDAuOTAyMzgxNywyLjcwNzE0NTA0IDAsMi43MDcxNDUgLTEuODA0NzYzNCwxLjgwNDc2MzMgbSAxLjgwNDc2MzQsLTE2LjI0Mjg3MDEgLTAuOTAyMzgxNywwLjkwMjM4MTcgLTAuOTAyMzgxNywxLjgwNDc2MzMgMCwxLjgwNDc2MzQgMS44MDQ3NjM0LDMuNjA5NTI2NyAwLjkwMjM4MTYsMi43MDcxNDUgMCwyLjcwNzE0NSAtMC45MDIzODE2LDEuODA0NzYzNCAtMS44MDQ3NjM0LDAuOTAyMzgxNlwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBcXVhcml1cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtODsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0yOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibSBcIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMi44ODY2MDM1LC0yLjg4NjYwMzUgMy44NDg4MDQ3LDEuOTI0NDAyMyBtIC00LjgxMTAwNTksLTAuOTYyMjAxMSAzLjg0ODgwNDcsMS45MjQ0MDIzIDIuODg2NjAzNSwtMi44ODY2MDM1IDIuODg2NjAzNSwxLjkyNDQwMjMgbSAtMy44NDg4MDQ2NywtMC45NjIyMDExIDIuODg2NjAzNDcsMS45MjQ0MDIzIDIuODg2NjAzNSwtMi44ODY2MDM1IDEuOTI0NDAyNCwxLjkyNDQwMjMgbSAtMi44ODY2MDM1LC0wLjk2MjIwMTEgMS45MjQ0MDIzLDEuOTI0NDAyMyAyLjg4NjYwMzUsLTIuODg2NjAzNSBtIC0xNy4zMTk2MjEsOC42NTk4MTA1IDIuODg2NjAzNSwtMi44ODY2MDM0OCAzLjg0ODgwNDcsMS45MjQ0MDIzOCBtIC00LjgxMTAwNTksLTAuOTYyMjAxMjEgMy44NDg4MDQ3LDEuOTI0NDAyMzEgMi44ODY2MDM1LC0yLjg4NjYwMzQ4IDIuODg2NjAzNSwxLjkyNDQwMjM4IG0gLTMuODQ4ODA0NjcsLTAuOTYyMjAxMjEgMi44ODY2MDM0NywxLjkyNDQwMjMxIDIuODg2NjAzNSwtMi44ODY2MDM0OCAxLjkyNDQwMjQsMS45MjQ0MDIzOCBtIC0yLjg4NjYwMzUsLTAuOTYyMjAxMjEgMS45MjQ0MDIzLDEuOTI0NDAyMzEgMi44ODY2MDM1LC0yLjg4NjYwMzQ4XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFBpc2NlcyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwaXNjZXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTg7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtODsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm0gXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDQsMiAyLDIgMSwzIDAsMyAtMSwzIC0yLDIgLTQsMiBtIDAsLTE3IDMsMSAyLDEgMiwyIDEsMyBtIDAsMyAtMSwzIC0yLDIgLTIsMSAtMywxIG0gMTYsLTE3IC0zLDEgLTIsMSAtMiwyIC0xLDMgbSAwLDMgMSwzIDIsMiAyLDEgMywxIG0gMCwtMTcgLTQsMiAtMiwyIC0xLDMgMCwzIDEsMyAyLDIgNCwyIG0gLTE3LC05IDE4LDAgbSAtMTgsMSAxOCwwXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFN1biBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdW5TeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTE7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtNzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTIuMTgxODIsMC43MjcyNjggLTIuMTgxODE5LDEuNDU0NTQzIC0xLjQ1NDU1MiwyLjE4MTgyIC0wLjcyNzI2OCwyLjE4MTgxOSAwLDIuMTgxODE5IDAuNzI3MjY4LDIuMTgxODE5IDEuNDU0NTUyLDIuMTgxODIgMi4xODE4MTksMS40NTQ1NDQgMi4xODE4MiwwLjcyNzI3NiAyLjE4MTgxLDAgMi4xODE4MiwtMC43MjcyNzYgMi4xODE4MTksLTEuNDU0NTQ0IDEuNDU0NTUyLC0yLjE4MTgyIDAuNzI3MjY4LC0yLjE4MTgxOSAwLC0yLjE4MTgxOSAtMC43MjcyNjgsLTIuMTgxODE5IC0xLjQ1NDU1MiwtMi4xODE4MiAtMi4xODE4MTksLTEuNDU0NTQzIC0yLjE4MTgyLC0wLjcyNzI2OCAtMi4xODE4MSwwIG0gMC43MjcyNjcsNi41NDU0NSAtMC43MjcyNjcsMC43MjcyNzYgMCwwLjcyNzI3NSAwLjcyNzI2NywwLjcyNzI2OCAwLjcyNzI3NiwwIDAuNzI3MjY3LC0wLjcyNzI2OCAwLC0wLjcyNzI3NSAtMC43MjcyNjcsLTAuNzI3Mjc2IC0wLjcyNzI3NiwwIG0gMCwwLjcyNzI3NiAwLDAuNzI3Mjc1IDAuNzI3Mjc2LDAgMCwtMC43MjcyNzUgLTAuNzI3Mjc2LDBcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogTW9vbiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtb29uU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC00OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTc7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIGEgNy40OTY5MjgzLDcuNDk2OTI4MyAwIDAgMSAwLDE0LjMyNzQ2MiA3LjQ5NjkyODMsNy40OTY5MjgzIDAgMSAwIDAsLTE0LjMyNzQ2MiB6XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1lcmN1cnkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWVyY3VyeVN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtMjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IDc7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDQuMjYwMTEsMCBtIC0yLjEzMDA1LC0yLjk4MjA3IDAsNS4xMTIxMyBtIDQuNzAzMTIsLTkuNzk4MyBhIDQuNzAzMTUsNC43MDMxNSAwIDAgMSAtNC43MDMxNSw0LjcwMzE0IDQuNzAzMTUsNC43MDMxNSAwIDAgMSAtNC43MDMxNCwtNC43MDMxNCA0LjcwMzE1LDQuNzAzMTUgMCAwIDEgNC43MDMxNCwtNC43MDMxNSA0LjcwMzE1LDQuNzAzMTUgMCAwIDEgNC43MDMxNSw0LjcwMzE1IHpcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICBjb25zdCBjcm93blhTaGlmdCA9IDY7IC8vcHhcbiAgICAgIGNvbnN0IGNyb3duWVNoaWZ0ID0gLTE2OyAvL3B4XG4gICAgICBjb25zdCBjcm93biA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgY3Jvd24uc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArICh4ICsgY3Jvd25YU2hpZnQpICsgXCIsIFwiICsgKHkgKyBjcm93bllTaGlmdCkgKyBcIiBhIDMuOTcxNzg1NSwzLjk3MTc4NTUgMCAwIDEgLTMuOTU1NDEsMy41OTA1NCAzLjk3MTc4NTUsMy45NzE3ODU1IDAgMCAxIC0zLjk1MTg1LC0zLjU5NDQ1XCIpO1xuICAgICAgY3Jvd24uc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNyb3duKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogVmVudXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdmVudXNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gMi4zOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gNzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTQuOTM3NjY5LDAuMDM5NzMgbSAyLjQ0ODk3MiwyLjM2NDYwNyAwLC01Ljc5MDE0IGMgLTMuMTA5NTQ2LC0wLjAwODUgLTUuNjI0NjE3LC0yLjUzNDIxMiAtNS42MjAxODcsLTUuNjQyMDggMC4wMDQ0LC0zLjEwNzcwNiAyLjUyNjUxNCwtNS42MjE2ODkgNS42MzU1ODIsLTUuNjIxNjg5IDMuMTA5MDY4LDAgNS42MzExNTIsMi41MTM5ODMgNS42MzU1ODIsNS42MjE2ODkgMC4wMDQ0LDMuMTA3ODY4IC0yLjUxMDY0MSw1LjYzMzU4NiAtNS42MjAxODcsNS42NDIwOFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBNYXJzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1hcnNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gMzsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0zLjc7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIGMgLTUuMjQ3NDM4LC00LjE1MDYyMyAtMTEuNjk5MywzLjIwNTUxOCAtNy4wMTg4MDcsNy44ODYwMDcgNC42ODA0OTQsNC42ODA0ODggMTIuMDM2NjI4LC0xLjc3MTM4MiA3Ljg4NTk5OSwtNy4wMTg4MTYgeiBtIDAsMCAwLjQzMzU5NywwLjQzMzU5NSAzLjk5NjU2NiwtNC4yMTc0MTkgbSAtMy4yMzk4MDIsLTAuMDU1MjEgMy4yOTUwMTUsMCAwLjExMDQyNywzLjY4MTUwN1wiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBKdXBpdGVyIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGp1cGl0ZXJTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTY7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMjsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgYyAtMC40MzQ3MywwIC0xLjMwNDIyLC0wLjQwNTcyIC0xLjMwNDIyLC0yLjAyODU3IDAsLTEuNjIyODUgMS43Mzg5NywtMy4yNDU3IDMuNDc3OTIsLTMuMjQ1NyAxLjczODk3LDAgMy40Nzc5MiwxLjIxNzE1IDMuNDc3OTIsNC4wNTcxMyAwLDIuODM5OTkgLTIuMTczNyw3LjMwMjgzIC02LjUyMTA4LDcuMzAyODMgbSAxMi4xNzI2OSwwIC0xMi42MDc0NSwwIG0gOS45OTkwMiwtMTEuNzY1NjcgMCwxNS44MjI3OVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTYXR1cm4gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDQ7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSA3OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiBjIC0wLjUyMjIyLDAuNTIyMjEgLTEuMDQ0NDUsMS4wNDQ0NCAtMS41NjY2NiwxLjA0NDQ0IC0wLjUyMjIyLDAgLTEuNTY2NjcsLTAuNTIyMjMgLTEuNTY2NjcsLTEuNTY2NjcgMCwtMS4wNDQ0MyAwLjUyMjIzLC0yLjA4ODg3IDEuNTY2NjcsLTMuMTMzMzIgMS4wNDQ0NCwtMS4wNDQ0MyAyLjA4ODg4LC0zLjEzMzMxIDIuMDg4ODgsLTUuMjIyMTkgMCwtMi4wODg4OCAtMS4wNDQ0NCwtNC4xNzc3NiAtMy4xMzMzMiwtNC4xNzc3NiAtMS45NzU2NiwwIC0zLjY1NTU1LDEuMDQ0NDQgLTQuNjk5OTgsMy4xMzMzMyBtIC0yLjU1NTE1LC01Ljg3NDk5IDYuMjY2NjQsMCBtIC0zLjcxMTQ5LC0yLjQ4MDU0IDAsMTUuMTQ0MzhcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogVXJhbnVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHVyYW51c1N5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtNTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC02OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgaG9ybnMgPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIGhvcm5zLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiICAwLDEwLjIzODI0IG0gMTAuMjM2MzMsLTEwLjMyNzY0IDAsMTAuMjM4MjQgbSAtMTAuMjY2MDYsLTQuNjM5NCAxMC4yMzA4NSwwIG0gLTUuMDY0MTUsLTUuNTE1MzIgMCwxMS45NDk4NVwiKTtcbiAgICAgIGhvcm5zLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChob3JucylcblxuICAgICAgY29uc3QgYm9keVhTaGlmdCA9IDc7IC8vcHhcbiAgICAgIGNvbnN0IGJvZHlZU2hpZnQgPSAxMzsgLy9weFxuICAgICAgY29uc3QgYm9keSA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgYm9keS5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgKHggKyBib2R5WFNoaWZ0KSArIFwiLCBcIiArICh5ICsgYm9keVlTaGlmdCkgKyBcIiBhIDEuODM4NDM3NywxLjgzODQzNzcgMCAwIDEgLTEuODM4NDQsMS44Mzg0MyAxLjgzODQzNzcsMS44Mzg0Mzc3IDAgMCAxIC0xLjgzODQyLC0xLjgzODQzIDEuODM4NDM3NywxLjgzODQzNzcgMCAwIDEgMS44Mzg0MiwtMS44Mzg0NCAxLjgzODQzNzcsMS44Mzg0Mzc3IDAgMCAxIDEuODM4NDQsMS44Mzg0NCB6XCIpO1xuICAgICAgYm9keS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoYm9keSlcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE5lcHR1bmUgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbmVwdHVuZVN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSA0OyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTY7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDEuNzcwNTksLTIuMzYzMTIgMi4zMTg3MiwxLjgwNDUgbSAtMTQuNDQyNjQsLTAuMjAwMDYgMi4zNDExMywtMS43NzQxOCAxLjc0MDg1LDIuMzg1OTUgbSAtMS44MDAxMywtMS43NzI2NSBjIC0xLjIzNzc2LDguNDA5NzUgMC44MjUxOCw5LjY3MTIxIDQuOTUxMDYsOS42NzEyMSA0LjEyNTg5LDAgNi4xODg4MywtMS4yNjE0NiA0Ljk1MTA3LC05LjY3MTIxIG0gLTcuMDUzMzQsMy4xNzAwNSAyLjAzOTk3LC0yLjEyNTU5IDIuMDg1NjUsMi4wNzkwMyBtIC01LjMyNDA2LDkuOTExNjIgNi42MDE0MiwwIG0gLTMuMzAwNzEsLTEyLjE5NDE0IDAsMTUuNTU4MDNcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogUGx1dG8gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGx1dG9TeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gNjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC03OyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgYm9keSA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgYm9keS5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiBhIDUuNzY3Njg1Niw1Ljc2NzY4NTYgMCAwIDEgLTIuODgzODUsNC45OTQ5NiA1Ljc2NzY4NTYsNS43Njc2ODU2IDAgMCAxIC01Ljc2NzY4LDAgNS43Njc2ODU2LDUuNzY3Njg1NiAwIDAgMSAtMi44ODM4NSwtNC45OTQ5NiBtIDUuNzY3NzEsMTMuOTM4NTggMCwtOC4xNzA4OCBtIC0zLjg0NTEyLDQuMzI1NzYgNy42OTAyNCwwXCIpO1xuICAgICAgYm9keS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoYm9keSlcblxuICAgICAgY29uc3QgaGVhZFhTaGlmdCA9IC0yLjQ7IC8vcHhcbiAgICAgIGNvbnN0IGhlYWRZU2hpZnQgPSAtMTsgLy9weFxuICAgICAgY29uc3QgaGVhZCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgaGVhZC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgKHggKyBoZWFkWFNoaWZ0KSArIFwiLCBcIiArICh5ICsgaGVhZFlTaGlmdCkgKyBcIiBhIDMuMzY0NDgzNCwzLjM2NDQ4MzQgMCAwIDEgLTMuMzY0NDgsMy4zNjQ0OSAzLjM2NDQ4MzQsMy4zNjQ0ODM0IDAgMCAxIC0zLjM2NDQ4LC0zLjM2NDQ5IDMuMzY0NDgzNCwzLjM2NDQ4MzQgMCAwIDEgMy4zNjQ0OCwtMy4zNjQ0OCAzLjM2NDQ4MzQsMy4zNjQ0ODM0IDAgMCAxIDMuMzY0NDgsMy4zNjQ0OCB6XCIpO1xuICAgICAgaGVhZC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaGVhZClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENoaXJvbiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGlyb25TeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gNDsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IDM7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBib2R5ID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBib2R5LnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIGEgMy44NzY0NzI1LDMuMDY3NTI0OSAwIDAgMSAtMy44NzY0NzMsMy4wNjc1MjUgMy44NzY0NzI1LDMuMDY3NTI0OSAwIDAgMSAtMy44NzY0NzIsLTMuMDY3NTI1IDMuODc2NDcyNSwzLjA2NzUyNDkgMCAwIDEgMy44NzY0NzIsLTMuMDY3NTI1IDMuODc2NDcyNSwzLjA2NzUyNDkgMCAwIDEgMy44NzY0NzMsMy4wNjc1MjUgelwiKTtcbiAgICAgIGJvZHkuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGJvZHkpXG5cbiAgICAgIGNvbnN0IGhlYWRYU2hpZnQgPSAwOyAvL3B4XG4gICAgICBjb25zdCBoZWFkWVNoaWZ0ID0gLTE0LjU7IC8vcHhcbiAgICAgIGNvbnN0IGhlYWQgPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIGhlYWQuc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArICh4ICsgaGVhZFhTaGlmdCkgKyBcIiwgXCIgKyAoeSArIGhlYWRZU2hpZnQpICsgXCIgICAtMy45NDI5OTcsNC4yNDM4NDQgNC4xMTA4NDksMy42NTYxNTEgbSAtNC44Njc1NjksLTkuMDA5NDY4IDAsMTEuNzI3MjUxXCIpO1xuICAgICAgaGVhZC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaGVhZClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIExpbGl0aCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsaWxpdGhTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gMjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IDM7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0yLjUyNTQzNSwtMS4xMjg1MyAtMS40NjQ3NTIsLTEuNzk1MzkgLTAuODA4MTM4LC0yLjIwNTc2IDAuMTUxNTI2LC0yLjA1MTg4IDAuOTA5MTU2LC0xLjUzODkgMS4wMTAxNzMsLTEuMDI1OTMgMC45MDkxNTcsLTAuNTY0MjcgMS4zNjM3MzUsLTAuNjE1NTYgbSAyLjMxNTMyNywtMC4zOTA1NSAtMS43MTYzMDEsMC41NDcxNiAtMS43MTYzLDEuMDk0MzEgLTEuMTQ0MiwxLjY0MTQ2IC0wLjU3MjEwMiwxLjY0MTQ2IDAsMS42NDE0NiAwLjU3MjEwMiwxLjY0MTQ3IDEuMTQ0MiwxLjY0MTQ1IDEuNzE2MywxLjA5NDMyIDEuNzE2MzAxLDAuNTQ3MTUgbSAwLC0xMS40OTAyNCAtMi4yODg0LDAgLTIuMjg4NDAxLDAuNTQ3MTYgLTEuNzE2MzAyLDEuMDk0MzEgLTEuMTQ0MjAxLDEuNjQxNDYgLTAuNTcyMSwxLjY0MTQ2IDAsMS42NDE0NiAwLjU3MjEsMS42NDE0NyAxLjE0NDIwMSwxLjY0MTQ1IDEuNzE2MzAyLDEuMDk0MzIgMi4yODg0MDEsMC41NDcxNSAyLjI4ODQsMCBtIC00LjM2NzEyLC0wLjQ3NTIgMCw2LjQ0MzA3IG0gLTIuNzA5MTA3LC0zLjQxMTAxIDUuNjE2MDI1LDBcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogTk5vZGUgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbm5vZGVTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTM7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAzOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMS4zMzMzMzM0LC0wLjY2NjY2NjcgLTAuNjY2NjY2NiwwIC0xLjMzMzMzMzQsMC42NjY2NjY3IC0wLjY2NjY2NjcsMS4zMzMzMzMzIDAsMC42NjY2NjY3IDAuNjY2NjY2NywxLjMzMzMzMzMgMS4zMzMzMzM0LDAuNjY2NjY2NyAwLjY2NjY2NjYsMCAxLjMzMzMzMzQsLTAuNjY2NjY2NyAwLjY2NjY2NjYsLTEuMzMzMzMzMyAwLC0wLjY2NjY2NjcgLTAuNjY2NjY2NiwtMS4zMzMzMzMzIC0yLC0yLjY2NjY2NjY1IC0wLjY2NjY2NjcsLTEuOTk5OTk5OTUgMCwtMS4zMzMzMzM0IDAuNjY2NjY2NywtMiAxLjMzMzMzMzMsLTEuMzMzMzMzMyAyLC0wLjY2NjY2NjcgMi42NjY2NjY2LDAgMiwwLjY2NjY2NjcgMS4zMzMzMzMzLDEuMzMzMzMzMyAwLjY2NjY2NjcsMiAwLDEuMzMzMzMzNCAtMC42NjY2NjY3LDEuOTk5OTk5OTUgLTIsMi42NjY2NjY2NSAtMC42NjY2NjY2LDEuMzMzMzMzMyAwLDAuNjY2NjY2NyAwLjY2NjY2NjYsMS4zMzMzMzMzIDEuMzMzMzMzNCwwLjY2NjY2NjcgMC42NjY2NjY2LDAgMS4zMzMzMzM0LC0wLjY2NjY2NjcgMC42NjY2NjY3LC0xLjMzMzMzMzMgMCwtMC42NjY2NjY3IC0wLjY2NjY2NjcsLTEuMzMzMzMzMyAtMS4zMzMzMzM0LC0wLjY2NjY2NjcgLTAuNjY2NjY2NiwwIC0xLjMzMzMzMzQsMC42NjY2NjY3IG0gLTcuOTk5OTk5OSwtNiAwLjY2NjY2NjcsLTEuMzMzMzMzMyAxLjMzMzMzMzMsLTEuMzMzMzMzMyAyLC0wLjY2NjY2NjcgMi42NjY2NjY2LDAgMiwwLjY2NjY2NjcgMS4zMzMzMzMzLDEuMzMzMzMzMyAwLjY2NjY2NjcsMS4zMzMzMzMzXCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE51bWJlciAxIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG51bWJlcjFTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gMDsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0zOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMi41MTI4NzUzLDcuNzU3ODg4NCAxLjAwNTE1MDA5LDAgbSAzLjAxNTQ1MDMxLC05LjU4MzI3MzcgLTEuMDA1MTUwMSwxLjgyNTM4NTMgLTIuNTEyODc1MjcsNy43NTc4ODg0IG0gMy41MTgwMjUzNywtOS41ODMyNzM3IC0zLjAxNTQ1MDMxLDkuNTgzMjczNyBtIDMuMDE1NDUwMzEsLTkuNTgzMjczNyAtMS41MDc3MjUxLDEuMzY5MDM4OCAtMS41MDc3MjUyMSwwLjkxMjY5MjkgLTEuMDA1MTUwMDksMC40NTYzNDYzIG0gMi41MTI4NzUzLC0wLjkxMjY5MjcgLTEuMDA1MTUwMTYsMC40NTYzNDY0IC0xLjUwNzcyNTE0LDAuNDU2MzQ2M1wiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBOdW1iZXIgMiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBudW1iZXIyU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC0xOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTM7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIDAsLTAuNDU0NTQ1NCAwLjQ1NDU0NTQsMCAwLDAuOTA5MDkwOSAtMC45MDkwOTA5LDAgMCwtMC45MDkwOTA5IDAuNDU0NTQ1NSwtMC45MDkwOTA5IDAuNDU0NTQ1NCwtMC40NTQ1NDU1IDEuMzYzNjM2MzcsLTAuNDU0NTQ1NCAxLjM2MzYzNjMzLDAgMS4zNjM2MzY0LDAuNDU0NTQ1NCAwLjQ1NDU0NTUsMC45MDkwOTA5IDAsMC45MDkwOTA5IC0wLjQ1NDU0NTUsMC45MDkwOTEgLTAuOTA5MDkwOSwwLjkwOTA5MDkgLTQuNTQ1NDU0NiwyLjcyNzI3MjY5IC0wLjkwOTA5MDksMC45MDkwOTA5MSAtMC45MDkwOTA5LDEuODE4MTgxOCBtIDYuODE4MTgxOCwtOS4wOTA5MDkxIDAuNDU0NTQ1NSwwLjkwOTA5MDkgMCwwLjkwOTA5MDkgLTAuNDU0NTQ1NSwwLjkwOTA5MSAtMC45MDkwOTA5LDAuOTA5MDkwOSAtMS4zNjM2MzYzMywwLjkwOTA5MDkgbSAxLjM2MzYzNjMzLC01IDAuNDU0NTQ1NSwwLjQ1NDU0NTQgMC40NTQ1NDU0LDAuOTA5MDkwOSAwLDAuOTA5MDkwOSAtMC40NTQ1NDU0LDAuOTA5MDkxIC0wLjkwOTA5MDksMC45MDkwOTA5IC0zLjYzNjM2MzcsMi43MjcyNzI2OSBtIC0xLjM2MzYzNjMsMS44MTgxODE4MSAwLjQ1NDU0NTQsLTAuNDU0NTQ1NCAwLjkwOTA5MDksMCAyLjI3MjcyNzMyLDAuNDU0NTQ1NCAyLjI3MjcyNzI4LDAgMC40NTQ1NDU0LC0wLjQ1NDU0NTQgbSAtNSwwIDIuMjcyNzI3MzIsMC45MDkwOTA5IDIuMjcyNzI3MjgsMCBtIC00LjU0NTQ1NDYsLTAuOTA5MDkwOSAyLjI3MjcyNzMyLDEuMzYzNjM2MyAxLjM2MzYzNjM4LDAgMC45MDkwOTA5LC0wLjQ1NDU0NTQgMC40NTQ1NDU0LC0wLjkwOTA5MDkgMCwtMC40NTQ1NDU1XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE51bWJlciAzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG51bWJlcjNTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTE7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMCwtMC40NTQ1NDU0IDAuNDU0NTQ1NDksMCAwLDAuOTA5MDkwOSAtMC45MDkwOTA4OSwwIDAsLTAuOTA5MDkwOSAwLjQ1NDU0NTQsLTAuOTA5MDkwOSAwLjQ1NDU0NTQ5LC0wLjQ1NDU0NTUgMS4zNjM2MzYzNiwtMC40NTQ1NDU0IDEuMzYzNjM2MzUsMCAxLjM2MzYzNjQsMC40NTQ1NDU0IDAuNDU0NTQ1NCwwLjkwOTA5MDkgMCwwLjkwOTA5MDkgLTAuNDU0NTQ1NCwwLjkwOTA5MSAtMC40NTQ1NDU1LDAuNDU0NTQ1NCAtMC45MDkwOTA5LDAuNDU0NTQ1NSAtMS4zNjM2MzYzNSwwLjQ1NDU0NTQgbSAyLjI3MjcyNzI1LC00LjA5MDkwOTEgMC40NTQ1NDU1LDAuOTA5MDkwOSAwLDAuOTA5MDkwOSAtMC40NTQ1NDU1LDAuOTA5MDkxIC0wLjQ1NDU0NTQsMC40NTQ1NDU0IG0gLTAuNDU0NTQ1NSwtMy42MzYzNjM2IDAuNDU0NTQ1NSwwLjQ1NDU0NTQgMC40NTQ1NDU0LDAuOTA5MDkwOSAwLDAuOTA5MDkwOSAtMC40NTQ1NDU0LDAuOTA5MDkxIC0wLjkwOTA5MDksMC45MDkwOTA5IC0wLjkwOTA5MDk1LDAuNDU0NTQ1NCBtIC0wLjkwOTA5MDksMCAwLjkwOTA5MDksMCAxLjM2MzYzNjM1LDAuNDU0NTQ1NSAwLjQ1NDU0NTUsMC40NTQ1NDU0MiAwLjQ1NDU0NTQsMC45MDkwOTA5MSAwLDEuMzYzNjM2MzcgLTAuNDU0NTQ1NCwwLjkwOTA5MDkgLTAuOTA5MDkwOSwwLjQ1NDU0NTUgLTEuMzYzNjM2NCwwLjQ1NDU0NTQgLTEuMzYzNjM2NCwwIC0xLjM2MzYzNjMsLTAuNDU0NTQ1NCAtMC40NTQ1NDU1LC0wLjQ1NDU0NTUgLTAuNDU0NTQ1NCwtMC45MDkwOTA5IDAsLTAuOTA5MDkwOTEgMC45MDkwOTA5LDAgMCwwLjkwOTA5MDkxIC0wLjQ1NDU0NTUsMCAwLC0wLjQ1NDU0NTQ2IG0gNSwtMS44MTgxODE4MiAwLjQ1NDU0NTUsMC45MDkwOTA5MSAwLDEuMzYzNjM2MzcgLTAuNDU0NTQ1NSwwLjkwOTA5MDkgbSAtMS4zNjM2MzYzNSwtNC4wOTA5MDkxIDAuOTA5MDkwOTUsMC40NTQ1NDU1IDAuNDU0NTQ1NCwwLjkwOTA5MDg4IDAsMS44MTgxODE4MiAtMC40NTQ1NDU0LDAuOTA5MDkwOSAtMC40NTQ1NDU0OSwwLjQ1NDU0NTUgLTAuOTA5MDkwOTEsMC40NTQ1NDU0XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE51bWJlciA0IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG51bWJlcjRTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gMTsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0zOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMi4yODY3ODM4Myw3Ljc3NTA2NTEgMC45MTQ3MTM1NiwwIG0gMi43NDQxNDA1NywtOS42MDQ0OTIyIC0wLjkxNDcxMzUsMS44Mjk0MjcxIC0yLjI4Njc4Mzg2LDcuNzc1MDY1MSBtIDMuMjAxNDk3MzYsLTkuNjA0NDkyMiAtMi43NDQxNDA1Nyw5LjYwNDQ5MjIgbSAyLjc0NDE0MDU3LC05LjYwNDQ5MjIgLTcuMzE3NzA4Myw2Ljg2MDM1MTYgNy4zMTc3MDgzLDBcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogTnVtYmVyIDUgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbnVtYmVyNVN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAwOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTQ7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0yLjI3MjcyNzI1LDQuNTQ1NDU0NSBtIDIuMjcyNzI3MjUsLTQuNTQ1NDU0NSA0LjU0NTQ1NDU1LDAgbSAtNC41NDU0NTQ1NSwwLjQ1NDU0NTQgMy42MzYzNjM2NSwwIG0gLTQuMDkwOTA5MSwwLjQ1NDU0NTUgMi4yNzI3MjczLDAgMS44MTgxODE4LC0wLjQ1NDU0NTUgMC45MDkwOTA5LC0wLjQ1NDU0NTQgbSAtNi44MTgxODE4LDQuNTQ1NDU0NSAwLjQ1NDU0NTQsLTAuNDU0NTQ1NCAxLjM2MzYzNjQsLTAuNDU0NTQ1NSAxLjM2MzYzNjM2LDAgMS4zNjM2MzYzNCwwLjQ1NDU0NTUgMC40NTQ1NDU1LDAuNDU0NTQ1NCAwLjQ1NDU0NTQsMC45MDkwOTA5MiAwLDEuMzYzNjM2MzggLTAuNDU0NTQ1NCwxLjM2MzYzNjQgLTAuOTA5MDkwOSwwLjkwOTA5MDkgLTEuODE4MTgxODUsMC40NTQ1NDU0IC0xLjM2MzYzNjM1LDAgLTAuOTA5MDkwOSwtMC40NTQ1NDU0IC0wLjQ1NDU0NTUsLTAuNDU0NTQ1NSAtMC40NTQ1NDU0LC0wLjkwOTA5MDkgMCwtMC45MDkwOTA5IDAuOTA5MDkwOSwwIDAsMC45MDkwOTA5IC0wLjQ1NDU0NTUsMCAwLC0wLjQ1NDU0NTQ1IG0gNSwtMi43MjcyNzI3NSAwLjQ1NDU0NTUsMC45MDkwOTA5MiAwLDEuMzYzNjM2MzggLTAuNDU0NTQ1NSwxLjM2MzYzNjQgLTAuOTA5MDkwOSwwLjkwOTA5MDkgbSAtMC40NTQ1NDU0NCwtNS40NTQ1NDU1IDAuOTA5MDkwOTQsMC40NTQ1NDU1IDAuNDU0NTQ1NCwwLjkwOTA5MDkgMCwxLjgxODE4MTggLTAuNDU0NTQ1NCwxLjM2MzYzNjQgLTAuOTA5MDkwOTQsMC45MDkwOTA5IC0wLjkwOTA5MDkxLDAuNDU0NTQ1NFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBOdW1iZXIgNiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBudW1iZXI2U3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDM7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgMCwtMC40NTQ1NDU1IC0wLjQ1NDU0NTUsMCAwLDAuOTA5MDkwOSAwLjkwOTA5MDksMCAwLC0wLjkwOTA5MDkgLTAuNDU0NTQ1NCwtMC45MDkwOTA5IC0wLjkwOTA5MSwtMC40NTQ1NDU0IC0xLjM2MzYzNjMsMCAtMS4zNjM2MzYzOCwwLjQ1NDU0NTQgLTAuOTA5MDkwOTIsMC45MDkwOTA5IC0wLjkwOTA5MDksMS4zNjM2MzY0IC0wLjQ1NDU0NTUsMS4zNjM2MzY0IC0wLjQ1NDU0NTQsMS44MTgxODE3OCAwLDEuMzYzNjM2MzYgMC40NTQ1NDU0LDEuMzYzNjM2MzYgMC40NTQ1NDU1LDAuNDU0NTQ1NSAwLjkwOTA5MDksMC40NTQ1NDU0IDEuMzYzNjM2MzcsMCAxLjM2MzYzNjMzLC0wLjQ1NDU0NTQgMC45MDkwOTA5LC0wLjkwOTA5MDkgMC40NTQ1NDU1LC0wLjkwOTA5MDk2IDAsLTEuMzYzNjM2MzYgLTAuNDU0NTQ1NSwtMC45MDkwOTA4OCAtMC40NTQ1NDU0LC0wLjQ1NDU0NTUgLTAuOTA5MDkwOSwtMC40NTQ1NDU0IC0xLjM2MzYzNjM4LDAgLTAuOTA5MDkwOTIsMC40NTQ1NDU0IC0wLjQ1NDU0NTQsMC40NTQ1NDU1IC0wLjQ1NDU0NTUsMC45MDkwOTA4OCBtIDEuMzYzNjM2MzYsLTQuNTQ1NDU0NTggLTAuOTA5MDkwODYsMS4zNjM2MzY0IC0wLjQ1NDU0NTUsMS4zNjM2MzY0IC0wLjQ1NDU0NTUsMS44MTgxODE3OCAwLDEuODE4MTgxODIgMC40NTQ1NDU1LDAuOTA5MDkwOSBtIDQuMDkwOTA5MSwtMC40NTQ1NDU0IDAuNDU0NTQ1NCwtMC45MDkwOTA5NiAwLC0xLjM2MzYzNjM2IC0wLjQ1NDU0NTQsLTAuOTA5MDkwODggbSAtMC45MDkwOTA5LC01IC0wLjkwOTA5MDkzLDAuNDU0NTQ1NCAtMC45MDkwOTA5MSwxLjM2MzYzNjQgLTAuNDU0NTQ1NDYsMC45MDkwOTA5IC0wLjQ1NDU0NTQsMS4zNjM2MzY0IC0wLjQ1NDU0NTUsMS44MTgxODE3OCAwLDIuMjcyNzI3MzIgMC40NTQ1NDU1LDAuOTA5MDkwOSAwLjQ1NDU0NTQsMC40NTQ1NDU0IG0gMS4zNjM2MzYzNywwIDAuOTA5MDkwOTMsLTAuNDU0NTQ1NCAwLjQ1NDU0NTQsLTAuNDU0NTQ1NSAwLjQ1NDU0NTUsLTEuMzYzNjM2MzYgMCwtMS44MTgxODE4MiAtMC40NTQ1NDU1LC0wLjkwOTA5MDkyIC0wLjQ1NDU0NTQsLTAuNDU0NTQ1NFwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBOdW1iZXIgNyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBudW1iZXI3U3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC0yOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTQ7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBwYXRoID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0wLjkwOTA5MDksMi43MjcyNzI3IG0gNi44MTgxODE4LC0yLjcyNzI3MjcgLTAuNDU0NTQ1NCwxLjM2MzYzNjMgLTAuOTA5MDkxLDEuMzYzNjM2NCAtMS44MTgxODE4LDIuMjcyNzI3MyAtMC45MDkwOTA4OCwxLjM2MzYzNjMzIC0wLjQ1NDU0NTQ2LDEuMzYzNjM2MzcgLTAuNDU0NTQ1NDUsMS44MTgxODE4IG0gMC45MDkwOTA5MSwtMy42MzYzNjM2MiAtMC45MDkwOTA5MSwxLjgxODE4MTgyIC0wLjQ1NDU0NTQ2LDEuODE4MTgxOCBtIDQuMDkwOTA5MDUsLTYuODE4MTgxOCAtMi43MjcyNzI2OCwyLjcyNzI3MjcyIC0wLjkwOTA5MDkxLDEuMzYzNjM2MzcgLTAuNDU0NTQ1NDYsMC45MDkwOTA5MSAtMC40NTQ1NDU0NSwxLjgxODE4MTggMC45MDkwOTA5MSwwIG0gLTEuMzYzNjM2NDEsLTguMTgxODE4MiAxLjM2MzYzNjQxLC0xLjM2MzYzNjMgMC45MDkwOTA5MSwwIDIuMjcyNzI3MjgsMS4zNjM2MzYzIG0gLTMuNjM2MzYzNjUsLTAuOTA5MDkwOSAxLjM2MzYzNjM3LDAgMi4yNzI3MjcyOCwwLjkwOTA5MDkgbSAtNC41NDU0NTQ2LDAgMC45MDkwOTA5NSwtMC40NTQ1NDU0IDEuMzYzNjM2MzcsMCAyLjI3MjcyNzI4LDAuNDU0NTQ1NCAwLjkwOTA5MDksMCAwLjQ1NDU0NTUsLTAuNDU0NTQ1NCAwLjQ1NDU0NTQsLTAuOTA5MDkwOVwiKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBhdGgpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBOdW1iZXIgOCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBudW1iZXI4U3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IDA7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtNTsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IHBhdGggPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArIHggKyBcIiwgXCIgKyB5ICsgXCIgLTEuMzYzMTI0NCwwLjQ1NDM3NDggLTAuNDU0Mzc0OCwwLjQ1NDM3NDggLTAuNDU0Mzc0OCwwLjkwODc0OTYgMCwxLjM2MzEyNDQgMC40NTQzNzQ4LDAuOTA4NzQ5NiAwLjkwODc0OTYsMC40NTQzNzQ4IDEuMzYzMTI0NCwwIDEuMzYzMTI0NCwtMC40NTQzNzQ4IDAuOTA4NzQ5NiwtMC40NTQzNzQ4IDAuNDU0Mzc0OCwtMC45MDg3NDk2IDAsLTEuMzYzMTI0NCAtMC40NTQzNzQ4LC0wLjkwODc0OTYgLTAuOTA4NzQ5NiwtMC40NTQzNzQ4IC0xLjgxNzQ5OTIsMCBtIDAuOTA4NzQ5NiwwIC0yLjI3MTg3NCwwLjQ1NDM3NDggbSAwLDAuNDU0Mzc0OCAtMC40NTQzNzQ4LDAuOTA4NzQ5NiAwLDEuODE3NDk5MiAwLjQ1NDM3NDgsMC40NTQzNzQ4IG0gLTAuNDU0Mzc0OCwwIDEuMzYzMTI0NCwwLjQ1NDM3NDggbSAwLjQ1NDM3NDgsMCAxLjgxNzQ5OTIsLTAuNDU0Mzc0OCBtIDAuNDU0Mzc0OCwtMC40NTQzNzQ4IDAuNDU0Mzc0OCwtMC45MDg3NDk2IDAsLTEuMzYzMTI0NCAtMC40NTQzNzQ4LC0wLjkwODc0OTYgbSAwLjQ1NDM3NDgsMCAtMS44MTc0OTkyLC0wLjQ1NDM3NDggbSAtMC45MDg3NDk2LDAgLTAuOTA4NzQ5NiwwLjkwODc0OTYgLTAuNDU0Mzc0OCwwLjkwODc0OTYgMCwxLjgxNzQ5OTIgMC40NTQzNzQ4LDAuOTA4NzQ5NiBtIDEuMzYzMTI0NCwwIDAuOTA4NzQ5NiwtMC40NTQzNzQ4IDAuNDU0Mzc0OCwtMC40NTQzNzQ4IDAuNDU0Mzc0OCwtMC45MDg3NDk2IDAsLTEuODE3NDk5MiAtMC40NTQzNzQ4LC0wLjkwODc0OTYgbSAtMi43MjYyNDg4LDQuNTQzNzQ4IC0xLjgxNzQ5OTIsMC40NTQzNzQ4IC0wLjkwODc0OTYsMC45MDg3NDk2NCAtMC40NTQzNzQ4LDAuOTA4NzQ5NiAwLDEuMzYzMTI0MzYgMC40NTQzNzQ4LDAuOTA4NzQ5NiAxLjM2MzEyNDQsMC40NTQzNzQ4IDEuODE3NDk5MiwwIDEuODE3NDk5MiwtMC40NTQzNzQ4IDAuNDU0Mzc0OCwtMC40NTQzNzQ4IDAuNDU0Mzc0OCwtMC45MDg3NDk2IDAsLTEuMzYzMTI0MzYgLTAuNDU0Mzc0OCwtMC45MDg3NDk2IC0wLjQ1NDM3NDgsLTAuNDU0Mzc0ODQgLTAuOTA4NzQ5NiwtMC40NTQzNzQ4IG0gLTAuOTA4NzQ5NiwwIC0yLjI3MTg3NCwwLjQ1NDM3NDggbSAwLjQ1NDM3NDgsMCAtMC45MDg3NDk2LDAuOTA4NzQ5NjQgLTAuNDU0Mzc0OCwwLjkwODc0OTYgMCwxLjM2MzEyNDM2IDAuNDU0Mzc0OCwwLjkwODc0OTYgbSAtMC40NTQzNzQ4LDAgMi4yNzE4NzQsMC40NTQzNzQ4IDIuNzI2MjQ4OCwtMC40NTQzNzQ4IG0gMCwtMC40NTQzNzQ4IDAuNDU0Mzc0OCwtMC45MDg3NDk2IDAsLTEuMzYzMTI0MzYgLTAuNDU0Mzc0OCwtMC45MDg3NDk2IG0gMCwtMC40NTQzNzQ4NCAtMS4zNjMxMjQ0LC0wLjQ1NDM3NDggbSAtMC45MDg3NDk2LDAgLTAuOTA4NzQ5NiwwLjQ1NDM3NDggLTAuOTA4NzQ5NiwwLjkwODc0OTY0IC0wLjQ1NDM3NDgsMC45MDg3NDk2IDAsMS4zNjMxMjQzNiAwLjQ1NDM3NDgsMC45MDg3NDk2IDAuNDU0Mzc0OCwwLjQ1NDM3NDggbSAxLjgxNzQ5OTIsMCAwLjkwODc0OTYsLTAuNDU0Mzc0OCAwLjQ1NDM3NDgsLTAuNDU0Mzc0OCAwLjQ1NDM3NDgsLTAuOTA4NzQ5NiAwLC0xLjgxNzQ5OTE2IC0wLjQ1NDM3NDgsLTAuOTA4NzQ5NjQgLTAuNDU0Mzc0OCwtMC40NTQzNzQ4XCIpO1xuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocGF0aClcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE51bWJlciA5IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG51bWJlcjlTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gMzsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0xOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3QgcGF0aCA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMC40NTQ1NDU1LDAuOTA5MDkwOSAtMC40NTQ1NDU0LDAuNDU0NTQ1NSAtMC45MDkwOTA5LDAuNDU0NTQ1NDIgLTEuMzYzNjM2MzgsMCAtMC45MDkwOTA5MiwtMC40NTQ1NDU0MiAtMC40NTQ1NDU0LC0wLjQ1NDU0NTUgLTAuNDU0NTQ1NSwtMC45MDkwOTA5IDAsLTEuMzYzNjM2NCAwLjQ1NDU0NTUsLTAuOTA5MDkwOSAwLjkwOTA5MDg2LC0wLjkwOTA5MDkgMS4zNjM2MzYzNywtMC40NTQ1NDU0IDEuMzYzNjM2MzcsMCAwLjkwOTA5MDksMC40NTQ1NDU0IDAuNDU0NTQ1NSwwLjQ1NDU0NTUgMC40NTQ1NDU0LDEuMzYzNjM2MyAwLDEuMzYzNjM2NCAtMC40NTQ1NDU0LDEuODE4MTgxODIgLTAuNDU0NTQ1NSwxLjM2MzYzNjM3IC0wLjkwOTA5MDksMS4zNjM2MzY0MSAtMC45MDkwOTA5LDAuOTA5MDkwOSAtMS4zNjM2MzYzOCwwLjQ1NDU0NTQgLTEuMzYzNjM2MzIsMCAtMC45MDkwOTEsLTAuNDU0NTQ1NCAtMC40NTQ1NDU0LC0wLjkwOTA5MDkgMCwtMC45MDkwOTA5NiAwLjkwOTA5MDksMCAwLDAuOTA5MDkwOTYgLTAuNDU0NTQ1NSwwIDAsLTAuNDU0NTQ1NSBtIDEuMzYzNjM2NCwtMy4xODE4MTgyIC0wLjQ1NDU0NTQsLTAuOTA5MDkwOSAwLC0xLjM2MzYzNjQgMC40NTQ1NDU0LC0wLjkwOTA5MDkgbSA0LjA5MDkwOTEsLTAuNDU0NTQ1NCAwLjQ1NDU0NTUsMC45MDkwOTA5IDAsMS44MTgxODE4IC0wLjQ1NDU0NTUsMS44MTgxODE4MiAtMC40NTQ1NDU1LDEuMzYzNjM2MzcgLTAuOTA5MDkwOSwxLjM2MzYzNjQxIG0gLTEuODE4MTgxNzgsLTIuNzI3MjcyNzggLTAuNDU0NTQ1NDYsLTAuNDU0NTQ1NDIgLTAuNDU0NTQ1NDYsLTAuOTA5MDkwOSAwLC0xLjgxODE4MTkgMC40NTQ1NDU0NiwtMS4zNjM2MzYzIDAuNDU0NTQ1NDYsLTAuNDU0NTQ1NSAwLjkwOTA5MDkxLC0wLjQ1NDU0NTQgbSAxLjM2MzYzNjM3LDAgMC40NTQ1NDU0LDAuNDU0NTQ1NCAwLjQ1NDU0NTUsMC45MDkwOTA5IDAsMi4yNzI3MjczIC0wLjQ1NDU0NTUsMS44MTgxODE4MiAtMC40NTQ1NDU0LDEuMzYzNjM2MzcgLTAuNDU0NTQ1NSwwLjkwOTA5MDkxIC0wLjkwOTA5MDg3LDEuMzYzNjM2NCAtMC45MDkwOTA5MSwwLjQ1NDU0NTRcIik7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwYXRoKVxuXG4gICAgICByZXR1cm4gd3JhcHBlclxuICAgIH1cblxuICAgIC8qXG4gICAgICogTnVtYmVyIDEwIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG51bWJlcjEwU3ltYm9sKHhQb3MsIHlQb3MsIHNjYWxlID0gMSkge1xuICAgICAgY29uc3QgWF9TSElGVCA9IC0zOyAvL3B4XG4gICAgICBjb25zdCBZX1NISUZUID0gLTM7IC8vcHhcbiAgICAgIGNvbnN0IHggPSB4UG9zICsgWF9TSElGVCAqIHNjYWxlXG4gICAgICBjb25zdCB5ID0geVBvcyArIFlfU0hJRlQgKiBzY2FsZVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoLXggKiAoc2NhbGUgLSAxKSkgKyBcIixcIiArICgteSAqIChzY2FsZSAtIDEpKSArIFwiKSBzY2FsZShcIiArIHNjYWxlICsgXCIpXCIpO1xuXG4gICAgICBjb25zdCBvbmUgPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIG9uZS5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMi4yODc5NTc0Nyw3Ljc3OTA1NTMgMC45MTUxODI5NywwIG0gMi43NDU1NDg5LC05LjYwOTQyMTMgLTAuOTE1MTgyOSwxLjgzMDM2NiAtMi4yODc5NTc0OCw3Ljc3OTA1NTMgbSAzLjIwMzE0MDM4LC05LjYwOTQyMTMgLTIuNzQ1NTQ4OSw5LjYwOTQyMTMgbSAyLjc0NTU0ODksLTkuNjA5NDIxMyAtMS4zNzI3NzQ0LDEuMzcyNzc0NSAtMS4zNzI3NzQ1LDAuOTE1MTgzIC0wLjkxNTE4Mjk3LDAuNDU3NTkxNSBtIDIuMjg3OTU3NDcsLTAuOTE1MTgzIC0wLjkxNTE4MzAxLDAuNDU3NTkxNSAtMS4zNzI3NzQ0NiwwLjQ1NzU5MTVcIik7XG4gICAgICBvbmUuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG9uZSlcblxuICAgICAgY29uc3QgbnVtYmVyWFNoaWZ0ID0gNi41OyAvL3B4XG5cdFx0XHRjb25zdCBudW1iZXJZU2hpZnQgPSAtMS41OyAvL3B4XG4gICAgICBjb25zdCB6ZXJvID0gU1ZHVXRpbHMuU1ZHUGF0aCgpXG4gICAgICB6ZXJvLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyAoeCArIG51bWJlclhTaGlmdCkgKyBcIiwgXCIgKyAoeSArIG51bWJlcllTaGlmdCkgKyBcIiAtMS4zNjM2MzYzOCwwLjQ1NDU0NTQgLTAuOTA5MDkwOTIsMC45MDkwOTA5IC0wLjkwOTA5MDksMS4zNjM2MzY0IC0wLjQ1NDU0NTUsMS4zNjM2MzY0IC0wLjQ1NDU0NTQsMS44MTgxODE3OCAwLDEuMzYzNjM2MzYgMC40NTQ1NDU0LDEuMzYzNjM2MzYgMC40NTQ1NDU1LDAuNDU0NTQ1NSAwLjkwOTA5MDksMC40NTQ1NDU0IDAuOTA5MDkwOTIsMCAxLjM2MzYzNjM4LC0wLjQ1NDU0NTQgMC45MDkwOTA5LC0wLjkwOTA5MDkgMC45MDkwOTA5LC0xLjM2MzYzNjQxIDAuNDU0NTQ1NSwtMS4zNjM2MzYzNyAwLjQ1NDU0NTQsLTEuODE4MTgxODIgMCwtMS4zNjM2MzY0IC0wLjQ1NDU0NTQsLTEuMzYzNjM2MyAtMC40NTQ1NDU1LC0wLjQ1NDU0NTUgLTAuOTA5MDkwOSwtMC40NTQ1NDU0IC0wLjkwOTA5MDksMCBtIC0xLjM2MzYzNjM4LDAuOTA5MDkwOSAtMC45MDkwOTA5MiwwLjkwOTA5MDkgLTAuNDU0NTQ1NCwwLjkwOTA5MDkgLTAuNDU0NTQ1NSwxLjM2MzYzNjQgLTAuNDU0NTQ1NSwxLjgxODE4MTc4IDAsMS44MTgxODE4MiAwLjQ1NDU0NTUsMC45MDkwOTA5IG0gMy4xODE4MTgyLDAgMC45MDkwOTA5LC0wLjkwOTA5MDkgMC40NTQ1NDU0LC0wLjkwOTA5MDkxIDAuNDU0NTQ1NSwtMS4zNjM2MzYzNyAwLjQ1NDU0NTUsLTEuODE4MTgxODIgMCwtMS44MTgxODE4IC0wLjQ1NDU0NTUsLTAuOTA5MDkwOSBtIC0xLjgxODE4MTgsLTAuOTA5MDkwOSAtMC45MDkwOTA5MywwLjQ1NDU0NTQgLTAuOTA5MDkwOTEsMS4zNjM2MzY0IC0wLjQ1NDU0NTQ2LDAuOTA5MDkwOSAtMC40NTQ1NDU0LDEuMzYzNjM2NCAtMC40NTQ1NDU1LDEuODE4MTgxNzggMCwyLjI3MjcyNzMyIDAuNDU0NTQ1NSwwLjkwOTA5MDkgMC40NTQ1NDU0LDAuNDU0NTQ1NCBtIDAuOTA5MDkwOTIsMCAwLjkwOTA5MDkxLC0wLjQ1NDU0NTQgMC45MDkwOTA4NywtMS4zNjM2MzY0IDAuNDU0NTQ1NSwtMC45MDkwOTA5MSAwLjQ1NDU0NTQsLTEuMzYzNjM2MzcgMC40NTQ1NDU1LC0xLjgxODE4MTgyIDAsLTIuMjcyNzI3MyAtMC40NTQ1NDU1LC0wLjkwOTA5MDkgLTAuNDU0NTQ1NCwtMC40NTQ1NDU0XCIpO1xuICAgICAgemVyby5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoemVybylcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE51bWJlciAxMSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBudW1iZXIxMVN5bWJvbCh4UG9zLCB5UG9zLCBzY2FsZSA9IDEpIHtcbiAgICAgIGNvbnN0IFhfU0hJRlQgPSAtMjsgLy9weFxuICAgICAgY29uc3QgWV9TSElGVCA9IC0zOyAvL3B4XG4gICAgICBjb25zdCB4ID0geFBvcyArIFhfU0hJRlQgKiBzY2FsZVxuICAgICAgY29uc3QgeSA9IHlQb3MgKyBZX1NISUZUICogc2NhbGVcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKC14ICogKHNjYWxlIC0gMSkpICsgXCIsXCIgKyAoLXkgKiAoc2NhbGUgLSAxKSkgKyBcIikgc2NhbGUoXCIgKyBzY2FsZSArIFwiKVwiKTtcblxuICAgICAgY29uc3Qgb25lMSA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgb25lMS5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgeCArIFwiLCBcIiArIHkgKyBcIiAtMi41MTI4NzUzLDcuNzU3ODg4NCAxLjAwNTE1MDA5LDAgbSAzLjAxNTQ1MDMxLC05LjU4MzI3MzcgLTEuMDA1MTUwMSwxLjgyNTM4NTMgLTIuNTEyODc1MjcsNy43NTc4ODg0IG0gMy41MTgwMjUzNywtOS41ODMyNzM3IC0zLjAxNTQ1MDMxLDkuNTgzMjczNyBtIDMuMDE1NDUwMzEsLTkuNTgzMjczNyAtMS41MDc3MjUxLDEuMzY5MDM4OCAtMS41MDc3MjUyMSwwLjkxMjY5MjkgLTEuMDA1MTUwMDksMC40NTYzNDYzIG0gMi41MTI4NzUzLC0wLjkxMjY5MjcgLTEuMDA1MTUwMTYsMC40NTYzNDY0IC0xLjUwNzcyNTE0LDAuNDU2MzQ2M1wiKTtcbiAgICAgIG9uZTEuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG9uZTEpXG5cbiAgICAgIGNvbnN0IG51bWJlclhTaGlmdCA9IDY7IC8vcHhcblx0XHRcdGNvbnN0IG51bWJlcllTaGlmdCA9IDA7IC8vcHhcbiAgICAgIGNvbnN0IG9uZTIgPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIG9uZTIuc2V0QXR0cmlidXRlKFwiZFwiLCBcIm1cIiArICh4ICsgbnVtYmVyWFNoaWZ0KSArIFwiLCBcIiArICh5ICsgbnVtYmVyWVNoaWZ0KSArIFwiIC0yLjI4Nzk1NzQ3LDcuNzc5MDU1MyAwLjkxNTE4Mjk3LDAgbSAyLjc0NTU0ODksLTkuNjA5NDIxMyAtMC45MTUxODI5LDEuODMwMzY2IC0yLjI4Nzk1NzQ4LDcuNzc5MDU1MyBtIDMuMjAzMTQwMzgsLTkuNjA5NDIxMyAtMi43NDU1NDg5LDkuNjA5NDIxMyBtIDIuNzQ1NTQ4OSwtOS42MDk0MjEzIC0xLjM3Mjc3NDQsMS4zNzI3NzQ1IC0xLjM3Mjc3NDUsMC45MTUxODMgLTAuOTE1MTgyOTcsMC40NTc1OTE1IG0gMi4yODc5NTc0NywtMC45MTUxODMgLTAuOTE1MTgzMDEsMC40NTc1OTE1IC0xLjM3Mjc3NDQ2LDAuNDU3NTkxNVwiKTtcbiAgICAgIG9uZTIuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG9uZTIpXG5cbiAgICAgIHJldHVybiB3cmFwcGVyXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBOdW1iZXIgMTIgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbnVtYmVyMTJTeW1ib2woeFBvcywgeVBvcywgc2NhbGUgPSAxKSB7XG4gICAgICBjb25zdCBYX1NISUZUID0gLTI7IC8vcHhcbiAgICAgIGNvbnN0IFlfU0hJRlQgPSAtMzsgLy9weFxuICAgICAgY29uc3QgeCA9IHhQb3MgKyBYX1NISUZUICogc2NhbGVcbiAgICAgIGNvbnN0IHkgPSB5UG9zICsgWV9TSElGVCAqIHNjYWxlXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgteCAqIChzY2FsZSAtIDEpKSArIFwiLFwiICsgKC15ICogKHNjYWxlIC0gMSkpICsgXCIpIHNjYWxlKFwiICsgc2NhbGUgKyBcIilcIik7XG5cbiAgICAgIGNvbnN0IG9uZSA9IFNWR1V0aWxzLlNWR1BhdGgoKVxuICAgICAgb25lLnNldEF0dHJpYnV0ZShcImRcIiwgXCJtXCIgKyB4ICsgXCIsIFwiICsgeSArIFwiIC0yLjI4Nzk1NzQ3LDcuNzc5MDU1MyAwLjkxNTE4Mjk3LDAgbSAyLjc0NTU0ODksLTkuNjA5NDIxMyAtMC45MTUxODI5LDEuODMwMzY2IC0yLjI4Nzk1NzQ4LDcuNzc5MDU1MyBtIDMuMjAzMTQwMzgsLTkuNjA5NDIxMyAtMi43NDU1NDg5LDkuNjA5NDIxMyBtIDIuNzQ1NTQ4OSwtOS42MDk0MjEzIC0xLjM3Mjc3NDQsMS4zNzI3NzQ1IC0xLjM3Mjc3NDUsMC45MTUxODMgLTAuOTE1MTgyOTcsMC40NTc1OTE1IG0gMi4yODc5NTc0NywtMC45MTUxODMgLTAuOTE1MTgzMDEsMC40NTc1OTE1IC0xLjM3Mjc3NDQ2LDAuNDU3NTkxNVwiKTtcbiAgICAgIG9uZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQob25lKVxuXG4gICAgICBjb25zdCBudW1iZXJYU2hpZnQgPSA0OyAvL3B4XG5cdFx0XHRjb25zdCBudW1iZXJZU2hpZnQgPSAxOyAvL3B4XG4gICAgICBjb25zdCB0d28gPSBTVkdVdGlscy5TVkdQYXRoKClcbiAgICAgIHR3by5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwibVwiICsgKHggKyBudW1iZXJYU2hpZnQpICsgXCIsIFwiICsgKHkgKyBudW1iZXJZU2hpZnQpICsgXCIgMCwtMC40NTQ1NDU0IDAuNDU0NTQ1NCwwIDAsMC45MDkwOTA5IC0wLjkwOTA5MDksMCAwLC0wLjkwOTA5MDkgMC40NTQ1NDU1LC0wLjkwOTA5MDkgMC40NTQ1NDU0LC0wLjQ1NDU0NTUgMS4zNjM2MzYzNywtMC40NTQ1NDU0IDEuMzYzNjM2MzMsMCAxLjM2MzYzNjQsMC40NTQ1NDU0IDAuNDU0NTQ1NSwwLjkwOTA5MDkgMCwwLjkwOTA5MDkgLTAuNDU0NTQ1NSwwLjkwOTA5MSAtMC45MDkwOTA5LDAuOTA5MDkwOSAtNC41NDU0NTQ2LDIuNzI3MjcyNjkgLTAuOTA5MDkwOSwwLjkwOTA5MDkxIC0wLjkwOTA5MDksMS44MTgxODE4IG0gNi44MTgxODE4LC05LjA5MDkwOTEgMC40NTQ1NDU1LDAuOTA5MDkwOSAwLDAuOTA5MDkwOSAtMC40NTQ1NDU1LDAuOTA5MDkxIC0wLjkwOTA5MDksMC45MDkwOTA5IC0xLjM2MzYzNjMzLDAuOTA5MDkwOSBtIDEuMzYzNjM2MzMsLTUgMC40NTQ1NDU1LDAuNDU0NTQ1NCAwLjQ1NDU0NTQsMC45MDkwOTA5IDAsMC45MDkwOTA5IC0wLjQ1NDU0NTQsMC45MDkwOTEgLTAuOTA5MDkwOSwwLjkwOTA5MDkgLTMuNjM2MzYzNywyLjcyNzI3MjY5IG0gLTEuMzYzNjM2MywxLjgxODE4MTgxIDAuNDU0NTQ1NCwtMC40NTQ1NDU0IDAuOTA5MDkwOSwwIDIuMjcyNzI3MzIsMC40NTQ1NDU0IDIuMjcyNzI3MjgsMCAwLjQ1NDU0NTQsLTAuNDU0NTQ1NCBtIC01LDAgMi4yNzI3MjczMiwwLjkwOTA5MDkgMi4yNzI3MjcyOCwwIG0gLTQuNTQ1NDU0NiwtMC45MDkwOTA5IDIuMjcyNzI3MzIsMS4zNjM2MzYzIDEuMzYzNjM2MzgsMCAwLjkwOTA5MDksLTAuNDU0NTQ1NCAwLjQ1NDU0NTQsLTAuOTA5MDkwOSAwLC0wLjQ1NDU0NTVcIik7XG4gICAgICB0d28uc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHR3bylcblxuICAgICAgcmV0dXJuIHdyYXBwZXJcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgU1ZHVXRpbHMgYXNcbiAgZGVmYXVsdFxufVxuIiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgVXRpbGl0eSBjbGFzc1xuICogQHB1YmxpY1xuICogQHN0YXRpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBVdGlscyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBVdGlscykge1xuICAgICAgdGhyb3cgRXJyb3IoJ1RoaXMgaXMgYSBzdGF0aWMgY2xhc3MgYW5kIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQuJyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIERFR18zNjAgPSAzNjBcbiAgc3RhdGljIERFR18xODAgPSAxODBcblxuICAvKipcbiAgICogR2VuZXJhdGUgcmFuZG9tIElEXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdlbmVyYXRlVW5pcXVlSWQgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMTAwMDAwMDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHVuaXF1ZUlkID0gYGlkXyR7cmFuZG9tTnVtYmVyfV8ke3RpbWVzdGFtcH1gO1xuICAgIHJldHVybiB1bmlxdWVJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZlcnRlZCBkZWdyZWUgdG8gcmFkaWFuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5kZWdyZWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNoaWZ0SW5EZWdyZWVcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGRlZ3JlZVRvUmFkaWFuID0gZnVuY3Rpb24oYW5nbGVJbkRlZ3JlZSwgc2hpZnRJbkRlZ3JlZSA9IDApIHtcbiAgICByZXR1cm4gKHNoaWZ0SW5EZWdyZWUgLSBhbmdsZUluRGVncmVlKSAqIE1hdGguUEkgLyAxODBcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyByYWRpYW4gdG8gZGVncmVlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGlhblxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgcmFkaWFuVG9EZWdyZWUgPSBmdW5jdGlvbihyYWRpYW4pIHtcbiAgICByZXR1cm4gKHJhZGlhbiAqIDE4MCAvIE1hdGguUEkpXG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgY2lyY2xlLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gY3ggLSBjZW50ZXIgeFxuICAgKiBAcGFyYW0ge051bWJlcn0gY3kgLSBjZW50ZXIgeVxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1c1xuICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVJblJhZGlhbnNcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHt4Ok51bWJlciwgeTpOdW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgcG9zaXRpb25PbkNpcmNsZShjeCwgY3ksIHJhZGl1cywgYW5nbGVJblJhZGlhbnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKSArIGN4KSxcbiAgICAgIHk6IChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZUluUmFkaWFucykgKyBjeSlcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgbmV3IHBvc2l0aW9uIG9mIHBvaW50cyBvbiBjaXJjbGUgd2l0aG91dCBvdmVybGFwcGluZyBlYWNoIG90aGVyXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIElmIHRoZXJlIGlzIG5vIHBsYWNlIG9uIHRoZSBjaXJjbGUgdG8gcGxhY2UgcG9pbnRzLlxuICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgLSBbe25hbWU6XCJhXCIsIHBvc2l0aW9uOjEwfSwge25hbWU6XCJiXCIsIHBvc2l0aW9uOjIwfV1cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvbGxpc2lvblJhZGl1cyAtIHBvaW50IHJhZGl1c1xuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1c1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge1wiTW9vblwiOjMwLCBcIlN1blwiOjYwLCBcIk1lcmN1cnlcIjo4NiwgLi4ufVxuICAgKi9cbiAgc3RhdGljIGNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgY29sbGlzaW9uUmFkaXVzLCBjaXJjbGVSYWRpdXMpIHtcbiAgICBjb25zdCBTVEVQID0gMSAvL2RlZ3JlZVxuXG4gICAgY29uc3QgY2VsbFdpZHRoID0gMTAgLy9kZWdyZWVcbiAgICBjb25zdCBudW1iZXJPZkNlbGxzID0gVXRpbHMuREVHXzM2MCAvIGNlbGxXaWR0aFxuICAgIGNvbnN0IGZyZXF1ZW5jeSA9IG5ldyBBcnJheSggbnVtYmVyT2ZDZWxscyApLmZpbGwoMClcbiAgICBmb3IoY29uc3QgcG9pbnQgb2YgcG9pbnRzKXtcbiAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihwb2ludC5wb3NpdGlvbiAvIGNlbGxXaWR0aClcbiAgICAgIGZyZXF1ZW5jeVtpbmRleF0gKz0gMVxuICAgIH1cblxuICAgIC8vIEluIHRoaXMgYWxnb3JpdGhtIHRoZSBvcmRlciBvZiBwb2ludHMgaXMgY3J1Y2lhbC5cbiAgICAvLyBBdCB0aGF0IHBvaW50IGluIHRoZSBjaXJjbGUsIHdoZXJlIHRoZSBwZXJpb2QgY2hhbmdlcyBpbiB0aGUgY2lyY2xlIChmb3IgaW5zdGFuY2U6WzM1OCwzNTksMCwxXSksIHRoZSBwb2ludHMgYXJlIGFycmFuZ2VkIGluIGluY29ycmVjdCBvcmRlci5cbiAgICAvLyBBcyBhIHN0YXJ0aW5nIHBvaW50LCBJIHRyeSB0byBmaW5kIGEgcGxhY2Ugd2hlcmUgdGhlcmUgYXJlIG5vIHBvaW50cy4gVGhpcyBwbGFjZSBJIHVzZSBhcyBTVEFSVF9BTkdMRS4gIFxuICAgIGNvbnN0IFNUQVJUX0FOR0xFID0gY2VsbFdpZHRoICogZnJlcXVlbmN5LmZpbmRJbmRleCggY291bnQgPT4gY291bnQgPT0gMCApXG5cbiAgICBjb25zdCBfcG9pbnRzID0gcG9pbnRzLm1hcChwb2ludCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBwb2ludC5uYW1lLFxuICAgICAgICBwb3NpdGlvbjogcG9pbnQucG9zaXRpb24gPCBTVEFSVF9BTkdMRSA/IHBvaW50LnBvc2l0aW9uICsgVXRpbHMuREVHXzM2MCA6IHBvaW50LnBvc2l0aW9uXG4gICAgICB9XG4gICAgfSlcblxuICAgIF9wb2ludHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEucG9zaXRpb24gLSBiLnBvc2l0aW9uXG4gICAgfSlcblxuICAgIC8vIFJlY3Vyc2l2ZSBmdW5jdGlvblxuICAgIGNvbnN0IGFycmFuZ2VQb2ludHMgPSAoKSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbG4gPSBfcG9pbnRzLmxlbmd0aDsgaSA8IGxuOyBpKyspIHtcbiAgICAgICAgY29uc3QgcG9pbnRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoMCwgMCwgY2lyY2xlUmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihfcG9pbnRzW2ldLnBvc2l0aW9uKSlcbiAgICAgICAgX3BvaW50c1tpXS54ID0gcG9pbnRQb3NpdGlvbi54XG4gICAgICAgIF9wb2ludHNbaV0ueSA9IHBvaW50UG9zaXRpb24ueVxuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coX3BvaW50c1tpXS54IC0gX3BvaW50c1tqXS54LCAyKSArIE1hdGgucG93KF9wb2ludHNbaV0ueSAtIF9wb2ludHNbal0ueSwgMikpO1xuICAgICAgICAgIGlmIChkaXN0YW5jZSA8ICgyICogY29sbGlzaW9uUmFkaXVzKSkge1xuICAgICAgICAgICAgX3BvaW50c1tpXS5wb3NpdGlvbiArPSBTVEVQXG4gICAgICAgICAgICBfcG9pbnRzW2pdLnBvc2l0aW9uIC09IFNURVBcbiAgICAgICAgICAgIGFycmFuZ2VQb2ludHMoKSAvLz09PT09PT4gUmVjdXJzaXZlIGNhbGxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBhcnJhbmdlUG9pbnRzKClcblxuICAgIHJldHVybiBfcG9pbnRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIHBvaW50LCBjdXJyZW50SW5kZXgpID0+IHtcbiAgICAgIGFjY3VtdWxhdG9yW3BvaW50Lm5hbWVdID0gcG9pbnQucG9zaXRpb25cbiAgICAgIHJldHVybiBhY2N1bXVsYXRvclxuICAgIH0sIHt9KVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFV0aWxzIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFVuaXZlcnNlIGZyb20gJy4vdW5pdmVyc2UvVW5pdmVyc2UuanMnXG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi91dGlscy9TVkdVdGlscy5qcydcbmltcG9ydCBVdGlscyBmcm9tICcuL3V0aWxzL1V0aWxzLmpzJ1xuaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi9jaGFydHMvUmFkaXhDaGFydC5qcydcbmltcG9ydCBUcmFuc2l0Q2hhcnQgZnJvbSAnLi9jaGFydHMvVHJhbnNpdENoYXJ0LmpzJ1xuXG5leHBvcnQge1VuaXZlcnNlIGFzIFwiQ2hhcnRcIiwgU1ZHVXRpbHMsIFV0aWxzLCBSYWRpeENoYXJ0LCBUcmFuc2l0Q2hhcnR9XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=