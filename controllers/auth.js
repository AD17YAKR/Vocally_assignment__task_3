const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');

//@desc     Register New User
//@routes   POST /api/v1/auth/register/
//@access   Public
exports.registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, phone, gender, role, dob } = req.body;

    //Create New User
    const user = await User.create({
        name,
        email,
        phone,
        password,
        gender,
        role,
        dob
    });

    //JWT Token Creation
    sendTokenResponse(user, 200, res);
});

//@desc     Login User
//@routes   POST /api/v1/auth/login/
//@access   Public
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //Validate Email and Password
    if (!email || !password) {
        return next(
            new ErrorResponse(
                'Please provide and email and a password',
                400
            )
        );
    }

    //Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    //JWT Token Creation
    sendTokenResponse(user, 200, res);
});

//@desc     Delete User
//@routes   DELETE /api/v1/auth/withdraw
//@access   Public
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //Validate Email and Password
    if (!email || !password) {
        return next(
            new ErrorResponse(
                'Please provide and email and a password',
                400
            )
        );
    }

    //Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid Credentials', 401));
    }

    await User.findByIdAndDelete(user.id);

    res.status(201).json({
        success: true,
        data: {}
    });
});

//Helper Function to send token response
const sendTokenResponse = (user, statusCode, res) => {
    //JWT Token Creation
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() +
                process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};
