import { docExists, registerDoc, getAuthorizedAccounts, getAuthor, init, getDocumentKey } from '../main'
import { PersistentVector, context, Context } from 'near-sdk-as'

// import { v4 as uuid } from 'uuid';

// const doc1 = {
//   docId: '11111',
//   encryptedKey: 'xxxxx',
//   subscriptionFee: 123456,
//   authorized: new PersistentVector<string>("authorized_doc1:")
// };
const account0 = 'account0';
const account1 = 'account1';
const docId1: string = '1111';
const encryptedKey1: string = 'xxxxx';
const subscriptionFee1: u64 = 123456;
// const authorized1 = new PersistentVector<string>("authorized_doc1:");
const authorized1: string[] = ['toto', 'tata', 'titi'];
const docId2: string = '2222';
const encryptedKey2: string = 'xxxxx';
const subscriptionFee2: u64 = 0;
const authorized2 = new PersistentVector<string>("authorized_doc2:");

const ERROR_DOC_ALREADY_EXISTS = 'a document with this id already exists';

describe('Test DVSRegistry contract', () => {
  beforeAll(() => {
    init(account0);
  });

  it('be able to register a protected document', () => {
    Context.setSigner_account_id(account0);
    expect(docExists(docId1)).toBe(false);
    expect(docExists(docId2)).toBe(false);
    registerDoc(docId1, encryptedKey1, subscriptionFee1, authorized1);
    expect(docExists(docId1)).toBe(true);
    expect(docExists(docId2)).toBe(false);
    let authorized = getAuthorizedAccounts(docId1);
    expect(authorized.length).toBe(authorized1.length);
    expect(getAuthor(docId1)).toBe(account0);
  })
  // it('not be able to regsiter the same document again', () => {
  //   Context.setSigner_account_id(account0);
  //   registerDoc(docId1, encryptedKey1, subscriptionFee1, authorized1);
  //   // -> expected to throw 'a document with this id already exists'
  // })
  it('be able to get encryption key if author', () => {
    Context.setSigner_account_id(account0);
    expect(getDocumentKey(docId1)).toBe(encryptedKey1);
    Context.setSigner_account_id(account1);
    expect(getDocumentKey(docId1)).toBe('');
  })
})

