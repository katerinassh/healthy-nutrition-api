import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/user.entity';
import { RolesEnum } from '../src/user/enum/roles.enum';
import { AimEnum } from '../src/user/enum/aim.enum';
import { GenderEnum } from '../src/user/enum/gender.enum';

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
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // setup repositories
    userRepository = moduleFixture.get('UserRepository');

    // setup services
    jwtService = new JwtService({
      secretOrPrivateKey: process.env.JWT_ACCESS_SECRET,
    });

    user = await userRepository.save({
      email: 'test-email@gmail.com',
      password: '12345',
      firstName: 'Kateryna',
      lastName: 'Shakiryanova',
      role: RolesEnum.Customer
    });
    accessToken = jwtService.sign({
      id: user.id,
      email: user.email,
      roles: user.role,
    });
  });

  afterEach(async () => {
    accessToken = undefined;
    await userRepository.delete({ email: 'test-email@gmail.com' })
  });

  describe('/update-measurements (PATCH)', () => {
    const body = {
      age: 20,
      height: 174,
      weight: 65,
      gender: 'female',
      activity: 3
    };

    it('it should update measurements when user exists', async () => {
      return request(app.getHttpServer())
        .patch('/user/update-measurements')
        .set('Authorization', `Bearer ${ accessToken }`)
        .send(body)
        .expect(async (response: request.Response) => {
          expect(response.body.age).toBe(body.age);
          expect(response.body.height).toBe(body.height);
          expect(response.body.weight).toBe(body.weight);
          expect(response.body.gender).toBe(body.gender);
          expect(response.body.activity).toBe(body.activity);
          expect(response.body.calories).toBeNull();
          expect(response.body.fats).toBeNull();
          expect(response.body.protein).toBeNull();
          expect(response.body.carbohydrates).toBeNull();
        })
        .expect(HttpStatus.OK);
    });
    it('it should return not foound error that user doesn`t exist', async () => {
      await userRepository.delete({ email: 'test-email@gmail.com' })
      return request(app.getHttpServer())
        .patch('/user/update-measurements')
        .set('Authorization', `Bearer ${ accessToken }`)
        .send(body)
        .expect(async (response: request.Response) => {
          expect(response.body.message).toBe('User does not exist');
        })
        .expect(HttpStatus.NOT_FOUND);
    });
    it('it should return unauthorize error when access token is missing', async () => {
      return request(app.getHttpServer())
        .patch('/user/update-measurements')
        .send(body)
        .expect(async (response: request.Response) => {
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/macronutrient-ratios (GET)', () => {
    const body = {
      age: 20,
      height: 174,
      weight: 65,
      gender: GenderEnum.FEMALE,
      activity: 3
    };

    it('it should return macronutrient ratios without warning', async () => {
      user = { ...user, ...body };
      await userRepository.save(user);

      return request(app.getHttpServer())
        .get(`/user/macronutrient-ratios?weeks=20&idealWeight=60&aim=${AimEnum.LOSE}`)
        .set('Authorization', `Bearer ${ accessToken }`)
        .expect(async (response: request.Response) => {
          expect(response.body).toHaveProperty('protein');
          expect(response.body).toHaveProperty('fats');
          expect(response.body).toHaveProperty('carbohydrates');
          expect(response.body).toHaveProperty('calories');
          expect(response.body).toHaveProperty('warning');
          expect(response.body.warning).toBeNull();
        })
        .expect(HttpStatus.OK);
    });
    it('it should return macronutrient ratios with warning', async () => {
      user = { ...user, ...body };
      await userRepository.save(user);

      return request(app.getHttpServer())
        .get(`/user/macronutrient-ratios?weeks=2&idealWeight=50&aim=${AimEnum.LOSE}`)
        .set('Authorization', `Bearer ${ accessToken }`)
        .expect(async (response: request.Response) => {
          expect(response.body).toHaveProperty('protein');
          expect(response.body).toHaveProperty('fats');
          expect(response.body).toHaveProperty('carbohydrates');
          expect(response.body).toHaveProperty('calories');
          expect(response.body).toHaveProperty('warning');
          expect(response.body.warning).toBe('We don`t recommend you lose weight so quick');
        })
        .expect(HttpStatus.OK);
    });
    it('it should return an error that this is not enough data to return calories amount', async () => {
      return request(app.getHttpServer())
        .get(`/user/macronutrient-ratios`)
        .set('Authorization', `Bearer ${ accessToken }`)
        .expect(async (response: request.Response) => {
          expect(response.body.message).toBe('No enough data');
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
    it('it should return not foound error that user doesn`t exist', async () => {
      await userRepository.delete({ email: 'test-email@gmail.com' })
      return request(app.getHttpServer())
        .get(`/user/macronutrient-ratios`)
        .set('Authorization', `Bearer ${ accessToken }`)
        .expect(async (response: request.Response) => {
          expect(response.body.message).toBe('User does not exist');
        })
        .expect(HttpStatus.NOT_FOUND);
    });
    it('it should return unauthorize error when access token is missing', async () => {
      return request(app.getHttpServer())
        .get(`/user/macronutrient-ratios`)
        .expect(async (response: request.Response) => {
          expect(response.body.message).toBe('Unauthorized');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  })
});