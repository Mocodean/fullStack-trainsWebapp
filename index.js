import express from 'express';
import { join } from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import gyokerRouts from './routes/gyoker.js';
import trainRouts from './routes/trains.js';
import resevationRouts from './routes/reservations.js';
import loginRouts from './auth/login.js';
import logoutRoutes from './auth/logout.js';
import regisztracioRouts from './auth/regisztracio.js';
import { authAdminJwt, authJwt, authUserJwt } from './middleware/authjwt.js';

const app = express();

app.use(express.static(join(process.cwd(), 'public')));

// beallitja a view engine-t
app.set('view engine', 'ejs');
app.set('views', join(process.cwd(), 'views'));

app.use(cookieParser());

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authJwt);
app.use('/reservations', authUserJwt);
app.use('/torol', authUserJwt);
app.use('/modosit', authAdminJwt);
app.use('/datum', authUserJwt);
app.use('/vonat', authAdminJwt);

app.use('/trains/foglal', authUserJwt);
app.use('/trains/newtrain', authAdminJwt);
app.use('/trains/insert', authAdminJwt); // vonatok modosito oldala- admin

app.use('/', gyokerRouts);
app.use('/trains', trainRouts);
app.use('/reservations', resevationRouts);
app.use('/login', loginRouts);
app.use('/regisztracio', regisztracioRouts);
app.use('/logout', logoutRoutes);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
