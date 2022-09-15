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
const httpsRateLimit = __importStar(require("https-rate-limit"));
const bananodeUrl = 'https://kaliumapi.appditto.com/api';
const commands = new Map();
commands.set('getseed', async (arg0, arg1, arg2, arg3) => {
    const response = index.getSeed();
    console.log('getseed response', response);
    return response;
});
commands.set('bgetprivatekey', async (arg0, arg1, arg2, arg3) => {
    const response = index.getPrivateKeyFromSeed(arg0, Number(arg1));
    console.log('banano getprivatekey response', response);
    return response;
});
commands.set('bgetaccount', async (arg0, arg1, arg2, arg3) => {
    const publicKey = await index.getPublicKeyFromPrivateKey(arg0);
    console.log('banano getaccount publicKey', publicKey);
    const account = index.getAccountFromPublicKey(publicKey, index.BANANO_PREFIX);
    console.log('banano getaccount account', account);
    return account;
});
commands.set('bcheckpending', async (arg0, arg1, arg2, arg3) => {
    let account = arg0;
    let countStr = arg1;
    if (countStr == undefined) {
        countStr = '1';
    }
    const count = parseInt(countStr, 10);
    const accounts = [account];
    // https://docs.nano.org/commands/rpc-protocol/#accounts_pending
    const formData = {
        action: 'accounts_pending',
        accounts: accounts,
        count: count,
        threshold: 1,
    };
    httpsRateLimit.setUrl(bananodeUrl);
    console.log('formData', formData);
    const pending = await httpsRateLimit.sendRequest(formData);
    console.log('banano checkpending response', pending);
    return pending;
});
commands.set('breceive', async (arg0, arg1, arg2, arg3) => {
    const privateKey = arg0;
    const hash = arg1;
    const publicKey = await index.getPublicKeyFromPrivateKey(privateKey);
    const account = index.getAccountFromPublicKey(publicKey, index.BANANO_PREFIX);
    httpsRateLimit.setUrl(bananodeUrl);
    const repReq = {
        action: 'account_representative',
        accounts: account,
    };
    const repResp = await httpsRateLimit.sendRequest(repReq);
    let representative = repResp.representative;
    if (!representative) {
        representative = account;
    }
    const historyReq = {
        action: 'account_history',
        account: account,
        count: 1,
    };
    const historyResp = await httpsRateLimit.sendRequest(historyReq);
    const historyHistory = historyResp.history;
    const pendingReq = {
        action: 'accounts_pending',
        accounts: [account],
        count: 1,
        threshold: 1,
    };
    const pendingResp = await httpsRateLimit.sendRequest(pendingReq);
    let badPendingResponse = '';
    if (pendingResp.blocks == undefined) {
        badPendingResponse = 'pendingResp.blocks == undefined';
    }
    else if (pendingResp.blocks[account] == undefined) {
        badPendingResponse = 'pendingResp.blocks[account] == undefined';
    }
    else if (pendingResp.blocks[account][hash] == undefined) {
        badPendingResponse = 'pendingResp.blocks[account][hash] == undefined';
    }
    if (badPendingResponse.length != 0) {
        console.log('banano breceive badPendingResponse', badPendingResponse, pendingResp);
        return '';
    }
    const pendingValueRaw = pendingResp.blocks[account][hash];
    if (historyHistory.length == 0) {
        const block = {
            type: 'state',
            account: account,
            previous: '0000000000000000000000000000000000000000000000000000000000000000',
            representative: representative,
            balance: pendingValueRaw,
            link: hash,
            signature: '',
        };
        block.signature = await index.signBlock(privateKey, block);
        const processReq = {
            action: 'process',
            json_block: 'true',
            subtype: 'open',
            block: block,
            do_work: false,
        };
        // kalium API specific code.
        if (block.work == undefined) {
            processReq.do_work = true;
        }
        console.log('banano receive processReq', processReq);
        const processResp = await httpsRateLimit.sendRequest(processReq);
        console.log('banano receive processResp', processResp);
        return processResp;
    }
    else {
        const accountInfoReq = {
            action: 'account_info',
            account: account,
            count: 1,
        };
        const accountInfoResp = await httpsRateLimit.sendRequest(accountInfoReq);
        const previous = accountInfoResp.frontier;
        const accountBalanceRaw = accountInfoResp.balance;
        const valueRaw = (BigInt(pendingValueRaw) + BigInt(accountBalanceRaw)).toString();
        const block = {
            type: 'state',
            account: account,
            previous: previous,
            representative: representative,
            balance: valueRaw,
            link: hash,
            signature: '',
        };
        block.signature = await index.signBlock(privateKey, block);
        const processReq = {
            action: 'process',
            json_block: 'true',
            subtype: 'receive',
            block: block,
            do_work: false,
        };
        if (block.work == undefined) {
            processReq.do_work = true;
        }
        console.log('banano receive processReq', processReq);
        const processResp = await httpsRateLimit.sendRequest(processReq);
        console.log('banano receive processResp', processResp);
    }
    return '';
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