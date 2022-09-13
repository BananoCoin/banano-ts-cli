declare const getSeed: () => Promise<string>;
/**
 * get private key from seed.
 *
 * @memberof BananoUtil
 * @param {string} seed the seed to use to validate.
 * @param {number} seedIx the index to use with the seed.
 * @return {string} the private key.
 */
declare const getPrivateKeyFromSeed: (seed: string, seedIx: number) => string;
declare const getPublicFromPrivate: (privateKey: string) => string;
export { getSeed, getPrivateKeyFromSeed, getPublicFromPrivate };
