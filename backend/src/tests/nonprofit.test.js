const request = require('supertest');
const app = require('../server');

describe('Nonprofit Search Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    // Login to get authentication token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    authToken = loginResponse.body.data.token;
  });

  describe('POST /api/nonprofit/search', () => {
    it('should search by EIN', async () => {
      const response = await request(app)
        .post('/api/nonprofit/search')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ein: '123456789'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organization).toBeDefined();
      expect(response.body.data.organization.ein).toBe('123456789');
    });

    it('should search by organization name', async () => {
      const response = await request(app)
        .post('/api/nonprofit/search')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          organizationName: 'Test Organization'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organization).toBeDefined();
      expect(response.body.data.organization.name).toBe('Test Organization');
    });

    it('should require either EIN or organization name', async () => {
      const response = await request(app)
        .post('/api/nonprofit/search')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/nonprofit/search')
        .send({
          ein: '123456789'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/nonprofit/:ein', () => {
    it('should get nonprofit by EIN', async () => {
      const response = await request(app)
        .get('/api/nonprofit/123456789')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.organization.ein).toBe('123456789');
    });

    it('should validate EIN format', async () => {
      const response = await request(app)
        .get('/api/nonprofit/invalid-ein')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});


