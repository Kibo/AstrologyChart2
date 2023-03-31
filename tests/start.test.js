const request = require("supertest");
const app = require("../server.js");

beforeAll(() => {
  process.env.NODE_ENV = 'test';
})

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request( app )
      .get("/pages/o-nas")
      .then( response => {
        expect(response.statusCode).toBe(200);
        done();
      });

  });
});
