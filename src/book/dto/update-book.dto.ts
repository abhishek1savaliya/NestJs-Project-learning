import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "../schemas/book.schemas";
import { User } from "src/auth/schemas/user.schemas";

export class updateBookDTO {

    @IsOptional()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsString()
    readonly author: string;

    @IsOptional()
    @IsNumber()
    readonly price: number;

    @IsOptional()
    @IsEnum(Category, { message: "Please enter correct category" })
    readonly category: Category;

    @IsEmpty({ message: "You can pass user id" })
    readonly user: User
}