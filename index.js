import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express()
app.use(express.json());
app.use(cors());


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Public/Uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/Public/Uploads', express.static('Public/Uploads'));

const port = 1337
const db = new sqlite3.Database('./movies.db');


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

// *luisteren naar post

app.post('/newmovie', upload.single('poster'), (req, res) => {
  let { title, director, release_year, genre } = req.body;
  let posterPath = req.file ? `/Public/Uploads/${req.file.filename}` : null;


  if (!title || !director || !release_year || !genre) {
    res.sendStatus(400);
  } else {
    const query = `INSERT INTO movies (title, release_year, director, genre, poster_path) VALUES (?, ?, ?, ?, ?)`;
    const values = [title, release_year, director, genre, posterPath];

    db.run(query, values, function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error ' + err.message);
        return;
      } 
      res.status(201).json({ title, director, release_year, genre, poster_path: posterPath });
    });
  }
  
});

app.listen(port, () => {
 console.log(`Server is listening at http://localhost:${port}`);
});




    // *kijken of alles is ingevuld
    // *checken of het niet al bestaat in de database
    // *in de database zetten
    // *ok terug sturen
    //! Syntax om rows te deleten in db browser: DELETE FROM movies WHERE id BETWEEN 3 AND 15;

        //const query = `INSERT INTO movies (title, release_year, director, genre, poster) VALUES ('${title}', ${release_year}, '${director}', '${genre}', 'poster-shaw.jpg')`;

    //db.run(query, function (err){
    //    if (err){
     //       res.statusCode(500)
     //   }
     //   console.log('prima')
     //   res.status(201).json({ title, director, release_year, genre });
   // });