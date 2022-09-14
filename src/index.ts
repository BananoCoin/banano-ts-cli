import * as crypto from 'crypto';
import Blake2b from 'blake2b';

const PUBLIC_KEY_PREFIX = '302A300506032B6570032100';

const SEED_ALPHABET_REGEX_STR = '^[0123456789abcdefABCDEF]{64}$';

const getSeed = async (): Promise<string> => {
  return crypto.randomBytes(32).toString('hex').toUpperCase();
};

const privateToDer = (privateKeyHex: string): Buffer => {
  const derHex = `302e020100300506032b657004220420${privateKeyHex}`;
  return Buffer.from(derHex, 'hex');
};

/**
 * validates a seed.
 *
 * @memberof BananoUtil
 * @param {string} seed the seed to use to validate.
 * @return {any} {valid:[true/false] message:[if false, why]}.
 */
const isSeedValid = (seed: string): any => {
  const regex = new RegExp(SEED_ALPHABET_REGEX_STR);
  const isValid = regex.test(seed);
  const retval: any = {};
  retval.valid = isValid;
  if (isValid) {
    retval.message = '';
  } else {
    retval.message = `does not match regex '${SEED_ALPHABET_REGEX_STR}'`;
  }
  return retval;
};

/**
 * get private key from seed.
 *
 * @memberof BananoUtil
 * @param {string} seed the seed to use to validate.
 * @param {number} seedIx the index to use with the seed.
 * @return {string} the private key.
 */
const getPrivateKeyFromSeed = (seed: string, seedIx: number): string => {
  /* istanbul ignore if */
  if (seed === undefined) {
    throw Error('seed is a required parameter.');
  }
  /* istanbul ignore if */
  if (seedIx === undefined) {
    throw Error('seedIx is a required parameter.');
  }
  const isValid = isSeedValid(seed);
  if (!isValid.valid) {
    throw Error(`Invalid BANANO seed '${seed}', ${isValid.message}`);
  }
  const seedBytes = hexToBytes(seed);
  const accountBytes = generateAccountSecretKeyBytes(seedBytes, seedIx);
  return bytesToHex(accountBytes);
};

const hexToUint8 = (hexValue: any): any => {
  const length = (hexValue.length / 2) | 0;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8[i] = parseInt(hexValue.substr(i * 2, 2), 16);
  }
  return uint8;
};

const decToHex = (decValue: any, bytes: number): string => {
  const dec = decValue.toString().split('');
  const sum = [];
  let hex = '';
  const hexArray = [];
  let i;
  let s;
  while (dec.length) {
    s = 1 * dec.shift();
    for (i = 0; s || i < sum.length; i++) {
      s += (sum[i] || 0) * 10;
      sum[i] = s % 16;
      s = (s - sum[i]) / 16;
    }
  }
  while (sum.length > 0) {
    const p = sum.pop();
    /* istanbul ignore else */
    if (p !== undefined) {
      hexArray.push(p.toString(16));
    }
  }

  hex = hexArray.join('');

  if (hex.length % 2 != 0) {
    hex = '0' + hex;
  }

  if (bytes > hex.length / 2) {
    const diff = bytes - hex.length / 2;
    for (let j = 0; j < diff; j++) {
      hex = '00' + hex;
    }
  }

  return hex;
};

const generateAccountSecretKeyBytes = (seedBytes: any, accountIndex: any): any => {
  const accountBytes = hexToUint8(decToHex(accountIndex, 4));
  const b2b = Blake2b(32);
  b2b.update(seedBytes);
  b2b.update(accountBytes);
  const newKey = b2b.digest();
  return newKey;
};

const hexToBytes = (hex: any): any => {
  const ret = new Uint8Array(hex.length / 2);
  for (let i = 0; i < ret.length; i++) {
    ret[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return ret;
};

const bytesToHex = (bytes: any): string => {
  return Array.prototype.map
    .call(bytes, (x) => ('00' + x.toString(16)).slice(-2))
    .join('')
    .toUpperCase();
};

const getPublicFromPrivate = (privateKey: string): string => {
  const privateKeyDer: any = privateToDer(privateKey);
  const privateKeyObj: any = crypto.createPrivateKey({ key: privateKeyDer, format: 'der', type: 'pkcs8' });
  const publicKeyObj: any = crypto.createPublicKey({ key: privateKeyObj, format: 'pem' });
  const encodedHex: any = publicKeyObj.export({ format: 'der', type: 'spki' }).toString('hex').toUpperCase();
  return _removePublicKeyPrefix(encodedHex);
};

const _removePublicKeyPrefix = (encodedHex:string):string => {
  if (encodedHex.startsWith(PUBLIC_KEY_PREFIX)) {
    return encodedHex.substring(PUBLIC_KEY_PREFIX.length);
  } else {
    throw Error(`unknown prefix, expecting '${PUBLIC_KEY_PREFIX}' cannot decode public key '${encodedHex}'`);
  }
}

export {
  isSeedValid,
  getSeed,
  getPrivateKeyFromSeed,
  getPublicFromPrivate,
  _removePublicKeyPrefix
 };
