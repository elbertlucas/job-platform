import {
  Injectable,
  Dependencies,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { compareHash } from '../utils/hash';

@Injectable()
@Dependencies(UsersService, JwtService)
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!user.active) {
      throw new UnauthorizedException();
    }
    const passCorrectly = await compareHash(password, user.password);
    if (!passCorrectly) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id.substring(0, 10), username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }

  async getMe(username: string): Promise<{
    id: string;
    username: string;
    active: boolean;
    role: string;
  }> {
    const output = await this.userService.findOne(username);
    return {
      id: output.id,
      username: output.username,
      active: output.active,
      role: output.role,
    };
  }
}
