import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const { name, email, password } = signUpDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { EMAIL: email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        NAME: name,
        EMAIL: email,
        PASSWORD: hashedPassword,
      },
    });

    const token = this.jwtService.sign({ sub: user.ID });

    return {
      id: user.ID,
      name: user.NAME,
      token: `Bearer ${token}`,
    };
  }

  async signin(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.prisma.user.findUnique({
      where: { EMAIL: email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.ID });

    return {
      id: user.ID,
      name: user.NAME,
      token: `Bearer ${token}`,
    };
  }
}
