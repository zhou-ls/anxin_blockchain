require("dotenv").config();

import request from "request-promise-native";

import {
  updateRequest,
  newRequest
} from "./ethereum";

const start = () => {

  newRequest((error, result) => {
//将API的地址放在一个环境变量里，以便在开发/生产环境切换时避免修改源代码
    let options = {
      uri: result.args.urlToQuery,
      json: true
    };

    request(options)
      .then(parseData(result))
      .then(updateRequest)
      .catch(error);
  });
};

//解析API的响应结果
const parseData = result => (body) => {
  return new Promise((resolve, reject) => {
    let id, valueRetrieved;
    try {
      id = result.args.id;
      valueRetrieved = (body[result.args.attributeToFetch] || 0).toString();
    } catch (error) {
      reject(error);
      return;
    }
    resolve({
      id,
      valueRetrieved
    });
  });
};

export default start;