"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index = __importStar(require("./index"));
const commands = new Map();
commands.set('getseed', async (arg0, arg1, arg2, arg3) => {
    const response = index.getSeed();
    console.log('getseed response', response);
    return response;
});
const run = async () => {
    console.log('bananots');
    if (process.argv.length < 3) {
        console.log('#usage:');
    }
    else {
        const command = process.argv[2];
        const arg0 = process.argv[3];
        const arg1 = process.argv[4];
        const arg2 = process.argv[5];
        const arg3 = process.argv[6];
        const fn = commands.get(command);
        if (fn == undefined) {
            console.log('unknown command', command);
        }
        else {
            await fn(arg0, arg1, arg2, arg3);
        }
    }
};
run();
//# sourceMappingURL=main.js.map