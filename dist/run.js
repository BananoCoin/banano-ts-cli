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
const crypto = __importStar(require("crypto"));
const httpsRateLimit = __importStar(require("https-rate-limit"));
const bananodeUrl = 'https://kaliumapi.appditto.com/api';
const run = async () => {
    httpsRateLimit.setUrl(bananodeUrl);
    const seed = crypto.randomBytes(32).toString('hex');
    console.log('seed', seed);
    const privateKey = index.getPrivateKeyFromSeed(seed, 0);
    console.log('privateKey', privateKey);
    const publicKey = await index.getPublicKeyFromPrivateKey(privateKey);
    console.log('publicKey', publicKey);
    const account = index.getAccountFromPublicKey(publicKey);
    console.log('account', account);
    const accountInfoReq = {
        action: 'account_info',
        account: account,
        count: 1,
    };
    console.log(accountInfoReq);
    const accountInfoResp = await httpsRateLimit.sendRequest(accountInfoReq);
    console.log(accountInfoResp);
};
run();
//# sourceMappingURL=run.js.map