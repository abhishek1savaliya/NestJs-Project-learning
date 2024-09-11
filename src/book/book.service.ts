import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { Book } from './schemas/book.schemas';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Query } from 'express-serve-static-core'
import { User } from 'src/auth/schemas/user.schems';
@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) { }

    async findAll(query: Query): Promise<Book[]> {

        const resPerPage = 2
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}

        const books = await this.bookModel.find({ ...keyword }).limit(resPerPage).skip(skip)

        return books
    }

    async create(book: Book, user: User): Promise<Book> {
        const data = Object.assign(book, { user: user._id })
        const res = await this.bookModel.create(data)
        return res
    }

    async findById(id: string): Promise<Book> {

        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException("Please Enter correct Id")
        }

        const book = await this.bookModel.findById(id)

        if (!book) {
            throw new NotFoundException("Book Not Found")
        }
        return book
    }

    async updateById(id: string, book: Book): Promise<Book> {
        return await this.bookModel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true
        })
    }

    async deleteById(id: string): Promise<Book> {
        const book = await this.bookModel.findByIdAndDelete(id)

        if (!book) {
            throw new NotFoundException("Book Not Found")
        }
        return book
    }
}
