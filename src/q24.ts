import { DictExp,  Binding ,unparseL32, parseL32,  makeProgram, Program ,Exp, CExp, makeVarRef, CompoundExp, makeLitExp, parseSExp,  makeDefineExp, makeVarDecl, makeProcExp} from './L32/L32-ast';
import {makeCompoundSExp, CompoundSExp, isEmptySExp, isSymbolSExp, Value} from './L32/L32-value';
import {makeAppExp, makeBinding,makeIfExp, makeLetExp, DefineExp } from './L32/L32-ast';
import { isDictExp, isAppExp, isDefineExp, isIfExp, isProcExp, isLetExp, isLitExp, isBinding, isExp, isCExp, isVarRef, isStrExp, isBoolExp, isNumExp } from './L32/L32-ast';
import {is, map} from "ramda";
import { first, second, rest, allT, isEmpty, isNonEmptyList, List, NonEmptyList } from "./shared/list";
import { makeEmptySExp, SExpValue, makeSymbolSExp } from './L32/L32-value';
import {evalSequence}  from './L32/L32-eval';
import { makeEmptyEnv } from './L32/L32-env';
import { parse as p, isSexpString, isToken } from "./shared/parser";
import { Result, makeOk, makeFailure, bind, mapResult, mapv, isOk } from "./shared/result";
import util from 'util';




/*
Purpose: rewrite all occurrences of DictExp in a program to AppExp.
Signature: Dict2App (exp)
Type: Program -> Program
*/
export const Dict2App  = (exp: Program) : Program =>
    makeProgram(map(turn2App,exp.exps));


// export const turn2App = (e: any): any =>
//     isExp(e) ? turnExp(e) :
//     isCExp(e) ? turnCExp(e) :
//     isBinding(e) ? { ...e, val: turnCExp(e.val) } :
//     Array.isArray(e) ? e.map(turn2App) :
//     e;

// const turnExp = (e: any): any =>
//     isDefineExp(e)
//         ? { ...e, val: turnCExp(e.val) }
//         : turnCExp(e);

// const turnCExp = (cexp: any): any =>
//     isIfExp(cexp)
//         ? { ...cexp, test: turnCExp(cexp.test), then: turnCExp(cexp.then), alt: turnCExp(cexp.alt) }
//         : isProcExp(cexp)
//         ? { ...cexp, body: cexp.body.map(turnCExp) }
//         : isAppExp(cexp)
//         ? { ...cexp, rator: turnCExp(cexp.rator), rands: cexp.rands.map(turnCExp) }
//         : isLetExp(cexp)
//         ? { ...cexp, bindings: cexp.bindings.map(turn2App), body: cexp.body.map(turnCExp) }
//         : isDictExp(cexp)
//         ? transformDictToApp(cexp)
//         : isLitExp(cexp)
//         ? cexp
//         : cexp; // AtomicExp

// const transformDictToApp = (dictExp: any): any => {
//     const keyVals = dictExp.entries.map(({ key, val }: any) => {
//         return makeAppExp(makeVarRef('pair'), [key, turnCExp(val)]);
//     });
//     return makeAppExp(makeVarRef('dict'), keyVals);
// };

export const turn2App = (exp: Exp) : Exp|CompoundExp =>
    isDefineExp(exp)  ? turn2AppDefine(exp):
    turn2AppCExp(exp)
    // isDictExp(exp) ? makeAppExp(makeVarRef("dict"), makeKVlist(exp)) : 
    // isAppExp(exp) ? makeAppExp(turn2App(exp.rator), map()) :
    // exp

const turn2AppDefine = (exp : DefineExp) : DefineExp =>
        makeDefineExp(exp.var, turn2AppCExp(exp.val))
