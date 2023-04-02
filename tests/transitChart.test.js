import TransitChart from '../src/charts/TransitChart.js'
import * as defaultSettings from '../src/settings/DefaultSettings.js';

test('Chart.createSVGGroup', () => {
  document.body.innerHTML = `
    <div id="paper">
    <svg xmlns="http://www.w3.org/2000/xmlns/" version="1.1" viewBox="0 0 600 600" style="position: relative; overflow: hidden;"></svg>
    </div>
  `;

  let SVGElement = document.querySelector("#paper svg")
  new TransitChart(SVGElement, {...defaultSettings, HTML_ELEMENT_ID:"paper"} )

  let elementID = `paper-${defaultSettings.TRANSIT_ID}`
  let SVGGroup = document.getElementById(elementID)

  expect(SVGGroup).toBeDefined()
  expect(SVGGroup.getAttribute('id')).toBe(elementID)
});
