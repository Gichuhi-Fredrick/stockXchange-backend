const axios = require("axios");
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const finnhub = require("finnhub");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
const API_KEY = process.env.PK_KEY;
const FH_KEY = process.env.FH_KEY;

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = FH_KEY;

const apiPath = `https://cloud.iexapis.com/v1/stock/market/batch?&types=quote&symbols=aapl,fb,tsla?token=${API_KEY}`;
const history = `https://cloud.iexapis.com/v1/stock/AAPL/chart/1m?token=${API_KEY}`;
const urlForex = `https://finnhub.io/api/v1/forex/symbol?exchange=oanda&token=cegligiad3i0qis37ar0cegligiad3i0qis37arg`;

async function getData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchSymbols(url) {
  try {
    // Make the request to the IEX Cloud API
    const response = await axios.get(`${url}/ref-data/symbols`, {
      params: {
        token: API_KEY,
      },
    });

    // Extract the data from the response
    const symbols = response.data;

    // Do something with the symbols
    // console.log(symbols);
    return symbols;
  } catch (error) {
    console.error;
  }
}

// extract forex currencies from the data returned
function getDisplaySymbol(data) {
  return data.map(function (item) {
    return item.displaySymbol;
  });
}

app.get("/stocks", async (req, res) => {
  const data = await fetchSymbols(apiPath);
  // console.log(data);
  res.status(200).send(data ? data : []);
});

app.get("/forex", async (req, res) => {
  const finnhubClient = new finnhub.DefaultApi();

  finnhubClient.forexSymbols("OANDA", (error, data, response) => {
    const fxCurrency = getDisplaySymbol(data);
    res.status(200).send(fxCurrency);
  });
});

// Get historical data
app.get("/historical", async (req, res) => {
  const data = await getData(history);
  // console.log(data);
  res.status(200).send(data);
});

app.listen(PORT, () => console.log(`Live in port ${PORT}`));

// https://iexcloud.io/blog/video-tutorial-how-to-get-started-with-the-iex-cloud-api
// The current dayʼs minute-by-minute stock prices, using free IEX data:
// https://cloud.iexapis.com/stable/stock/TWTR/chart/date/20200601?token=${api_key}

// Historical data
// https://cloud.iexapis.com/stable/stock/TWTR/chart/date/20221010?token=${api_key}
