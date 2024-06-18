import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as dbUser from '../db/useres.js';

const router = express.Router();

function validateLoginRequest(req) {
  return !req.body.username || !req.body.password;
}

const secret = '123mysecret123';

router.post('/form', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if the request is valid
    if (validateLoginRequest(req)) {
      res.status(400).render('log_in', { message: 'Invalid request' });
    }
    const user = await dbUser.getUserByUsername(username);

    console.log(user);

    // Check if the user exists
    if (!user) {
      res.status(401).render('log_in', { message: 'Invalid username' });
      return;
    }
    // Check if the password is correct
    const correct = await bcrypt.compare(password, user.password);
    if (!correct) {
      res.status(401).render('log_in', { message: 'Invalid password' });
      return;
    }

    const { rang } = user;
    const token = jwt.sign({ username, rang }, secret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

    res.status(200).redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('log_in', { message: 'Internal server error' });
  }
});

router.get('/', (req, res) => {
  try {
    const current = {
      username: '',
      rang: '',
    };
    res.render('log_in', { message: '', user: current });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

export default router;
