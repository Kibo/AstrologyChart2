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
  * @throws {Error} - if the data is undefined.
  * @param {Object} data
  * @return {Object} - {isValid:boolean, message:String}
  */
  validateData( data ){
    if(!data){
      throw new Error("Mising param data.")
    }

    if( !Array.isArray(data.points) ){
      return {isValid:false, message:"points is not Array."}
    }

    if( !Array.isArray(data.cusps) ){
      return {isValid:false, message:"cups is not Array."}
    }

    if( data.cusps.length !== 12){
      return {isValid:false, message:"cusps.length !== 12"}
    }

    for(let point of data.points){
      if(typeof point.name !== 'string'){
        return {isValid:false, message:"point.name !== 'string'"}
      }
      if(point.name.length === 0){
        return {isValid:false, message:"point.name.length == 0"}
      }
      if(typeof point.position !== 'number'){
        return {isValid:false, message:"point.position !== 'number'"}
      }
    }

    for(let cusp of data.cusps){
      if(typeof cusp.position !== 'number'){
        return {isValid:false, message:"cusp.position !== 'number'"}
      }
    }

    return {isValid:true, message:""}
  }

  /**
   * Create a SVG group element
   *
   * @param {String} elementID
   * @return {SVGGroupElement}
   */
  createSVGGroup(elementID) {
    if(!elementID){
      throw new Error("Mising param elementID")
    }
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
