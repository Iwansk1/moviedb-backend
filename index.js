import express from 'express'
import bodyParser from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'


const app = express()
app.use(express.json());
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
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

// *luisteren naar post

app.post('/newmovie', (req, res) => {

    let {title, director, release_year, genre, poster_path} = req.body;

    //*console.log(title, director, release_year, genre);

    if(!title || !director || !release_year || !genre){
        res.sendStatus(400);
    }else{
        //! Checken of het bestaat aan de hand van jaar


        const query = `INSERT INTO movies (title, release_year, director, genre, poster_path) VALUES (?, ?, ?, ?, ?)`;
        const values = [title, release_year, director, genre, poster_path];
      
        console.log(query, values);
      
        db.run(query, values, function (err) {
          if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
          }
        res.status(201).json({ title, director, release_year, genre, });
        }); 
        //*console.log(query);
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