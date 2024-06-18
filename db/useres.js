import pool from './connection.js';

// FELHASZNALOK --------------------------------------------
// lekeri az osszes felhasznalot
export async function getAllUsers() {
  try {
    const [rows] = await pool.query('SELECT * FROM Users');
    return rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// FELHASZNALOK --------------------------------------------
// lekeri egy felhasznalot az azonositoja alapjan
export async function getUserById(id) {
  try {
    const query = 'SELECT * FROM Users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// lekeri egy felhasznalot a felhasznaloneve alapjan
export async function getUserByUsername(username) {
  try {
    const query = 'SELECT * FROM Users WHERE username = ?';
    const [rows] = await pool.query(query, [username]);
    return rows[0];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// uj felhasznalo beszurasa
export async function insertNewUser(user) {
  try {
    const query = 'INSERT INTO Users (username, password, rang) VALUES (?, ?, ?)';
    return await pool.query(query, [user.username, user.password, user.rang]);
  } catch (err) {
    console.error(err);
    return [];
  }
}
