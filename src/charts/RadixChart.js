import Universe from '../universe/Universe.js';
import SVGUtils from '../utils/SVGUtils.js';
import Utils from '../utils/Utils.js';
import Chart from './Chart.js'
import Point from '../points/Point.js'

/**
 * @class
 * @classdesc Points and cups are displayed inside the Universe.
 * @public
 * @extends {Chart}
 */
class RadixChart extends Chart {

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

  /*
   * Shift the Ascendant to the 0 degree on The Chart
   */
  #ascendantShift
  #centerX
  #centerY
  #radius
  #innerCircleRadius
  #centerCircleRadius
  #rullerCircleRadius

  /**
   * @constructs
   * @param {Universe} Universe
   */
  constructor(universe) {

    if (!universe instanceof Universe) {
      throw new Error('Bad param universe.')
    }

    super(universe.getSettings())

    this.#universe = universe
    this.#settings = this.#universe.getSettings()
    this.#centerX = this.#settings.CHART_VIEWBOX_WIDTH / 2
    this.#centerY = this.#settings.CHART_VIEWBOX_HEIGHT / 2
    this.#radius = Math.min(this.#centerX, this.#centerY) - this.#settings.CHART_PADDING
    this.#innerCircleRadius = this.#radius - this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO
    this.#centerCircleRadius = this.#radius / RadixChart.OUTER_CIRCLE_RADIUS_RATIO
    this.#rullerCircleRadius = this.#radius - (this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO + RadixChart.RULER_LENGTH)

    this.#root = SVGUtils.SVGGroup()
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

    this.#ascendantShift = (data.cusps[0].angle + Utils.DEG_180)
    this.#draw(data)

    return this
  }

  /**
  * Get Universe
  *
  * @return {Universe}
  */
  getUniverse(){
    return this.#universe
  }

