'use strict';

// libraries
import * as crypto from 'crypto';
import * as chai from 'chai';

// modules
const expect = chai.expect;
import * as index from '../../src/index.ts';

const ZEROES = '0000000000000000000000000000000000000000000000000000000000000000';

describe('index', () => {
  it('getSeed Random', async () => {
    const seed = await index.getSeed();
    const expected = 64;
    const actual = seed.length;
    expect(expected).to.deep.equal(actual);
  });
  it('getAccountsBalances Random', async () => {
    const seed = await index.getSeed();
    const seedIx = 0;
    const account = await index.getAccountFromSeed(seed, seedIx);
    index.setUrl('https://kaliumapi.appditto.com/api');
    const actual = await index.getAccountsBalances([account]);
    const expected = {
      balances: {},
    };
    expected.balances[account] = {
      balance: '0',
      balance_decimal: '0.0',
      pending: '0',
      receivable: '0',
      receivable_decimal: '0.0',
    };

    expect(expected).to.deep.equal(actual);
  });
  it('getPrivateKeyFromSeed Random', async () => {
    const seed = await index.getSeed();
    const seedIx = 0;
    const publicKey = await index.getPrivateKeyFromSeed(seed, seedIx);
    const expected = 64;
    const actual = publicKey.length;
    expect(expected).to.deep.equal(actual);
  });
  it('getPrivateKeyFromSeed Specific', async () => {
    const seed = ZEROES;
    const seedIx = 0;
    const privateKey = await index.getPrivateKeyFromSeed(seed, seedIx);
    const expected = '9F0E444C69F77A49BD0BE89DB92C38FE713E0963165CCA12FAF5712D7657120F';
    const actual = privateKey;
    expect(expected).to.deep.equal(actual);
  });
  it('getAccountFromSeed Specific', async () => {
    const seed = ZEROES;
    const seedIx = 0;
    const account = await index.getAccountFromSeed(seed, seedIx);
    const expected = 'ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7';
    const actual = account;
    expect(expected).to.deep.equal(actual);
  });
  it('getAccountFromSeed Random', async () => {
    const seed = await index.getSeed();
    const seedIx = 0;
    const account = await index.getAccountFromSeed(seed, seedIx);
    const expected = 64;
    const actual = account.length;
    expect(expected).to.deep.equal(actual);
  });
  it('signBlock Specific', async () => {
    const seed = ZEROES;
    const block = {
      type: 'state',
      account: 'ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
      previous: ZEROES,
      representative: 'ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
      balance: ZEROES,
      link: 'ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7',
      signature: '',
    };
    const signature = await index.signBlock(seed, block);
    const expected = signature;
    const actual = 'F51DC4D910FF20669F5E5ADBD93861514C05531DD57533FE248DB7558B3DEB2FE29ECEA32DF66647F16AC571C4D979A913CA6ACA48CC92951D3BE088D9710E08';
    expect(expected).to.deep.equal(actual);
  });
  it('getPublicKeyFromAccount Specific', async () => {
    const account = 'ban_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7';
    const publicKey = await index.getPublicKeyFromAccount(account);
    const expected = 'C008B814A7D269A1FA3C6528B19201A24D797912DB9996FF02A1FF356E45552B';
    const actual = publicKey;
    expect(expected).to.deep.equal(actual);
  });
  it('getAmountPartsFromRaw Specific', async () => {
    const raw = ZEROES;
    const amountParts = await index.getAmountPartsFromRaw(raw);
    const expected = {
      banano: '0',
      banoshi: '0',
      majorName: 'banano',
      minorName: 'banoshi',
      raw: '0',
    };
    const actual = amountParts;
    expect(expected).to.deep.equal(actual);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
