import RadixChart from '../src/charts/RadixChart.js'
import Universe from '../src/universe/Universe.js'
import defaultSettings from '../src/settings/DefaultSettings.js';

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
