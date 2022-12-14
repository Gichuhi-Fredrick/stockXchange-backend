export function make_API_call(url) {
  return new Promise((resolve, reject) => {
    request(url, { json: true }, (err, res, body) => {
      if (err) reject(err);
      resolve(body);
    });
  });
}

// All symbols
// https://cloud.iexapis.com/beta/ref-data/symbols?token=pk_77ef1294a9fd4bfeb1523b52629328e1

// const symbols = ["AAPL", "META", "GOOGL", "TSLA"];
// `https://cloud.iexapis.com/v1/stock/market/batch?symbols=${tickerArray
//   .toString()
//   .toLowerCase()}&types=quote&token=${process.env.IEXCLOUD_API_KEY}`;

// batch mutliple symbols
// https://cloud.iexapis.com/v1/stock/market/batch?&types=quote&symbols=aapl,fb,tsla&token=pk_77ef1294a9fd4bfeb1523b52629328e1
