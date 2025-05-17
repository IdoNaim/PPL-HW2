import { parse as p, isSexpString, isToken, isCompoundSexp } from "./src/shared/parser";
import {  evalL31program } from "./src/L31/L31-eval";
import { Value ,CompoundSExp, makeSymbolSExp, makeCompoundSExp, makeEmptySExp} from "./src/L31/L31-value";
import { Result, bind, isFailure, isOk, makeFailure, makeOk,  } from "./src/shared/result";
import { Exp, makeLitExp} from "./src/L31/L31-ast";
import {  parseL31Exp, Program, isProgram , isLitExp} from "./src/L31/L31-ast";
import {turn2App, L32toL3, Dict2App, getStringVal} from "./src/q24";
import util from 'util';
import { parseL31 } from "./src/L31/L31-ast";
import { dictPrim, hasDuplicateKeys, isDictPrim, validPairsList } from "./src/L31/evalPrimitive";

// const getpair = parseL32(`(L32 (define getPair 
//                                     (lambda (x y f) 
//                                         (if (= (car (car x)) y)
//                                             (cdr (car x))
//                                             (f (cdr x) y)
//                                     ))))`)
// const dict = parseL32(`(L32 (define dict 
//                                     (lambda (x) 
//                                         (lambda (y) 
//                                             (getPair x y getPair)
// ))))`)
// // console.log(util.inspect(getpair, { depth: null, colors: true }))
// // console.log(util.inspect(dict, { depth: null, colors: true }))

// // const evalP = (x: string): Result<Value> => 
// //     bind(parseL32(x), (prog) => 
// //         evalL32program(L32toL3(prog)))
// // const x = `(L32 ((dict (a 1) (b 2)) 'a))`
// // //console.log(util.inspect(evalP(x),{ depth: null, colors: true }) )
// // const y = parseL32(x)

// // isOk(y) ? console.log(util.inspect(Dict2App(y.value),{ depth: null, colors: true }) ):
// // console.log("die")

// // console.log(util.inspect(evalP(x),{ depth: null, colors: true }) )
// const getpair2 = parseL32(`(L32 (define getPair 
//                                     (lambda (d k f) 
//                                             (if (eq? d '())
//                                                     "key not found"
//                                                     (if (eq? (car (car d)) k)
//                                                         (cdr (car d))
//                                                         (f (cdr d) k)
//                                                         )))))`)
// // isOk(getpair2) ? console.log(util.inspect(getpair2, {depth: null, colors: true})):
// // console.log("bad")
// const t1 = `(L32 ((dict (a 1) (b 2)) 'a))`
// const t5 =`(L32 ((dict (a 1) (b 'red)) 'b))`
// const t1Parsed = parseL32(t1)
// const t5Parsed = parseL32(t5)
// isOk(t5Parsed) ? console.log(util.inspect(t5Parsed, {depth: null, colors: true})):
//  console.log("bad")
// console.log("=================================================================================")
//  isOk(t5Parsed) ? console.log(util.inspect(Dict2App(t5Parsed.value), {depth: null, colors: true})):
//  console.log("bad")

//  console.log(p(unparseL32(makeLitExp(makeSymbolSExp("red")))))


const x = `(L31 (get (dict '((a . 1) (b . 2))) 'a))`
const y = parseL31(x);
// console.log(util.inspect(y, {depth: null, colors: true}))
const dict = makeCompoundSExp(makeCompoundSExp(makeSymbolSExp("a"), 1), makeCompoundSExp(makeCompoundSExp(makeSymbolSExp("b"), 2),makeEmptySExp()))
// const lit = makeLitExp(dict)
console.log(dictPrim([dict]));






