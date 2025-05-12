import { AppExp, Exp, Program } from './L3/L3-ast';
import { Result, makeFailure, makeOk} from './shared/result';

/*
Purpose: Transform L2 AST to JavaScript program string
Signature: l2ToJS(l2AST)
Type: [EXP | Program] => Result<string>
*/

export const l2ToJS = (exp: Exp | Program): Result<string>  =>
    // Handle case if exp is Program - a list of Exp's

    exp.tag === "Program" ? makeOk(exp.exps.map(ExpToJS).join(";\n")) :
    makeOk(ExpToJS(exp));

const ExpToJS = (exp: Exp): string =>
    exp.tag === "DefineExp" ? `const ${exp.var.var} = ${ExpToJS(exp.val)}` :
    exp.tag === "NumExp" ? exp.val.toString() :
    exp.tag === "BoolExp" ? (exp.val? "true" : "false") :
    exp.tag === "StrExp" ? exp.val :
    exp.tag === "PrimOp" ? primOpToJS(exp.op) :
    exp.tag === "VarRef" ? exp.var :
    exp.tag === "AppExp" ? appExpToJS(exp) :
    exp.tag === "IfExp" ? `(${ExpToJS(exp.test)} ? ${ExpToJS(exp.then)} : ${ExpToJS(exp.alt)})` :
    exp.tag === "ProcExp" ? `(${exp.args.map(arg => arg.var).join(", ")} => ${ExpToJS(exp.body[0])})` : "Not Supported Expression";


    // TODO: Fix those 2 functions


    const appExpToJS = (exp: AppExp): string => {
        const rator = exp.rator;
    
        // Check if it's a primitive operator
        if (rator.tag === "PrimOp") {
            const argStrs = exp.rands.map(ExpToJS);
            return primOpToJS(rator.op, argStrs);
        }
    
        // Otherwise: regular function call
        return `${ExpToJS(rator)}(${exp.rands.map(ExpToJS).join(", ")})`;
    };
    

const primOpToJS = (op: string): string => {
    switch (op) {
        case "number?":
            return "(x) => (typeof x === 'number')";
        case "boolean?":
            return "(x) => (typeof x === 'boolean')";
        case "eq?":
            return "(x, y) => x === y";
        default:
            return op;
    }
};

