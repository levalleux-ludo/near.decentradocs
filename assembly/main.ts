// @nearfile

import { PersistentVector, PersistentMap, context, logging, storage } from "near-sdk-as";

// --- contract code goes below
let _initialOwner: string;
const PUBLIC_KEY = '00000-00000-00000-00000-00000';
const _authorPerDocId = new PersistentMap<string, string>("authors:");
// const _authorizedAddressPerDocId = new PersistentMap<string, PersistentVector<string>>("authorizedVector:")
const _authorizedAddressPerDocId = new PersistentMap<string, Array<string>>("authorizedVector:")
const _subscriptionFeePerDocId = new PersistentMap<string, u64>("subscriptionFee:")
const _encryptedKeyPerDocId = new PersistentMap<string, string>("encryptedKey:")

export function init(initialOwner: string): void {
  logging.log("initialOwner: " + initialOwner);
  assert(storage.get<string>("init") == null, "Already initialized token supply");
  _initialOwner = initialOwner;
  storage.set("init", "done");
}

export function docExists(docId: string): bool {
  return _authorPerDocId.contains(docId);
}

export function registerDoc(
  docId: string,
  encryptedKey: string,
  subscriptionFee: u64,
  authorizedAddresses: Array<string> ): void {
    assert(!docExists(docId), 'a document with this id already exists');
    const author: string = context.sender;
    _authorPerDocId.set(docId, author);
    _encryptedKeyPerDocId.set(docId, encryptedKey);
    _subscriptionFeePerDocId.set(docId, subscriptionFee);
    // const authorizedVector = new PersistentVector<string>("authorized:");
    // for (let i = 0; i < authorizedAddresses.length; i++) {
    //   authorizedVector.push(authorizedAddresses[i]);
    // }
    // _authorizedAddressPerDocId.set(docId, authorizedVector);
    _authorizedAddressPerDocId.set(docId, authorizedAddresses);
}

export function getAuthorizedAccounts(docId: string): Array<string> {
  const authorized = _authorizedAddressPerDocId.get(docId);
  if (!authorized) {
    return [];
  }
  const result = new Array<string>(authorized.length);
  for (let i = 0; i < authorized.length; i++) {
    result[i] = authorized[i];
  }
  return result;
}

export function isAuthorized(docId: string, account: string): bool {
  const authorized = _authorizedAddressPerDocId.get(docId);
  if (authorized) {
    return authorized.includes(account);
  }
  return false;
}

export function getAuthor(docId: string): string | null {
  assert(docExists(docId), "this document has not been registered");
  return _authorPerDocId.get(docId);
}

export function getDocumentKey(docId: string): string | null {
if ((context.sender == _authorPerDocId.get(docId)) ||
    isAuthorized(docId, context.sender) ||
    (PUBLIC_KEY === _encryptedKeyPerDocId.get(docId)) ) {
    let key =_encryptedKeyPerDocId.get(docId);
    if (key != null) {
      return key;
    }
  }
  return '';
}

