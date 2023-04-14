import DefaultSettings from '../src/settings/DefaultSettings.js';
import SVGUtils from '../src/utils/SVGUtils.js';

test('SVGUtils.SVGText', () => {
  document.body.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 800 800"></svg>
  `;

  let svgElement = document.querySelector("svg")
  const text = SVGUtils.SVGText(10,10,"Hello")
  text.setAttribute("font-size", 24);
  text.setAttribute("fill", "#333");
  svgElement.appendChild(text)

  const textElement = document.querySelector("svg text")

  expect(textElement).toBeDefined()
  expect(textElement.getAttribute('font-family')).toBe("monospace")
});
