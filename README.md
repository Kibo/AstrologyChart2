# AstroChart
A JavaScript library with clean API and zero dependencies for generating astrology charts.

It does not calculate any positions of the planets in Universe.

**Version**: 0.0.1 (in progress)

- Pure Javascript implementation without dependencies.
- OOP style
- SVG graphics.
- Tested code.

There is updated version of [AstroChart](#). A completely rewritten code with modern JavaScript features, new API and new bugs ;)

Please open [new issue](#) for questons, bug report, new ideas.

### Examples
- [Radix chart](#)
- [More charts on page](#) TODO
- [Radix collision](#) TODO
- [Transit chart](#) TODO
- [Stroke only](#) TODO
- [Animation](#) TODO
- [Calibration](#) TODO

### How to use
```
<script src="../dist/astrochart2.js"></script>
<script>
	const chart = new astrology.Chart('paper')
	chart.radix().setData( data )
</script>
```
### Data example
```
{
	"points":[{name:"Moon", position:0}, {name:"Sun", position:30}, {name:"Mercury", position:60}, ... ],
	"cusps":[{position:300}, {position:340}, {position:30}, {position:60}, {position:75}, {position:90}, {position:116}, {position:172}, {position:210}, {position:236}, {position:250}, {position:274}]
}
```

### Known points
Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Chiron, Lilith, NNode.

### Chart settings
Look into the [settings](#)
```
const settings = {SYMBOL_SCALE:2};
const chart = new astrology.Chart('paper', settings);
```
Note: All keys are uppercase.

### Namespace
 - default namespace for this library is *astrology*
 - you can change it in [webpack.config.js](https://webpack.js.org/configuration/output/#outputlibrary)

### Future plans
- Build a public astrology API.
- Build a public open source astrology application full of new ideas and modern approaches to astrology.
- Design a computer system for interpreting astrological charts.

Are you interested? Are you a graphic designer, business manager, marketing guru?
