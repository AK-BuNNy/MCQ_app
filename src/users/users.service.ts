import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserType } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
        private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, user_type } = createUserDto;
    const userPhoneExist = await this.findAllUserByMobile(createUserDto.phone);
    if (userPhoneExist) {
      return { message: 'User with Mobile Number exist' };
      const newUser = await this.userRepo.create(createUserDto);
       const user = await this.userRepo.save(newUser);
        return user;
    } 
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findAllUserByMobile(phone: string) {
    return await this.userRepo.find({ where: { phone } });
  }

  async findUserByMobile(phone: string) {
    return await this.userRepo.findOne({ where: { phone } });
  }

  async findUserByType(user_type: string) {
    return await this.userRepo.findOne({ where: { user_type } });
  }

  async findUserByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async createSuperAdmin(createUserDto: CreateUserDto) {
    const { password, user_type } = createUserDto;
    const userExist = await this.findUserByEmail(createUserDto.email);
    if (userExist) {
      return { message: 'User with email exist' };
    }
    const newUser = await this.userRepo.create(createUserDto);
    const user = await this.userRepo.save(newUser);
    return user;
  }
}
