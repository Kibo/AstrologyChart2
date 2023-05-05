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

test('Utils.isCollision', () => {
  const COLLISION_RADIUS = 10

  expect( Utils.isCollision(50, [60], COLLISION_RADIUS) ).toBeTruthy()
  expect( Utils.isCollision(60, [60], COLLISION_RADIUS) ).toBeTruthy()
  expect( Utils.isCollision(70, [60], COLLISION_RADIUS) ).toBeTruthy()

  expect( Utils.isCollision(170, [180], COLLISION_RADIUS) ).toBeTruthy()
  expect( Utils.isCollision(180, [180], COLLISION_RADIUS) ).toBeTruthy()
  expect( Utils.isCollision(190, [180], COLLISION_RADIUS) ).toBeTruthy()

  expect( Utils.isCollision(350, [0], COLLISION_RADIUS) ).toBeTruthy()
  expect( Utils.isCollision(0, [0], COLLISION_RADIUS) ).toBeTruthy()
  expect( Utils.isCollision(10, [0], COLLISION_RADIUS) ).toBeTruthy()

  expect( Utils.isCollision(340, [350], COLLISION_RADIUS) ).toBeTruthy()
  expect( Utils.isCollision(350, [350], COLLISION_RADIUS) ).toBeTruthy()
  expect( Utils.isCollision(0, [350], COLLISION_RADIUS) ).toBeTruthy()

  expect( Utils.isCollision(349, [0], COLLISION_RADIUS) ).toBeFalsy()
  expect( Utils.isCollision(11, [0], COLLISION_RADIUS) ).toBeFalsy()

  expect( Utils.isCollision(339, [350], COLLISION_RADIUS) ).toBeFalsy()
  expect( Utils.isCollision(1, [350], COLLISION_RADIUS) ).toBeFalsy()
});

test('Utils.positionToAngle', () => {
  expect( Utils.positionToAngle(0, 0, 0, 1) ).toBe(90)
  expect( Utils.positionToAngle(0, 0, 0, -1) ).toBe(-90)
  expect( Utils.positionToAngle(0, 0, 1, 0) ).toBe(0)
  expect( Utils.positionToAngle(0, 0, -1, 0) ).toBe(180)
});

test('Utils.orb', () => {
  expect( Utils.orb(0, 0, 0) ).toBe(0)

  expect( Utils.orb(0, 10, 10) ).toBe(0)
  expect( Utils.orb(0, 60, 60) ).toBe(0)

  expect( Utils.orb(10, 12, 0) ).toBe(-2)
  expect( Utils.orb(12, 10, 0) ).toBe(2)

  expect( Utils.orb(10, 45, 45) ).toBe(10)
  expect( Utils.orb(45, 10, 45) ).toBe(-10)

  expect( Utils.orb(0, 46, 45) ).toBe(-1)
  expect( Utils.orb(46, 0, 45) ).toBe(1)

  expect( Utils.orb(350, 20, 30) ).toBe(0)
  expect( Utils.orb(20, 350, 30) ).toBe(0)

  expect( Utils.orb(350, 21, 30) ).toBe(-1)
  expect( Utils.orb(351, 20, 30) ).toBe(1)

  expect( Utils.orb(1, 180, 180) ).toBe(1)
  expect( Utils.orb(180, 1, 180) ).toBe(-1)

  expect( Utils.orb(359, 180, 180) ).toBe(-1)
  expect( Utils.orb(180, 359, 180) ).toBe(1)

  expect( Utils.orb(0.55, 180, 180) ).toBe(0.55)
  expect( Utils.orb(180, 0.55, 180) ).toBe(-0.55)

})
