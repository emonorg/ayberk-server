import * as request from 'supertest';
import { APP_URL } from 'test/utils/constants';
import { faker } from '@faker-js/faker';
import { IOperatorSession } from 'src/auth/interfaces/operatorSession.interface';
import { OperatorDocument } from 'src/operator/models/operator.model';
import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { registerGlobals } from 'src/main';

export const privilegeTests = () =>
  describe('Environment (e2e)', () => {
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
    let rootAccessToken: IOperatorSession;
    let operator: OperatorDocument;

    const fakeUsername = faker.internet.userName();
    const fakePassword = faker.internet.password();
    const fakeFullName = faker.name.fullName();

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

      const newOperatorResponse = await request(app.getHttpServer())
        .post('/operators')
        .send({
          username: fakeUsername,
          password: fakePassword,
          name: fakeFullName,
        })
        .set('Authorization', generateAccessToken());
      operator = newOperatorResponse.body.data;
    });

    it('Create ', async () => {
      await request(app.getHttpServer())
        .post('/auth/operator/sign-in')
        .send({
          username: faker.internet.userName(),
          password: faker.internet.password(),
        })
        .expect(401);
    });
  });
