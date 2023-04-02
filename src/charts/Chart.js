/**
 * @class
 * @classdesc An abstract class for all type of Chart
 * @public
 * @hideconstructor
 * @abstract
 */
class Chart {
  constructor() {}

  /**
  * Check if the data is valid
  *
  * @param {Object} data
  * @return {boolean}
  */
  isDataValid( data ){
    return true
  }

  /**
   * Create a SVG group element
   *
   * @param {String} namespace
   * @param {String} elementID
   * @return {SVGGroupElement}
   */
  createSVGGroup(elementID) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.setAttribute('id', elementID);
    return svg
  }

  /**
  * @abstract
  */
  setData( data ){
    throw new Error("Must be implemented by subclass.");
  }

  /**
  * @abstract
  */
  getPoints(){
    throw new Error("Must be implemented by subclass.");
  }

  /**
  * @abstract
  */
  getPoint( name ){
    throw new Error("Must be implemented by subclass.");
  }

  /**
  * @abstract
  */
  getAspects(){
    throw new Error("Must be implemented by subclass.");
  }

  /**
  * @abstract
  */
  animateTo(data){
    throw new Error("Must be implemented by subclass.");
  }
}

export { Chart as default }
