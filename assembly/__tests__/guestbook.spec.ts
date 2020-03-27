import { docExists, registerDoc, getAuthorizedAccounts } from '../main'
import { PersistentVector, context } from 'near-sdk-as'
// import { v4 as uuid } from 'uuid';

// const doc1 = {
//   docId: '11111',
//   encryptedKey: 'xxxxx',
//   subscriptionFee: 123456,
//   authorized: new PersistentVector<string>("authorized_doc1:")
// };
const docId1: string = '1111';
const encryptedKey1: string = 'xxxxx';
const subscriptionFee1: u64 = 123456;
// const authorized1 = new PersistentVector<string>("authorized_doc1:");
const authorized1: string[] = [];
const docId2: string = '2222';
const encryptedKey2: string = 'xxxxx';
const subscriptionFee2: u64 = 0;
const authorized2 = new PersistentVector<string>("authorized_doc2:");

describe('Test DVSRegistry contract', () => {
  it('be able to register a protected document', () => {
    expect(docExists(docId1)).toBe(false);
    expect(docExists(docId2)).toBe(false);
    registerDoc(docId1, encryptedKey1, subscriptionFee1, authorized1);
    // expect(docExists(docId1)).toBe(true);
    // expect(docExists(docId2)).toBe(false);

  })
})
