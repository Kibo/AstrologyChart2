import * as Universe from "./constants/Universe.js"
import * as Radix from "./constants/Radix.js"
import * as Transit from "./constants/Transit.js"
import * as Point from "./constants/Point.js"
import * as Colors from "./constants/Colors.js"

const SETTINGS = Object.assign({}, Universe, Radix, Transit, Point, Colors);

export {
  SETTINGS as
  default
}
