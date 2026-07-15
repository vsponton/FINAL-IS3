const request = require("supertest");
const app = require("../index"); 

describe("Health", () => {
  it("GET /health -> 200", async () => {
    const res = await request(app).get("/health");
    expect([200, 204]).toContain(res.statusCode);
  });
});

test('GET /health no expone X-Powered-By', async () => {
  const res = await request(app).get('/health');
  expect(res.headers['x-powered-by']).toBeUndefined();
});
test('ruta inexistente devuelve 404', async () => {
  const res = await request(app).get('/ruta-que-no-existe');
  expect(res.status).toBe(404);
});