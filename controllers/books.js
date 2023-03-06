const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Book = require('../models/Books');
const { findByIdAndDelete } = require('../models/Books');

//@desc     Get all Books Data
//@routes   GET /api/v1/books
//@access   Public
exports.getAllBooks = asyncHandler(async (req, res, next) => {
    console.log(req.params);
    res.status(200).json(res.advanceResults);
});

//@desc     Add New Book
//@routes   Post /api/v1/book
//@access   Public
exports.addNewBook = asyncHandler(async (req, res, next) => {
    const book = await Book.create(req.body);

    res.status(201).json({
        success: true,
        data: book
    });
});

//@desc     Get Book by Id
//@routes   GET /api/v1/book/:id
//@access   Public
exports.getBookById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const book = await Book.findById(id);

    res.status(201).json({
        success: true,
        data: book
    });
});

//@desc     Update Book by Id
//@routes   PUT /api/v1/book/:id
//@access   Public
exports.updateBookById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let book = await Book.findById(id);

    if (!book) {
        next(error);
    }

    book = await Book.findOneAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({
        success: true,
        data: book
    });
});

//@desc     Delete Book by Id
//@routes   DELETE /api/v1/book/:id
//@access   Public
exports.deleteBookById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let book = await Book.findById(id);

    if (!book) {
        next(new ErrorResponse(`Book Not Found with the id ${id}`, 404));
    }

    await Book.findByIdAndDelete(id);

    res.status(201).json({
        success: true,
        data: {}
    });
});
