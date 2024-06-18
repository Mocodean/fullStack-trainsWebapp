import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as dbUser from '../db/useres.js';

const router = express.Router();

const secret = '123mysecret123';

router.get('/', (req, res) => {
  try {
    const current = {
      username: '',
      rang: '',
    };
    res.render('regisztracio', { message: '', user: current });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

router.post('/form', async (req, res) => {
  try {
    const { username, password, passwordAgain } = req.body;
    const rang = 'user';
    // Check if the request is valid
    if (!username || !password || !rang || password !== passwordAgain) {
      res.status(400).render('regisztracio', { message: 'Invalid request' });
    }
    const user = await dbUser.getUserByUsername(username);

    // Check if the user exists
    if (user) {
      res.status(401).render('regisztracio', { message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword, rang };

    await dbUser.insertNewUser(newUser);

    // ha regisztraltal be is vagy lepve
    const token = jwt.sign({ username, rang }, secret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

export default router;
