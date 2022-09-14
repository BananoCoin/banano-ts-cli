'use strict';

// libraries
import * as crypto from 'crypto';
import * as chai from 'chai';

// modules
const expect = chai.expect;
import * as index from '../../src/index.ts';

describe('index', () => {
  it('isSeedValid', async () => {
    const actual = index.isSeedValid('');
    const expected = {
      message:`does not match regex '^[0123456789abcdefABCDEF]{64}$'`,
      valid:false,
    };
    expect(expected).to.deep.equal(actual);
  });
  it('getSeed', async () => {
    const seed = await index.getSeed();
    const expected = 64;
    const actual = seed.length;
    expect(expected).to.deep.equal(actual);
  });
  it('getPublicFromPrivate Specific', async () => {
    // https://docs.nano.org/protocol-design/signing-hashing-and-key-derivation/
    const privateKey = '0000000000000000000000000000000000000000000000000000000000000000';
    const publicKey = await index.getPublicFromPrivate(privateKey);
    const expected = '19D3D919475DEED4696B5D13018151D1AF88B2BD3BCFF048B45031C1F36D1858';
    const actual = publicKey;
    expect({publicKey:expected}).to.deep.equal({publicKey:actual});
  });
  it('getPublicFromPrivate Random', async () => {
    const seed = await index.getSeed();
    const publicKey = await index.getPublicFromPrivate(seed);
    const expected = 64;
    const actual = publicKey.length;
    expect(expected).to.deep.equal(actual);
  });
  it('getPublicFromPrivate Error', async () => {
    let actual = 'no error';
    try {
      await index._removePublicKeyPrefix('');
    } catch(error) {
      actual = error.message;
    }
    const expected = `unknown prefix, expecting '302A300506032B6570032100' cannot decode public key ''`;
    expect(expected).to.deep.equal(actual);
  });
  it('getPrivateKeyFromSeed Random', async () => {
    const seed = await index.getSeed();
    const privateKey = await index.getPrivateKeyFromSeed(seed, 256*256*256*256);
    const expected = 64;
    const actual = privateKey.length;
    expect(expected).to.deep.equal(actual);
  });
  it('getPrivateKeyFromSeed Specific', async () => {
    const seed = '6E258B9B43AB60310F2BD06337E9B537CC889F5EC0F90135073F764D55B05524';
    const privateKey = await index.getPrivateKeyFromSeed(seed, 0);
    const expectedPrivateKey = 'D39B0FC95F926CE7316195C038532E80E23CE6E3033C32D686F60E0D02C7C861';
    expect({privateKey:expectedPrivateKey}).to.deep.equal({privateKey:privateKey});
    const publicKey = await index.getPublicFromPrivate(privateKey);
    const expectedPublicKey = 'AD9C2EC6D190B8447E91D41F46E0417FAF7F5FD3676A0BE917CA2110ECB2E95A';
    expect({publicKey:expectedPublicKey}).to.deep.equal({publicKey:publicKey});
  });
  it('getPrivateKeyFromSeed Error', async () => {
    let actual = 'no error';
    try {
      await index.getPrivateKeyFromSeed('', 0);
    } catch(error) {
      actual = error.message;
    }
    const expected = `Invalid BANANO seed '', does not match regex '^[0123456789abcdefABCDEF]{64}$'`;
    expect(expected).to.deep.equal(actual);
  });
  it('DERtoPEM 1', () => {
    const privateKeyDer = '302e020100300506032b657004220420' + '6c3c6e1bf93e05ad2a078c7d05b8a944fe071aec93e7337ca5102236c62ec701';
    const privateKeyObj = crypto.createPrivateKey({ key: Buffer.from(privateKeyDer, 'hex'), format: 'der', type: 'pkcs8' });
    const publicKeyObj = crypto.createPublicKey({ key: privateKeyObj, format: 'pem' });
    const actualPublicKey = publicKeyObj.export({ format: 'der', type: 'spki' }).toString('hex').toUpperCase();
    const expectedPublicKey = '302A300506032B657003210011605690BD4691280DA0718ED8AFE7F41C0E35B434E48EB85F4F346325E7229C';
    expect(actualPublicKey).to.equal(expectedPublicKey);
  });
  it('DERtoPEM 2', () => {
    const privateKeyDer = '302e020100300506032b657004220420' + '3ae15024559b33b9c20c946926475a9efcd0574c8206e70a9ddb4cd240c0438e';
    const privateKeyObj = crypto.createPrivateKey({ key: Buffer.from(privateKeyDer, 'hex'), format: 'der', type: 'pkcs8' });
    const publicKeyObj = crypto.createPublicKey({ key: privateKeyObj, format: 'pem' });
    const actualPublicKey = publicKeyObj.export({ format: 'der', type: 'spki' }).toString('hex').toUpperCase();
    const expectedPublicKey = '302A300506032B6570032100507EBB05E143E6354111166F144790C69078E0B622C27098A52903245D300FB4';
    expect(actualPublicKey).to.equal(expectedPublicKey);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
