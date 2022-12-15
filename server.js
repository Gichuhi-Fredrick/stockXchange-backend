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
  "https://cloud.iexapis.com/v1/stock/market/batch?&types=quote&symbols=aapl,fb,tsla&token=pk_77ef1294a9fd4bfeb1523b52629328e1";

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

app.listen(PORT, () => console.log(`Live in this ${PORT}`));
