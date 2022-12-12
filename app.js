const express = require("express");
const api_helper = require("./apiHelper");
const cors = require("cors");
require("dotenv").config();
import { data } from "./data.js";

const app = express();

app.use(cors());
const PORT = 4000;
const api_key = process.env.PK_KEY;
const baseUrl = `https://cloud.iexapis.com/`;
const stocksUrl = `https://cloud.iexapis.com/stable/ref-data/symbols/?token=pk_77ef1294a9fd4bfeb1523b52629328e1`;

// const symbols = dataSymbols;

const quotes = `https://cloud.iexapis.com/v1/stock/market/batch?symbols=${symbols
  .toString()
  .toLowerCase()}&types=quote&token=${api_key}`;

app.use(express.json()); // for parsing application/json
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/stocks", cors(), (req, res) => {
  api_helper
    .make_API_call(`${quotes}`)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(PORT, (err) => {
  if (err) console.log("Error!", err);
  console.log(`Port ${PORT} is online`);
});
