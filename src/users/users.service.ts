import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserType } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { OtpService } from '../otp/otp.service';

type UserCreation = DeepPartial<User> & { otpSecret: string };

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { phone, user_type } = createUserDto;
    const userPhoneExist = await this.findUserByMobile(phone);
    if (userPhoneExist) {
      throw new ConflictException('User with Mobile Number already exists');
    }
    const otpSecret = this.otpService.generateSecret();
    const newUser: UserCreation = {
      ...createUserDto,
      otpSecret,
    };
    const user = await this.userRepo.save(newUser);
    return user;
  }

  async verifyOtp(userId: number, otp: string): Promise<boolean> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isValidOtp = this.otpService.validateOtp(user.otpSecret, otp);

    if (!isValidOtp) {
      throw new BadRequestException('Invalid OTP');
    }
    return isValidOtp;
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
