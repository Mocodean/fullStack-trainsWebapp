import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  if (req.cookies.token) res.clearCookie('token');
  res.status(200).redirect('/');
});

export default router;
