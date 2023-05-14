import * as Universe from "./constants/Universe.js"
import * as Radix from "./constants/Radix.js"
import * as Transit from "./constants/Transit.js"
import * as Point from "./constants/Point.js"
import * as Colors from "./constants/Colors.js"
import * as Aspects from "./constants/Aspects.js"

const SETTINGS = Object.assign({}, Universe, Radix, Transit, Point, Colors, Aspects);

export {
  SETTINGS as
  default
}
