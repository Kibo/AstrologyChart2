import RadixChart from '../src/charts/RadixChart.js'
import Universe from '../src/universe/Universe.js'
import defaultSettings from '../src/settings/DefaultSettings.js';
import Utils from '../src/utils/Utils.js'

test('Chart.createSVGGroup', () => {
  document.body.innerHTML = `
    <div id="paper"></div>
  `;

  const universe = new Universe("paper")
  new RadixChart(universe)

  let elementID = `paper-${defaultSettings.RADIX_ID}`
  let SVGGroup = document.getElementById(elementID)

  expect(SVGGroup).toBeDefined()
  expect(SVGGroup.getAttribute('id')).toBe(elementID)
});

test('Chart.getAscendantShift', () => {
  document.body.innerHTML = `
    <div id="paper"></div>
  `;

  const data = {
    "points":[{name:"Moon", angle:64}, {name:"Sun", angle:273}, {name:"Mercury", angle:194}, {name:"Venus", angle:158}, {name:"Mars", angle:304}, {name:"Jupiter", angle:229}, {name:"Saturn", angle:255, isRetrograde:true}, {name:"Uranus", angle:347}, {name:"Neptune", angle:21, isRetrograde:true}, {name:"Pluto", angle:233}, {name:"Lilith", angle:244}, {name:"Chiron", angle:339}, {name:"NNode", angle:285}],
    "cusps":[{angle:10}, {angle:30}, {angle:60}, {angle:90}, {angle:120}, {angle:150}, {angle:180}, {angle:210}, {angle:240}, {angle:270}, {angle:300}, {angle:330}]
  }

  const universe = new Universe("paper")
  let radix = new RadixChart(universe)

  expect(radix.getAscendantShift()).toBe(Utils.DEG_180)

  radix.setData(data)

  expect(radix.getAscendantShift()).toBe( data.cusps[0].angle + Utils.DEG_180 )
})
