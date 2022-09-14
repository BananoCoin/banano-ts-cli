declare const BANANO_PREFIX: any;
declare const getSeed: () => string;
declare const getPrivateKeyFromSeed: (seed: string, seedIx: number) => string;
declare const getPublicKeyFromPrivateKey: (privateKey: string) => string;
declare const getAccountFromPublicKey: (privateKey: string, prefix: string) => string;
declare const getAccountFromSeed: (seed: string, seedIx: number) => Promise<string>;
export { getSeed, getPrivateKeyFromSeed, getPublicKeyFromPrivateKey, getAccountFromPublicKey, getAccountFromSeed, BANANO_PREFIX };
