import * as Universe from "./constants/Universe.js"
import * as Radix from "./constants/Radix.js"
import * as Transit from "./constants/Transit.js"
import * as Colors from "./constants/Colors.js"
import * as Symbols from "./constants/Symbols.js"

const SETTINGS = Object.assign({}, Universe, Radix, Transit, Colors, Symbols);

export {
  SETTINGS as
  default
}
