import Point from '../src/points/Point.js'
import * as defaultSettings from '../src/settings/DefaultSettings.js';

test('Point.getAngleInSign', () => {
  const cusps = [{angle:0},{angle:30},{angle:60},{angle:90},{angle:120},{angle:150},{angle:180},{angle:210},{angle:240},{angle:270},{angle:300},{angle:330}]
  const d1 = {angle:0}
  const d2 = {angle:10}
  const d3 = {angle:181}
  const d4 = {angle:350}
  const d5 = {angle:365}
  const d6 = {angle:12.123}

  const p1 = new Point(d1, cusps)
  expect(p1.getAngleInSign()).toBe(0)

  const p2 = new Point(d2, cusps)
  expect(p2.getAngleInSign()).toBe(10)

  const p3 = new Point(d3, cusps)
  expect(p3.getAngleInSign()).toBe(1)

  const p4 = new Point(d4, cusps)
  expect(p4.getAngleInSign()).toBe(20)

  const p5 = new Point(d5, cusps)
  expect(p5.getAngleInSign()).toBe(5)

  const p6 = new Point(d6, cusps)
  expect(p6.getAngleInSign()).toBe(12)
});
