import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: "Please Enter correct email" })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

    @IsOptional()
    readonly role: string[];

} 