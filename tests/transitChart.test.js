import TransitChart from '../src/charts/TransitChart.js'
import RadixChart from '../src/charts/RadixChart.js'
import Universe from '../src/universe/Universe.js'
import defaultSettings from '../src/settings/DefaultSettings.js';

test('Chart.createSVGGroup', () => {
  document.body.innerHTML = `
    <div id="paper"></div>
  `;

  const universe = new Universe("paper")
  const radix = new RadixChart(universe)
  const transit = new TransitChart(radix)

  let elementID = `paper-${defaultSettings.TRANSIT_ID}`
  let SVGGroup = document.getElementById(elementID)
  
  expect(SVGGroup).toBeDefined()
  expect(SVGGroup.getAttribute('id')).toBe(elementID)
});
