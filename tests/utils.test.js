import Utils from '../src/utils/Utils.js'


test('Utils.degreeToRadian', () => {
  // Inverted results
  expect(Number(Utils.degreeToRadian(1).toFixed(4))).toBe(-0.0175);
  expect( Utils.degreeToRadian(60)).toBe(-Math.PI/3);
  expect( Utils.degreeToRadian(90) ).toBe(-Math.PI/2);
  expect( Utils.degreeToRadian(180) ).toBe(-Math.PI);
  expect(Number(Utils.degreeToRadian(360).toFixed(4))).toBe(0);
  expect(Number(Utils.degreeToRadian(720).toFixed(4))).toBe(0);
});

test('Utils.radianToDegree', () => {
  expect(Number(Utils.radianToDegree(1).toFixed(4))).toBe(57.2958);
  expect(Number(Utils.radianToDegree(2.5).toFixed(4))).toBe(143.2394);
  expect(Number(Utils.radianToDegree( Math.PI/3 ).toFixed(0))).toBe(60);
  expect(Number(Utils.radianToDegree( Math.PI/2 ).toFixed(0))).toBe(90);
  expect(Number(Utils.radianToDegree( Math.PI ).toFixed(0))).toBe(180);
  expect(Number(Utils.radianToDegree( 2*Math.PI).toFixed(0))).toBe(0);
  expect(Number(Utils.radianToDegree( 4*Math.PI).toFixed(0))).toBe(0);
});

test('Utils.positionOnCircle', () => {
  expect( Utils.positionOnCircle(0,0,1, 0)).toMatchObject( {x:1, y:0} )
  expect( Utils.positionOnCircle(0,0,1, Math.PI/3 )).toMatchObject( {x:1, y:1} )
  expect( Utils.positionOnCircle(0,0,1, Math.PI/2 )).toMatchObject( {x:0, y:1})
  expect( Utils.positionOnCircle(0,0,1, 2*Math.PI )).toMatchObject( {x:1, y:0})
  expect( Utils.positionOnCircle(0,0,1, 4*Math.PI )).toMatchObject( {x:1, y:0} )
  expect( Utils.positionOnCircle(0,0,1, 6*Math.PI )).toMatchObject( {x:1, y:0} )
});
