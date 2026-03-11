/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */

import {
  Body,
  Controller,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../core/decorators/public.decorator';
import { ResponseMessage } from '../../core/decorators/response-message.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { MESSAGE_CODES } from '../../shared/constants/message-codes';
import { LoginType } from '../../shared/enums/auth.enum';
import { MessageType } from '../../shared/enums/message-type.enum';
import { CustomException } from '../../shared/exceptions/custom.exception';
import {Roles} from '../../core/decorators/roles.decorator'
import {UserRoles} from '../../shared/enums/accouts.enum';

import {
  LoginWithFacebookDto,
  LoginWithGoogleDto,
  LoginWithOTPDto,
  LoginWithPasswordDto,
  VerifyOTPDto,
} from './dto/login.dto';
import type {
  AuthResult,
  IAuthenticationService,
  ILogoutService,
  IRegisterService,
} from './interfaces/auth.interface';
import { RegisterDto } from './dto/register.dto';
// import { UserRoles } from 'src/shared/enums/accouts.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthenticationService')
    private readonly auththenticationService: IAuthenticationService,
    @Inject('ILogoutService')
    private readonly logoutService: ILogoutService,
    @Inject('IRegisterService')
    private readonly registerService: IRegisterService,
  ) {}

  @Public()
  @Post('login-with-password')
  @ResponseMessage(MESSAGE_CODES.AUTH_LOGIN_SUCCESS.code)
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiBody({ type: LoginWithPasswordDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginWithPassword(
    @Body() loginDto: LoginWithPasswordDto,
    @Request() req: Request,
  ): Promise<AuthResult> {
    const domain = (req.headers['host'] ??
      req.headers['origin'] ??
      '') as string;
    return await this.auththenticationService.authenticate(
      loginDto.role,
      loginDto.loginId,
      LoginType.PASSWORD,
      domain,
      loginDto.password,
    );
  }

  @Public()
  @Post('login-with-otp')
  @ResponseMessage(MESSAGE_CODES.AUTH_LOGIN_SUCCESS.code)
  @ApiOperation({ summary: 'Request OTP for login' })
  @ApiBody({ type: LoginWithOTPDto })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async loginWithOTP(
    @Body() loginDto: LoginWithOTPDto,
    @Request() req: Request,
  ): Promise<AuthResult> {
    const domain = (req.headers['host'] ??
      req.headers['origin'] ??
      '') as string;
    return await this.auththenticationService.authenticate(
      loginDto.role,
      loginDto.loginId,
      LoginType.OTP,
      domain,
    );
  }

  @Public()
  @Post('login-otp-verification')
  @ResponseMessage(MESSAGE_CODES.AUTH_LOGIN_SUCCESS.code)
  @ApiOperation({ summary: 'Verify OTP and complete login' })
  @ApiBody({ type: VerifyOTPDto })
  @ApiResponse({ status: 200, description: 'OTP verified, login successful' })
  @ApiResponse({ status: 401, description: 'Invalid OTP' })
  async loginOTPVerification(
    @Body() loginDto: VerifyOTPDto,
    @Request() req: Request,
  ): Promise<AuthResult> {
    const domain = (req.headers['host'] ??
      req.headers['origin'] ??
      '') as string;
    return await this.auththenticationService.authenticate(
      loginDto.role,
      loginDto.loginId,
      LoginType.OTP,
      domain,
    );
  }

  @Public()
  @Post('login-with-google')
  @ResponseMessage(MESSAGE_CODES.AUTH_LOGIN_SUCCESS.code)
  @ApiOperation({ summary: 'Login with Google account' })
  @ApiBody({ type: LoginWithGoogleDto })
  @ApiResponse({ status: 200, description: 'Google login successful' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async loginWithGoogle(
    @Body() loginDto: LoginWithGoogleDto,
    @Request() req: Request,
  ): Promise<AuthResult> {
    const domain = (req.headers['host'] ??
      req.headers['origin'] ??
      '') as string;
    return await this.auththenticationService.authenticate(
      loginDto.role,
      loginDto.idToken,
      LoginType.GOOGLE,
      domain,
    );
  }

  @Public()
  @Post('login-with-facebook')
  @ResponseMessage(MESSAGE_CODES.AUTH_LOGIN_SUCCESS.code)
  @ApiOperation({ summary: 'Login with Facebook account' })
  @ApiBody({ type: LoginWithFacebookDto })
  @ApiResponse({ status: 200, description: 'Facebook login successful' })
  @ApiResponse({ status: 401, description: 'Invalid Facebook token' })
  async loginWithFacebook(
    @Body() loginDto: LoginWithFacebookDto,
    @Request() req: Request,
  ): Promise<AuthResult> {
    const domain = (req.headers['host'] ??
      req.headers['origin'] ??
      '') as string;
    return await this.auththenticationService.authenticate(
      loginDto.role,
      loginDto.accessToken,
      LoginType.FACEBOOK,
      domain,
    );
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiBearerAuth()
  @ResponseMessage(MESSAGE_CODES.AUTH_LOGOUT_SUCCESS.code)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @Request() req: { headers: { authorization?: string } },
  ): Promise<{ message: string }> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new CustomException(
        MESSAGE_CODES.AUTH_TOKEN_INVALID,
        MessageType.ERROR,
      );
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new CustomException(
        MESSAGE_CODES.AUTH_TOKEN_REQUIRED,
        MessageType.ERROR,
      );
    }

    await this.logoutService.execute(token);
    return { message: 'Logout successful' };
  }

  @Public()
  @Post('register')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRoles.ROOT, UserRoles.ADMIN, UserRoles.ROOT_STAFF, UserRoles.STAFF)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
 
  @ApiBody({ type: RegisterDto })

  async register(@Body() dto:RegisterDto) {
    return await this.registerService.register(dto);
  }
}
