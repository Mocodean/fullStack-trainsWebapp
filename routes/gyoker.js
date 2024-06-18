import express from 'express';
import * as dbTrain from '../db/trains.js';
import * as dbRes from '../db/reservations.js';

const router = express.Router();

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

router.get('/tipus/:trainId', async (req, res) => {
  try {
    console.log(req.params.trainId);
    const train = await dbTrain.getTrainById(req.params.trainId);
    console.log(train);
    const type = JSON.stringify(train.traintype);
    console.log(type);
    res.json(type);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error ' });
  }
});

router.get('/form/:trainId', async (req, res) => {
  try {
    console.log(req.params.trainId);
    console.log('form felepit belep');
    const train = await dbTrain.getTrainById(req.params.trainId);
    console.log(train);
    res.json(train);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error ' });
  }
});

// foglalas torlese
router.post('/torol/:foglalasId', async (req, res) => {
  try {
    const { foglalasId } = req.params;
    console.log('torles belep');
    await dbRes.deleteReservationById(foglalasId);
    res.json({ message: `Successfully deleted reservation with id ${foglalasId}` });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

// vonat modositasa
router.post('/modosit/:trainId', async (req, res) => {
  try {
    console.log('modositas belep');
    const { trainId } = req.params;
    const train = req.body;
    console.log('modositas belep');
    await dbTrain.updateTrainById(trainId, train);
    const newTrain = await dbTrain.getTrainById(trainId);
    res.json({ message: `Successfully modified train with id ${trainId}`, newTrain });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

// foglalas datumanak visszaadasa
router.get('/datum/:foglalasId', async (req, res) => {
  try {
    console.log(req.params.foglalasId);
    console.log('datum belep');
    const foglalas = await dbRes.getReservationById(req.params.foglalasId);
    console.log(foglalas);
    const { date } = foglalas;
    console.log(date);
    res.json(date);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error ' });
  }
});

// foglalas datumanak modositasa
router.post('/datum/:foglalasId', async (req, res) => {
  try {
    console.log('modositas belep post');
    const { foglalasId } = req.params;
    const { date } = req.body;
    console.log(foglalasId);
    console.log(date);
    await dbRes.updateReservationDateById(foglalasId, date);
    res.json({ message: 'Successfully modified reservation', date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error ' });
  }
});

// jarat torlese
router.delete('/vonat/:trainId', async (req, res) => {
  try {
    const { trainId } = req.params;
    console.log('torles belep');
    await dbTrain.deleteTrainById(trainId);
    res.json({ message: `Successfully deleted train with id ${trainId}` });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});

export default router;
