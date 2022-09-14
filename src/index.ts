import * as crypto from 'crypto';
import * as bananojs from '@bananocoin/bananojs';

const BANANO_PREFIX = bananojs.BANANO_PREFIX;

const getSeed = (): string => {
  return crypto.randomBytes(32).toString('hex').toUpperCase();
};

const getPrivateKeyFromSeed = (seed: string, seedIx: number): string => {
  return bananojs.BananoUtil.getPrivateKey(seed, seedIx);
};

const getPublicKeyFromPrivateKey = (privateKey: string): string => {
  return bananojs.BananoUtil.getPublicKey(privateKey);
};

const getAccountFromPublicKey = (privateKey: string, prefix: string): string => {
  return bananojs.BananoUtil.getAccount(privateKey, prefix);
};

const getAccountFromSeed = async (seed: string, seedIx: number): Promise<string> => {
  const privateKey = getPrivateKeyFromSeed(seed, seedIx);
  const publicKey = await getPublicKeyFromPrivateKey(privateKey);
  const account = getAccountFromPublicKey(publicKey, BANANO_PREFIX);
  return account;
};

export { getSeed, getPrivateKeyFromSeed, getPublicKeyFromPrivateKey, getAccountFromPublicKey, getAccountFromSeed, BANANO_PREFIX };
