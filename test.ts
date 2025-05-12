import { parse as p, isSexpString, isToken, isCompoundSexp } from "./src/shared/parser";
import {  evalL32program } from "./src/L32/L32-eval";
import { Value } from "./src/L32/L32-value";
import { Result, bind, isFailure, isOk, makeFailure, makeOk } from "./src/shared/result";
import { parseL32, parseL32Exp } from "./src/L32/L32-ast";

// console.log(p("(d 'b)"))

const evalP = (x: string): Result<Value> =>
    bind(parseL32(x), evalL32program);
console.log(p(`(L32 ((dict (a 1) (b 2)) 'a))`))
const sexpOfDict = p(`((dict (a 1) (b 2)) 'a)`)
console.log(sexpOfDict)
const val = isOk(sexpOfDict) ? sexpOfDict.value : "bad"
console.log(parseL32Exp(val))
console.log(evalP(`(L32 ((dict (a 1) (b 2)) 'a))`))
// "(L32 ((dict (a 1) (b 2)) 'a))"




