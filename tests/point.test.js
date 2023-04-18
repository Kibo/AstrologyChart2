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

  const p1 = new Point(d1, cusps, defaultSettings)
  expect(p1.getAngleInSign()).toBe(0)

  const p2 = new Point(d2, cusps, defaultSettings)
  expect(p2.getAngleInSign()).toBe(10)

  const p3 = new Point(d3, cusps, defaultSettings)
  expect(p3.getAngleInSign()).toBe(1)

  const p4 = new Point(d4, cusps, defaultSettings)
  expect(p4.getAngleInSign()).toBe(20)

  const p5 = new Point(d5, cusps, defaultSettings)
  expect(p5.getAngleInSign()).toBe(5)

  const p6 = new Point(d6, cusps, defaultSettings)
  expect(p6.getAngleInSign()).toBe(12)
});

test('Point.getSignNumber', () => {
  const cusps = [{angle:0},{angle:30},{angle:60},{angle:90},{angle:120},{angle:150},{angle:180},{angle:210},{angle:240},{angle:270},{angle:300},{angle:330}]

  expect( new Point({name:"Sun", angle:0}, cusps, defaultSettings).getSignNumber() ).toBe(1)
  expect( new Point({name:"Sun", angle:1}, cusps, defaultSettings).getSignNumber() ).toBe(1)
  expect( new Point({name:"Sun", angle:30}, cusps, defaultSettings).getSignNumber() ).toBe(2)
  expect( new Point({name:"Sun", angle:360}, cusps, defaultSettings).getSignNumber() ).toBe(1)
  expect( new Point({name:"Sun", angle:359.99999}, cusps, defaultSettings).getSignNumber() ).toBe(12)
  expect( new Point({name:"Sun", angle:179.99}, cusps, defaultSettings).getSignNumber() ).toBe(6)
  expect( new Point({name:"Sun", angle:180}, cusps, defaultSettings).getSignNumber() ).toBe(7)
});

test('Point.getDignity', () => {

  const RULERSHIP_SYMBOL = "r"
  const DETRIMENT_SYMBOL = "d"
  const FALL_SYMBOL = "f"
  const EXALTATION_SYMBOL = "e"

  const ARIES = 0
  const TAURUS = 30
  const GEMINI = 60
  const CANCER = 90
  const LEO = 120
  const VIRGO = 150
  const LIBRA = 180
  const SCORPIO = 210
  const SAGITTARIUS = 240
  const CAPRICORN = 270
  const AQUARIUS = 300
  const PISCES = 330

  const cusps = [{angle:0},{angle:30},{angle:60},{angle:90},{angle:120},{angle:150},{angle:180},{angle:210},{angle:240},{angle:270},{angle:300},{angle:330}]

  expect( new Point({name:"Sun", angle:LEO}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Sun", angle:AQUARIUS}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Sun", angle:ARIES}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Sun", angle:VIRGO}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)

  expect( new Point({name:"Moon", angle:CANCER}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Moon", angle:CAPRICORN}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Moon", angle:TAURUS}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Moon", angle:SCORPIO}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)

  expect( new Point({name:"Mercury", angle:GEMINI}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Mercury", angle:SAGITTARIUS}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Mercury", angle:VIRGO}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Mercury", angle:PISCES}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)

  expect( new Point({name:"Venus", angle:TAURUS}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Venus", angle:LIBRA}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Venus", angle:ARIES}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Venus", angle:SCORPIO}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Venus", angle:PISCES}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Venus", angle:VIRGO}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)

  expect( new Point({name:"Mars", angle:ARIES}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Mars", angle:SCORPIO}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Mars", angle:TAURUS}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Mars", angle:LIBRA}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Mars", angle:CAPRICORN}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Mars", angle:CANCER}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)

  expect( new Point({name:"Jupiter", angle:SAGITTARIUS}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Jupiter", angle:PISCES}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Jupiter", angle:GEMINI}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Jupiter", angle:VIRGO}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Jupiter", angle:CANCER}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Jupiter", angle:CAPRICORN}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)

  expect( new Point({name:"Saturn", angle:CAPRICORN}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Saturn", angle:AQUARIUS}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Saturn", angle:CANCER}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Saturn", angle:LEO}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Saturn", angle:LIBRA}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Saturn", angle:ARIES}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)

  expect( new Point({name:"Uranus", angle:AQUARIUS}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Uranus", angle:LEO}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Uranus", angle:SCORPIO}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Uranus", angle:TAURUS}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)

  expect( new Point({name:"Neptune", angle:PISCES}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Neptune", angle:VIRGO}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Neptune", angle:LEO}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Neptune", angle:SAGITTARIUS}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Neptune", angle:AQUARIUS}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)
  expect( new Point({name:"Neptune", angle:GEMINI}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)

  expect( new Point({name:"Pluto", angle:SCORPIO}, cusps, defaultSettings).getDignity() ).toBe(RULERSHIP_SYMBOL)
  expect( new Point({name:"Pluto", angle:TAURUS}, cusps, defaultSettings).getDignity() ).toBe(DETRIMENT_SYMBOL)
  expect( new Point({name:"Pluto", angle:ARIES}, cusps, defaultSettings).getDignity() ).toBe(EXALTATION_SYMBOL)
  expect( new Point({name:"Pluto", angle:LIBRA}, cusps, defaultSettings).getDignity() ).toBe(FALL_SYMBOL)

  expect( new Point({name:"ABC", angle:LIBRA}, cusps, defaultSettings).getDignity() ).toBe("")
});
