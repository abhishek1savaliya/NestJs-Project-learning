import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dot/login.dto';
import { LoginDto } from './dot/signup.dot';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
        return this.authService.signup(signUpDto)

    }

    @Get('/login')
    login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return this.authService.login(loginDto)
    }

}
