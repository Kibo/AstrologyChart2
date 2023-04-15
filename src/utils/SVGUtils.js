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
  static SYMBOL_MARS = "Mars";
  static SYMBOL_JUPITER = "Jupiter";
  static SYMBOL_SATURN = "Saturn";
  static SYMBOL_URANUS = "Uranus";
  static SYMBOL_NEPTUNE = "Neptune";
  static SYMBOL_PLUTO = "Pluto";
  static SYMBOL_CHIRON = "Chiron";
  static SYMBOL_LILITH = "Lilith";
  static SYMBOL_NNODE = "NNode";

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
    text.setAttribute("font-family", "AstrologySymbols");
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
  }
}

export {
  SVGUtils as
  default
}
