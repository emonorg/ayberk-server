import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { IOperatorSession } from 'src/auth/interfaces/operatorSession.interface';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { registerGlobals } from 'src/main';

export const operatorTests = () =>
  describe('Operator (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = await moduleRef.createNestApplication();
      await registerGlobals(app);
      await app.listen(3333);
    });

    afterAll(async () => {
      await app.close();
    });

    let rootAccessToken: IOperatorSession;

    function generateAccessToken() {
      return 'Bearer ' + rootAccessToken.accessToken;
    }

    beforeAll(async () => {
      const rootSignInResponse = await request(app.getHttpServer())
        .post('/auth/operator/sign-in')
        .send({ username: 'root', password: 'root_password' })
        .expect(201)
        .expect(({ body }) => {
          expect(body.data.accessToken).toBeDefined();
          expect(body.data.ttl).toBeDefined();
        });
      rootAccessToken = rootSignInResponse.body.data;
    });

    const fakeUsername = faker.internet.userName();
    const fakePassword = faker.internet.password();
    const fakeFullName = faker.name.fullName();

    it("shouldn't be able to create root operator", async () => {
      await request(app.getHttpServer())
        .post('/operators')
        .send({
          username: 'root',
          password: 'root_password',
          name: fakeFullName,
        })
        .set('Authorization', generateAccessToken())
        .expect(400);
    });

    it("Shouldn't be able to create new operator with invalid authorization", async () => {
      await request(app.getHttpServer())
        .post('/operators')
        .send({
          username: fakeUsername,
          password: fakePassword,
          name: fakeFullName,
        })
        .set('Authorization', generateAccessToken() + '--')
        .expect(401);
    });

    it("Shouldn't be able to create new operator without root authorization", async () => {
      await request(app.getHttpServer())
        .post('/operators')
        .send({
          username: fakeUsername,
          password: fakePassword,
          name: fakeFullName,
        })
        .expect(401);
    });

    it('Create new operator', async () => {
      await request(app.getHttpServer())
        .post('/operators')
        .send({
          username: fakeUsername,
          password: fakePassword,
          name: fakeFullName,
        })
        .set('Authorization', generateAccessToken())
        .expect(201)
        .expect(({ body }) => {
          expect(body.data.username).toEqual(fakeUsername);
          expect(body.data.name).toEqual(fakeFullName);
          expect(body.data.isActive).toEqual(true);
          expect(body.data._id).toBeDefined();
          expect(body.data.privileges).toEqual([]);
        });
    });

    it("Shouldn't be able to create operator with used username", async () => {
      await request(app.getHttpServer())
        .post('/operators')
        .send({
          username: fakeUsername,
          password: fakePassword,
          name: faker.name.fullName(),
        })
        .set('Authorization', generateAccessToken())
        .expect(400);
    });

    it("Shouldn't be able to create operator with used full name", async () => {
      await request(app.getHttpServer())
        .post('/operators')
        .send({
          username: faker.internet.userName(),
          password: faker.internet.password(),
          name: fakeFullName,
        })
        .set('Authorization', generateAccessToken())
        .expect(400);
    });
  });
