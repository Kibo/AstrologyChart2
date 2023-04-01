import '@testing-library/jest-dom' //@see https://www.npmjs.com/package/@testing-library/jest-dom
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

  let paperElement = document.getElementById('paper')

  expect(paperElement.innerHTML).toBe('<svg xmlns=\"http://www.w3.org/2000/xmlns/\" version=\"1.1\" viewBox=\"0 0 640 480\" style=\"position: relative; overflow: hidden;\"></svg>')
});

test('Universe.getSettings()', () => {
  document.body.innerHTML = `
    <div id="paper"></div>
  `;

  let universe = new Universe("paper")
  let settings = universe.getSettings()
  expect(settings.WIDTH).toBe(defaultSettings.WIDTH);
  expect(settings.HEIGHT).toBe(defaultSettings.HEIGHT);

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
