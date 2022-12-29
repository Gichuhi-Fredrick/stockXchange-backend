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
const IEX_KEY = process.env.ST_KEY;
const FH_KEY = process.env.FH_KEY;
const AV_KEY = process.env.AV_KEY;
const FCS_KEY = process.env.FCS_KEY;

// const api_key = finnhub.ApiClient.instance.authentications["api_key"];
// api_key.apiKey = FH_KEY;

const stocksUrl = `https://cloud.iexapis.com/v1/stock/market/batch?&types=quote&symbols=aapl,fb,tsla?token=${API_KEY}`;

// stocks history change 1m(1month) to call more data
const stocksHistory = `https://cloud.iexapis.com/v1/stock/AMD/chart/1m?token=${API_KEY}`;
// symbols
// const urlForex = `https://finnhub.io/api/v1/forex/symbol?exchange=oanda&token=cegligiad3i0qis37ar0cegligiad3i0qis37arg`;

// historical data for forex
const fxDaily = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${AV_KEY}`;
const cryptoCurrency = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=${AV_KEY}`;
// alternative fx historical data
// `https://fcsapi.com/api-v3/forex/history?symbol=EUR/USD&period=1d&from=2022-06-01T12:00&to=2022-12-27T12:00&access_key=ww22XgaGZAg1DsvPXsqRBa6N`;

// news
const newsUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=COIN,CRYPTO:BTC,FOREX:USD&time_from=20220410T0130&limit=200&?apikey=AV_KEY`;

// Currencies
const forexSymbols = `https://fcsapi.com/api-v3/forex/latest?symbol=all_forex&access_key=${FCS_KEY}`;

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
    return symbols;
  } catch (error) {
    console.error;
  }
}

// new fetch function to replace fetchSymbols
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Extract forex Date open high low close
function extractData(data) {
  const timeSeries = data["Time Series FX (Daily)"];
  const result = [];

  for (const date in timeSeries) {
    const values = timeSeries[date];
    result.push([
      Date.parse(date),
      // + to convert strings to numbers/floats
      +values["1. open"],
      +values["2. high"],
      +values["3. low"],
      +values["4. close"],
    ]);
  }

  return result;
}

// extract forex currencies from the data returned
function getDisplaySymbol(data) {
  return data.map(function (item) {
    return item.displaySymbol;
  });
}

// Todo extract this data to draw charts
//  Cache the data not to exceed 10x
app.get("/stocks", async (req, res) => {
  const data = await fetchData(stocksUrl);
  // const mappedData = Object.values(
  //   data.map((d) => {
  //     return d.open !== null ? [ Date.parse(d.date),d.open, d.high, d.low, d.close] : undefined;
  //   })
  // );
  res.status(200).send(data);
});

app.get("/forex", async (req, res) => {
  const data = await fetchData(fxDaily);
  let dateOHLC = extractData(data);

  res.status(200).send(dateOHLC);
});

// Forex Daily time series
// TODO
// use the currency pairs from forex to query data in this api call
app.get("/fx_daily", async (req, res) => {
  const data = await getData(fxDaily);
  res.status(200).send(data);
});

// crypto historical data
app.get("/crypto", async (req, res) => {
  const data = await getData(cryptoCurrency);
  res.status(200).send(data);
});

// Get historical data for stocks
// Call api per user query or set default data to be displayed
app.get("/historical", async (req, res) => {
  const data = await getData(stocksHistory);
  const mappedData = Object.values(
    data.map((d) => {
      return d.open !== null
        ? [Date.parse(d.date), d.open, d.high, d.low, d.close]
        : undefined;
    })
  );
  res.status(200).send(mappedData);
});

// Get news data for stocks
app.get("/news", async (req, res) => {
  const data = await getData(newsUrl);
  res.status(200).send(data);
});

app.listen(PORT, () => console.log(`${PORT} is online`));

// The current dayʼs minute-by-minute stock prices, using free IEX data:
// https://cloud.iexapis.com/stable/stock/TWTR/chart/date/20200601?token=${api_key}

// Historical data
// https://cloud.iexapis.com/stable/stock/TWTR/chart/date/20221010?token=${api_key}
