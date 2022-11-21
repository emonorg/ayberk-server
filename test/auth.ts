import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { AppModule } from 'src/app.module';
import { TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { registerGlobals } from 'src/main';

export const authTests = () =>
  describe('Ayberk server (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = await moduleRef.createNestApplication();
      registerGlobals(app);
      await app.listen(3333);
    });

    afterAll(async () => {
      await app.close();
    });

    it('Sign-in as root operator', async () => {
      await request(app.getHttpServer())
        .post('/auth/operator/sign-in')
        .send({ username: 'root', password: 'root_password' })
        .expect(201)
        .expect(({ body }) => {
          expect(body.data.accessToken).toBeDefined();
          expect(body.data.ttl).toBeDefined();
        });
    });

    it("shouldn't be able to sign-in with invalid credentials", async () => {
      await request(app.getHttpServer())
        .post('/auth/operator/sign-in')
        .send({
          username: faker.internet.userName(),
          password: faker.internet.password(),
        })
        .expect(401);
    });
  });
