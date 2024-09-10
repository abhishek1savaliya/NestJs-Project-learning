import { Category } from "../schemas/book.schemas";

export class updateBookDTO {
    readonly title: string;
    readonly description: string;
    readonly author: string;
    readonly price: number;
    readonly category: Category;
}