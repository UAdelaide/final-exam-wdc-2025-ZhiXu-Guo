var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // Set your MySQL root password
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    // Create a table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        author VARCHAR(255)
      )
    `);

    // Insert data if table is empty
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO Users(username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('mike123', 'mike@example.com', 'hashed246', 'owner'),
        ('john456', 'john@example.com', 'hashed135', 'owner');
        `);
      await db.execute(`
        INSERT INTO Dogs(owner_id, name, size) 
        VALUES (
        (SELECT user_id FROM Users WHERE username = 'alice123'), 'MAX', 'medium');
        `)
      await db.execute(`
        INSERT INTO Dogs(owner_id, name, size)
        VALUES (
        (SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small');
        `)
      await db.execute(`
        INSERT INTO Dogs(owner_id, name, size)
        VALUES (
        (SELECT user_id FROM Users WHERE username = 'mike123'), 'Lucy', 'medium');
        `)
      await db.execute(`
        INSERT INTO Dogs(owner_id, name, size)
        VALUES (
        (SELECT user_id FROM Users WHERE username = 'john456'), 'Nancy', 'small');
        `)
      await db.execute(`
        INSERT INTO Dogs(owner_id, name, size)
        VALUES (
        (SELECT user_id FROM Users WHERE username = 'cindy123'), 'Lily', 'small');
        `)
      
      await db.execute(`
        INSERT INTO WalkRequests(dog_id, requested_time, duration_minutes, location, status)
        VALUES(
        (SELECT dog_id FROM Dogs WHERE name = 'MAX'), '2025-06-10 08:00:00', '30', 'Parklands', 'open');
        `)
      await db.execute(`
        INSERT INTO WalkRequests(dog_id, requested_time, duration_minutes, location, status)
        VALUES(
        (SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', '45', 'Beachside Ave', 'accepted');
        `)
      await db.execute(`
        INSERT INTO WalkRequests(dog_id, requested_time, duration_minutes, location, status)
        VALUES(
        (SELECT dog_id FROM Dogs WHERE name = 'Lucy'), '2025-06-12 11:35:00', '20', 'Central Park', 'open');
        `)
      await db.execute(`
        INSERT INTO WalkRequests(dog_id, requested_time, duration_minutes, location, status)
        VALUES(
        (SELECT dog_id FROM Dogs WHERE name = 'Nancy'), '2025-06-13 15:20:00', '35', 'Parklands', 'open');
        `)
      await db.execute(`
        INSERT INTO WalkRequests(dog_id, requested_time, duration_minutes, location, status)
        VALUES(
        (SELECT dog_id FROM Dogs WHERE name = 'Lily'), '2025-06-15 18:40:00', '40', 'Central Park', 'open');
        `)
      }
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

app.get('/api/dogs', async(req,res) => {
    try{
        const query=`SELECT d.name AS dog_name, d.size, u.username AS owner_username 
        From Dogs AS d
        LEFT JOIN Users AS u ON u.user_id = d.owner_id`;
        const [rows] = await db.query(query);
        res.json(rows); 
    }catch (err){
        res.status(500).json({error: e.toString()})
    }
 });

 app.get('/api/walkrequests/open', async(req, res) => {
    try{
        const query = `SELECT d.name AS dog_name, wr.request_id, wr.requested_time, wr.duration_minutes,
        wr.location, u.username AS owner_username FROM WalkRequest AS wr
        LEFT JOIN Dogs AS d ON d.dog_id = wr.dog_id 
        LEFT JOIN Users AS u ON u.user_id = d.owner_id WHERE wr.status = 'open'`
        const [rows] = await db.query(query);
        res.json(rows); 
    }catch(err){
        res.status(500).json({error: e.toString()})
    }
})

app.get('/api/walkers/summary', async(req,res) => {
    try{
        const query = `SELECT w.username, sum(wr.rating) AS total_rating, avg(wr.rating) AS average_rating, 
        count(wr.request_id) AS completed_walks FROM Users AS u
        LEFT JOIN WalkRating AS wr ON wr.walker_id = u.user_id
        LEFT JOIN WalkApplications AS wa ON wa.walker_id = u.user_id AND wa.status = 'accepted'
        LEFT JOIN WalkRequests AS wq ON wq.request_id = wa.request_id AND wq.status = 'completed'
        WHERE u.role = 'walker' GROUP BY u.user_id `;
        const [rows] = await db.query;
        res.json(rows);
    } catch(err){
        res.status(500).json({error: e.toString()})
    }
})

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;