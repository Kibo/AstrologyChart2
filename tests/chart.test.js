import Chart from '../src/charts/Chart.js'
import * as defaultSettings from '../src/settings/DefaultSettings.js';

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
    "points":[{name:"Moon", position:0}, {name:"Sun", position:30}],
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Empty points is undefined
  data = {
    "cusps":[{position:300}, {position:340}, {position:30}, {position:60}, {position:75}, {position:90}, {position:116}, {position:172}, {position:210}, {position:236}, {position:250}, {position:274}]
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
    "points":[{name:"Moon", position:0}, {name:"Sun", position:30}],
    "cusps":[{position:300}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Point.name == undefined
  data = {
    "points":[{position:0}, {name:"Sun", position:30}],
    "cusps":[{position:300}, {position:340}, {position:30}, {position:60}, {position:75}, {position:90}, {position:116}, {position:172}, {position:210}, {position:236}, {position:250}, {position:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Point.name == empty
  data = {
    "points":[{name:"", position:0}, {name:"Sun", position:30}],
    "cusps":[{position:300}, {position:340}, {position:30}, {position:60}, {position:75}, {position:90}, {position:116}, {position:172}, {position:210}, {position:236}, {position:250}, {position:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Point.position == undefined
  data = {
    "points":[{name:"Moon"}, {name:"Sun", position:30}],
    "cusps":[{position:300}, {position:340}, {position:30}, {position:60}, {position:75}, {position:90}, {position:116}, {position:172}, {position:210}, {position:236}, {position:250}, {position:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Point.position != Number
  data = {
    "points":[{name:"Moon", position:"abc"}, {name:"Sun", position:30}],
    "cusps":[{position:300}, {position:340}, {position:30}, {position:60}, {position:75}, {position:90}, {position:116}, {position:172}, {position:210}, {position:236}, {position:250}, {position:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Cup.position == undefined
  data = {
    "points":[{name:"Moon", position:0}, {name:"Sun", position:30}],
    "cusps":[{}, {position:340}, {position:30}, {position:60}, {position:75}, {position:90}, {position:116}, {position:172}, {position:210}, {position:236}, {position:250}, {position:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // Cup.position != number
  data = {
    "points":[{name:"Moon", position:0}, {name:"Sun", position:30}],
    "cusps":[{position:"abc"}, {position:340}, {position:30}, {position:60}, {position:75}, {position:90}, {position:116}, {position:172}, {position:210}, {position:236}, {position:250}, {position:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeFalsy()

  // valid data
  data = {
    "points":[{name:"Moon", position:0}, {name:"Sun", position:30}],
    "cusps":[{position:300}, {position:340}, {position:30}, {position:60}, {position:75}, {position:90}, {position:116}, {position:172}, {position:210}, {position:236}, {position:250}, {position:274}]
  }
  status = chart.validateData( data )
  expect(status.isValid).toBeTruthy()
});
