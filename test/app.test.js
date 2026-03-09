const request = require('supertest');
const app = require('../server');
const { add, subtract, multiply, divide } = require('../index');

// ── Tests unitaires (logique pure) ──────────────────────────────────────────
describe('Calculatrice - Tests unitaires', () => {
  test('Addition : 3 + 5 = 8', () => {
    expect(add(3, 5)).toBe(8);
  });

  test('Soustraction : 10 - 4 = 6', () => {
    expect(subtract(10, 4)).toBe(6);
  });

  test('Multiplication : 6 x 7 = 42', () => {
    expect(multiply(6, 7)).toBe(42);
  });

  test('Division : 20 / 4 = 5', () => {
    expect(divide(20, 4)).toBe(5);
  });

  test('Division par zéro lève une erreur', () => {
    expect(() => divide(10, 0)).toThrow('Division par zéro impossible');
  });

  test('Addition avec négatifs : -3 + (-7) = -10', () => {
    expect(add(-3, -7)).toBe(-10);
  });

  test('Multiplication par 0 = 0', () => {
    expect(multiply(99, 0)).toBe(0);
  });
});

// ── Tests d'intégration (API HTTP) ──────────────────────────────────────────
describe('Calculatrice - Tests API HTTP', () => {
  test('GET /add?a=2&b=3 -> 5', async () => {
    const res = await request(app).get('/add?a=2&b=3');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(5);
  });

  test('GET /subtract?a=9&b=4 -> 5', async () => {
    const res = await request(app).get('/subtract?a=9&b=4');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(5);
  });

  test('GET /multiply?a=3&b=6 -> 18', async () => {
    const res = await request(app).get('/multiply?a=3&b=6');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(18);
  });

  test('GET /divide?a=15&b=3 -> 5', async () => {
    const res = await request(app).get('/divide?a=15&b=3');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(5);
  });

  test('GET /divide?a=10&b=0 -> erreur 400', async () => {
    const res = await request(app).get('/divide?a=10&b=0');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Division par zéro impossible');
  });

  test('GET /add sans paramètres -> erreur 400', async () => {
    const res = await request(app).get('/add?a=abc&b=3');
    expect(res.statusCode).toBe(400);
  });
});
