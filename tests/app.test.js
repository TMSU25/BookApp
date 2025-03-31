// tests/app.test.js
const request = require('supertest');
const app = require('../app');

describe('BookApp Integration Tests (Safe version)', () => {

  // Test 1: Ensure the homepage renders successfully
  test('GET / should return 200 with homepage', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);           // Expect HTTP 200 OK
    expect(res.text).toContain('<html');        // Check if HTML is rendered
  });

  // Test 2: Verify the /books/manage route loads correctly
  test('GET /books/manage should return 200', async () => {
    const res = await request(app).get('/books/manage');
    expect(res.statusCode).toBe(200);           // Expect HTTP 200 OK
    expect(res.text).toContain('<html');        // Check for rendered HTML
  });

  // Test 3: Confirm that an invalid route returns 404 Not Found
  test('GET /non-existent-route should return 404', async () => {
    const res = await request(app).get('/this-does-not-exist');
    expect(res.statusCode).toBe(404);           // Expect HTTP 404 Not Found
  });

});
