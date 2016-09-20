/* use strict */
// BASE SETUP
// =============================================================================
const express = require('express'); // call express
const bodyParser = require('body-parser');
const Movie = require('./app/models/movie');

const app = express(); // define our app using express
const Router = express.Router;


// DB CONNECTION
// =============================================================================
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
const router = new Router();

// middleware to use for all requests
router.use((req, res, next) => {
  // do logging
  console.log('Something is happening!!!! O_o');
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
router.route('/movies')
  .post((req, res) => {
    const movie = new Movie();
    movie.name = req.body.name;
    movie.year = req.body.year;
    movie.watched = req.body.watched;

    movie.save((err) => {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'Movie created!' });
    });
  })

  .get((req, res) => {
    Movie.find((err, movies) => {
      if (err) {
        res.send(err);
      }
      res.json(movies);
      return true;
    });
  });

router.route('/movies/:movie_id')
  .get((req, res) => {
    Movie.findById(req.params.movie_id, (err, movie) => {
      if (err) {
        res.send(err);
      }

      res.json(movie);
    });
  })

  .put((req, res) => {
    Movie.findById(req.params.movie_id, (err, movie) => {
      if (err) {
        res.send(err);
      }

      movie.name = req.body.name ? req.body.name : movie.name;
      movie.year = req.body.year ? req.body.year : movie.year;
      movie.watched = req.body.watched ? req.body.watched : movie.watched;

      movie.save((err2) => {
        if (err2) {
          res.send(err2);
        }

        res.json({ message: `Movie: ${movie.id} updated` });
      });
    });
  })

  .delete((req, res) => {
    const movieId = req.params.movie_id;
    Movie.remove({
      _id: movieId,
    }, (err) => {
      if (err) {
        res.send(err);
      }

      res.json({ message: `Movie: ${movieId} deleted` });
    });
  });


// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`Server running, magic happens on port ${port}`);
