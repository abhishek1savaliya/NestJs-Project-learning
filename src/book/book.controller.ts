import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schemas';
import { createBookDTO } from './dto/create-book.dto';
import { updateBookDTO } from './dto/update-book.dto';

@Controller('books')
export class BookController {

    constructor(private bookService: BookService) { }

    @Get()
    async getAll(): Promise<Book[]> {
        return this.bookService.findAll()
    }

    @Post()
    async createBook(@Body() book: createBookDTO): Promise<Book> {
        return this.bookService.create(book)
    }

    @Get(':id')
    async getBook(@Param('id') id: string): Promise<Book> {
        return this.bookService.findById(id)
    }

    @Put(':id')
    async updateBook(@Param('id') id: string, @Body() book: updateBookDTO): Promise<Book> {
        return this.bookService.updateById(id, book)
    }

    @Delete(':id')
    async deleteBook(
        @Param('id')
        id: string
    ): Promise<Book> {
        return this.bookService.deleteById(id)
    }

}
