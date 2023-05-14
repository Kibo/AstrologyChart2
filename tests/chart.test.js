import Chart from '../src/charts/Chart.js'
import defaultSettings from '../src/settings/DefaultSettings.js';

test('Chart.cleanUp', () => {
  document.body.innerHTML = `
    <div id="paper">
      <div class="wrapper1">
        <div class="wrapper11"></div>
        <div class="wrapper12"></div>
      </div>
      <div class="wrapper2"></div>
    </div>
  `;

  let chart = new Chart()

  expect(document.getElementById('paper')).toBeDefined()
  expect(document.getElementById('wrapper1')).toBeDefined()
  expect(document.getElementById('wrapper2')).toBeDefined()
  expect(document.getElementById('wrapper11')).toBeDefined()
  expect(document.getElementById('wrapper12')).toBeDefined()

  chart.cleanUp('wrapper1')
  expect(document.getElementById('paper')).toBeDefined()
  expect(document.getElementById('wrapper1')).toBeDefined()
  expect(document.getElementById('wrapper2')).toBeDefined()
  expect(document.getElementById('wrapper11')).toBeNull()
  expect(document.getElementById('wrapper12')).toBeNull()

  chart.cleanUp('paper')
  expect(document.getElementById('paper')).toBeDefined()
  expect(document.getElementById('wrapper1')).toBeNull()
  expect(document.getElementById('wrapper2')).toBeNull()
  expect(document.getElementById('wrapper11')).toBeNull()
  expect(document.getElementById('wrapper12')).toBeNull()
})

test('Chart.validateData', () => {

  let chart = new Chart()
  let data, status;

  // Undefined data
  data = undefined
  try {
    status = chart.validateData( data )
  } catch (error) {
    expect(error).toBeDefined()
  }

  // Empty object
  data = {}
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Empty cups is undefined
  data = {
    "points":[{name:"Moon", angle:0}, {name:"Sun", angle:30}],
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Empty points is undefined
  data = {
    "cusps":[{angle:300}, {angle:340}, {angle:30}, {angle:60}, {angle:75}, {angle:90}, {angle:116}, {angle:172}, {angle:210}, {angle:236}, {angle:250}, {angle:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Empty keys
  data = {
    "points":[],
    "cusps":[]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Cups.length < 12
  data = {
    "points":[{name:"Moon", angle:0}, {name:"Sun", angle:30}],
    "cusps":[{angle:300}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Point.name == undefined
  data = {
    "points":[{angle:0}, {name:"Sun", angle:30}],
    "cusps":[{angle:300}, {angle:340}, {angle:30}, {angle:60}, {angle:75}, {angle:90}, {angle:116}, {angle:172}, {angle:210}, {angle:236}, {angle:250}, {angle:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Point.name == empty
  data = {
    "points":[{name:"", angle:0}, {name:"Sun", angle:30}],
    "cusps":[{angle:300}, {angle:340}, {angle:30}, {angle:60}, {angle:75}, {angle:90}, {angle:116}, {angle:172}, {angle:210}, {angle:236}, {angle:250}, {angle:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Point.angle == undefined
  data = {
    "points":[{name:"Moon"}, {name:"Sun", angle:30}],
    "cusps":[{angle:300}, {angle:340}, {angle:30}, {angle:60}, {angle:75}, {angle:90}, {angle:116}, {angle:172}, {angle:210}, {angle:236}, {angle:250}, {angle:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Point.angle != Number
  data = {
    "points":[{name:"Moon", angle:"abc"}, {name:"Sun", angle:30}],
    "cusps":[{angle:300}, {angle:340}, {angle:30}, {angle:60}, {angle:75}, {angle:90}, {angle:116}, {angle:172}, {angle:210}, {angle:236}, {angle:250}, {angle:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Cup.angle == undefined
  data = {
    "points":[{name:"Moon", angle:0}, {name:"Sun", angle:30}],
    "cusps":[{}, {angle:340}, {angle:30}, {angle:60}, {angle:75}, {angle:90}, {angle:116}, {angle:172}, {angle:210}, {angle:236}, {angle:250}, {angle:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Cup.angle != number
  data = {
    "points":[{name:"Moon", angle:0}, {name:"Sun", angle:30}],
    "cusps":[{angle:"abc"}, {angle:340}, {angle:30}, {angle:60}, {angle:75}, {angle:90}, {angle:116}, {angle:172}, {angle:210}, {angle:236}, {angle:250}, {angle:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // valid data
  data = {
    "points":[{name:"Moon", angle:0}, {name:"Sun", angle:30}],
    "cusps":[{angle:300}, {angle:340}, {angle:30}, {angle:60}, {angle:75}, {angle:90}, {angle:116}, {angle:172}, {angle:210}, {angle:236}, {angle:250}, {angle:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeTruthy()
});

test('Chart.getAspects', () => {

  const chart = new Chart()

  const ASPECT = [{name:"Conjunction", angle:0, orb:2}, {name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
  const FROM_POINTS = [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
  const TO_POINTS = [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]

  const aspects = chart.getAspects(FROM_POINTS, TO_POINTS, ASPECT)
    
  expect(aspects.length).toBe(7)
})
