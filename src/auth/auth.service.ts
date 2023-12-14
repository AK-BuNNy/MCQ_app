import {
  Injectable,
  Inject,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

async function encodedPassword(rawPassword: string) {
  const SALT = 10;
  return await bcrypt.hash(rawPassword, SALT);
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email, pass, header) {
    const user = await this.usersService.findUserByEmail(email);
    console.log(user);
    
    if (!user) {
      throw new UnauthorizedException('Email ID not found');
    }
    const appType = header['app_type'];
    if (appType && appType !== user.user_type) {
      throw new UnauthorizedException({
        status: false,
        message: 'You do not have permission to access this resource',
      });
    }
    return {
      message: 'login sucessfull', 
      tokens: await this.GenerateTokens(user.id, user.name),
      user: user,
    };
  }
  async GenerateTokens(userID: number, userName: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userID,
          userName,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.JWT_ACCESS_EXPIRY,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userID,
          userName,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRY,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
