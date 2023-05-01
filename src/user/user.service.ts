import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from './enum/gender.enum';
import { UpdateMeasurementsDTO } from './dto/updateMeasurements.dto';
import { Aim } from './enum/aim.enum';
import { CreateUserDTO } from './dto/createUser.dto';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>
  ) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    return this.repository.findOne({ where: { id } });
  }

  async getUserWithPassword(email: string): Promise<User> {
    return this.repository
      .createQueryBuilder('user')
      .where(`user.email = :email`, { email })
      .addSelect('user.password')
      .getOne();
  }

  async create(createUserDto: CreateUserDTO): Promise <User> {
    return this.repository.save(createUserDto);
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
    await this.repository.update(id, { refreshToken });
  }

  async updateMeasurements({ id, gender, weight, height, age, activity }: UpdateMeasurementsDTO): Promise<User> {
    const user = await this.repository.findOne({ where: { id }});
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    user.gender = gender;
    user.weight = weight;
    user.height = height;
    user.age = age;
    user.activity = activity;
    return this.repository.save(user);
  }

  calculateAMR(gender: Gender, weight: number, height: number, age: number, activity: number): number {
    const genderK = gender === Gender.MALE ? 5 : -161;
    let activityK: number;
    switch (activity) {
      case 1:
        activityK = 1.2;
      case 2:
        activityK = 1.375;
      case 3:
        activityK = 1.55;
      case 4:
        activityK = 1.725;
      case 5:
        activityK = 1.9;
      default:
        activityK = 1;
    }

    const BMR = 9.99 * weight + 6.25 * height - 4.92 * age + genderK;
    return Math.floor(BMR * activityK);
  }

  async calculateMacronutrientRatios({ id, aim, weeks, idealWeight }): Promise<{
    protein: number;
    fats: number;
    carbohydrates: number;
    calories: number;
    warning: string | null;
    }> {
    let user = await this.repository.findOne({ where: { id }});
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const { gender, weight, height, age, activity } = user;
    if (!gender || !weight || !height || !age || !activity) {
      throw new BadRequestException('No enough data');
    }

    let AMR = this.calculateAMR(gender, weight, height, age, activity);
    if (Aim[aim.toUpperCase()] && weeks && idealWeight) {
      AMR -= (weight - idealWeight) * 7700 / (weeks * 7);
    }
    const protein = Math.floor((0.3 * AMR) / 4);
    const fats = Math.floor((0.3 * AMR) / 9);
    const carbohydrates = Math.floor((0.4 * AMR) / 4);
    let warning = null;

    if (AMR < 1000) {
      warning = 'We don`t recommend you lose weight so quick'
    }

    user = {...user, protein, fats, carbohydrates, calories: AMR }
    await this.repository.save(user);

    return { protein, fats, carbohydrates, calories: AMR, warning }
  }
}