# Astrology Chart 2
A JavaScript library with clean API and zero dependencies **for generating astrology charts**.

It does not calculate any positions of the planets in Universe.

**Version**: 0.7.2 (alfa)

- Pure Javascript implementation without dependencies
- OOP style
- SVG graphics
- Tested code
- Fully configurable

This is updated version of [AstroChart](https://github.com/Kibo/AstroChart). A completely rewritten code with modern JavaScript features, new API and new bugs ;)

Please use [Discussions](https://github.com/Kibo/AstrologyChart2/discussions) for questons and new ideas or open [new Issue](https://github.com/Kibo/AstrologyChart2/issues) for bug report.

### Examples
- [Radix chart](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/radix.html)
- [Transit chart](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/transit.html)
- [More charts on page](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/charts.html)
- [Radix collision](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/collision.html)
- [Radix scaling symbols](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/scaling.html)
- [Stroke only](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/stroke.html)
- [Symbols](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/symbols.html)
- [Aspects Radix](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/radixAspects.html)
- [Aspects Transit](https://htmlpreview.github.io/?https://github.com/Kibo/AstrologyChart2/blob/master/examples/transitAspects.html)
- [Animation](#) TODO

### How to use
```
<script src="../dist/astrochart2.js"></script>
<script>
	new astrology.Universe('paper').radix().setData( data )
</script>
```
### Data example
```
{
"points":[{name:"Moon", angle:0}, {name:"Sun", angle:30}, {name:"Mercury", angle:60}, ... ],
"cusps":[{angle:300}, {angle:340}, {angle:30}, {angle:60}, {angle:75}, {angle:90}, {angle:116}, {angle:172}, {angle:210}, {angle:236}, {angle:250}, {angle:274}]
}
```

**Point**
```
{
name:{String},
angle:{Number},
[isRetrograde]:{Boolean=false}
}
```

**Cusp**
```
{
angle:{Number}
}
```

### Point properties

 ![properties](/assets/img/point_properties.png)

- angle in sign
- retrograde
- dignities (**r**: Rulership, **d**: Detriment, **e**: Exaltation, **f**: Fall)


### Known points
Sun, Moon, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Chiron, Lilith, NNode, SNode.

### Chart settings
Look into the [settings](https://github.com/Kibo/AstrologyChart2/tree/master/src/settings/constants).
```
const settings = {RADIX_POINTS_FONT_SIZE:24};
const chart = new astrology.Universe('paper', settings);
```
Note: All keys are uppercase.

### Namespace
 - default namespace for this library is *astrology*
 - you can change it in [webpack.config.js](https://webpack.js.org/configuration/output/#outputlibrary)

### Astronomicon font
- [Astronomicon font](https://astronomicon.co/en/astronomicon-fonts/)

Thanks to Roberto	Corona work, I could remove [the symbols drawn in the SVGPath](https://github.com/Kibo/AstrologyChart2/blob/7c9fbcf097c856f2291df27b00ef1543f0ebc13f/src/utils/SVGUtils.js#L300) and replace them with this font.


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
