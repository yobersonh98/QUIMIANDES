import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuditoriaLogService } from './../auditoria-log/auditoria-log.service';
import { Request } from 'express';
import { JwtPayload } from './../common/types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditoriaLogService
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }
    const isPasswordMatch = await bcrypt.compare(pass, user.password);
    if (isPasswordMatch) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: User, req: Request) {
    const payload:JwtPayload = { email: user.email, sub: user.id, roles:[user.role] };
    await this.auditService.logLogin(user, req)
    return {
      token: this.jwtService.sign(payload),
      email: user.email,
      name: user.name,
      id: user.id,
    };
  }
}
