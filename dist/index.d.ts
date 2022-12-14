import * as bananojs from '@bananocoin/bananojs';
declare const BANANO_PREFIX = "ban_";
type Block = bananojs.Block;
type BananoParts = bananojs.BananoParts;
declare const getSeed: () => string;
declare const setUrl: (url: string) => void;
declare const getAccountsBalances: (accounts: string[]) => Promise<object>;
declare const getPrivateKeyFromSeed: (seed: string, seedIx: number) => string;
declare const getPublicKeyFromPrivateKey: (privateKey: string) => Promise<string>;
declare const getAccountFromPublicKey: (publicKey: string) => string;
declare const getPublicKeyFromAccount: (privateKey: string) => string;
declare const getAccountFromSeed: (seed: string, seedIx: number) => Promise<string>;
declare const signBlock: (privateKey: string, block: Block) => Promise<string>;
declare const getAmountPartsFromRaw: (amountRawStr: string) => BananoParts;
export { signBlock, getSeed, getPrivateKeyFromSeed, getPublicKeyFromPrivateKey, getAccountFromPublicKey, getPublicKeyFromAccount, getAccountFromSeed, getAmountPartsFromRaw, getAccountsBalances, setUrl, BANANO_PREFIX, type Block, type BananoParts, };
