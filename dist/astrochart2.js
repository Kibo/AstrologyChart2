/*!
 * 
 *       astrochart2
 *       A JavaScript for generating Astrology charts.
 *       Version: 0.5.0
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
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");


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
/* harmony import */ var _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/AspectUtils.js */ "./src/utils/AspectUtils.js");
/* harmony import */ var _Chart_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Chart.js */ "./src/charts/Chart.js");
/* harmony import */ var _points_Point_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../points/Point.js */ "./src/points/Point.js");
/* harmony import */ var _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../settings/DefaultSettings.js */ "./src/settings/DefaultSettings.js");








/**
 * @class
 * @classdesc Points and cups are displayed inside the Universe.
 * @public
 * @extends {Chart}
 */
class RadixChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_4__["default"] {

  /*
   * Levels determine the width of individual parts of the chart.
   * It can be changed dynamically by public setter.
   */
  #numberOfLevels = 24

  #universe
  #settings
  #root
  #data

  #centerX
  #centerY
  #radius

  /*
   * @see Utils.cleanUp()
   */
  #beforeCleanUpHook

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
   * Get data
   * @return {Object}
   */
  getData(){
    return {
      "points":[...this.#data.points],
      "cusps":[...this.#data.cusps]
    }
  }

  /**
   * Set number of Levels.
   * Levels determine the width of individual parts of the chart.
   *
   * @param {Number}
   */
  setNumberOfLevels(levels) {
    this.#numberOfLevels = Math.max(24, levels)
    if (this.#data) {
      this.#draw(this.#data)
    }

    return this
  }

  /**
   * Get radius
   * @return {Number}
   */
  getRadius() {
    return this.#radius
  }

  /**
   * Get radius
   * @return {Number}
   */
  getOuterCircleRadius() {
    return 24 * (this.getRadius() / this.#numberOfLevels)
  }

  /**
   * Get radius
   * @return {Number}
   */
  getInnerCircleRadius() {
    return 21 * (this.getRadius() / this.#numberOfLevels)
  }

  /**
   * Get radius
   * @return {Number}
   */
  getRullerCircleRadius() {
    return 20 * (this.getRadius() / this.#numberOfLevels)
  }

  /**
   * Get radius
   * @return {Number}
   */
  getPointCircleRadius() {
    return 18 * (this.getRadius() / this.#numberOfLevels)
  }

  /**
   * Get radius
   * @return {Number}
   */
  getCenterCircleRadius() {
    return 12 * (this.getRadius() / this.#numberOfLevels)
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

  /**
   * Get aspects
   *
   * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  getAspects(fromPoints, toPoints, aspects){
    if(!this.#data){
      return
    }

    fromPoints = fromPoints ?? this.#data.points
    toPoints = toPoints ?? [...this.#data.points, {name:"AS", angle:0}, {name:"IC", angle:this.#data.cusps.at(3)}, {name:"DS", angle:180}, {name:"MC", angle:this.#data.cusps.at(9)}]
    aspects = aspects ?? _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__["default"].DEFAULT_ASPECTS

    return _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAspects(fromPoints, toPoints, aspects).filter( aspect => aspect.from.name != aspect.to.name)
  }

  /**
   * Draw aspects
   *
   * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  drawAspects( fromPoints, toPoints, aspects ){
    const aspectsWrapper = this.#universe.getAspectsElement()
    _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].cleanUp(aspectsWrapper.getAttribute("id"), this.#beforeCleanUpHook)

    const aspectsList = this.getAspects(fromPoints, toPoints, aspects)
      .reduce( (arr, aspect) => {

        let isTheSame = arr.some( elm => {
          return elm.from.name == aspect.to.name && elm.to.name == aspect.from.name
        })

        if( !isTheSame ){
          arr.push(aspect)
        }

        return arr
      }, [])
      .filter( aspect =>  aspect.aspect.name != 'Conjunction')

    aspectsWrapper.appendChild( _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_3__["default"].drawAspects(this.getCenterCircleRadius(), this.getAscendantShift(), this.#settings, aspectsList))

    return this
  }

  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {
    _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].cleanUp(this.#root.getAttribute('id'), this.#beforeCleanUpHook)
    this.#drawBackground()
    this.#drawAstrologicalSigns()
    this.#drawRuler()
    this.#drawPoints(data)
    this.#drawCusps(data)
    this.#drawMainAxisDescription(data)
    this.#drawBorders()
    this.#settings.DRAW_ASPECTS && this.drawAspects()
  }

  #drawBackground() {
    const MASK_ID = `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}-background-mask-1`

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const mask = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGMask(MASK_ID)
    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    outerCircle.setAttribute('fill', "white")
    mask.appendChild(outerCircle)

    const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius())
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
      let position = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getOuterCircleRadius() - ((this.getOuterCircleRadius() - this.getInnerCircleRadius()) / 2), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(angleInDegree + STEP / 2, this.getAscendantShift()))

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
      let segment = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSegment(this.#centerX, this.#centerY, this.getOuterCircleRadius(), a1, a2, this.getInnerCircleRadius());
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
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(startAngle))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, (i % 2) ? this.getInnerCircleRadius() - ((this.getInnerCircleRadius() - this.getRullerCircleRadius()) / 2) : this.getInnerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(startAngle))
      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);

      startAngle += STEP
    }

    const circle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRullerCircleRadius());
    circle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    circle.setAttribute("stroke-width", this.#settings.CHART_STROKE);
    wrapper.appendChild(circle);

    this.#root.appendChild(wrapper)
  }

  /*
   * Draw points
   * @param {Object} data - chart data
   */
  #drawPoints(data) {
    const points = data.points
    const cusps = data.cusps

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, this.getPointCircleRadius())
    for (const pointData of points) {
      const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_5__["default"](pointData, cusps, this.#settings)
      const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getRullerCircleRadius() - ((this.getInnerCircleRadius() - this.getRullerCircleRadius()) / 4), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(point.getAngle(), this.getAscendantShift()))
      const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(positions[point.getName()], this.getAscendantShift()))

      // ruler mark
      const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(point.getAngle(), this.getAscendantShift()))
      const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
      rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(rulerLine);

      // symbol
      const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].DEG_0, this.#settings.POINT_PROPERTIES_SHOW)
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("text-anchor", "middle") // start, middle, end
      symbol.setAttribute("dominant-baseline", "middle")
      symbol.setAttribute("font-size", this.#settings.RADIX_POINTS_FONT_SIZE)
      symbol.setAttribute("fill", this.#settings.CHART_POINTS_COLOR)
      wrapper.appendChild(symbol);

      // pointer
      //if (positions[point.getName()] != pointData.position) {
      const pointerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerX, this.getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(positions[point.getName()], this.getAscendantShift()))
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

    const mainAxisIndexes = [0, 3, 6, 9] //As, Ic, Ds, Mc

    const pointsPositions = points.map(point => {
      return point.angle
    })

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const textRadius = this.getCenterCircleRadius() + ((this.getInnerCircleRadius() - this.getCenterCircleRadius()) / 10)

    for (let i = 0; i < cusps.length; i++) {

      const isLineInCollisionWithPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)

      const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(cusps[i].angle, this.getAscendantShift()))
      const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, isLineInCollisionWithPoint ? this.getCenterCircleRadius() + ((this.getRullerCircleRadius() - this.getCenterCircleRadius()) / 6) : this.getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(cusps[i].angle, this.getAscendantShift()))

      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
      line.setAttribute("stroke", mainAxisIndexes.includes(i) ? this.#settings.CHART_MAIN_AXIS_COLOR : this.#settings.CHART_LINE_COLOR)
      line.setAttribute("stroke-width", mainAxisIndexes.includes(i) ? this.#settings.CHART_MAIN_STROKE : this.#settings.CHART_STROKE)
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

  /*
   * Draw main axis descrition
   * @param {Array} axisList
   */
  #drawMainAxisDescription(data) {
    const AXIS_LENGTH = 10
    const cusps = data.cusps

    const axisList = [{
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_AS,
        angle: cusps[0].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_IC,
        angle: cusps[3].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_DS,
        angle: cusps[6].angle
      },
      {
        name: _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SYMBOL_MC,
        angle: cusps[9].angle
      },
    ]

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    for (const axis of axisList) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].positionOnCircle(this.#centerX, this.#centerY, this.getRadius() + AXIS_LENGTH, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].degreeToRadian(axis.angle, this.getAscendantShift()))
      let line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_MAIN_AXIS_COLOR);
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
      symbol.setAttribute("fill", this.#settings.CHART_MAIN_AXIS_COLOR);

      wrapper.appendChild(symbol);
    }

    this.#root.appendChild(wrapper)
  }

  #drawBorders() {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getOuterCircleRadius())
    outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(outerCircle)

    const innerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getInnerCircleRadius())
    innerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    innerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(innerCircle)

    const centerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getCenterCircleRadius())
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
/* harmony import */ var _charts_RadixChart_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../charts/RadixChart.js */ "./src/charts/RadixChart.js");
/* harmony import */ var _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/SVGUtils.js */ "./src/utils/SVGUtils.js");
/* harmony import */ var _Chart_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Chart.js */ "./src/charts/Chart.js");
/* harmony import */ var _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/AspectUtils.js */ "./src/utils/AspectUtils.js");
/* harmony import */ var _points_Point_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../points/Point.js */ "./src/points/Point.js");
/* harmony import */ var _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../settings/DefaultSettings.js */ "./src/settings/DefaultSettings.js");








/**
 * @class
 * @classdesc Points and cups are displayed from outside the Universe.
 * @public
 * @extends {Chart}
 */
class TransitChart extends _Chart_js__WEBPACK_IMPORTED_MODULE_2__["default"] {

  /*
   * Levels determine the width of individual parts of the chart.
   * It can be changed dynamically by public setter.
   */
  #numberOfLevels = 32

  #radix
  #settings
  #root
  #data

  #centerX
  #centerY
  #radius

  /*
   * @see Utils.cleanUp()
   */
  #beforeCleanUpHook

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

    this.#data = data
    this.#draw(data)

    return this
  }

  /**
   * Get data
   * @return {Object}
   */
  getData(){
    return {
      "points":[...this.#data.points],
      "cusps":[...this.#data.cusps]
    }
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
   * Get aspects
   *
   * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  getAspects(fromPoints, toPoints, aspects){
    if(!this.#data){
      return
    }

    fromPoints = fromPoints ?? this.#data.points
    toPoints = toPoints ?? [...this.#radix.getData().points, {name:"AS", angle:0}, {name:"IC", angle:this.#radix.getData().cusps.at(3)}, {name:"DS", angle:180}, {name:"MC", angle:this.#radix.getData().cusps.at(9)}]
    aspects = aspects ?? _settings_DefaultSettings_js__WEBPACK_IMPORTED_MODULE_6__["default"].DEFAULT_ASPECTS

    return _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_4__["default"].getAspects(fromPoints, toPoints, aspects)
  }

  /**
   * Draw aspects
   *
   * @param {Array<Object>} [fromPoints] - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} [toPoints] - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} [aspects] - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  drawAspects( fromPoints, toPoints, aspects ){
    const aspectsWrapper = this.#radix.getUniverse().getAspectsElement()
    _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].cleanUp(aspectsWrapper.getAttribute("id"), this.#beforeCleanUpHook)

    const aspectsList = this.getAspects(fromPoints, toPoints, aspects)
      .filter( aspect =>  aspect.aspect.name != 'Conjunction')
    
    aspectsWrapper.appendChild( _utils_AspectUtils_js__WEBPACK_IMPORTED_MODULE_4__["default"].drawAspects(this.#radix.getCenterCircleRadius(), this.#radix.getAscendantShift(), this.#settings, aspectsList))

    return this
  }

  // ## PRIVATE ##############################

  /*
   * Draw radix chart
   * @param {Object} data
   */
  #draw(data) {

    // radix reDraw
    _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].cleanUp(this.#root.getAttribute('id'), this.#beforeCleanUpHook)
    this.#radix.setNumberOfLevels(this.#numberOfLevels)

    this.#drawRuler()
    this.#drawCusps(data)
    this.#drawPoints(data)
    this.#drawBorders()
    this.#settings.DRAW_ASPECTS && this.drawAspects()
  }

  #drawRuler() {
    const NUMBER_OF_DIVIDERS = 72
    const STEP = 5

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    let startAngle = this.#radix.getAscendantShift()
    for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
      let startPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(startAngle))
      let endPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, (i % 2) ? this.getRadius() - ((this.getRadius() - this.#getRullerCircleRadius()) / 2) : this.getRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(startAngle))
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
   * Draw points
   * @param {Object} data - chart data
   */
  #drawPoints(data) {
    const points = data.points
    const cusps = data.cusps

    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    const positions = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, this.#getPointCircleRadius())
    for (const pointData of points) {
      const point = new _points_Point_js__WEBPACK_IMPORTED_MODULE_5__["default"](pointData, cusps, this.#settings)
      const pointPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius() - ((this.getRadius() - this.#getRullerCircleRadius()) / 4), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(point.getAngle(), this.#radix.getAscendantShift()))
      const symbolPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(positions[point.getName()], this.#radix.getAscendantShift()))

      // ruler mark
      const rulerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(point.getAngle(), this.#radix.getAscendantShift()))
      const rulerLine = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
      rulerLine.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      rulerLine.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(rulerLine);

      // symbol
      const symbol = point.getSymbol(symbolPosition.x, symbolPosition.y, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].DEG_0, this.#settings.POINT_PROPERTIES_SHOW)
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("text-anchor", "middle") // start, middle, end
      symbol.setAttribute("dominant-baseline", "middle")
      symbol.setAttribute("font-size", this.#settings.TRANSIT_POINTS_FONT_SIZE)
      symbol.setAttribute("fill", this.#settings.CHART_POINTS_COLOR)
      wrapper.appendChild(symbol);

      // pointer
      //if (positions[point.getName()] != pointData.position) {
      const pointerLineEndPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerX, this.#getPointCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(positions[point.getName()], this.#radix.getAscendantShift()))
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

    const textRadius = this.#getCenterCircleRadius() + ((this.#getRullerCircleRadius() - this.#getCenterCircleRadius()) / 6)

    for (let i = 0; i < cusps.length; i++) {
      const isLineInCollisionWithPoint = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)

      const startPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, this.#getCenterCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))
      const endPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, isLineInCollisionWithPoint ? this.#getCenterCircleRadius() + ((this.#getRullerCircleRadius() - this.#getCenterCircleRadius()) / 6) : this.#getRullerCircleRadius(), _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(cusps[i].angle, this.#radix.getAscendantShift()))

      const line = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(startPos.x, startPos.y, endPos.x, endPos.y)
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR)
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE)
      wrapper.appendChild(line);

      const startCusp = cusps[i].angle
      const endCusp = cusps[(i + 1) % 12].angle
      const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].DEG_360
      const textAngle = startCusp + gap / 2

      const textPos = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].positionOnCircle(this.#centerX, this.#centerY, textRadius, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].degreeToRadian(textAngle, this.#radix.getAscendantShift()))
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

    const outerCircle = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGCircle(this.#centerX, this.#centerY, this.getRadius())
    outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(outerCircle)

    this.#root.appendChild(wrapper)
  }

  #getPointCircleRadius() {
    return 29 * (this.getRadius() / this.#numberOfLevels)
  }

  #getRullerCircleRadius() {
    return 31 * (this.getRadius() / this.#numberOfLevels)
  }

  #getCenterCircleRadius() {
    return 24 * (this.getRadius() / this.#numberOfLevels)
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
   * @param {Number} [angleShift]
   * @param {Boolean} [isProperties] - angleInSign, dignities, retrograde
   *
   * @return {SVGElement}
   */
  getSymbol(xPos, yPos, angleShift = 0, isProperties = true) {
    const wrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGGroup()

    const symbol = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGSymbol(this.#name, xPos, yPos)
    wrapper.appendChild(symbol)

    if (isProperties == false) {
      return wrapper //======>
    }

    const chartCenterX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    const chartCenterY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    const angleFromSymbolToCenter = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionToAngle(xPos, yPos, chartCenterX, chartCenterY)

    angleInSign.call(this)
    this.getDignity() && dignities.call(this)

    return wrapper //======>

    /*
     *  Angle in sign
     */
    function angleInSign() {
      const angleInSignPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, 2 * this.#settings.POINT_COLLISION_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter, angleShift))
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
      const dignitiesPosition = _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].positionOnCircle(xPos, yPos, 3 * this.#settings.POINT_COLLISION_RADIUS, _utils_Utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].degreeToRadian(-angleFromSymbolToCenter, angleShift))
      const dignitiesText = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_0__["default"].SVGText(dignitiesPosition.x, dignitiesPosition.y, this.getDignity())
      dignitiesText.setAttribute("font-family", "sans-serif");
      dignitiesText.setAttribute("text-anchor", "middle") // start, middle, end
      dignitiesText.setAttribute("dominant-baseline", "text-bottom")
      dignitiesText.setAttribute("font-size", this.#settings.POINT_PROPERTIES_FONT_SIZE / 1.2);
      dignitiesText.setAttribute("fill", this.#settings.POINT_PROPERTIES_COLOR);
      wrapper.appendChild(dignitiesText)
    }
  }

  /**
   * Get house number
   *
   * @return {Number}
   */
  getHouseNumber() {
    throw new Error("Not implemented yet.")
  }

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

        if (this.getSignNumber() == ARIES) {
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
/* harmony import */ var _constants_Aspects_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants/Aspects.js */ "./src/settings/constants/Aspects.js");







const SETTINGS = Object.assign({}, _constants_Universe_js__WEBPACK_IMPORTED_MODULE_0__, _constants_Radix_js__WEBPACK_IMPORTED_MODULE_1__, _constants_Transit_js__WEBPACK_IMPORTED_MODULE_2__, _constants_Point_js__WEBPACK_IMPORTED_MODULE_3__, _constants_Colors_js__WEBPACK_IMPORTED_MODULE_4__, _constants_Aspects_js__WEBPACK_IMPORTED_MODULE_5__);




/***/ }),

/***/ "./src/settings/constants/Aspects.js":
/*!*******************************************!*\
  !*** ./src/settings/constants/Aspects.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ASPECTS_FONT_SIZE": () => (/* binding */ ASPECTS_FONT_SIZE),
/* harmony export */   "ASPECTS_ID": () => (/* binding */ ASPECTS_ID),
/* harmony export */   "DEFAULT_ASPECTS": () => (/* binding */ DEFAULT_ASPECTS),
/* harmony export */   "DRAW_ASPECTS": () => (/* binding */ DRAW_ASPECTS)
/* harmony export */ });
/*
* Aspects wrapper element ID
* @constant
* @type {String}
* @default aspects
*/
const ASPECTS_ID = "aspects"

/*
* Draw aspects into chart during render
* @constant
* @type {Boolean}
* @default true
*/
const DRAW_ASPECTS = true

/*
* Font size - aspects
* @constant
* @type {Number}
* @default 27
*/
const ASPECTS_FONT_SIZE = 18

/**
* Default aspects
* @constant
* @type {Array}
*/
const DEFAULT_ASPECTS = [
  {name:"Conjunction", angle:0, orb:2},
  {name:"Opposition", angle:180, orb:2},
  {name:"Trine", angle:120, orb:2},
  {name:"Square", angle:90, orb:2}
]


/***/ }),

/***/ "./src/settings/constants/Colors.js":
/*!******************************************!*\
  !*** ./src/settings/constants/Colors.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ASPECT_COLORS": () => (/* binding */ ASPECT_COLORS),
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
* Default color of text in charts - cusps number
* @constant
* @type {String}
* @default #333
*/
const CHART_TEXT_COLOR = "#bbb";

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

/*
* Color of aspects
* @constant
* @type {Object}
*/
const ASPECT_COLORS = {
  Conjunction:"#333",
  Opposition:"#1B4F72",
  Square:"#641E16",
  Trine:"#0B5345",
  Sextile:"#333",
  Quincunx:"#333",
  Semisextile:"#333",
  Quintile:"#333",
  Trioctile:"#333"
}


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
const POINT_PROPERTIES_FONT_SIZE = 16

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
* @default 27
*/
const RADIX_POINTS_FONT_SIZE = 27

/*
* Font size - signs
* @constant
* @type {Number}
* @default 27
*/
const RADIX_SIGNS_FONT_SIZE = 27

/*
* Font size - axis (As, Ds, Mc, Ic)
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
/* harmony export */   "TRANSIT_ID": () => (/* binding */ TRANSIT_ID),
/* harmony export */   "TRANSIT_POINTS_FONT_SIZE": () => (/* binding */ TRANSIT_POINTS_FONT_SIZE)
/* harmony export */ });
/*
* Transit chart element ID
* @constant
* @type {String}
* @default transit
*/
const TRANSIT_ID = "transit"

/*
* Font size - points (planets)
* @constant
* @type {Number}
* @default 32
*/
const TRANSIT_POINTS_FONT_SIZE = 27


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
  #aspectsWrapper

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

    // create wrapper for aspects
    this.#aspectsWrapper = _utils_SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()
    this.#aspectsWrapper.setAttribute("id", `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.ASPECTS_ID}`)
    this.#SVGDocument.appendChild(this.#aspectsWrapper)

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

  /**
   * Get empty aspects wrapper element
   * @return {SVGGroupElement}
   */
  getAspectsElement() {
    return this.#aspectsWrapper
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

/***/ "./src/utils/AspectUtils.js":
/*!**********************************!*\
  !*** ./src/utils/AspectUtils.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AspectUtils)
/* harmony export */ });
/* harmony import */ var _Utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils.js */ "./src/utils/Utils.js");
/* harmony import */ var _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SVGUtils.js */ "./src/utils/SVGUtils.js");



