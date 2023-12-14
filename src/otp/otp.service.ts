import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as OTPAuth from 'otpauth';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  initializeOTPAuth(secret: string): OTPAuth.TOTP {
    return new OTPAuth.TOTP({
      algorithm: 'SHA1',
      digits: 4,
      period: 120,
      secret,
    });
  }

  generateOtp(secret: string): string {
    const totp = this.initializeOTPAuth(secret);
    return totp.generate();
  }

  validateOtp(token: string, secret: string): boolean {
    const totp = this.initializeOTPAuth(secret);
    return totp.validate({ token, window: 1 }) !== null;
  }

  generateSecret(): string {
    const str = crypto
      .createHash('sha256')
      .update(new Date().toISOString())
      .digest('hex');
    return str.replace(/[^a-zA-Z]/g, '');
  }

  regenerateOtp(secret: string): string {
    return this.generateOtp(secret);
  }
}
