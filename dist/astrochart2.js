/*!
 * 
 *       astrochart2
 *       A JavaScript for generating Astrology charts.
 *       Version: 0.3.0
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
      if (typeof point.angle !== 'number') {
        return {
          isValid: false,
          message: "point.angle !== 'number'"
        }
      }
    }

    for (let cusp of data.cusps) {
      if (typeof cusp.angle !== 'number') {
        return {
          isValid: false,
          message: "cusp.angle !== 'number'"
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

    this.#anscendantShift = (data.cusps[0].angle + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].DEG_180)
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
        angle: data.cusps[0].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_IC,
        angle: data.cusps[3].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_DS,
        angle: data.cusps[6].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MC,
        angle: data.cusps[9].angle
      },
    ])
    this.#drawPoints(data)
    this.#drawCusps(data)
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

      let symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(SYMBOL_SIGNS[symbolIndex], position.x, position.y)
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("text-anchor", "middle") // start, middle, end
      symbol.setAttribute("dominant-baseline", "middle")
      symbol.setAttribute("font-size", this.#settings.RADIX_SIGNS_FONT_SIZE);
      symbol.setAttribute("fill", this.#settings.CHART_SIGNS_COLOR);
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
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#radius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(axis.angle, this.#anscendantShift))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#radius + AXIS_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(axis.angle, this.#anscendantShift))
      let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
      wrapper.appendChild(line);

      let textPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#radius + AXIS_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(axis.angle, this.#anscendantShift))
      let symbol;
      let SHIFT_X = 0;
      let SHIFT_Y = 0;
      const STEP = 2
      switch (axis.name) {
        case "As":
          SHIFT_X -= STEP
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "end")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Ds":
          SHIFT_X += STEP
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "start")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Mc":
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "text-top")
          break;
        case "Ic":
          SHIFT_Y += STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "hanging")
          break;
        default:
          console.error(axis.name)
          throw new Error("Unknown axis name.")
      }
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("font-size", this.#settings.RADIX_AXIS_FONT_SIZE);
      symbol.setAttribute("fill", this.#settings.CHART_SIGNS_COLOR);

      wrapper.appendChild(symbol);
    }

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw points
   * @param {Object} data - chart data
   */
  #drawPoints(data) {
    const points = data.points
    const cusps = data.cusps
    const POINT_RADIUS = this.#innerCircleRadius - (4 * RadixChart.RULER_LENGTH)

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, POINT_RADIUS)
    for (const pointData of points) {
      const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_3__["default"](pointData, cusps, this.#settings)
      const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#innerCircleRadius - 1.5 * RadixChart.RULER_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(point.getAngle(), this.#anscendantShift))
      const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, POINT_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(positions[point.getName()], this.#anscendantShift))

      // ruler mark
      const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#rullerCircleRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(point.getAngle(), this.#anscendantShift))
      const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
      rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(rulerLine);

      // symbol
      const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y)
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("text-anchor", "middle") // start, middle, end
      symbol.setAttribute("dominant-baseline", "middle")
      symbol.setAttribute("font-size", this.#settings.RADIX_POINTS_FONT_SIZE)
      symbol.setAttribute("fill", this.#settings.CHART_POINTS_COLOR)
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
   * @param {Object} data - chart data
   */
  #drawCusps(data) {
    const points = data.points
    const cusps = data.cusps

    const pointsPositions = points.map(point => {
      return point.angle
    })

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const textRadius = this.#radius / RadixChart.OUTER_CIRCLE_RADIUS_RATIO + 1.8 * RadixChart.RULER_LENGTH

    for (let i = 0; i < cusps.length; i++) {
      const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#centerCircleRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(cusps[i].angle, this.#anscendantShift))
      const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(cusps[i].angle, this.#anscendantShift))

      const isLineInCollisionWithPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)
      const endPosX = isLineInCollisionWithPoint ? (startPos.x + endPos.x) / 2 : endPos.x
      const endPosY = isLineInCollisionWithPoint ? (startPos.y + endPos.y) / 2 : endPos.y
      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGLine(startPos.x, startPos.y, endPosX, endPosY)
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR)
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE)
      wrapper.appendChild(line);

      const startCusp = cusps[i].angle
      const endCusp = cusps[(i + 1) % 12].angle
      const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].DEG_360
      const textAngle = startCusp + gap / 2

      const textPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(this.#centerX, this.#centerY, textRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(textAngle, this.#anscendantShift))
      const text = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(textPos.x, textPos.y, `${i+1}`)
      text.setAttribute("text-anchor", "middle") // start, middle, end
      text.setAttribute("dominant-baseline", "middle")
      text.setAttribute("font-size", this.#settings.RADIX_POINTS_FONT_SIZE / 2)
      text.setAttribute("fill", this.#settings.CHART_TEXT_COLOR)
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
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");



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
   * @param {Boolean} [isProperties] - angleInSign, dignities, retrograde
   *
   * @return {SVGElement}
   */
  getSymbol(xPos, yPos, isProperties = true) {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(this.#name, xPos, yPos)
    wrapper.appendChild(symbol)

    if (this.#settings.POINT_PROPERTIES_SHOW == false) {
      return wrapper //======>
    }

    const chartCenterX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    const chartCenterY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    const angleFromSymbolToCenter = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionToAngle(xPos, yPos, chartCenterX, chartCenterY)

    // point properties - angle in sign
    const textRadius = 1.8 * this.#settings.POINT_COLLISION_RADIUS
    const textPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, textRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter))
    const textWrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()
    // It is possible to rotate the text, when uncomment a line bellow.
    //textWrapper.setAttribute("transform", `rotate(${angleFromSymbolToCenter},${textPosition.x},${textPosition.y})`)
    const text = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(textPosition.x, textPosition.y, this.getAngleInSign())
    text.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
    text.setAttribute("text-anchor", "middle") // start, middle, end
    text.setAttribute("dominant-baseline", "middle")
    text.setAttribute("font-size", this.#settings.POINT_PROPERTIES_FONT_SIZE);
    text.setAttribute("fill", this.#settings.POINT_PROPERTIES_COLOR);
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
/* harmony import */ var _constants_Point_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants/Point.js */ "./src/settings/constants/Point.js");
/* harmony import */ var _constants_Colors_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants/Colors.js */ "./src/settings/constants/Colors.js");






const SETTINGS = Object.assign({}, _constants_Universe_js__WEBPACK_IMPORTED_MODULE_0__, _constants_Radix_js__WEBPACK_IMPORTED_MODULE_1__, _constants_Transit_js__WEBPACK_IMPORTED_MODULE_2__, _constants_Point_js__WEBPACK_IMPORTED_MODULE_3__, _constants_Colors_js__WEBPACK_IMPORTED_MODULE_4__);




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
/* harmony export */   "CHART_MAIN_AXIS_COLOR": () => (/* binding */ CHART_MAIN_AXIS_COLOR),
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
/* harmony export */   "COLOR_VIRGO": () => (/* binding */ COLOR_VIRGO),
/* harmony export */   "POINT_PROPERTIES_COLOR": () => (/* binding */ POINT_PROPERTIES_COLOR)
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
const CHART_TEXT_COLOR = "#999";

/*
* Default color of mqin axis - As, Ds, Mc, Ic
* @constant
* @type {String}
* @default #000
*/
const CHART_MAIN_AXIS_COLOR = "#000";

/*
* Default color of signs in charts (arise symbol, taurus symbol, ...)
* @constant
* @type {String}
* @default #000
*/
const CHART_SIGNS_COLOR = "#333";

/*
* Default color of signs in charts (arise symbol, taurus symbol, ...)
* @constant
* @type {String}
* @default #000
*/
const CHART_POINTS_COLOR = "#000";

/*
* Default color for point properties - angle in sign, dignities, retrograde
* @constant
* @type {String}
* @default #333
*/
const POINT_PROPERTIES_COLOR = "#333"

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

/***/ "./src/settings/constants/Point.js":
/*!*****************************************!*\
  !*** ./src/settings/constants/Point.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "POINT_COLLISION_RADIUS": () => (/* binding */ POINT_COLLISION_RADIUS),
/* harmony export */   "POINT_PROPERTIES_FONT_SIZE": () => (/* binding */ POINT_PROPERTIES_FONT_SIZE),
/* harmony export */   "POINT_PROPERTIES_SHOW": () => (/* binding */ POINT_PROPERTIES_SHOW)
/* harmony export */ });
/*
* Point propertie - angle in sign, dignities, retrograde
* @constant
* @type {Boolean}
* @default true
*/
const POINT_PROPERTIES_SHOW = true

/*
* Text size of Point description - angle in sign, dignities, retrograde
* @constant
* @type {Number}
* @default 6
*/
const POINT_PROPERTIES_FONT_SIZE = 12

/**
* A point collision radius
* @constant
* @type {Number}
* @default 2
*/
const POINT_COLLISION_RADIUS = 12


/***/ }),

/***/ "./src/settings/constants/Radix.js":
/*!*****************************************!*\
  !*** ./src/settings/constants/Radix.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RADIX_AXIS_FONT_SIZE": () => (/* binding */ RADIX_AXIS_FONT_SIZE),
/* harmony export */   "RADIX_ID": () => (/* binding */ RADIX_ID),
/* harmony export */   "RADIX_POINTS_FONT_SIZE": () => (/* binding */ RADIX_POINTS_FONT_SIZE),
/* harmony export */   "RADIX_SIGNS_FONT_SIZE": () => (/* binding */ RADIX_SIGNS_FONT_SIZE)
/* harmony export */ });
/*
* Radix chart element ID
* @constant
* @type {String}
* @default radix
*/
const RADIX_ID = "radix"

/*
* Font size - points (planets)
* @constant
* @type {Number}
* @default 24
*/
const RADIX_POINTS_FONT_SIZE = 36

/*
* Font size - signs
* @constant
* @type {Number}
* @default 24
*/
const RADIX_SIGNS_FONT_SIZE = 32

/*
* Font size - axis (As, Ds, MC, IC)
* @constant
* @type {Number}
* @default 24
*/
const RADIX_AXIS_FONT_SIZE = 32


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
/* harmony export */   "CHART_FONT_FAMILY": () => (/* binding */ CHART_FONT_FAMILY),
/* harmony export */   "CHART_MAIN_STROKE": () => (/* binding */ CHART_MAIN_STROKE),
/* harmony export */   "CHART_PADDING": () => (/* binding */ CHART_PADDING),
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

