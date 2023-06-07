import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let user: User;
  let accessToken: string;

  beforeEach(async () => {
    // init app
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // setup repositories
    userRepository = moduleFixture.get('UserRepository');

    // setup services
    jwtService = new JwtService({
      secretOrPrivateKey: process.env.JWT_SECRET,
    });

    // customerAuthToken = jwtService.sign({
    //   email: customer.user.email,
    //   roles: customer.user.roles,
    // });
  });

  afterEach(() => {
    accessToken = undefined;
  });

  describe('update-measurements (PATCH)', () => {
    it('it should update measurements when user exists', () => {
      // return request(app.getHttpServer())
      //   .patch('/user/update-measurements')
      //   .set('Accept', 'application/json')
      //   .send({})
      //   .expect((response: request.Response) => {
      //     const {
      //       id,
      //       givenName,
      //       familyName,
      //       password,
      //       email,
      //       imagePath,
      //       role,
      //     } = response.body;

      //     expect(typeof id).toBe("number"),
      //       expect(givenName).toEqual(mockUser.givenName),
      //       expect(familyName).toEqual(mockUser.familyName),
      //       expect(email).toEqual(mockUser.email),
      //       expect(password).toBeUndefined();
      //     expect(imagePath).toBeNull();
      //     expect(role).toEqual("user");
      //   })
      //   .expect(HttpStatus.CREATED);
    });
  });
});