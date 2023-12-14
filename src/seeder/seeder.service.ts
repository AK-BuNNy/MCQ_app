import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class SeederService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async SuperAdminSeeder() {
    const superUserExists =
      await this.usersService.findUserByType('super_admin');
    const superUserEmail = await this.usersService.findUserByEmail(
      'superadmin@mcqapp.com',
    );

    if (!superUserExists) {
      const superUserDto: CreateUserDto = {
        name: 'admin',
        email: 'superadmin@mcqapp.com',
        phone: '+911122334455',
        user_type: 'super_admin',
        password: 'adminPassword',
      };

      await this.usersService.createSuperAdmin(superUserDto);
      console.log('Superuser seeded successfully.');
    } else {
      console.log('Superuser already exists.');
    }
  }

  async onApplicationBootstrap() {
    await this.SuperAdminSeeder();
  }
}