/**
* Font family
* @constant
* @type {String}
* @default
*/
const CHART_FONT_FAMILY = "Astronomicon";


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

    this.#loadFont( new FontFace('Astronomicon', 'url(../assets/fonts/ttf/AstronomiconFonts_1.1/Astronomicon.ttf)') )

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

  /**
   * Get root SVG document
   * @return {SVGDocument}
   */
  getSVGDocument() {
    return this.#SVGDocument
  }

  // ## PRIVATE ##############################

  /*
  * Load fond to DOM
  */
  async #loadFont( font ){
    try{
      await font.load();
      document.fonts.add(font)
    }catch(e){
      throw new Error(e)
    }
  }
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

  static SYMBOL_SUN = "Sun";
  static SYMBOL_MOON = "Moon";
  static SYMBOL_MERCURY = "Mercury";
  static SYMBOL_VENUS = "Venus";
  static SYMBOL_EARTH = "Earth";
  static SYMBOL_MARS = "Mars";
  static SYMBOL_JUPITER = "Jupiter";
  static SYMBOL_SATURN = "Saturn";
  static SYMBOL_URANUS = "Uranus";
  static SYMBOL_NEPTUNE = "Neptune";
  static SYMBOL_PLUTO = "Pluto";
  static SYMBOL_CHIRON = "Chiron";
  static SYMBOL_LILITH = "Lilith";
  static SYMBOL_NNODE = "NNode";
  static SYMBOL_SNODE = "SNode";

  static SYMBOL_AS = "As";
  static SYMBOL_DS = "Ds";
  static SYMBOL_MC = "Mc";
  static SYMBOL_IC = "Ic";

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
   * SVG text
   *
   * @param {Number} x
   * @param {Number} y
   * @param {String} txt
   * @param {Number} [scale]
   *
   * @return {SVGElement} line
   */
  static SVGText(x, y, txt) {
    const text = document.createElementNS(SVGUtils.SVG_NAMESPACE, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("stroke", "none");    
    text.appendChild(document.createTextNode(txt));

    return text;
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
      case SVGUtils.SYMBOL_EARTH:
        return earthSymbol(xPos, yPos)
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
      case SVGUtils.SYMBOL_SNODE:
        return snodeSymbol(xPos, yPos)
        break;

      default:
        const unknownSymbol = SVGUtils.SVGCircle(xPos, yPos, 8)
        unknownSymbol.setAttribute("stroke", "#333")
        return unknownSymbol
    }

    /*
     * Ascendant symbol
     */
    function asSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "c")
    }

    /*
     * Descendant symbol
     */
    function dsSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "e")
    }

    /*
     * Medium coeli symbol
     */
    function mcSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "d")
    }

    /*
     * Immum coeli symbol
     */
    function icSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "e")
    }

    /*
     * Aries symbol
     */
    function ariesSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "A")
    }

    /*
     * Taurus symbol
     */
    function taurusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "B")
    }

    /*
     * Gemini symbol
     */
    function geminiSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "C")
    }

    /*
     * Cancer symbol
     */
    function cancerSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "D")
    }

    /*
     * Leo symbol
     */
    function leoSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "E")
    }

    /*
     * Virgo symbol
     */
    function virgoSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "F")
    }

    /*
     * Libra symbol
     */
    function libraSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "G")
    }

    /*
     * Scorpio symbol
     */
    function scorpioSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "H")
    }

    /*
     * Sagittarius symbol
     */
    function sagittariusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "I")
    }

    /*
     * Capricorn symbol
     */
    function capricornSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "J")
    }

    /*
     * Aquarius symbol
     */
    function aquariusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "K")
    }

    /*
     * Pisces symbol
     */
    function piscesSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "L")
    }

    /*
     * Sun symbol
     */
    function sunSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "Q")
    }

    /*
     * Moon symbol
     */
    function moonSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "R")
    }

    /*
     * Mercury symbol
     */
    function mercurySymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "S")
    }

    /*
     * Venus symbol
     */
    function venusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "T")
    }

    /*
     * Earth symbol
     */
    function earthSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, ">")
    }

    /*
     * Mars symbol
     */
    function marsSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "U")
    }

    /*
     * Jupiter symbol
     */
    function jupiterSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "V")
    }

    /*
     * Saturn symbol
     */
    function saturnSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "W")
    }

    /*
     * Uranus symbol
     */
    function uranusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "X")
    }

    /*
     * Neptune symbol
     */
    function neptuneSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "Y")
    }

    /*
     * Pluto symbol
     */
    function plutoSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "Z")
    }

    /*
     * Chiron symbol
     */
    function chironSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "q")
    }

    /*
     * Lilith symbol
     */
    function lilithSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "z")
    }

    /*
     * NNode symbol
     */
    function nnodeSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "g")
    }

    /*
     * SNode symbol
     */
    function snodeSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, "i")
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
  * Calculates the angle between the line (2 points) and the x-axis.
  *
  * @param {Number} x1
  * @param {Number} y1
  * @param {Number} x2
  * @param {Number} y2
  *
  * @return {Number} - degree
  */
  static positionToAngle(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angleInRadians = Math.atan2(dy, dx);
    return Utils.radianToDegree(angleInRadians)
  }

  /**
   * Calculates new position of points on circle without overlapping each other
   *
   * @throws {Error} - If there is no place on the circle to place points.
   * @param {Array} points - [{name:"a", angle:10}, {name:"b", angle:20}]
   * @param {Number} collisionRadius - point radius
   * @param {Number} radius - circle radius
   *
   * @return {Object} - {"Moon":30, "Sun":60, "Mercury":86, ...}
   */
  static calculatePositionWithoutOverlapping(points, collisionRadius, circleRadius) {
    const STEP = 1 //degree

    const cellWidth = 10 //degree
    const numberOfCells = Utils.DEG_360 / cellWidth
    const frequency = new Array(numberOfCells).fill(0)
    for (const point of points) {
      const index = Math.floor(point.angle / cellWidth)
      frequency[index] += 1
    }

    // In this algorithm the order of points is crucial.
    // At that point in the circle, where the period changes in the circle (for instance:[358,359,0,1]), the points are arranged in incorrect order.
    // As a starting point, I try to find a place where there are no points. This place I use as START_ANGLE.
    const START_ANGLE = cellWidth * frequency.findIndex(count => count == 0)

    const _points = points.map(point => {
      return {
        name: point.name,
        angle: point.angle < START_ANGLE ? point.angle + Utils.DEG_360 : point.angle
      }
    })

    _points.sort((a, b) => {
      return a.angle - b.angle
    })

    // Recursive function
    const arrangePoints = () => {
      for (let i = 0, ln = _points.length; i < ln; i++) {
        const pointPosition = Utils.positionOnCircle(0, 0, circleRadius, Utils.degreeToRadian(_points[i].angle))
        _points[i].x = pointPosition.x
        _points[i].y = pointPosition.y

        for (let j = 0; j < i; j++) {
          const distance = Math.sqrt(Math.pow(_points[i].x - _points[j].x, 2) + Math.pow(_points[i].y - _points[j].y, 2));
          if (distance < (2 * collisionRadius)) {
            _points[i].angle += STEP
            _points[j].angle -= STEP
            arrangePoints() //======> Recursive call
          }
        }
      }
    }

    arrangePoints()

    return _points.reduce((accumulator, point, currentIndex) => {
      accumulator[point.name] = point.angle
      return accumulator
    }, {})
  }

  /**
   * Check if the angle collides with the points
   *
   * @param {Number} angle
   * @param {Array} anglesList
   * @param {Number} [collisionRadius]
   *
   * @return {Boolean}
   */
  static isCollision(angle, anglesList, collisionRadius = 10) {

    const pointInCollision = anglesList.find(point => {

      let a = (point - angle) > Utils.DEG_180 ? angle + Utils.DEG_360 : angle
      let p = (angle - point) > Utils.DEG_180 ? point + Utils.DEG_360 : point

      return Math.abs(a - p) <= collisionRadius
    })

    return pointInCollision === undefined ? false : true
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0cm9jaGFydDIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOzs7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixjQUFjLFFBQVEsR0FBRztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqSTJDO0FBQ047QUFDUjtBQUNROztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLHlCQUF5QixpREFBSzs7QUFFOUI7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhLFFBQVE7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQixtRUFBaUI7QUFDbEMscUNBQXFDLCtCQUErQixHQUFHLHdCQUF3QjtBQUMvRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbURBQW1ELCtEQUFhO0FBQ2hFO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLG9FQUFrQjtBQUNoQztBQUNBLE9BQU87QUFDUDtBQUNBLGNBQWMsb0VBQWtCO0FBQ2hDO0FBQ0EsT0FBTztBQUNQO0FBQ0EsY0FBYyxvRUFBa0I7QUFDaEM7QUFDQSxPQUFPO0FBQ1A7QUFDQSxjQUFjLG9FQUFrQjtBQUNoQztBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLCtCQUErQixHQUFHLHdCQUF3Qjs7QUFFakYsb0JBQW9CLG1FQUFpQjs7QUFFckMsaUJBQWlCLGtFQUFnQjtBQUNqQyx3QkFBd0Isb0VBQWtCO0FBQzFDO0FBQ0E7O0FBRUEsd0JBQXdCLG9FQUFrQjtBQUMxQztBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLG9FQUFrQjtBQUNyQztBQUNBLG9GQUFvRixRQUFRO0FBQzVGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsdUVBQXFCLEVBQUUsd0VBQXNCLEVBQUUsd0VBQXNCLEVBQUUsd0VBQXNCLEVBQUUscUVBQW1CLEVBQUUsdUVBQXFCLEVBQUUsdUVBQXFCLEVBQUUseUVBQXVCLEVBQUUsNkVBQTJCLEVBQUUsMkVBQXlCLEVBQUUsMEVBQXdCLEVBQUUsd0VBQXNCOztBQUU3VDtBQUNBLHFCQUFxQix3RUFBc0IseUdBQXlHLHNFQUFvQjs7QUFFeEssbUJBQW1CLG9FQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsc0VBQW9CO0FBQ25DLGVBQWUsc0VBQW9CO0FBQ25DLG9CQUFvQixxRUFBbUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQixtRUFBaUI7O0FBRXJDLG9CQUFvQixrQ0FBa0M7O0FBRXREO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLG1FQUFpQjs7QUFFckM7QUFDQSxvQkFBb0Isd0JBQXdCO0FBQzVDLHVCQUF1Qix3RUFBc0IseURBQXlELHNFQUFvQjtBQUMxSCxxQkFBcUIsd0VBQXNCLGlHQUFpRyxzRUFBb0I7QUFDaEssbUJBQW1CLGtFQUFnQjtBQUNuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxtQkFBbUIsb0VBQWtCO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixtRUFBaUI7O0FBRXJDO0FBQ0EsdUJBQXVCLHdFQUFzQiw2Q0FBNkMsc0VBQW9CO0FBQzlHLHFCQUFxQix3RUFBc0IsMkRBQTJELHNFQUFvQjtBQUMxSCxpQkFBaUIsa0VBQWdCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0Isd0VBQXNCLDJEQUEyRCxzRUFBb0I7QUFDM0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixvRUFBa0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG9FQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG9FQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG9FQUFrQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixtRUFBaUI7O0FBRXJDLHNCQUFzQiwyRkFBeUM7QUFDL0Q7QUFDQSx3QkFBd0Isd0RBQUs7QUFDN0IsNEJBQTRCLHdFQUFzQix3RkFBd0Ysc0VBQW9CO0FBQzlKLDZCQUE2Qix3RUFBc0IsNkNBQTZDLHNFQUFvQjs7QUFFcEg7QUFDQSxtQ0FBbUMsd0VBQXNCLHlEQUF5RCxzRUFBb0I7QUFDdEksd0JBQXdCLGtFQUFnQjtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUNBQXFDLHdFQUFzQiw2Q0FBNkMsc0VBQW9CO0FBQzVILDBCQUEwQixrRUFBZ0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMLG9CQUFvQixtRUFBaUI7O0FBRXJDOztBQUVBLG9CQUFvQixrQkFBa0I7QUFDdEMsdUJBQXVCLHdFQUFzQix5REFBeUQsc0VBQW9CO0FBQzFILHFCQUFxQix3RUFBc0IseURBQXlELHNFQUFvQjs7QUFFeEgseUNBQXlDLG1FQUFpQjtBQUMxRDtBQUNBO0FBQ0EsbUJBQW1CLGtFQUFnQjtBQUNuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdGQUF3RiwrREFBYTtBQUNyRzs7QUFFQSxzQkFBc0Isd0VBQXNCLDJDQUEyQyxzRUFBb0I7QUFDM0csbUJBQW1CLGtFQUFnQiwwQkFBMEIsSUFBSTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQixtRUFBaUI7O0FBRXJDLHdCQUF3QixvRUFBa0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBLHdCQUF3QixvRUFBa0I7QUFDMUM7QUFDQTtBQUNBOztBQUVBLHlCQUF5QixvRUFBa0I7QUFDM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFLQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2WjJDO0FBQ2Q7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsMkJBQTJCLGlEQUFLOztBQUVoQztBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLGFBQWE7QUFDMUIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQSxpQkFBaUIsbUVBQWlCO0FBQ2xDLHFDQUFxQywrQkFBK0IsR0FBRywwQkFBMEI7QUFDakc7QUFDQTs7QUFFQTs7QUFFQTs7QUFLQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3QzJDO0FBQ047O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLFFBQVEsYUFBYTtBQUNsQyxhQUFhLFFBQVEsU0FBUyxhQUFhLEdBQUcsYUFBYSxHQUFHLGFBQWE7QUFDM0UsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxTQUFTO0FBQ3RCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxvQkFBb0IsbUVBQWlCOztBQUVyQyxtQkFBbUIsb0VBQWtCO0FBQ3JDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBQW9DLHVFQUFxQjs7QUFFekQ7QUFDQTtBQUNBLHlCQUF5Qix3RUFBc0IseUJBQXlCLHNFQUFvQjtBQUM1Rix3QkFBd0IsbUVBQWlCO0FBQ3pDO0FBQ0Esc0RBQXNELHdCQUF3QixHQUFHLGVBQWUsR0FBRyxlQUFlO0FBQ2xILGlCQUFpQixrRUFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBS0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUlrRDtBQUNOO0FBQ0k7QUFDSjtBQUNFOztBQUUvQyxpQ0FBaUMsRUFBRSxtREFBUSxFQUFFLGdEQUFLLEVBQUUsa0RBQU8sRUFBRSxnREFBSyxFQUFFLGlEQUFNOztBQUt6RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNYRDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0S1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7QUM5QlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeERzRDtBQUNqQjtBQUNOO0FBQ1c7QUFDSTs7O0FBR3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLHlDQUF5Qzs7QUFFekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUMsRUFBRSxvRUFBZTtBQUN0RDtBQUNBLEtBQUs7QUFDTCx3QkFBd0Isc0VBQW9CO0FBQzVDOztBQUVBLHNCQUFzQiw2REFBVTtBQUNoQyx3QkFBd0IsK0RBQVk7O0FBRXBDOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFLQzs7Ozs7Ozs7Ozs7Ozs7O0FDcEdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBS0M7Ozs7Ozs7Ozs7Ozs7OztBQ3pnQkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsYUFBYSxHQUFHLFVBQVU7QUFDckQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjLFFBQVEsR0FBRztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixZQUFZLFFBQVE7QUFDcEI7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGFBQWEsT0FBTyxXQUFXLG1CQUFtQixHQUFHLG1CQUFtQjtBQUN4RSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYyxRQUFRLEdBQUc7QUFDekI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSwyQ0FBMkMsUUFBUTtBQUNuRDtBQUNBO0FBQ0E7O0FBRUEsd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUssSUFBSTtBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLE9BQU87QUFDcEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUtDOzs7Ozs7O1VDakxEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QztBQUNIO0FBQ047QUFDVztBQUNJOztBQUVvQiIsInNvdXJjZXMiOlsid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9DaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1JhZGl4Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3BvaW50cy9Qb2ludC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvQ29sb3JzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9SYWRpeC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1RyYW5zaXQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdW5pdmVyc2UvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL1NWR1V0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9VdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYXN0cm9sb2d5XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiBhYnN0cmFjdCBjbGFzcyBmb3IgYWxsIHR5cGUgb2YgQ2hhcnRcbiAqIEBwdWJsaWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBhYnN0cmFjdFxuICovXG5jbGFzcyBDaGFydCB7XG5cbiAgLy8jc2V0dGluZ3NcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgIC8vdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBkYXRhIGlzIHZhbGlkXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIHVuZGVmaW5lZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHtpc1ZhbGlkOmJvb2xlYW4sIG1lc3NhZ2U6U3RyaW5nfVxuICAgKi9cbiAgdmFsaWRhdGVEYXRhKGRhdGEpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc2luZyBwYXJhbSBkYXRhLlwiKVxuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLnBvaW50cykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcInBvaW50cyBpcyBub3QgQXJyYXkuXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5jdXNwcykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcImN1cHMgaXMgbm90IEFycmF5LlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY3VzcHMubGVuZ3RoICE9PSAxMikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwiY3VzcHMubGVuZ3RoICE9PSAxMlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgcG9pbnQgb2YgZGF0YS5wb2ludHMpIHtcbiAgICAgIGlmICh0eXBlb2YgcG9pbnQubmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50Lm5hbWUgIT09ICdzdHJpbmcnXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBvaW50Lm5hbWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lLmxlbmd0aCA9PSAwXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBwb2ludC5hbmdsZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50LmFuZ2xlICE9PSAnbnVtYmVyJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBjdXNwIG9mIGRhdGEuY3VzcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgY3VzcC5hbmdsZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImN1c3AuYW5nbGUgIT09ICdudW1iZXInXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgICAgbWVzc2FnZTogXCJcIlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHNldERhdGEoZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnRzKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0UG9pbnQobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0QXNwZWN0cygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGFuaW1hdGVUbyhkYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvLyAjIyBQUk9URUNURUQgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbn1cblxuZXhwb3J0IHtcbiAgQ2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgQ2hhcnQgZnJvbSAnLi9DaGFydC5qcydcbmltcG9ydCBQb2ludCBmcm9tICcuLi9wb2ludHMvUG9pbnQuanMnXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBvaW50cyBhbmQgY3VwcyBhcmUgZGlzcGxheWVkIGluc2lkZSB0aGUgVW5pdmVyc2UuXG4gKiBAcHVibGljXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XG4gKi9cbmNsYXNzIFJhZGl4Q2hhcnQgZXh0ZW5kcyBDaGFydCB7XG5cbiAgLypcbiAgICogSW5uZXIgY2lyY2xlIHJhZGl1cyByYXRpb1xuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgOFxuICAgKi9cbiAgc3RhdGljIElOTkVSX0NJUkNMRV9SQURJVVNfUkFUSU8gPSA4O1xuXG4gIC8qXG4gICAqIE91dGVyIGNpcmNsZSByYWRpdXMgcmF0aW9cbiAgICogQGNvbnN0YW50XG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDJcbiAgICovXG4gIHN0YXRpYyBPVVRFUl9DSVJDTEVfUkFESVVTX1JBVElPID0gMjtcblxuXG4gIC8qXG4gICAqIFRoZSBsZW5ndGggb2YgdGhlIHBvaW50ZXJzIGluIHRoZSBydWxlclxuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMTBcbiAgICovXG4gIHN0YXRpYyBSVUxFUl9MRU5HVEggPSAxMFxuXG4gICNzZXR0aW5nc1xuICAjcm9vdFxuXG4gIC8qXG4gICAqIFNoaWZ0IHRoZSBBc2NlbmRhbnQgdG8gdGhlIDAgZGVncmVlIG9uIFRoZSBDaGFydFxuICAgKi9cbiAgI2Fuc2NlbmRhbnRTaGlmdFxuICAjY2VudGVyWFxuICAjY2VudGVyWVxuICAjcmFkaXVzXG4gICNpbm5lckNpcmNsZVJhZGl1c1xuICAjY2VudGVyQ2lyY2xlUmFkaXVzXG4gICNydWxsZXJDaXJjbGVSYWRpdXNcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtTVkdEb2N1bWVudH0gU1ZHRG9jdW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihTVkdEb2N1bWVudCwgc2V0dGluZ3MpIHtcblxuICAgIGlmICghU1ZHRG9jdW1lbnQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBTVkdEb2N1bWVudC4nKVxuICAgIH1cblxuICAgIGlmICghc2V0dGluZ3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHNldHRpbmdzLicpXG4gICAgfVxuXG4gICAgc3VwZXIoc2V0dGluZ3MpXG5cbiAgICB0aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuICAgIHRoaXMuI2lubmVyQ2lyY2xlUmFkaXVzID0gdGhpcy4jcmFkaXVzIC0gdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPXG4gICAgdGhpcy4jY2VudGVyQ2lyY2xlUmFkaXVzID0gdGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5PVVRFUl9DSVJDTEVfUkFESVVTX1JBVElPXG4gICAgdGhpcy4jcnVsbGVyQ2lyY2xlUmFkaXVzID0gdGhpcy4jcmFkaXVzIC0gKHRoaXMuI3JhZGl1cyAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTyArIFJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RIKVxuXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH1gKVxuICAgIFNWR0RvY3VtZW50LmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2VzKVxuICAgIH1cblxuICAgIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCA9IChkYXRhLmN1c3BzWzBdLmFuZ2xlICsgVXRpbHMuREVHXzE4MClcbiAgICB0aGlzLiNkcmF3KGRhdGEpXG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qXG4gICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gICNkcmF3KGRhdGEpIHtcbiAgICB0aGlzLiNkcmF3QmFja2dyb3VuZCgpXG4gICAgdGhpcy4jZHJhd0FzdHJvbG9naWNhbFNpZ25zKClcbiAgICB0aGlzLiNkcmF3UnVsZXIoKVxuICAgIHRoaXMuI2RyYXdNYWluQXhpcyhbe1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfQVMsXG4gICAgICAgIGFuZ2xlOiBkYXRhLmN1c3BzWzBdLmFuZ2xlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfSUMsXG4gICAgICAgIGFuZ2xlOiBkYXRhLmN1c3BzWzNdLmFuZ2xlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfRFMsXG4gICAgICAgIGFuZ2xlOiBkYXRhLmN1c3BzWzZdLmFuZ2xlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfTUMsXG4gICAgICAgIGFuZ2xlOiBkYXRhLmN1c3BzWzldLmFuZ2xlXG4gICAgICB9LFxuICAgIF0pXG4gICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhKVxuICAgIHRoaXMuI2RyYXdDdXNwcyhkYXRhKVxuICAgIHRoaXMuI2RyYXdCb3JkZXJzKClcbiAgfVxuXG4gICNkcmF3QmFja2dyb3VuZCgpIHtcbiAgICBjb25zdCBNQVNLX0lEID0gYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfS1iYWNrZ3JvdW5kLW1hc2stMWBcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCBtYXNrID0gU1ZHVXRpbHMuU1ZHTWFzayhNQVNLX0lEKVxuICAgIGNvbnN0IG91dGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cylcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBcIndoaXRlXCIpXG4gICAgbWFzay5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2NlbnRlckNpcmNsZVJhZGl1cylcbiAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoJ2ZpbGwnLCBcImJsYWNrXCIpXG4gICAgbWFzay5hcHBlbmRDaGlsZChpbm5lckNpcmNsZSlcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKG1hc2spXG5cbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzKVxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiB0aGlzLiNzZXR0aW5ncy5DSEFSVF9CQUNLR1JPVU5EX0NPTE9SKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwibWFza1wiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogYHVybCgjJHtNQVNLX0lEfSlgKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSlcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNkcmF3QXN0cm9sb2dpY2FsU2lnbnMoKSB7XG4gICAgY29uc3QgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUyA9IDEyXG4gICAgY29uc3QgU1RFUCA9IDMwIC8vZGVncmVlXG4gICAgY29uc3QgQ09MT1JTX1NJR05TID0gW3RoaXMuI3NldHRpbmdzLkNPTE9SX0FSSUVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9UQVVSVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0dFTUlOSSwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FOQ0VSLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9MRU8sIHRoaXMuI3NldHRpbmdzLkNPTE9SX1ZJUkdPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9MSUJSQSwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfU0NPUlBJTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfU0FHSVRUQVJJVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0NBUFJJQ09STiwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVFVQVJJVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1BJU0NFU11cbiAgICBjb25zdCBTWU1CT0xfU0lHTlMgPSBbU1ZHVXRpbHMuU1lNQk9MX0FSSUVTLCBTVkdVdGlscy5TWU1CT0xfVEFVUlVTLCBTVkdVdGlscy5TWU1CT0xfR0VNSU5JLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSLCBTVkdVdGlscy5TWU1CT0xfTEVPLCBTVkdVdGlscy5TWU1CT0xfVklSR08sIFNWR1V0aWxzLlNZTUJPTF9MSUJSQSwgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU8sIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUywgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STiwgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTLCBTVkdVdGlscy5TWU1CT0xfUElTQ0VTXVxuXG4gICAgY29uc3QgbWFrZVN5bWJvbCA9IChzeW1ib2xJbmRleCwgYW5nbGVJbkRlZ3JlZSkgPT4ge1xuICAgICAgbGV0IHBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMgLSAodGhpcy4jcmFkaXVzIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPKSAvIDIsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlSW5EZWdyZWUgKyBTVEVQIC8gMiwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcblxuICAgICAgbGV0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChTWU1CT0xfU0lHTlNbc3ltYm9sSW5kZXhdLCBwb3NpdGlvbi54LCBwb3NpdGlvbi55KVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9TSUdOU19GT05UX1NJWkUpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU0lHTlNfQ09MT1IpO1xuICAgICAgcmV0dXJuIHN5bWJvbFxuICAgIH1cblxuICAgIGNvbnN0IG1ha2VTZWdtZW50ID0gKHN5bWJvbEluZGV4LCBhbmdsZUZyb21JbkRlZ3JlZSwgYW5nbGVUb0luRGVncmVlKSA9PiB7XG4gICAgICBsZXQgYTEgPSBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZUZyb21JbkRlZ3JlZSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KVxuICAgICAgbGV0IGEyID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVUb0luRGVncmVlLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpXG4gICAgICBsZXQgc2VnbWVudCA9IFNWR1V0aWxzLlNWR1NlZ21lbnQodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzLCBhMSwgYTIsIHRoaXMuI2lubmVyQ2lyY2xlUmFkaXVzKTtcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogQ09MT1JTX1NJR05TW3N5bWJvbEluZGV4XSk7XG4gICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLkNJUkNMRV9DT0xPUiA6IFwibm9uZVwiKTtcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIDogMCk7XG4gICAgICByZXR1cm4gc2VnbWVudFxuICAgIH1cblxuICAgIGxldCBzdGFydEFuZ2xlID0gMFxuICAgIGxldCBlbmRBbmdsZSA9IHN0YXJ0QW5nbGUgKyBTVEVQXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TOyBpKyspIHtcblxuICAgICAgbGV0IHNlZ21lbnQgPSBtYWtlU2VnbWVudChpLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VnbWVudCk7XG5cbiAgICAgIGxldCBzeW1ib2wgPSBtYWtlU3ltYm9sKGksIHN0YXJ0QW5nbGUpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUDtcbiAgICAgIGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd1J1bGVyKCkge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9ESVZJREVSUyA9IDcyXG4gICAgY29uc3QgU1RFUCA9IDVcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuI2Fuc2NlbmRhbnRTaGlmdFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0RJVklERVJTOyBpKyspIHtcbiAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNydWxsZXJDaXJjbGVSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNydWxsZXJDaXJjbGVSYWRpdXMgKyBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSCAvIChpICUgMiArIDEpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUFxuICAgIH1cblxuICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNydWxsZXJDaXJjbGVSYWRpdXMpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBtYWluIGF4aXNcbiAgICogQHBhcmFtIHtBcnJheX0gYXhpc0xpc3RcbiAgICovXG4gICNkcmF3TWFpbkF4aXMoYXhpc0xpc3QpIHtcbiAgICBjb25zdCBBWElTX0xFTkdUSCA9IDEwXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgZm9yIChjb25zdCBheGlzIG9mIGF4aXNMaXN0KSB7XG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jcmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNyYWRpdXMgKyBBWElTX0xFTkdUSCwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGxldCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIGxldCB0ZXh0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cyArIEFYSVNfTEVOR1RILCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLiNhbnNjZW5kYW50U2hpZnQpKVxuICAgICAgbGV0IHN5bWJvbDtcbiAgICAgIGxldCBTSElGVF9YID0gMDtcbiAgICAgIGxldCBTSElGVF9ZID0gMDtcbiAgICAgIGNvbnN0IFNURVAgPSAyXG4gICAgICBzd2l0Y2ggKGF4aXMubmFtZSkge1xuICAgICAgICBjYXNlIFwiQXNcIjpcbiAgICAgICAgICBTSElGVF9YIC09IFNURVBcbiAgICAgICAgICBTSElGVF9ZIC09IFNURVBcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkRzXCI6XG4gICAgICAgICAgU0hJRlRfWCArPSBTVEVQXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIk1jXCI6XG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwidGV4dC10b3BcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkljXCI6XG4gICAgICAgICAgU0hJRlRfWSArPSBTVEVQXG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYXhpcy5uYW1lKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gYXhpcyBuYW1lLlwiKVxuICAgICAgfVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfQVhJU19GT05UX1NJWkUpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU0lHTlNfQ09MT1IpO1xuXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBwb2ludHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAqL1xuICAjZHJhd1BvaW50cyhkYXRhKSB7XG4gICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcbiAgICBjb25zdCBQT0lOVF9SQURJVVMgPSB0aGlzLiNpbm5lckNpcmNsZVJhZGl1cyAtICg0ICogUmFkaXhDaGFydC5SVUxFUl9MRU5HVEgpXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgcG9zaXRpb25zID0gVXRpbHMuY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBQT0lOVF9SQURJVVMpXG4gICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XG4gICAgICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChwb2ludERhdGEsIGN1c3BzLCB0aGlzLiNzZXR0aW5ncylcbiAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2lubmVyQ2lyY2xlUmFkaXVzIC0gMS41ICogUmFkaXhDaGFydC5SVUxFUl9MRU5HVEgsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgUE9JTlRfUkFESVVTLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcblxuICAgICAgLy8gcnVsZXIgbWFya1xuICAgICAgY29uc3QgcnVsZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI3J1bGxlckNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0QW5nbGUoKSwgdGhpcy4jYW5zY2VuZGFudFNoaWZ0KSlcbiAgICAgIGNvbnN0IHJ1bGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIHJ1bGVyTGluZUVuZFBvc2l0aW9uLngsIHJ1bGVyTGluZUVuZFBvc2l0aW9uLnkpXG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChydWxlckxpbmUpO1xuXG4gICAgICAvLyBzeW1ib2xcbiAgICAgIGNvbnN0IHN5bWJvbCA9IHBvaW50LmdldFN5bWJvbChzeW1ib2xQb3NpdGlvbi54LCBzeW1ib2xQb3NpdGlvbi55KVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5SQURJWF9QT0lOVFNfRk9OVF9TSVpFKVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUE9JTlRTX0NPTE9SKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xuXG4gICAgICAvLyBwb2ludGVyXG4gICAgICAvL2lmIChwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSAhPSBwb2ludERhdGEucG9zaXRpb24pIHtcbiAgICAgIGNvbnN0IHBvaW50ZXJMaW5lRW5kUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIFBPSU5UX1JBRElVUywgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBjb25zdCBwb2ludGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIChwb2ludFBvc2l0aW9uLnggKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLngpIC8gMiwgKHBvaW50UG9zaXRpb24ueSArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueSkgLyAyKVxuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSAvIDIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwb2ludGVyTGluZSk7XG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBwb2ludHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAqL1xuICAjZHJhd0N1c3BzKGRhdGEpIHtcbiAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xuICAgIGNvbnN0IGN1c3BzID0gZGF0YS5jdXNwc1xuXG4gICAgY29uc3QgcG9pbnRzUG9zaXRpb25zID0gcG9pbnRzLm1hcChwb2ludCA9PiB7XG4gICAgICByZXR1cm4gcG9pbnQuYW5nbGVcbiAgICB9KVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHRleHRSYWRpdXMgPSB0aGlzLiNyYWRpdXMgLyBSYWRpeENoYXJ0Lk9VVEVSX0NJUkNMRV9SQURJVVNfUkFUSU8gKyAxLjggKiBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSFxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXNwcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2NlbnRlckNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3J1bGxlckNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG5cbiAgICAgIGNvbnN0IGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID0gVXRpbHMuaXNDb2xsaXNpb24oY3VzcHNbaV0uYW5nbGUsIHBvaW50c1Bvc2l0aW9ucywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUyAvIDIpXG4gICAgICBjb25zdCBlbmRQb3NYID0gaXNMaW5lSW5Db2xsaXNpb25XaXRoUG9pbnQgPyAoc3RhcnRQb3MueCArIGVuZFBvcy54KSAvIDIgOiBlbmRQb3MueFxuICAgICAgY29uc3QgZW5kUG9zWSA9IGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID8gKHN0YXJ0UG9zLnkgKyBlbmRQb3MueSkgLyAyIDogZW5kUG9zLnlcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9zLngsIHN0YXJ0UG9zLnksIGVuZFBvc1gsIGVuZFBvc1kpXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKVxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgY29uc3Qgc3RhcnRDdXNwID0gY3VzcHNbaV0uYW5nbGVcbiAgICAgIGNvbnN0IGVuZEN1c3AgPSBjdXNwc1soaSArIDEpICUgMTJdLmFuZ2xlXG4gICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxuICAgICAgY29uc3QgdGV4dEFuZ2xlID0gc3RhcnRDdXNwICsgZ2FwIC8gMlxuXG4gICAgICBjb25zdCB0ZXh0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0ZXh0UmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbih0ZXh0QW5nbGUsIHRoaXMuI2Fuc2NlbmRhbnRTaGlmdCkpXG4gICAgICBjb25zdCB0ZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dCh0ZXh0UG9zLngsIHRleHRQb3MueSwgYCR7aSsxfWApXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfUE9JTlRTX0ZPTlRfU0laRSAvIDIpXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVEVYVF9DT0xPUilcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGV4dClcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd0JvcmRlcnMoKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2lubmVyQ2lyY2xlUmFkaXVzKVxuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChpbm5lckNpcmNsZSlcblxuICAgIGNvbnN0IG91dGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI3JhZGl1cylcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpXG5cbiAgICBjb25zdCBjZW50ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jY2VudGVyQ2lyY2xlUmFkaXVzKVxuICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNlbnRlckNpcmNsZSlcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxufVxuXG5leHBvcnQge1xuICBSYWRpeENoYXJ0IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgQ2hhcnQgZnJvbSAnLi9DaGFydC5qcydcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUG9pbnRzIGFuZCBjdXBzIGFyZSBkaXNwbGF5ZWQgZnJvbSBvdXRzaWRlIHRoZSBVbml2ZXJzZS5cbiAqIEBwdWJsaWNcbiAqIEBleHRlbmRzIHtDaGFydH1cbiAqL1xuY2xhc3MgVHJhbnNpdENoYXJ0IGV4dGVuZHMgQ2hhcnQge1xuXG4gICNzZXR0aW5nc1xuICAjcm9vdFxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1NWR0RvY3VtZW50fSBTVkdEb2N1bWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKFNWR0RvY3VtZW50LCBzZXR0aW5ncykge1xuXG4gICAgaWYgKCFTVkdEb2N1bWVudCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIFNWR0RvY3VtZW50LicpXG4gICAgfVxuXG4gICAgaWYgKCFzZXR0aW5ncykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gc2V0dGluZ3MuJylcbiAgICB9XG5cbiAgICBzdXBlcihzZXR0aW5ncylcblxuXG4gICAgdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMuI3Jvb3QgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgdGhpcy4jcm9vdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuVFJBTlNJVF9JRH1gKVxuICAgIFNWR0RvY3VtZW50LmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuICB9XG5cbiAgLy8gIyMgUFJJVkFURSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxufVxuXG5leHBvcnQge1xuICBUcmFuc2l0Q2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFJlcHJlc2VudHMgYSBwbGFuZXQgb3IgcG9pbnQgb2YgaW50ZXJlc3QgaW4gdGhlIGNoYXJ0XG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFBvaW50IHtcblxuICAjbmFtZVxuICAjYW5nbGVcbiAgI2lzUmV0cm9ncmFkZVxuICAjY3VzcHNcbiAgI3NldHRpbmdzXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludERhdGEgLSB7bmFtZTpTdHJpbmcsIGFuZ2xlOk51bWJlciwgaXNSZXRyb2dyYWRlOmZhbHNlfVxuICAgKiBAcGFyYW0ge09iamVjdH0gY3VzcHMtIFt7YW5nbGU6TnVtYmVyfSwge2FuZ2xlOk51bWJlcn0sIHthbmdsZTpOdW1iZXJ9LCAuLi5dXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3IocG9pbnREYXRhLCBjdXNwcywgc2V0dGluZ3MpIHtcbiAgICB0aGlzLiNuYW1lID0gcG9pbnREYXRhLm5hbWUgPz8gXCJVbmtub3duXCJcbiAgICB0aGlzLiNhbmdsZSA9IHBvaW50RGF0YS5hbmdsZSA/PyAwXG4gICAgdGhpcy4jaXNSZXRyb2dyYWRlID0gcG9pbnREYXRhLmlzUmV0cm9ncmFkZSA/PyBmYWxzZVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGN1c3BzKSB8fCBjdXNwcy5sZW5ndGggIT0gMTIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkJhZCBwYXJhbSBjdXNwcy4gXCIpXG4gICAgfVxuXG4gICAgdGhpcy4jY3VzcHMgPSBjdXNwc1xuXG4gICAgaWYgKCFzZXR0aW5ncykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gc2V0dGluZ3MuJylcbiAgICB9XG5cbiAgICB0aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gIH1cblxuICAvKipcbiAgICogR2V0IG5hbWVcbiAgICpcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbmFtZVxuICB9XG5cbiAgLyoqXG4gICAqIElzIHJldHJvZ3JhZGVcbiAgICpcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzUmV0cm9ncmFkZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jaXNSZXRyb2dyYWRlXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuZ2xlXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGdldEFuZ2xlKCkge1xuICAgIHJldHVybiB0aGlzLiNhbmdsZVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzeW1ib2xcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHlQb3NcbiAgICogQHBhcmFtIHtCb29sZWFufSBbaXNQcm9wZXJ0aWVzXSAtIGFuZ2xlSW5TaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH1cbiAgICovXG4gIGdldFN5bWJvbCh4UG9zLCB5UG9zLCBpc1Byb3BlcnRpZXMgPSB0cnVlKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbCh0aGlzLiNuYW1lLCB4UG9zLCB5UG9zKVxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKVxuXG4gICAgaWYgKHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfU0hPVyA9PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHdyYXBwZXIgLy89PT09PT0+XG4gICAgfVxuXG4gICAgY29uc3QgY2hhcnRDZW50ZXJYID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcbiAgICBjb25zdCBjaGFydENlbnRlclkgPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVCAvIDJcbiAgICBjb25zdCBhbmdsZUZyb21TeW1ib2xUb0NlbnRlciA9IFV0aWxzLnBvc2l0aW9uVG9BbmdsZSh4UG9zLCB5UG9zLCBjaGFydENlbnRlclgsIGNoYXJ0Q2VudGVyWSlcblxuICAgIC8vIHBvaW50IHByb3BlcnRpZXMgLSBhbmdsZSBpbiBzaWduXG4gICAgY29uc3QgdGV4dFJhZGl1cyA9IDEuOCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVNcbiAgICBjb25zdCB0ZXh0UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIHRleHRSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlcikpXG4gICAgY29uc3QgdGV4dFdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgLy8gSXQgaXMgcG9zc2libGUgdG8gcm90YXRlIHRoZSB0ZXh0LCB3aGVuIHVuY29tbWVudCBhIGxpbmUgYmVsbG93LlxuICAgIC8vdGV4dFdyYXBwZXIuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIGByb3RhdGUoJHthbmdsZUZyb21TeW1ib2xUb0NlbnRlcn0sJHt0ZXh0UG9zaXRpb24ueH0sJHt0ZXh0UG9zaXRpb24ueX0pYClcbiAgICBjb25zdCB0ZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dCh0ZXh0UG9zaXRpb24ueCwgdGV4dFBvc2l0aW9uLnksIHRoaXMuZ2V0QW5nbGVJblNpZ24oKSlcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtc2l6ZVwiLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX0ZPTlRfU0laRSk7XG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQ09MT1IpO1xuICAgIHRleHRXcmFwcGVyLmFwcGVuZENoaWxkKHRleHQpXG5cbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHRleHRXcmFwcGVyKVxuXG4gICAgcmV0dXJuIHdyYXBwZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgaG91c2UgbnVtYmVyXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGdldEhvdXNlTnVtYmVyKCkge31cblxuICAvKipcbiAgICogR2V0IHNpZ24gbnVtYmVyXG4gICAqIEFyaXNlID0gMSwgVGF1cnVzID0gMiwgLi4uUGlzY2VzID0gMTJcbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0U2lnbk51bWJlcigpIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFuZ2xlIChJbnRlZ2VyKSBpbiB0aGUgc2lnbiBpbiB3aGljaCBpdCBzdGFuZHMuXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGdldEFuZ2xlSW5TaWduKCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuI2FuZ2xlICUgMzApXG4gIH1cblxufVxuXG5leHBvcnQge1xuICBQb2ludCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgKiBhcyBVbml2ZXJzZSBmcm9tIFwiLi9jb25zdGFudHMvVW5pdmVyc2UuanNcIlxuaW1wb3J0ICogYXMgUmFkaXggZnJvbSBcIi4vY29uc3RhbnRzL1JhZGl4LmpzXCJcbmltcG9ydCAqIGFzIFRyYW5zaXQgZnJvbSBcIi4vY29uc3RhbnRzL1RyYW5zaXQuanNcIlxuaW1wb3J0ICogYXMgUG9pbnQgZnJvbSBcIi4vY29uc3RhbnRzL1BvaW50LmpzXCJcbmltcG9ydCAqIGFzIENvbG9ycyBmcm9tIFwiLi9jb25zdGFudHMvQ29sb3JzLmpzXCJcblxuY29uc3QgU0VUVElOR1MgPSBPYmplY3QuYXNzaWduKHt9LCBVbml2ZXJzZSwgUmFkaXgsIFRyYW5zaXQsIFBvaW50LCBDb2xvcnMpO1xuXG5leHBvcnQge1xuICBTRVRUSU5HUyBhc1xuICBkZWZhdWx0XG59XG4iLCIvKipcbiogQ2hhcnQgYmFja2dyb3VuZCBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI2ZmZlxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9CQUNLR1JPVU5EX0NPTE9SID0gXCIjZmZmXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgY2lyY2xlcyBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfQ0lSQ0xFX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgbGluZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0xJTkVfQ09MT1IgPSBcIiM2NjZcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiB0ZXh0IGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9URVhUX0NPTE9SID0gXCIjOTk5XCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgbXFpbiBheGlzIC0gQXMsIERzLCBNYywgSWNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMwMDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfTUFJTl9BWElTX0NPTE9SID0gXCIjMDAwXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2Ygc2lnbnMgaW4gY2hhcnRzIChhcmlzZSBzeW1ib2wsIHRhdXJ1cyBzeW1ib2wsIC4uLilcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMwMDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfU0lHTlNfQ09MT1IgPSBcIiMzMzNcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBzaWducyBpbiBjaGFydHMgKGFyaXNlIHN5bWJvbCwgdGF1cnVzIHN5bWJvbCwgLi4uKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QT0lOVFNfQ09MT1IgPSBcIiMwMDBcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBmb3IgcG9pbnQgcHJvcGVydGllcyAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9QUk9QRVJUSUVTX0NPTE9SID0gXCIjMzMzXCJcblxuLypcbiogQXJpZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQVJJRVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogVGF1cnVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1RBVVJVUyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBHZW1pbnkgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4N0NFRUJcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfR0VNSU5JPSBcIiM4N0NFRUJcIjtcblxuLypcbiogQ2FuY2VyIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBTkNFUiA9IFwiIzI3QUU2MFwiO1xuXG4vKlxuKiBMZW8gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfTEVPID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIFZpcmdvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1ZJUkdPID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIExpYnJhIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xJQlJBID0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIFNjb3JwaW8gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0NPUlBJTyA9IFwiIzI3QUU2MFwiO1xuXG4vKlxuKiBTYWdpdHRhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9TQUdJVFRBUklVUyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBDYXByaWNvcm4gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4QjQ1MTNcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQ0FQUklDT1JOID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIEFxdWFyaXVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0FRVUFSSVVTID0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIFBpc2NlcyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9QSVNDRVMgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogQ29sb3Igb2YgY2lyY2xlcyBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0lSQ0xFX0NPTE9SID0gXCIjMzMzXCI7XG4iLCIvKlxuKiBQb2ludCBwcm9wZXJ0aWUgLSBhbmdsZSBpbiBzaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPVyA9IHRydWVcblxuLypcbiogVGV4dCBzaXplIG9mIFBvaW50IGRlc2NyaXB0aW9uIC0gYW5nbGUgaW4gc2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFID0gMTJcblxuLyoqXG4qIEEgcG9pbnQgY29sbGlzaW9uIHJhZGl1c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9DT0xMSVNJT05fUkFESVVTID0gMTJcbiIsIi8qXG4qIFJhZGl4IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHJhZGl4XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX0lEID0gXCJyYWRpeFwiXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI0XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX1BPSU5UU19GT05UX1NJWkUgPSAzNlxuXG4vKlxuKiBGb250IHNpemUgLSBzaWduc1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjRcbiovXG5leHBvcnQgY29uc3QgUkFESVhfU0lHTlNfRk9OVF9TSVpFID0gMzJcblxuLypcbiogRm9udCBzaXplIC0gYXhpcyAoQXMsIERzLCBNQywgSUMpXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyNFxuKi9cbmV4cG9ydCBjb25zdCBSQURJWF9BWElTX0ZPTlRfU0laRSA9IDMyXG4iLCIvKlxuKiBUcmFuc2l0IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHRyYW5zaXRcbiovXG5leHBvcnQgY29uc3QgVFJBTlNJVF9JRCA9IFwidHJhbnNpdFwiXG4iLCIvKipcbiogQ2hhcnQgcGFkZGluZ1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMTBweFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QQURESU5HID0gNDBcblxuLyoqXG4qIFNWRyB2aWV3Qm94IHdpZHRoXG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9XSURUSCA9IDgwMFxuXG4vKipcbiogU1ZHIHZpZXdCb3ggaGVpZ2h0XG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9IRUlHSFQgPSA4MDBcblxuLypcbiogTGluZSBzdHJlbmd0aFxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0UgPSAxXG5cbi8qXG4qIExpbmUgc3RyZW5ndGggb2YgdGhlIG1haW4gbGluZXMuIEZvciBpbnN0YW5jZSBwb2ludHMsIG1haW4gYXhpcywgbWFpbiBjaXJjbGVzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX01BSU5fU1RST0tFID0gMlxuXG4vKipcbiogTm8gZmlsbCwgb25seSBzdHJva2VcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtib29sZWFufVxuKiBAZGVmYXVsdCBmYWxzZVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfT05MWSA9IGZhbHNlO1xuXG4vKipcbiogRm9udCBmYW1pbHlcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0XG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0ZPTlRfRkFNSUxZID0gXCJBc3Ryb25vbWljb25cIjtcbiIsImltcG9ydCBEZWZhdWx0U2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzJztcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xuaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnO1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuLi9jaGFydHMvVHJhbnNpdENoYXJ0LmpzJztcblxuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiB3cmFwcGVyIGZvciBhbGwgcGFydHMgb2YgZ3JhcGguXG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFVuaXZlcnNlIHtcblxuICAjU1ZHRG9jdW1lbnRcbiAgI3NldHRpbmdzXG4gICNyYWRpeFxuICAjdHJhbnNpdFxuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1N0cmluZ30gaHRtbEVsZW1lbnRJRCAtIElEIG9mIHRoZSByb290IGVsZW1lbnQgd2l0aG91dCB0aGUgIyBzaWduXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBBbiBvYmplY3QgdGhhdCBvdmVycmlkZXMgdGhlIGRlZmF1bHQgc2V0dGluZ3MgdmFsdWVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihodG1sRWxlbWVudElELCBvcHRpb25zID0ge30pIHtcblxuICAgIGlmICh0eXBlb2YgaHRtbEVsZW1lbnRJRCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSByZXF1aXJlZCBwYXJhbWV0ZXIgaXMgbWlzc2luZy4nKVxuICAgIH1cblxuICAgIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEVsZW1lbnRJRCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fub3QgZmluZCBhIEhUTUwgZWxlbWVudCB3aXRoIElEICcgKyBodG1sRWxlbWVudElEKVxuICAgIH1cblxuICAgIHRoaXMuI3NldHRpbmdzID0gT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdFNldHRpbmdzLCBvcHRpb25zLCB7XG4gICAgICBIVE1MX0VMRU1FTlRfSUQ6IGh0bWxFbGVtZW50SURcbiAgICB9KTtcbiAgICB0aGlzLiNTVkdEb2N1bWVudCA9IFNWR1V0aWxzLlNWR0RvY3VtZW50KHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEgsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUKVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpLmFwcGVuZENoaWxkKHRoaXMuI1NWR0RvY3VtZW50KTtcblxuICAgIHRoaXMuI3JhZGl4ID0gbmV3IFJhZGl4Q2hhcnQodGhpcy4jU1ZHRG9jdW1lbnQsIHRoaXMuI3NldHRpbmdzKVxuICAgIHRoaXMuI3RyYW5zaXQgPSBuZXcgVHJhbnNpdENoYXJ0KHRoaXMuI1NWR0RvY3VtZW50LCB0aGlzLiNzZXR0aW5ncylcblxuICAgIHRoaXMuI2xvYWRGb250KCBuZXcgRm9udEZhY2UoJ0FzdHJvbm9taWNvbicsICd1cmwoLi4vYXNzZXRzL2ZvbnRzL3R0Zi9Bc3Ryb25vbWljb25Gb250c18xLjEvQXN0cm9ub21pY29uLnR0ZiknKSApXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gIyMgUFVCTElDICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qKlxuICAgKiBHZXQgUmFkaXggY2hhcnRcbiAgICogQHJldHVybiB7UmFkaXhDaGFydH1cbiAgICovXG4gIHJhZGl4KCkge1xuICAgIHJldHVybiB0aGlzLiNyYWRpeFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBUcmFuc2l0IGNoYXJ0XG4gICAqIEByZXR1cm4ge1RyYW5zaXRDaGFydH1cbiAgICovXG4gIHRyYW5zaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RyYW5zaXRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCBzZXR0aW5nc1xuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBnZXRTZXR0aW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy4jc2V0dGluZ3NcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcm9vdCBTVkcgZG9jdW1lbnRcbiAgICogQHJldHVybiB7U1ZHRG9jdW1lbnR9XG4gICAqL1xuICBnZXRTVkdEb2N1bWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jU1ZHRG9jdW1lbnRcbiAgfVxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLypcbiAgKiBMb2FkIGZvbmQgdG8gRE9NXG4gICovXG4gIGFzeW5jICNsb2FkRm9udCggZm9udCApe1xuICAgIHRyeXtcbiAgICAgIGF3YWl0IGZvbnQubG9hZCgpO1xuICAgICAgZG9jdW1lbnQuZm9udHMuYWRkKGZvbnQpXG4gICAgfWNhdGNoKGUpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFVuaXZlcnNlIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFNWRyB1dGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFNWR1V0aWxzIHtcblxuICBzdGF0aWMgU1ZHX05BTUVTUEFDRSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuXG4gIHN0YXRpYyBTWU1CT0xfQVJJRVMgPSBcIkFyaWVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfVEFVUlVTID0gXCJUYXVydXNcIjtcbiAgc3RhdGljIFNZTUJPTF9HRU1JTkkgPSBcIkdlbWluaVwiO1xuICBzdGF0aWMgU1lNQk9MX0NBTkNFUiA9IFwiQ2FuY2VyXCI7XG4gIHN0YXRpYyBTWU1CT0xfTEVPID0gXCJMZW9cIjtcbiAgc3RhdGljIFNZTUJPTF9WSVJHTyA9IFwiVmlyZ29cIjtcbiAgc3RhdGljIFNZTUJPTF9MSUJSQSA9IFwiTGlicmFcIjtcbiAgc3RhdGljIFNZTUJPTF9TQ09SUElPID0gXCJTY29ycGlvXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0FHSVRUQVJJVVMgPSBcIlNhZ2l0dGFyaXVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOID0gXCJDYXByaWNvcm5cIjtcbiAgc3RhdGljIFNZTUJPTF9BUVVBUklVUyA9IFwiQXF1YXJpdXNcIjtcbiAgc3RhdGljIFNZTUJPTF9QSVNDRVMgPSBcIlBpc2Nlc1wiO1xuXG4gIHN0YXRpYyBTWU1CT0xfU1VOID0gXCJTdW5cIjtcbiAgc3RhdGljIFNZTUJPTF9NT09OID0gXCJNb29uXCI7XG4gIHN0YXRpYyBTWU1CT0xfTUVSQ1VSWSA9IFwiTWVyY3VyeVwiO1xuICBzdGF0aWMgU1lNQk9MX1ZFTlVTID0gXCJWZW51c1wiO1xuICBzdGF0aWMgU1lNQk9MX0VBUlRIID0gXCJFYXJ0aFwiO1xuICBzdGF0aWMgU1lNQk9MX01BUlMgPSBcIk1hcnNcIjtcbiAgc3RhdGljIFNZTUJPTF9KVVBJVEVSID0gXCJKdXBpdGVyXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0FUVVJOID0gXCJTYXR1cm5cIjtcbiAgc3RhdGljIFNZTUJPTF9VUkFOVVMgPSBcIlVyYW51c1wiO1xuICBzdGF0aWMgU1lNQk9MX05FUFRVTkUgPSBcIk5lcHR1bmVcIjtcbiAgc3RhdGljIFNZTUJPTF9QTFVUTyA9IFwiUGx1dG9cIjtcbiAgc3RhdGljIFNZTUJPTF9DSElST04gPSBcIkNoaXJvblwiO1xuICBzdGF0aWMgU1lNQk9MX0xJTElUSCA9IFwiTGlsaXRoXCI7XG4gIHN0YXRpYyBTWU1CT0xfTk5PREUgPSBcIk5Ob2RlXCI7XG4gIHN0YXRpYyBTWU1CT0xfU05PREUgPSBcIlNOb2RlXCI7XG5cbiAgc3RhdGljIFNZTUJPTF9BUyA9IFwiQXNcIjtcbiAgc3RhdGljIFNZTUJPTF9EUyA9IFwiRHNcIjtcbiAgc3RhdGljIFNZTUJPTF9NQyA9IFwiTWNcIjtcbiAgc3RhdGljIFNZTUJPTF9JQyA9IFwiSWNcIjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFNWR1V0aWxzKSB7XG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIGRvY3VtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRG9jdW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHRG9jdW1lbnQod2lkdGgsIGhlaWdodCkge1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInN2Z1wiKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd4bWxucycsIFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZlcnNpb24nLCBcIjEuMVwiKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgXCIwIDAgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KTtcbiAgICByZXR1cm4gc3ZnXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIGdyb3VwIGVsZW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHR3JvdXAoKSB7XG4gICAgY29uc3QgZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImdcIik7XG4gICAgcmV0dXJuIGdcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgcGF0aCBlbGVtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR1BhdGgoKSB7XG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XG4gICAgcmV0dXJuIHBhdGhcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgbWFzayBlbGVtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnRJRFxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdNYXNrRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdNYXNrKGVsZW1lbnRJRCkge1xuICAgIGNvbnN0IG1hc2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJtYXNrXCIpO1xuICAgIG1hc2suc2V0QXR0cmlidXRlKFwiaWRcIiwgZWxlbWVudElEKVxuICAgIHJldHVybiBtYXNrXG4gIH1cblxuICAvKipcbiAgICogU1ZHIGNpcmN1bGFyIHNlY3RvclxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7aW50fSB4IC0gY2lyY2xlIHggY2VudGVyIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7aW50fSB5IC0gY2lyY2xlIHkgY2VudGVyIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7aW50fSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzIGluIHB4XG4gICAqIEBwYXJhbSB7aW50fSBhMSAtIGFuZ2xlRnJvbSBpbiByYWRpYW5zXG4gICAqIEBwYXJhbSB7aW50fSBhMiAtIGFuZ2xlVG8gaW4gcmFkaWFuc1xuICAgKiBAcGFyYW0ge2ludH0gdGhpY2tuZXNzIC0gZnJvbSBvdXRzaWRlIHRvIGNlbnRlciBpbiBweFxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBzZWdtZW50XG4gICAqL1xuICBzdGF0aWMgU1ZHU2VnbWVudCh4LCB5LCByYWRpdXMsIGExLCBhMiwgdGhpY2tuZXNzLCBsRmxhZywgc0ZsYWcpIHtcbiAgICAvLyBAc2VlIFNWRyBQYXRoIGFyYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL1NWRy9wYXRocy5odG1sI1BhdGhEYXRhXG4gICAgY29uc3QgTEFSR0VfQVJDX0ZMQUcgPSBsRmxhZyB8fCAwO1xuICAgIGNvbnN0IFNXRUVUX0ZMQUcgPSBzRmxhZyB8fCAwO1xuXG4gICAgY29uc3Qgc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XG4gICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTSBcIiArICh4ICsgdGhpY2tuZXNzICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICh5ICsgdGhpY2tuZXNzICogTWF0aC5zaW4oYTEpKSArIFwiIGwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogTWF0aC5zaW4oYTEpKSArIFwiIEEgXCIgKyByYWRpdXMgKyBcIiwgXCIgKyByYWRpdXMgKyBcIiwwICxcIiArIExBUkdFX0FSQ19GTEFHICsgXCIsIFwiICsgU1dFRVRfRkxBRyArIFwiLCBcIiArICh4ICsgcmFkaXVzICogTWF0aC5jb3MoYTIpKSArIFwiLCBcIiArICh5ICsgcmFkaXVzICogTWF0aC5zaW4oYTIpKSArIFwiIGwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiAtTWF0aC5jb3MoYTIpKSArIFwiLCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIC1NYXRoLnNpbihhMikpICsgXCIgQSBcIiArIHRoaWNrbmVzcyArIFwiLCBcIiArIHRoaWNrbmVzcyArIFwiLDAgLFwiICsgTEFSR0VfQVJDX0ZMQUcgKyBcIiwgXCIgKyAxICsgXCIsIFwiICsgKHggKyB0aGlja25lc3MgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKHkgKyB0aGlja25lc3MgKiBNYXRoLnNpbihhMSkpKTtcbiAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgIHJldHVybiBzZWdtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyBjaXJjbGVcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2ludH0gY3hcbiAgICogQHBhcmFtIHtpbnR9IGN5XG4gICAqIEBwYXJhbSB7aW50fSByYWRpdXNcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gY2lyY2xlXG4gICAqL1xuICBzdGF0aWMgU1ZHQ2lyY2xlKGN4LCBjeSwgcmFkaXVzKSB7XG4gICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiY2lyY2xlXCIpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBjeCk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN5XCIsIGN5KTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiclwiLCByYWRpdXMpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICByZXR1cm4gY2lyY2xlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyBsaW5lXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MVxuICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MlxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBsaW5lXG4gICAqL1xuICBzdGF0aWMgU1ZHTGluZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJsaW5lXCIpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDFcIiwgeDEpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTFcIiwgeTEpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDJcIiwgeDIpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTJcIiwgeTIpO1xuICAgIHJldHVybiBsaW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyB0ZXh0XG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eHRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtzY2FsZV1cbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gbGluZVxuICAgKi9cbiAgc3RhdGljIFNWR1RleHQoeCwgeSwgdHh0KSB7XG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInRleHRcIik7XG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIHgpO1xuICAgIHRleHQuc2V0QXR0cmlidXRlKFwieVwiLCB5KTtcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcIm5vbmVcIik7ICAgIFxuICAgIHRleHQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodHh0KSk7XG5cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgc3ltYm9sXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4UG9zXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5UG9zXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHU3ltYm9sKG5hbWUsIHhQb3MsIHlQb3MpIHtcbiAgICBzd2l0Y2ggKG5hbWUpIHtcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FTOlxuICAgICAgICByZXR1cm4gYXNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9EUzpcbiAgICAgICAgcmV0dXJuIGRzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUM6XG4gICAgICAgIHJldHVybiBtY1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0lDOlxuICAgICAgICByZXR1cm4gaWNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FSSUVTOlxuICAgICAgICByZXR1cm4gYXJpZXNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVM6XG4gICAgICAgIHJldHVybiB0YXVydXNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9HRU1JTkk6XG4gICAgICAgIHJldHVybiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DQU5DRVI6XG4gICAgICAgIHJldHVybiBjYW5jZXJTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MRU86XG4gICAgICAgIHJldHVybiBsZW9TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WSVJHTzpcbiAgICAgICAgcmV0dXJuIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTElCUkE6XG4gICAgICAgIHJldHVybiBsaWJyYVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU86XG4gICAgICAgIHJldHVybiBzY29ycGlvU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FHSVRUQVJJVVM6XG4gICAgICAgIHJldHVybiBzYWdpdHRhcml1c1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STjpcbiAgICAgICAgcmV0dXJuIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTOlxuICAgICAgICByZXR1cm4gYXF1YXJpdXNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QSVNDRVM6XG4gICAgICAgIHJldHVybiBwaXNjZXNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NVTjpcbiAgICAgICAgcmV0dXJuIHN1blN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01PT046XG4gICAgICAgIHJldHVybiBtb29uU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWTpcbiAgICAgICAgcmV0dXJuIG1lcmN1cnlTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WRU5VUzpcbiAgICAgICAgcmV0dXJuIHZlbnVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfRUFSVEg6XG4gICAgICAgIHJldHVybiBlYXJ0aFN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01BUlM6XG4gICAgICAgIHJldHVybiBtYXJzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUjpcbiAgICAgICAgcmV0dXJuIGp1cGl0ZXJTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQVRVUk46XG4gICAgICAgIHJldHVybiBzYXR1cm5TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9VUkFOVVM6XG4gICAgICAgIHJldHVybiB1cmFudXNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FOlxuICAgICAgICByZXR1cm4gbmVwdHVuZVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1BMVVRPOlxuICAgICAgICByZXR1cm4gcGx1dG9TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DSElST046XG4gICAgICAgIHJldHVybiBjaGlyb25TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUxJVEg6XG4gICAgICAgIHJldHVybiBsaWxpdGhTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9OTk9ERTpcbiAgICAgICAgcmV0dXJuIG5ub2RlU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU05PREU6XG4gICAgICAgIHJldHVybiBzbm9kZVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc3QgdW5rbm93blN5bWJvbCA9IFNWR1V0aWxzLlNWR0NpcmNsZSh4UG9zLCB5UG9zLCA4KVxuICAgICAgICB1bmtub3duU3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcIiMzMzNcIilcbiAgICAgICAgcmV0dXJuIHVua25vd25TeW1ib2xcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEFzY2VuZGFudCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBcImNcIilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIERlc2NlbmRhbnQgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gZHNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJlXCIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBNZWRpdW0gY29lbGkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJkXCIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBJbW11bSBjb2VsaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpY1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBcImVcIilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEFyaWVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFyaWVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFwiQVwiKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogVGF1cnVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRhdXJ1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBcIkJcIilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEdlbWluaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJDXCIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDYW5jZXIgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2FuY2VyU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFwiRFwiKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTGVvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxlb1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBcIkVcIilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFZpcmdvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFwiRlwiKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTGlicmEgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGlicmFTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJHXCIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTY29ycGlvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJIXCIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTYWdpdHRhcml1cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzYWdpdHRhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBcIklcIilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENhcHJpY29ybiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjYXByaWNvcm5TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJKXCIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBcXVhcml1cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBcIktcIilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFBpc2NlcyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwaXNjZXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJMXCIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTdW4gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3VuU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFwiUVwiKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTW9vbiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtb29uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFwiUlwiKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTWVyY3VyeSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtZXJjdXJ5U3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFwiU1wiKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogVmVudXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdmVudXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJUXCIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBFYXJ0aCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlYXJ0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBcIj5cIilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1hcnMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFyc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBcIlVcIilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEp1cGl0ZXIgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24ganVwaXRlclN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBcIlZcIilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNhdHVybiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzYXR1cm5TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJXXCIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBVcmFudXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdXJhbnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFwiWFwiKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTmVwdHVuZSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFwiWVwiKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogUGx1dG8gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGx1dG9TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJaXCIpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDaGlyb24gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2hpcm9uU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFwicVwiKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTGlsaXRoIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxpbGl0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBcInpcIilcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE5Ob2RlIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5ub2RlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFwiZ1wiKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogU05vZGUgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc25vZGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgXCJpXCIpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFNWR1V0aWxzIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFV0aWxpdHkgY2xhc3NcbiAqIEBwdWJsaWNcbiAqIEBzdGF0aWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgVXRpbHMge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgVXRpbHMpIHtcbiAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBERUdfMzYwID0gMzYwXG4gIHN0YXRpYyBERUdfMTgwID0gMTgwXG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHJhbmRvbSBJRFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBnZW5lcmF0ZVVuaXF1ZUlkID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcmFuZG9tTnVtYmVyID0gTWF0aC5yYW5kb20oKSAqIDEwMDAwMDA7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCB1bmlxdWVJZCA9IGBpZF8ke3JhbmRvbU51bWJlcn1fJHt0aW1lc3RhbXB9YDtcbiAgICByZXR1cm4gdW5pcXVlSWQ7XG4gIH1cblxuICAvKipcbiAgICogSW52ZXJ0ZWQgZGVncmVlIHRvIHJhZGlhblxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZUluZGVncmVlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaGlmdEluRGVncmVlXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIHN0YXRpYyBkZWdyZWVUb1JhZGlhbiA9IGZ1bmN0aW9uKGFuZ2xlSW5EZWdyZWUsIHNoaWZ0SW5EZWdyZWUgPSAwKSB7XG4gICAgcmV0dXJuIChzaGlmdEluRGVncmVlIC0gYW5nbGVJbkRlZ3JlZSkgKiBNYXRoLlBJIC8gMTgwXG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgcmFkaWFuIHRvIGRlZ3JlZVxuICAgKiBAc3RhdGljXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpYW5cbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIHJhZGlhblRvRGVncmVlID0gZnVuY3Rpb24ocmFkaWFuKSB7XG4gICAgcmV0dXJuIChyYWRpYW4gKiAxODAgLyBNYXRoLlBJKVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgYSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgb24gdGhlIGNpcmNsZS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGN4IC0gY2VudGVyIHhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGN5IC0gY2VudGVyIHlcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5SYWRpYW5zXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7eDpOdW1iZXIsIHk6TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIHBvc2l0aW9uT25DaXJjbGUoY3gsIGN5LCByYWRpdXMsIGFuZ2xlSW5SYWRpYW5zKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IChyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZUluUmFkaWFucykgKyBjeCksXG4gICAgICB5OiAocmFkaXVzICogTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpICsgY3kpXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAqIENhbGN1bGF0ZXMgdGhlIGFuZ2xlIGJldHdlZW4gdGhlIGxpbmUgKDIgcG9pbnRzKSBhbmQgdGhlIHgtYXhpcy5cbiAgKlxuICAqIEBwYXJhbSB7TnVtYmVyfSB4MVxuICAqIEBwYXJhbSB7TnVtYmVyfSB5MVxuICAqIEBwYXJhbSB7TnVtYmVyfSB4MlxuICAqIEBwYXJhbSB7TnVtYmVyfSB5MlxuICAqXG4gICogQHJldHVybiB7TnVtYmVyfSAtIGRlZ3JlZVxuICAqL1xuICBzdGF0aWMgcG9zaXRpb25Ub0FuZ2xlKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgZHggPSB4MiAtIHgxO1xuICAgIGNvbnN0IGR5ID0geTIgLSB5MTtcbiAgICBjb25zdCBhbmdsZUluUmFkaWFucyA9IE1hdGguYXRhbjIoZHksIGR4KTtcbiAgICByZXR1cm4gVXRpbHMucmFkaWFuVG9EZWdyZWUoYW5nbGVJblJhZGlhbnMpXG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBuZXcgcG9zaXRpb24gb2YgcG9pbnRzIG9uIGNpcmNsZSB3aXRob3V0IG92ZXJsYXBwaW5nIGVhY2ggb3RoZXJcbiAgICpcbiAgICogQHRocm93cyB7RXJyb3J9IC0gSWYgdGhlcmUgaXMgbm8gcGxhY2Ugb24gdGhlIGNpcmNsZSB0byBwbGFjZSBwb2ludHMuXG4gICAqIEBwYXJhbSB7QXJyYXl9IHBvaW50cyAtIFt7bmFtZTpcImFcIiwgYW5nbGU6MTB9LCB7bmFtZTpcImJcIiwgYW5nbGU6MjB9XVxuICAgKiBAcGFyYW0ge051bWJlcn0gY29sbGlzaW9uUmFkaXVzIC0gcG9pbnQgcmFkaXVzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH0gLSB7XCJNb29uXCI6MzAsIFwiU3VuXCI6NjAsIFwiTWVyY3VyeVwiOjg2LCAuLi59XG4gICAqL1xuICBzdGF0aWMgY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCBjb2xsaXNpb25SYWRpdXMsIGNpcmNsZVJhZGl1cykge1xuICAgIGNvbnN0IFNURVAgPSAxIC8vZGVncmVlXG5cbiAgICBjb25zdCBjZWxsV2lkdGggPSAxMCAvL2RlZ3JlZVxuICAgIGNvbnN0IG51bWJlck9mQ2VsbHMgPSBVdGlscy5ERUdfMzYwIC8gY2VsbFdpZHRoXG4gICAgY29uc3QgZnJlcXVlbmN5ID0gbmV3IEFycmF5KG51bWJlck9mQ2VsbHMpLmZpbGwoMClcbiAgICBmb3IgKGNvbnN0IHBvaW50IG9mIHBvaW50cykge1xuICAgICAgY29uc3QgaW5kZXggPSBNYXRoLmZsb29yKHBvaW50LmFuZ2xlIC8gY2VsbFdpZHRoKVxuICAgICAgZnJlcXVlbmN5W2luZGV4XSArPSAxXG4gICAgfVxuXG4gICAgLy8gSW4gdGhpcyBhbGdvcml0aG0gdGhlIG9yZGVyIG9mIHBvaW50cyBpcyBjcnVjaWFsLlxuICAgIC8vIEF0IHRoYXQgcG9pbnQgaW4gdGhlIGNpcmNsZSwgd2hlcmUgdGhlIHBlcmlvZCBjaGFuZ2VzIGluIHRoZSBjaXJjbGUgKGZvciBpbnN0YW5jZTpbMzU4LDM1OSwwLDFdKSwgdGhlIHBvaW50cyBhcmUgYXJyYW5nZWQgaW4gaW5jb3JyZWN0IG9yZGVyLlxuICAgIC8vIEFzIGEgc3RhcnRpbmcgcG9pbnQsIEkgdHJ5IHRvIGZpbmQgYSBwbGFjZSB3aGVyZSB0aGVyZSBhcmUgbm8gcG9pbnRzLiBUaGlzIHBsYWNlIEkgdXNlIGFzIFNUQVJUX0FOR0xFLlxuICAgIGNvbnN0IFNUQVJUX0FOR0xFID0gY2VsbFdpZHRoICogZnJlcXVlbmN5LmZpbmRJbmRleChjb3VudCA9PiBjb3VudCA9PSAwKVxuXG4gICAgY29uc3QgX3BvaW50cyA9IHBvaW50cy5tYXAocG9pbnQgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogcG9pbnQubmFtZSxcbiAgICAgICAgYW5nbGU6IHBvaW50LmFuZ2xlIDwgU1RBUlRfQU5HTEUgPyBwb2ludC5hbmdsZSArIFV0aWxzLkRFR18zNjAgOiBwb2ludC5hbmdsZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBfcG9pbnRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLmFuZ2xlIC0gYi5hbmdsZVxuICAgIH0pXG5cbiAgICAvLyBSZWN1cnNpdmUgZnVuY3Rpb25cbiAgICBjb25zdCBhcnJhbmdlUG9pbnRzID0gKCkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGxuID0gX3BvaW50cy5sZW5ndGg7IGkgPCBsbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKDAsIDAsIGNpcmNsZVJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oX3BvaW50c1tpXS5hbmdsZSkpXG4gICAgICAgIF9wb2ludHNbaV0ueCA9IHBvaW50UG9zaXRpb24ueFxuICAgICAgICBfcG9pbnRzW2ldLnkgPSBwb2ludFBvc2l0aW9uLnlcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KF9wb2ludHNbaV0ueCAtIF9wb2ludHNbal0ueCwgMikgKyBNYXRoLnBvdyhfcG9pbnRzW2ldLnkgLSBfcG9pbnRzW2pdLnksIDIpKTtcbiAgICAgICAgICBpZiAoZGlzdGFuY2UgPCAoMiAqIGNvbGxpc2lvblJhZGl1cykpIHtcbiAgICAgICAgICAgIF9wb2ludHNbaV0uYW5nbGUgKz0gU1RFUFxuICAgICAgICAgICAgX3BvaW50c1tqXS5hbmdsZSAtPSBTVEVQXG4gICAgICAgICAgICBhcnJhbmdlUG9pbnRzKCkgLy89PT09PT0+IFJlY3Vyc2l2ZSBjYWxsXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXJyYW5nZVBvaW50cygpXG5cbiAgICByZXR1cm4gX3BvaW50cy5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBwb2ludCwgY3VycmVudEluZGV4KSA9PiB7XG4gICAgICBhY2N1bXVsYXRvcltwb2ludC5uYW1lXSA9IHBvaW50LmFuZ2xlXG4gICAgICByZXR1cm4gYWNjdW11bGF0b3JcbiAgICB9LCB7fSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgYW5nbGUgY29sbGlkZXMgd2l0aCB0aGUgcG9pbnRzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhbmdsZXNMaXN0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbY29sbGlzaW9uUmFkaXVzXVxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgc3RhdGljIGlzQ29sbGlzaW9uKGFuZ2xlLCBhbmdsZXNMaXN0LCBjb2xsaXNpb25SYWRpdXMgPSAxMCkge1xuXG4gICAgY29uc3QgcG9pbnRJbkNvbGxpc2lvbiA9IGFuZ2xlc0xpc3QuZmluZChwb2ludCA9PiB7XG5cbiAgICAgIGxldCBhID0gKHBvaW50IC0gYW5nbGUpID4gVXRpbHMuREVHXzE4MCA/IGFuZ2xlICsgVXRpbHMuREVHXzM2MCA6IGFuZ2xlXG4gICAgICBsZXQgcCA9IChhbmdsZSAtIHBvaW50KSA+IFV0aWxzLkRFR18xODAgPyBwb2ludCArIFV0aWxzLkRFR18zNjAgOiBwb2ludFxuXG4gICAgICByZXR1cm4gTWF0aC5hYnMoYSAtIHApIDw9IGNvbGxpc2lvblJhZGl1c1xuICAgIH0pXG5cbiAgICByZXR1cm4gcG9pbnRJbkNvbGxpc2lvbiA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiB0cnVlXG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgVXRpbHMgYXNcbiAgZGVmYXVsdFxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi91bml2ZXJzZS9Vbml2ZXJzZS5qcydcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuL3V0aWxzL1NWR1V0aWxzLmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMvVXRpbHMuanMnXG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJ1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnXG5cbmV4cG9ydCB7VW5pdmVyc2UgYXMgXCJDaGFydFwiLCBTVkdVdGlscywgVXRpbHMsIFJhZGl4Q2hhcnQsIFRyYW5zaXRDaGFydH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==