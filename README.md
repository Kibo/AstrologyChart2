# AstroChart
A JavaScript library for generating SVG charts to display planets in astrology. It does not calculate any positions of the planets in Universe.

**Version**: 0.0.1

- Pure Javascript implementation without dependencies.
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
		var chart = new astrology.Chart( 'paper', 800, 800);
		chart.radix( data );					
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
Look into the [settings.js](#)
```
var settings = {SYMBOL_SCALE:2};
var chart = new astrology.Chart( 'paper', 800, 800, settings);
```

### Namespace
 - default namespace for this library is *astrology*
 - you can change it in [webpack.config.js](https://webpack.js.org/configuration/output/#outputlibrary)

### It might interest you
- [The Swiss Ephemeris](http://www.astro.com/swisseph/swephinfo_e.htm)
- [AstroWebService](https://github.com/Kibo/AstroWebService)
- [AstroAPI](https://github.com/Kibo/AstroAPI)
