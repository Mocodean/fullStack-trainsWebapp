import express from 'express';
import * as dbTrain from '../db/trains.js';
import * as dbRes from '../db/reservations.js';
import * as dbUser from '../db/useres.js';

const router = express.Router();

// validalasok ----------------------------
function validateNewTrainRequest(req) {
  return (
    !req.body.from ||
    !req.body.to ||
    !req.body.day ||
    !req.body.departuretime ||
    !req.body.arrivaltime ||
    !req.body.traintype ||
    !req.body.trainprice ||
    parseInt(req.body.trainprice, 10) < 0 ||
    // check if the day is valid
    !['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(req.body.day.toLowerCase())
  );
}

function validatePrices(min, max) {
  return min > max || min < 0 || max < 0;
}

// routes ----------------------------

// jaratok listazasa -- fooldal
router.get('/', async (req, res) => {
  try {
    const trains = await dbTrain.getAllTrains();
    const oneTransferRoutes = await dbTrain.getTrainsPartialOne();
    const twoTransferRoutes = await dbTrain.getTrainsPartialTwo();

    console.log(oneTransferRoutes);
    console.log('1-2 atszalasok');
    console.log(twoTransferRoutes);
    // console.log('minden oke');
    // ha bevan lepve
    if (res.locals.jwt) {
      const current = {
        username: res.locals.jwt.username,
        rang: res.locals.jwt.rang,
      };
      res.render('vonat_form', { trains, message: '', user: current, oneTransferRoutes, twoTransferRoutes });
      return;
    }
    const current = {
      username: '',
      rang: '',
    };
    res.render('vonat_form', { trains, message: '', user: current, oneTransferRoutes, twoTransferRoutes });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error ' });
  }
});

// bizonyos jarat listazasa, foglalasokkal
router.get('/foglal/:trainId', async (req, res) => {
  try {
    const train = await dbTrain.getTrainById(req.params.trainId);
    console.log(train);
    const foglalasok = await dbRes.getReservationsByTrainId(req.params.trainId);
    console.log(foglalasok);
    if (res.locals.jwt) {
      const user = await dbUser.getUserByUsername(res.locals.jwt.username);
      const current = {
        username: res.locals.jwt.username,
        rang: res.locals.jwt.rang,
        userid: user.id,
      };
      res.render('vonat_foglalas', { train, foglalasok, message: '', user: current });
      return;
    }

    const current = {
      username: '',
      rang: '',
      userid: '',
    };
    res.render('vonat_foglalas', { train, foglalasok, message: '', user: current });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error ' });
  }
});

// uj vonat felvetele
router.post('/newtrain', express.urlencoded({ extended: true }), async (req, res) => {
  console.log(req.body);
  const current = {
    username: res.locals.jwt.username,
    rang: res.locals.jwt.rang,
  };

  // validate the request
  if (validateNewTrainRequest(req)) {
    const message = 'Invalid request';
    res.status(200).render('vonat_form', { trains: await dbTrain.getAllTrains(), message, user: current });
    return;
  }
  // create a new train object
  const newTrain = {
    from: req.body.from,
    to: req.body.to,
    day: req.body.day,
    arrivaltime: req.body.arrivaltime,
    departuretime: req.body.departuretime,
    trainprice: parseInt(req.body.trainprice, 10),
    traintype: req.body.traintype,
  };
  // add the new train object
  await dbTrain.insertNewTrain(newTrain);
  // sikeres feltoltes -- fooldal sikeres uzenettel
  res.redirect('/');
});

router.get('/insert', async (req, res) => {
  try {
    const current = {
      username: res.locals.jwt.username,
      rang: res.locals.jwt.rang,
    };
    console.log('itt vagyok isert');
    res.render('vonat_beszur', { message: '', user: current, trains: await dbTrain.getAllTrains() });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error ' });
  }
});

// kereses
router.post('/searchtrain', express.urlencoded({ extended: true }), async (req, res) => {
  let current = {
    username: '',
    rang: '',
  };

  if (res.locals.jwt) {
    current = {
      username: res.locals.jwt.username,
      rang: res.locals.jwt.rang,
    };
  }
  console.log('eljut keresesig');
  console.log(req.body);

  // validate the request
  if (validatePrices(parseInt(req.body.minprice, 10), parseInt(req.body.maxprice, 10))) {
    const message = 'Invalid request minprice > maxprice or negative prices';

    res.status(400).render('vonat_form', {
      trains: await dbTrain.getAllTrains(),
      message,
      user: current,
      oneTransferRoutes: await dbTrain.getTrainsPartialOne(),
      twoTransferRoutes: await dbTrain.getTrainsPartialTwo(),
    });
    return;
  }

  // find the train objects
  const selectedTrains = await dbTrain.searchTrains(req.body);
  const oneTransferRoutes = await dbTrain.searchTrainOneTransfer(req.body);
  const twoTransferRoutes = await dbTrain.searchTrainTwoTransfer(req.body);

  console.log('selected trains keresesben');
  console.log(twoTransferRoutes);
  console.log(twoTransferRoutes.length);

  console.log(current);
  console.log(selectedTrains);

  // check if the train objects exist
  if (selectedTrains.length === 0 && oneTransferRoutes.length === 0 && twoTransferRoutes.length === 0) {
    console.log('nincs talalat');
    const message = 'No trains found with filters';
    res
      .status(200)
      .render('vonat_form', { trains: [], message, user: current, oneTransferRoutes: [], twoTransferRoutes: [] });
    return;
  }

  if (
    !req.body.from &&
    !req.body.to &&
    !req.body.day &&
    !req.body.traintype &&
    !req.body.minprice &&
    !req.body.maxprice
  ) {
    console.log('nincs szures');
    res.status(200).render('vonat_form', {
      trains: await dbTrain.getAllTrains(),
      message: 'No filters',
      user: current,
      oneTransferRoutes: await dbTrain.getTrainsPartialOne(),
      twoTransferRoutes: await dbTrain.getTrainsPartialTwo(),
    });
    return;
  }
  // send a response to the client
  const message = 'Trains found with filters';
  console.log('selected trains');
  console.log(selectedTrains);
  console.log(twoTransferRoutes);

  // filter the trains with transfer

  res.status(200).render('vonat_form', {
    trains: selectedTrains,
    message,
    user: current,
    oneTransferRoutes,
    twoTransferRoutes,
  });
});

export default router;
