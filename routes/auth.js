const express = require('express');
const {
    registerUser,
    loginUser,
    deleteUser
} = require('../controllers/auth');

const router = express.Router();

/**
 * 
 * @swagger
 * /auth/register/:
 *  post:
 *      summary: API to create New User
 *      description: API to create new user based on its role i.e whether he/she is a librarian or a Student 
 *      requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/User'
 *      responses:
 *              201:
 *                  description: Added Successfully
 *              404:
 *                  description: Book Already Present
 * 
 */
router.post('/register/', registerUser);
/**
 * @swagger
 * /auth/login/:
 *  post:
 *      summary: API to login the User 
 *      description: API to login user based on email and answer 
 *      requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/User'
 *      responses:
 *              201:
 *                  description: Added Successfully
 *              404:
 *                  description: Book Already Present
 * 
 */
router.post('/login/', loginUser);
/**
 * @swagger
 * /auth/withdraw/:
 *  delete:
 *      summary: API to delete  User
 *      description: API to delete user using id email and password
 *      requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/User'
 *      responses:
 *              201:
 *                  description: Added Successfully
 *              404:
 *                  description: Book Already Present
 * 
 */
router.delete('/withdraw/', deleteUser);

module.exports = router;