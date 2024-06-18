import express from 'express';
import * as dbTrain from '../db/trains.js';
import * as dbRes from '../db/reservations.js';
import * as dbUser from '../db/useres.js';

const router = express.Router();

// validalasok ----------------------------
function validateNewRezerVationRequest(req) {
  return !req.body.trainid || !parseInt(req.body.trainid, 10) < 0 || !req.body.date;
}

function getDay(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
}

// routes ----------------------------

// foglalasok listazasa -- szukseges parameter: vonat azonositoja
router.get('/vonat/:trainid', async (req, res) => {
  try {
    console.log('itt vagyok');
    const current = {
      username: res.locals.jwt.username,
      rang: res.locals.jwt.rang,
    };
    const users = await dbUser.getAllUsers();
    const { trainid } = req.params;
    console.log(trainid);
    const foglalasok = await dbRes.getReservationsByTrainId(trainid);
    res.render('foglalasok', { foglalasok, message: '', trainid, users, user: current });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

router.get('/felhasznalo', async (req, res) => {
  try {
    const current = {
      username: res.locals.jwt.username,
      rang: res.locals.jwt.rang,
    };
    const user = await dbUser.getUserByUsername(current.username);
    console.log(user);
    const id = parseInt(user.id, 10);
    if (current.rang === 'admin') {
      res.render('foglalasokUser', { foglalasok: await dbRes.getAllReservations(), message: '', user: current });
      return;
    }
    res.render('foglalasokUser', { foglalasok: await dbRes.getReservationsByUserId(id), message: '', user: current });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

// uj foglalas felvetele
router.post('/newreservation', express.urlencoded({ extended: true }), async (req, res) => {
  // validate the request
  if (validateNewRezerVationRequest(req)) {
    res.status(400).send('Invalid request');
    return;
  }
  const day = getDay(req.body.date);
  const current = {
    username: res.locals.jwt.username,
    rang: res.locals.jwt.rang,
  };
  const train = await dbTrain.getTrainById(req.body.trainid);

  if (train.day !== day) {
    res.status(400).render('foglalasok', {
      foglalasok: await dbRes.getReservationsByTrainId(req.body.trainid),
      message: 'Invalid date',
      trainid: req.body.trainid,
      user: current,
    });
    return;
  }
  const user = await dbUser.getUserByUsername(current.username);
  const reservation = {
    userid: parseInt(user.id, 10),
    trainid: parseInt(req.body.trainid, 10),
    date: req.body.date,
  };
  // find the train object
  await dbRes.insertNewReservation(reservation);

  // check if the train is available
  const message = 'Successfully added a new reservation';
  res.status(200).render('foglalasok', {
    foglalasok: await dbRes.getReservationsByTrainId(reservation.trainid),
    message,
    trainid: reservation.trainid,
    user: current,
  });
});

export default router;
