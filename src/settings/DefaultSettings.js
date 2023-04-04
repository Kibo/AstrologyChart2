import * as Universe from "./Universe.js"
import * as Radix from "./Radix.js"
import * as Transit from "./Transit.js"
import * as Colors from "./Colors.js"

const SETTINGS = Object.assign({}, Universe, Radix, Transit, Colors );

export {
  SETTINGS as
  default
}
