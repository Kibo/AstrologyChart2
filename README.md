# AstroChart
A JavaScript library with clean API and zero dependencies for generating astrology charts.

It does not calculate any positions of the planets in Universe.

**Version**: 0.0.1

- Pure Javascript implementation without dependencies.
- OOP style
- SVG graphics.
- Tested code.

### Examples
- [Radix chart](#)
- [More charts on page](#)
- [Radix collision](#)
- [Transit chart](#)
- [Stroke only](#)
- [Animation](#)
- [Calibration](#)

### How to use
```
<script src="js/astrochart2.min.js"></script>
<script>
	window.onload = function(){
		const chart = new astrology.Chart( 'paper' );
		chart.setRadixData( data );					
	};			
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
Look into the [settings.json](#)
```
const settings = {SYMBOL_SCALE:2};
const chart = new astrology.Chart( 'paper',settings);
```
Note: All keys are uppercase.

### Namespace
 - default namespace for this library is *astrology*
 - you can change it in [webpack.config.js](https://webpack.js.org/configuration/output/#outputlibrary)

### It might interest you
- [The Swiss Ephemeris](http://www.astro.com/swisseph/swephinfo_e.htm)
- [AstroWebService](https://github.com/Kibo/AstroWebService)
- [AstroAPI](https://github.com/Kibo/AstroAPI)
