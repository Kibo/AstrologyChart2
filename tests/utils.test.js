import Utils from '../src/utils/Utils.js'

test('Utils.degreeToRadian', () => {
  expect(Number(Utils.degreeToRadian(1).toFixed(4))).toBe(0.0175);
  expect(Number(Utils.degreeToRadian(30).toFixed(4))).toBe(0.5236);
  expect(Number(Utils.degreeToRadian(60).toFixed(4))).toBe(1.0472);
  expect(Number(Utils.degreeToRadian(90).toFixed(4))).toBe(1.5708);
  expect(Number(Utils.degreeToRadian(180).toFixed(4))).toBe(3.1416);
  expect(Number(Utils.degreeToRadian(360).toFixed(4))).toBe(6.2832);
});

test('Utils.degreeToRadianToDegree', () => {
  expect(Number(Utils.radianToDegree(1).toFixed(4))).toBe(57.2958);
  expect(Number(Utils.radianToDegree(2.5).toFixed(4))).toBe(143.2394);
  expect(Number(Utils.radianToDegree( Math.PI/3 ).toFixed(0))).toBe(60);
});


test('Utils.angleWithShifts', () => {
  expect( Utils.angleWithShifts(0,0)).toBe(57.2958);  
});
