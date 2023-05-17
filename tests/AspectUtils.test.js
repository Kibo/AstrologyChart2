import AspectUtils from '../src/utils/AspectUtils.js'

test('AspectUtils.orb', () => {
  expect( AspectUtils.orb(0, 0, 0) ).toBe(0)

  expect( AspectUtils.orb(0, 10, 10) ).toBe(0)
  expect( AspectUtils.orb(0, 60, 60) ).toBe(0)

  expect( AspectUtils.orb(10, 12, 0) ).toBe(-2)
  expect( AspectUtils.orb(12, 10, 0) ).toBe(2)

  expect( AspectUtils.orb(10, 45, 45) ).toBe(10)
  expect( AspectUtils.orb(45, 10, 45) ).toBe(-10)

  expect( AspectUtils.orb(0, 46, 45) ).toBe(-1)
  expect( AspectUtils.orb(46, 0, 45) ).toBe(1)

  expect( AspectUtils.orb(350, 20, 30) ).toBe(0)
  expect( AspectUtils.orb(20, 350, 30) ).toBe(0)

  expect( AspectUtils.orb(350, 21, 30) ).toBe(-1)
  expect( AspectUtils.orb(351, 20, 30) ).toBe(1)

  expect( AspectUtils.orb(1, 180, 180) ).toBe(1)
  expect( AspectUtils.orb(180, 1, 180) ).toBe(-1)

  expect( AspectUtils.orb(359, 180, 180) ).toBe(-1)
  expect( AspectUtils.orb(180, 359, 180) ).toBe(1)

  expect( AspectUtils.orb(0.55, 180, 180) ).toBe(0.55)
  expect( AspectUtils.orb(180, 0.55, 180) ).toBe(-0.55)
})

test('AspectUtils.getAspects', () => {

  const ASPECT = [{name:"Conjunction", angle:0, orb:2}, {name:"Opposition", angle:180, orb:2}, {name:"Trine", angle:120, orb:2}]
  const FROM_POINTS = [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]
  const TO_POINTS = [{name:"Moon", angle:0}, {name:"Sun", angle:179}, {name:"Mercury", angle:121}]

  const aspects = AspectUtils.getAspects(FROM_POINTS, TO_POINTS, ASPECT)

  expect(aspects.length).toBe(7)
})
