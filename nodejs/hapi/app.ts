import { Request, Response } from 'express';
import Express = require('express');
const router = Express.Router();


router.get('/', function (req: Request, res: Response, next) {
    const session = req.session;
    let name = session.name;
    return res.end(name);
});

// 技巧3  类型判断
function getAllOrOne<T>(i: T[]): T[] | T {
    if (Math.random() > 0.5) {
        return i[0]
    }
    return i
}

const allOrOne = getAllOrOne([1, 2, 3])

//这里只会按照 object 来提示代码

if (Array.isArray(allOrOne)) {
    allOrOne.slice() // 只提示数组类型相关函数
} else {
    allOrOne.toFixed()  // 只提示 number类型 相关的函数
}

// 技巧1 枚举类型约束
function shouldNotBeHere(t: never) {
    console.log('should never happen');
    throw Error('unSupport Protocol' + t)
}

function makeAdapter(p: Protocol) {

    switch (p) {
        case Protocol.ftp:
            console.log('make ftp adapter')
            break;

        case Protocol.http:
            console.log('make http adapter')
            break;

        default:
            shouldNotBeHere(p);
    }
}

enum Protocol {
    http = 1,
    // https = 2,
    ftp = 3
} 

makeAdapter(4)


// 技巧2 组合
interface SuccessAPIResponse {
    error: false
    data: number[]
}


interface ErrorAPIResponse {
    error: true
    errorMessage: string
}

type APIResponse = SuccessAPIResponse | ErrorAPIResponse 

  let action  = {
      error: true,
      errorMessage: 'xx'
  }

  function r(v:APIResponse){
      if(v.error){
          v.errorMessage;
      }else{
          v.data;
      }
  }


  action.errorMessage;