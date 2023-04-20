/*!
 * 
 *       astrochart2
 *       A JavaScript for generating Astrology charts.
 *       Version: 0.4.0
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
  * Removes the content of an element
  *
  * @warning - It removes Event Listeners too.
  * @warning - You will (probably) get memory leak if you delete elements that have attached listeners
  */
  cleanUp( elementID ){
    let elm = document.getElementById(elementID)
    if(!elm){
      return
    }

    elm.innerHTML = ""
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
/* harmony import */ var _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../universe/Universe.js */ "./src/universe/Universe.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _Chart_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Chart.js */ "./src/charts/Chart.js");
/* harmony import */ var _points_Point_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../points/Point.js */ "./src/points/Point.js");






/**
 * @class
 * @classdesc Points and cups are displayed inside the Universe.
 * @public
 * @extends {Chart}
 */
class RadixChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_3__["default"] {

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

  #universe
  #settings
  #root
  #data

  #centerX
  #centerY
  #radius

  /**
   * @constructs
   * @param {Universe} Universe
   */
  constructor(universe) {

    if (!universe instanceof _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      throw new Error('Bad param universe.')
    }

    super(universe.getSettings())

    this.#universe = universe
    this.#settings = this.#universe.getSettings()
    this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING
    this.#root = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
    this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}`)
    this.#universe.getSVGDocument().appendChild(this.#root);

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

    this.#data = data
    this.#draw(data)

    return this
  }

  /**
   * Set radius
   *
   * @param {Number}
   */
  setRadius(radius) {
    this.#radius = radius
    this.#draw(this.#data)

    return this
  }

  /**
   * Get radius
   *
   * @param {Number}
   */
  getRadius() {
    return this.#radius
  }

  /**
   * Get Universe
   *
   * @return {Universe}
   */
  getUniverse() {
    return this.#universe
  }

  /**
   * Get Ascendat shift
   *
   * @return {Number}
   */
  getAscendantShift() {
    return (this.#data?.cusps[0]?.angle ?? 0) + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEG_180
  }

  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {
    this.cleanUp(this.#root.getAttribute('id'))
    this.#drawBackground()
    this.#drawAstrologicalSigns()
    this.#drawRuler()
    this.#drawMainAxis([{
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS,
        angle: data.cusps[0].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC,
        angle: data.cusps[3].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS,
        angle: data.cusps[6].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC,
        angle: data.cusps[9].angle
      },
    ])
    this.#drawPoints(data)
    this.#drawCusps(data)
    this.#drawBorders()
  }

  #drawBackground() {
    const MASK_ID = `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}-background-mask-1`

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const mask = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGMask(MASK_ID)
    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    outerCircle.setAttribute('fill', "white")
    mask.appendChild(outerCircle)

    const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.#getCenterCircleRadius())
    innerCircle.setAttribute('fill', "black")
    mask.appendChild(innerCircle)
    wrapper.appendChild(mask)

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    circle.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : this.#settings.CHART_BACKGROUND_COLOR);
    circle.setAttribute("mask", this.#settings.CHART_STROKE_ONLY ? "none" : `url(#${MASK_ID})`);
    wrapper.appendChild(circle)

    this.#root.appendChild(wrapper)
  }

  #drawAstrologicalSigns() {
    const NUMBER_OF_ASTROLOGICAL_SIGNS = 12
    const STEP = 30 //degree
    const COLORS_SIGNS = [this.#settings.COLOR_ARIES, this.#settings.COLOR_TAURUS, this.#settings.COLOR_GEMINI, this.#settings.COLOR_CANCER, this.#settings.COLOR_LEO, this.#settings.COLOR_VIRGO, this.#settings.COLOR_LIBRA, this.#settings.COLOR_SCORPIO, this.#settings.COLOR_SAGITTARIUS, this.#settings.COLOR_CAPRICORN, this.#settings.COLOR_AQUARIUS, this.#settings.COLOR_PISCES]
    const SYMBOL_SIGNS = [_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_ARIES, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_TAURUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_GEMINI, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_CANCER, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_LEO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_VIRGO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_LIBRA, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_SCORPIO, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_SAGITTARIUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_CAPRICORN, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AQUARIUS, _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_PISCES]

    const makeSymbol = (symbolIndex, angleInDegree) => {
      let position = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRadius() - (this.getRadius() / RadixChart.INNER_CIRCLE_RADIUS_RATIO) / 2, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleInDegree + STEP / 2, this.getAscendantShift()))

      let symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(SYMBOL_SIGNS[symbolIndex], position.x, position.y)
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("text-anchor", "middle") // start, middle, end
      symbol.setAttribute("dominant-baseline", "middle")
      symbol.setAttribute("font-size", this.#settings.RADIX_SIGNS_FONT_SIZE);
      symbol.setAttribute("fill", this.#settings.CHART_SIGNS_COLOR);
      return symbol
    }

    const makeSegment = (symbolIndex, angleFromInDegree, angleToInDegree) => {
      let a1 = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleFromInDegree, this.getAscendantShift())
      let a2 = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleToInDegree, this.getAscendantShift())
      let segment = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSegment(this.#centerX, this.#centerY, this.getRadius(), a1, a2, this.#getInnerCircleRadius());
      segment.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : COLORS_SIGNS[symbolIndex]);
      segment.setAttribute("stroke", this.#settings.CHART_STROKE_ONLY ? this.#settings.CIRCLE_COLOR : "none");
      segment.setAttribute("stroke-width", this.#settings.CHART_STROKE_ONLY ? this.#settings.CHART_STROKE : 0);
      return segment
    }

    let startAngle = 0
    let endAngle = startAngle + STEP

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

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

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    let startAngle = this.getAscendantShift()
    for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(startAngle))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius() + RadixChart.RULER_LENGTH / (i % 2 + 1), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(startAngle))
      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);

      startAngle += STEP
    }

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius());
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

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    for (const axis of axisList) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRadius() + AXIS_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
      let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
      wrapper.appendChild(line);

      let textPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRadius() + AXIS_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
      let symbol;
      let SHIFT_X = 0;
      let SHIFT_Y = 0;
      const STEP = 2
      switch (axis.name) {
        case "As":
          SHIFT_X -= STEP
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "end")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Ds":
          SHIFT_X += STEP
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "start")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Mc":
          SHIFT_Y -= STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "text-top")
          break;
        case "Ic":
          SHIFT_Y += STEP
          symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
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
    const POINT_RADIUS = this.#getInnerCircleRadius() - (4 * RadixChart.RULER_LENGTH)

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, POINT_RADIUS)
    for (const pointData of points) {
      const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_4__["default"](pointData, cusps, this.#settings)
      const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getInnerCircleRadius() - 1.5 * RadixChart.RULER_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(point.getAngle(), this.getAscendantShift()))
      const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, POINT_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(positions[point.getName()], this.getAscendantShift()))

      // ruler mark
      const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(point.getAngle(), this.getAscendantShift()))
      const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
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
      const pointerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, POINT_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(positions[point.getName()], this.getAscendantShift()))
      const pointerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, (pointPosition.x + pointerLineEndPosition.x) / 2, (pointPosition.y + pointerLineEndPosition.y) / 2)
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

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const textRadius = this.getRadius() / RadixChart.OUTER_CIRCLE_RADIUS_RATIO + 1.8 * RadixChart.RULER_LENGTH

    for (let i = 0; i < cusps.length; i++) {
      const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getCenterCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(cusps[i].angle, this.getAscendantShift()))
      const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(cusps[i].angle, this.getAscendantShift()))

      const isLineInCollisionWithPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)
      const endPosX = isLineInCollisionWithPoint ? (startPos.x + endPos.x) / 2 : endPos.x
      const endPosY = isLineInCollisionWithPoint ? (startPos.y + endPos.y) / 2 : endPos.y
      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPos.x, startPos.y, endPosX, endPosY)
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR)
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE)
      wrapper.appendChild(line);

      const startCusp = cusps[i].angle
      const endCusp = cusps[(i + 1) % 12].angle
      const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEG_360
      const textAngle = startCusp + gap / 2

      const textPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, textRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(textAngle, this.getAscendantShift()))
      const text = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGText(textPos.x, textPos.y, `${i+1}`)
      text.setAttribute("text-anchor", "middle") // start, middle, end
      text.setAttribute("dominant-baseline", "middle")
      text.setAttribute("font-size", this.#settings.RADIX_POINTS_FONT_SIZE / 2)
      text.setAttribute("fill", this.#settings.CHART_TEXT_COLOR)
      wrapper.appendChild(text)
    }

    this.#root.appendChild(wrapper)
  }

  #drawBorders() {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.#getInnerCircleRadius())
    innerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    innerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(innerCircle)

    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(outerCircle)

    const centerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.#getCenterCircleRadius())
    centerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    centerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(centerCircle)

    this.#root.appendChild(wrapper)
  }

  #getInnerCircleRadius(){
    return this.getRadius() - (this.getRadius() / RadixChart.INNER_CIRCLE_RADIUS_RATIO)
  }

  #getCenterCircleRadius(){
    return this.getRadius() / RadixChart.OUTER_CIRCLE_RADIUS_RATIO
  }

  #getRullerCircleRadius(){
    return  this.getRadius() - (this.getRadius() / RadixChart.INNER_CIRCLE_RADIUS_RATIO + RadixChart.RULER_LENGTH)
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
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _Chart_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Chart.js */ "./src/charts/Chart.js");




/**
 * @class
 * @classdesc Points and cups are displayed from outside the Universe.
 * @public
 * @extends {Chart}
 */
class TransitChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_2__["default"] {

  #radix
  #settings
  #root

  #centerX
  #centerY
  #radius

  /**
   * @constructs
   * @param {RadixChart} radix
   */
  constructor(radix) {
    if (!(radix instanceof _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_0__["default"])) {
      throw new Error('Bad param radix.')
    }

    super(radix.getUniverse().getSettings())

    this.#radix = radix
    this.#settings = this.#radix.getUniverse().getSettings()
    this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING

    this.#root = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
    this.#root.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.TRANSIT_ID}`)
    this.#radix.getUniverse().getSVGDocument().appendChild(this.#root);

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

    this.#draw(data)
  }

  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {
    this.#drawRuler()
  }

