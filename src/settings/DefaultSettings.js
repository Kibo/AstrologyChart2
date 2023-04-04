import * as Universe from "./parts/Universe.js"
import * as Radix from "./parts/Radix.js"
import * as Transit from "./parts/Transit.js"
import * as Colors from "./parts/Colors.js"
import * as Symbols from "./parts/Symbols.js"

const SETTINGS = Object.assign({}, Universe, Radix, Transit, Colors, Symbols);

export {
  SETTINGS as
  default
}
