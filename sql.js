import sqlite3 from "sqlite3";

const execute = async (db, sql, params = []) => {
  if (params && params.length > 0) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const fetchAll = async (db, sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const fetchFirst = async (db, sql, params) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const db_file = "listings.db"

export async function createTable()
{
  const db = new sqlite3.Database(db_file);
  try {
    await execute(
      db,
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        condition TEXT NOT NULL,
        seller TEXT NOT NULL,
        email TEXT NOT NULL,
        pickup TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        isUserListing BIT NOT NULL)`
    );
  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }
}
export async function addListing(data)
{
  console.assert(data.length == 12, 'incorrect data length');
  const db = new sqlite3.Database(db_file);
  const sql = `INSERT INTO products(id,title,category,price,condition,seller,email,pickup,description,status,createdAt,isUserListing) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    await execute(db, sql, data);
  } catch (err) {
    console.log(err);
  } finally {
    db.close();
  }
}
export async function resetTable() {
  const db = new sqlite3.Database(db_file);
  let sql = "DELETE FROM products";
    try {
    await execute(
      db,
      sql
    );
    await addListing([
    1,
    "Calculus I Textbook Bundle",
    "Textbooks",
    55,
    "Good",
    "Jacky Lei",
    "jlei@stevens.edu",
    "Science Hall entrance",
    "Includes textbook, formula sheet packet, and lightly used notebook from last semester.",
    "available",
    "2026-03-24T15:00:00.000Z",
    0
    ]);
    await addListing([
    2,
    "Calculus I Textbook Bundle",
    "Textbooks",
    55,
    "Good",
    "Jacky Lei",
    "jlei@stevens.edu",
    "Science Hall entrance",
    "Includes textbook, formula sheet packet, and lightly used notebook from last semester.",
    "available",
    "2026-03-24T15:00:00.000Z",
    0
    ]);
  } catch (error) {
    console.log(error);
  } finally {
    db.close();
  }
}

export async function getAllListings() 
{
  const db = new sqlite3.Database(db_file);
  let sql = `SELECT * FROM products`;
  try {
    const products = await fetchAll(db, sql);
    console.log(products[0]);
    return products
  } catch (err) {
    console.log(err);
  } finally {
    db.close();
  }
}