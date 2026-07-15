const request = require('supertest');
jest.mock('../db', () => ({ query: jest.fn() }));
const app = require('../index');

describe('Backend smoke tests', () => {
  test('GET / responde con texto de bienvenida', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/backend funcionando/i);
  });
});
