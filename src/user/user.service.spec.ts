import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { Product } from '../../src/product/entities/product.entity';
import { ConfiguredProduct } from '../../src/product/entities/configuredProduct.entity';
import { Meal } from '../../src/meal/meal.entity';
import { RolesEnum } from './enum/roles.enum';
import { JwtService } from "@nestjs/jwt";
import { GenderEnum } from "./enum/gender.enum";

describe('UserService', () => {
  let service: UserService;
  let jwtService: JwtService;
  let module: TestingModule;
  let userRepository: Repository<User>;
  let user: User;
  let userWithoutPassword: User;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: +process.env.POSTGRES_PORT,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          entities: [User, Product, ConfiguredProduct, Meal],
        }),
        TypeOrmModule.forFeature([User])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    jwtService = new JwtService({
      secretOrPrivateKey: process.env.JWT_ACCESS_SECRET,
    });

    userRepository = module.get('UserRepository');
    user = await userRepository.save({
      email: 'test-email@gmail.com',
      password: '12345',
      firstName: 'Kateryna',
      lastName: 'Shakiryanova',
      role: RolesEnum.Customer
    });

    userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
  });

  afterAll(async () => {
    await userRepository.delete({ email: user.email });
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user without password by email', async () => {
    const res = await service.getByEmail(user.email);
    expect(res).toBeDefined();
    expect(res).toMatchObject(userWithoutPassword);
  });

  it('should return user without password by id', async () => {
    const res = await service.getById(user.id);
    expect(res).toBeDefined();
    expect(res).toMatchObject(userWithoutPassword);
  });

  it('should return user with password by email', async () => {
    const res = await service.getUserWithPassword(user.email);
    expect(res).toBeDefined();
    expect(res).toMatchObject(user);
  });

  it('should create a customer', async () => {
    const email = 'create-customer@gmail.com';
    const password = '12345';
    const firstName = 'Customer';
    const lastName = 'MyPersonal';
    const res = await service.createCustomer({ email, password, firstName, lastName });

    expect(res).toBeDefined();
    expect(res).toHaveProperty('firstName');
    expect(res).toHaveProperty('lastName');
    expect(res).toHaveProperty('email');
    expect(res).toHaveProperty('password');
    expect(res).toHaveProperty('gender');
    expect(res).toHaveProperty('age');
    expect(res).toHaveProperty('height');
    expect(res).toHaveProperty('weight');
    expect(res).toHaveProperty('activity');
    expect(res).toHaveProperty('calories');
    expect(res).toHaveProperty('protein');
    expect(res).toHaveProperty('fats');
    expect(res).toHaveProperty('carbohydrates');
    expect(res).toHaveProperty('role');
    expect(res).toHaveProperty('refreshToken');
    expect(res.role).toBe(RolesEnum.Customer);
    expect(res.gender).toBeNull();
    expect(res.age).toBeNull();
    expect(res.height).toBeNull();
    expect(res.weight).toBeNull();
    expect(res.activity).toBeNull();
    expect(res.calories).toBeNull();
    expect(res.protein).toBeNull();
    expect(res.fats).toBeNull();
    expect(res.carbohydrates).toBeNull();
    expect(res.firstName).toBe(firstName);
    expect(res.lastName).toBe(lastName);
    expect(res.email).toBe(email);

    await userRepository.delete({ email: res.email })
  });

  it('should create admin without personal data', async () => {
    const email = 'create-admin@gmail.com';
    const res = await service.createBlankAdmin(email);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('firstName');
    expect(res).toHaveProperty('lastName');
    expect(res).toHaveProperty('email');
    expect(res).toHaveProperty('password');
    expect(res).toHaveProperty('gender');
    expect(res).toHaveProperty('age');
    expect(res).toHaveProperty('height');
    expect(res).toHaveProperty('weight');
    expect(res).toHaveProperty('activity');
    expect(res).toHaveProperty('calories');
    expect(res).toHaveProperty('protein');
    expect(res).toHaveProperty('fats');
    expect(res).toHaveProperty('carbohydrates');
    expect(res).toHaveProperty('role');
    expect(res).toHaveProperty('refreshToken');
    expect(res.role).toBe(RolesEnum.Admin);
    expect(res.gender).toBeNull();
    expect(res.age).toBeNull();
    expect(res.height).toBeNull();
    expect(res.weight).toBeNull();
    expect(res.activity).toBeNull();
    expect(res.calories).toBeNull();
    expect(res.protein).toBeNull();
    expect(res.fats).toBeNull();
    expect(res.carbohydrates).toBeNull();
    expect(res.firstName).toBe('blank');
    expect(res.lastName).toBe('blank');
    expect(res.email).toBe(email);
    expect(res.password).toBeTruthy();

    await userRepository.delete({ email: res.email })
  });

  it('should only update refresh token', async () => {
    const refreshTokenInput = jwtService.sign({
      id: user.id,
      email: user.email,
      roles: user.role,
    });
    const res = await service.updateRefreshToken(user.id, refreshTokenInput);
    const { refreshToken } = await userRepository.findOne({ where: { id: user.id } });

    expect(res).toBeUndefined();
    expect(refreshToken).toBe(refreshTokenInput);
  });

  it('should only update user first name', async () => {
    const newFirstName = 'Kate';
    const res = await service.updateUser(user.id, { firstName: newFirstName });

    expect(res).toBeDefined();
    expect(res.firstName).toBe(newFirstName);
  });

  it('should update user first name, last name and password', async () => {
    const newFirstName = 'Natalu';
    const newLastName = 'Poter';
    const newPassword = 'password';
    const res = await service.updateUser(user.id, {
      firstName: newFirstName,
      lastName: newLastName,
      password: newPassword
    });

    expect(res).toBeDefined();
    expect(res.firstName).toBe(newFirstName);
    expect(res.lastName).toBe(newLastName);
    expect(res.password).toBe(newPassword);
  });

  describe('updateMeasurements function', () => {
    const body = {
      age: 20,
      height: 174,
      weight: 65,
      gender: GenderEnum.FEMALE,
      activity: 3
    };

    it('should throw NotFoundException when user does not exist with id', async () => {
      try {
        await service.updateMeasurements(10000, body);
      } catch(err) {
        expect(err).toBeDefined();
        expect(err).toMatchObject({
          message: 'User does not exist'
        });
      }
    });

    it('should should update gender, age, height, weight and activity', async () => {
      const res = await service.updateMeasurements(user.id, body);
      expect(res).toBeDefined();
      expect(res.age).toBe(body.age);
      expect(res.height).toBe(body.height);
      expect(res.weight).toBe(body.weight);
      expect(res.gender).toBe(body.gender);
      expect(res.activity).toBe(body.activity);
    });
  });
})