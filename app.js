require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { handleErrors } = require('./middlewares/handleErrors');
const routerCrash = require('./errors/crashTest');

const { PORT = 3000 } = process.env;

const app = express();

const allowedCors = [
  'http://localhost:3000',
  'http://aziz-movies-diplom.nomoredomains.rocks',
  'https://aziz-movies-diplom.nomoredomains.rocks',
  'http://api.aziz-movies-diplom.nomoredomains.rocks',
  'https://api.aziz-movies-diplom.nomoredomains.rocks',
];

const cosrOptions = {
  origin: allowedCors,
  optionSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin'],
  credentials: true,
};

app.use(cors(cosrOptions));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(router);

app.use(requestLogger);

app.use(routerCrash);

app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

async function start() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');
    app.listen(PORT, () => {
      console.log(`App is listening on portik ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
