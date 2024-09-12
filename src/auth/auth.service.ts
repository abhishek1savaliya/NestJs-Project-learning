import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dot/login.dto';
import { LoginDto } from './dot/signup.dot';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async signup(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password, role } = signUpDto

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        const token = this.jwtService.sign({ id: user._id })

        return { token }
    }

    async login(loginDto: LoginDto): Promise<{ token: string }> {

        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email })

        if (!user) {
            throw new UnauthorizedException("Invalid email or password")
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if (!isPasswordMatched) {
            throw new UnauthorizedException("Invalid email or password")
        }

        const token = this.jwtService.sign({ id: user._id })

        return { token }
    }
}
