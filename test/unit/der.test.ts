'use strict';

// libraries
import * as crypto from 'crypto';
import * as chai from 'chai';

// modules
const expect = chai.expect;
import * as index from '../../src/index.ts';

describe('index', () => {
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
