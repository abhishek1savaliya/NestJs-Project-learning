import { Category } from "../schemas/book.schemas";

export class createBookDTO {
    readonly title: string;
    readonly description: string;
    readonly author: string;
    readonly price: number;
    readonly category: Category;
}