/**
 * @class
 * @classdesc Utility class
 * @public
 * @static
 * @hideconstructor
 */
class AspectUtils {

  constructor() {
    if (this instanceof AspectUtils) {
      throw Error('This is a static class and cannot be instantiated.');
    }
  }

  /**
   * Calculates the orbit of two angles on a circle
   *
   * @param {Number} fromAngle - angle in degree, point on the circle
   * @param {Number} toAngle - angle in degree, point on the circle
   * @param {Number} aspectAngle - 60,90,120, ...
   *
   * @return {Number} orb
   */
  static orb(fromAngle, toAngle, aspectAngle) {
    let orb
    let sign = fromAngle > toAngle ? 1 : -1
    let difference = Math.abs(fromAngle - toAngle)

    if (difference > _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].DEG_180) {
      difference = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].DEG_360 - difference;
      orb = (difference - aspectAngle) * -1

    } else {
      orb = (difference - aspectAngle) * sign
    }

    return Number(Number(orb).toFixed(2))
  }

  /**
   * Get aspects
   *
   * @param {Array<Object>} fromPoints - [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
   * @param {Array<Object>} toPoints - [{name:"AS", angle:0}, {name:"IC", angle:90}]
   * @param {Array<Object>} aspects - [{name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
   *
   * @return {Array<Object>}
   */
  static getAspects(fromPoints, toPoints, aspects){
    const aspectList = []
    for (const fromP of fromPoints){
      for (const toP of toPoints){
        for (const aspect of aspects){
          const orb = AspectUtils.orb(fromP.angle, toP.angle, aspect.angle)
          if( Math.abs( orb ) <=  aspect.orb ){
            aspectList.push( { aspect:aspect, from:fromP, to:toP, precision:orb } )
          }
        }
      }
    }

    return aspectList
  }

  /**
   * Draw aspects
   *
   * @param {Number} radius
   * @param {Number} ascendantShift
   * @param {Object} settings
   * @param {Array<Object>} aspectsList
   *
   * @return {SVGGroupElement}
   */
  static drawAspects(radius, ascendantShift, settings, aspectsList){
    const centerX = settings.CHART_VIEWBOX_WIDTH / 2
    const centerY = settings.CHART_VIEWBOX_HEIGHT / 2

    const wrapper = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGGroup()

    for(const asp of aspectsList){

        // aspect as solid line
        const fromPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.from.angle, ascendantShift))
        const toPoint = _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].positionOnCircle(centerX, centerY, radius, _Utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].degreeToRadian(asp.to.angle, ascendantShift))

        // draw symbol in center of aspect
        const lineCenterX = (fromPoint.x +  toPoint.x) / 2
        const lineCenterY = (fromPoint.y +  toPoint.y) / 2
        const symbol = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGSymbol(asp.aspect.name, lineCenterX, lineCenterY)
        symbol.setAttribute("font-family", settings.CHART_FONT_FAMILY);
        symbol.setAttribute("text-anchor", "middle") // start, middle, end
        symbol.setAttribute("dominant-baseline", "middle")
        symbol.setAttribute("font-size", settings.ASPECTS_FONT_SIZE);
        symbol.setAttribute("fill", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");

        // space for symbol (fromPoint - center)
        const fromPointSpaceX = fromPoint.x + ( toPoint.x - fromPoint.x ) / 2.2
        const fromPointSpaceY = fromPoint.y + ( toPoint.y - fromPoint.y ) / 2.2

        // space for symbol (center - toPoint)
        const toPointSpaceX = toPoint.x + ( fromPoint.x - toPoint.x ) / 2.2
        const toPointSpaceY = toPoint.y + ( fromPoint.y - toPoint.y ) / 2.2

        // line: fromPoint - center
        const line1 = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(fromPoint.x, fromPoint.y, fromPointSpaceX, fromPointSpaceY)
        line1.setAttribute("stroke", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");
        line1.setAttribute("stroke-width", settings.CHART_STROKE);

        // line: center - toPoint
        const line2 = _SVGUtils_js__WEBPACK_IMPORTED_MODULE_1__["default"].SVGLine(toPointSpaceX, toPointSpaceY, toPoint.x, toPoint.y)
        line2.setAttribute("stroke", settings.ASPECT_COLORS[asp.aspect.name] ?? "#333");
        line2.setAttribute("stroke-width", settings.CHART_STROKE);

        wrapper.appendChild(line1);
        wrapper.appendChild(line2);
        wrapper.appendChild(symbol);
    }

    return wrapper
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

  static SYMBOL_CONJUNCTION = "Conjunction";
  static SYMBOL_OPPOSITION = "Opposition";
  static SYMBOL_SQUARE = "Square";
  static SYMBOL_TRINE = "Trine";
  static SYMBOL_SEXTILE = "Sextile";
  static SYMBOL_QUINCUNX = "Quincunx";
  static SYMBOL_SEMISEXTILE = "Semisextile";
  static SYMBOL_OCTILE = "Octile";
  static SYMBOL_TRIOCTILE = "Trioctile";

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

  static SYMBOL_CONJUNCTION_CODE = "!";
  static SYMBOL_OPPOSITION_CODE = '"';
  static SYMBOL_SQUARE_CODE = "#";
  static SYMBOL_TRINE_CODE = "$";
  static SYMBOL_SEXTILE_CODE = "%";
  static SYMBOL_QUINCUNX_CODE = "&";
  static SYMBOL_SEMISEXTILE_CODE = "''";
  static SYMBOL_OCTILE_CODE = "(";
  static SYMBOL_TRIOCTILE_CODE = ")";

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

      case SVGUtils.SYMBOL_CONJUNCTION:
        return conjunctionSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_OPPOSITION:
        return oppositionSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SQUARE:
        return squareSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_TRINE:
        return trineSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SEXTILE:
        return sextileSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_QUINCUNX:
        return quincunxSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_SEMISEXTILE:
        return semisextileSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_OCTILE:
        return quintileSymbol(xPos, yPos)
        break;
      case SVGUtils.SYMBOL_TRIOCTILE:
        return trioctileSymbol(xPos, yPos)
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
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_AS_CODE)
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
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_ARIES_CODE)
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

    /*
     * Retrograde symbol
     */
    function retrogradeSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_RETROGRADE_CODE)
    }

    /*
     * Conjunction symbol
     */
    function conjunctionSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_CONJUNCTION_CODE)
    }

    /*
     * Opposition symbol
     */
    function oppositionSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_OPPOSITION_CODE)
    }

    /*
     * Squaresymbol
     */
    function squareSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SQUARE_CODE)
    }

    /*
     * Trine symbol
     */
    function trineSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_TRINE_CODE)
    }

    /*
     * Sextile symbol
     */
    function sextileSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SEXTILE_CODE)
    }

    /*
     * Quincunx symbol
     */
    function quincunxSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_QUINCUNX_CODE)
    }

    /*
     * Semisextile symbol
     */
    function semisextileSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_SEMISEXTILE_CODE)
    }

    /*
     * Quintile symbol
     */
    function quintileSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_OCTILE_CODE)
    }

    /*
     * Trioctile symbol
     */
    function trioctileSymbol(xPos, yPos) {
      return SVGUtils.SVGText(xPos, yPos, SVGUtils.SYMBOL_TRIOCTILE_CODE)
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
  static DEG_0 = 0

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

  

  /**
  * Removes the content of an element
  *
  * @param {String} elementID
  * @param {Function} [beforeHook]
    *
  * @warning - It removes Event Listeners too.
  * @warning - You will (probably) get memory leak if you delete elements that have attached listeners
  */
  static cleanUp( elementID, beforeHook){
    let elm = document.getElementById(elementID)
    if(!elm){
      return
    }

    (typeof beforeHook === 'function') && beforeHook()

    elm.innerHTML = ""
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsOEJBQThCLCtEQUFhO0FBQzNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsUUFBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVyxxRUFBbUI7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsV0FBVyxzRUFBb0I7QUFDL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLHlFQUF1QjtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsdUVBQXFCO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVyxzRUFBb0I7QUFDL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLHlFQUF1QjtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsd0VBQXNCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVyx3RUFBc0I7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLHlFQUF1QjtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsdUVBQXFCO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFLQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbFlrRDtBQUNOO0FBQ0k7QUFDSjtBQUNFO0FBQ0U7O0FBRWpELGlDQUFpQyxFQUFFLG1EQUFRLEVBQUUsZ0RBQUssRUFBRSxrREFBTyxFQUFFLGdEQUFLLEVBQUUsaURBQU0sRUFBRSxrREFBTzs7QUFLbEY7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1pEO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNPO0FBQ1AsR0FBRyxtQ0FBbUM7QUFDdEMsR0FBRyxvQ0FBb0M7QUFDdkMsR0FBRywrQkFBK0I7QUFDbEMsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2TEE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQixhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEtBQUs7QUFDbEIsYUFBYSxLQUFLO0FBQ2xCLGFBQWEsS0FBSztBQUNsQjtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjLFlBQVk7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBS0M7Ozs7Ozs7Ozs7Ozs7OztBQzFxQkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixhQUFhLEdBQUcsVUFBVTtBQUNyRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckIsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWMsUUFBUSxHQUFHO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckIsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsUUFBUTtBQUNyQjtBQUNBLGNBQWMsUUFBUTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLE9BQU87QUFDckIsYUFBYSxPQUFPLFdBQVcsbUJBQW1CLEdBQUcsbUJBQW1CO0FBQ3hFLGFBQWEsUUFBUTtBQUNyQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjLFFBQVEsR0FBRztBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLDJDQUEyQyxRQUFRO0FBQ25EO0FBQ0E7QUFDQTs7QUFFQSx3QkFBd0IsT0FBTztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCLGFBQWEsT0FBTztBQUNwQixhQUFhLFFBQVE7QUFDckI7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVksUUFBUTtBQUNwQixZQUFZLFVBQVU7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFLQzs7Ozs7OztVQ3hNRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNONkM7QUFDSDtBQUNOO0FBQ1c7QUFDSTs7QUFFUyIsInNvdXJjZXMiOlsid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9DaGFydC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvY2hhcnRzL1JhZGl4Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3BvaW50cy9Qb2ludC5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvQXNwZWN0cy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL0NvbG9ycy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvc2V0dGluZ3MvY29uc3RhbnRzL1BvaW50LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvUmFkaXguanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3NldHRpbmdzL2NvbnN0YW50cy9UcmFuc2l0LmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9zZXR0aW5ncy9jb25zdGFudHMvVW5pdmVyc2UuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3VuaXZlcnNlL1VuaXZlcnNlLmpzIiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy91dGlscy9Bc3BlY3RVdGlscy5qcyIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvLi9zcmMvdXRpbHMvU1ZHVXRpbHMuanMiLCJ3ZWJwYWNrOi8vYXN0cm9sb2d5Ly4vc3JjL3V0aWxzL1V0aWxzLmpzIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9hc3Ryb2xvZ3kvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2FzdHJvbG9neS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2FzdHJvbG9neS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhc3Ryb2xvZ3lcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiYXN0cm9sb2d5XCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgKCkgPT4ge1xucmV0dXJuICIsImltcG9ydCBVdGlscyBmcm9tICcuLi91dGlscy9VdGlscy5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEFuIGFic3RyYWN0IGNsYXNzIGZvciBhbGwgdHlwZSBvZiBDaGFydFxuICogQHB1YmxpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICogQGFic3RyYWN0XG4gKi9cbmNsYXNzIENoYXJ0IHtcblxuICAvLyNzZXR0aW5nc1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzKSB7XG4gICAgLy90aGlzLiNzZXR0aW5ncyA9IHNldHRpbmdzXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGRhdGEgaXMgdmFsaWRcbiAgICogQHRocm93cyB7RXJyb3J9IC0gaWYgdGhlIGRhdGEgaXMgdW5kZWZpbmVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IC0ge2lzVmFsaWQ6Ym9vbGVhbiwgbWVzc2FnZTpTdHJpbmd9XG4gICAqL1xuICB2YWxpZGF0ZURhdGEoZGF0YSkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzaW5nIHBhcmFtIGRhdGEuXCIpXG4gICAgfVxuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEucG9pbnRzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwicG9pbnRzIGlzIG5vdCBBcnJheS5cIlxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShkYXRhLmN1c3BzKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIG1lc3NhZ2U6IFwiY3VwcyBpcyBub3QgQXJyYXkuXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5jdXNwcy5sZW5ndGggIT09IDEyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgbWVzc2FnZTogXCJjdXNwcy5sZW5ndGggIT09IDEyXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBwb2ludCBvZiBkYXRhLnBvaW50cykge1xuICAgICAgaWYgKHR5cGVvZiBwb2ludC5uYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQubmFtZSAhPT0gJ3N0cmluZydcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocG9pbnQubmFtZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBtZXNzYWdlOiBcInBvaW50Lm5hbWUubGVuZ3RoID09IDBcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBvaW50LmFuZ2xlICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwicG9pbnQuYW5nbGUgIT09ICdudW1iZXInXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGN1c3Agb2YgZGF0YS5jdXNwcykge1xuICAgICAgaWYgKHR5cGVvZiBjdXNwLmFuZ2xlICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiY3VzcC5hbmdsZSAhPT0gJ251bWJlcidcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBtZXNzYWdlOiBcIlwiXG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldFBvaW50cygpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldFBvaW50KG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJNdXN0IGJlIGltcGxlbWVudGVkIGJ5IHN1YmNsYXNzLlwiKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGFuaW1hdGVUbyhkYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTXVzdCBiZSBpbXBsZW1lbnRlZCBieSBzdWJjbGFzcy5cIik7XG4gIH1cblxuICAvLyAjIyBQUk9URUNURUQgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbn1cblxuZXhwb3J0IHtcbiAgQ2hhcnQgYXNcbiAgZGVmYXVsdFxufVxuIiwiaW1wb3J0IFVuaXZlcnNlIGZyb20gJy4uL3VuaXZlcnNlL1VuaXZlcnNlLmpzJztcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xuaW1wb3J0IEFzcGVjdFV0aWxzIGZyb20gJy4uL3V0aWxzL0FzcGVjdFV0aWxzLmpzJztcbmltcG9ydCBDaGFydCBmcm9tICcuL0NoYXJ0LmpzJ1xuaW1wb3J0IFBvaW50IGZyb20gJy4uL3BvaW50cy9Qb2ludC5qcydcbmltcG9ydCBEZWZhdWx0U2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzJztcblxuLyoqXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgUG9pbnRzIGFuZCBjdXBzIGFyZSBkaXNwbGF5ZWQgaW5zaWRlIHRoZSBVbml2ZXJzZS5cbiAqIEBwdWJsaWNcbiAqIEBleHRlbmRzIHtDaGFydH1cbiAqL1xuY2xhc3MgUmFkaXhDaGFydCBleHRlbmRzIENoYXJ0IHtcblxuICAvKlxuICAgKiBMZXZlbHMgZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBpbmRpdmlkdWFsIHBhcnRzIG9mIHRoZSBjaGFydC5cbiAgICogSXQgY2FuIGJlIGNoYW5nZWQgZHluYW1pY2FsbHkgYnkgcHVibGljIHNldHRlci5cbiAgICovXG4gICNudW1iZXJPZkxldmVscyA9IDI0XG5cbiAgI3VuaXZlcnNlXG4gICNzZXR0aW5nc1xuICAjcm9vdFxuICAjZGF0YVxuXG4gICNjZW50ZXJYXG4gICNjZW50ZXJZXG4gICNyYWRpdXNcblxuICAvKlxuICAgKiBAc2VlIFV0aWxzLmNsZWFuVXAoKVxuICAgKi9cbiAgI2JlZm9yZUNsZWFuVXBIb29rXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7VW5pdmVyc2V9IFVuaXZlcnNlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1bml2ZXJzZSkge1xuXG4gICAgaWYgKCF1bml2ZXJzZSBpbnN0YW5jZW9mIFVuaXZlcnNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBwYXJhbSB1bml2ZXJzZS4nKVxuICAgIH1cblxuICAgIHN1cGVyKHVuaXZlcnNlLmdldFNldHRpbmdzKCkpXG5cbiAgICB0aGlzLiN1bml2ZXJzZSA9IHVuaXZlcnNlXG4gICAgdGhpcy4jc2V0dGluZ3MgPSB0aGlzLiN1bml2ZXJzZS5nZXRTZXR0aW5ncygpXG4gICAgdGhpcy4jY2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgdGhpcy4jY2VudGVyWSA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfSEVJR0hUIC8gMlxuICAgIHRoaXMuI3JhZGl1cyA9IE1hdGgubWluKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclkpIC0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfUEFERElOR1xuICAgIHRoaXMuI3Jvb3QgPSBTVkdVdGlscy5TVkdHcm91cCgpXG4gICAgdGhpcy4jcm9vdC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHt0aGlzLiNzZXR0aW5ncy5IVE1MX0VMRU1FTlRfSUR9LSR7dGhpcy4jc2V0dGluZ3MuUkFESVhfSUR9YClcbiAgICB0aGlzLiN1bml2ZXJzZS5nZXRTVkdEb2N1bWVudCgpLmFwcGVuZENoaWxkKHRoaXMuI3Jvb3QpO1xuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgY2hhcnQgZGF0YVxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBpZiB0aGUgZGF0YSBpcyBub3QgdmFsaWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1JhZGl4Q2hhcnR9XG4gICAqL1xuICBzZXREYXRhKGRhdGEpIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy52YWxpZGF0ZURhdGEoZGF0YSlcbiAgICBpZiAoIXN0YXR1cy5pc1ZhbGlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RhdHVzLm1lc3NhZ2VzKVxuICAgIH1cblxuICAgIHRoaXMuI2RhdGEgPSBkYXRhXG4gICAgdGhpcy4jZHJhdyhkYXRhKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZGF0YVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBnZXREYXRhKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwicG9pbnRzXCI6Wy4uLnRoaXMuI2RhdGEucG9pbnRzXSxcbiAgICAgIFwiY3VzcHNcIjpbLi4udGhpcy4jZGF0YS5jdXNwc11cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IG51bWJlciBvZiBMZXZlbHMuXG4gICAqIExldmVscyBkZXRlcm1pbmUgdGhlIHdpZHRoIG9mIGluZGl2aWR1YWwgcGFydHMgb2YgdGhlIGNoYXJ0LlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn1cbiAgICovXG4gIHNldE51bWJlck9mTGV2ZWxzKGxldmVscykge1xuICAgIHRoaXMuI251bWJlck9mTGV2ZWxzID0gTWF0aC5tYXgoMjQsIGxldmVscylcbiAgICBpZiAodGhpcy4jZGF0YSkge1xuICAgICAgdGhpcy4jZHJhdyh0aGlzLiNkYXRhKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogR2V0IHJhZGl1c1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXRSYWRpdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JhZGl1c1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCByYWRpdXNcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSB7XG4gICAgcmV0dXJuIDI0ICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcmFkaXVzXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGdldElubmVyQ2lyY2xlUmFkaXVzKCkge1xuICAgIHJldHVybiAyMSAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHJhZGl1c1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSB7XG4gICAgcmV0dXJuIDIwICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcmFkaXVzXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGdldFBvaW50Q2lyY2xlUmFkaXVzKCkge1xuICAgIHJldHVybiAxOCAqICh0aGlzLmdldFJhZGl1cygpIC8gdGhpcy4jbnVtYmVyT2ZMZXZlbHMpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHJhZGl1c1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSB7XG4gICAgcmV0dXJuIDEyICogKHRoaXMuZ2V0UmFkaXVzKCkgLyB0aGlzLiNudW1iZXJPZkxldmVscylcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgVW5pdmVyc2VcbiAgICpcbiAgICogQHJldHVybiB7VW5pdmVyc2V9XG4gICAqL1xuICBnZXRVbml2ZXJzZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdW5pdmVyc2VcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgQXNjZW5kYXQgc2hpZnRcbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0QXNjZW5kYW50U2hpZnQoKSB7XG4gICAgcmV0dXJuICh0aGlzLiNkYXRhPy5jdXNwc1swXT8uYW5nbGUgPz8gMCkgKyBVdGlscy5ERUdfMTgwXG4gIH1cblxuICAvKipcbiAgICogR2V0IGFzcGVjdHNcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbZnJvbVBvaW50c10gLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbdG9Qb2ludHNdIC0gW3tuYW1lOlwiQVNcIiwgYW5nbGU6MH0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6OTB9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59XG4gICAqL1xuICBnZXRBc3BlY3RzKGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzKXtcbiAgICBpZighdGhpcy4jZGF0YSl7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBmcm9tUG9pbnRzID0gZnJvbVBvaW50cyA/PyB0aGlzLiNkYXRhLnBvaW50c1xuICAgIHRvUG9pbnRzID0gdG9Qb2ludHMgPz8gWy4uLnRoaXMuI2RhdGEucG9pbnRzLCB7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOnRoaXMuI2RhdGEuY3VzcHMuYXQoMyl9LCB7bmFtZTpcIkRTXCIsIGFuZ2xlOjE4MH0sIHtuYW1lOlwiTUNcIiwgYW5nbGU6dGhpcy4jZGF0YS5jdXNwcy5hdCg5KX1dXG4gICAgYXNwZWN0cyA9IGFzcGVjdHMgPz8gRGVmYXVsdFNldHRpbmdzLkRFRkFVTFRfQVNQRUNUU1xuXG4gICAgcmV0dXJuIEFzcGVjdFV0aWxzLmdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpLmZpbHRlciggYXNwZWN0ID0+IGFzcGVjdC5mcm9tLm5hbWUgIT0gYXNwZWN0LnRvLm5hbWUpXG4gIH1cblxuICAvKipcbiAgICogRHJhdyBhc3BlY3RzXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2Zyb21Qb2ludHNdIC0gW3tuYW1lOlwiTW9vblwiLCBhbmdsZTowfSwge25hbWU6XCJTdW5cIiwgYW5nbGU6MTc5fSwge25hbWU6XCJNZXJjdXJ5XCIsIGFuZ2xlOjEyMX1dXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW3RvUG9pbnRzXSAtIFt7bmFtZTpcIkFTXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIklDXCIsIGFuZ2xlOjkwfV1cbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbYXNwZWN0c10gLSBbe25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LCB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjJ9XVxuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxuICAgKi9cbiAgZHJhd0FzcGVjdHMoIGZyb21Qb2ludHMsIHRvUG9pbnRzLCBhc3BlY3RzICl7XG4gICAgY29uc3QgYXNwZWN0c1dyYXBwZXIgPSB0aGlzLiN1bml2ZXJzZS5nZXRBc3BlY3RzRWxlbWVudCgpXG4gICAgVXRpbHMuY2xlYW5VcChhc3BlY3RzV3JhcHBlci5nZXRBdHRyaWJ1dGUoXCJpZFwiKSwgdGhpcy4jYmVmb3JlQ2xlYW5VcEhvb2spXG5cbiAgICBjb25zdCBhc3BlY3RzTGlzdCA9IHRoaXMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcbiAgICAgIC5yZWR1Y2UoIChhcnIsIGFzcGVjdCkgPT4ge1xuXG4gICAgICAgIGxldCBpc1RoZVNhbWUgPSBhcnIuc29tZSggZWxtID0+IHtcbiAgICAgICAgICByZXR1cm4gZWxtLmZyb20ubmFtZSA9PSBhc3BlY3QudG8ubmFtZSAmJiBlbG0udG8ubmFtZSA9PSBhc3BlY3QuZnJvbS5uYW1lXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYoICFpc1RoZVNhbWUgKXtcbiAgICAgICAgICBhcnIucHVzaChhc3BlY3QpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyXG4gICAgICB9LCBbXSlcbiAgICAgIC5maWx0ZXIoIGFzcGVjdCA9PiAgYXNwZWN0LmFzcGVjdC5uYW1lICE9ICdDb25qdW5jdGlvbicpXG5cbiAgICBhc3BlY3RzV3JhcHBlci5hcHBlbmRDaGlsZCggQXNwZWN0VXRpbHMuZHJhd0FzcGVjdHModGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpLCB0aGlzLiNzZXR0aW5ncywgYXNwZWN0c0xpc3QpKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vICMjIFBSSVZBVEUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgLypcbiAgICogRHJhdyByYWRpeCBjaGFydFxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgI2RyYXcoZGF0YSkge1xuICAgIFV0aWxzLmNsZWFuVXAodGhpcy4jcm9vdC5nZXRBdHRyaWJ1dGUoJ2lkJyksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxuICAgIHRoaXMuI2RyYXdCYWNrZ3JvdW5kKClcbiAgICB0aGlzLiNkcmF3QXN0cm9sb2dpY2FsU2lnbnMoKVxuICAgIHRoaXMuI2RyYXdSdWxlcigpXG4gICAgdGhpcy4jZHJhd1BvaW50cyhkYXRhKVxuICAgIHRoaXMuI2RyYXdDdXNwcyhkYXRhKVxuICAgIHRoaXMuI2RyYXdNYWluQXhpc0Rlc2NyaXB0aW9uKGRhdGEpXG4gICAgdGhpcy4jZHJhd0JvcmRlcnMoKVxuICAgIHRoaXMuI3NldHRpbmdzLkRSQVdfQVNQRUNUUyAmJiB0aGlzLmRyYXdBc3BlY3RzKClcbiAgfVxuXG4gICNkcmF3QmFja2dyb3VuZCgpIHtcbiAgICBjb25zdCBNQVNLX0lEID0gYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlJBRElYX0lEfS1iYWNrZ3JvdW5kLW1hc2stMWBcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCBtYXNrID0gU1ZHVXRpbHMuU1ZHTWFzayhNQVNLX0lEKVxuICAgIGNvbnN0IG91dGVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkpXG4gICAgb3V0ZXJDaXJjbGUuc2V0QXR0cmlidXRlKCdmaWxsJywgXCJ3aGl0ZVwiKVxuICAgIG1hc2suYXBwZW5kQ2hpbGQob3V0ZXJDaXJjbGUpXG5cbiAgICBjb25zdCBpbm5lckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKVxuICAgIGlubmVyQ2lyY2xlLnNldEF0dHJpYnV0ZSgnZmlsbCcsIFwiYmxhY2tcIilcbiAgICBtYXNrLmFwcGVuZENoaWxkKGlubmVyQ2lyY2xlKVxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobWFzaylcblxuICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpKVxuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gXCJub25lXCIgOiB0aGlzLiNzZXR0aW5ncy5DSEFSVF9CQUNLR1JPVU5EX0NPTE9SKTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwibWFza1wiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogYHVybCgjJHtNQVNLX0lEfSlgKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSlcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNkcmF3QXN0cm9sb2dpY2FsU2lnbnMoKSB7XG4gICAgY29uc3QgTlVNQkVSX09GX0FTVFJPTE9HSUNBTF9TSUdOUyA9IDEyXG4gICAgY29uc3QgU1RFUCA9IDMwIC8vZGVncmVlXG4gICAgY29uc3QgQ09MT1JTX1NJR05TID0gW3RoaXMuI3NldHRpbmdzLkNPTE9SX0FSSUVTLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9UQVVSVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0dFTUlOSSwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQ0FOQ0VSLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9MRU8sIHRoaXMuI3NldHRpbmdzLkNPTE9SX1ZJUkdPLCB0aGlzLiNzZXR0aW5ncy5DT0xPUl9MSUJSQSwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfU0NPUlBJTywgdGhpcy4jc2V0dGluZ3MuQ09MT1JfU0FHSVRUQVJJVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX0NBUFJJQ09STiwgdGhpcy4jc2V0dGluZ3MuQ09MT1JfQVFVQVJJVVMsIHRoaXMuI3NldHRpbmdzLkNPTE9SX1BJU0NFU11cbiAgICBjb25zdCBTWU1CT0xfU0lHTlMgPSBbU1ZHVXRpbHMuU1lNQk9MX0FSSUVTLCBTVkdVdGlscy5TWU1CT0xfVEFVUlVTLCBTVkdVdGlscy5TWU1CT0xfR0VNSU5JLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSLCBTVkdVdGlscy5TWU1CT0xfTEVPLCBTVkdVdGlscy5TWU1CT0xfVklSR08sIFNWR1V0aWxzLlNZTUJPTF9MSUJSQSwgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU8sIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVUywgU1ZHVXRpbHMuU1lNQk9MX0NBUFJJQ09STiwgU1ZHVXRpbHMuU1lNQk9MX0FRVUFSSVVTLCBTVkdVdGlscy5TWU1CT0xfUElTQ0VTXVxuXG4gICAgY29uc3QgbWFrZVN5bWJvbCA9IChzeW1ib2xJbmRleCwgYW5nbGVJbkRlZ3JlZSkgPT4ge1xuICAgICAgbGV0IHBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCkgLSAoKHRoaXMuZ2V0T3V0ZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSkgLyAyKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYW5nbGVJbkRlZ3JlZSArIFNURVAgLyAyLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICBsZXQgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKFNZTUJPTF9TSUdOU1tzeW1ib2xJbmRleF0sIHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX1NJR05TX0ZPTlRfU0laRSk7XG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TSUdOU19DT0xPUik7XG4gICAgICByZXR1cm4gc3ltYm9sXG4gICAgfVxuXG4gICAgY29uc3QgbWFrZVNlZ21lbnQgPSAoc3ltYm9sSW5kZXgsIGFuZ2xlRnJvbUluRGVncmVlLCBhbmdsZVRvSW5EZWdyZWUpID0+IHtcbiAgICAgIGxldCBhMSA9IFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFuZ2xlRnJvbUluRGVncmVlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpXG4gICAgICBsZXQgYTIgPSBVdGlscy5kZWdyZWVUb1JhZGlhbihhbmdsZVRvSW5EZWdyZWUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSlcbiAgICAgIGxldCBzZWdtZW50ID0gU1ZHVXRpbHMuU1ZHU2VnbWVudCh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldE91dGVyQ2lyY2xlUmFkaXVzKCksIGExLCBhMiwgdGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpKTtcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IFwibm9uZVwiIDogQ09MT1JTX1NJR05TW3N5bWJvbEluZGV4XSk7XG4gICAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9TVFJPS0VfT05MWSA/IHRoaXMuI3NldHRpbmdzLkNJUkNMRV9DT0xPUiA6IFwibm9uZVwiKTtcbiAgICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRV9PTkxZID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIDogMCk7XG4gICAgICByZXR1cm4gc2VnbWVudFxuICAgIH1cblxuICAgIGxldCBzdGFydEFuZ2xlID0gMFxuICAgIGxldCBlbmRBbmdsZSA9IHN0YXJ0QW5nbGUgKyBTVEVQXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOVU1CRVJfT0ZfQVNUUk9MT0dJQ0FMX1NJR05TOyBpKyspIHtcblxuICAgICAgbGV0IHNlZ21lbnQgPSBtYWtlU2VnbWVudChpLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSlcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VnbWVudCk7XG5cbiAgICAgIGxldCBzeW1ib2wgPSBtYWtlU3ltYm9sKGksIHN0YXJ0QW5nbGUpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUDtcbiAgICAgIGVuZEFuZ2xlID0gc3RhcnRBbmdsZSArIFNURVBcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAjZHJhd1J1bGVyKCkge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9ESVZJREVSUyA9IDcyXG4gICAgY29uc3QgU1RFUCA9IDVcblxuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBsZXQgc3RhcnRBbmdsZSA9IHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0RJVklERVJTOyBpKyspIHtcbiAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgIGxldCBlbmRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgKGkgJSAyKSA/IHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSAtICgodGhpcy5nZXRJbm5lckNpcmNsZVJhZGl1cygpIC0gdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyAyKSA6IHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXG4gICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUpO1xuXG4gICAgICBzdGFydEFuZ2xlICs9IFNURVBcbiAgICB9XG5cbiAgICBjb25zdCBjaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSk7XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IHBvaW50c1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcbiAgICovXG4gICNkcmF3UG9pbnRzKGRhdGEpIHtcbiAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xuICAgIGNvbnN0IGN1c3BzID0gZGF0YS5jdXNwc1xuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IFV0aWxzLmNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpKVxuICAgIGZvciAoY29uc3QgcG9pbnREYXRhIG9mIHBvaW50cykge1xuICAgICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQocG9pbnREYXRhLCBjdXNwcywgdGhpcy4jc2V0dGluZ3MpXG4gICAgICBjb25zdCBwb2ludFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gKCh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpKSAvIDQpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3Qgc3ltYm9sUG9zaXRpb24gPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclgsIHRoaXMuZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG5cbiAgICAgIC8vIHJ1bGVyIG1hcmtcbiAgICAgIGNvbnN0IHJ1bGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb2ludC5nZXRBbmdsZSgpLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgcnVsZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueCwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueSlcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHJ1bGVyTGluZSk7XG5cbiAgICAgIC8vIHN5bWJvbFxuICAgICAgY29uc3Qgc3ltYm9sID0gcG9pbnQuZ2V0U3ltYm9sKHN5bWJvbFBvc2l0aW9uLngsIHN5bWJvbFBvc2l0aW9uLnksIFV0aWxzLkRFR18wLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1cpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX1BPSU5UU19GT05UX1NJWkUpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QT0lOVFNfQ09MT1IpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbCk7XG5cbiAgICAgIC8vIHBvaW50ZXJcbiAgICAgIC8vaWYgKHBvc2l0aW9uc1twb2ludC5nZXROYW1lKCldICE9IHBvaW50RGF0YS5wb3NpdGlvbikge1xuICAgICAgY29uc3QgcG9pbnRlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy5nZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGNvbnN0IHBvaW50ZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgKHBvaW50UG9zaXRpb24ueCArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueCkgLyAyLCAocG9pbnRQb3NpdGlvbi55ICsgcG9pbnRlckxpbmVFbmRQb3NpdGlvbi55KSAvIDIpXG4gICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBwb2ludGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFIC8gMik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHBvaW50ZXJMaW5lKTtcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IHBvaW50c1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcbiAgICovXG4gICNkcmF3Q3VzcHMoZGF0YSkge1xuICAgIGNvbnN0IHBvaW50cyA9IGRhdGEucG9pbnRzXG4gICAgY29uc3QgY3VzcHMgPSBkYXRhLmN1c3BzXG5cbiAgICBjb25zdCBtYWluQXhpc0luZGV4ZXMgPSBbMCwgMywgNiwgOV0gLy9BcywgSWMsIERzLCBNY1xuXG4gICAgY29uc3QgcG9pbnRzUG9zaXRpb25zID0gcG9pbnRzLm1hcChwb2ludCA9PiB7XG4gICAgICByZXR1cm4gcG9pbnQuYW5nbGVcbiAgICB9KVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHRleHRSYWRpdXMgPSB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpICsgKCh0aGlzLmdldElubmVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLmdldENlbnRlckNpcmNsZVJhZGl1cygpKSAvIDEwKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXNwcy5sZW5ndGg7IGkrKykge1xuXG4gICAgICBjb25zdCBpc0xpbmVJbkNvbGxpc2lvbldpdGhQb2ludCA9IFV0aWxzLmlzQ29sbGlzaW9uKGN1c3BzW2ldLmFuZ2xlLCBwb2ludHNQb3NpdGlvbnMsIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMgLyAyKVxuXG4gICAgICBjb25zdCBzdGFydFBvcyA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID8gdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy5nZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSAtIHRoaXMuZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNikgOiB0aGlzLmdldFJ1bGxlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihjdXNwc1tpXS5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcblxuICAgICAgY29uc3QgbGluZSA9IFNWR1V0aWxzLlNWR0xpbmUoc3RhcnRQb3MueCwgc3RhcnRQb3MueSwgZW5kUG9zLngsIGVuZFBvcy55KVxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgbWFpbkF4aXNJbmRleGVzLmluY2x1ZGVzKGkpID8gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SIDogdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUilcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIG1haW5BeGlzSW5kZXhlcy5pbmNsdWRlcyhpKSA/IHRoaXMuI3NldHRpbmdzLkNIQVJUX01BSU5fU1RST0tFIDogdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgY29uc3Qgc3RhcnRDdXNwID0gY3VzcHNbaV0uYW5nbGVcbiAgICAgIGNvbnN0IGVuZEN1c3AgPSBjdXNwc1soaSArIDEpICUgMTJdLmFuZ2xlXG4gICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxuICAgICAgY29uc3QgdGV4dEFuZ2xlID0gc3RhcnRDdXNwICsgZ2FwIC8gMlxuXG4gICAgICBjb25zdCB0ZXh0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0ZXh0UmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbih0ZXh0QW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCB0ZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dCh0ZXh0UG9zLngsIHRleHRQb3MueSwgYCR7aSsxfWApXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJkb21pbmFudC1iYXNlbGluZVwiLCBcIm1pZGRsZVwiKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfUE9JTlRTX0ZPTlRfU0laRSAvIDIpXG4gICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVEVYVF9DT0xPUilcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGV4dClcbiAgICB9XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IG1haW4gYXhpcyBkZXNjcml0aW9uXG4gICAqIEBwYXJhbSB7QXJyYXl9IGF4aXNMaXN0XG4gICAqL1xuICAjZHJhd01haW5BeGlzRGVzY3JpcHRpb24oZGF0YSkge1xuICAgIGNvbnN0IEFYSVNfTEVOR1RIID0gMTBcbiAgICBjb25zdCBjdXNwcyA9IGRhdGEuY3VzcHNcblxuICAgIGNvbnN0IGF4aXNMaXN0ID0gW3tcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX0FTLFxuICAgICAgICBhbmdsZTogY3VzcHNbMF0uYW5nbGVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFNWR1V0aWxzLlNZTUJPTF9JQyxcbiAgICAgICAgYW5nbGU6IGN1c3BzWzNdLmFuZ2xlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBTVkdVdGlscy5TWU1CT0xfRFMsXG4gICAgICAgIGFuZ2xlOiBjdXNwc1s2XS5hbmdsZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogU1ZHVXRpbHMuU1lNQk9MX01DLFxuICAgICAgICBhbmdsZTogY3VzcHNbOV0uYW5nbGVcbiAgICAgIH0sXG4gICAgXVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGZvciAoY29uc3QgYXhpcyBvZiBheGlzTGlzdCkge1xuICAgICAgbGV0IHN0YXJ0UG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGF4aXMuYW5nbGUsIHRoaXMuZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0UmFkaXVzKCkgKyBBWElTX0xFTkdUSCwgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXhpcy5hbmdsZSwgdGhpcy5nZXRBc2NlbmRhbnRTaGlmdCgpKSlcbiAgICAgIGxldCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSwgZW5kUG9pbnQueCwgZW5kUG9pbnQueSk7XG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX0FYSVNfQ09MT1IpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgbGV0IHRleHRQb2ludCA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRSYWRpdXMoKSArIEFYSVNfTEVOR1RILCBVdGlscy5kZWdyZWVUb1JhZGlhbihheGlzLmFuZ2xlLCB0aGlzLmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgbGV0IHN5bWJvbDtcbiAgICAgIGxldCBTSElGVF9YID0gMDtcbiAgICAgIGxldCBTSElGVF9ZID0gMDtcbiAgICAgIGNvbnN0IFNURVAgPSAyXG4gICAgICBzd2l0Y2ggKGF4aXMubmFtZSkge1xuICAgICAgICBjYXNlIFwiQXNcIjpcbiAgICAgICAgICBTSElGVF9YIC09IFNURVBcbiAgICAgICAgICBTSElGVF9ZIC09IFNURVBcbiAgICAgICAgICBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXhpcy5uYW1lLCB0ZXh0UG9pbnQueCArIFNISUZUX1gsIHRleHRQb2ludC55ICsgU0hJRlRfWSlcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJlbmRcIilcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkRzXCI6XG4gICAgICAgICAgU0hJRlRfWCArPSBTVEVQXG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwic3RhcnRcIilcbiAgICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIk1jXCI6XG4gICAgICAgICAgU0hJRlRfWSAtPSBTVEVQXG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwidGV4dC10b3BcIilcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkljXCI6XG4gICAgICAgICAgU0hJRlRfWSArPSBTVEVQXG4gICAgICAgICAgc3ltYm9sID0gU1ZHVXRpbHMuU1ZHU3ltYm9sKGF4aXMubmFtZSwgdGV4dFBvaW50LnggKyBTSElGVF9YLCB0ZXh0UG9pbnQueSArIFNISUZUX1kpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpXG4gICAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwiaGFuZ2luZ1wiKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYXhpcy5uYW1lKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gYXhpcyBuYW1lLlwiKVxuICAgICAgfVxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZvbnQtZmFtaWx5XCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0ZPTlRfRkFNSUxZKTtcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUkFESVhfQVhJU19GT05UX1NJWkUpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9BWElTX0NPTE9SKTtcblxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xuICAgIH1cblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNkcmF3Qm9yZGVycygpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgY29uc3Qgb3V0ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRPdXRlckNpcmNsZVJhZGl1cygpKVxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgIGNvbnN0IGlubmVyQ2lyY2xlID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuZ2V0SW5uZXJDaXJjbGVSYWRpdXMoKSlcbiAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfQ0lSQ0xFX0NPTE9SKTtcbiAgICBpbm5lckNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTUFJTl9TVFJPS0UpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJDaXJjbGUpXG5cbiAgICBjb25zdCBjZW50ZXJDaXJjbGUgPSBTVkdVdGlscy5TVkdDaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSwgdGhpcy5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSlcbiAgICBjZW50ZXJDaXJjbGUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0NJUkNMRV9DT0xPUik7XG4gICAgY2VudGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChjZW50ZXJDaXJjbGUpXG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgUmFkaXhDaGFydCBhc1xuICBkZWZhdWx0XG59XG4iLCJpbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuLi9jaGFydHMvUmFkaXhDaGFydC5qcyc7XG5pbXBvcnQgU1ZHVXRpbHMgZnJvbSAnLi4vdXRpbHMvU1ZHVXRpbHMuanMnO1xuaW1wb3J0IENoYXJ0IGZyb20gJy4vQ2hhcnQuanMnXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xuaW1wb3J0IEFzcGVjdFV0aWxzIGZyb20gJy4uL3V0aWxzL0FzcGVjdFV0aWxzLmpzJztcbmltcG9ydCBQb2ludCBmcm9tICcuLi9wb2ludHMvUG9pbnQuanMnXG5pbXBvcnQgRGVmYXVsdFNldHRpbmdzIGZyb20gJy4uL3NldHRpbmdzL0RlZmF1bHRTZXR0aW5ncy5qcyc7XG5cbi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFBvaW50cyBhbmQgY3VwcyBhcmUgZGlzcGxheWVkIGZyb20gb3V0c2lkZSB0aGUgVW5pdmVyc2UuXG4gKiBAcHVibGljXG4gKiBAZXh0ZW5kcyB7Q2hhcnR9XG4gKi9cbmNsYXNzIFRyYW5zaXRDaGFydCBleHRlbmRzIENoYXJ0IHtcblxuICAvKlxuICAgKiBMZXZlbHMgZGV0ZXJtaW5lIHRoZSB3aWR0aCBvZiBpbmRpdmlkdWFsIHBhcnRzIG9mIHRoZSBjaGFydC5cbiAgICogSXQgY2FuIGJlIGNoYW5nZWQgZHluYW1pY2FsbHkgYnkgcHVibGljIHNldHRlci5cbiAgICovXG4gICNudW1iZXJPZkxldmVscyA9IDMyXG5cbiAgI3JhZGl4XG4gICNzZXR0aW5nc1xuICAjcm9vdFxuICAjZGF0YVxuXG4gICNjZW50ZXJYXG4gICNjZW50ZXJZXG4gICNyYWRpdXNcblxuICAvKlxuICAgKiBAc2VlIFV0aWxzLmNsZWFuVXAoKVxuICAgKi9cbiAgI2JlZm9yZUNsZWFuVXBIb29rXG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RzXG4gICAqIEBwYXJhbSB7UmFkaXhDaGFydH0gcmFkaXhcbiAgICovXG4gIGNvbnN0cnVjdG9yKHJhZGl4KSB7XG4gICAgaWYgKCEocmFkaXggaW5zdGFuY2VvZiBSYWRpeENoYXJ0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgcGFyYW0gcmFkaXguJylcbiAgICB9XG5cbiAgICBzdXBlcihyYWRpeC5nZXRVbml2ZXJzZSgpLmdldFNldHRpbmdzKCkpXG5cbiAgICB0aGlzLiNyYWRpeCA9IHJhZGl4XG4gICAgdGhpcy4jc2V0dGluZ3MgPSB0aGlzLiNyYWRpeC5nZXRVbml2ZXJzZSgpLmdldFNldHRpbmdzKClcbiAgICB0aGlzLiNjZW50ZXJYID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcbiAgICB0aGlzLiNjZW50ZXJZID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG4gICAgdGhpcy4jcmFkaXVzID0gTWF0aC5taW4odGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWSkgLSB0aGlzLiNzZXR0aW5ncy5DSEFSVF9QQURESU5HXG5cbiAgICB0aGlzLiNyb290ID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgIHRoaXMuI3Jvb3Quc2V0QXR0cmlidXRlKFwiaWRcIiwgYCR7dGhpcy4jc2V0dGluZ3MuSFRNTF9FTEVNRU5UX0lEfS0ke3RoaXMuI3NldHRpbmdzLlRSQU5TSVRfSUR9YClcbiAgICB0aGlzLiNyYWRpeC5nZXRVbml2ZXJzZSgpLmdldFNWR0RvY3VtZW50KCkuYXBwZW5kQ2hpbGQodGhpcy4jcm9vdCk7XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBjaGFydCBkYXRhXG4gICAqIEB0aHJvd3Mge0Vycm9yfSAtIGlmIHRoZSBkYXRhIGlzIG5vdCB2YWxpZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybiB7UmFkaXhDaGFydH1cbiAgICovXG4gIHNldERhdGEoZGF0YSkge1xuICAgIGxldCBzdGF0dXMgPSB0aGlzLnZhbGlkYXRlRGF0YShkYXRhKVxuICAgIGlmICghc3RhdHVzLmlzVmFsaWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihzdGF0dXMubWVzc2FnZXMpXG4gICAgfVxuXG4gICAgdGhpcy4jZGF0YSA9IGRhdGFcbiAgICB0aGlzLiNkcmF3KGRhdGEpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkYXRhXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldERhdGEoKXtcbiAgICByZXR1cm4ge1xuICAgICAgXCJwb2ludHNcIjpbLi4udGhpcy4jZGF0YS5wb2ludHNdLFxuICAgICAgXCJjdXNwc1wiOlsuLi50aGlzLiNkYXRhLmN1c3BzXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcmFkaXVzXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0UmFkaXVzKCkge1xuICAgIHJldHVybiB0aGlzLiNyYWRpdXNcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYXNwZWN0c1xuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtmcm9tUG9pbnRzXSAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFt0b1BvaW50c10gLSBbe25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTo5MH1dXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW2FzcGVjdHNdIC0gW3tuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSwge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfV1cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAgICovXG4gIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpe1xuICAgIGlmKCF0aGlzLiNkYXRhKXtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGZyb21Qb2ludHMgPSBmcm9tUG9pbnRzID8/IHRoaXMuI2RhdGEucG9pbnRzXG4gICAgdG9Qb2ludHMgPSB0b1BvaW50cyA/PyBbLi4udGhpcy4jcmFkaXguZ2V0RGF0YSgpLnBvaW50cywge25hbWU6XCJBU1wiLCBhbmdsZTowfSwge25hbWU6XCJJQ1wiLCBhbmdsZTp0aGlzLiNyYWRpeC5nZXREYXRhKCkuY3VzcHMuYXQoMyl9LCB7bmFtZTpcIkRTXCIsIGFuZ2xlOjE4MH0sIHtuYW1lOlwiTUNcIiwgYW5nbGU6dGhpcy4jcmFkaXguZ2V0RGF0YSgpLmN1c3BzLmF0KDkpfV1cbiAgICBhc3BlY3RzID0gYXNwZWN0cyA/PyBEZWZhdWx0U2V0dGluZ3MuREVGQVVMVF9BU1BFQ1RTXG5cbiAgICByZXR1cm4gQXNwZWN0VXRpbHMuZ2V0QXNwZWN0cyhmcm9tUG9pbnRzLCB0b1BvaW50cywgYXNwZWN0cylcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3IGFzcGVjdHNcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbZnJvbVBvaW50c10gLSBbe25hbWU6XCJNb29uXCIsIGFuZ2xlOjB9LCB7bmFtZTpcIlN1blwiLCBhbmdsZToxNzl9LCB7bmFtZTpcIk1lcmN1cnlcIiwgYW5nbGU6MTIxfV1cbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBbdG9Qb2ludHNdIC0gW3tuYW1lOlwiQVNcIiwgYW5nbGU6MH0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6OTB9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFthc3BlY3RzXSAtIFt7bmFtZTpcIk9wcG9zaXRpb25cIiwgYW5nbGU6MTgwLCBvcmI6Mn0sIHtuYW1lOlwiVHJpbmVcIiwgYW5nbGU6MTIwLCBvcmI6Mn1dXG4gICAqXG4gICAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59XG4gICAqL1xuICBkcmF3QXNwZWN0cyggZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMgKXtcbiAgICBjb25zdCBhc3BlY3RzV3JhcHBlciA9IHRoaXMuI3JhZGl4LmdldFVuaXZlcnNlKCkuZ2V0QXNwZWN0c0VsZW1lbnQoKVxuICAgIFV0aWxzLmNsZWFuVXAoYXNwZWN0c1dyYXBwZXIuZ2V0QXR0cmlidXRlKFwiaWRcIiksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxuXG4gICAgY29uc3QgYXNwZWN0c0xpc3QgPSB0aGlzLmdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpXG4gICAgICAuZmlsdGVyKCBhc3BlY3QgPT4gIGFzcGVjdC5hc3BlY3QubmFtZSAhPSAnQ29uanVuY3Rpb24nKVxuICAgIFxuICAgIGFzcGVjdHNXcmFwcGVyLmFwcGVuZENoaWxkKCBBc3BlY3RVdGlscy5kcmF3QXNwZWN0cyh0aGlzLiNyYWRpeC5nZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSwgdGhpcy4jc2V0dGluZ3MsIGFzcGVjdHNMaXN0KSlcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qXG4gICAqIERyYXcgcmFkaXggY2hhcnRcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gICNkcmF3KGRhdGEpIHtcblxuICAgIC8vIHJhZGl4IHJlRHJhd1xuICAgIFV0aWxzLmNsZWFuVXAodGhpcy4jcm9vdC5nZXRBdHRyaWJ1dGUoJ2lkJyksIHRoaXMuI2JlZm9yZUNsZWFuVXBIb29rKVxuICAgIHRoaXMuI3JhZGl4LnNldE51bWJlck9mTGV2ZWxzKHRoaXMuI251bWJlck9mTGV2ZWxzKVxuXG4gICAgdGhpcy4jZHJhd1J1bGVyKClcbiAgICB0aGlzLiNkcmF3Q3VzcHMoZGF0YSlcbiAgICB0aGlzLiNkcmF3UG9pbnRzKGRhdGEpXG4gICAgdGhpcy4jZHJhd0JvcmRlcnMoKVxuICAgIHRoaXMuI3NldHRpbmdzLkRSQVdfQVNQRUNUUyAmJiB0aGlzLmRyYXdBc3BlY3RzKClcbiAgfVxuXG4gICNkcmF3UnVsZXIoKSB7XG4gICAgY29uc3QgTlVNQkVSX09GX0RJVklERVJTID0gNzJcbiAgICBjb25zdCBTVEVQID0gNVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGxldCBzdGFydEFuZ2xlID0gdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTlVNQkVSX09GX0RJVklERVJTOyBpKyspIHtcbiAgICAgIGxldCBzdGFydFBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oc3RhcnRBbmdsZSkpXG4gICAgICBsZXQgZW5kUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIChpICUgMikgPyB0aGlzLmdldFJhZGl1cygpIC0gKCh0aGlzLmdldFJhZGl1cygpIC0gdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkpIC8gMikgOiB0aGlzLmdldFJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihzdGFydEFuZ2xlKSlcbiAgICAgIGNvbnN0IGxpbmUgPSBTVkdVdGlscy5TVkdMaW5lKHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55LCBlbmRQb2ludC54LCBlbmRQb2ludC55KTtcbiAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZSk7XG5cbiAgICAgIHN0YXJ0QW5nbGUgKz0gU1RFUFxuICAgIH1cblxuICAgIGNvbnN0IGNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGNpcmNsZSk7XG5cbiAgICB0aGlzLiNyb290LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gIH1cblxuICAvKlxuICAgKiBEcmF3IHBvaW50c1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGNoYXJ0IGRhdGFcbiAgICovXG4gICNkcmF3UG9pbnRzKGRhdGEpIHtcbiAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xuICAgIGNvbnN0IGN1c3BzID0gZGF0YS5jdXNwc1xuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IFV0aWxzLmNhbGN1bGF0ZVBvc2l0aW9uV2l0aG91dE92ZXJsYXBwaW5nKHBvaW50cywgdGhpcy4jc2V0dGluZ3MuUE9JTlRfQ09MTElTSU9OX1JBRElVUywgdGhpcy4jZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSlcbiAgICBmb3IgKGNvbnN0IHBvaW50RGF0YSBvZiBwb2ludHMpIHtcbiAgICAgIGNvbnN0IHBvaW50ID0gbmV3IFBvaW50KHBvaW50RGF0YSwgY3VzcHMsIHRoaXMuI3NldHRpbmdzKVxuICAgICAgY29uc3QgcG9pbnRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSAoKHRoaXMuZ2V0UmFkaXVzKCkgLSB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSkgLyA0KSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9pbnQuZ2V0QW5nbGUoKSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBzeW1ib2xQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UG9pbnRDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4ocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0sIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICAvLyBydWxlciBtYXJrXG4gICAgICBjb25zdCBydWxlckxpbmVFbmRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUodGhpcy4jY2VudGVyWCwgdGhpcy4jY2VudGVyWCwgdGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCksIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKHBvaW50LmdldEFuZ2xlKCksIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgcnVsZXJMaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShwb2ludFBvc2l0aW9uLngsIHBvaW50UG9zaXRpb24ueSwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueCwgcnVsZXJMaW5lRW5kUG9zaXRpb24ueSlcbiAgICAgIHJ1bGVyTGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfTElORV9DT0xPUik7XG4gICAgICBydWxlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHJ1bGVyTGluZSk7XG5cbiAgICAgIC8vIHN5bWJvbFxuICAgICAgY29uc3Qgc3ltYm9sID0gcG9pbnQuZ2V0U3ltYm9sKHN5bWJvbFBvc2l0aW9uLngsIHN5bWJvbFBvc2l0aW9uLnksIFV0aWxzLkRFR18wLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9QUk9QRVJUSUVTX1NIT1cpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfRk9OVF9GQU1JTFkpO1xuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpIC8vIHN0YXJ0LCBtaWRkbGUsIGVuZFxuICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlRSQU5TSVRfUE9JTlRTX0ZPTlRfU0laRSlcbiAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1BPSU5UU19DT0xPUilcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ltYm9sKTtcblxuICAgICAgLy8gcG9pbnRlclxuICAgICAgLy9pZiAocG9zaXRpb25zW3BvaW50LmdldE5hbWUoKV0gIT0gcG9pbnREYXRhLnBvc2l0aW9uKSB7XG4gICAgICBjb25zdCBwb2ludGVyTGluZUVuZFBvc2l0aW9uID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJYLCB0aGlzLiNnZXRQb2ludENpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihwb3NpdGlvbnNbcG9pbnQuZ2V0TmFtZSgpXSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBwb2ludGVyTGluZSA9IFNWR1V0aWxzLlNWR0xpbmUocG9pbnRQb3NpdGlvbi54LCBwb2ludFBvc2l0aW9uLnksIChwb2ludFBvc2l0aW9uLnggKyBwb2ludGVyTGluZUVuZFBvc2l0aW9uLngpIC8gMiwgKHBvaW50UG9zaXRpb24ueSArIHBvaW50ZXJMaW5lRW5kUG9zaXRpb24ueSkgLyAyKVxuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX0xJTkVfQ09MT1IpO1xuICAgICAgcG9pbnRlckxpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1NUUk9LRSAvIDIpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChwb2ludGVyTGluZSk7XG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLypcbiAgICogRHJhdyBwb2ludHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBjaGFydCBkYXRhXG4gICAqL1xuICAjZHJhd0N1c3BzKGRhdGEpIHtcbiAgICBjb25zdCBwb2ludHMgPSBkYXRhLnBvaW50c1xuICAgIGNvbnN0IGN1c3BzID0gZGF0YS5jdXNwc1xuXG4gICAgY29uc3QgcG9pbnRzUG9zaXRpb25zID0gcG9pbnRzLm1hcChwb2ludCA9PiB7XG4gICAgICByZXR1cm4gcG9pbnQuYW5nbGVcbiAgICB9KVxuXG4gICAgY29uc3Qgd3JhcHBlciA9IFNWR1V0aWxzLlNWR0dyb3VwKClcblxuICAgIGNvbnN0IHRleHRSYWRpdXMgPSB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSArICgodGhpcy4jZ2V0UnVsbGVyQ2lyY2xlUmFkaXVzKCkgLSB0aGlzLiNnZXRDZW50ZXJDaXJjbGVSYWRpdXMoKSkgLyA2KVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXNwcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXNMaW5lSW5Db2xsaXNpb25XaXRoUG9pbnQgPSBVdGlscy5pc0NvbGxpc2lvbihjdXNwc1tpXS5hbmdsZSwgcG9pbnRzUG9zaXRpb25zLCB0aGlzLiNzZXR0aW5ncy5QT0lOVF9DT0xMSVNJT05fUkFESVVTIC8gMilcblxuICAgICAgY29uc3Qgc3RhcnRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIHRoaXMuI2dldENlbnRlckNpcmNsZVJhZGl1cygpLCBVdGlscy5kZWdyZWVUb1JhZGlhbihjdXNwc1tpXS5hbmdsZSwgdGhpcy4jcmFkaXguZ2V0QXNjZW5kYW50U2hpZnQoKSkpXG4gICAgICBjb25zdCBlbmRQb3MgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKHRoaXMuI2NlbnRlclgsIHRoaXMuI2NlbnRlclksIGlzTGluZUluQ29sbGlzaW9uV2l0aFBvaW50ID8gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkgKyAoKHRoaXMuI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIC0gdGhpcy4jZ2V0Q2VudGVyQ2lyY2xlUmFkaXVzKCkpIC8gNikgOiB0aGlzLiNnZXRSdWxsZXJDaXJjbGVSYWRpdXMoKSwgVXRpbHMuZGVncmVlVG9SYWRpYW4oY3VzcHNbaV0uYW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuXG4gICAgICBjb25zdCBsaW5lID0gU1ZHVXRpbHMuU1ZHTGluZShzdGFydFBvcy54LCBzdGFydFBvcy55LCBlbmRQb3MueCwgZW5kUG9zLnkpXG4gICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9MSU5FX0NPTE9SKVxuICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgdGhpcy4jc2V0dGluZ3MuQ0hBUlRfU1RST0tFKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChsaW5lKTtcblxuICAgICAgY29uc3Qgc3RhcnRDdXNwID0gY3VzcHNbaV0uYW5nbGVcbiAgICAgIGNvbnN0IGVuZEN1c3AgPSBjdXNwc1soaSArIDEpICUgMTJdLmFuZ2xlXG4gICAgICBjb25zdCBnYXAgPSBlbmRDdXNwIC0gc3RhcnRDdXNwID4gMCA/IGVuZEN1c3AgLSBzdGFydEN1c3AgOiBlbmRDdXNwIC0gc3RhcnRDdXNwICsgVXRpbHMuREVHXzM2MFxuICAgICAgY29uc3QgdGV4dEFuZ2xlID0gc3RhcnRDdXNwICsgZ2FwIC8gMlxuXG4gICAgICBjb25zdCB0ZXh0UG9zID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0ZXh0UmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbih0ZXh0QW5nbGUsIHRoaXMuI3JhZGl4LmdldEFzY2VuZGFudFNoaWZ0KCkpKVxuICAgICAgY29uc3QgdGV4dCA9IFNWR1V0aWxzLlNWR1RleHQodGV4dFBvcy54LCB0ZXh0UG9zLnksIGAke2krMX1gKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZm9udC1zaXplXCIsIHRoaXMuI3NldHRpbmdzLlJBRElYX1BPSU5UU19GT05UX1NJWkUgLyAyKVxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLkNIQVJUX1RFWFRfQ09MT1IpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHRleHQpXG4gICAgfVxuXG4gICAgdGhpcy4jcm9vdC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgI2RyYXdCb3JkZXJzKCkge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCBvdXRlckNpcmNsZSA9IFNWR1V0aWxzLlNWR0NpcmNsZSh0aGlzLiNjZW50ZXJYLCB0aGlzLiNjZW50ZXJZLCB0aGlzLmdldFJhZGl1cygpKVxuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9DSVJDTEVfQ09MT1IpO1xuICAgIG91dGVyQ2lyY2xlLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9NQUlOX1NUUk9LRSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChvdXRlckNpcmNsZSlcblxuICAgIHRoaXMuI3Jvb3QuYXBwZW5kQ2hpbGQod3JhcHBlcilcbiAgfVxuXG4gICNnZXRQb2ludENpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gMjkgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICB9XG5cbiAgI2dldFJ1bGxlckNpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gMzEgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICB9XG5cbiAgI2dldENlbnRlckNpcmNsZVJhZGl1cygpIHtcbiAgICByZXR1cm4gMjQgKiAodGhpcy5nZXRSYWRpdXMoKSAvIHRoaXMuI251bWJlck9mTGV2ZWxzKVxuICB9XG5cbn1cblxuZXhwb3J0IHtcbiAgVHJhbnNpdENoYXJ0IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBSZXByZXNlbnRzIGEgcGxhbmV0IG9yIHBvaW50IG9mIGludGVyZXN0IGluIHRoZSBjaGFydFxuICogQHB1YmxpY1xuICovXG5jbGFzcyBQb2ludCB7XG5cbiAgI25hbWVcbiAgI2FuZ2xlXG4gICNpc1JldHJvZ3JhZGVcbiAgI2N1c3BzXG4gICNzZXR0aW5nc1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnREYXRhIC0ge25hbWU6U3RyaW5nLCBhbmdsZTpOdW1iZXIsIGlzUmV0cm9ncmFkZTpmYWxzZX1cbiAgICogQHBhcmFtIHtPYmplY3R9IGN1c3BzLSBbe2FuZ2xlOk51bWJlcn0sIHthbmdsZTpOdW1iZXJ9LCB7YW5nbGU6TnVtYmVyfSwgLi4uXVxuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBvaW50RGF0YSwgY3VzcHMsIHNldHRpbmdzKSB7XG4gICAgdGhpcy4jbmFtZSA9IHBvaW50RGF0YS5uYW1lID8/IFwiVW5rbm93blwiXG4gICAgdGhpcy4jYW5nbGUgPSBwb2ludERhdGEuYW5nbGUgPz8gMFxuICAgIHRoaXMuI2lzUmV0cm9ncmFkZSA9IHBvaW50RGF0YS5pc1JldHJvZ3JhZGUgPz8gZmFsc2VcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShjdXNwcykgfHwgY3VzcHMubGVuZ3RoICE9IDEyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCYWQgcGFyYW0gY3VzcHMuIFwiKVxuICAgIH1cblxuICAgIHRoaXMuI2N1c3BzID0gY3VzcHNcblxuICAgIGlmICghc2V0dGluZ3MpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBhcmFtIHNldHRpbmdzLicpXG4gICAgfVxuXG4gICAgdGhpcy4jc2V0dGluZ3MgPSBzZXR0aW5nc1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBuYW1lXG4gICAqXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGdldE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI25hbWVcbiAgfVxuXG4gIC8qKlxuICAgKiBJcyByZXRyb2dyYWRlXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc1JldHJvZ3JhZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lzUmV0cm9ncmFkZVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbmdsZVxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXRBbmdsZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jYW5nbGVcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgc3ltYm9sXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4UG9zXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5UG9zXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbYW5nbGVTaGlmdF1cbiAgICogQHBhcmFtIHtCb29sZWFufSBbaXNQcm9wZXJ0aWVzXSAtIGFuZ2xlSW5TaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcbiAgICpcbiAgICogQHJldHVybiB7U1ZHRWxlbWVudH1cbiAgICovXG4gIGdldFN5bWJvbCh4UG9zLCB5UG9zLCBhbmdsZVNoaWZ0ID0gMCwgaXNQcm9wZXJ0aWVzID0gdHJ1ZSkge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBTVkdVdGlscy5TVkdHcm91cCgpXG5cbiAgICBjb25zdCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2wodGhpcy4jbmFtZSwgeFBvcywgeVBvcylcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHN5bWJvbClcblxuICAgIGlmIChpc1Byb3BlcnRpZXMgPT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiB3cmFwcGVyIC8vPT09PT09PlxuICAgIH1cblxuICAgIGNvbnN0IGNoYXJ0Q2VudGVyWCA9IHRoaXMuI3NldHRpbmdzLkNIQVJUX1ZJRVdCT1hfV0lEVEggLyAyXG4gICAgY29uc3QgY2hhcnRDZW50ZXJZID0gdGhpcy4jc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG4gICAgY29uc3QgYW5nbGVGcm9tU3ltYm9sVG9DZW50ZXIgPSBVdGlscy5wb3NpdGlvblRvQW5nbGUoeFBvcywgeVBvcywgY2hhcnRDZW50ZXJYLCBjaGFydENlbnRlclkpXG5cbiAgICBhbmdsZUluU2lnbi5jYWxsKHRoaXMpXG4gICAgdGhpcy5nZXREaWduaXR5KCkgJiYgZGlnbml0aWVzLmNhbGwodGhpcylcblxuICAgIHJldHVybiB3cmFwcGVyIC8vPT09PT09PlxuXG4gICAgLypcbiAgICAgKiAgQW5nbGUgaW4gc2lnblxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFuZ2xlSW5TaWduKCkge1xuICAgICAgY29uc3QgYW5nbGVJblNpZ25Qb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoeFBvcywgeVBvcywgMiAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXG4gICAgICAvLyBJdCBpcyBwb3NzaWJsZSB0byByb3RhdGUgdGhlIHRleHQsIHdoZW4gdW5jb21tZW50IGEgbGluZSBiZWxsb3cuXG4gICAgICAvL3RleHRXcmFwcGVyLnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBgcm90YXRlKCR7YW5nbGVGcm9tU3ltYm9sVG9DZW50ZXJ9LCR7dGV4dFBvc2l0aW9uLnh9LCR7dGV4dFBvc2l0aW9uLnl9KWApXG5cbiAgICAgIGNvbnN0IHRleHQgPSBbXVxuICAgICAgdGV4dC5wdXNoKHRoaXMuZ2V0QW5nbGVJblNpZ24oKSlcbiAgICAgIHRoaXMuI2lzUmV0cm9ncmFkZSAmJiB0ZXh0LnB1c2goU1ZHVXRpbHMuU1lNQk9MX1JFVFJPR1JBREVfQ09ERSlcblxuICAgICAgY29uc3QgYW5nbGVJblNpZ25UZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChhbmdsZUluU2lnblBvc2l0aW9uLngsIGFuZ2xlSW5TaWduUG9zaXRpb24ueSwgdGV4dC5qb2luKFwiIFwiKSlcbiAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIikgLy8gc3RhcnQsIG1pZGRsZSwgZW5kXG4gICAgICBhbmdsZUluU2lnblRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIilcbiAgICAgIGFuZ2xlSW5TaWduVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUpO1xuICAgICAgYW5nbGVJblNpZ25UZXh0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19DT0xPUik7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGFuZ2xlSW5TaWduVGV4dClcbiAgICB9XG5cbiAgICAvKlxuICAgICAqICBEaWduaXRpZXNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkaWduaXRpZXMoKSB7XG4gICAgICBjb25zdCBkaWduaXRpZXNQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoeFBvcywgeVBvcywgMyAqIHRoaXMuI3NldHRpbmdzLlBPSU5UX0NPTExJU0lPTl9SQURJVVMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKC1hbmdsZUZyb21TeW1ib2xUb0NlbnRlciwgYW5nbGVTaGlmdCkpXG4gICAgICBjb25zdCBkaWduaXRpZXNUZXh0ID0gU1ZHVXRpbHMuU1ZHVGV4dChkaWduaXRpZXNQb3NpdGlvbi54LCBkaWduaXRpZXNQb3NpdGlvbi55LCB0aGlzLmdldERpZ25pdHkoKSlcbiAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZm9udC1mYW1pbHlcIiwgXCJzYW5zLXNlcmlmXCIpO1xuICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgIGRpZ25pdGllc1RleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJ0ZXh0LWJvdHRvbVwiKVxuICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgdGhpcy4jc2V0dGluZ3MuUE9JTlRfUFJPUEVSVElFU19GT05UX1NJWkUgLyAxLjIpO1xuICAgICAgZGlnbml0aWVzVGV4dC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIHRoaXMuI3NldHRpbmdzLlBPSU5UX1BST1BFUlRJRVNfQ09MT1IpO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChkaWduaXRpZXNUZXh0KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgaG91c2UgbnVtYmVyXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn1cbiAgICovXG4gIGdldEhvdXNlTnVtYmVyKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXQuXCIpXG4gIH1cblxuICAvKipcbiAgICogR2V0IHNpZ24gbnVtYmVyXG4gICAqIEFyaXNlID0gMSwgVGF1cnVzID0gMiwgLi4uUGlzY2VzID0gMTJcbiAgICpcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0U2lnbk51bWJlcigpIHtcbiAgICBsZXQgYW5nbGUgPSB0aGlzLiNhbmdsZSAlIFV0aWxzLkRFR18zNjBcbiAgICByZXR1cm4gTWF0aC5mbG9vcigoYW5nbGUgLyAzMCkgKyAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhbmdsZSAoSW50ZWdlcikgaW4gdGhlIHNpZ24gaW4gd2hpY2ggaXQgc3RhbmRzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXRBbmdsZUluU2lnbigpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLiNhbmdsZSAlIDMwKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBkaWduaXR5IHN5bWJvbCAociAtIHJ1bGVyc2hpcCwgZCAtIGRldHJpbWVudCwgZiAtIGZhbGwsIGUgLSBleGFsdGF0aW9uKVxuICAgKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IC0gZGlnbml0eSBzeW1ib2wgKHIsZCxmLGUpXG4gICAqL1xuICBnZXREaWduaXR5KCkge1xuICAgIGNvbnN0IEFSSUVTID0gMVxuICAgIGNvbnN0IFRBVVJVUyA9IDJcbiAgICBjb25zdCBHRU1JTkkgPSAzXG4gICAgY29uc3QgQ0FOQ0VSID0gNFxuICAgIGNvbnN0IExFTyA9IDVcbiAgICBjb25zdCBWSVJHTyA9IDZcbiAgICBjb25zdCBMSUJSQSA9IDdcbiAgICBjb25zdCBTQ09SUElPID0gOFxuICAgIGNvbnN0IFNBR0lUVEFSSVVTID0gOVxuICAgIGNvbnN0IENBUFJJQ09STiA9IDEwXG4gICAgY29uc3QgQVFVQVJJVVMgPSAxMVxuICAgIGNvbnN0IFBJU0NFUyA9IDEyXG5cbiAgICBjb25zdCBSVUxFUlNISVBfU1lNQk9MID0gXCJyXCJcbiAgICBjb25zdCBERVRSSU1FTlRfU1lNQk9MID0gXCJkXCJcbiAgICBjb25zdCBGQUxMX1NZTUJPTCA9IFwiZlwiXG4gICAgY29uc3QgRVhBTFRBVElPTl9TWU1CT0wgPSBcImVcIlxuXG4gICAgc3dpdGNoICh0aGlzLiNuYW1lKSB7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TVU46XG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUVVBUklVUykge1xuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTKSB7XG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01PT046XG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQU5DRVIpIHtcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQVBSSUNPUk4pIHtcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBTQ09SUElPKSB7XG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFRBVVJVUykge1xuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWTpcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEdFTUlOSSkge1xuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNBR0lUVEFSSVVTKSB7XG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gUElTQ0VTKSB7XG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XG4gICAgICAgICAgcmV0dXJuIEVYQUxUQVRJT05fU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9WRU5VUzpcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFRBVVJVUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMSUJSQSkge1xuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFSSUVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNDT1JQSU8pIHtcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBWSVJHTykge1xuICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBQSVNDRVMpIHtcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01BUlM6XG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUklFUyB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBTQ09SUElPKSB7XG4gICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVEFVUlVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExJQlJBKSB7XG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQ0FOQ0VSKSB7XG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBUFJJQ09STikge1xuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfSlVQSVRFUjpcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNBR0lUVEFSSVVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFBJU0NFUykge1xuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEdFTUlOSSB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBWSVJHTykge1xuICAgICAgICAgIHJldHVybiBERVRSSU1FTlRfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBUFJJQ09STikge1xuICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBDQU5DRVIpIHtcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBVFVSTjpcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBUFJJQ09STiB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUVVBUklVUykge1xuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IENBTkNFUiB8fCB0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBBUklFUykge1xuICAgICAgICAgIHJldHVybiBGQUxMX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMSUJSQSkge1xuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVVJBTlVTOlxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVFVQVJJVVMpIHtcbiAgICAgICAgICByZXR1cm4gUlVMRVJTSElQX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBMRU8pIHtcbiAgICAgICAgICByZXR1cm4gREVUUklNRU5UX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBUQVVSVVMpIHtcbiAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gU0NPUlBJTykge1xuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTkVQVFVORTpcbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFBJU0NFUykge1xuICAgICAgICAgIHJldHVybiBSVUxFUlNISVBfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFZJUkdPKSB7XG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gR0VNSU5JIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IEFRVUFSSVVTKSB7XG4gICAgICAgICAgcmV0dXJuIEZBTExfU1lNQk9MIC8vPT09PT09PlxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0U2lnbk51bWJlcigpID09IFNBR0lUVEFSSVVTIHx8IHRoaXMuZ2V0U2lnbk51bWJlcigpID09IExFTykge1xuICAgICAgICAgIHJldHVybiBFWEFMVEFUSU9OX1NZTUJPTCAvLz09PT09PT5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIlxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUExVVE86XG4gICAgICAgIGlmICh0aGlzLmdldFNpZ25OdW1iZXIoKSA9PSBTQ09SUElPKSB7XG4gICAgICAgICAgcmV0dXJuIFJVTEVSU0hJUF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gVEFVUlVTKSB7XG4gICAgICAgICAgcmV0dXJuIERFVFJJTUVOVF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gTElCUkEpIHtcbiAgICAgICAgICByZXR1cm4gRkFMTF9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nZXRTaWduTnVtYmVyKCkgPT0gQVJJRVMpIHtcbiAgICAgICAgICByZXR1cm4gRVhBTFRBVElPTl9TWU1CT0wgLy89PT09PT0+XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCJcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBcIlwiXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFBvaW50IGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCAqIGFzIFVuaXZlcnNlIGZyb20gXCIuL2NvbnN0YW50cy9Vbml2ZXJzZS5qc1wiXG5pbXBvcnQgKiBhcyBSYWRpeCBmcm9tIFwiLi9jb25zdGFudHMvUmFkaXguanNcIlxuaW1wb3J0ICogYXMgVHJhbnNpdCBmcm9tIFwiLi9jb25zdGFudHMvVHJhbnNpdC5qc1wiXG5pbXBvcnQgKiBhcyBQb2ludCBmcm9tIFwiLi9jb25zdGFudHMvUG9pbnQuanNcIlxuaW1wb3J0ICogYXMgQ29sb3JzIGZyb20gXCIuL2NvbnN0YW50cy9Db2xvcnMuanNcIlxuaW1wb3J0ICogYXMgQXNwZWN0cyBmcm9tIFwiLi9jb25zdGFudHMvQXNwZWN0cy5qc1wiXG5cbmNvbnN0IFNFVFRJTkdTID0gT2JqZWN0LmFzc2lnbih7fSwgVW5pdmVyc2UsIFJhZGl4LCBUcmFuc2l0LCBQb2ludCwgQ29sb3JzLCBBc3BlY3RzKTtcblxuZXhwb3J0IHtcbiAgU0VUVElOR1MgYXNcbiAgZGVmYXVsdFxufVxuIiwiLypcbiogQXNwZWN0cyB3cmFwcGVyIGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IGFzcGVjdHNcbiovXG5leHBvcnQgY29uc3QgQVNQRUNUU19JRCA9IFwiYXNwZWN0c1wiXG5cbi8qXG4qIERyYXcgYXNwZWN0cyBpbnRvIGNoYXJ0IGR1cmluZyByZW5kZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IERSQVdfQVNQRUNUUyA9IHRydWVcblxuLypcbiogRm9udCBzaXplIC0gYXNwZWN0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgQVNQRUNUU19GT05UX1NJWkUgPSAxOFxuXG4vKipcbiogRGVmYXVsdCBhc3BlY3RzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7QXJyYXl9XG4qL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfQVNQRUNUUyA9IFtcbiAge25hbWU6XCJDb25qdW5jdGlvblwiLCBhbmdsZTowLCBvcmI6Mn0sXG4gIHtuYW1lOlwiT3Bwb3NpdGlvblwiLCBhbmdsZToxODAsIG9yYjoyfSxcbiAge25hbWU6XCJUcmluZVwiLCBhbmdsZToxMjAsIG9yYjoyfSxcbiAge25hbWU6XCJTcXVhcmVcIiwgYW5nbGU6OTAsIG9yYjoyfVxuXVxuIiwiLyoqXG4qIENoYXJ0IGJhY2tncm91bmQgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNmZmZcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfQkFDS0dST1VORF9DT0xPUiA9IFwiI2ZmZlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0NJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIGxpbmVzIGluIGNoYXJ0c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzMzM1xuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9MSU5FX0NPTE9SID0gXCIjNjY2XCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2YgdGV4dCBpbiBjaGFydHMgLSBjdXNwcyBudW1iZXJcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVEVYVF9DT0xPUiA9IFwiI2JiYlwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIG1xaW4gYXhpcyAtIEFzLCBEcywgTWMsIEljXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX01BSU5fQVhJU19DT0xPUiA9IFwiIzAwMFwiO1xuXG4vKlxuKiBEZWZhdWx0IGNvbG9yIG9mIHNpZ25zIGluIGNoYXJ0cyAoYXJpc2Ugc3ltYm9sLCB0YXVydXMgc3ltYm9sLCAuLi4pXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMDAwXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX1NJR05TX0NPTE9SID0gXCIjMzMzXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3Igb2Ygc2lnbnMgaW4gY2hhcnRzIChhcmlzZSBzeW1ib2wsIHRhdXJ1cyBzeW1ib2wsIC4uLilcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMwMDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfUE9JTlRTX0NPTE9SID0gXCIjMDAwXCI7XG5cbi8qXG4qIERlZmF1bHQgY29sb3IgZm9yIHBvaW50IHByb3BlcnRpZXMgLSBhbmdsZSBpbiBzaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMzMzNcbiovXG5leHBvcnQgY29uc3QgUE9JTlRfUFJPUEVSVElFU19DT0xPUiA9IFwiIzMzM1wiXG5cbi8qXG4qIEFyaWVzIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0FSSUVTID0gXCIjRkY0NTAwXCI7XG5cbi8qXG4qIFRhdXJ1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9UQVVSVVMgPSBcIiM4QjQ1MTNcIjtcblxuLypcbiogR2VtaW55IGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjODdDRUVCXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0dFTUlOST0gXCIjODdDRUVCXCI7XG5cbi8qXG4qIENhbmNlciBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzI3QUU2MFxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9DQU5DRVIgPSBcIiMyN0FFNjBcIjtcblxuLypcbiogTGVvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjRkY0NTAwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0xFTyA9IFwiI0ZGNDUwMFwiO1xuXG4vKlxuKiBWaXJnbyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzhCNDUxM1xuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9WSVJHTyA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBMaWJyYSBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9MSUJSQSA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBTY29ycGlvIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMjdBRTYwXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX1NDT1JQSU8gPSBcIiMyN0FFNjBcIjtcblxuLypcbiogU2FnaXR0YXJpdXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICNGRjQ1MDBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfU0FHSVRUQVJJVVMgPSBcIiNGRjQ1MDBcIjtcblxuLypcbiogQ2Fwcmljb3JuIGNvbG9yXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjOEI0NTEzXG4qL1xuZXhwb3J0IGNvbnN0IENPTE9SX0NBUFJJQ09STiA9IFwiIzhCNDUxM1wiO1xuXG4vKlxuKiBBcXVhcml1cyBjb2xvclxuKiBAY29uc3RhbnRcbiogQHR5cGUge1N0cmluZ31cbiogQGRlZmF1bHQgIzg3Q0VFQlxuKi9cbmV4cG9ydCBjb25zdCBDT0xPUl9BUVVBUklVUyA9IFwiIzg3Q0VFQlwiO1xuXG4vKlxuKiBQaXNjZXMgY29sb3JcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0ICMyN0FFNjBcbiovXG5leHBvcnQgY29uc3QgQ09MT1JfUElTQ0VTID0gXCIjMjdBRTYwXCI7XG5cbi8qXG4qIENvbG9yIG9mIGNpcmNsZXMgaW4gY2hhcnRzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7U3RyaW5nfVxuKiBAZGVmYXVsdCAjMzMzXG4qL1xuZXhwb3J0IGNvbnN0IENJUkNMRV9DT0xPUiA9IFwiIzMzM1wiO1xuXG4vKlxuKiBDb2xvciBvZiBhc3BlY3RzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7T2JqZWN0fVxuKi9cbmV4cG9ydCBjb25zdCBBU1BFQ1RfQ09MT1JTID0ge1xuICBDb25qdW5jdGlvbjpcIiMzMzNcIixcbiAgT3Bwb3NpdGlvbjpcIiMxQjRGNzJcIixcbiAgU3F1YXJlOlwiIzY0MUUxNlwiLFxuICBUcmluZTpcIiMwQjUzNDVcIixcbiAgU2V4dGlsZTpcIiMzMzNcIixcbiAgUXVpbmN1bng6XCIjMzMzXCIsXG4gIFNlbWlzZXh0aWxlOlwiIzMzM1wiLFxuICBRdWludGlsZTpcIiMzMzNcIixcbiAgVHJpb2N0aWxlOlwiIzMzM1wiXG59XG4iLCIvKlxuKiBQb2ludCBwcm9wZXJ0aWUgLSBhbmdsZSBpbiBzaWduLCBkaWduaXRpZXMsIHJldHJvZ3JhZGVcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtCb29sZWFufVxuKiBAZGVmYXVsdCB0cnVlXG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfU0hPVyA9IHRydWVcblxuLypcbiogVGV4dCBzaXplIG9mIFBvaW50IGRlc2NyaXB0aW9uIC0gYW5nbGUgaW4gc2lnbiwgZGlnbml0aWVzLCByZXRyb2dyYWRlXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA2XG4qL1xuZXhwb3J0IGNvbnN0IFBPSU5UX1BST1BFUlRJRVNfRk9OVF9TSVpFID0gMTZcblxuLyoqXG4qIEEgcG9pbnQgY29sbGlzaW9uIHJhZGl1c1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMlxuKi9cbmV4cG9ydCBjb25zdCBQT0lOVF9DT0xMSVNJT05fUkFESVVTID0gMTJcbiIsIi8qXG4qIFJhZGl4IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHJhZGl4XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX0lEID0gXCJyYWRpeFwiXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDI3XG4qL1xuZXhwb3J0IGNvbnN0IFJBRElYX1BPSU5UU19GT05UX1NJWkUgPSAyN1xuXG4vKlxuKiBGb250IHNpemUgLSBzaWduc1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMjdcbiovXG5leHBvcnQgY29uc3QgUkFESVhfU0lHTlNfRk9OVF9TSVpFID0gMjdcblxuLypcbiogRm9udCBzaXplIC0gYXhpcyAoQXMsIERzLCBNYywgSWMpXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAyNFxuKi9cbmV4cG9ydCBjb25zdCBSQURJWF9BWElTX0ZPTlRfU0laRSA9IDMyXG4iLCIvKlxuKiBUcmFuc2l0IGNoYXJ0IGVsZW1lbnQgSURcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0IHRyYW5zaXRcbiovXG5leHBvcnQgY29uc3QgVFJBTlNJVF9JRCA9IFwidHJhbnNpdFwiXG5cbi8qXG4qIEZvbnQgc2l6ZSAtIHBvaW50cyAocGxhbmV0cylcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtOdW1iZXJ9XG4qIEBkZWZhdWx0IDMyXG4qL1xuZXhwb3J0IGNvbnN0IFRSQU5TSVRfUE9JTlRTX0ZPTlRfU0laRSA9IDI3XG4iLCIvKipcbiogQ2hhcnQgcGFkZGluZ1xuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMTBweFxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9QQURESU5HID0gNDBcblxuLyoqXG4qIFNWRyB2aWV3Qm94IHdpZHRoXG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9XSURUSCA9IDgwMFxuXG4vKipcbiogU1ZHIHZpZXdCb3ggaGVpZ2h0XG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0F0dHJpYnV0ZS92aWV3Qm94XG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCA4MDBcbiovXG5leHBvcnQgY29uc3QgQ0hBUlRfVklFV0JPWF9IRUlHSFQgPSA4MDBcblxuLypcbiogTGluZSBzdHJlbmd0aFxuKiBAY29uc3RhbnRcbiogQHR5cGUge051bWJlcn1cbiogQGRlZmF1bHQgMVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0UgPSAxXG5cbi8qXG4qIExpbmUgc3RyZW5ndGggb2YgdGhlIG1haW4gbGluZXMuIEZvciBpbnN0YW5jZSBwb2ludHMsIG1haW4gYXhpcywgbWFpbiBjaXJjbGVzXG4qIEBjb25zdGFudFxuKiBAdHlwZSB7TnVtYmVyfVxuKiBAZGVmYXVsdCAxXG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX01BSU5fU1RST0tFID0gMlxuXG4vKipcbiogTm8gZmlsbCwgb25seSBzdHJva2VcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtib29sZWFufVxuKiBAZGVmYXVsdCBmYWxzZVxuKi9cbmV4cG9ydCBjb25zdCBDSEFSVF9TVFJPS0VfT05MWSA9IGZhbHNlO1xuXG4vKipcbiogRm9udCBmYW1pbHlcbiogQGNvbnN0YW50XG4qIEB0eXBlIHtTdHJpbmd9XG4qIEBkZWZhdWx0XG4qL1xuZXhwb3J0IGNvbnN0IENIQVJUX0ZPTlRfRkFNSUxZID0gXCJBc3Ryb25vbWljb25cIjtcbiIsImltcG9ydCBEZWZhdWx0U2V0dGluZ3MgZnJvbSAnLi4vc2V0dGluZ3MvRGVmYXVsdFNldHRpbmdzLmpzJztcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuLi91dGlscy9TVkdVdGlscy5qcyc7XG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vdXRpbHMvVXRpbHMuanMnO1xuaW1wb3J0IFJhZGl4Q2hhcnQgZnJvbSAnLi4vY2hhcnRzL1JhZGl4Q2hhcnQuanMnO1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuLi9jaGFydHMvVHJhbnNpdENoYXJ0LmpzJztcblxuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBbiB3cmFwcGVyIGZvciBhbGwgcGFydHMgb2YgZ3JhcGguXG4gKiBAcHVibGljXG4gKi9cbmNsYXNzIFVuaXZlcnNlIHtcblxuICAjU1ZHRG9jdW1lbnRcbiAgI3NldHRpbmdzXG4gICNyYWRpeFxuICAjdHJhbnNpdFxuICAjYXNwZWN0c1dyYXBwZXJcblxuICAvKipcbiAgICogQGNvbnN0cnVjdHNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGh0bWxFbGVtZW50SUQgLSBJRCBvZiB0aGUgcm9vdCBlbGVtZW50IHdpdGhvdXQgdGhlICMgc2lnblxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gQW4gb2JqZWN0IHRoYXQgb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IHNldHRpbmdzIHZhbHVlc1xuICAgKi9cbiAgY29uc3RydWN0b3IoaHRtbEVsZW1lbnRJRCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgICBpZiAodHlwZW9mIGh0bWxFbGVtZW50SUQgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgcmVxdWlyZWQgcGFyYW1ldGVyIGlzIG1pc3NpbmcuJylcbiAgICB9XG5cbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGh0bWxFbGVtZW50SUQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm90IGZpbmQgYSBIVE1MIGVsZW1lbnQgd2l0aCBJRCAnICsgaHRtbEVsZW1lbnRJRClcbiAgICB9XG5cbiAgICB0aGlzLiNzZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRTZXR0aW5ncywgb3B0aW9ucywge1xuICAgICAgSFRNTF9FTEVNRU5UX0lEOiBodG1sRWxlbWVudElEXG4gICAgfSk7XG4gICAgdGhpcy4jU1ZHRG9jdW1lbnQgPSBTVkdVdGlscy5TVkdEb2N1bWVudCh0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX1dJRFRILCB0aGlzLiNzZXR0aW5ncy5DSEFSVF9WSUVXQk9YX0hFSUdIVClcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChodG1sRWxlbWVudElEKS5hcHBlbmRDaGlsZCh0aGlzLiNTVkdEb2N1bWVudCk7XG5cbiAgICAvLyBjcmVhdGUgd3JhcHBlciBmb3IgYXNwZWN0c1xuICAgIHRoaXMuI2FzcGVjdHNXcmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuICAgIHRoaXMuI2FzcGVjdHNXcmFwcGVyLnNldEF0dHJpYnV0ZShcImlkXCIsIGAke3RoaXMuI3NldHRpbmdzLkhUTUxfRUxFTUVOVF9JRH0tJHt0aGlzLiNzZXR0aW5ncy5BU1BFQ1RTX0lEfWApXG4gICAgdGhpcy4jU1ZHRG9jdW1lbnQuYXBwZW5kQ2hpbGQodGhpcy4jYXNwZWN0c1dyYXBwZXIpXG5cbiAgICB0aGlzLiNyYWRpeCA9IG5ldyBSYWRpeENoYXJ0KHRoaXMpXG4gICAgdGhpcy4jdHJhbnNpdCA9IG5ldyBUcmFuc2l0Q2hhcnQodGhpcy4jcmFkaXgpXG5cbiAgICB0aGlzLiNsb2FkRm9udChcIkFzdHJvbm9taWNvblwiLCAnLi4vYXNzZXRzL2ZvbnRzL3R0Zi9Bc3Ryb25vbWljb25Gb250c18xLjEvQXN0cm9ub21pY29uLnR0ZicpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gIyMgUFVCTElDICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qKlxuICAgKiBHZXQgUmFkaXggY2hhcnRcbiAgICogQHJldHVybiB7UmFkaXhDaGFydH1cbiAgICovXG4gIHJhZGl4KCkge1xuICAgIHJldHVybiB0aGlzLiNyYWRpeFxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBUcmFuc2l0IGNoYXJ0XG4gICAqIEByZXR1cm4ge1RyYW5zaXRDaGFydH1cbiAgICovXG4gIHRyYW5zaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RyYW5zaXRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgY3VycmVudCBzZXR0aW5nc1xuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBnZXRTZXR0aW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy4jc2V0dGluZ3NcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgcm9vdCBTVkcgZG9jdW1lbnRcbiAgICogQHJldHVybiB7U1ZHRG9jdW1lbnR9XG4gICAqL1xuICBnZXRTVkdEb2N1bWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jU1ZHRG9jdW1lbnRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZW1wdHkgYXNwZWN0cyB3cmFwcGVyIGVsZW1lbnRcbiAgICogQHJldHVybiB7U1ZHR3JvdXBFbGVtZW50fVxuICAgKi9cbiAgZ2V0QXNwZWN0c0VsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2FzcGVjdHNXcmFwcGVyXG4gIH1cblxuICAvLyAjIyBQUklWQVRFICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gIC8qXG4gICogTG9hZCBmb25kIHRvIERPTVxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IGZhbWlseVxuICAqIEBwYXJhbSB7U3RyaW5nfSBzb3VyY2VcbiAgKiBAcGFyYW0ge09iamVjdH1cbiAgKlxuICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ZvbnRGYWNlL0ZvbnRGYWNlXG4gICovXG4gIGFzeW5jICNsb2FkRm9udCggZmFtaWx5LCBzb3VyY2UsIGRlc2NyaXB0b3JzICl7XG5cbiAgICBpZiAoISgnRm9udEZhY2UnIGluIHdpbmRvdykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJPb29wcywgRm9udEZhY2UgaXMgbm90IGEgZnVuY3Rpb24uXCIpXG4gICAgICBjb25zb2xlLmVycm9yKFwiQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ1NTX0ZvbnRfTG9hZGluZ19BUElcIilcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGZvbnQgPSBuZXcgRm9udEZhY2UoZmFtaWx5LCBgdXJsKCR7c291cmNlfSlgLCBkZXNjcmlwdG9ycylcblxuICAgIHRyeXtcbiAgICAgIGF3YWl0IGZvbnQubG9hZCgpO1xuICAgICAgZG9jdW1lbnQuZm9udHMuYWRkKGZvbnQpXG4gICAgfWNhdGNoKGUpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGUpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFVuaXZlcnNlIGFzXG4gIGRlZmF1bHRcbn1cbiIsImltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzLmpzJ1xuaW1wb3J0IFNWR1V0aWxzIGZyb20gJy4vU1ZHVXRpbHMuanMnO1xuXG4vKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBVdGlsaXR5IGNsYXNzXG4gKiBAcHVibGljXG4gKiBAc3RhdGljXG4gKiBAaGlkZWNvbnN0cnVjdG9yXG4gKi9cbmNsYXNzIEFzcGVjdFV0aWxzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEFzcGVjdFV0aWxzKSB7XG4gICAgICB0aHJvdyBFcnJvcignVGhpcyBpcyBhIHN0YXRpYyBjbGFzcyBhbmQgY2Fubm90IGJlIGluc3RhbnRpYXRlZC4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgb3JiaXQgb2YgdHdvIGFuZ2xlcyBvbiBhIGNpcmNsZVxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZnJvbUFuZ2xlIC0gYW5nbGUgaW4gZGVncmVlLCBwb2ludCBvbiB0aGUgY2lyY2xlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0b0FuZ2xlIC0gYW5nbGUgaW4gZGVncmVlLCBwb2ludCBvbiB0aGUgY2lyY2xlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhc3BlY3RBbmdsZSAtIDYwLDkwLDEyMCwgLi4uXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn0gb3JiXG4gICAqL1xuICBzdGF0aWMgb3JiKGZyb21BbmdsZSwgdG9BbmdsZSwgYXNwZWN0QW5nbGUpIHtcbiAgICBsZXQgb3JiXG4gICAgbGV0IHNpZ24gPSBmcm9tQW5nbGUgPiB0b0FuZ2xlID8gMSA6IC0xXG4gICAgbGV0IGRpZmZlcmVuY2UgPSBNYXRoLmFicyhmcm9tQW5nbGUgLSB0b0FuZ2xlKVxuXG4gICAgaWYgKGRpZmZlcmVuY2UgPiBVdGlscy5ERUdfMTgwKSB7XG4gICAgICBkaWZmZXJlbmNlID0gVXRpbHMuREVHXzM2MCAtIGRpZmZlcmVuY2U7XG4gICAgICBvcmIgPSAoZGlmZmVyZW5jZSAtIGFzcGVjdEFuZ2xlKSAqIC0xXG5cbiAgICB9IGVsc2Uge1xuICAgICAgb3JiID0gKGRpZmZlcmVuY2UgLSBhc3BlY3RBbmdsZSkgKiBzaWduXG4gICAgfVxuXG4gICAgcmV0dXJuIE51bWJlcihOdW1iZXIob3JiKS50b0ZpeGVkKDIpKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhc3BlY3RzXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZnJvbVBvaW50cyAtIFt7bmFtZTpcIk1vb25cIiwgYW5nbGU6MH0sIHtuYW1lOlwiU3VuXCIsIGFuZ2xlOjE3OX0sIHtuYW1lOlwiTWVyY3VyeVwiLCBhbmdsZToxMjF9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHRvUG9pbnRzIC0gW3tuYW1lOlwiQVNcIiwgYW5nbGU6MH0sIHtuYW1lOlwiSUNcIiwgYW5nbGU6OTB9XVxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGFzcGVjdHMgLSBbe25hbWU6XCJPcHBvc2l0aW9uXCIsIGFuZ2xlOjE4MCwgb3JiOjJ9LCB7bmFtZTpcIlRyaW5lXCIsIGFuZ2xlOjEyMCwgb3JiOjJ9XVxuICAgKlxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxuICAgKi9cbiAgc3RhdGljIGdldEFzcGVjdHMoZnJvbVBvaW50cywgdG9Qb2ludHMsIGFzcGVjdHMpe1xuICAgIGNvbnN0IGFzcGVjdExpc3QgPSBbXVxuICAgIGZvciAoY29uc3QgZnJvbVAgb2YgZnJvbVBvaW50cyl7XG4gICAgICBmb3IgKGNvbnN0IHRvUCBvZiB0b1BvaW50cyl7XG4gICAgICAgIGZvciAoY29uc3QgYXNwZWN0IG9mIGFzcGVjdHMpe1xuICAgICAgICAgIGNvbnN0IG9yYiA9IEFzcGVjdFV0aWxzLm9yYihmcm9tUC5hbmdsZSwgdG9QLmFuZ2xlLCBhc3BlY3QuYW5nbGUpXG4gICAgICAgICAgaWYoIE1hdGguYWJzKCBvcmIgKSA8PSAgYXNwZWN0Lm9yYiApe1xuICAgICAgICAgICAgYXNwZWN0TGlzdC5wdXNoKCB7IGFzcGVjdDphc3BlY3QsIGZyb206ZnJvbVAsIHRvOnRvUCwgcHJlY2lzaW9uOm9yYiB9IClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXNwZWN0TGlzdFxuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgYXNwZWN0c1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhc2NlbmRhbnRTaGlmdFxuICAgKiBAcGFyYW0ge09iamVjdH0gc2V0dGluZ3NcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBhc3BlY3RzTGlzdFxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgZHJhd0FzcGVjdHMocmFkaXVzLCBhc2NlbmRhbnRTaGlmdCwgc2V0dGluZ3MsIGFzcGVjdHNMaXN0KXtcbiAgICBjb25zdCBjZW50ZXJYID0gc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9XSURUSCAvIDJcbiAgICBjb25zdCBjZW50ZXJZID0gc2V0dGluZ3MuQ0hBUlRfVklFV0JPWF9IRUlHSFQgLyAyXG5cbiAgICBjb25zdCB3cmFwcGVyID0gU1ZHVXRpbHMuU1ZHR3JvdXAoKVxuXG4gICAgZm9yKGNvbnN0IGFzcCBvZiBhc3BlY3RzTGlzdCl7XG5cbiAgICAgICAgLy8gYXNwZWN0IGFzIHNvbGlkIGxpbmVcbiAgICAgICAgY29uc3QgZnJvbVBvaW50ID0gVXRpbHMucG9zaXRpb25PbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIFV0aWxzLmRlZ3JlZVRvUmFkaWFuKGFzcC5mcm9tLmFuZ2xlLCBhc2NlbmRhbnRTaGlmdCkpXG4gICAgICAgIGNvbnN0IHRvUG9pbnQgPSBVdGlscy5wb3NpdGlvbk9uQ2lyY2xlKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgVXRpbHMuZGVncmVlVG9SYWRpYW4oYXNwLnRvLmFuZ2xlLCBhc2NlbmRhbnRTaGlmdCkpXG5cbiAgICAgICAgLy8gZHJhdyBzeW1ib2wgaW4gY2VudGVyIG9mIGFzcGVjdFxuICAgICAgICBjb25zdCBsaW5lQ2VudGVyWCA9IChmcm9tUG9pbnQueCArICB0b1BvaW50LngpIC8gMlxuICAgICAgICBjb25zdCBsaW5lQ2VudGVyWSA9IChmcm9tUG9pbnQueSArICB0b1BvaW50LnkpIC8gMlxuICAgICAgICBjb25zdCBzeW1ib2wgPSBTVkdVdGlscy5TVkdTeW1ib2woYXNwLmFzcGVjdC5uYW1lLCBsaW5lQ2VudGVyWCwgbGluZUNlbnRlclkpXG4gICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LWZhbWlseVwiLCBzZXR0aW5ncy5DSEFSVF9GT05UX0ZBTUlMWSk7XG4gICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKSAvLyBzdGFydCwgbWlkZGxlLCBlbmRcbiAgICAgICAgc3ltYm9sLnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpXG4gICAgICAgIHN5bWJvbC5zZXRBdHRyaWJ1dGUoXCJmb250LXNpemVcIiwgc2V0dGluZ3MuQVNQRUNUU19GT05UX1NJWkUpO1xuICAgICAgICBzeW1ib2wuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xuXG4gICAgICAgIC8vIHNwYWNlIGZvciBzeW1ib2wgKGZyb21Qb2ludCAtIGNlbnRlcilcbiAgICAgICAgY29uc3QgZnJvbVBvaW50U3BhY2VYID0gZnJvbVBvaW50LnggKyAoIHRvUG9pbnQueCAtIGZyb21Qb2ludC54ICkgLyAyLjJcbiAgICAgICAgY29uc3QgZnJvbVBvaW50U3BhY2VZID0gZnJvbVBvaW50LnkgKyAoIHRvUG9pbnQueSAtIGZyb21Qb2ludC55ICkgLyAyLjJcblxuICAgICAgICAvLyBzcGFjZSBmb3Igc3ltYm9sIChjZW50ZXIgLSB0b1BvaW50KVxuICAgICAgICBjb25zdCB0b1BvaW50U3BhY2VYID0gdG9Qb2ludC54ICsgKCBmcm9tUG9pbnQueCAtIHRvUG9pbnQueCApIC8gMi4yXG4gICAgICAgIGNvbnN0IHRvUG9pbnRTcGFjZVkgPSB0b1BvaW50LnkgKyAoIGZyb21Qb2ludC55IC0gdG9Qb2ludC55ICkgLyAyLjJcblxuICAgICAgICAvLyBsaW5lOiBmcm9tUG9pbnQgLSBjZW50ZXJcbiAgICAgICAgY29uc3QgbGluZTEgPSBTVkdVdGlscy5TVkdMaW5lKGZyb21Qb2ludC54LCBmcm9tUG9pbnQueSwgZnJvbVBvaW50U3BhY2VYLCBmcm9tUG9pbnRTcGFjZVkpXG4gICAgICAgIGxpbmUxLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBzZXR0aW5ncy5BU1BFQ1RfQ09MT1JTW2FzcC5hc3BlY3QubmFtZV0gPz8gXCIjMzMzXCIpO1xuICAgICAgICBsaW5lMS5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgc2V0dGluZ3MuQ0hBUlRfU1RST0tFKTtcblxuICAgICAgICAvLyBsaW5lOiBjZW50ZXIgLSB0b1BvaW50XG4gICAgICAgIGNvbnN0IGxpbmUyID0gU1ZHVXRpbHMuU1ZHTGluZSh0b1BvaW50U3BhY2VYLCB0b1BvaW50U3BhY2VZLCB0b1BvaW50LngsIHRvUG9pbnQueSlcbiAgICAgICAgbGluZTIuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIHNldHRpbmdzLkFTUEVDVF9DT0xPUlNbYXNwLmFzcGVjdC5uYW1lXSA/PyBcIiMzMzNcIik7XG4gICAgICAgIGxpbmUyLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBzZXR0aW5ncy5DSEFSVF9TVFJPS0UpO1xuXG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQobGluZTEpO1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGxpbmUyKTtcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChzeW1ib2wpO1xuICAgIH1cblxuICAgIHJldHVybiB3cmFwcGVyXG4gIH1cblxufVxuXG5leHBvcnQge1xuICBBc3BlY3RVdGlscyBhc1xuICBkZWZhdWx0XG59XG4iLCIvKipcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBTVkcgdXRpbGl0eSBjbGFzc1xuICogQHB1YmxpY1xuICogQHN0YXRpY1xuICogQGhpZGVjb25zdHJ1Y3RvclxuICovXG5jbGFzcyBTVkdVdGlscyB7XG5cbiAgc3RhdGljIFNWR19OQU1FU1BBQ0UgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcblxuICBzdGF0aWMgU1lNQk9MX0FSSUVTID0gXCJBcmllc1wiO1xuICBzdGF0aWMgU1lNQk9MX1RBVVJVUyA9IFwiVGF1cnVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfR0VNSU5JID0gXCJHZW1pbmlcIjtcbiAgc3RhdGljIFNZTUJPTF9DQU5DRVIgPSBcIkNhbmNlclwiO1xuICBzdGF0aWMgU1lNQk9MX0xFTyA9IFwiTGVvXCI7XG4gIHN0YXRpYyBTWU1CT0xfVklSR08gPSBcIlZpcmdvXCI7XG4gIHN0YXRpYyBTWU1CT0xfTElCUkEgPSBcIkxpYnJhXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0NPUlBJTyA9IFwiU2NvcnBpb1wiO1xuICBzdGF0aWMgU1lNQk9MX1NBR0lUVEFSSVVTID0gXCJTYWdpdHRhcml1c1wiO1xuICBzdGF0aWMgU1lNQk9MX0NBUFJJQ09STiA9IFwiQ2Fwcmljb3JuXCI7XG4gIHN0YXRpYyBTWU1CT0xfQVFVQVJJVVMgPSBcIkFxdWFyaXVzXCI7XG4gIHN0YXRpYyBTWU1CT0xfUElTQ0VTID0gXCJQaXNjZXNcIjtcblxuICBzdGF0aWMgU1lNQk9MX1NVTiA9IFwiU3VuXCI7XG4gIHN0YXRpYyBTWU1CT0xfTU9PTiA9IFwiTW9vblwiO1xuICBzdGF0aWMgU1lNQk9MX01FUkNVUlkgPSBcIk1lcmN1cnlcIjtcbiAgc3RhdGljIFNZTUJPTF9WRU5VUyA9IFwiVmVudXNcIjtcbiAgc3RhdGljIFNZTUJPTF9FQVJUSCA9IFwiRWFydGhcIjtcbiAgc3RhdGljIFNZTUJPTF9NQVJTID0gXCJNYXJzXCI7XG4gIHN0YXRpYyBTWU1CT0xfSlVQSVRFUiA9IFwiSnVwaXRlclwiO1xuICBzdGF0aWMgU1lNQk9MX1NBVFVSTiA9IFwiU2F0dXJuXCI7XG4gIHN0YXRpYyBTWU1CT0xfVVJBTlVTID0gXCJVcmFudXNcIjtcbiAgc3RhdGljIFNZTUJPTF9ORVBUVU5FID0gXCJOZXB0dW5lXCI7XG4gIHN0YXRpYyBTWU1CT0xfUExVVE8gPSBcIlBsdXRvXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0hJUk9OID0gXCJDaGlyb25cIjtcbiAgc3RhdGljIFNZTUJPTF9MSUxJVEggPSBcIkxpbGl0aFwiO1xuICBzdGF0aWMgU1lNQk9MX05OT0RFID0gXCJOTm9kZVwiO1xuICBzdGF0aWMgU1lNQk9MX1NOT0RFID0gXCJTTm9kZVwiO1xuXG4gIHN0YXRpYyBTWU1CT0xfQVMgPSBcIkFzXCI7XG4gIHN0YXRpYyBTWU1CT0xfRFMgPSBcIkRzXCI7XG4gIHN0YXRpYyBTWU1CT0xfTUMgPSBcIk1jXCI7XG4gIHN0YXRpYyBTWU1CT0xfSUMgPSBcIkljXCI7XG5cbiAgc3RhdGljIFNZTUJPTF9SRVRST0dSQURFID0gXCJSZXRyb2dyYWRlXCJcblxuICBzdGF0aWMgU1lNQk9MX0NPTkpVTkNUSU9OID0gXCJDb25qdW5jdGlvblwiO1xuICBzdGF0aWMgU1lNQk9MX09QUE9TSVRJT04gPSBcIk9wcG9zaXRpb25cIjtcbiAgc3RhdGljIFNZTUJPTF9TUVVBUkUgPSBcIlNxdWFyZVwiO1xuICBzdGF0aWMgU1lNQk9MX1RSSU5FID0gXCJUcmluZVwiO1xuICBzdGF0aWMgU1lNQk9MX1NFWFRJTEUgPSBcIlNleHRpbGVcIjtcbiAgc3RhdGljIFNZTUJPTF9RVUlOQ1VOWCA9IFwiUXVpbmN1bnhcIjtcbiAgc3RhdGljIFNZTUJPTF9TRU1JU0VYVElMRSA9IFwiU2VtaXNleHRpbGVcIjtcbiAgc3RhdGljIFNZTUJPTF9PQ1RJTEUgPSBcIk9jdGlsZVwiO1xuICBzdGF0aWMgU1lNQk9MX1RSSU9DVElMRSA9IFwiVHJpb2N0aWxlXCI7XG5cbiAgLy8gQXN0cm9ub21pY29uIGZvbnQgY29kZXNcbiAgc3RhdGljIFNZTUJPTF9BUklFU19DT0RFID0gXCJBXCI7XG4gIHN0YXRpYyBTWU1CT0xfVEFVUlVTX0NPREUgPSBcIkJcIjtcbiAgc3RhdGljIFNZTUJPTF9HRU1JTklfQ09ERSA9IFwiQ1wiO1xuICBzdGF0aWMgU1lNQk9MX0NBTkNFUl9DT0RFID0gXCJEXCI7XG4gIHN0YXRpYyBTWU1CT0xfTEVPX0NPREUgPSBcIkVcIjtcbiAgc3RhdGljIFNZTUJPTF9WSVJHT19DT0RFID0gXCJGXCI7XG4gIHN0YXRpYyBTWU1CT0xfTElCUkFfQ09ERSA9IFwiR1wiO1xuICBzdGF0aWMgU1lNQk9MX1NDT1JQSU9fQ09ERSA9IFwiSFwiO1xuICBzdGF0aWMgU1lNQk9MX1NBR0lUVEFSSVVTX0NPREUgPSBcIklcIjtcbiAgc3RhdGljIFNZTUJPTF9DQVBSSUNPUk5fQ09ERSA9IFwiSlwiO1xuICBzdGF0aWMgU1lNQk9MX0FRVUFSSVVTX0NPREUgPSBcIktcIjtcbiAgc3RhdGljIFNZTUJPTF9QSVNDRVNfQ09ERSA9IFwiTFwiO1xuXG4gIHN0YXRpYyBTWU1CT0xfU1VOX0NPREUgPSBcIlFcIjtcbiAgc3RhdGljIFNZTUJPTF9NT09OX0NPREUgPSBcIlJcIjtcbiAgc3RhdGljIFNZTUJPTF9NRVJDVVJZX0NPREUgPSBcIlNcIjtcbiAgc3RhdGljIFNZTUJPTF9WRU5VU19DT0RFID0gXCJUXCI7XG4gIHN0YXRpYyBTWU1CT0xfRUFSVEhfQ09ERSA9IFwiPlwiO1xuICBzdGF0aWMgU1lNQk9MX01BUlNfQ09ERSA9IFwiVVwiO1xuICBzdGF0aWMgU1lNQk9MX0pVUElURVJfQ09ERSA9IFwiVlwiO1xuICBzdGF0aWMgU1lNQk9MX1NBVFVSTl9DT0RFID0gXCJXXCI7XG4gIHN0YXRpYyBTWU1CT0xfVVJBTlVTX0NPREUgPSBcIlhcIjtcbiAgc3RhdGljIFNZTUJPTF9ORVBUVU5FX0NPREUgPSBcIllcIjtcbiAgc3RhdGljIFNZTUJPTF9QTFVUT19DT0RFID0gXCJaXCI7XG4gIHN0YXRpYyBTWU1CT0xfQ0hJUk9OX0NPREUgPSBcInFcIjtcbiAgc3RhdGljIFNZTUJPTF9MSUxJVEhfQ09ERSA9IFwielwiO1xuICBzdGF0aWMgU1lNQk9MX05OT0RFX0NPREUgPSBcImdcIjtcbiAgc3RhdGljIFNZTUJPTF9TTk9ERV9DT0RFID0gXCJpXCI7XG5cbiAgc3RhdGljIFNZTUJPTF9BU19DT0RFID0gXCJjXCI7XG4gIHN0YXRpYyBTWU1CT0xfRFNfQ09ERSA9IFwiZlwiO1xuICBzdGF0aWMgU1lNQk9MX01DX0NPREUgPSBcImRcIjtcbiAgc3RhdGljIFNZTUJPTF9JQ19DT0RFID0gXCJlXCI7XG5cbiAgc3RhdGljIFNZTUJPTF9SRVRST0dSQURFX0NPREUgPSBcIk1cIlxuXG4gIHN0YXRpYyBTWU1CT0xfQ09OSlVOQ1RJT05fQ09ERSA9IFwiIVwiO1xuICBzdGF0aWMgU1lNQk9MX09QUE9TSVRJT05fQ09ERSA9ICdcIic7XG4gIHN0YXRpYyBTWU1CT0xfU1FVQVJFX0NPREUgPSBcIiNcIjtcbiAgc3RhdGljIFNZTUJPTF9UUklORV9DT0RFID0gXCIkXCI7XG4gIHN0YXRpYyBTWU1CT0xfU0VYVElMRV9DT0RFID0gXCIlXCI7XG4gIHN0YXRpYyBTWU1CT0xfUVVJTkNVTlhfQ09ERSA9IFwiJlwiO1xuICBzdGF0aWMgU1lNQk9MX1NFTUlTRVhUSUxFX0NPREUgPSBcIicnXCI7XG4gIHN0YXRpYyBTWU1CT0xfT0NUSUxFX0NPREUgPSBcIihcIjtcbiAgc3RhdGljIFNZTUJPTF9UUklPQ1RJTEVfQ09ERSA9IFwiKVwiO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgU1ZHVXRpbHMpIHtcbiAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgZG9jdW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdEb2N1bWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdEb2N1bWVudCh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwic3ZnXCIpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgndmVyc2lvbicsIFwiMS4xXCIpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBcIjAgMCBcIiArIHdpZHRoICsgXCIgXCIgKyBoZWlnaHQpO1xuICAgIHJldHVybiBzdmdcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBTVkcgZ3JvdXAgZWxlbWVudFxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEByZXR1cm4ge1NWR0dyb3VwRWxlbWVudH1cbiAgICovXG4gIHN0YXRpYyBTVkdHcm91cCgpIHtcbiAgICBjb25zdCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwiZ1wiKTtcbiAgICByZXR1cm4gZ1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBwYXRoIGVsZW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJuIHtTVkdHcm91cEVsZW1lbnR9XG4gICAqL1xuICBzdGF0aWMgU1ZHUGF0aCgpIHtcbiAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwicGF0aFwiKTtcbiAgICByZXR1cm4gcGF0aFxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIFNWRyBtYXNrIGVsZW1lbnRcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudElEXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR01hc2tFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR01hc2soZWxlbWVudElEKSB7XG4gICAgY29uc3QgbWFzayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcIm1hc2tcIik7XG4gICAgbWFzay5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBlbGVtZW50SUQpXG4gICAgcmV0dXJuIG1hc2tcbiAgfVxuXG4gIC8qKlxuICAgKiBTVkcgY2lyY3VsYXIgc2VjdG9yXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtIHtpbnR9IHggLSBjaXJjbGUgeCBjZW50ZXIgcG9zaXRpb25cbiAgICogQHBhcmFtIHtpbnR9IHkgLSBjaXJjbGUgeSBjZW50ZXIgcG9zaXRpb25cbiAgICogQHBhcmFtIHtpbnR9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXMgaW4gcHhcbiAgICogQHBhcmFtIHtpbnR9IGExIC0gYW5nbGVGcm9tIGluIHJhZGlhbnNcbiAgICogQHBhcmFtIHtpbnR9IGEyIC0gYW5nbGVUbyBpbiByYWRpYW5zXG4gICAqIEBwYXJhbSB7aW50fSB0aGlja25lc3MgLSBmcm9tIG91dHNpZGUgdG8gY2VudGVyIGluIHB4XG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IHNlZ21lbnRcbiAgICovXG4gIHN0YXRpYyBTVkdTZWdtZW50KHgsIHksIHJhZGl1cywgYTEsIGEyLCB0aGlja25lc3MsIGxGbGFnLCBzRmxhZykge1xuICAgIC8vIEBzZWUgU1ZHIFBhdGggYXJjOiBodHRwczovL3d3dy53My5vcmcvVFIvU1ZHL3BhdGhzLmh0bWwjUGF0aERhdGFcbiAgICBjb25zdCBMQVJHRV9BUkNfRkxBRyA9IGxGbGFnIHx8IDA7XG4gICAgY29uc3QgU1dFRVRfRkxBRyA9IHNGbGFnIHx8IDA7XG5cbiAgICBjb25zdCBzZWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwicGF0aFwiKTtcbiAgICBzZWdtZW50LnNldEF0dHJpYnV0ZShcImRcIiwgXCJNIFwiICsgKHggKyB0aGlja25lc3MgKiBNYXRoLmNvcyhhMSkpICsgXCIsIFwiICsgKHkgKyB0aGlja25lc3MgKiBNYXRoLnNpbihhMSkpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoKHJhZGl1cyAtIHRoaWNrbmVzcykgKiBNYXRoLnNpbihhMSkpICsgXCIgQSBcIiArIHJhZGl1cyArIFwiLCBcIiArIHJhZGl1cyArIFwiLDAgLFwiICsgTEFSR0VfQVJDX0ZMQUcgKyBcIiwgXCIgKyBTV0VFVF9GTEFHICsgXCIsIFwiICsgKHggKyByYWRpdXMgKiBNYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKHkgKyByYWRpdXMgKiBNYXRoLnNpbihhMikpICsgXCIgbCBcIiArICgocmFkaXVzIC0gdGhpY2tuZXNzKSAqIC1NYXRoLmNvcyhhMikpICsgXCIsIFwiICsgKChyYWRpdXMgLSB0aGlja25lc3MpICogLU1hdGguc2luKGEyKSkgKyBcIiBBIFwiICsgdGhpY2tuZXNzICsgXCIsIFwiICsgdGhpY2tuZXNzICsgXCIsMCAsXCIgKyBMQVJHRV9BUkNfRkxBRyArIFwiLCBcIiArIDEgKyBcIiwgXCIgKyAoeCArIHRoaWNrbmVzcyAqIE1hdGguY29zKGExKSkgKyBcIiwgXCIgKyAoeSArIHRoaWNrbmVzcyAqIE1hdGguc2luKGExKSkpO1xuICAgIHNlZ21lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgcmV0dXJuIHNlZ21lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU1ZHIGNpcmNsZVxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSB7aW50fSBjeFxuICAgKiBAcGFyYW0ge2ludH0gY3lcbiAgICogQHBhcmFtIHtpbnR9IHJhZGl1c1xuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBjaXJjbGVcbiAgICovXG4gIHN0YXRpYyBTVkdDaXJjbGUoY3gsIGN5LCByYWRpdXMpIHtcbiAgICBjb25zdCBjaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHVXRpbHMuU1ZHX05BTUVTUEFDRSwgXCJjaXJjbGVcIik7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN4XCIsIGN4KTtcbiAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3lcIiwgY3kpO1xuICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJyXCIsIHJhZGl1cyk7XG4gICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJub25lXCIpO1xuICAgIHJldHVybiBjaXJjbGU7XG4gIH1cblxuICAvKipcbiAgICogU1ZHIGxpbmVcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MlxuICAgKiBAcGFyYW0ge051bWJlcn0geDJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAqXG4gICAqIEByZXR1cm4ge1NWR0VsZW1lbnR9IGxpbmVcbiAgICovXG4gIHN0YXRpYyBTVkdMaW5lKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhTVkdVdGlscy5TVkdfTkFNRVNQQUNFLCBcImxpbmVcIik7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MVwiLCB4MSk7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MVwiLCB5MSk7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ4MlwiLCB4Mik7XG4gICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MlwiLCB5Mik7XG4gICAgcmV0dXJuIGxpbmU7XG4gIH1cblxuICAvKipcbiAgICogU1ZHIHRleHRcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAgICogQHBhcmFtIHtTdHJpbmd9IHR4dFxuICAgKiBAcGFyYW0ge051bWJlcn0gW3NjYWxlXVxuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fSBsaW5lXG4gICAqL1xuICBzdGF0aWMgU1ZHVGV4dCh4LCB5LCB0eHQpIHtcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFNWR1V0aWxzLlNWR19OQU1FU1BBQ0UsIFwidGV4dFwiKTtcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInhcIiwgeCk7XG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIHkpO1xuICAgIHRleHQuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwibm9uZVwiKTtcbiAgICB0ZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCkpO1xuXG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICAvKipcbiAgICogU1ZHIHN5bWJvbFxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge051bWJlcn0geFBvc1xuICAgKiBAcGFyYW0ge051bWJlcn0geVBvc1xuICAgKlxuICAgKiBAcmV0dXJuIHtTVkdFbGVtZW50fVxuICAgKi9cbiAgc3RhdGljIFNWR1N5bWJvbChuYW1lLCB4UG9zLCB5UG9zKSB7XG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUzpcbiAgICAgICAgcmV0dXJuIGFzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfRFM6XG4gICAgICAgIHJldHVybiBkc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01DOlxuICAgICAgICByZXR1cm4gbWNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9JQzpcbiAgICAgICAgcmV0dXJuIGljU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUklFUzpcbiAgICAgICAgcmV0dXJuIGFyaWVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVEFVUlVTOlxuICAgICAgICByZXR1cm4gdGF1cnVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfR0VNSU5JOlxuICAgICAgICByZXR1cm4gZ2VtaW5pU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSOlxuICAgICAgICByZXR1cm4gY2FuY2VyU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTEVPOlxuICAgICAgICByZXR1cm4gbGVvU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVklSR086XG4gICAgICAgIHJldHVybiB2aXJnb1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBOlxuICAgICAgICByZXR1cm4gbGlicmFTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TQ09SUElPOlxuICAgICAgICByZXR1cm4gc2NvcnBpb1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NBR0lUVEFSSVVTOlxuICAgICAgICByZXR1cm4gc2FnaXR0YXJpdXNTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DQVBSSUNPUk46XG4gICAgICAgIHJldHVybiBjYXByaWNvcm5TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9BUVVBUklVUzpcbiAgICAgICAgcmV0dXJuIGFxdWFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfUElTQ0VTOlxuICAgICAgICByZXR1cm4gcGlzY2VzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TVU46XG4gICAgICAgIHJldHVybiBzdW5TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NT09OOlxuICAgICAgICByZXR1cm4gbW9vblN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX01FUkNVUlk6XG4gICAgICAgIHJldHVybiBtZXJjdXJ5U3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVkVOVVM6XG4gICAgICAgIHJldHVybiB2ZW51c1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0VBUlRIOlxuICAgICAgICByZXR1cm4gZWFydGhTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9NQVJTOlxuICAgICAgICByZXR1cm4gbWFyc1N5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX0pVUElURVI6XG4gICAgICAgIHJldHVybiBqdXBpdGVyU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0FUVVJOOlxuICAgICAgICByZXR1cm4gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVVJBTlVTOlxuICAgICAgICByZXR1cm4gdXJhbnVzU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTkVQVFVORTpcbiAgICAgICAgcmV0dXJuIG5lcHR1bmVTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9QTFVUTzpcbiAgICAgICAgcmV0dXJuIHBsdXRvU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfQ0hJUk9OOlxuICAgICAgICByZXR1cm4gY2hpcm9uU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTElMSVRIOlxuICAgICAgICByZXR1cm4gbGlsaXRoU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfTk5PREU6XG4gICAgICAgIHJldHVybiBubm9kZVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1NOT0RFOlxuICAgICAgICByZXR1cm4gc25vZGVTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX1JFVFJPR1JBREU6XG4gICAgICAgIHJldHVybiByZXRyb2dyYWRlU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9DT05KVU5DVElPTjpcbiAgICAgICAgcmV0dXJuIGNvbmp1bmN0aW9uU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfT1BQT1NJVElPTjpcbiAgICAgICAgcmV0dXJuIG9wcG9zaXRpb25TeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9TUVVBUkU6XG4gICAgICAgIHJldHVybiBzcXVhcmVTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9UUklORTpcbiAgICAgICAgcmV0dXJuIHRyaW5lU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VYVElMRTpcbiAgICAgICAgcmV0dXJuIHNleHRpbGVTeW1ib2woeFBvcywgeVBvcylcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNWR1V0aWxzLlNZTUJPTF9RVUlOQ1VOWDpcbiAgICAgICAgcmV0dXJuIHF1aW5jdW54U3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfU0VNSVNFWFRJTEU6XG4gICAgICAgIHJldHVybiBzZW1pc2V4dGlsZVN5bWJvbCh4UG9zLCB5UG9zKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1ZHVXRpbHMuU1lNQk9MX09DVElMRTpcbiAgICAgICAgcmV0dXJuIHF1aW50aWxlU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTVkdVdGlscy5TWU1CT0xfVFJJT0NUSUxFOlxuICAgICAgICByZXR1cm4gdHJpb2N0aWxlU3ltYm9sKHhQb3MsIHlQb3MpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zdCB1bmtub3duU3ltYm9sID0gU1ZHVXRpbHMuU1ZHQ2lyY2xlKHhQb3MsIHlQb3MsIDgpXG4gICAgICAgIHVua25vd25TeW1ib2wuc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwiIzMzM1wiKVxuICAgICAgICByZXR1cm4gdW5rbm93blN5bWJvbFxuICAgIH1cblxuICAgIC8qXG4gICAgICogQXNjZW5kYW50IHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9BU19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogRGVzY2VuZGFudCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfRFNfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1lZGl1bSBjb2VsaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtY1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUNfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEltbXVtIGNvZWxpIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGljU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9JQ19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogQXJpZXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXJpZXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0FSSUVTX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBUYXVydXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdGF1cnVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9UQVVSVVNfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIEdlbWluaSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZW1pbmlTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0dFTUlOSV9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2FuY2VyIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNhbmNlclN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0FOQ0VSX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBMZW8gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9MRU9fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFZpcmdvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHZpcmdvU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9WSVJHT19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTGlicmEgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGlicmFTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0xJQlJBX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTY29ycGlvIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNjb3JwaW9TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1NDT1JQSU9fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNhZ2l0dGFyaXVzIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNhZ2l0dGFyaXVzU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQUdJVFRBUklVU19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogQ2Fwcmljb3JuIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNhcHJpY29yblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ0FQUklDT1JOX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBBcXVhcml1cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhcXVhcml1c1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQVFVQVJJVVNfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFBpc2NlcyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwaXNjZXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1BJU0NFU19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogU3VuIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN1blN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfU1VOX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBNb29uIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1vb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX01PT05fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1lcmN1cnkgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWVyY3VyeVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUVSQ1VSWV9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogVmVudXMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gdmVudXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1ZFTlVTX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBFYXJ0aCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlYXJ0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfRUFSVEhfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE1hcnMgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFyc1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTUFSU19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogSnVwaXRlciBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBqdXBpdGVyU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9KVVBJVEVSX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBTYXR1cm4gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2F0dXJuU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TQVRVUk5fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFVyYW51cyBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1cmFudXNTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX1VSQU5VU19DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTmVwdHVuZSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBuZXB0dW5lU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9ORVBUVU5FX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBQbHV0byBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwbHV0b1N5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfUExVVE9fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIENoaXJvbiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGlyb25TeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX0NISVJPTl9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogTGlsaXRoIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxpbGl0aFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTElMSVRIX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBOTm9kZSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBubm9kZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfTk5PREVfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNOb2RlIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNub2RlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TTk9ERV9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogUmV0cm9ncmFkZSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXRyb2dyYWRlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9SRVRST0dSQURFX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBDb25qdW5jdGlvbiBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb25qdW5jdGlvblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfQ09OSlVOQ1RJT05fQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIE9wcG9zaXRpb24gc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gb3Bwb3NpdGlvblN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfT1BQT1NJVElPTl9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogU3F1YXJlc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gc3F1YXJlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TUVVBUkVfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFRyaW5lIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyaW5lU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9UUklORV9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogU2V4dGlsZSBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TRVhUSUxFX0NPREUpXG4gICAgfVxuXG4gICAgLypcbiAgICAgKiBRdWluY3VueCBzeW1ib2xcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBxdWluY3VueFN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfUVVJTkNVTlhfQ09ERSlcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIFNlbWlzZXh0aWxlIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNlbWlzZXh0aWxlU3ltYm9sKHhQb3MsIHlQb3MpIHtcbiAgICAgIHJldHVybiBTVkdVdGlscy5TVkdUZXh0KHhQb3MsIHlQb3MsIFNWR1V0aWxzLlNZTUJPTF9TRU1JU0VYVElMRV9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogUXVpbnRpbGUgc3ltYm9sXG4gICAgICovXG4gICAgZnVuY3Rpb24gcXVpbnRpbGVTeW1ib2woeFBvcywgeVBvcykge1xuICAgICAgcmV0dXJuIFNWR1V0aWxzLlNWR1RleHQoeFBvcywgeVBvcywgU1ZHVXRpbHMuU1lNQk9MX09DVElMRV9DT0RFKVxuICAgIH1cblxuICAgIC8qXG4gICAgICogVHJpb2N0aWxlIHN5bWJvbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyaW9jdGlsZVN5bWJvbCh4UG9zLCB5UG9zKSB7XG4gICAgICByZXR1cm4gU1ZHVXRpbHMuU1ZHVGV4dCh4UG9zLCB5UG9zLCBTVkdVdGlscy5TWU1CT0xfVFJJT0NUSUxFX0NPREUpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCB7XG4gIFNWR1V0aWxzIGFzXG4gIGRlZmF1bHRcbn1cbiIsIi8qKlxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIFV0aWxpdHkgY2xhc3NcbiAqIEBwdWJsaWNcbiAqIEBzdGF0aWNcbiAqIEBoaWRlY29uc3RydWN0b3JcbiAqL1xuY2xhc3MgVXRpbHMge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgVXRpbHMpIHtcbiAgICAgIHRocm93IEVycm9yKCdUaGlzIGlzIGEgc3RhdGljIGNsYXNzIGFuZCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkLicpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBERUdfMzYwID0gMzYwXG4gIHN0YXRpYyBERUdfMTgwID0gMTgwXG4gIHN0YXRpYyBERUdfMCA9IDBcblxuICAvKipcbiAgICogR2VuZXJhdGUgcmFuZG9tIElEXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIGdlbmVyYXRlVW5pcXVlSWQgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCByYW5kb21OdW1iZXIgPSBNYXRoLnJhbmRvbSgpICogMTAwMDAwMDtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHVuaXF1ZUlkID0gYGlkXyR7cmFuZG9tTnVtYmVyfV8ke3RpbWVzdGFtcH1gO1xuICAgIHJldHVybiB1bmlxdWVJZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZlcnRlZCBkZWdyZWUgdG8gcmFkaWFuXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlSW5kZWdyZWVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNoaWZ0SW5EZWdyZWVcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgc3RhdGljIGRlZ3JlZVRvUmFkaWFuID0gZnVuY3Rpb24oYW5nbGVJbkRlZ3JlZSwgc2hpZnRJbkRlZ3JlZSA9IDApIHtcbiAgICByZXR1cm4gKHNoaWZ0SW5EZWdyZWUgLSBhbmdsZUluRGVncmVlKSAqIE1hdGguUEkgLyAxODBcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyByYWRpYW4gdG8gZGVncmVlXG4gICAqIEBzdGF0aWNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGlhblxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgcmFkaWFuVG9EZWdyZWUgPSBmdW5jdGlvbihyYWRpYW4pIHtcbiAgICByZXR1cm4gKHJhZGlhbiAqIDE4MCAvIE1hdGguUEkpXG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyBhIHBvc2l0aW9uIG9mIHRoZSBwb2ludCBvbiB0aGUgY2lyY2xlLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gY3ggLSBjZW50ZXIgeFxuICAgKiBAcGFyYW0ge051bWJlcn0gY3kgLSBjZW50ZXIgeVxuICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzIC0gY2lyY2xlIHJhZGl1c1xuICAgKiBAcGFyYW0ge051bWJlcn0gYW5nbGVJblJhZGlhbnNcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHt4Ok51bWJlciwgeTpOdW1iZXJ9XG4gICAqL1xuICBzdGF0aWMgcG9zaXRpb25PbkNpcmNsZShjeCwgY3ksIHJhZGl1cywgYW5nbGVJblJhZGlhbnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgeDogKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKSArIGN4KSxcbiAgICAgIHk6IChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZUluUmFkaWFucykgKyBjeSlcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIGFuZ2xlIGJldHdlZW4gdGhlIGxpbmUgKDIgcG9pbnRzKSBhbmQgdGhlIHgtYXhpcy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHgxXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5MVxuICAgKiBAcGFyYW0ge051bWJlcn0geDJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyXG4gICAqXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBkZWdyZWVcbiAgICovXG4gIHN0YXRpYyBwb3NpdGlvblRvQW5nbGUoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICBjb25zdCBkeCA9IHgyIC0geDE7XG4gICAgY29uc3QgZHkgPSB5MiAtIHkxO1xuICAgIGNvbnN0IGFuZ2xlSW5SYWRpYW5zID0gTWF0aC5hdGFuMihkeSwgZHgpO1xuICAgIHJldHVybiBVdGlscy5yYWRpYW5Ub0RlZ3JlZShhbmdsZUluUmFkaWFucylcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIG5ldyBwb3NpdGlvbiBvZiBwb2ludHMgb24gY2lyY2xlIHdpdGhvdXQgb3ZlcmxhcHBpbmcgZWFjaCBvdGhlclxuICAgKlxuICAgKiBAdGhyb3dzIHtFcnJvcn0gLSBJZiB0aGVyZSBpcyBubyBwbGFjZSBvbiB0aGUgY2lyY2xlIHRvIHBsYWNlIHBvaW50cy5cbiAgICogQHBhcmFtIHtBcnJheX0gcG9pbnRzIC0gW3tuYW1lOlwiYVwiLCBhbmdsZToxMH0sIHtuYW1lOlwiYlwiLCBhbmdsZToyMH1dXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjb2xsaXNpb25SYWRpdXMgLSBwb2ludCByYWRpdXNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1cyAtIGNpcmNsZSByYWRpdXNcbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSAtIHtcIk1vb25cIjozMCwgXCJTdW5cIjo2MCwgXCJNZXJjdXJ5XCI6ODYsIC4uLn1cbiAgICovXG4gIHN0YXRpYyBjYWxjdWxhdGVQb3NpdGlvbldpdGhvdXRPdmVybGFwcGluZyhwb2ludHMsIGNvbGxpc2lvblJhZGl1cywgY2lyY2xlUmFkaXVzKSB7XG4gICAgY29uc3QgU1RFUCA9IDEgLy9kZWdyZWVcblxuICAgIGNvbnN0IGNlbGxXaWR0aCA9IDEwIC8vZGVncmVlXG4gICAgY29uc3QgbnVtYmVyT2ZDZWxscyA9IFV0aWxzLkRFR18zNjAgLyBjZWxsV2lkdGhcbiAgICBjb25zdCBmcmVxdWVuY3kgPSBuZXcgQXJyYXkobnVtYmVyT2ZDZWxscykuZmlsbCgwKVxuICAgIGZvciAoY29uc3QgcG9pbnQgb2YgcG9pbnRzKSB7XG4gICAgICBjb25zdCBpbmRleCA9IE1hdGguZmxvb3IocG9pbnQuYW5nbGUgLyBjZWxsV2lkdGgpXG4gICAgICBmcmVxdWVuY3lbaW5kZXhdICs9IDFcbiAgICB9XG5cbiAgICAvLyBJbiB0aGlzIGFsZ29yaXRobSB0aGUgb3JkZXIgb2YgcG9pbnRzIGlzIGNydWNpYWwuXG4gICAgLy8gQXQgdGhhdCBwb2ludCBpbiB0aGUgY2lyY2xlLCB3aGVyZSB0aGUgcGVyaW9kIGNoYW5nZXMgaW4gdGhlIGNpcmNsZSAoZm9yIGluc3RhbmNlOlszNTgsMzU5LDAsMV0pLCB0aGUgcG9pbnRzIGFyZSBhcnJhbmdlZCBpbiBpbmNvcnJlY3Qgb3JkZXIuXG4gICAgLy8gQXMgYSBzdGFydGluZyBwb2ludCwgSSB0cnkgdG8gZmluZCBhIHBsYWNlIHdoZXJlIHRoZXJlIGFyZSBubyBwb2ludHMuIFRoaXMgcGxhY2UgSSB1c2UgYXMgU1RBUlRfQU5HTEUuXG4gICAgY29uc3QgU1RBUlRfQU5HTEUgPSBjZWxsV2lkdGggKiBmcmVxdWVuY3kuZmluZEluZGV4KGNvdW50ID0+IGNvdW50ID09IDApXG5cbiAgICBjb25zdCBfcG9pbnRzID0gcG9pbnRzLm1hcChwb2ludCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBwb2ludC5uYW1lLFxuICAgICAgICBhbmdsZTogcG9pbnQuYW5nbGUgPCBTVEFSVF9BTkdMRSA/IHBvaW50LmFuZ2xlICsgVXRpbHMuREVHXzM2MCA6IHBvaW50LmFuZ2xlXG4gICAgICB9XG4gICAgfSlcblxuICAgIF9wb2ludHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuYW5nbGUgLSBiLmFuZ2xlXG4gICAgfSlcblxuICAgIC8vIFJlY3Vyc2l2ZSBmdW5jdGlvblxuICAgIGNvbnN0IGFycmFuZ2VQb2ludHMgPSAoKSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbG4gPSBfcG9pbnRzLmxlbmd0aDsgaSA8IGxuOyBpKyspIHtcbiAgICAgICAgY29uc3QgcG9pbnRQb3NpdGlvbiA9IFV0aWxzLnBvc2l0aW9uT25DaXJjbGUoMCwgMCwgY2lyY2xlUmFkaXVzLCBVdGlscy5kZWdyZWVUb1JhZGlhbihfcG9pbnRzW2ldLmFuZ2xlKSlcbiAgICAgICAgX3BvaW50c1tpXS54ID0gcG9pbnRQb3NpdGlvbi54XG4gICAgICAgIF9wb2ludHNbaV0ueSA9IHBvaW50UG9zaXRpb24ueVxuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coX3BvaW50c1tpXS54IC0gX3BvaW50c1tqXS54LCAyKSArIE1hdGgucG93KF9wb2ludHNbaV0ueSAtIF9wb2ludHNbal0ueSwgMikpO1xuICAgICAgICAgIGlmIChkaXN0YW5jZSA8ICgyICogY29sbGlzaW9uUmFkaXVzKSkge1xuICAgICAgICAgICAgX3BvaW50c1tpXS5hbmdsZSArPSBTVEVQXG4gICAgICAgICAgICBfcG9pbnRzW2pdLmFuZ2xlIC09IFNURVBcbiAgICAgICAgICAgIGFycmFuZ2VQb2ludHMoKSAvLz09PT09PT4gUmVjdXJzaXZlIGNhbGxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBhcnJhbmdlUG9pbnRzKClcblxuICAgIHJldHVybiBfcG9pbnRzLnJlZHVjZSgoYWNjdW11bGF0b3IsIHBvaW50LCBjdXJyZW50SW5kZXgpID0+IHtcbiAgICAgIGFjY3VtdWxhdG9yW3BvaW50Lm5hbWVdID0gcG9pbnQuYW5nbGVcbiAgICAgIHJldHVybiBhY2N1bXVsYXRvclxuICAgIH0sIHt9KVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBhbmdsZSBjb2xsaWRlcyB3aXRoIHRoZSBwb2ludHNcbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGFuZ2xlXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFuZ2xlc0xpc3RcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtjb2xsaXNpb25SYWRpdXNdXG4gICAqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgaXNDb2xsaXNpb24oYW5nbGUsIGFuZ2xlc0xpc3QsIGNvbGxpc2lvblJhZGl1cyA9IDEwKSB7XG5cbiAgICBjb25zdCBwb2ludEluQ29sbGlzaW9uID0gYW5nbGVzTGlzdC5maW5kKHBvaW50ID0+IHtcblxuICAgICAgbGV0IGEgPSAocG9pbnQgLSBhbmdsZSkgPiBVdGlscy5ERUdfMTgwID8gYW5nbGUgKyBVdGlscy5ERUdfMzYwIDogYW5nbGVcbiAgICAgIGxldCBwID0gKGFuZ2xlIC0gcG9pbnQpID4gVXRpbHMuREVHXzE4MCA/IHBvaW50ICsgVXRpbHMuREVHXzM2MCA6IHBvaW50XG5cbiAgICAgIHJldHVybiBNYXRoLmFicyhhIC0gcCkgPD0gY29sbGlzaW9uUmFkaXVzXG4gICAgfSlcblxuICAgIHJldHVybiBwb2ludEluQ29sbGlzaW9uID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IHRydWVcbiAgfVxuXG4gIFxuXG4gIC8qKlxuICAqIFJlbW92ZXMgdGhlIGNvbnRlbnQgb2YgYW4gZWxlbWVudFxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnRJRFxuICAqIEBwYXJhbSB7RnVuY3Rpb259IFtiZWZvcmVIb29rXVxuICAgICpcbiAgKiBAd2FybmluZyAtIEl0IHJlbW92ZXMgRXZlbnQgTGlzdGVuZXJzIHRvby5cbiAgKiBAd2FybmluZyAtIFlvdSB3aWxsIChwcm9iYWJseSkgZ2V0IG1lbW9yeSBsZWFrIGlmIHlvdSBkZWxldGUgZWxlbWVudHMgdGhhdCBoYXZlIGF0dGFjaGVkIGxpc3RlbmVyc1xuICAqL1xuICBzdGF0aWMgY2xlYW5VcCggZWxlbWVudElELCBiZWZvcmVIb29rKXtcbiAgICBsZXQgZWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKVxuICAgIGlmKCFlbG0pe1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgKHR5cGVvZiBiZWZvcmVIb29rID09PSAnZnVuY3Rpb24nKSAmJiBiZWZvcmVIb29rKClcblxuICAgIGVsbS5pbm5lckhUTUwgPSBcIlwiXG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgVXRpbHMgYXNcbiAgZGVmYXVsdFxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgVW5pdmVyc2UgZnJvbSAnLi91bml2ZXJzZS9Vbml2ZXJzZS5qcydcbmltcG9ydCBTVkdVdGlscyBmcm9tICcuL3V0aWxzL1NWR1V0aWxzLmpzJ1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vdXRpbHMvVXRpbHMuanMnXG5pbXBvcnQgUmFkaXhDaGFydCBmcm9tICcuL2NoYXJ0cy9SYWRpeENoYXJ0LmpzJ1xuaW1wb3J0IFRyYW5zaXRDaGFydCBmcm9tICcuL2NoYXJ0cy9UcmFuc2l0Q2hhcnQuanMnXG5cbmV4cG9ydCB7VW5pdmVyc2UsIFNWR1V0aWxzLCBVdGlscywgUmFkaXhDaGFydCwgVHJhbnNpdENoYXJ0fVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9