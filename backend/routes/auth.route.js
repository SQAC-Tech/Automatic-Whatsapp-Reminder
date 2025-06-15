const express = require('express');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils/error'); 

const router = express.Router();
const FIXED_USERNAME = process.env.ADMIN_USERNAME;
const FIXED_PASSWORD = process.env.ADMIN_PASSWORD;

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(errorHandler(400, 'Username and password required'));
  }

  if (username !== FIXED_USERNAME || password !== FIXED_PASSWORD) {
    return next(errorHandler(401, 'Invalid credentials'));
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET || 'devsecret', {
    expiresIn: '1h',
  });

  res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .json({ message: 'Login successful', token });
});

module.exports = router;
