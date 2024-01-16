import express from 'express'
import sqlite3 from 'sqlite3'


const app = express()
app.use(express.json());

const port = 1337
const db = new sqlite3.Database('./movies.db');

app.get('/', (req, res) => {
 res.send('Hello World!')
})
app.get('/movies', (req, res) => {

 const query = 'SELECT * FROM movies';

 db.all(query, [], (err, movies) => {
 if (err) {

 console.error(err);

 res.status(500).send('Internal Server Error');

 return;
 }
 res.json(movies);
 })
});
app.listen(port, () => {
 console.log(`Server is listening at http://localhost:${port}`);
});