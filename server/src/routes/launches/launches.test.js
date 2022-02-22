const request = require("supertest");
const app = require("../../app");

const mongoConnect = require("../../services/mongo");

describe("Launch API ", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
      // expect(response.statusCode).toBe(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "Zeph",
      rocket: "NCC 1701-d",
      target: "Kepler-186 f",
      launchDate: "January 14,2028",
    };

    const launchDataWithoutDate = {
      mission: "Zeph",
      rocket: "NCC 1701-d",
      target: "Kepler-186 f",
    };

    const launchDataWithWrongDate = {
      mission: "Zeph",
      rocket: "NCC 1701-d",
      target: "Kepler-186 f",
      launchDate: "yeet",
    };

    test("It should response with 201 success", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property. ",
      });
    });
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithWrongDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Not a valid date",
      });
    });
  });
});
