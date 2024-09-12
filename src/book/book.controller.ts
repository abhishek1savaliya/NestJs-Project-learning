import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schemas';
import { createBookDTO } from './dto/create-book.dto';
import { updateBookDTO } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGaurd } from 'src/auth/gaurds/roles.gaurd';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('books')
export class BookController {

    constructor(private bookService: BookService) { }

    @Get()
    @Roles(Role.Admin, Role.User)
    @UseGuards(AuthGuard(), RolesGaurd)
    async getAll(@Query() query: ExpressQuery): Promise<Book[]> {
        return this.bookService.findAll(query)
    }

    @Post()
    @UseGuards(AuthGuard())
    async createBook(@Body() book: createBookDTO, @Req() req): Promise<Book> {
        return this.bookService.create(book, req.user)
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

    @Put('upload/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files'))
    async uploadImages(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        console.log(id)
        console.log(files);
        return
    }
}



