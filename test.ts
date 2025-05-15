import { parse as p, isSexpString, isToken, isCompoundSexp } from "./src/shared/parser";
import {  evalL32program } from "./src/L32/L32-eval";
import { Value ,CompoundSExp} from "./src/L32/L32-value";
import { Result, bind, isFailure, isOk, makeFailure, makeOk,  } from "./src/shared/result";
import { Exp} from "./src/L32/L32-ast";
import { parseL32, parseL32Exp, Program, isProgram ,unparseL32, isLitExp} from "./src/L32/L32-ast";
import {turn2App, L32toL3, Dict2App} from "./src/q24";
import util from 'util';

const getpair = parseL32(`(L32 (define getPair 
                                    (lambda (x y f) 
                                        (if (= (car (car x)) y)
                                            (cdr (car x))
                                            (f (cdr x) y)
                                    ))))`)
const dict = parseL32(`(L32 (define dict 
                                    (lambda (x) 
                                        (lambda (y) 
                                            (getPair x y getPair)
))))`)
// console.log(util.inspect(getpair, { depth: null, colors: true }))
// console.log(util.inspect(dict, { depth: null, colors: true }))

const evalP = (x: string): Result<Value> => 
    bind(parseL32(x), (prog) => 
        evalL32program(L32toL3(prog)))
const x = `(L32 ((dict (a 1) (b 2)) 'a))`
//console.log(util.inspect(evalP(x),{ depth: null, colors: true }) )
const y = parseL32(x)

isOk(y) ? console.log(util.inspect(Dict2App(y.value),{ depth: null, colors: true }) ):
console.log("die")

console.log(util.inspect(evalP(x),{ depth: null, colors: true }) )







