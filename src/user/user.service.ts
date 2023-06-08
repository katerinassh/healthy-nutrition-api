import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenderEnum } from './enum/gender.enum';
import { UpdateMeasurementsDTO } from './dto/updateMeasurements.dto';
import { AimEnum } from './enum/aim.enum';
import { CreateCustomerDTO } from './dto/createCustomer.dto';
import { RolesEnum } from './enum/roles.enum';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {
    super(repository);
  }

  async getByEmail(email: string): Promise<User> {
    return this.repository.findOne({ where: { email } });
  }

  async getById(id: number): Promise<User> {
    return this.repository.findOne({ where: { id } });
  }

  async getUserWithPassword(email: string): Promise<User> {
    return this.repository
      .createQueryBuilder('user')
      .where(`user.email = :email`, { email })
      .addSelect('user.password')
      .getOne();
  }

  async createCustomer(createCustomerDto: CreateCustomerDTO): Promise<User> {
    return this.repository.save({
      ...createCustomerDto,
      role: RolesEnum.Customer,
    });
  }

  async createBlankAdmin(email: string): Promise<User> {
    return this.repository.save({
      email,
      password: (Math.random() + 1).toString(36).substring(10),
      firstName: 'blank',
      lastName: 'blank',
      role: RolesEnum.Admin,
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
    await this.repository.update(id, { refreshToken });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDTO): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    return this.repository.save({ ...user, ...updateUserDto });
  }

  async updateMeasurements(
    id: number,
    { gender, weight, height, age, activity }: UpdateMeasurementsDTO,
  ): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
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

  calculateAMR(
    gender: GenderEnum,
    weight: number,
    height: number,
    age: number,
    activity: number,
  ): number {
    const genderK = gender === GenderEnum.MALE ? 5 : -161;
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
    let user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const { gender, weight, height, age, activity } = user;
    if (!gender || !weight || !height || !age || !activity) {
      throw new BadRequestException('No enough data');
    }

    let AMR = this.calculateAMR(gender, weight, height, age, activity);

    if (!aim) aim = AimEnum.STAY;
    if (AimEnum[aim.toUpperCase()] && weeks && idealWeight) {
      AMR -= ((weight - idealWeight) * 7700) / (weeks * 7);
    }
    const protein = Math.floor((0.3 * AMR) / 4);
    const fats = Math.floor((0.3 * AMR) / 9);
    const carbohydrates = Math.floor((0.4 * AMR) / 4);
    let warning = null;

    if (AMR < 1000) {
      warning = 'We don`t recommend you lose weight so quick';
    }

    user = { ...user, protein, fats, carbohydrates, calories: AMR };
    await this.repository.save(user);

    return { protein, fats, carbohydrates, calories: AMR, warning };
  }
}
