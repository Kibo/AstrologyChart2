# Astrology Chart 2
A JavaScript library with clean API and zero dependencies **for generating astrology charts**.

It does not calculate any positions of the planets in Universe.

**Version**: 0.0.1 (in progress)

- Pure Javascript implementation without dependencies
- OOP style
- SVG graphics
- Tested code
- Fully configurable

This is updated version of [AstroChart](https://github.com/Kibo/AstroChart). A completely rewritten code with modern JavaScript features, new API and new bugs ;)

Please use [Discussions](https://github.com/Kibo/AstrologyChart2/discussions) for questons and new ideas or open [new Issue](https://github.com/Kibo/AstrologyChart2/issues) for bug report.

### Examples
- [Radix chart](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/radix.html)
- [More charts on page](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/double.html)
- [Radix collision](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/collision.html)
- [Transit chart](#) TODO
- [Stroke only](#) TODO
- [Animation](#) TODO
- [Calibration](#) TODO

### How to use
```
<script src="../dist/astrochart2.js"></script>
<script>
	new astrology.Chart('paper').radix().setData( data )	
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
Look into the [settings](https://github.com/Kibo/AstrologyChart2/tree/master/src/settings/constants).
```
const settings = {SYMBOL_SCALE:2};
const chart = new astrology.Chart('paper', settings);
```
Note: All keys are uppercase.

### Namespace
 - default namespace for this library is *astrology*
 - you can change it in [webpack.config.js](https://webpack.js.org/configuration/output/#outputlibrary)

### Tests
 ```
 npm run test
 ```

### JSDoc
```
npm run doc
```

### Future plans
- Build and publish a public astrology API server (Ephemetris).
- Build a public open source astrology application full of new ideas and modern approaches to astrology.
- Design a computer system for interpreting astrological charts.

*Are you interested? Are you a graphic designer, business manager, marketing or astrologer guru? Let me know.*
