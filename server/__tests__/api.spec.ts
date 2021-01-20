import request from "supertest";
import { initialize, configManager } from "../src/core";
import * as routers from "../src/routers";

const TEST_CONFIG = configManager()
  .addRouter(routers.authRouter.mount, routers.healthCheckRouter.mount)
  .getConfig();
const application = initialize(TEST_CONFIG);

describe("ShiftState Admin API", () => {
  test("GET /api/health-check returns a 200", (done) => {
    request(application).get("/api/health-check").expect(200, done);
  });
  describe("ShiftState Admin Auth API", () => {
    describe("Sign Up", () => {
      test("POST /api/sign-up without emailAddress or password returns a 400", (done) => {
        request(application)
          .post("/api/sign-up")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(400, done);
      });
    });
  });
  describe("ShiftState Admin Filters API", () => {
    describe.skip("GET /api/filters", () => {});
    describe.skip("GET /api/filters/:filterId", () => {});
    describe.skip("PUT /api/filters/:filterId", () => {});
    describe.skip("DELETE /api/filters/:filterId", () => {});
    describe.skip("POST /api/filters", () => {});
  });
});
