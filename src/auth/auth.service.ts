import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO, LoginDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignUpDTO) {
    // console.log(dto);
    try {
      // hash the password
      const hashedPassword = await argon.hash(dto.password);

      // save the user in the database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      delete user.hash;

      // return the user
      return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw new Error('Internal Server Error');
    }
  }

  async login(dto: LoginDTO) {
    // console.log(dto);

    // find the user
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if no user, throw an error
    if (!user) {
      throw new ForbiddenException('Email does not exist');
    }

    // check the password
    const isPasswordValid = await argon.verify(user.hash, dto.password);

    // if password is wrong, throw an error
    if (!isPasswordValid) {
      throw new ForbiddenException('Email or password is wrong');
    }

    // generate a token
    // const token = await this.jwtService.signAsync({ id: user.id });

    delete user.hash;
    // return the user and the token
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string) {
    const data = {
      sub: userId,
      email,
    };
    return {
      access_token: await this.jwt.signAsync(data, {
        expiresIn: '1d',
        secret: this.config.get('JWT_SECRET'),
      }),
    };
  }
}
