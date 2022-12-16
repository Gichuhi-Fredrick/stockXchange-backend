import express from "express";
import axios from "axios";
import cors from "cors";
import * as dotenv from "dotenv";
import { data } from "./data.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 4000;
const api_key = process.env.PK_KEY;

const apiPath =
  "https://cloud.iexapis.com/v1/stock/market/batch?&types=quote&symbols=aapl,fb,tsla&token=${api_key}";

const intraday = `https://cloud.iexapis.com/stable/stock/aapl/intraday-prices?token=${api_key}
`;

const history = `https://cloud.iexapis.com/stable/stock/TWTR/chart/date/20221010?token=${api_key} `;

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

app.get("/hitorical", async (req, res) => {
  const data = await getData(apiPath);
  res.status(200).send(data);
});

app.listen(PORT, () => console.log(`Live in this ${PORT}`));

// https://iexcloud.io/blog/video-tutorial-how-to-get-started-with-the-iex-cloud-api
// The current dayʼs minute-by-minute stock prices, using free IEX data:
// https://cloud.iexapis.com/stable/stock/TWTR/chart/date/20200601?token=${api_key}

// Historical data
// https://cloud.iexapis.com/stable/stock/TWTR/chart/date/20221010?token=${api_key}
