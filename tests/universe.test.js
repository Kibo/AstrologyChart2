import Universe from '../src/universe/Universe.js'
import DefaultSettings from '../src/settings/DefaultSettings.js';

test('Universe.constructor()', () => {
  document.body.innerHTML = `
    <div id="paper"></div>
  `;

  let universe = new Universe("paper", {
    CHART_WIDTH: 640,
    CHART_HEIGHT: 480
  })

  let svgElement = document.querySelector("#paper svg")

  expect(svgElement).toBeDefined()
  expect(svgElement instanceof SVGElement).toBeTruthy()
  expect(svgElement.getAttribute("xmlns")).toBe('http://www.w3.org/2000/xmlns/')
  expect(svgElement.getAttribute("viewBox")).toBe('0 0 640 480')
});

test('Universe.getSettings()', () => {
  document.body.innerHTML = `
    <div id="paper"></div>
  `;

  let universe = new Universe("paper")
  let settings = universe.getSettings()
  expect(settings.CHART_WIDTH).toBe(DefaultSettings.CHART_WIDTH);
  expect(settings.CHART_HEIGHT).toBe(DefaultSettings.CHART_HEIGHT);
  expect(settings.HTML_ELEMENT_ID).toBe('paper');

  let CHART_WIDTH = 640
  let CHART_HEIGHT = 480
  let MY_VAR = "abc"
  universe = new Universe("paper", {
    CHART_WIDTH,
    CHART_HEIGHT,
    MY_VAR
  })
  settings = universe.getSettings()
  expect(settings.CHART_WIDTH).toBe(CHART_WIDTH);
  expect(settings.CHART_HEIGHT).toBe(CHART_HEIGHT);
  expect(settings.MY_VAR).toBe(MY_VAR);
});
