import request from "supertest";

import { application } from "../src/core";

describe("ShiftState Admin API", () => {
  test("GET /api/health-check returns a 200", (done) => {
    request(application).get("/api/health-check").expect(200, done);
  });
});
