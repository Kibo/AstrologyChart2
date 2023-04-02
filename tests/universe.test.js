import Universe from '../src/universe/Universe.js'
import * as defaultSettings from '../src/settings/DefaultSettings.js';

test('Universe.constructor()', () => {
  document.body.innerHTML = `
    <div id="paper"></div>
  `;

  let universe = new Universe("paper", {
    WIDTH: 640,
    HEIGHT: 480
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
  expect(settings.WIDTH).toBe(defaultSettings.WIDTH);
  expect(settings.HEIGHT).toBe(defaultSettings.HEIGHT);
  expect(settings.HTML_ELEMENT_ID).toBe('paper');

  let WIDTH = 640
  let HEIGHT = 480
  let MY_VAR = "abc"
  universe = new Universe("paper", {
    WIDTH,
    HEIGHT,
    MY_VAR
  })
  settings = universe.getSettings()
  expect(settings.WIDTH).toBe(WIDTH);
  expect(settings.HEIGHT).toBe(HEIGHT);
  expect(settings.MY_VAR).toBe(MY_VAR);
});
