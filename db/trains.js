import pool from './connection.js';

// VONATOK --------------------------------------------
// lekeri az osszes vonatot
export async function getAllTrains() {
  try {
    const [rows] = await pool.query('SELECT * FROM Trains');
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// beszur egy uj vonatot
export async function insertNewTrain(train) {
  try {
    const query =
      'INSERT INTO Trains (honnan, hova, day, departuretime, arrivaltime, traintype, trainprice) VALUES (?, ?, ?, ?, ?, ?, ?)';
    return await pool.query(query, [
      train.from,
      train.to,
      train.day,
      train.departuretime,
      train.arrivaltime,
      train.traintype,
      train.trainprice,
    ]);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function deleteTrainById(id) {
  try {
    const query = 'DELETE FROM Trains WHERE id = ?';
    return await pool.query(query, [id]);
  } catch (err) {
    console.error(err);
    return [];
  }
}

// modositas
export async function updateTrainById(id, train) {
  try {
    console.log(train);
    const query =
      'UPDATE Trains SET honnan = ?, hova = ?, day = ?, departuretime = ?, arrivaltime = ?, traintype = ?, trainprice = ? WHERE id = ?';
    return await pool.query(query, [
      train.from,
      train.to,
      train.day,
      train.departuretime,
      train.arrivaltime,
      train.traintype,
      train.trainprice,
      id,
    ]);
  } catch (err) {
    console.error(err);
    return [];
  }
}

function getDay(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(date).getDay()];
}

function buildQuery1(query, req, filtersCount, filters) {
  if (req.from) {
    console.log('itt vagyok from');
    filtersCount++;
    query += ' WHERE honnan = ?';
    filters.push(req.from);
  }
  if (filtersCount === 0 && req.to) {
    filtersCount++;
    query += ' WHERE hova = ?';
    filters.push(req.to);
  } else if (req.to) {
    query += ' AND hova = ?';
    filtersCount++;
    filters.push(req.to);
  }
  if (filtersCount === 0 && req.minprice) {
    filtersCount++;
    query += ' WHERE trainprice >= ?';
    filters.push(req.minprice);
  } else if (req.minprice) {
    query += ' AND trainprice >= ?';
    filtersCount++;
    filters.push(req.minprice);
  }
  if (filtersCount === 0 && req.maxprice) {
    filtersCount++;
    query += ' WHERE trainprice <= ?';
    filters.push(req.maxprice);
  } else if (req.maxprice) {
    query += ' AND trainprice <= ?';
    filtersCount++;
    filters.push(req.maxprice);
  }
  console.log(query);
  return { query, filtersCount, filters };
}

function buildQuery2(query, req, filtersCount, filters) {
  if (filtersCount === 0 && req.day) {
    filtersCount++;
    query += ' WHERE day = ?';
    filters.push(getDay(req.day));
  } else if (req.day) {
    query += ' AND day = ?';
    filtersCount++;
    filters.push(getDay(req.day));
  }

  if (filtersCount === 0 && req.type) {
    filtersCount++;
    query += ' WHERE traintype = ?';
    filters.push(req.type);
  } else if (req.type) {
    query += ' AND traintype = ?';
    filtersCount++;
    filters.push(req.type);
  }
  return { query, filtersCount, filters };
}

// kereses
export async function searchTrains(req) {
  try {
    // keres dinamikus felepitese a szurok fuggvenyeben (nem kell minden szuro)
    const response = buildQuery1('SELECT * FROM Trains', req, 0, []);

    const { query, filters } = buildQuery2(response.query, req, response.filtersCount, response.filters);

    console.log(query);

    const [rows] = await pool.query(query, filters);
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// lekeri egy vonatot az azonositoja alapjan
export async function getTrainById(id) {
  try {
    const query = 'SELECT * FROM Trains WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// lekri a jaratokat egy atszallassal
export async function getTrainsPartialOne() {
  try {
    const sqlQuery = `
    SELECT 
      a.id as id1,
      b.id as id2,
      a.honnan as honnan,
      b.hova as hova,
      a.day as nap,
      TIMEDIFF(b.arrivaltime, a.departuretime) AS total_duration,
      TIMEDIFF(b.departuretime, a.arrivaltime) AS transfer_duration,
      (a.trainprice + b.trainprice) AS total_price
    FROM 
      Trains a
    JOIN 
      Trains b 
      ON a.hova = b.honnan 
      AND a.day = b.day 
      AND a.arrivaltime < b.departuretime;
    `;

    const [rows] = await pool.query(sqlQuery);
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// lekri a jaratokat ket atszallassal
export async function getTrainsPartialTwo() {
  try {
    const sqlQuery = `
    SELECT 
        a.id as id1,
        b.id as id2,
        c.id as id3,
        a.honnan as honnan,
        c.hova as hova,
        a.day as nap,
        TIMEDIFF(c.arrivaltime, a.departuretime) AS total_duration,
        TIMEDIFF(b.departuretime, a.arrivaltime) AS transfer_duration_1,
        TIMEDIFF(c.departuretime, b.arrivaltime) AS transfer_duration_2,
        (a.trainprice + b.trainprice + c.trainprice) AS total_price
    FROM 
        Trains a
    JOIN 
        Trains b 
        ON a.hova = b.honnan 
        AND a.day = b.day 
        AND a.arrivaltime < b.departuretime
    JOIN 
        Trains c 
        ON b.hova = c.honnan 
        AND b.day = c.day 
        AND b.arrivaltime < c.departuretime
    `;

    const [rows] = await pool.query(sqlQuery);
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

function felepit(query, req, filtersCount, filters) {
  if (req.from) {
    filtersCount++;
    query += ' WHERE a.honnan = ?';
    filters.push(req.from);
  }
  if (req.to) {
    if (filtersCount === 0) {
      query += ' WHERE b.hova = ?';
    } else {
      query += ' AND b.hova = ?';
    }
    filtersCount++;
    filters.push(req.to);
  }
  if (req.minprice) {
    if (filtersCount === 0) {
      query += ' WHERE (a.trainprice + b.trainprice) >= ?';
    } else {
      query += ' AND (a.trainprice + b.trainprice) >= ?';
    }
    filtersCount++;
    filters.push(req.minprice);
  }
  if (req.maxprice) {
    if (filtersCount === 0) {
      query += ' WHERE (a.trainprice + b.trainprice) <= ?';
    } else {
      query += ' AND (a.trainprice + b.trainprice) <= ?';
    }
    filtersCount++;
    filters.push(req.maxprice);
  }
  // Add date filter if provided
  return { query, filtersCount, filters };
}

export async function searchTrainOneTransfer(req) {
  try {
    const sqlQuery = `
    SELECT 
      a.id as id1,
      b.id as id2,
      a.honnan as honnan,
      b.hova as hova,
      a.day as nap,
      TIMEDIFF(b.arrivaltime, a.departuretime) AS total_duration,
      TIMEDIFF(b.departuretime, a.arrivaltime) AS transfer_duration,
      (a.trainprice + b.trainprice) AS total_price
    FROM 
      Trains a
    JOIN 
      Trains b 
      ON a.hova = b.honnan 
      AND a.day = b.day 
      AND a.arrivaltime < b.departuretime
    `;

    const { query, filters } = felepit(sqlQuery, req, 0, []);

    const [rows] = await pool.query(query, filters);
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

function buildQuery4(query, req, filtersCount, filters) {
  if (req.from) {
    filtersCount++;
    query += ' WHERE a.honnan = ?';
    filters.push(req.from);
  }
  if (filtersCount === 0 && req.to) {
    filtersCount++;
    query += ' WHERE c.hova = ?';
    filters.push(req.to);
  } else if (req.to) {
    query += ' AND c.hova = ?';
    filtersCount++;
    filters.push(req.to);
  }
  if (filtersCount === 0 && req.minprice) {
    filtersCount++;
    query += ' WHERE total_price >= ?';
    filters.push(req.minprice);
  } else if (req.minprice) {
    query += ' AND total_price >= ?';
    filtersCount++;
    filters.push(req.minprice);
  }
  if (filtersCount === 0 && req.maxprice) {
    filtersCount++;
    query += ' WHERE total_price <= ?';
    filters.push(req.maxprice);
  } else if (req.maxprice) {
    query += ' AND total_price <= ?';
    filtersCount++;
    filters.push(req.maxprice);
  }
  // nap szerint meg kellenne

  return { query, filtersCount, filters };
}

export async function searchTrainTwoTransfer(req) {
  try {
    const sqlQuery = `
    SELECT 
        a.id as id1,
        b.id as id2,
        c.id as id3,
        a.honnan as honnan,
        c.hova as hova,
        a.day as nap,
        TIMEDIFF(c.arrivaltime, a.departuretime) AS total_duration,
        TIMEDIFF(b.departuretime, a.arrivaltime) AS transfer_duration_1,
        TIMEDIFF(c.departuretime, b.arrivaltime) AS transfer_duration_2,
        (a.trainprice + b.trainprice + c.trainprice) AS total_price
    FROM 
        Trains a
    JOIN 
        Trains b 
        ON a.hova = b.honnan 
        AND a.day = b.day 
        AND a.arrivaltime < b.departuretime
    JOIN 
        Trains c 
        ON b.hova = c.honnan 
        AND b.day = c.day 
        AND b.arrivaltime < c.departuretime
    `;

    const { query, filters } = buildQuery4(sqlQuery, req, 0, []);
    console.log(query);
    console.log(filters);
    const [rows] = await pool.query(query, filters);
    console.log('adatbazis kezeloben');
    console.log(rows);
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}
