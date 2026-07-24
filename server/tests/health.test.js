const request = require("supertest");
const app = require("../app");

describe("KnightMarketplace API health endpoint", () => {
  test("GET /api/health returns API status information", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      status: "ok",
      service: "KnightMarketplace API",
    });
  });

  test("unknown routes return 404", async () => {
    const response = await request(app).get(
      "/api/route-that-does-not-exist"
    );

    expect(response.statusCode).toBe(404);
  });
});
