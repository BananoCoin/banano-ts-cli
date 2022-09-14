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
  const accounts = [arg0];
  const count = parseInt(arg1, 10);
  // https://docs.nano.org/commands/rpc-protocol/#accounts_pending
  const formData = {
    action: 'accounts_pending',
    accounts: accounts,
    count: count,
    threshold: 1,
  };
  httpsRateLimit.setUrl(bananodeUrl);
  const pending = await httpsRateLimit.sendRequest(formData);
  console.log('banano checkpending response', pending);
  return pending;
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
