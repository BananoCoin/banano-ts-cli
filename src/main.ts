import * as index from './index';
import * as httpsRateLimit from 'https-rate-limit';

const bananodeUrl = 'https://kaliumapi.appditto.com/api';

const commands = new Map<string, (arg0: string, arg1: string, arg2: string, arg3: string) => Promise<string>>();

commands.set('getseed', async (arg0: string, arg1: string, arg2: string, arg3: string): Promise<string> => {
  const response = index.getSeed();
  console.log('getseed response', response);
  return response;
});

commands.set('bgetprivatekey', async (arg0: string, arg1: string, arg2: string, arg3: string): Promise<string> => {
  const response = index.getPrivateKeyFromSeed(arg0, Number(arg1));
  console.log('getseed response', response);
  return response;
});

commands.set('bgetaccount', async (arg0: string, arg1: string, arg2: string, arg3: string): Promise<string> => {
  const publicKey = await index.getPublicKeyFromPrivateKey(arg0);
  console.log('banano getaccount publicKey', publicKey);
  const account = index.getAccountFromPublicKey(publicKey, index.BANANO_PREFIX);
  console.log('banano getaccount account', account);
  return account;
});

commands.set('bcheckpending', async (arg0: string, arg1: string, arg2: string, arg3: string): Promise<string> => {
  let account = arg0;
  let countStr: string = arg1;
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

commands.set('breceive', async (arg0: string, arg1: string, arg2: string, arg3: string): Promise<string> => {
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
  const pendingValueRaw = pendingResp.blocks[account][hash];

  if (historyHistory.length == 0) {
    // const block: index.Block = {
    const block = {
      type: 'state',
      account: account,
      previous: '0000000000000000000000000000000000000000000000000000000000000000',
      representative: representative,
      balance: pendingValueRaw,
      link: hash,
      signature: '',
      // work : '',
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
    // if (block.work === '') {
    // delete block.work;
    processReq.do_work = true;
    // }
    console.log('banano breceive processReq', processReq);
    const processResp = await httpsRateLimit.sendRequest(processReq);
    console.log('banano breceive processResp', processResp);
    return processResp;
  } else {
    const frontiersReq = {
      action: 'frontiers',
      account: account,
      count: 1,
    };
    const frontiersResp = await httpsRateLimit.sendRequest(frontiersReq);
    const previous = frontiersResp.frontiers[account];

    // const receiveBlockHash = await bananoUtil.receive(
    //     bananodeApi,
    //     privateKey,
    //     publicKey,
    //     representative,
    //     previous,
    //     hash,
    //     valueRaw,
    //     accountPrefix,
    // );
  }
  return '';
});

const run = async () => {
  console.log('bananots');
  if (process.argv.length < 3) {
    console.log('#usage:');
  } else {
    const command = process.argv[2];
    const arg0 = process.argv[3];
    const arg1 = process.argv[4];
    const arg2 = process.argv[5];
    const arg3 = process.argv[6];

    const fn = commands.get(command);
    if (fn == undefined) {
      console.log('unknown command', command);
    } else {
      await fn(arg0, arg1, arg2, arg3);
    }
  }
};

run();
