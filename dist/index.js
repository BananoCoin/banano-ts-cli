'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getPublicFromPrivate = exports.getPrivateKeyFromSeed = exports.getSeed = void 0;
const crypto = __importStar(require('crypto'));
const blake2b_1 = __importDefault(require('blake2b'));
const PUBLIC_KEY_PREFIX = '302A300506032B6570032100';
const SEED_ALPHABET_REGEX_STR = '^[0123456789abcdefABCDEF]{64}$';
const getSeed = async () => {
  return crypto.randomBytes(32).toString('hex').toUpperCase();
};
exports.getSeed = getSeed;
const privateToDer = (privateKeyHex) => {
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
const isSeedValid = (seed) => {
  const regex = new RegExp(SEED_ALPHABET_REGEX_STR);
  const isValid = regex.test(seed);
  const retval = {};
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
const getPrivateKeyFromSeed = (seed, seedIx) => {
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
exports.getPrivateKeyFromSeed = getPrivateKeyFromSeed;
const hexToUint8 = (hexValue) => {
  const length = (hexValue.length / 2) | 0;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8[i] = parseInt(hexValue.substr(i * 2, 2), 16);
  }
  return uint8;
};
const decToHex = (decValue, bytes = null) => {
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
const generateAccountSecretKeyBytes = (seedBytes, accountIndex) => {
  const accountBytes = hexToUint8(decToHex(accountIndex, 4));
  const b2b = (0, blake2b_1.default)(32);
  b2b.update(seedBytes);
  b2b.update(accountBytes);
  const newKey = b2b.digest();
  // const context = blake.blake2bInit(32);
  // blake.blake2bUpdate(context, seedBytes);
  // blake.blake2bUpdate(context, accountBytes);
  // const newKey = blake.blake2bFinal(context);
  return newKey;
};
const hexToBytes = (hex) => {
  const ret = new Uint8Array(hex.length / 2);
  for (let i = 0; i < ret.length; i++) {
    ret[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return ret;
};
const bytesToHex = (bytes) => {
  return Array.prototype.map
    .call(bytes, (x) => ('00' + x.toString(16)).slice(-2))
    .join('')
    .toUpperCase();
};
const getPublicFromPrivate = (privateKey) => {
  const privateKeyDer = privateToDer(privateKey);
  const privateKeyObj = crypto.createPrivateKey({ key: privateKeyDer, format: 'der', type: 'pkcs8' });
  const publicKeyObj = crypto.createPublicKey({ key: privateKeyObj, format: 'pem' });
  const encodedHex = publicKeyObj.export({ format: 'der', type: 'spki' }).toString('hex').toUpperCase();
  if (encodedHex.startsWith(PUBLIC_KEY_PREFIX)) {
    return encodedHex.substring(PUBLIC_KEY_PREFIX.length);
  } else {
    throw Error(`unknown prefix, expecting '${PUBLIC_KEY_PREFIX}' cannot decode public key '${encodedHex}'`);
  }
};
exports.getPublicFromPrivate = getPublicFromPrivate;
//# sourceMappingURL=index.js.map
