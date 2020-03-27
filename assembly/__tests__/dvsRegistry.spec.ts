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
const account2 = 'account2';
const account3 = 'account3';
const account4 = 'account4';
const PUBLIC_KEY = '00000-00000-00000-00000-00000';

const docId1: string = '1111';
const encryptedKey1: string = 'xxxxx';
const subscriptionFee1: u64 = 123456;
const authorized1: string[] = ['toto', 'tata', 'titi'];
const docId2: string = '2222';
const encryptedKey2: string = 'yyyyy';
const subscriptionFee2: u64 = 0;
const authorized2: string[] = [account1, account2];
const docId3: string = '3333';
const encryptedKey3: string = PUBLIC_KEY;
const subscriptionFee3: u64 = 0;
const authorized3: string[] = [];

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
  it('be able to get encryption key if authorized', () => {
    Context.setSigner_account_id(account0);
    registerDoc(docId2, encryptedKey2, subscriptionFee2, authorized2);
    expect(docExists(docId2)).toBeTruthy();
    expect(getDocumentKey(docId2)).toBe(encryptedKey2);
    Context.setSigner_account_id(account1);
    expect(getDocumentKey(docId2)).toBe(encryptedKey2);
    Context.setSigner_account_id(account2);
    expect(getDocumentKey(docId2)).toBe(encryptedKey2);
    Context.setSigner_account_id(account3);
    expect(getDocumentKey(docId2)).toBe('');
    let authorized = getAuthorizedAccounts(docId2);
    expect(authorized.length).toBe(authorized2.length);
    expect(getAuthor(docId2)).toBe(account0);
  })
  it('be able to get encryption key if key is public_key', () => {
    Context.setSigner_account_id(account0);
    registerDoc(docId3, encryptedKey3, subscriptionFee3, authorized3);
    expect(docExists(docId3)).toBeTruthy();
    expect(getDocumentKey(docId3)).toBe(PUBLIC_KEY);
    Context.setSigner_account_id(account1);
    expect(getDocumentKey(docId3)).toBe(PUBLIC_KEY);
    Context.setSigner_account_id(account2);
    expect(getDocumentKey(docId3)).toBe(PUBLIC_KEY);
    Context.setSigner_account_id(account3);
    expect(getDocumentKey(docId3)).toBe(PUBLIC_KEY);
  })
})

