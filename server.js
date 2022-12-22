import express from "express";
import axios from "axios";
import cors from "cors";
// config.js
import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 4000;
const api_key = process.env.PK_KEY;
const st_key = process.env.ST_KEY;

const apiPath =
  "https://cloud.iexapis.com/v1/stock/market/batch?&types=quote&symbols=aapl,fb,tsla&token=pk_77ef1294a9fd4bfeb1523b52629328e1";

const intraday = `https://cloud.iexapis.com/stable/stock/aapl/intraday-prices?token=${api_key}
`;

const history = `https://cloud.iexapis.com/v1/stock/AAPL/chart/1m?token=pk_77ef1294a9fd4bfeb1523b52629328e1`;

async function getData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
    // console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

app.get("/stocks", async (req, res) => {
  const data = await getData(apiPath);
  res.status(200).send(data);
});

app.get("/intraday", async (req, res) => {
  const data = await getData(apiPath);
  res.status(200).send(data);
});

app.get("/historical", async (req, res) => {
  const data = await getData(history);
  console.log(data);
  // can't send a response to client side
  res.status(200).send(data);
});

app.listen(PORT, () => console.log(`Live in this ${PORT}`));

// https://iexcloud.io/blog/video-tutorial-how-to-get-started-with-the-iex-cloud-api
// The current dayʼs minute-by-minute stock prices, using free IEX data:
// https://cloud.iexapis.com/stable/stock/TWTR/chart/date/20200601?token=${api_key}

// Historical data
// https://cloud.iexapis.com/stable/stock/TWTR/chart/date/20221010?token=${api_key}
