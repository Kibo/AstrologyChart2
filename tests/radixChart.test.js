import RadixChart from '../src/charts/RadixChart.js'
import * as defaultSettings from '../src/settings/DefaultSettings.js';

test('Chart.createSVGGroup', () => {
  document.body.innerHTML = `
    <div id="paper">
    <svg xmlns="http://www.w3.org/2000/xmlns/" version="1.1" viewBox="0 0 600 600" style="position: relative; overflow: hidden;"></svg>
    </div>
  `;

  let SVGElement = document.querySelector("#paper svg")
  new RadixChart(SVGElement, {...defaultSettings, HTML_ELEMENT_ID:"paper"} )

  let elementID = `paper-${defaultSettings.RADIX_ID}`
  let SVGGroup = document.getElementById(elementID)

  expect(SVGGroup).toBeDefined()
  expect(SVGGroup.getAttribute('id')).toBe(elementID)
});
