import { docExists, registerDoc, getAuthorizedAccounts, getAuthor, init, getDocumentKey, setAccess, subscribe, getSubscriptionFee, setSubscriptionFee } from '../main'
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
const authorized1: string[] = [];
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
  it('be able to add authorized address to a document if author', () => {
    Context.setSigner_account_id(account0);
    let authorized = getAuthorizedAccounts(docId1);
    expect(authorized.includes(account1)).toBe(false);
    expect(authorized.includes(account3)).toBe(false);
    setAccess(docId1, [account1, account3], []);
    authorized = getAuthorizedAccounts(docId1);
    expect(authorized.length).toBe(authorized1.length + 2);
    expect(authorized.includes(account1)).toBe(true);
    expect(authorized.includes(account2)).toBe(false);
    expect(authorized.includes(account3)).toBe(true);
    Context.setSigner_account_id(account0);
    expect(getDocumentKey(docId1)).toBe(encryptedKey1);
    Context.setSigner_account_id(account1);
    expect(getDocumentKey(docId1)).toBe(encryptedKey1);
    Context.setSigner_account_id(account2);
    expect(getDocumentKey(docId1)).toBe('');
    Context.setSigner_account_id(account3);
    expect(getDocumentKey(docId1)).toBe(encryptedKey1);
  })
  // it('not be able to add authorized address if not author', () => {
  //   Context.setSigner_account_id(account1);
  //   setAccess(docId1, [account2], []);
  //   // -> expected to throw 'only the author of the document can change authorisations'
  // })
  it('be able to deny address if author', () => {
    Context.setSigner_account_id(account0);
    setAccess(docId1, [], [account1, account2]);
    let authorized = getAuthorizedAccounts(docId1);
    expect(authorized.length).toBe(1);
    expect(authorized.includes(account1)).toBe(false);
    expect(authorized.includes(account2)).toBe(false);
    expect(authorized.includes(account3)).toBe(true);
    Context.setSigner_account_id(account0);
    expect(getDocumentKey(docId1)).toBe(encryptedKey1);
    Context.setSigner_account_id(account1);
    expect(getDocumentKey(docId1)).toBe('');
    Context.setSigner_account_id(account2);
    expect(getDocumentKey(docId1)).toBe('');
    Context.setSigner_account_id(account3);
    expect(getDocumentKey(docId1)).toBe(encryptedKey1);
  })
  it('be able to mix authorized/denied address to a document if author', () => {
    Context.setSigner_account_id(account0);
    setAccess(docId1, [account1, account2, account4], [account3, account4]);
    let authorized = getAuthorizedAccounts(docId1);
    expect(authorized.length).toBe(2);
    expect(authorized.includes(account1)).toBe(true);
    expect(authorized.includes(account2)).toBe(true);
    expect(authorized.includes(account3)).toBe(false);
    expect(authorized.includes(account4)).toBe(false);

    Context.setSigner_account_id(account0);
    expect(getDocumentKey(docId1)).toBe(encryptedKey1);
    Context.setSigner_account_id(account1);
    expect(getDocumentKey(docId1)).toBe(encryptedKey1);
    Context.setSigner_account_id(account2);
    expect(getDocumentKey(docId1)).toBe(encryptedKey1);
    Context.setSigner_account_id(account3);
    expect(getDocumentKey(docId1)).toBe('');
    Context.setSigner_account_id(account4);
    expect(getDocumentKey(docId1)).toBe('');

    Context.setSigner_account_id(account0);
    setAccess(docId1, [account3, account4], [account1, account2]);
    authorized = getAuthorizedAccounts(docId1);
    expect(authorized.length).toBe(2);
    expect(authorized.includes(account1)).toBe(false);
    expect(authorized.includes(account2)).toBe(false);
    expect(authorized.includes(account3)).toBe(true);
    expect(authorized.includes(account4)).toBe(true);
  })
  // it('not be able to add authorized address if not author', () => {
  //   Context.setSigner_account_id(account3);
  //   setAccess(docId1, [], [account2]);
  //   // -> expected to throw 'only the author of the document can change authorisations'
  // })
  it('be able to subscribe to a free document', () => {
    Context.setSigner_account_id(account3);
    expect(getDocumentKey(docId2)).toBe('');
    let authorized = getAuthorizedAccounts(docId2);
    expect(authorized.includes(account3)).toBe(false);
    subscribe(docId2);
    expect(getDocumentKey(docId2)).toBe(encryptedKey2);
    authorized = getAuthorizedAccounts(docId2);
    expect(authorized.includes(account3)).toBe(true);
    // expect(await dVSRegistry.getDocumentKey(doc2.docId, { from: accounts[3] })).to.eq('');
    // let authorized = await dVSRegistry.getAuthorizedAccounts(doc2.docId);
    // expect(authorized.includes(accounts[3])).to.be.false;
    // await dVSRegistry.subscribe(doc2.docId, { from: accounts[3] });
    // expect(await dVSRegistry.getDocumentKey(doc2.docId, { from: accounts[3] })).to.eq(doc2.encryptedKey);
    // authorized = await dVSRegistry.getAuthorizedAccounts(doc2.docId);
    // expect(authorized.includes(accounts[3])).to.be.true;
  })
  // it('not be able to subscribe twice to a document', () => {
  //   let authorized = getAuthorizedAccounts(docId2);
  //   expect(authorized.includes(account3)).toBe(true);
  //   Context.setSigner_account_id(account3);
  //   subscribe(docId2);
  //   // -> expected to throw 'account has already subscribed to this document'
  // })
  // it('not be able to subscribe if already authorized', () => {
  //   let authorized = getAuthorizedAccounts(docId2);
  //   expect(authorized.includes(account2)).toBe(true);
  //   Context.setSigner_account_id(account2);
  //   subscribe(docId2);
  //   // -> expected to throw 'account has already subscribed to this document'
  // })
  // it('not be able to subscribe if author', () => {
  //   expect(getAuthor(docId2)).toBe(account0);
  //   Context.setSigner_account_id(account0);
  //   subscribe(docId2);
  //   // -> expected to throw 'document author does not need to subscribe'
  // })
  it('be able to consult subscription fee', () => {
    let fee1 = getSubscriptionFee(docId1);
    expect(fee1).toBe(subscriptionFee1);
    let fee2 = getSubscriptionFee(docId2);
    expect(fee2).toBe(subscriptionFee2);
  })
  it('be able to change subscription fee if author', () => {
    let fee1 = getSubscriptionFee(docId1);
    expect(fee1).toBe(subscriptionFee1);
    Context.setSigner_account_id(account0);
    setSubscriptionFee(docId1, 654321);
    fee1 = getSubscriptionFee(docId1);
    expect(fee1).toBe(654321);
  })
  // it('not be able to change subscription fee if not author', () => {
  //   let fee1 = getSubscriptionFee(docId1);
  //   expect(fee1).toBe(654321);
  //   Context.setSigner_account_id(account1);
  //   setSubscriptionFee(docId1, 654321);
  //   //  -> expected to throw 'only the author of the document can change authorisations'
  // })
})

