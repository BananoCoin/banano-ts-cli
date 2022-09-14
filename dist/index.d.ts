declare const getSeed: () => Promise<string>;
/**
 * validates a seed.
 *
 * @memberof BananoUtil
 * @param {string} seed the seed to use to validate.
 * @return {any} {valid:[true/false] message:[if false, why]}.
 */
declare const isSeedValid: (seed: string) => any;
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
declare const _removePublicKeyPrefix: (encodedHex: string) => string;
export { isSeedValid, getSeed, getPrivateKeyFromSeed, getPublicFromPrivate, _removePublicKeyPrefix };