const turn2AppCExp = (exp :CExp) :  CExp =>
    isDictExp(exp) ? makeAppExp(makeVarRef("dict"), makeKVlist(exp)) : 
    isAppExp(exp) ? makeAppExp(turn2AppCExp(exp.rator), map(turn2AppCExp, exp.rands)) :
    // isIfExp(exp) ? makeIfExp(turn2AppCExp(exp.test), turn2AppCExp(exp.then), turn2AppCExp(exp.alt)):
    isProcExp(exp) ? makeProcExp(exp.args, map(turn2AppCExp, exp.body)):
    isLetExp(exp) ? makeLetExp(map(turn2AppBinding, exp.bindings), map(turn2AppCExp, exp.body)):
    isLitExp(exp) ? exp
     : isVarRef(exp)
        ? exp
    : isNumExp(exp)
        ? exp
    : isBoolExp(exp)
        ? exp
    : isStrExp(exp)
        ? exp
    : (() => {
        throw new Error(`Unknown or malformed CExp: ${JSON.stringify(exp)}`);
    })();
    
 const turn2AppBinding = (b: Binding): Binding => 
  makeBinding(b.var.var, turn2AppCExp(b.val));

const makeKVlist = (dictExp :DictExp)  :CExp[]=> {
    const list = makeList(dictExp.entries)
    return [makeLitExp(list)]
}

const makeList = (entries: Binding[]): SExpValue =>
    isNonEmptyList<Binding>(entries) ? makeCompoundSExp(makeCompoundSExp(makeSymbolSExp(entries[0].var.var), getStringVal(unparseL32(entries[0].val))), makeList(entries.slice(1))) 
: makeEmptySExp();

const getStringVal=(val : string) : SExpValue => {
    const sexp = p(val);
    if(isOk(sexp)){
        const parsed = parseSExp(sexp.value);
        if(isOk(parsed)){
            return parsed.value;
        }
        return "bad"
    }
    return "bad"
}
    

// export const listPrim = (vals: List<Value>): EmptySExp | CompoundSExp =>
//     isNonEmptyList<Value>(vals) ? makeCompoundSExp(first(vals), listPrim(rest(vals))) :
//     makeEmptySExp();
    




/*
Purpose: Transform L32 program to L3
Signature: L32ToL3(prog)
Type: Program -> Program
*/
export const L32toL3 = (prog : Program): Program =>{
    // console.log(util.inspect(prog, { depth: null, colors: true }));
    // console.log(util.inspect(Dict2App(prog), { depth: null, colors: true }));

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
        if(isOk(getpair) && isOk(dict)){
            const getpairExp = getpair.value.exps[0];
            const dictExp = dict.value.exps[0];
            const exps = Dict2App(prog).exps
            return makeProgram([getpairExp, dictExp, ...exps])
        }
        return prog
    }
        

    //  makeDefineExp(makeVarDecl("dict"), makeProcExp([makeVarDecl("x")], //{
    //      [makeProcExp([makeVarDecl("y")],//{
    //          [makeAppExp(makeVarRef("getPair"), [makeVarRef("x"), makeVarRef("y")] )])]))
    //          //}
     //}
    // console.log(Dict2App(prog));
    // return Dict2App(prog);

//(define dict (
// lambda (x : listOfPairs))) (
    // lambda (y : symbol) (
     // (getPair x y)))

     //(define getPair 
     //(lambda (x y) 
     // (if ((car (car x)) = y)
     // (cdr (car x))
     // (getPair (cdr x) y)
     // ))
// const getPair = (x : SExpValue, y: string) : Value =>{
//     if(isEmptySExp(x)){
//         return `value of ${y} wasn't found`;
//     }else{
//         if((isCompoundSExp(x))){
//             if (isCompoundSExp(x.val1) && isSymbolSExp(x.val1.val1))
//                 if(x.val1.val1.val === y){
//                     return x.val1.val2
//                 }
//                 else{
//                     return getPair(x.val2, y)
//                 }
//             else{
//                 return "bad dictionary"
//             }
//         }
//         else{
//             return "bad dictionary"
//         }
//     }
// }
// const isCompoundSExp= (x:any) : x is CompoundSExp =>
//     x.tag ==="CompoundSexp"
    
