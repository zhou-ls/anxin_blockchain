pragma solidity >=0.4.21 <0.6.0;

contract Oracle {
  Request[] requests; //合约请求列表
  uint currentId = 0; //请求id自增长
  uint minQuorum = 2; //在得到最终结果之前要收到的最少答复数
  uint totalOracleCount = 3; // 硬编码的Oracle计数

  // 定义一般的pai请求
  struct Request {
    uint id;                            //请求的id
    string urlToQuery;                  //API url
    string attributeToFetch;            //json attribute (key) to retrieve in the response
    string agreedValue;                 //value from key
    mapping(uint => string) anwers;     //预言机提供的回应
    mapping(address => uint) quorum;    //预言机将查询答案（1 =预言机尚未投票，2 =预言机已投票）
  }

  //触发Oracle在区块链之外的事件
  event NewRequest (
    uint id,
    string urlToQuery,
    string attributeToFetch
  );

  //定义一个事件，在最终结果达成共识时触发
  event UpdatedRequest (
    uint id,
    string urlToQuery,
    string attributeToFetch,
    string agreedValue
  );

  function createRequest (
    string memory _urlToQuery,
    string memory _attributeToFetch
  )
  public
  {
    uint lenght = requests.push(Request(currentId, _urlToQuery, _attributeToFetch, ""));
    Request storage r = requests[lenght-1];

    // 硬编码的Oracle地址
    r.quorum[address(0x6c2339b46F41a06f09CA0051ddAD54D1e582bA77)] = 1;
    r.quorum[address(0xb5346CF224c02186606e5f89EACC21eC25398077)] = 1;
    r.quorum[address(0xa2997F1CA363D11a0a35bB1Ac0Ff7849bc13e914)] = 1;

    // 启动一个事件以供Oracle在区块链之外检测到
    emit NewRequest (
      currentId,
      _urlToQuery,
      _attributeToFetch
    );

    // increase request id
    currentId++;
  }

  //预言机记录其答案
  function updateRequest (
    uint _id,
    string memory _valueRetrieved
  ) public {

    Request storage currRequest = requests[_id];

    //检查oracle是否在受信任的oracle列表中
    //并且预言机还没有投票
    if(currRequest.quorum[address(msg.sender)] == 1){

      //标记此地址已投票
      currRequest.quorum[msg.sender] = 2;

      //遍历答案的“数组”，直到一个空闲的位置并保存检索到的值
      uint tmpI = 0;
      bool found = false;
      while(!found) {
        //找到第一个空槽
        if(bytes(currRequest.anwers[tmpI]).length == 0){
          found = true;
          currRequest.anwers[tmpI] = _valueRetrieved;
        }
        tmpI++;
      }

      uint currentQuorum = 0;

      //遍历oracle列表并检查是否有足够的oracle（最小定额）
      //投票了相同的答案有当前答案
      for(uint i = 0; i < totalOracleCount; i++){
        bytes memory a = bytes(currRequest.anwers[i]);
        bytes memory b = bytes(_valueRetrieved);

        if(keccak256(a) == keccak256(b)){
          currentQuorum++;
          if(currentQuorum >= minQuorum){
            currRequest.agreedValue = _valueRetrieved;
            emit UpdatedRequest (
              currRequest.id,
              currRequest.urlToQuery,
              currRequest.attributeToFetch,
              currRequest.agreedValue
            );
          }
        }
      }
    }
  }
}
