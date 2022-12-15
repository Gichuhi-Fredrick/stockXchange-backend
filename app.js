import express from "express";
import { make_API_call } from "./apiHelper.js";
import cors from "cors";
import * as dotenv from "dotenv";
import { data as stockSymbols } from "./data.js";

dotenv.config();

const app = express();

app.use(cors());
const PORT = 4000;
const api_key = process.env.PK_KEY;
const baseUrl = `https://cloud.iexapis.com/`;
const stocksUrl = `https://cloud.iexapis.com/stable/ref-data/symbols/?token=pk_77ef1294a9fd4bfeb1523b52629328e1`;

const quotes = `https://cloud.iexapis.com/v1/stock/market/batch?symbols=${stockSymbols
  .toString()
  .toLowerCase()}&types=quote&token=${api_key}`;

const dimp =
  "https://cloud.iexapis.com/v1/stock/market/batch?&types=quote&symbols=aapl,fb,tsla&token=pk_77ef1294a9fd4bfeb1523b52629328e1";

const url = `https://api.iex.cloud/v1/data/core/quote/aapl?token=pk_77ef1294a9fd4bfeb1523b52629328e1`;

app.use(express.json()); // for parsing application/json
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/stocks", (req, res) => {
  make_API_call
    .make_API_call(`${url}`)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/quote", async (req, res) => {
  await res.send("hello world!");
});

app.listen(PORT, (err) => {
  if (err) console.log("Error!", err);
  console.log(`Port ${PORT} is online`);
});
