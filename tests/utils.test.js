import Utils from '../src/utils/Utils.js'


test('Utils.degreeToRadian', () => {
  // Inverted results
  expect(Number(Utils.degreeToRadian(1).toFixed(4))).toBe(-0.0175);
  expect( Utils.degreeToRadian(60)).toBe(-Math.PI/3);
  expect( Utils.degreeToRadian(90) ).toBe(-Math.PI/2);
  expect( Utils.degreeToRadian(180) ).toBe(-Math.PI);
  expect( Utils.degreeToRadian(360) ).toBeLessThanOrEqual(0.000001)// 0
  expect( Utils.degreeToRadian(720) ).toBeLessThanOrEqual(0.000001)// 0
});

test('Utils.radianToDegree', () => {
  expect(Number(Utils.radianToDegree(1).toFixed(4))).toBe(57.2958);
  expect(Number(Utils.radianToDegree(2.5).toFixed(4))).toBe(143.2394);
  expect(Number(Utils.radianToDegree( Math.PI/3 ).toFixed(0))).toBe(60);
  expect(Number(Utils.radianToDegree( Math.PI/2 ).toFixed(0))).toBe(90);
  expect(Number(Utils.radianToDegree( Math.PI ).toFixed(0))).toBe(180);
  expect(Number(Utils.radianToDegree( 2*Math.PI).toFixed(0))).toBe(360);
  expect(Number(Utils.radianToDegree( 4*Math.PI).toFixed(0))).toBe(720);
});

test('Utils.positionOnCircle', () => {
  expect( Utils.positionOnCircle(0,0,1, 0)).toMatchObject( {x:1, y:0} )

  expect( Utils.positionOnCircle(0,0,1, Math.PI/3 ).x).toBeLessThanOrEqual(0.51)
  expect( Utils.positionOnCircle(0,0,1, Math.PI/3 ).y).toBeLessThanOrEqual(0.87)

  expect( Utils.positionOnCircle(0,0,1, Math.PI/2 ).x).toBeLessThanOrEqual(0.000001)// 0
  expect( Utils.positionOnCircle(0,0,1, Math.PI/2 ).y).toBeLessThanOrEqual(1)

  expect( Utils.positionOnCircle(0,0,1, 2*Math.PI ).x).toBeLessThanOrEqual(1)
  expect( Utils.positionOnCircle(0,0,1, 2*Math.PI ).y).toBeLessThanOrEqual(0.000001)// 0

  expect( Utils.positionOnCircle(0,0,1, 4*Math.PI ).x).toBeLessThanOrEqual(1)
  expect( Utils.positionOnCircle(0,0,1, 4*Math.PI ).y).toBeLessThanOrEqual(0.000001)// 0

  expect( Utils.positionOnCircle(0,0,1, 6*Math.PI ).x).toBeLessThanOrEqual(1)
  expect( Utils.positionOnCircle(0,0,1, 6*Math.PI ).y).toBeLessThanOrEqual(0.000001)// 0
});
