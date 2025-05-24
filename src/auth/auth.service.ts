import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  loginWithPassword() {
    return `This action login user with password and return jwt token`;
  }
}
