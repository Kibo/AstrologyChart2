/*
* Aspects wrapper element ID
* @constant
* @type {String}
* @default aspects
*/
export const ASPECTS_ID = "aspects"

/*
* Draw aspects into chart during render
* @constant
* @type {Boolean}
* @default true
*/
export const DRAW_ASPECTS = true

/*
* Font size - aspects
* @constant
* @type {Number}
* @default 27
*/
export const ASPECTS_FONT_SIZE = 18

/**
* Default aspects
* @constant
* @type {Array}
*/
export const DEFAULT_ASPECTS = [
  {name:"Conjunction", angle:0, orb:2},
  {name:"Opposition", angle:180, orb:2},
  {name:"Trine", angle:120, orb:2},
  {name:"Square", angle:90, orb:2}
]
