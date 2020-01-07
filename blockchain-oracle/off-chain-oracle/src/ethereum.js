require("dotenv").config();

import Web3 from "web3";


const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_ADDRESS));
const abi = JSON.parse(process.env.ABI);
const address = process.env.CONTRACT_ADDRESS;
//contract是一个包含了合约的部署地址和ABI信息的js对象，这些与智能合约相关的函数都来自于著名的web3开发包
const contract = web3.eth.contract(abi).at(address);

const account = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err === null) {
        resolve(accounts[process.env.ACCOUNT_NUMBER]);
      } else {
        reject(err);
      }
    });
  });
};
//调用智能合约的updatedRequest()方法的以太坊交易。注意account()是一个异步方法，它的作用是载入一个以太坊账户，contract是一个js对象，
// 它包含了之前部署的Oracle智能合约的部署地址和ABI接口数据。这些与智能合约相关的函数都来自于著名的web3开发包
export const createRequest = ({
  urlToQuery,
  attributeToFetch
}) => {
  return new Promise((resolve, reject) => {
    account().then(account => {
      contract.createRequest(urlToQuery, attributeToFetch, {
        from: account,
        gas: 60000000
      }, (err, res) => {
        if (err === null) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    }).catch(error => reject(error));
  });
};
//调用智能合约方法的以太坊交易
export const updateRequest = ({
  id,
  valueRetrieved
}) => {
  return new Promise((resolve, reject) => {
    account().then(account => {
      contract.updateRequest(id, valueRetrieved, {
        from: account,
        gas: 60000000
      }, (err, res) => {
        if (err === null) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    }).catch(error => reject(error));
  });
};

export const newRequest = (callback) => {
  contract.NewRequest((error, result) => callback(error, result));
};

export const updatedRequest = (callback) => {
  contract.UpdatedRequest((error, result) => callback(error, result));
};