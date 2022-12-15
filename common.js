import fetch from "node-fetch";
import IEXCloudClient from "node-iex-cloud";

const iex = new IEXCloudClient(fetch, {
  sandbox: true,
  publishable: "pk_21b4ffeccc6e3cnc1df07467a47231c6",
  version: "stable",
});

iex
  .symbol("googl")
  .financials("quarterly")
  .then((res) => console.log(res));
