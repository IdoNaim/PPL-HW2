import { AppExp, Exp, Program } from './L3/L3-ast';
import { Result, makeFailure, makeOk} from './shared/result';

export const l2ToJS = (exp: Exp | Program): Result<string>  =>
    exp.tag === "Program" ? makeOk(exp.exps.map(ExpToJS).join(";\n")) :
    makeOk(ExpToJS(exp));

const ExpToJS = (exp: Exp): string =>
    exp.tag === "DefineExp" ? `const ${exp.var.var} = ${ExpToJS(exp.val)}` :
    exp.tag === "NumExp" ? exp.val.toString() :
    exp.tag === "BoolExp" ? (exp.val? "true" : "false") :
    exp.tag === "StrExp" ? exp.val :
    exp.tag === "PrimOp" ? exp.op :
    exp.tag === "VarRef" ? exp.var :
    exp.tag === "AppExp" ? `${appExpToJS(exp)}` :
    exp.tag === "IfExp" ? `(${ExpToJS(exp.test)} ? ${ExpToJS(exp.then)} : ${ExpToJS(exp.alt)})` :
    exp.tag === "ProcExp" ? `((${exp.args.map(arg => arg.var).join(",")}) => ${ExpToJS(exp.body[0])})` :
    "Not Supported Expression";


    // TODO: Fix those 2 functions


    const appExpToJS = (exp: AppExp): string =>
        exp.rator.tag !== "PrimOp" ? `${ExpToJS(exp.rator)}(${exp.rands.map(ExpToJS).join(",")})` :
        exp.rator.op === "+" ? `(${exp.rands.map(ExpToJS).join(" + ")})` :
        exp.rator.op === "-" ? `(${exp.rands.map(ExpToJS).join(" - ")})` :
        exp.rator.op === "*" ? `(${exp.rands.map(ExpToJS).join(" * ")})` :
        exp.rator.op === "/" ? `(${exp.rands.map(ExpToJS).join(" / ")})` :
        exp.rator.op === "<" ? `(${exp.rands.map(ExpToJS).join(" < ")})` :
        exp.rator.op === ">" ? `(${exp.rands.map(ExpToJS).join(" > ")})` :
        exp.rator.op === "=" ? `(${exp.rands.map(ExpToJS).join(" === ")})` :
        exp.rator.op === "number?" ? `typeof ${ExpToJS(exp.rands[0])} === "number"` :
        exp.rator.op === "boolean?" ? `typeof ${ExpToJS(exp.rands[0])} === "boolean"` :
        exp.rator.op === "eq?" ? `(${ExpToJS(exp.rands[0])} === ${ExpToJS(exp.rands[1])})` :
        exp.rator.op === "and" ? exp.rands.map(ExpToJS).join(" && ") :
        exp.rator.op === "or" ? exp.rands.map(ExpToJS).join(" || ") :
        exp.rator.op === "not" ? `(!${ExpToJS(exp.rands[0])})` :
        "Not Supported Application"
