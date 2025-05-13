import { parse as p, isSexpString, isToken, isCompoundSexp } from "./src/shared/parser";
import {  evalL32program } from "./src/L32/L32-eval";
import { Value ,CompoundSExp} from "./src/L32/L32-value";
import { Result, bind, isFailure, isOk, makeFailure, makeOk } from "./src/shared/result";
import { Exp} from "./src/L32/L32-ast";
import { parseL32, parseL32Exp, Program, isProgram ,unparseL32, isLitExp} from "./src/L32/L32-ast";
import {turn2App} from "./src/q24";
// console.log(p("(d 'b)"))

// const evalP = (x: string): Result<Value> =>
//     bind(parseL32(x), evalL32program);
// console.log(p(`(L32 ((dict (a 1) (b 2)) 'a))`))
// const sexpOfDict = p(`((dict (a 1) (b 2)) 'a)`)
// console.log(sexpOfDict)
// const val = isOk(sexpOfDict) ? sexpOfDict.value : "bad"
// console.log(parseL32Exp(val))
// console.log(evalP(`(L32 ((dict (a 1) (b 2)) 'a))`))
// console.log()
// const val = isOk(evalP(`(L32 ((dict (a 1) (b 2)) 'a))`)) ? evalP(`(L32 ((dict (a 1) (b 2)) 'a))`).value : "bad"
// "(L32 ((dict (a 1) (b 2)) 'a))"


const prog = parseL32(`(L32 (dict (a 1) (b 2)))`)
const dict = bind(prog, (prog: Program) => isProgram(prog) ? makeOk((prog as Program).exps[0]): makeFailure("not a program") )
const dictExp = isOk(dict) ? dict.value : "bad"
const appExp = turn2App(dictExp as Exp)
// console.log(unparseL32((dictExp as Exp)))
console.log(unparseL32(appExp))

// const prog2 = parseL32(`(L32 '((a . 1) (b . 2)))`)
// const lit = isOk(prog2) ? isProgram(prog2.value) ? prog2.value.exps[0] : "bad" : "bad"
// isLitExp(lit) ? console.log(unparseL32(lit)) : console.log("not a litExp")
// isLitExp(lit) ? console.log((lit.val as CompoundSExp).val1) : console.log("not a litexp")




