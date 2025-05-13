import { makeProgram, Program ,Exp, CExp, makeAppExp, makeVarRef, CompoundExp, makeLitExp, parseSExp} from './L32/L32-ast';
import {makeCompoundSExp, CompoundSExp} from './L32/L32-value';
import {DictExp, isDictExp, Binding ,unparseL32} from './L32/L32-ast';
import {is, map} from "ramda";
import { first, second, rest, allT, isEmpty, isNonEmptyList, List, NonEmptyList } from "./shared/list";
import { makeEmptySExp, SExpValue, makeSymbolSExp } from './L32/L32-value';
import {evalSequence}  from './L32/L32-eval';
import { makeEmptyEnv } from './L32/L32-env';
import { parse as p, isSexpString, isToken, isCompoundSexp } from "./shared/parser";
import { Result, makeOk, makeFailure, bind, mapResult, mapv, isOk } from "./shared/result";



/*
Purpose: rewrite all occurrences of DictExp in a program to AppExp.
Signature: Dict2App (exp)
Type: Program -> Program
*/
export const Dict2App  = (exp: Program) : Program =>
    makeProgram(map(turn2App,exp.exps));

export const turn2App = (exp: Exp) : Exp|CompoundExp => 
    isDictExp(exp) ? makeAppExp(makeVarRef("dict"), makeKVlist(exp)) : exp

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
export const L32toL3 = (prog : Program): Program =>
    Dict2App(prog);

    
