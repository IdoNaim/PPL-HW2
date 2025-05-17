import { parse as p, isSexpString, isToken, isCompoundSexp } from "./src/shared/parser";
import {  evalL32program } from "./src/L32/L32-eval";
import { Value ,CompoundSExp, makeSymbolSExp} from "./src/L32/L32-value";
import { Result, bind, isFailure, isOk, makeFailure, makeOk,  } from "./src/shared/result";
import { Exp, makeLitExp} from "./src/L32/L32-ast";
import { parseL32, parseL32Exp, Program, isProgram ,unparseL32, isLitExp} from "./src/L32/L32-ast";
import {turn2App, L32toL3, Dict2App, getStringVal} from "./src/q24";
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

// const evalP = (x: string): Result<Value> => 
//     bind(parseL32(x), (prog) => 
//         evalL32program(L32toL3(prog)))
// const x = `(L32 ((dict (a 1) (b 2)) 'a))`
// //console.log(util.inspect(evalP(x),{ depth: null, colors: true }) )
// const y = parseL32(x)

// isOk(y) ? console.log(util.inspect(Dict2App(y.value),{ depth: null, colors: true }) ):
// console.log("die")

// console.log(util.inspect(evalP(x),{ depth: null, colors: true }) )
const getpair2 = parseL32(`(L32 (define getPair 
                                    (lambda (d k f) 
                                            (if (eq? d '())
                                                    "key not found"
                                                    (if (eq? (car (car d)) k)
                                                        (cdr (car d))
                                                        (f (cdr d) k)
                                                        )))))`)
// isOk(getpair2) ? console.log(util.inspect(getpair2, {depth: null, colors: true})):
// console.log("bad")
const t1 = `(L32 ((dict (a 1) (b 2)) 'a))`
const t5 =`(L32 ((dict (a 1) (b 'red)) 'b))`
const t1Parsed = parseL32(t1)
const t5Parsed = parseL32(t5)
isOk(t5Parsed) ? console.log(util.inspect(t5Parsed, {depth: null, colors: true})):
 console.log("bad")
console.log("=================================================================================")
 isOk(t5Parsed) ? console.log(util.inspect(Dict2App(t5Parsed.value), {depth: null, colors: true})):
 console.log("bad")

 console.log(p(unparseL32(makeLitExp(makeSymbolSExp("red")))))







