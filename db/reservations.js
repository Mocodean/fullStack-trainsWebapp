import pool from './connection.js';

export async function getAllReservations() {
  try {
    const [rows] = await pool.query('SELECT * FROM Reservations');
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// beszur egy uj foglalast
export async function insertNewReservation(reservation) {
  try {
    const query = 'INSERT INTO Reservations (trainid, userid, date) VALUES (?, ?, ?)';
    return await pool.query(query, [reservation.trainid, reservation.userid, reservation.date]);
  } catch (err) {
    console.error(err);
    return [];
  }
}

// lekeri az osszes foglalast egy vonat alapjan
export async function getReservationsByTrainId(trainid) {
  try {
    const query = 'SELECT * FROM Reservations WHERE trainid = ?';
    const [rows] = await pool.query(query, [trainid]);
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// lekeri egy foglalast az azonositoja alapjan
export async function getReservationById(id) {
  try {
    const query = 'SELECT * FROM Reservations WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// lekeri az osszes foglalast egy felhasznalo alapjan
export async function getReservationsByUserId(userid) {
  try {
    const query = 'SELECT * FROM Reservations WHERE userid = ?';
    const [rows] = await pool.query(query, [userid]);
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// torol egy foglalast az azonositoja alapjan
export async function deleteReservationById(id) {
  try {
    const query = 'DELETE FROM Reservations WHERE id = ?';
    return await pool.query(query, [id]);
  } catch (err) {
    console.error(err);
    return [];
  }
}

// modositja egy foglalas datumat
export async function updateReservationDateById(id, date) {
  try {
    const query = 'UPDATE Reservations SET date = ? WHERE id = ?';
    return await pool.query(query, [date, id]);
  } catch (err) {
    console.error(err);
    return [];
  }
}
