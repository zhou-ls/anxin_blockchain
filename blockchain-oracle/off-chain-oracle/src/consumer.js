import {
  updatedRequest,
  newRequest
} from "./ethereum";
//当这个服务运行时，随着交易成功入块上链，它将会周期性地向控制台输出这些数据
const consume = () => {
  updatedRequest((error, result) => {
    console.log("UPDATE REQUEST DATA EVENT ON SMART CONTRACT");
    console.log("BLOCK NUMBER: ");
    console.log("  " + result.blockNumber)
    console.log("UPDATE REQUEST DATA: ");
    console.log(result.args);
    console.log("\n");
  });

  newRequest((error, result) => {
    console.log("NEW REQUEST DATA EVENT ON SMART CONTRACT");
    console.log("BLOCK NUMBER: ");
    console.log("  " + result.blockNumber)
    console.log("NEW REQUEST DATA: ");
    console.log(result.args);
    console.log("\n");
  });
};

export default consume;