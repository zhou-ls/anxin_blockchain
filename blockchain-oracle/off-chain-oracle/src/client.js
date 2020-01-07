require("dotenv").config();

import {
  createRequest
} from "./ethereum";


const start = () => {

  let urlToQuery = 'https://pedrocosta.eu/shameless-promotion';
  let attributeToFetch = 'Website';

  createRequest({
      urlToQuery,
      attributeToFetch
    })
    .then(restart)
    .catch(error);
};

//指定超时后重新启动这个过程
const restart = () => {
  wait(process.env.TIMEOUT).then(start);
};

const wait = (milliseconds) => {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), milliseconds));
};

const error = (error) => {
  console.error(error);
  restart();
};

export default start;