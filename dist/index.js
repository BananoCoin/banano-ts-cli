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
exports.BANANO_PREFIX = exports.setUrl = exports.getAccountsBalances = exports.getAmountPartsFromRaw = exports.getAccountFromSeed = exports.getPublicKeyFromAccount = exports.getAccountFromPublicKey = exports.getPublicKeyFromPrivateKey = exports.getPrivateKeyFromSeed = exports.getSeed = exports.signBlock = void 0;
const crypto = __importStar(require("crypto"));
const bananojs = __importStar(require("@bananocoin/bananojs"));
const BANANO_PREFIX = bananojs.Main.BANANO_PREFIX;
exports.BANANO_PREFIX = BANANO_PREFIX;
const getSeed = () => {
    return crypto.randomBytes(32).toString('hex').toUpperCase();
};
exports.getSeed = getSeed;
const setUrl = (url) => {
    bananojs.Main.setBananodeApiUrl(url);
};
exports.setUrl = setUrl;
const getAccountsBalances = async (accounts) => {
    return bananojs.BananodeApi.getAccountsBalances(accounts);
};
exports.getAccountsBalances = getAccountsBalances;
const getPrivateKeyFromSeed = (seed, seedIx) => {
    return bananojs.BananoUtil.getPrivateKey(seed, seedIx);
};
exports.getPrivateKeyFromSeed = getPrivateKeyFromSeed;
const getPublicKeyFromPrivateKey = (privateKey) => {
    return bananojs.BananoUtil.getPublicKey(privateKey);
};
exports.getPublicKeyFromPrivateKey = getPublicKeyFromPrivateKey;
const getAccountFromPublicKey = (publicKey) => {
    return bananojs.BananoUtil.getAccount(publicKey, BANANO_PREFIX);
};
exports.getAccountFromPublicKey = getAccountFromPublicKey;
const getPublicKeyFromAccount = (privateKey) => {
    return bananojs.BananoUtil.getAccountPublicKey(privateKey);
};
exports.getPublicKeyFromAccount = getPublicKeyFromAccount;
const getAccountFromSeed = async (seed, seedIx) => {
    const privateKey = getPrivateKeyFromSeed(seed, seedIx);
    const publicKey = await getPublicKeyFromPrivateKey(privateKey);
    const account = getAccountFromPublicKey(publicKey);
    return account;
};
exports.getAccountFromSeed = getAccountFromSeed;
const signBlock = async (privateKey, block) => {
    // console.log('bananojs', bananojs);
    return bananojs.BananoUtil.sign(privateKey, block);
};
exports.signBlock = signBlock;
const getAmountPartsFromRaw = (amountRawStr) => {
    return bananojs.BananoUtil.getAmountPartsFromRaw(amountRawStr, BANANO_PREFIX);
};
exports.getAmountPartsFromRaw = getAmountPartsFromRaw;
//# sourceMappingURL=index.js.map