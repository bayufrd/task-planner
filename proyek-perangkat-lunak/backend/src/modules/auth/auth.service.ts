import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { env } from '../../config/env';
import { ConflictError, UnauthorizedError } from '../../lib/errors';
import {
  RegisterInput,
  LoginInput,
  ClientRegisterInput,
  ClientLoginInput,
} from './auth.validation';

const MOBILE_REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type MobileTokenMetadata = {
  deviceId?: string;
};

export class AuthService {
  async register(data: RegisterInput | ClientRegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
    );

    return { user, token };
  }

  async login(data: LoginInput | ClientLoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        theme: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as SignOptions
    );
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(48).toString('hex');
  }

  async issueMobileTokenPair(userId: string, metadata: MobileTokenMetadata = {}) {
    const token = this.generateToken(userId);
    const refreshToken = this.generateRefreshToken();
    const sessionToken = `mobile-refresh:${refreshToken}`;
    const expires = new Date(Date.now() + MOBILE_REFRESH_TTL_MS);

    await prisma.session.create({
      data: {
        sessionToken,
        userId,
        expires,
      },
    });

    return {
      token,
      refreshToken,
      tokenType: 'Bearer' as const,
      expiresIn: env.JWT_EXPIRES_IN,
      sessionId: sessionToken,
      authContext: {
        clientType: 'mobile' as const,
        captchaRequired: false,
        ...(metadata.deviceId ? { deviceId: metadata.deviceId } : {}),
      },
    };
  }

  async refreshMobileToken(refreshToken: string, metadata: MobileTokenMetadata = {}) {
    const sessionToken = `mobile-refresh:${refreshToken}`;
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!session || session.expires <= new Date()) {
      if (session) {
        await prisma.session.delete({ where: { sessionToken } }).catch(() => undefined);
      }
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const nextRefreshToken = this.generateRefreshToken();
    const nextSessionToken = `mobile-refresh:${nextRefreshToken}`;
    const expires = new Date(Date.now() + MOBILE_REFRESH_TTL_MS);

    await prisma.session.update({
      where: { sessionToken },
      data: {
        sessionToken: nextSessionToken,
        expires,
      },
    });

    return {
      token: this.generateToken(session.userId),
      refreshToken: nextRefreshToken,
      tokenType: 'Bearer' as const,
      expiresIn: env.JWT_EXPIRES_IN,
      sessionId: nextSessionToken,
      user: session.user,
      authContext: {
        clientType: 'mobile' as const,
        captchaRequired: false,
        ...(metadata.deviceId ? { deviceId: metadata.deviceId } : {}),
      },
    };
  }

  async findOrCreateFromGoogle(email: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return existingUser
    }

    // Create user without password (Google OAuth only)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: null, // No password, Google OAuth only
      },
    });
    return newUser
  }
}