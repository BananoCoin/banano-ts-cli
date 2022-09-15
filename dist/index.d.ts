declare const BANANO_PREFIX: any;
declare type Block = {
    type: string;
    account: string;
    previous: string;
    representative: string;
    balance: string;
    link: string;
    signature: string;
};
declare const getSeed: () => string;
declare const getPrivateKeyFromSeed: (seed: string, seedIx: number) => string;
declare const getPublicKeyFromPrivateKey: (privateKey: string) => string;
declare const getAccountFromPublicKey: (privateKey: string, prefix: string) => string;
declare const getAccountFromSeed: (seed: string, seedIx: number) => Promise<string>;
declare const signBlock: (privateKey: string, block: Block) => Promise<string>;
export { signBlock, getSeed, getPrivateKeyFromSeed, getPublicKeyFromPrivateKey, getAccountFromPublicKey, getAccountFromSeed, BANANO_PREFIX, type Block };
