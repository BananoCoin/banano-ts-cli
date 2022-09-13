import * as index from './index';

const commands = new Map<string, (arg0: string, arg1: string, arg2: string, arg3: string) => Promise<string>>();

commands.set('getseed', async (arg0: string, arg1: string, arg2: string, arg3: string): Promise<string> => {
  const response = index.getSeed();
  console.log('getseed response', response);
  return response;
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