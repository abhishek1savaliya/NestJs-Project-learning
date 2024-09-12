import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { BookService } from './book.service';
import { Book } from './schemas/book.schemas';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createBookDTO } from './dto/create-book.dto';
import { User } from '../auth/schemas/user.schemas';

describe('BookService', () => {

    let bookService: BookService
    let model: Model<Book>

    const mockBook = {
        "_id": "66e13b7096f69ecc9a6e43f4",
        "title": "ABCDEFGH",
        "description": "A novel written by American author F. Scott Fitzgerald that follows a cast of characters living in the fictional towns of West Egg and East Egg on prosperous Long Island in the summer of 1922.",
        "author": "F. Scott Fitzgerald",
        "price": 10.99,
        "category": "Adventure",
        "user": "66e11a4a7d443d8429107fa6"
    }

    const mockUser = {
        "_id": "66e13b7096f69ecc9a6e43x7",
        "name": "John Doe",
        "email": "john.doe@example.com",
    }


    const mockBookService = {
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookService,
                {
                    provide: getModelToken(Book.name),
                    useValue: mockBookService
                }
            ]
        }).compile()

        bookService = module.get<BookService>(BookService)
        model = module.get<Model<Book>>(getModelToken(Book.name))

    })

    describe('findAll', () => {
        it('should return array of books', async () => {
            const query = { page: "1", keyword: 'test' }

            jest.spyOn(model, 'find').mockImplementation(
                () => (
                    {
                        limit: () => ({
                            skip: jest.fn().mockResolvedValue([mockBook]),
                        })
                    } as any
                )
            );

            const result = await bookService.findAll(query)

            expect(model.find).toHaveBeenCalledWith({
                title: {
                    $regex: 'test',
                    $options: 'i'
                }
            })
            expect(result).toEqual([mockBook])
        })
    })

    describe('create', () => {
        it('it should create and return a book', async () => {

            const newBook = {
                "title": "ABCDEFGH",
                "description": "A novel written by American author F. Scott Fitzgerald that follows a cast of characters living in the fictional towns of West Egg and East Egg on prosperous Long Island in the summer of 1922.",
                "author": "F. Scott Fitzgerald",
                "price": 10.99,
                "category": "Adventure"
            }

            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockBook))

            const result = await bookService.create(newBook as createBookDTO, mockUser as User)

            expect(result).toEqual(mockBook)
        })

    })

    describe('findById', () => {
        it('Should find return a book by Id', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockBook)

            const result = await bookService.findById(mockBook._id)

            expect(model.findById).toHaveBeenCalledWith(mockBook._id)
            expect(result).toEqual(mockBook)
        })

        it('It throw BadRequestException if invalid id is provided', async () => {
            const id = 'invalid-id'

            const isValidObjectIdMock = jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(false)

            await expect(bookService.findById(id)).rejects.toThrow(BadRequestException)

            expect(isValidObjectIdMock).toHaveBeenCalledWith(id);
            isValidObjectIdMock.mockRestore()
        })


        it('Should throw NotFoundException if book is not found', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(null)

            await expect(bookService.findById(mockBook._id)).rejects.toThrow(NotFoundException)

            expect(model.findById).toHaveBeenCalledWith(mockBook._id)
        })

    })

    describe('updateById', () => {
        it('it should update and return a book', async () => {

            const updatedBook = { ...mockBook, title: 'Updated name' }
            const book = { title: 'Updated name' }

            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook)

            const result = await bookService.updateById(mockBook._id, book as any)

            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, book, {
                new: true,
                runValidators: true
            });

            expect(result.title).toEqual(book.title)
        })
    })

    describe('updateById', () => {
        it('it should delete and return a book', async () => {

            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook)

            const result = await bookService.deleteById(mockBook._id)

            expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);

            expect(result).toEqual(mockBook)
        })
    })



})