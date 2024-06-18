import jwt from 'jsonwebtoken';

export function authJwt(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    console.log('nincs bejeletkezve');
    res.locals.jwt = '';
    next();
  } else {
    jwt.verify(token, '123mysecret123', (err, decoded) => {
      if (err) {
        console.log('gond bejelentkezesnel');
        res.locals.jwt = '';
        next();
      } else {
        console.log('bejelentkezve');
        // console.log(decoded);
        res.locals.jwt = decoded;
        next();
      }
    });
  }
}

export function authUserJwt(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    console.log('nincs bejelentkezve');
    res.locals.jwt = '';
    res.status(404).redirect('/login');
  } else {
    jwt.verify(token, '123mysecret123', (err, decoded) => {
      if (err) {
        console.log('gond a bejeletkezessel');
        res.locals.jwt = '';
        res.status(404).redirect('/login');
      } else {
        if (decoded.rang !== 'user' && decoded.rang !== 'admin') {
          console.log('nem user');
          res.locals.jwt = '';
          res.status(404).redirect('/login');
          return;
        }
        console.log('bejelntkezve user');
        console.log(decoded);
        res.locals.jwt = decoded;
        next();
      }
    });
  }
}

export function authAdminJwt(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    console.log('nincs bejelentkezve');
    res.locals.jwt = '';
    res.status(404).redirect('/login');
  } else {
    jwt.verify(token, '123mysecret123', (err, decoded) => {
      if (err) {
        console.log('gond a bejeletkezessel');
        res.locals.jwt = '';
        res.status(401).redirect('/login');
      } else {
        if (decoded.rang !== 'admin') {
          console.log('nem admin');
          res.locals.jwt = '';
          res.status(403).redirect('/login');
          return;
        }
        console.log('bejelntkezve admin');
        console.log(decoded);
        res.locals.jwt = decoded;
        next();
      }
    });
  }
}