  /**
  * Get Ascendat shift
  *
  * @return {Number}
  */
  getAscendantShift(){
    return this.#ascendantShift
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
        name: SVGUtils.SYMBOL_AS,
        angle: data.cusps[0].angle
      },
      {
        name: SVGUtils.SYMBOL_IC,
        angle: data.cusps[3].angle
      },
      {
        name: SVGUtils.SYMBOL_DS,
        angle: data.cusps[6].angle
      },
      {
        name: SVGUtils.SYMBOL_MC,
        angle: data.cusps[9].angle
      },
    ])
    this.#drawPoints(data)
    this.#drawCusps(data)
    this.#drawBorders()
  }

  #drawBackground() {
    const MASK_ID = `${this.#settings.HTML_ELEMENT_ID}-${this.#settings.RADIX_ID}-background-mask-1`

    const wrapper = SVGUtils.SVGGroup()

    const mask = SVGUtils.SVGMask(MASK_ID)
    const outerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#radius)
    outerCircle.setAttribute('fill', "white")
    mask.appendChild(outerCircle)

    const innerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#centerCircleRadius)
    innerCircle.setAttribute('fill', "black")
    mask.appendChild(innerCircle)
    wrapper.appendChild(mask)

    const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#radius)
    circle.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : this.#settings.CHART_BACKGROUND_COLOR);
    circle.setAttribute("mask", this.#settings.CHART_STROKE_ONLY ? "none" : `url(#${MASK_ID})`);
    wrapper.appendChild(circle)

    this.#root.appendChild(wrapper)
  }

  #drawAstrologicalSigns() {
    const NUMBER_OF_ASTROLOGICAL_SIGNS = 12
    const STEP = 30 //degree
    const COLORS_SIGNS = [this.#settings.COLOR_ARIES, this.#settings.COLOR_TAURUS, this.#settings.COLOR_GEMINI, this.#settings.COLOR_CANCER, this.#settings.COLOR_LEO, this.#settings.COLOR_VIRGO, this.#settings.COLOR_LIBRA, this.#settings.COLOR_SCORPIO, this.#settings.COLOR_SAGITTARIUS, this.#settings.COLOR_CAPRICORN, this.#settings.COLOR_AQUARIUS, this.#settings.COLOR_PISCES]
    const SYMBOL_SIGNS = [SVGUtils.SYMBOL_ARIES, SVGUtils.SYMBOL_TAURUS, SVGUtils.SYMBOL_GEMINI, SVGUtils.SYMBOL_CANCER, SVGUtils.SYMBOL_LEO, SVGUtils.SYMBOL_VIRGO, SVGUtils.SYMBOL_LIBRA, SVGUtils.SYMBOL_SCORPIO, SVGUtils.SYMBOL_SAGITTARIUS, SVGUtils.SYMBOL_CAPRICORN, SVGUtils.SYMBOL_AQUARIUS, SVGUtils.SYMBOL_PISCES]

    const makeSymbol = (symbolIndex, angleInDegree) => {
      let position = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#radius - (this.#radius / RadixChart.INNER_CIRCLE_RADIUS_RATIO) / 2, Utils.degreeToRadian(angleInDegree + STEP / 2, this.#ascendantShift))

      let symbol = SVGUtils.SVGSymbol(SYMBOL_SIGNS[symbolIndex], position.x, position.y)
      symbol.setAttribute("font-family", this.#settings.CHART_FONT_FAMILY);
      symbol.setAttribute("text-anchor", "middle") // start, middle, end
      symbol.setAttribute("dominant-baseline", "middle")
      symbol.setAttribute("font-size", this.#settings.RADIX_SIGNS_FONT_SIZE);
      symbol.setAttribute("fill", this.#settings.CHART_SIGNS_COLOR);
      return symbol
    }

    const makeSegment = (symbolIndex, angleFromInDegree, angleToInDegree) => {
      let a1 = Utils.degreeToRadian(angleFromInDegree, this.#ascendantShift)
      let a2 = Utils.degreeToRadian(angleToInDegree, this.#ascendantShift)
      let segment = SVGUtils.SVGSegment(this.#centerX, this.#centerY, this.#radius, a1, a2, this.#innerCircleRadius);
      segment.setAttribute("fill", this.#settings.CHART_STROKE_ONLY ? "none" : COLORS_SIGNS[symbolIndex]);
      segment.setAttribute("stroke", this.#settings.CHART_STROKE_ONLY ? this.#settings.CIRCLE_COLOR : "none");
      segment.setAttribute("stroke-width", this.#settings.CHART_STROKE_ONLY ? this.#settings.CHART_STROKE : 0);
      return segment
    }

    let startAngle = 0
    let endAngle = startAngle + STEP

    const wrapper = SVGUtils.SVGGroup()

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

    const wrapper = SVGUtils.SVGGroup()

    let startAngle = this.#ascendantShift
    for (let i = 0; i < NUMBER_OF_DIVIDERS; i++) {
      let startPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius, Utils.degreeToRadian(startAngle))
      let endPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius + RadixChart.RULER_LENGTH / (i % 2 + 1), Utils.degreeToRadian(startAngle))
      const line = SVGUtils.SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE);
      wrapper.appendChild(line);

      startAngle += STEP
    }

    const circle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius);
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

    const wrapper = SVGUtils.SVGGroup()

    for (const axis of axisList) {
      let startPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#radius, Utils.degreeToRadian(axis.angle, this.#ascendantShift))
      let endPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#radius + AXIS_LENGTH, Utils.degreeToRadian(axis.angle, this.#ascendantShift))
      let line = SVGUtils.SVGLine(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR);
      line.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
      wrapper.appendChild(line);

      let textPoint = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#radius + AXIS_LENGTH, Utils.degreeToRadian(axis.angle, this.#ascendantShift))
      let symbol;
      let SHIFT_X = 0;
      let SHIFT_Y = 0;
      const STEP = 2
      switch (axis.name) {
        case "As":
          SHIFT_X -= STEP
          SHIFT_Y -= STEP
          symbol = SVGUtils.SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "end")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Ds":
          SHIFT_X += STEP
          SHIFT_Y -= STEP
          symbol = SVGUtils.SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "start")
          symbol.setAttribute("dominant-baseline", "middle")
          break;
        case "Mc":
          SHIFT_Y -= STEP
          symbol = SVGUtils.SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
          symbol.setAttribute("text-anchor", "middle")
          symbol.setAttribute("dominant-baseline", "text-top")
          break;
        case "Ic":
          SHIFT_Y += STEP
          symbol = SVGUtils.SVGSymbol(axis.name, textPoint.x + SHIFT_X, textPoint.y + SHIFT_Y)
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

    const wrapper = SVGUtils.SVGGroup()

    const positions = Utils.calculatePositionWithoutOverlapping(points, this.#settings.POINT_COLLISION_RADIUS, POINT_RADIUS)
    for (const pointData of points) {
      const point = new Point(pointData, cusps, this.#settings)
      const pointPosition = Utils.positionOnCircle(this.#centerX, this.#centerX, this.#innerCircleRadius - 1.5 * RadixChart.RULER_LENGTH, Utils.degreeToRadian(point.getAngle(), this.#ascendantShift))
      const symbolPosition = Utils.positionOnCircle(this.#centerX, this.#centerX, POINT_RADIUS, Utils.degreeToRadian(positions[point.getName()], this.#ascendantShift))

      // ruler mark
      const rulerLineEndPosition = Utils.positionOnCircle(this.#centerX, this.#centerX, this.#rullerCircleRadius, Utils.degreeToRadian(point.getAngle(), this.#ascendantShift))
      const rulerLine = SVGUtils.SVGLine(pointPosition.x, pointPosition.y, rulerLineEndPosition.x, rulerLineEndPosition.y)
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
      const pointerLineEndPosition = Utils.positionOnCircle(this.#centerX, this.#centerX, POINT_RADIUS, Utils.degreeToRadian(positions[point.getName()], this.#ascendantShift))
      const pointerLine = SVGUtils.SVGLine(pointPosition.x, pointPosition.y, (pointPosition.x + pointerLineEndPosition.x) / 2, (pointPosition.y + pointerLineEndPosition.y) / 2)
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

    const wrapper = SVGUtils.SVGGroup()

    const textRadius = this.#radius / RadixChart.OUTER_CIRCLE_RADIUS_RATIO + 1.8 * RadixChart.RULER_LENGTH

    for (let i = 0; i < cusps.length; i++) {
      const startPos = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#centerCircleRadius, Utils.degreeToRadian(cusps[i].angle, this.#ascendantShift))
      const endPos = Utils.positionOnCircle(this.#centerX, this.#centerY, this.#rullerCircleRadius, Utils.degreeToRadian(cusps[i].angle, this.#ascendantShift))

      const isLineInCollisionWithPoint = Utils.isCollision(cusps[i].angle, pointsPositions, this.#settings.POINT_COLLISION_RADIUS / 2)
      const endPosX = isLineInCollisionWithPoint ? (startPos.x + endPos.x) / 2 : endPos.x
      const endPosY = isLineInCollisionWithPoint ? (startPos.y + endPos.y) / 2 : endPos.y
      const line = SVGUtils.SVGLine(startPos.x, startPos.y, endPosX, endPosY)
      line.setAttribute("stroke", this.#settings.CHART_LINE_COLOR)
      line.setAttribute("stroke-width", this.#settings.CHART_STROKE)
      wrapper.appendChild(line);

      const startCusp = cusps[i].angle
      const endCusp = cusps[(i + 1) % 12].angle
      const gap = endCusp - startCusp > 0 ? endCusp - startCusp : endCusp - startCusp + Utils.DEG_360
      const textAngle = startCusp + gap / 2

      const textPos = Utils.positionOnCircle(this.#centerX, this.#centerY, textRadius, Utils.degreeToRadian(textAngle, this.#ascendantShift))
      const text = SVGUtils.SVGText(textPos.x, textPos.y, `${i+1}`)
      text.setAttribute("text-anchor", "middle") // start, middle, end
      text.setAttribute("dominant-baseline", "middle")
      text.setAttribute("font-size", this.#settings.RADIX_POINTS_FONT_SIZE / 2)
      text.setAttribute("fill", this.#settings.CHART_TEXT_COLOR)
      wrapper.appendChild(text)
    }

    this.#root.appendChild(wrapper)
  }

  #drawBorders() {
    const wrapper = SVGUtils.SVGGroup()

    const innerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#innerCircleRadius)
    innerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    innerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(innerCircle)

    const outerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#radius)
    outerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    outerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(outerCircle)

    const centerCircle = SVGUtils.SVGCircle(this.#centerX, this.#centerY, this.#centerCircleRadius)
    centerCircle.setAttribute("stroke", this.#settings.CHART_CIRCLE_COLOR);
    centerCircle.setAttribute("stroke-width", this.#settings.CHART_MAIN_STROKE);
    wrapper.appendChild(centerCircle)

    this.#root.appendChild(wrapper)
  }
}

export {
  RadixChart as
  default
}
