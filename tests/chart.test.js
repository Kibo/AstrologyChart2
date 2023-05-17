import Chart from '../src/charts/Chart.js'
import defaultSettings from '../src/settings/DefaultSettings.js';

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