  #drawRuler() {
    // const NUMBER_OF_DIVIDERS = 72
    // const STEP = 5
    //
    // const wrapper = SVGUtils.SVGGroup()
    //
    // let startAngle = this.#anscendantShift
    // for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
    //   let startPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius, Utils.degreeToRadian(startAngle))
    //   let endPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius + RadixChart.RULER_LENGTH / (i % 2 + 1), Utils.degreeToRadian(startAngle))
    //   const line = SVGUtils.SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    //   line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
    //   line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    //   wrapper.appendChild(line);
    //
    //   startAngle += STEP
    // }
    //
    // const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius);
    // circle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    // circle.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    // wrapper.appendChild(circle);
    //
    // this.#root.appendChild(wrapper)
  }
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
    let STEP = 0.9

    angleInSign.call(this)
    //this.#isRetrograde && retrogradeSymbol.call(this)
    this.getDignity() && dignities.call(this)

    return wrapper //======>

    /*
     *  Angle in sign
     */
    function angleInSign() {
      const angleInSignRadius = 2 * STEP * this.#settings.POINT_COLLISION_RADIUS
      const angleInSignPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, angleInSignRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter))
      // It is possible to rotate the text, when uncomment a line bellow.
      //textWrapper.setAttribute("transform", `rotate(${angleFromSymbolToCenter},${textPosition.x},${textPosition.y})`)

      const text = []
      text.push(this.getAngleInSign())
      this.#isRetrograde && text.push(_utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_RETROGRADE_CODE)

      const angleInSignText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(angleInSignPosition.x, angleInSignPosition.y, text.join(" "))
      angleInSignText.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      angleInSignText.setAttribute("text-anchor", "middle") // start, middle, end
      angleInSignText.setAttribute("dominant-baseline", "middle")
      angleInSignText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_FONT_SIZE);
      angleInSignText.setAttribute("fill", this.#settings.POINT_PROPERTIES_COLOR);
      wrapper.appendChild(angleInSignText)
    }

    /*
     *  Dignities
     */
    function dignities() {
      const dignitiesRadius = 3 * STEP * this.#settings.POINT_COLLISION_RADIUS
      const dignitiesPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, dignitiesRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter))
      const dignitiesText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(dignitiesPosition.x, dignitiesPosition.y, this.getDignity())
      dignitiesText.setAttribute("font-family", "sans-serif");
      dignitiesText.setAttribute("text-anchor", "middle") // start, middle, end
      dignitiesText.setAttribute("dominant-baseline", "text-bottom")
      dignitiesText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_FONT_SIZE/1.2);
      dignitiesText.setAttribute("fill", this.#settings.POINT_PROPERTIES_COLOR);
      wrapper.appendChild(dignitiesText)
    }    
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
  getSignNumber() {
    let angle = this.#angle % _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].DEG_360
    return Math.floor((angle / 30) + 1);
  }

  /**
   * Returns the angle (Integer) in the sign in which it stands.
   *
   * @return {Number}
   */
  getAngleInSign() {
    return Math.round(this.#angle % 30)
  }

  /**
   * Get dignity symbol (r - rulership, d - detriment, f - fall, e - exaltation)
   *
   * @return {String} - dignity symbol (r,d,f,e)
   */
  getDignity() {
    const ARIES = 1
    const TAURUS = 2
    const GEMINI = 3
    const CANCER = 4
    const LEO = 5
    const VIRGO = 6
    const LIBRA = 7
    const SCORPIO = 8
    const SAGITTARIUS = 9
    const CAPRICORN = 10
    const AQUARIUS = 11
    const PISCES = 12

    const RULERSHIP_SYMBOL = "r"
    const DETRIMENT_SYMBOL = "d"
    const FALL_SYMBOL = "f"
    const EXALTATION_SYMBOL = "e"

    switch (this.#name) {
      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_SUN:
        if (this.getSignNumber() == LEO) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == AQUARIUS) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == VIRGO) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == ARIES) {
          return EXALTATION_SYMBOL //======>
        }

        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MOON:
        if (this.getSignNumber() == CANCER) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == CAPRICORN) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == SCORPIO) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == TAURUS) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MERCURY:
        if (this.getSignNumber() == GEMINI) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == SAGITTARIUS) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == PISCES) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == VIRGO) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_VENUS:
        if (this.getSignNumber() == TAURUS || this.getSignNumber() == LIBRA) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == ARIES || this.getSignNumber() == SCORPIO) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == VIRGO) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == PISCES) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_MARS:
        if (this.getSignNumber() == ARIES || this.getSignNumber() == SCORPIO) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == TAURUS || this.getSignNumber() == LIBRA) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == CANCER) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == CAPRICORN) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_JUPITER:
        if (this.getSignNumber() == SAGITTARIUS || this.getSignNumber() == PISCES) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == GEMINI || this.getSignNumber() == VIRGO) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == CAPRICORN) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == CANCER) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_SATURN:
        if (this.getSignNumber() == CAPRICORN || this.getSignNumber() == AQUARIUS) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == CANCER || this.getSignNumber() == LEO) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == ARIES) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == LIBRA) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_URANUS:
        if (this.getSignNumber() == AQUARIUS) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == LEO) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == TAURUS) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == SCORPIO) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

      case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_NEPTUNE:
        if (this.getSignNumber() == PISCES) {
          return RULERSHIP_SYMBOL //======>
        }

        if (this.getSignNumber() == VIRGO) {
          return DETRIMENT_SYMBOL //======>
        }

        if (this.getSignNumber() == GEMINI || this.getSignNumber() == AQUARIUS) {
          return FALL_SYMBOL //======>
        }

        if (this.getSignNumber() == SAGITTARIUS || this.getSignNumber() == LEO) {
          return EXALTATION_SYMBOL //======>
        }
        return ""
        break;

        case _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SYMBOL_PLUTO:
          if (this.getSignNumber() == SCORPIO) {
            return RULERSHIP_SYMBOL //======>
          }

          if (this.getSignNumber() == TAURUS) {
            return DETRIMENT_SYMBOL //======>
          }

          if (this.getSignNumber() == LIBRA) {
            return FALL_SYMBOL //======>
          }

          if (this.getSignNumber() == ARIES ){
            return EXALTATION_SYMBOL //======>
          }
          return ""
          break;

      default:
        return ""
    }
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

    this.#radix = new _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__["default"](this)
    this.#transit = new _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__["default"](this.#radix)

    this.#loadFont("Astronomicon", '../assets/fonts/ttf/AstronomiconFonts_1.1/Astronomicon.ttf')

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
  *
  * @param {String} family
  * @param {String} source
  * @param {Object}
  *
  * @see https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace
  */
  async #loadFont( family, source, descriptors ){

    if (!('FontFace' in window)) {
      console.error("Ooops, FontFace is not a function.")
      console.error("@see https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API")
      return
    }

    const font = new FontFace(family, `url(${source})`, descriptors)

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

  static SYMBOL_RETROGRADE = "Retrograde"

  // Astronomicon font codes
  static SYMBOL_ARIES_CODE = "A";
  static SYMBOL_TAURUS_CODE = "B";
  static SYMBOL_GEMINI_CODE = "C";
  static SYMBOL_CANCER_CODE = "D";
  static SYMBOL_LEO_CODE = "E";
  static SYMBOL_VIRGO_CODE = "F";
  static SYMBOL_LIBRA_CODE = "G";
  static SYMBOL_SCORPIO_CODE = "H";
  static SYMBOL_SAGITTARIUS_CODE = "I";
  static SYMBOL_CAPRICORN_CODE = "J";
  static SYMBOL_AQUARIUS_CODE = "K";
  static SYMBOL_PISCES_CODE = "L";

  static SYMBOL_SUN_CODE = "Q";
  static SYMBOL_MOON_CODE = "R";
  static SYMBOL_MERCURY_CODE = "S";
  static SYMBOL_VENUS_CODE = "T";
  static SYMBOL_EARTH_CODE = ">";
  static SYMBOL_MARS_CODE = "U";
  static SYMBOL_JUPITER_CODE = "V";
  static SYMBOL_SATURN_CODE = "W";
  static SYMBOL_URANUS_CODE = "X";
  static SYMBOL_NEPTUNE_CODE = "Y";
  static SYMBOL_PLUTO_CODE = "Z";
  static SYMBOL_CHIRON_CODE = "q";
  static SYMBOL_LILITH_CODE = "z";
  static SYMBOL_NNODE_CODE = "g";
  static SYMBOL_SNODE_CODE = "i";

  static SYMBOL_AS_CODE = "c";
  static SYMBOL_DS_CODE = "f";
  static SYMBOL_MC_CODE = "d";
  static SYMBOL_IC_CODE = "e";

  static SYMBOL_RETROGRADE_CODE = "M"

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

      case SVGUtils.SYMBOL_RETROGRADE:
        return retrogradeSymbol(xPos, yPos)
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
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_AS_CODE )
    }

    /*
     * Descendant symbol
     */
    function dsSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_DS_CODE)
    }

    /*
     * Medium coeli symbol
     */
    function mcSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MC_CODE)
    }

    /*
     * Immum coeli symbol
     */
    function icSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_IC_CODE)
    }

    /*
     * Aries symbol
     */
    function ariesSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_ARIES_CODE )
    }

    /*
     * Taurus symbol
     */
    function taurusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_TAURUS_CODE)
    }

    /*
     * Gemini symbol
     */
    function geminiSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_GEMINI_CODE)
    }

    /*
     * Cancer symbol
     */
    function cancerSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CANCER_CODE)
    }

    /*
     * Leo symbol
     */
    function leoSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_LEO_CODE)
    }

    /*
     * Virgo symbol
     */
    function virgoSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_VIRGO_CODE)
    }

    /*
     * Libra symbol
     */
    function libraSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_LIBRA_CODE)
    }

    /*
     * Scorpio symbol
     */
    function scorpioSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SCORPIO_CODE)
    }

    /*
     * Sagittarius symbol
     */
    function sagittariusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SAGITTARIUS_CODE)
    }

    /*
     * Capricorn symbol
     */
    function capricornSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CAPRICORN_CODE)
    }

    /*
     * Aquarius symbol
     */
    function aquariusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_AQUARIUS_CODE)
    }

    /*
     * Pisces symbol
     */
    function piscesSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_PISCES_CODE)
    }

    /*
     * Sun symbol
     */
    function sunSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SUN_CODE)
    }

    /*
     * Moon symbol
     */
    function moonSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MOON_CODE)
    }

    /*
     * Mercury symbol
     */
    function mercurySymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MERCURY_CODE)
    }

    /*
     * Venus symbol
     */
    function venusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_VENUS_CODE)
    }

    /*
     * Earth symbol
     */
    function earthSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_EARTH_CODE)
    }

    /*
     * Mars symbol
     */
    function marsSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_MARS_CODE)
    }

    /*
     * Jupiter symbol
     */
    function jupiterSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_JUPITER_CODE)
    }

    /*
     * Saturn symbol
     */
    function saturnSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SATURN_CODE)
    }

    /*
     * Uranus symbol
     */
    function uranusSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_URANUS_CODE)
    }

    /*
     * Neptune symbol
     */
    function neptuneSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_NEPTUNE_CODE)
    }

    /*
     * Pluto symbol
     */
    function plutoSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_PLUTO_CODE)
    }

    /*
     * Chiron symbol
     */
    function chironSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CHIRON_CODE)
    }

    /*
     * Lilith symbol
     */
    function lilithSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_LILITH_CODE)
    }

    /*
     * NNode symbol
     */
    function nnodeSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_NNODE_CODE)
    }

    /*
     * SNode symbol
     */
    function snodeSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SNODE_CODE)
    }

    function retrogradeSymbol(xPos, yPos){
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_RETROGRADE_CODE)
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
/* harmony export */   "RadixChart": () => (/* reexport safe */ _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "SVGUtils": () => (/* reexport safe */ _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "TransitChart": () => (/* reexport safe */ _charts_TransitChart_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "Universe": () => (/* reexport safe */ _universe_Universe_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0S1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOzs7Ozs7Ozs7Ozs7Ozs7QUM5QlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTlA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeERzRDtBQUNqQjtBQUNOO0FBQ1c7QUFDSTs7O0FBR3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLHlDQUF5Qzs7QUFFekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUMsRUFBRSxvRUFBZTtBQUN0RDtBQUNBLEtBQUs7QUFDTCx3QkFBd0Isc0VBQW9CO0FBQzVDOztBQUVBLHNCQUFzQiw2REFBVTtBQUNoQyx3QkFBd0IsK0RBQVk7O0FBRXBDOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE2QyxPQUFPOztBQUVwRDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBS0M7Ozs7Ozs7Ozs7Ozs7OztBQ25IRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUtDOzs7Ozs7Ozs7Ozs7Ozs7QUN4akJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGFBQWEsR0FBRyxVQUFVO0FBQ3JEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYyxRQUFRLEdBQUc7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWSxRQUFRO0FBQ3BCLFlBQVksUUFBUTtBQUNwQixZQUFZLFFBQVE7QUFDcEIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsT0FBTztBQUNyQixhQUFhLE9BQU8sV0FBVyxtQkFBbUIsR0FBRyxtQkFBbUI7QUFDeEUsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWMsUUFBUSxHQUFHO0FBQ3pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsMkNBQTJDLFFBQVE7QUFDbkQ7QUFDQTtBQUNBOztBQUVBLHdCQUF3QixPQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLElBQUk7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFLQzs7Ozs7OztVQ2pMRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkM7QUFDSDtBQUNOO0FBQ1c7QUFDSTs7QUFFUyIsInNvdXJjZXMiOlsid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9DaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1JhZGl4Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3BvaW50cy9Qb2ludC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvQ29sb3JzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvUG9pbnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9SYWRpeC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1RyYW5zaXQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9Vbml2ZXJzZS5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdW5pdmVyc2UvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL1NWR1V0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9VdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiYXN0cm9sb2d5XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImFzdHJvbG9neVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsICgpID0+IHtcbnJldHVybiAiLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiBhYnN0cmFjdCBjbGFzcyBmb3IgYWxsIHR5cGUgb2YgQ2hhcnRcbiAqIEBwdWJsaWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqIEBhYnN0cmFjdFxuICovXG5jbGFzcyBDaGFydCB7XG5cbiAgLy8jc2V0dGluZ3NcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xuICAgIC8vdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBkYXRhIGlzIHZhbGlkXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIHVuZGVmaW5lZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHtpc1ZhbGlkOmJvb2xlYW4sIG1lc3NhZ2U6U3RyaW5nfVxuICAgKi9cbiAgdmFsaWRhdGVEYXRhKGRhdGEpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc2luZyBwYXJhbSBkYXRhLlwiKVxuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLnBvaW50cykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcInBvaW50cyBpcyBub3QgQXJyYXkuXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZGF0YS5jdXNwcykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICBtZXNzYWdlOiBcImN1cHMgaXMgbm90IEFycmF5LlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY3VzcHMubGVuZ3RoICE9PSAxMikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwiY3VzcHMubGVuZ3RoICE9PSAxMlwiXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgcG9pbnQgb2YgZGF0YS5wb2ludHMpIHtcbiAgICAgIGlmICh0eXBlb2YgcG9pbnQubmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50Lm5hbWUgIT09ICdzdHJpbmcnXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHBvaW50Lm5hbWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgbWVzc2FnZTogXCJwb2ludC5uYW1lLmxlbmd0aCA9PSAwXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBwb2ludC5hbmdsZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50LmFuZ2xlICE9PSAnbnVtYmVyJ1wiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBjdXNwIG9mIGRhdGEuY3VzcHMpIHtcbiAgICAgIGlmICh0eXBlb2YgY3VzcC5hbmdsZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImN1c3AuYW5nbGUgIT09ICdudW1iZXInXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiB0cnVlLFxuICAgICAgbWVzc2FnZTogXCJcIlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIFJlbW92ZXMgdGhlIGNvbnRlbnQgb2YgYW4gZWxlbWVudFxuICAqXG4gICogQHdhcm5pbmcgLSBJdCByZW1vdmVzIEV2ZW50IExpc3RlbmVycyB0b28uXG4gICogQHdhcm5pbmcgLSBZb3Ugd2lsbCAocHJvYmFibHkpIGdldCBtZW1vcnkgbGVhayBpZiB5b3UgZGVsZXRlIGVsZW1lbnRzIHRoYXQgaGF2ZSBhdHRhY2hlZCBsaXN0ZW5lcnNcbiAgKi9cbiAgY2xlYW5VcCggZWxlbWVudElEICl7XG4gICAgbGV0IGVsbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJRClcbiAgICBpZighZWxtKXtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGVsbS5pbm5lckhUTUwgPSBcIlwiXG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldFBvaW50cygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldFBvaW50KG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldEFzcGVjdHMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBhbmltYXRlVG8oZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3MuXCIpO1xuICB9XG5cbiAgLy8gIyMgUFJPVEVDVEVEICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG59XG5cbmV4cG9ydCB7XG4gIENoYXJ0IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCBVbml2ZXJzZSBmcm9tICcuLi91bml2ZXJzZS9Vbml2ZXJzZS5qcyc7XG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuaW1wb3J0IFBvaW50IGZyb20gJy4uL3BvaW50cy9Qb2ludC5qcydcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUG9pbnRzIGFuZCBjdXBzIGFyZSBkaXNwbGF5ZWQgaW5zaWRlIHRoZSBVbml2ZXJzZS5cbiAqIEBwdWJsaWNcbiAqIEBleHRlbmRzIHtDaGFydH1cbiAqL1xuY2xhc3MgUmFkaXhDaGFydCBleHRlbmRzIENoYXJ0IHtcblxuICAvKlxuICAgKiBJbm5lciBjaXJjbGUgcmFkaXVzIHJhdGlvXG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAZGVmYXVsdCA4XG4gICAqL1xuICBzdGF0aWMgSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTyA9IDg7XG5cbiAgLypcbiAgICogT3V0ZXIgY2lyY2xlIHJhZGl1cyByYXRpb1xuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQGRlZmF1bHQgMlxuICAgKi9cbiAgc3RhdGljIE9VVEVSX0NJUkNMRV9SQURJVVNfUkFUSU8gPSAyO1xuXG5cbiAgLypcbiAgICogVGhlIGxlbmd0aCBvZiB0aGUgcG9pbnRlcnMgaW4gdGhlIHJ1bGVyXG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAZGVmYXVsdCAxMFxuICAgKi9cbiAgc3RhdGljIFJVTEVSX0xFTkdUSCA9IDEwXG5cbiAgI3VuaXZlcnNlXG4gICNzZXR0aW5nc1xuICAjcm9vdFxuICAjZGF0YVxuXG4gICNjZW50ZXJYXG4gICNjZW50ZXJZXG4gICNyYWRpdXNcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtVbml2ZXJzZX0gVW5pdmVyc2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHVuaXZlcnNlKSB7XG5cbiAgICBpZiAoIXVuaXZlcnNlIGluc3RhbmNlb2YgVW5pdmVyc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHVuaXZlcnNlLicpXG4gICAgfVxuXG4gICAgc3VwZXIodW5pdmVyc2UuZ2V0U2V0dGluZ3MoKSlcblxuICAgIHRoaXMuI3VuaXZlcnNlID0gdW5pdmVyc2VcbiAgICB0aGlzLiNzZXR0aW5ncyA9IHRoaXMuI3VuaXZlcnNlLmdldFNldHRpbmdzKClcbiAgICB0aGlzLiNjZW50ZXJYID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcbiAgICB0aGlzLiNjZW50ZXJZID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG4gICAgdGhpcy4jcmFkaXVzID0gTWF0aC5taW4odGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSkgLSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QQURESU5HXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH1gKVxuICAgIHRoaXMuI3VuaXZlcnNlLmdldFNWR0RvY3VtZW50KCkuYXBwZW5kQ2hpbGQodGhpcy4jcm9vdCk7XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBjaGFydCBkYXRhXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIG5vdCB2YWxpZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybiB7UmFkaXhDaGFydH1cbiAgICovXG4gIHNldERhdGEoZGF0YSkge1xuICAgIGxldCBzdGF0dXMgPSB0aGlzLnZhbGlkYXRlRGF0YShkYXRhKVxuICAgIGlmICghc3RhdHVzLmlzVmFsaWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihzdGF0dXMubWVzc2FnZXMpXG4gICAgfVxuXG4gICAgdGhpcy4jZGF0YSA9IGRhdGFcbiAgICB0aGlzLiNkcmF3KGRhdGEpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCByYWRpdXNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9XG4gICAqL1xuICBzZXRSYWRpdXMocmFkaXVzKSB7XG4gICAgdGhpcy4jcmFkaXVzID0gcmFkaXVzXG4gICAgdGhpcy4jZHJhdyh0aGlzLiNkYXRhKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcmFkaXVzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0UmFkaXVzKCkge1xuICAgIHJldHVybiB0aGlzLiNyYWRpdXNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgVW5pdmVyc2VcbiAgICpcbiAgICogQHJldHVybiB7VW5pdmVyc2V9XG4gICAqL1xuICBnZXRVbml2ZXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdW5pdmVyc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgQXNjZW5kYXQgc2hpZnRcbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0QXNjZW5kYW50U2hpZnQoKSB7XG4gICAgcmV0dXJuICh0aGlzLiNkYXRhPy5jdXNwc1swXT8uYW5nbGUgPz8gMCkgKyBVdGlscy5ERUdfMTgwXG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qXG4gICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gICNkcmF3KGRhdGEpIHtcbiAgICB0aGlzLmNsZWFuVXAodGhpcy4jcm9vdC5nZXRBdHRyaWJ1dGUoJ2lkJykpXG4gICAgdGhpcy4jZHJhd0JhY2tncm91bmQoKVxuICAgIHRoaXMuI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpXG4gICAgdGhpcy4jZHJhd1J1bGVyKClcbiAgICB0aGlzLiNkcmF3TWFpbkF4aXMoW3tcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLFxuICAgICAgICBhbmdsZTogZGF0YS5jdXNwc1swXS5hbmdsZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0lDLFxuICAgICAgICBhbmdsZTogZGF0YS5jdXNwc1szXS5hbmdsZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0RTLFxuICAgICAgICBhbmdsZTogZGF0YS5jdXNwc1s2XS5hbmdsZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxuICAgICAgICBhbmdsZTogZGF0YS5jdXNwc1s5XS5hbmdsZVxuICAgICAgfSxcbiAgICBdKVxuICAgIHRoaXMuI2RyYXdQb2ludHMoZGF0YSlcbiAgICB0aGlzLiNkcmF3Q3VzcHMoZGF0YSlcbiAgICB0aGlzLiNkcmF3Qm9yZGVycygpXG4gIH1cblxuICAjZHJhd0JhY2tncm91bmQoKSB7XG4gICAgY29uc3QgTUFTS19JRCA9IGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5SQURJWF9JRH0tYmFja2dyb3VuZC1tYXNrLTFgXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgbWFzayA9IFNWR1V0aWxzLlNWR01hc2soTUFTS19JRClcbiAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpKVxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwid2hpdGVcIilcbiAgICBtYXNrLmFwcGVuZENoaWxkKG91dGVyQ2lyY2xlKVxuXG4gICAgY29uc3QgaW5uZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgXCJibGFja1wiKVxuICAgIG1hc2suYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChtYXNrKVxuXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkpXG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IHRoaXMuI3NldHRpbmdzLkNIQVJUX0JBQ0tHUk9VTkRfQ09MT1IpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJtYXNrXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiBgdXJsKCMke01BU0tfSUR9KWApO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2RyYXdBc3Ryb2xvZ2ljYWxTaWducygpIHtcbiAgICBjb25zdCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TID0gMTJcbiAgICBjb25zdCBTVEVQID0gMzAgLy9kZWdyZWVcbiAgICBjb25zdCBDT0xPUlNfU0lHTlMgPSBbdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVJJRVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1RBVVJVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfR0VNSU5JLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9DQU5DRVIsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xFTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfVklSR08sIHRoaXMuI3NldHRpbmdzLkNPTE9SX0xJQlJBLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQ09SUElPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9TQUdJVFRBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FQUklDT1JOLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9BUVVBUklVUywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfUElTQ0VTXVxuICAgIGNvbnN0IFNZTUJPTF9TSUdOUyA9IFtTVkdVdGlscy5TWU1CT0xfQVJJRVMsIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVMsIFNWR1V0aWxzLlNZTUJPTF9HRU1JTkksIFNWR1V0aWxzLlNZTUJPTF9DQU5DRVIsIFNWR1V0aWxzLlNZTUJPTF9MRU8sIFNWR1V0aWxzLlNZTUJPTF9WSVJHTywgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBLCBTVkdVdGlscy5TWU1CT0xfU0NPUlBJTywgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTLCBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOLCBTVkdVdGlscy5TWU1CT0xfQVFVQVJJVVMsIFNWR1V0aWxzLlNZTUJPTF9QSVNDRVNdXG5cbiAgICBjb25zdCBtYWtlU3ltYm9sID0gKHN5bWJvbEluZGV4LCBhbmdsZUluRGVncmVlKSA9PiB7XG4gICAgICBsZXQgcG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkgLSAodGhpcy5nZXRSYWRpdXMoKSAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTykgLyAyLCBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZUluRGVncmVlICsgU1RFUCAvIDIsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgIGxldCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woU1lNQk9MX1NJR05TW3N5bWJvbEluZGV4XSwgcG9zaXRpb24ueCwgcG9zaXRpb24ueSlcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfU0lHTlNfRk9OVF9TSVpFKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NJR05TX0NPTE9SKTtcbiAgICAgIHJldHVybiBzeW1ib2xcbiAgICB9XG5cbiAgICBjb25zdCBtYWtlU2VnbWVudCA9IChzeW1ib2xJbmRleCwgYW5nbGVGcm9tSW5EZWdyZWUsIGFuZ2xlVG9JbkRlZ3JlZSkgPT4ge1xuICAgICAgbGV0IGExID0gVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVGcm9tSW5EZWdyZWUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSlcbiAgICAgIGxldCBhMiA9IFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlVG9JbkRlZ3JlZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKVxuICAgICAgbGV0IHNlZ21lbnQgPSBTVkdVdGlscy5TVkdTZWdtZW50KHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCksIGExLCBhMiwgdGhpcy4jZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSk7XG4gICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyBcIm5vbmVcIiA6IENPTE9SU19TSUdOU1tzeW1ib2xJbmRleF0pO1xuICAgICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFX09OTFkgPyB0aGlzLiNzZXR0aW5ncy5DSVJDTEVfQ09MT1IgOiBcIm5vbmVcIik7XG4gICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSA6IDApO1xuICAgICAgcmV0dXJuIHNlZ21lbnRcbiAgICB9XG5cbiAgICBsZXQgc3RhcnRBbmdsZSA9IDBcbiAgICBsZXQgZW5kQW5nbGUgPSBzdGFydEFuZ2xlICsgU1RFUFxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUzsgaSsrKSB7XG5cbiAgICAgIGxldCBzZWdtZW50ID0gbWFrZVNlZ21lbnQoaSwgc3RhcnRBbmdsZSwgZW5kQW5nbGUpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHNlZ21lbnQpO1xuXG4gICAgICBsZXQgc3ltYm9sID0gbWFrZVN5bWJvbChpLCBzdGFydEFuZ2xlKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xuXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVA7XG4gICAgICBlbmRBbmdsZSA9IHN0YXJ0QW5nbGUgKyBTVEVQXG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2RyYXdSdWxlcigpIHtcbiAgICBjb25zdCBOVU1CRVJfT0ZfRElWSURFUlMgPSA3MlxuICAgIGNvbnN0IFNURVAgPSA1XG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgbGV0IHN0YXJ0QW5nbGUgPSB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTUJFUl9PRl9ESVZJREVSUzsgaSsrKSB7XG4gICAgICBsZXQgc3RhcnRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSArIFJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RIIC8gKGkgJSAyICsgMSksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb2ludC54LCBzdGFydFBvaW50LnksIGVuZFBvaW50LngsIGVuZFBvaW50LnkpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgc3RhcnRBbmdsZSArPSBTVEVQXG4gICAgfVxuXG4gICAgY29uc3QgY2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgbWFpbiBheGlzXG4gICAqIEBwYXJhbSB7QXJyYXl9IGF4aXNMaXN0XG4gICAqL1xuICAjZHJhd01haW5BeGlzKGF4aXNMaXN0KSB7XG4gICAgY29uc3QgQVhJU19MRU5HVEggPSAxMFxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGZvciAoY29uc3QgYXhpcyBvZiBheGlzTGlzdCkge1xuICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkgKyBBWElTX0xFTkdUSCwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGxldCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIGxldCB0ZXh0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkgKyBBWElTX0xFTkdUSCwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGxldCBzeW1ib2w7XG4gICAgICBsZXQgU0hJRlRfWCA9IDA7XG4gICAgICBsZXQgU0hJRlRfWSA9IDA7XG4gICAgICBjb25zdCBTVEVQID0gMlxuICAgICAgc3dpdGNoIChheGlzLm5hbWUpIHtcbiAgICAgICAgY2FzZSBcIkFzXCI6XG4gICAgICAgICAgU0hJRlRfWCAtPSBTVEVQXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwiZW5kXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJEc1wiOlxuICAgICAgICAgIFNISUZUX1ggKz0gU1RFUFxuICAgICAgICAgIFNISUZUX1kgLT0gU1RFUFxuICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcInN0YXJ0XCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJNY1wiOlxuICAgICAgICAgIFNISUZUX1kgLT0gU1RFUFxuICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcInRleHQtdG9wXCIpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJJY1wiOlxuICAgICAgICAgIFNISUZUX1kgKz0gU1RFUFxuICAgICAgICAgIHN5bWJvbCA9IFNWR1V0aWxzLlNWR1N5bWJvbChheGlzLm5hbWUsIHRleHRQb2ludC54ICsgU0hJRlRfWCwgdGV4dFBvaW50LnkgKyBTSElGVF9ZKVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxuICAgICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcImhhbmdpbmdcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGF4aXMubmFtZSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIGF4aXMgbmFtZS5cIilcbiAgICAgIH1cbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX0FYSVNfRk9OVF9TSVpFKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NJR05TX0NPTE9SKTtcblxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgcG9pbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxuICAgKi9cbiAgI2RyYXdQb2ludHMoZGF0YSkge1xuICAgIGNvbnN0IHBvaW50cyA9IGRhdGEucG9pbnRzXG4gICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG4gICAgY29uc3QgUE9JTlRfUkFESVVTID0gdGhpcy4jZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtICg0ICogUmFkaXhDaGFydC5SVUxFUl9MRU5HVEgpXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3QgcG9zaXRpb25zID0gVXRpbHMuY2FsY3VsYXRlUG9zaXRpb25XaXRob3V0T3ZlcmxhcHBpbmcocG9pbnRzLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTLCBQT0lOVF9SQURJVVMpXG4gICAgZm9yIChjb25zdCBwb2ludERhdGEgb2YgcG9pbnRzKSB7XG4gICAgICBjb25zdCBwb2ludCA9IG5ldyBQb2ludChwb2ludERhdGEsIGN1c3BzLCB0aGlzLiNzZXR0aW5ncylcbiAgICAgIGNvbnN0IHBvaW50UG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuI2dldElubmVyQ2lyY2xlUmFkaXVzKCkgLSAxLjUgKiBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSCwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0QW5nbGUoKSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGNvbnN0IHN5bWJvbFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCBQT0lOVF9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICAvLyBydWxlciBtYXJrXG4gICAgICBjb25zdCBydWxlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBydWxlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCBydWxlckxpbmVFbmRQb3NpdGlvbi54LCBydWxlckxpbmVFbmRQb3NpdGlvbi55KVxuICAgICAgcnVsZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocnVsZXJMaW5lKTtcblxuICAgICAgLy8gc3ltYm9sXG4gICAgICBjb25zdCBzeW1ib2wgPSBwb2ludC5nZXRTeW1ib2woc3ltYm9sUG9zaXRpb24ueCwgc3ltYm9sUG9zaXRpb24ueSlcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfUE9JTlRTX0ZPTlRfU0laRSlcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UU19DT0xPUilcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgLy8gcG9pbnRlclxuICAgICAgLy9pZiAocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0gIT0gcG9pbnREYXRhLnBvc2l0aW9uKSB7XG4gICAgICBjb25zdCBwb2ludGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCBQT0lOVF9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgcG9pbnRlckxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHBvaW50UG9zaXRpb24ueCwgcG9pbnRQb3NpdGlvbi55LCAocG9pbnRQb3NpdGlvbi54ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi54KSAvIDIsIChwb2ludFBvc2l0aW9uLnkgKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLnkpIC8gMilcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIHBvaW50ZXJMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0UgLyAyKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQocG9pbnRlckxpbmUpO1xuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gIC8qXG4gICAqIERyYXcgcG9pbnRzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gY2hhcnQgZGF0YVxuICAgKi9cbiAgI2RyYXdDdXNwcyhkYXRhKSB7XG4gICAgY29uc3QgcG9pbnRzID0gZGF0YS5wb2ludHNcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgIGNvbnN0IHBvaW50c1Bvc2l0aW9ucyA9IHBvaW50cy5tYXAocG9pbnQgPT4ge1xuICAgICAgcmV0dXJuIHBvaW50LmFuZ2xlXG4gICAgfSlcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCB0ZXh0UmFkaXVzID0gdGhpcy5nZXRSYWRpdXMoKSAvIFJhZGl4Q2hhcnQuT1VURVJfQ0lSQ0xFX1JBRElVU19SQVRJTyArIDEuOCAqIFJhZGl4Q2hhcnQuUlVMRVJfTEVOR1RIXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1c3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzdGFydFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGN1c3BzW2ldLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgZW5kUG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgIGNvbnN0IGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID0gVXRpbHMuaXNDb2xsaXNpb24oY3VzcHNbaV0uYW5nbGUsIHBvaW50c1Bvc2l0aW9ucywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUyAvIDIpXG4gICAgICBjb25zdCBlbmRQb3NYID0gaXNMaW5lSW5Db2xsaXNpb25XaXRoUG9pbnQgPyAoc3RhcnRQb3MueCArIGVuZFBvcy54KSAvIDIgOiBlbmRQb3MueFxuICAgICAgY29uc3QgZW5kUG9zWSA9IGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID8gKHN0YXJ0UG9zLnkgKyBlbmRQb3MueSkgLyAyIDogZW5kUG9zLnlcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9zLngsIHN0YXJ0UG9zLnksIGVuZFBvc1gsIGVuZFBvc1kpXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKVxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgY29uc3Qgc3RhcnRDdXNwID0gY3VzcHNbaV0uYW5nbGVcbiAgICAgIGNvbnN0IGVuZEN1c3AgPSBjdXNwc1soaSArIDEpICUgMTJdLmFuZ2xlXG4gICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxuICAgICAgY29uc3QgdGV4dEFuZ2xlID0gc3RhcnRDdXNwICsgZ2FwIC8gMlxuXG4gICAgICBjb25zdCB0ZXh0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0ZXh0UmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbih0ZXh0QW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCB0ZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dCh0ZXh0UG9zLngsIHRleHRQb3MueSwgYCR7aSsxfWApXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfUE9JTlRTX0ZPTlRfU0laRSAvIDIpXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVEVYVF9DT0xPUilcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGV4dClcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd0JvcmRlcnMoKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldElubmVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgaW5uZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGlubmVyQ2lyY2xlKVxuXG4gICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSlcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBvdXRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpXG5cbiAgICBjb25zdCBjZW50ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpXG4gICAgY2VudGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIGNlbnRlckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoY2VudGVyQ2lyY2xlKVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2dldElubmVyQ2lyY2xlUmFkaXVzKCl7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmFkaXVzKCkgLSAodGhpcy5nZXRSYWRpdXMoKSAvIFJhZGl4Q2hhcnQuSU5ORVJfQ0lSQ0xFX1JBRElVU19SQVRJTylcbiAgfVxuXG4gICNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKXtcbiAgICByZXR1cm4gdGhpcy5nZXRSYWRpdXMoKSAvIFJhZGl4Q2hhcnQuT1VURVJfQ0lSQ0xFX1JBRElVU19SQVRJT1xuICB9XG5cbiAgI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpe1xuICAgIHJldHVybiAgdGhpcy5nZXRSYWRpdXMoKSAtICh0aGlzLmdldFJhZGl1cygpIC8gUmFkaXhDaGFydC5JTk5FUl9DSVJDTEVfUkFESVVTX1JBVElPICsgUmFkaXhDaGFydC5SVUxFUl9MRU5HVEgpXG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgUmFkaXhDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBvaW50cyBhbmQgY3VwcyBhcmUgZGlzcGxheWVkIGZyb20gb3V0c2lkZSB0aGUgVW5pdmVyc2UuXG4gKiBAcHVibGljXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XG4gKi9cbmNsYXNzIFRyYW5zaXRDaGFydCBleHRlbmRzIENoYXJ0IHtcblxuICAjcmFkaXhcbiAgI3NldHRpbmdzXG4gICNyb290XG5cbiAgI2NlbnRlclhcbiAgI2NlbnRlcllcbiAgI3JhZGl1c1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge1JhZGl4Q2hhcnR9IHJhZGl4XG4gICAqL1xuICBjb25zdHJ1Y3RvcihyYWRpeCkge1xuICAgIGlmICghKHJhZGl4IGluc3RhbmNlb2YgUmFkaXhDaGFydCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHJhZGl4LicpXG4gICAgfVxuXG4gICAgc3VwZXIocmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTZXR0aW5ncygpKVxuXG4gICAgdGhpcy4jcmFkaXggPSByYWRpeFxuICAgIHRoaXMuI3NldHRpbmdzID0gdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTZXR0aW5ncygpXG4gICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuXG4gICAgdGhpcy4jcm9vdCA9IFNWR1V0aWxzLlNWR0dyb3VwKClcbiAgICB0aGlzLiNyb290LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5UUkFOU0lUX0lEfWApXG4gICAgdGhpcy4jcmFkaXguZ2V0VW5pdmVyc2UoKS5nZXRTVkdEb2N1bWVudCgpLmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2VzKVxuICAgIH1cblxuICAgIHRoaXMuI2RyYXcoZGF0YSlcbiAgfVxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLypcbiAgICogRHJhdyByYWRpeCBjaGFydFxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgI2RyYXcoZGF0YSkge1xuICAgIHRoaXMuI2RyYXdSdWxlcigpXG4gIH1cblxuICAjZHJhd1J1bGVyKCkge1xuICAgIC8vIGNvbnN0IE5VTUJFUl9PRl9ESVZJREVSUyA9IDcyXG4gICAgLy8gY29uc3QgU1RFUCA9IDVcbiAgICAvL1xuICAgIC8vIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgLy9cbiAgICAvLyBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuI2Fuc2NlbmRhbnRTaGlmdFxuICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0RJVklERVJTOyBpKyspIHtcbiAgICAvLyAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNydWxsZXJDaXJjbGVSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHN0YXJ0QW5nbGUpKVxuICAgIC8vICAgbGV0IGVuZFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNydWxsZXJDaXJjbGVSYWRpdXMgKyBSYWRpeENoYXJ0LlJVTEVSX0xFTkdUSCAvIChpICUgMiArIDEpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAvLyAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAvLyAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgIC8vICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAvLyAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG4gICAgLy9cbiAgICAvLyAgIHN0YXJ0QW5nbGUgKz0gU1RFUFxuICAgIC8vIH1cbiAgICAvL1xuICAgIC8vIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNydWxsZXJDaXJjbGVSYWRpdXMpO1xuICAgIC8vIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICAvLyBjaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgLy8gd3JhcHBlci5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAgIC8vXG4gICAgLy8gdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFRyYW5zaXRDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL3V0aWxzL1V0aWxzLmpzJztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUmVwcmVzZW50cyBhIHBsYW5ldCBvciBwb2ludCBvZiBpbnRlcmVzdCBpbiB0aGUgY2hhcnRcbiAqIEBwdWJsaWNcbiAqL1xuY2xhc3MgUG9pbnQge1xuXG4gICNuYW1lXG4gICNhbmdsZVxuICAjaXNSZXRyb2dyYWRlXG4gICNjdXNwc1xuICAjc2V0dGluZ3NcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50RGF0YSAtIHtuYW1lOlN0cmluZywgYW5nbGU6TnVtYmVyLCBpc1JldHJvZ3JhZGU6ZmFsc2V9XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdXNwcy0gW3thbmdsZTpOdW1iZXJ9LCB7YW5nbGU6TnVtYmVyfSwge2FuZ2xlOk51bWJlcn0sIC4uLl1cbiAgICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwb2ludERhdGEsIGN1c3BzLCBzZXR0aW5ncykge1xuICAgIHRoaXMuI25hbWUgPSBwb2ludERhdGEubmFtZSA/PyBcIlVua25vd25cIlxuICAgIHRoaXMuI2FuZ2xlID0gcG9pbnREYXRhLmFuZ2xlID8/IDBcbiAgICB0aGlzLiNpc1JldHJvZ3JhZGUgPSBwb2ludERhdGEuaXNSZXRyb2dyYWRlID8/IGZhbHNlXG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY3VzcHMpIHx8IGN1c3BzLmxlbmd0aCAhPSAxMikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmFkIHBhcmFtIGN1c3BzLiBcIilcbiAgICB9XG5cbiAgICB0aGlzLiNjdXNwcyA9IGN1c3BzXG5cbiAgICBpZiAoIXNldHRpbmdzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSBzZXR0aW5ncy4nKVxuICAgIH1cblxuICAgIHRoaXMuI3NldHRpbmdzID0gc2V0dGluZ3NcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbmFtZVxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBnZXROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNuYW1lXG4gIH1cblxuICAvKipcbiAgICogSXMgcmV0cm9ncmFkZVxuICAgKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNSZXRyb2dyYWRlKCkge1xuICAgIHJldHVybiB0aGlzLiNpc1JldHJvZ3JhZGVcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW5nbGVcbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0QW5nbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2FuZ2xlXG4gIH1cblxuICAvKipcbiAgICogR2V0IHN5bWJvbFxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0geFBvc1xuICAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpc1Byb3BlcnRpZXNdIC0gYW5nbGVJblNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxuICAgKi9cbiAgZ2V0U3ltYm9sKHhQb3MsIHlQb3MsIGlzUHJvcGVydGllcyA9IHRydWUpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3Qgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKHRoaXMuI25hbWUsIHhQb3MsIHlQb3MpXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpXG5cbiAgICBpZiAodGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19TSE9XID09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gd3JhcHBlciAvLz09PT09PT5cbiAgICB9XG5cbiAgICBjb25zdCBjaGFydENlbnRlclggPSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRIIC8gMlxuICAgIGNvbnN0IGNoYXJ0Q2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgIGNvbnN0IGFuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyID0gVXRpbHMucG9zaXRpb25Ub0FuZ2xlKHhQb3MsIHlQb3MsIGNoYXJ0Q2VudGVyWCwgY2hhcnRDZW50ZXJZKVxuICAgIGxldCBTVEVQID0gMC45XG5cbiAgICBhbmdsZUluU2lnbi5jYWxsKHRoaXMpXG4gICAgLy90aGlzLiNpc1JldHJvZ3JhZGUgJiYgcmV0cm9ncmFkZVN5bWJvbC5jYWxsKHRoaXMpXG4gICAgdGhpcy5nZXREaWduaXR5KCkgJiYgZGlnbml0aWVzLmNhbGwodGhpcylcblxuICAgIHJldHVybiB3cmFwcGVyIC8vPT09PT09PlxuXG4gICAgLypcbiAgICAgKiAgQW5nbGUgaW4gc2lnblxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFuZ2xlSW5TaWduKCkge1xuICAgICAgY29uc3QgYW5nbGVJblNpZ25SYWRpdXMgPSAyICogU1RFUCAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVNcbiAgICAgIGNvbnN0IGFuZ2xlSW5TaWduUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHhQb3MsIHlQb3MsIGFuZ2xlSW5TaWduUmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbigtYW5nbGVGcm9tU3ltYm9sVG9DZW50ZXIpKVxuICAgICAgLy8gSXQgaXMgcG9zc2libGUgdG8gcm90YXRlIHRoZSB0ZXh0LCB3aGVuIHVuY29tbWVudCBhIGxpbmUgYmVsbG93LlxuICAgICAgLy90ZXh0V3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgYHJvdGF0ZSgke2FuZ2xlRnJvbVN5bWJvbFRvQ2VudGVyfSwke3RleHRQb3NpdGlvbi54fSwke3RleHRQb3NpdGlvbi55fSlgKVxuXG4gICAgICBjb25zdCB0ZXh0ID0gW11cbiAgICAgIHRleHQucHVzaCh0aGlzLmdldEFuZ2xlSW5TaWduKCkpXG4gICAgICB0aGlzLiNpc1JldHJvZ3JhZGUgJiYgdGV4dC5wdXNoKFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFX0NPREUpXG5cbiAgICAgIGNvbnN0IGFuZ2xlSW5TaWduVGV4dCA9IFNWR1V0aWxzLlNWR1RleHQoYW5nbGVJblNpZ25Qb3NpdGlvbi54LCBhbmdsZUluU2lnblBvc2l0aW9uLnksIHRleHQuam9pbihcIiBcIikpXG4gICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFKTtcbiAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQ09MT1IpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChhbmdsZUluU2lnblRleHQpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiAgRGlnbml0aWVzXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGlnbml0aWVzKCkge1xuICAgICAgY29uc3QgZGlnbml0aWVzUmFkaXVzID0gMyAqIFNURVAgKiB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTXG4gICAgICBjb25zdCBkaWduaXRpZXNQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoeFBvcywgeVBvcywgZGlnbml0aWVzUmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbigtYW5nbGVGcm9tU3ltYm9sVG9DZW50ZXIpKVxuICAgICAgY29uc3QgZGlnbml0aWVzVGV4dCA9IFNWR1V0aWxzLlNWR1RleHQoZGlnbml0aWVzUG9zaXRpb24ueCwgZGlnbml0aWVzUG9zaXRpb24ueSwgdGhpcy5nZXREaWduaXR5KCkpXG4gICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIFwic2Fucy1zZXJpZlwiKTtcbiAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwidGV4dC1ib3R0b21cIilcbiAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFLzEuMik7XG4gICAgICBkaWduaXRpZXNUZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRpZ25pdGllc1RleHQpXG4gICAgfSAgICBcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgaG91c2UgbnVtYmVyXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGdldEhvdXNlTnVtYmVyKCkge31cblxuICAvKipcbiAgICogR2V0IHNpZ24gbnVtYmVyXG4gICAqIEFyaXNlID0gMSwgVGF1cnVzID0gMiwgLi4uUGlzY2VzID0gMTJcbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0U2lnbk51bWJlcigpIHtcbiAgICBsZXQgYW5nbGUgPSB0aGlzLiNhbmdsZSAlIFV0aWxzLkRFR18zNjBcbiAgICByZXR1cm4gTWF0aC5mbG9vcigoYW5nbGUgLyAzMCkgKyAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhbmdsZSAoSW50ZWdlcikgaW4gdGhlIHNpZ24gaW4gd2hpY2ggaXQgc3RhbmRzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXRBbmdsZUluU2lnbigpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLiNhbmdsZSAlIDMwKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkaWduaXR5IHN5bWJvbCAociAtIHJ1bGVyc2hpcCwgZCAtIGRldHJpbWVudCwgZiAtIGZhbGwsIGUgLSBleGFsdGF0aW9uKVxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IC0gZGlnbml0eSBzeW1ib2wgKHIsZCxmLGUpXG4gICAqL1xuICBnZXREaWduaXR5KCkge1xuICAgIGNvbnN0IEFSSUVTID0gMVxuICAgIGNvbnN0IFRBVVJVUyA9IDJcbiAgICBjb25zdCBHRU1JTkkgPSAzXG4gICAgY29uc3QgQ0FOQ0VSID0gNFxuICAgIGNvbnN0IExFTyA9IDVcbiAgICBjb25zdCBWSVJHTyA9IDZcbiAgICBjb25zdCBMSUJSQSA9IDdcbiAgICBjb25zdCBTQ09SUElPID0gOFxuICAgIGNvbnN0IFNBR0lUVEFSSVVTID0gOVxuICAgIGNvbnN0IENBUFJJQ09STiA9IDEwXG4gICAgY29uc3QgQVFVQVJJVVMgPSAxMVxuICAgIGNvbnN0IFBJU0NFUyA9IDEyXG5cbiAgICBjb25zdCBSVUxFUlNISVBfU1lNQk9MID0gXCJyXCJcbiAgICBjb25zdCBERVRSSU1FTlRfU1lNQk9MID0gXCJkXCJcbiAgICBjb25zdCBGQUxMX1NZTUJPTCA9IFwiZlwiXG4gICAgY29uc3QgRVhBTFRBVElPTl9TWU1CT0wgPSBcImVcIlxuXG4gICAgc3dpdGNoICh0aGlzLiNuYW1lKSB7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TVU46XG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUVVBUklVUykge1xuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTKSB7XG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01PT046XG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQU5DRVIpIHtcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQVBSSUNPUk4pIHtcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBTQ09SUElPKSB7XG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFRBVVJVUykge1xuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWTpcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEdFTUlOSSkge1xuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNBR0lUVEFSSVVTKSB7XG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gUElTQ0VTKSB7XG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WRU5VUzpcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFRBVVJVUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMSUJSQSkge1xuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNDT1JQSU8pIHtcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBWSVJHTykge1xuICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBQSVNDRVMpIHtcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01BUlM6XG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUklFUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBTQ09SUElPKSB7XG4gICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVEFVUlVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExJQlJBKSB7XG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQ0FOQ0VSKSB7XG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBUFJJQ09STikge1xuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUjpcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNBR0lUVEFSSVVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFBJU0NFUykge1xuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEdFTUlOSSB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBWSVJHTykge1xuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBUFJJQ09STikge1xuICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQU5DRVIpIHtcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBVFVSTjpcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBUFJJQ09STiB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUVVBUklVUykge1xuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBTkNFUiB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUklFUykge1xuICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMSUJSQSkge1xuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVVJBTlVTOlxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVFVQVJJVVMpIHtcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBUQVVSVVMpIHtcbiAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0NPUlBJTykge1xuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTkVQVFVORTpcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFBJU0NFUykge1xuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gR0VNSU5JIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFRVUFSSVVTKSB7XG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNBR0lUVEFSSVVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExFTykge1xuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcbiAgICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0NPUlBJTykge1xuICAgICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFRBVVJVUykge1xuICAgICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExJQlJBKSB7XG4gICAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTICl7XG4gICAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBcIlwiXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBcIlwiXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFBvaW50IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCAqIGFzIFVuaXZlcnNlIGZyb20gXCIuL2NvbnN0YW50cy9Vbml2ZXJzZS5qc1wiXG5pbXBvcnQgKiBhcyBSYWRpeCBmcm9tIFwiLi9jb25zdGFudHMvUmFkaXguanNcIlxuaW1wb3J0ICogYXMgVHJhbnNpdCBmcm9tIFwiLi9jb25zdGFudHMvVHJhbnNpdC5qc1wiXG5pbXBvcnQgKiBhcyBQb2ludCBmcm9tIFwiLi9jb25zdGFudHMvUG9pbnQuanNcIlxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gXCIuL2NvbnN0YW50cy9Db2xvcnMuanNcIlxuXG5jb25zdCBTRVRUSU5HUyA9IE9iamVjdC5hc3NpZ24oe30sIFVuaXZlcnNlLCBSYWRpeCwgVHJhbnNpdCwgUG9pbnQsIENvbG9ycyk7XG5cbmV4cG9ydCB7XG4gIFNFVFRJTkdTIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuKiBDaGFydCBiYWNrZ3JvdW5kIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjZmZmXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0JBQ0tHUk9VTkRfQ09MT1IgPSBcIiNmZmZcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBjaXJjbGVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9DSVJDTEVfQ09MT1IgPSBcIiMzMzNcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBsaW5lcyBpbiBjaGFydHNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfTElORV9DT0xPUiA9IFwiIzY2NlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHRleHQgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1RFWFRfQ09MT1IgPSBcIiM5OTlcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBtcWluIGF4aXMgLSBBcywgRHMsIE1jLCBJY1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9NQUlOX0FYSVNfQ09MT1IgPSBcIiMwMDBcIjtcblxuLypcbiogRGVmYXVsdCBjb2xvciBvZiBzaWducyBpbiBjaGFydHMgKGFyaXNlIHN5bWJvbCwgdGF1cnVzIHN5bWJvbCwgLi4uKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzAwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TSUdOU19DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHNpZ25zIGluIGNoYXJ0cyAoYXJpc2Ugc3ltYm9sLCB0YXVydXMgc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BPSU5UU19DT0xPUiA9IFwiIzAwMFwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIGZvciBwb2ludCBwcm9wZXJ0aWVzIC0gYW5nbGUgaW4gc2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfQ09MT1IgPSBcIiMzMzNcIlxuXG4vKlxuKiBBcmllcyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUklFUyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBUYXVydXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4QjQ1MTNcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfVEFVUlVTID0gXCIjOEI0NTEzXCI7XG5cbi8qXG4qIEdlbWlueSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9HRU1JTkk9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBDYW5jZXIgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQ0FOQ0VSID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIExlbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgI0ZGNDUwMFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9MRU8gPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogVmlyZ28gY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4QjQ1MTNcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfVklSR08gPSBcIiM4QjQ1MTNcIjtcblxuLypcbiogTGlicmEgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4N0NFRUJcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfTElCUkEgPSBcIiM4N0NFRUJcIjtcblxuLypcbiogU2NvcnBpbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9TQ09SUElPID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIFNhZ2l0dGFyaXVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1NBR0lUVEFSSVVTID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIENhcHJpY29ybiBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9DQVBSSUNPUk4gPSBcIiM4QjQ1MTNcIjtcblxuLypcbiogQXF1YXJpdXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICM4N0NFRUJcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfQVFVQVJJVVMgPSBcIiM4N0NFRUJcIjtcblxuLypcbiogUGlzY2VzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1BJU0NFUyA9IFwiIzI3QUU2MFwiO1xuXG4vKlxuKiBDb2xvciBvZiBjaXJjbGVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSVJDTEVfQ09MT1IgPSBcIiMzMzNcIjtcbiIsIi8qXG4qIFBvaW50IHByb3BlcnRpZSAtIGFuZ2xlIGluIHNpZ24sIGRpZ25pdGllcywgcmV0cm9ncmFkZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge0Jvb2xlYW59XG4qIEBkZWZhdWx0IHRydWVcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19TSE9XID0gdHJ1ZVxuXG4vKlxuKiBUZXh0IHNpemUgb2YgUG9pbnQgZGVzY3JpcHRpb24gLSBhbmdsZSBpbiBzaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDZcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUgPSAxMlxuXG4vKipcbiogQSBwb2ludCBjb2xsaXNpb24gcmFkaXVzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX0NPTExJU0lPTl9SQURJVVMgPSAxMlxuIiwiLypcbiogUmFkaXggY2hhcnQgZWxlbWVudCBJRFxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgcmFkaXhcbiovXG5leHBvcnQgY29uc3QgUkFESVhfSUQgPSBcInJhZGl4XCJcblxuLypcbiogRm9udCBzaXplIC0gcG9pbnRzIChwbGFuZXRzKVxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjRcbiovXG5leHBvcnQgY29uc3QgUkFESVhfUE9JTlRTX0ZPTlRfU0laRSA9IDM2XG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHNpZ25zXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyNFxuKi9cbmV4cG9ydCBjb25zdCBSQURJWF9TSUdOU19GT05UX1NJWkUgPSAzMlxuXG4vKlxuKiBGb250IHNpemUgLSBheGlzIChBcywgRHMsIE1DLCBJQylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI0XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX0FYSVNfRk9OVF9TSVpFID0gMzJcbiIsIi8qXG4qIFRyYW5zaXQgY2hhcnQgZWxlbWVudCBJRFxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgdHJhbnNpdFxuKi9cbmV4cG9ydCBjb25zdCBUUkFOU0lUX0lEID0gXCJ0cmFuc2l0XCJcbiIsIi8qKlxuKiBDaGFydCBwYWRkaW5nXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxMHB4XG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1BBRERJTkcgPSA0MFxuXG4vKipcbiogU1ZHIHZpZXdCb3ggd2lkdGhcbiogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvQXR0cmlidXRlL3ZpZXdCb3hcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDgwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9WSUVXQk9YX1dJRFRIID0gODAwXG5cbi8qKlxuKiBTVkcgdmlld0JveCBoZWlnaHRcbiogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9TVkcvQXR0cmlidXRlL3ZpZXdCb3hcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDgwMFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9WSUVXQk9YX0hFSUdIVCA9IDgwMFxuXG4vKlxuKiBMaW5lIHN0cmVuZ3RoXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRSA9IDFcblxuLypcbiogTGluZSBzdHJlbmd0aCBvZiB0aGUgbWFpbiBsaW5lcy4gRm9yIGluc3RhbmNlIHBvaW50cywgbWFpbiBheGlzLCBtYWluIGNpcmNsZXNcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDFcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfTUFJTl9TVFJPS0UgPSAyXG5cbi8qKlxuKiBObyBmaWxsLCBvbmx5IHN0cm9rZVxuKiBAY29uc3RhbnRcbiogQHR5cGUge2Jvb2xlYW59XG4qIEBkZWZhdWx0IGZhbHNlXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NUUk9LRV9PTkxZID0gZmFsc2U7XG5cbi8qKlxuKiBGb250IGZhbWlseVxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHRcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfRk9OVF9GQU1JTFkgPSBcIkFzdHJvbm9taWNvblwiO1xuIiwiaW1wb3J0IERlZmF1bHRTZXR0aW5ncyBmcm9tICcuLi9zZXR0aW5ncy9EZWZhdWx0U2V0dGluZ3MuanMnO1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4uL3V0aWxzL1NWR1V0aWxzLmpzJztcbmltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XG5pbXBvcnQgVHJhbnNpdENoYXJ0IGZyb20gJy4uL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnO1xuXG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEFuIHdyYXBwZXIgZm9yIGFsbCBwYXJ0cyBvZiBncmFwaC5cbiAqIEBwdWJsaWNcbiAqL1xuY2xhc3MgVW5pdmVyc2Uge1xuXG4gICNTVkdEb2N1bWVudFxuICAjc2V0dGluZ3NcbiAgI3JhZGl4XG4gICN0cmFuc2l0XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBodG1sRWxlbWVudElEIC0gSUQgb2YgdGhlIHJvb3QgZWxlbWVudCB3aXRob3V0IHRoZSAjIHNpZ25cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSAtIEFuIG9iamVjdCB0aGF0IG92ZXJyaWRlcyB0aGUgZGVmYXVsdCBzZXR0aW5ncyB2YWx1ZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKGh0bWxFbGVtZW50SUQsIG9wdGlvbnMgPSB7fSkge1xuXG4gICAgaWYgKHR5cGVvZiBodG1sRWxlbWVudElEICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIHJlcXVpcmVkIHBhcmFtZXRlciBpcyBtaXNzaW5nLicpXG4gICAgfVxuXG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChodG1sRWxlbWVudElEKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5vdCBmaW5kIGEgSFRNTCBlbGVtZW50IHdpdGggSUQgJyArIGh0bWxFbGVtZW50SUQpXG4gICAgfVxuXG4gICAgdGhpcy4jc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0U2V0dGluZ3MsIG9wdGlvbnMsIHtcbiAgICAgIEhUTUxfRUxFTUVOVF9JRDogaHRtbEVsZW1lbnRJRFxuICAgIH0pO1xuICAgIHRoaXMuI1NWR0RvY3VtZW50ID0gU1ZHVXRpbHMuU1ZHRG9jdW1lbnQodGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQpXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaHRtbEVsZW1lbnRJRCkuYXBwZW5kQ2hpbGQodGhpcy4jU1ZHRG9jdW1lbnQpO1xuXG4gICAgdGhpcy4jcmFkaXggPSBuZXcgUmFkaXhDaGFydCh0aGlzKVxuICAgIHRoaXMuI3RyYW5zaXQgPSBuZXcgVHJhbnNpdENoYXJ0KHRoaXMuI3JhZGl4KVxuXG4gICAgdGhpcy4jbG9hZEZvbnQoXCJBc3Ryb25vbWljb25cIiwgJy4uL2Fzc2V0cy9mb250cy90dGYvQXN0cm9ub21pY29uRm9udHNfMS4xL0FzdHJvbm9taWNvbi50dGYnKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vICMjIFBVQkxJQyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAvKipcbiAgICogR2V0IFJhZGl4IGNoYXJ0XG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICByYWRpeCgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmFkaXhcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgVHJhbnNpdCBjaGFydFxuICAgKiBAcmV0dXJuIHtUcmFuc2l0Q2hhcnR9XG4gICAqL1xuICB0cmFuc2l0KCkge1xuICAgIHJldHVybiB0aGlzLiN0cmFuc2l0XG4gIH1cblxuICAvKipcbiAgICogR2V0IGN1cnJlbnQgc2V0dGluZ3NcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0U2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NldHRpbmdzXG4gIH1cblxuICAvKipcbiAgICogR2V0IHJvb3QgU1ZHIGRvY3VtZW50XG4gICAqIEByZXR1cm4ge1NWR0RvY3VtZW50fVxuICAgKi9cbiAgZ2V0U1ZHRG9jdW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI1NWR0RvY3VtZW50XG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qXG4gICogTG9hZCBmb25kIHRvIERPTVxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IGZhbWlseVxuICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2VcbiAgKiBAcGFyYW0ge09iamVjdH1cbiAgKlxuICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZvbnRGYWNlL0ZvbnRGYWNlXG4gICovXG4gIGFzeW5jICNsb2FkRm9udCggZmFtaWx5LCBzb3VyY2UsIGRlc2NyaXB0b3JzICl7XG5cbiAgICBpZiAoISgnRm9udEZhY2UnIGluIHdpbmRvdykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPb29wcywgRm9udEZhY2UgaXMgbm90IGEgZnVuY3Rpb24uXCIpXG4gICAgICBjb25zb2xlLmVycm9yKFwiQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ1NTX0ZvbnRfTG9hZGluZ19BUElcIilcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGZvbnQgPSBuZXcgRm9udEZhY2UoZmFtaWx5LCBgdXJsKCR7c291cmNlfSlgLCBkZXNjcmlwdG9ycylcblxuICAgIHRyeXtcbiAgICAgIGF3YWl0IGZvbnQubG9hZCgpO1xuICAgICAgZG9jdW1lbnQuZm9udHMuYWRkKGZvbnQpXG4gICAgfWNhdGNoKGUpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFVuaXZlcnNlIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFNWRyB1dGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFNWR1V0aWxzIHtcblxuICBzdGF0aWMgU1ZHX05BTUVTUEFDRSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuXG4gIHN0YXRpYyBTWU1CT0xfQVJJRVMgPSBcIkFyaWVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfVEFVUlVTID0gXCJUYXVydXNcIjtcbiAgc3RhdGljIFNZTUJPTF9HRU1JTkkgPSBcIkdlbWluaVwiO1xuICBzdGF0aWMgU1lNQk9MX0NBTkNFUiA9IFwiQ2FuY2VyXCI7XG4gIHN0YXRpYyBTWU1CT0xfTEVPID0gXCJMZW9cIjtcbiAgc3RhdGljIFNZTUJPTF9WSVJHTyA9IFwiVmlyZ29cIjtcbiAgc3RhdGljIFNZTUJPTF9MSUJSQSA9IFwiTGlicmFcIjtcbiAgc3RhdGljIFNZTUJPTF9TQ09SUElPID0gXCJTY29ycGlvXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0FHSVRUQVJJVVMgPSBcIlNhZ2l0dGFyaXVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOID0gXCJDYXByaWNvcm5cIjtcbiAgc3RhdGljIFNZTUJPTF9BUVVBUklVUyA9IFwiQXF1YXJpdXNcIjtcbiAgc3RhdGljIFNZTUJPTF9QSVNDRVMgPSBcIlBpc2Nlc1wiO1xuXG4gIHN0YXRpYyBTWU1CT0xfU1VOID0gXCJTdW5cIjtcbiAgc3RhdGljIFNZTUJPTF9NT09OID0gXCJNb29uXCI7XG4gIHN0YXRpYyBTWU1CT0xfTUVSQ1VSWSA9IFwiTWVyY3VyeVwiO1xuICBzdGF0aWMgU1lNQk9MX1ZFTlVTID0gXCJWZW51c1wiO1xuICBzdGF0aWMgU1lNQk9MX0VBUlRIID0gXCJFYXJ0aFwiO1xuICBzdGF0aWMgU1lNQk9MX01BUlMgPSBcIk1hcnNcIjtcbiAgc3RhdGljIFNZTUJPTF9KVVBJVEVSID0gXCJKdXBpdGVyXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0FUVVJOID0gXCJTYXR1cm5cIjtcbiAgc3RhdGljIFNZTUJPTF9VUkFOVVMgPSBcIlVyYW51c1wiO1xuICBzdGF0aWMgU1lNQk9MX05FUFRVTkUgPSBcIk5lcHR1bmVcIjtcbiAgc3RhdGljIFNZTUJPTF9QTFVUTyA9IFwiUGx1dG9cIjtcbiAgc3RhdGljIFNZTUJPTF9DSElST04gPSBcIkNoaXJvblwiO1xuICBzdGF0aWMgU1lNQk9MX0xJTElUSCA9IFwiTGlsaXRoXCI7XG4gIHN0YXRpYyBTWU1CT0xfTk5PREUgPSBcIk5Ob2RlXCI7XG4gIHN0YXRpYyBTWU1CT0xfU05PREUgPSBcIlNOb2RlXCI7XG5cbiAgc3RhdGljIFNZTUJPTF9BUyA9IFwiQXNcIjtcbiAgc3RhdGljIFNZTUJPTF9EUyA9IFwiRHNcIjtcbiAgc3RhdGljIFNZTUJPTF9NQyA9IFwiTWNcIjtcbiAgc3RhdGljIFNZTUJPTF9JQyA9IFwiSWNcIjtcblxuICBzdGF0aWMgU1lNQk9MX1JFVFJPR1JBREUgPSBcIlJldHJvZ3JhZGVcIlxuXG4gIC8vIEFzdHJvbm9taWNvbiBmb250IGNvZGVzXG4gIHN0YXRpYyBTWU1CT0xfQVJJRVNfQ09ERSA9IFwiQVwiO1xuICBzdGF0aWMgU1lNQk9MX1RBVVJVU19DT0RFID0gXCJCXCI7XG4gIHN0YXRpYyBTWU1CT0xfR0VNSU5JX0NPREUgPSBcIkNcIjtcbiAgc3RhdGljIFNZTUJPTF9DQU5DRVJfQ09ERSA9IFwiRFwiO1xuICBzdGF0aWMgU1lNQk9MX0xFT19DT0RFID0gXCJFXCI7XG4gIHN0YXRpYyBTWU1CT0xfVklSR09fQ09ERSA9IFwiRlwiO1xuICBzdGF0aWMgU1lNQk9MX0xJQlJBX0NPREUgPSBcIkdcIjtcbiAgc3RhdGljIFNZTUJPTF9TQ09SUElPX0NPREUgPSBcIkhcIjtcbiAgc3RhdGljIFNZTUJPTF9TQUdJVFRBUklVU19DT0RFID0gXCJJXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0FQUklDT1JOX0NPREUgPSBcIkpcIjtcbiAgc3RhdGljIFNZTUJPTF9BUVVBUklVU19DT0RFID0gXCJLXCI7XG4gIHN0YXRpYyBTWU1CT0xfUElTQ0VTX0NPREUgPSBcIkxcIjtcblxuICBzdGF0aWMgU1lNQk9MX1NVTl9DT0RFID0gXCJRXCI7XG4gIHN0YXRpYyBTWU1CT0xfTU9PTl9DT0RFID0gXCJSXCI7XG4gIHN0YXRpYyBTWU1CT0xfTUVSQ1VSWV9DT0RFID0gXCJTXCI7XG4gIHN0YXRpYyBTWU1CT0xfVkVOVVNfQ09ERSA9IFwiVFwiO1xuICBzdGF0aWMgU1lNQk9MX0VBUlRIX0NPREUgPSBcIj5cIjtcbiAgc3RhdGljIFNZTUJPTF9NQVJTX0NPREUgPSBcIlVcIjtcbiAgc3RhdGljIFNZTUJPTF9KVVBJVEVSX0NPREUgPSBcIlZcIjtcbiAgc3RhdGljIFNZTUJPTF9TQVRVUk5fQ09ERSA9IFwiV1wiO1xuICBzdGF0aWMgU1lNQk9MX1VSQU5VU19DT0RFID0gXCJYXCI7XG4gIHN0YXRpYyBTWU1CT0xfTkVQVFVORV9DT0RFID0gXCJZXCI7XG4gIHN0YXRpYyBTWU1CT0xfUExVVE9fQ09ERSA9IFwiWlwiO1xuICBzdGF0aWMgU1lNQk9MX0NISVJPTl9DT0RFID0gXCJxXCI7XG4gIHN0YXRpYyBTWU1CT0xfTElMSVRIX0NPREUgPSBcInpcIjtcbiAgc3RhdGljIFNZTUJPTF9OTk9ERV9DT0RFID0gXCJnXCI7XG4gIHN0YXRpYyBTWU1CT0xfU05PREVfQ09ERSA9IFwiaVwiO1xuXG4gIHN0YXRpYyBTWU1CT0xfQVNfQ09ERSA9IFwiY1wiO1xuICBzdGF0aWMgU1lNQk9MX0RTX0NPREUgPSBcImZcIjtcbiAgc3RhdGljIFNZTUJPTF9NQ19DT0RFID0gXCJkXCI7XG4gIHN0YXRpYyBTWU1CT0xfSUNfQ09ERSA9IFwiZVwiO1xuXG4gIHN0YXRpYyBTWU1CT0xfUkVUUk9HUkFERV9DT0RFID0gXCJNXCJcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFNWR1V0aWxzKSB7XG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIGRvY3VtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRG9jdW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHRG9jdW1lbnQod2lkdGgsIGhlaWdodCkge1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInN2Z1wiKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd4bWxucycsIFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZlcnNpb24nLCBcIjEuMVwiKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgXCIwIDAgXCIgKyB3aWR0aCArIFwiIFwiICsgaGVpZ2h0KTtcbiAgICByZXR1cm4gc3ZnXG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgU1ZHIGdyb3VwIGVsZW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHR3JvdXAoKSB7XG4gICAgY29uc3QgZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImdcIik7XG4gICAgcmV0dXJuIGdcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgcGF0aCBlbGVtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR1BhdGgoKSB7XG4gICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XG4gICAgcmV0dXJuIHBhdGhcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgbWFzayBlbGVtZW50XG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnRJRFxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdNYXNrRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdNYXNrKGVsZW1lbnRJRCkge1xuICAgIGNvbnN0IG1hc2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJtYXNrXCIpO1xuICAgIG1hc2suc2V0QXR0cmlidXRlKFwiaWRcIiwgZWxlbWVudElEKVxuICAgIHJldHVybiBtYXNrXG4gIH1cblxuICAvKipcbiAgICogU1ZHIGNpcmN1bGFyIHNlY3RvclxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7aW50fSB4IC0gY2lyY2xlIHggY2VudGVyIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7aW50fSB5IC0gY2lyY2xlIHkgY2VudGVyIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB7aW50fSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzIGluIHB4XG4gICAqIEBwYXJhbSB7aW50fSBhMSAtIGFuZ2xlRnJvbSBpbiByYWRpYW5zXG4gICAqIEBwYXJhbSB7aW50fSBhMiAtIGFuZ2xlVG8gaW4gcmFkaWFuc1xuICAgKiBAcGFyYW0ge2ludH0gdGhpY2tuZXNzIC0gZnJvbSBvdXRzaWRlIHRvIGNlbnRlciBpbiBweFxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBzZWdtZW50XG4gICAqL1xuICBzdGF0aWMgU1ZHU2VnbWVudCh4LCB5LCByYWRpdXMsIGExLCBhMiwgdGhpY2tuZXNzLCBsRmxhZywgc0ZsYWcpIHtcbiAgICAvLyBAc2VlIFNWRyBQYXRoIGFyYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL1NWRy9wYXRocy5odG1sI1BhdGhEYXRhXG4gICAgY29uc3QgTEFSR0VfQVJDX0ZMQUcgPSBsRmxhZyB8fCAwO1xuICAgIGNvbnN0IFNXRUVUX0ZMQUcgPSBzRmxhZyB8fCAwO1xuXG4gICAgY29uc3Qgc2VnbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInBhdGhcIik7XG4gICAgc2VnbWVudC5zZXRBdHRyaWJ1dGUoXCJkXCIsIFwiTSBcIiArICh4ICsgdGhpY2tuZXNzICogTWF0aC5jb3MoYTEpKSArIFwiLCBcIiArICh5ICsgdGhpY2tuZXNzICogTWF0aC5zaW4oYTEpKSArIFwiIGwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogTWF0aC5zaW4oYTEpKSArIFwiIEEgXCIgKyByYWRpdXMgKyBcIiwgXCIgKyByYWRpdXMgKyBcIiwwICxcIiArIExBUkdFX0FSQ19GTEFHICsgXCIsIFwiICsgU1dFRVRfRkxBRyArIFwiLCBcIiArICh4ICsgcmFkaXVzICogTWF0aC5jb3MoYTIpKSArIFwiLCBcIiArICh5ICsgcmFkaXVzICogTWF0aC5zaW4oYTIpKSArIFwiIGwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiAtTWF0aC5jb3MoYTIpKSArIFwiLCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIC1NYXRoLnNpbihhMikpICsgXCIgQSBcIiArIHRoaWNrbmVzcyArIFwiLCBcIiArIHRoaWNrbmVzcyArIFwiLDAgLFwiICsgTEFSR0VfQVJDX0ZMQUcgKyBcIiwgXCIgKyAxICsgXCIsIFwiICsgKHggKyB0aGlja25lc3MgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKHkgKyB0aGlja25lc3MgKiBNYXRoLnNpbihhMSkpKTtcbiAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgIHJldHVybiBzZWdtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyBjaXJjbGVcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge2ludH0gY3hcbiAgICogQHBhcmFtIHtpbnR9IGN5XG4gICAqIEBwYXJhbSB7aW50fSByYWRpdXNcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gY2lyY2xlXG4gICAqL1xuICBzdGF0aWMgU1ZHQ2lyY2xlKGN4LCBjeSwgcmFkaXVzKSB7XG4gICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiY2lyY2xlXCIpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBjeCk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN5XCIsIGN5KTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiclwiLCByYWRpdXMpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTtcbiAgICByZXR1cm4gY2lyY2xlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyBsaW5lXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MVxuICAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MlxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBsaW5lXG4gICAqL1xuICBzdGF0aWMgU1ZHTGluZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJsaW5lXCIpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDFcIiwgeDEpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTFcIiwgeTEpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDJcIiwgeDIpO1xuICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieTJcIiwgeTIpO1xuICAgIHJldHVybiBsaW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyB0ZXh0XG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0eHRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtzY2FsZV1cbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH0gbGluZVxuICAgKi9cbiAgc3RhdGljIFNWR1RleHQoeCwgeSwgdHh0KSB7XG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcInRleHRcIik7XG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIHgpO1xuICAgIHRleHQuc2V0QXR0cmlidXRlKFwieVwiLCB5KTtcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcIm5vbmVcIik7XG4gICAgdGV4dC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpKTtcblxuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNWRyBzeW1ib2xcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHhQb3NcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHlQb3NcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdTeW1ib2wobmFtZSwgeFBvcywgeVBvcykge1xuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVM6XG4gICAgICAgIHJldHVybiBhc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0RTOlxuICAgICAgICByZXR1cm4gZHNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQzpcbiAgICAgICAgcmV0dXJuIG1jU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSUM6XG4gICAgICAgIHJldHVybiBpY1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVJJRVM6XG4gICAgICAgIHJldHVybiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1RBVVJVUzpcbiAgICAgICAgcmV0dXJuIHRhdXJ1c1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSTpcbiAgICAgICAgcmV0dXJuIGdlbWluaVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NBTkNFUjpcbiAgICAgICAgcmV0dXJuIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xFTzpcbiAgICAgICAgcmV0dXJuIGxlb1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZJUkdPOlxuICAgICAgICByZXR1cm4gdmlyZ29TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9MSUJSQTpcbiAgICAgICAgcmV0dXJuIGxpYnJhU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0NPUlBJTzpcbiAgICAgICAgcmV0dXJuIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUzpcbiAgICAgICAgcmV0dXJuIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOOlxuICAgICAgICByZXR1cm4gY2Fwcmljb3JuU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQVFVQVJJVVM6XG4gICAgICAgIHJldHVybiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFUzpcbiAgICAgICAgcmV0dXJuIHBpc2Nlc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU1VOOlxuICAgICAgICByZXR1cm4gc3VuU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTU9PTjpcbiAgICAgICAgcmV0dXJuIG1vb25TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NRVJDVVJZOlxuICAgICAgICByZXR1cm4gbWVyY3VyeVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTOlxuICAgICAgICByZXR1cm4gdmVudXNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9FQVJUSDpcbiAgICAgICAgcmV0dXJuIGVhcnRoU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUFSUzpcbiAgICAgICAgcmV0dXJuIG1hcnNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9KVVBJVEVSOlxuICAgICAgICByZXR1cm4ganVwaXRlclN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBVFVSTjpcbiAgICAgICAgcmV0dXJuIHNhdHVyblN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VUzpcbiAgICAgICAgcmV0dXJuIHVyYW51c1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05FUFRVTkU6XG4gICAgICAgIHJldHVybiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUExVVE86XG4gICAgICAgIHJldHVybiBwbHV0b1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0NISVJPTjpcbiAgICAgICAgcmV0dXJuIGNoaXJvblN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xJTElUSDpcbiAgICAgICAgcmV0dXJuIGxpbGl0aFN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX05OT0RFOlxuICAgICAgICByZXR1cm4gbm5vZGVTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TTk9ERTpcbiAgICAgICAgcmV0dXJuIHNub2RlU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFOlxuICAgICAgICByZXR1cm4gcmV0cm9ncmFkZVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc3QgdW5rbm93blN5bWJvbCA9IFNWR1V0aWxzLlNWR0NpcmNsZSh4UG9zLCB5UG9zLCA4KVxuICAgICAgICB1bmtub3duU3ltYm9sLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcIiMzMzNcIilcbiAgICAgICAgcmV0dXJuIHVua25vd25TeW1ib2xcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEFzY2VuZGFudCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVNfQ09ERSApXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBEZXNjZW5kYW50IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9EU19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTWVkaXVtIGNvZWxpIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1jU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9NQ19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogSW1tdW0gY29lbGkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gaWNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0lDX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBcmllcyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhcmllc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVJJRVNfQ09ERSApXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBUYXVydXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdGF1cnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVNfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEdlbWluaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSV9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2FuY2VyIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBMZW8gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9MRU9fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFZpcmdvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9WSVJHT19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTGlicmEgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGlicmFTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTY29ycGlvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU9fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNhZ2l0dGFyaXVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVU19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2Fwcmljb3JuIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBcXVhcml1cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVFVQVJJVVNfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFBpc2NlcyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwaXNjZXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFU19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogU3VuIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN1blN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU1VOX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBNb29uIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1vb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01PT05fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1lcmN1cnkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWVyY3VyeVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWV9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogVmVudXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdmVudXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBFYXJ0aCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlYXJ0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfRUFSVEhfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1hcnMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFyc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUFSU19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogSnVwaXRlciBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBqdXBpdGVyU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9KVVBJVEVSX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTYXR1cm4gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQVRVUk5fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFVyYW51cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cmFudXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VU19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTmVwdHVuZSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBQbHV0byBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwbHV0b1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfUExVVE9fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENoaXJvbiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGlyb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0NISVJPTl9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTGlsaXRoIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxpbGl0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTElMSVRIX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBOTm9kZSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBubm9kZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTk5PREVfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNOb2RlIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNub2RlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TTk9ERV9DT0RFKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJldHJvZ3JhZGVTeW1ib2woeFBvcywgeVBvcyl7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfUkVUUk9HUkFERV9DT0RFKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQge1xuICBTVkdVdGlscyBhc1xuICBkZWZhdWx0XG59XG4iLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIFV0aWxzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFV0aWxzKSB7XG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgREVHXzM2MCA9IDM2MFxuICBzdGF0aWMgREVHXzE4MCA9IDE4MFxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSByYW5kb20gSURcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgZ2VuZXJhdGVVbmlxdWVJZCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHJhbmRvbU51bWJlciA9IE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwO1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XG4gICAgY29uc3QgdW5pcXVlSWQgPSBgaWRfJHtyYW5kb21OdW1iZXJ9XyR7dGltZXN0YW1wfWA7XG4gICAgcmV0dXJuIHVuaXF1ZUlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEludmVydGVkIGRlZ3JlZSB0byByYWRpYW5cbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVJbmRlZ3JlZVxuICAgKiBAcGFyYW0ge051bWJlcn0gc2hpZnRJbkRlZ3JlZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgZGVncmVlVG9SYWRpYW4gPSBmdW5jdGlvbihhbmdsZUluRGVncmVlLCBzaGlmdEluRGVncmVlID0gMCkge1xuICAgIHJldHVybiAoc2hpZnRJbkRlZ3JlZSAtIGFuZ2xlSW5EZWdyZWUpICogTWF0aC5QSSAvIDE4MFxuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHJhZGlhbiB0byBkZWdyZWVcbiAgICogQHN0YXRpY1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaWFuXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIHN0YXRpYyByYWRpYW5Ub0RlZ3JlZSA9IGZ1bmN0aW9uKHJhZGlhbikge1xuICAgIHJldHVybiAocmFkaWFuICogMTgwIC8gTWF0aC5QSSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGEgcG9zaXRpb24gb2YgdGhlIHBvaW50IG9uIHRoZSBjaXJjbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjeCAtIGNlbnRlciB4XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjeSAtIGNlbnRlciB5XG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgLSBjaXJjbGUgcmFkaXVzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZUluUmFkaWFuc1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge3g6TnVtYmVyLCB5Ok51bWJlcn1cbiAgICovXG4gIHN0YXRpYyBwb3NpdGlvbk9uQ2lyY2xlKGN4LCBjeSwgcmFkaXVzLCBhbmdsZUluUmFkaWFucykge1xuICAgIHJldHVybiB7XG4gICAgICB4OiAocmFkaXVzICogTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpICsgY3gpLFxuICAgICAgeTogKHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKSArIGN5KVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgKiBDYWxjdWxhdGVzIHRoZSBhbmdsZSBiZXR3ZWVuIHRoZSBsaW5lICgyIHBvaW50cykgYW5kIHRoZSB4LWF4aXMuXG4gICpcbiAgKiBAcGFyYW0ge051bWJlcn0geDFcbiAgKiBAcGFyYW0ge051bWJlcn0geTFcbiAgKiBAcGFyYW0ge051bWJlcn0geDJcbiAgKiBAcGFyYW0ge051bWJlcn0geTJcbiAgKlxuICAqIEByZXR1cm4ge051bWJlcn0gLSBkZWdyZWVcbiAgKi9cbiAgc3RhdGljIHBvc2l0aW9uVG9BbmdsZSh4MSwgeTEsIHgyLCB5Mikge1xuICAgIGNvbnN0IGR4ID0geDIgLSB4MTtcbiAgICBjb25zdCBkeSA9IHkyIC0geTE7XG4gICAgY29uc3QgYW5nbGVJblJhZGlhbnMgPSBNYXRoLmF0YW4yKGR5LCBkeCk7XG4gICAgcmV0dXJuIFV0aWxzLnJhZGlhblRvRGVncmVlKGFuZ2xlSW5SYWRpYW5zKVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgbmV3IHBvc2l0aW9uIG9mIHBvaW50cyBvbiBjaXJjbGUgd2l0aG91dCBvdmVybGFwcGluZyBlYWNoIG90aGVyXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIElmIHRoZXJlIGlzIG5vIHBsYWNlIG9uIHRoZSBjaXJjbGUgdG8gcGxhY2UgcG9pbnRzLlxuICAgKiBAcGFyYW0ge0FycmF5fSBwb2ludHMgLSBbe25hbWU6XCJhXCIsIGFuZ2xlOjEwfSwge25hbWU6XCJiXCIsIGFuZ2xlOjIwfV1cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNvbGxpc2lvblJhZGl1cyAtIHBvaW50IHJhZGl1c1xuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1c1xuICAgKlxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge1wiTW9vblwiOjMwLCBcIlN1blwiOjYwLCBcIk1lcmN1cnlcIjo4NiwgLi4ufVxuICAgKi9cbiAgc3RhdGljIGNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgY29sbGlzaW9uUmFkaXVzLCBjaXJjbGVSYWRpdXMpIHtcbiAgICBjb25zdCBTVEVQID0gMSAvL2RlZ3JlZVxuXG4gICAgY29uc3QgY2VsbFdpZHRoID0gMTAgLy9kZWdyZWVcbiAgICBjb25zdCBudW1iZXJPZkNlbGxzID0gVXRpbHMuREVHXzM2MCAvIGNlbGxXaWR0aFxuICAgIGNvbnN0IGZyZXF1ZW5jeSA9IG5ldyBBcnJheShudW1iZXJPZkNlbGxzKS5maWxsKDApXG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBwb2ludHMpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihwb2ludC5hbmdsZSAvIGNlbGxXaWR0aClcbiAgICAgIGZyZXF1ZW5jeVtpbmRleF0gKz0gMVxuICAgIH1cblxuICAgIC8vIEluIHRoaXMgYWxnb3JpdGhtIHRoZSBvcmRlciBvZiBwb2ludHMgaXMgY3J1Y2lhbC5cbiAgICAvLyBBdCB0aGF0IHBvaW50IGluIHRoZSBjaXJjbGUsIHdoZXJlIHRoZSBwZXJpb2QgY2hhbmdlcyBpbiB0aGUgY2lyY2xlIChmb3IgaW5zdGFuY2U6WzM1OCwzNTksMCwxXSksIHRoZSBwb2ludHMgYXJlIGFycmFuZ2VkIGluIGluY29ycmVjdCBvcmRlci5cbiAgICAvLyBBcyBhIHN0YXJ0aW5nIHBvaW50LCBJIHRyeSB0byBmaW5kIGEgcGxhY2Ugd2hlcmUgdGhlcmUgYXJlIG5vIHBvaW50cy4gVGhpcyBwbGFjZSBJIHVzZSBhcyBTVEFSVF9BTkdMRS5cbiAgICBjb25zdCBTVEFSVF9BTkdMRSA9IGNlbGxXaWR0aCAqIGZyZXF1ZW5jeS5maW5kSW5kZXgoY291bnQgPT4gY291bnQgPT0gMClcblxuICAgIGNvbnN0IF9wb2ludHMgPSBwb2ludHMubWFwKHBvaW50ID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IHBvaW50Lm5hbWUsXG4gICAgICAgIGFuZ2xlOiBwb2ludC5hbmdsZSA8IFNUQVJUX0FOR0xFID8gcG9pbnQuYW5nbGUgKyBVdGlscy5ERUdfMzYwIDogcG9pbnQuYW5nbGVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgX3BvaW50cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5hbmdsZSAtIGIuYW5nbGVcbiAgICB9KVxuXG4gICAgLy8gUmVjdXJzaXZlIGZ1bmN0aW9uXG4gICAgY29uc3QgYXJyYW5nZVBvaW50cyA9ICgpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsbiA9IF9wb2ludHMubGVuZ3RoOyBpIDwgbG47IGkrKykge1xuICAgICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSgwLCAwLCBjaXJjbGVSYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKF9wb2ludHNbaV0uYW5nbGUpKVxuICAgICAgICBfcG9pbnRzW2ldLnggPSBwb2ludFBvc2l0aW9uLnhcbiAgICAgICAgX3BvaW50c1tpXS55ID0gcG9pbnRQb3NpdGlvbi55XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhfcG9pbnRzW2ldLnggLSBfcG9pbnRzW2pdLngsIDIpICsgTWF0aC5wb3coX3BvaW50c1tpXS55IC0gX3BvaW50c1tqXS55LCAyKSk7XG4gICAgICAgICAgaWYgKGRpc3RhbmNlIDwgKDIgKiBjb2xsaXNpb25SYWRpdXMpKSB7XG4gICAgICAgICAgICBfcG9pbnRzW2ldLmFuZ2xlICs9IFNURVBcbiAgICAgICAgICAgIF9wb2ludHNbal0uYW5nbGUgLT0gU1RFUFxuICAgICAgICAgICAgYXJyYW5nZVBvaW50cygpIC8vPT09PT09PiBSZWN1cnNpdmUgY2FsbFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGFycmFuZ2VQb2ludHMoKVxuXG4gICAgcmV0dXJuIF9wb2ludHMucmVkdWNlKChhY2N1bXVsYXRvciwgcG9pbnQsIGN1cnJlbnRJbmRleCkgPT4ge1xuICAgICAgYWNjdW11bGF0b3JbcG9pbnQubmFtZV0gPSBwb2ludC5hbmdsZVxuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yXG4gICAgfSwge30pXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGFuZ2xlIGNvbGxpZGVzIHdpdGggdGhlIHBvaW50c1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVcbiAgICogQHBhcmFtIHtBcnJheX0gYW5nbGVzTGlzdFxuICAgKiBAcGFyYW0ge051bWJlcn0gW2NvbGxpc2lvblJhZGl1c11cbiAgICpcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBpc0NvbGxpc2lvbihhbmdsZSwgYW5nbGVzTGlzdCwgY29sbGlzaW9uUmFkaXVzID0gMTApIHtcblxuICAgIGNvbnN0IHBvaW50SW5Db2xsaXNpb24gPSBhbmdsZXNMaXN0LmZpbmQocG9pbnQgPT4ge1xuXG4gICAgICBsZXQgYSA9IChwb2ludCAtIGFuZ2xlKSA+IFV0aWxzLkRFR18xODAgPyBhbmdsZSArIFV0aWxzLkRFR18zNjAgOiBhbmdsZVxuICAgICAgbGV0IHAgPSAoYW5nbGUgLSBwb2ludCkgPiBVdGlscy5ERUdfMTgwID8gcG9pbnQgKyBVdGlscy5ERUdfMzYwIDogcG9pbnRcblxuICAgICAgcmV0dXJuIE1hdGguYWJzKGEgLSBwKSA8PSBjb2xsaXNpb25SYWRpdXNcbiAgICB9KVxuXG4gICAgcmV0dXJuIHBvaW50SW5Db2xsaXNpb24gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogdHJ1ZVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFV0aWxzIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFVuaXZlcnNlIGZyb20gJy4vdW5pdmVyc2UvVW5pdmVyc2UuanMnXG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi91dGlscy9TVkdVdGlscy5qcydcbmltcG9ydCBVdGlscyBmcm9tICcuL3V0aWxzL1V0aWxzLmpzJ1xuaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi9jaGFydHMvUmFkaXhDaGFydC5qcydcbmltcG9ydCBUcmFuc2l0Q2hhcnQgZnJvbSAnLi9jaGFydHMvVHJhbnNpdENoYXJ0LmpzJ1xuXG5leHBvcnQge1VuaXZlcnNlLCBTVkdVdGlscywgVXRpbHMsIFJhZGl4Q2hhcnQsIFRyYW5zaXRDaGFydH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==