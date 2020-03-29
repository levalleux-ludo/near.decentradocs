// @nearfile

import { PersistentVector, PersistentMap, context, logging, storage, ContractPromise, ContractPromiseResult } from "near-sdk-as";
import { OnDDoxGetOwnerArgs, GetOwnerArgs , GetOwnerResult, AddItemArgs } from './model';

// --- contract code goes below
let _initialOwner: string;
const PUBLIC_KEY = '00000-00000-00000-00000-00000';
const DDOX_CONTRACT='ddox-token';
const _authorPerDocId = new PersistentMap<string, string>("authors:");
// const _authorizedAddressPerDocId = new PersistentMap<string, PersistentVector<string>>("authorizedVector:");
const _authorizedAddressPerDocId = new PersistentMap<string, Array<string>>("authorizedVector:");
const _subscriptionFeePerDocId = new PersistentMap<string, u64>("subscriptionFee:");
const _encryptedKeyPerDocId = new PersistentMap<string, string>("encryptedKey:");

let lastResult: string = '';

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

function isAuthor(docId: string, account: string): bool {
  return (account == _authorPerDocId.get(docId));
}

export function getDocumentKey(docId: string): string | null {
if (isAuthor(docId, context.sender) ||
    isAuthorized(docId, context.sender) ||
    (PUBLIC_KEY == _encryptedKeyPerDocId.get(docId)) ) {
    let key =_encryptedKeyPerDocId.get(docId);
    if (key != null) {
      return key;
    }
  }
  return '';
}

function removeFromArrayIfIncluded<T>(theArray: Array<T>, item: T): void {
  const index = theArray.indexOf(item);
  if (index > -1) {
    theArray.splice(index, 1);
  }
}

export function setAccess(docId: string, authorizedAddresses: Array<string> , deniedAddresses: Array<string> ): void {
  assert(docExists(docId), "this document has not been registered");
  assert(isAuthor(docId, context.sender), "only the author of the document can change authorisations");
  const authorized = _authorizedAddressPerDocId.get(docId);
  if (authorized) {
    for (let i = 0; i < authorizedAddresses.length; i++) {
      const account: string = authorizedAddresses[i];
      if (!authorized.includes(account)) {
        authorized.push(account);
      }
    }
    for (let i = 0; i < deniedAddresses.length; i++) {
      const account: string = deniedAddresses[i];
      removeFromArrayIfIncluded(authorized, account);
    }
    _authorizedAddressPerDocId.set(docId, authorized);
  }
}

export function subscribe(docId: string): void {
  assert(!isAuthor(docId, context.sender), "document author does not need to subscribe");
  assert(!isAuthorized(docId, context.sender), "account has already subscribed to this document");
  // assert(context.receivedAmount >= _subscriptionFeePerDocId(docId), 'not enough fee to subscribe to this document');
  // assert(context.attachedDeposit >= _subscriptionFeePerDocId(docId), 'not enough fee to subscribe to this document');
  // let author = getAuthor(docId);
  // let fee = _subscriptionFeePerDocId(docId);

  // const authorized = _authorizedAddressPerDocId.get(docId);
  // if (authorized) {
  //   authorized.push(context.sender);
  // }
}

export function dDox_getOwner(): void {
  const get_Owner_args: GetOwnerArgs = {}; // call the contract method with these args
  const _on_dDox_getOwner_args: OnDDoxGetOwnerArgs = {}; // when the callback is called (back), give him this data
  // let itemArgs: AddItemArgs = {
  //        accountId: "alice.near",
  //        itemId: "Sword +9000",
  //      };
  // let promise = ContractPromise.create(
  //        "metanear",
  //        "addItem",
  //        itemArgs.encode(),
  //        0,
  //      );
  ContractPromise.create(DDOX_CONTRACT, 'getOwner', get_Owner_args.encode(), 0);
  // .then(context.contractName, '_on_dDox_getOwner', _on_dDox_getOwner_args.encode(), 0)
  // .returnAsResult();
}

// This function is prefixed with `_`, so other contracts or people can't call it directly.
export function _on_dDox_getOwner(): void {
  // Get all results
//  let results = ContractPromise.getResults();
//  let getOwnerResult = results[0];
//  // Verifying the remote contract call succeeded.
//  if (getOwnerResult.status) {
//     // Decoding data from the bytes buffer into the local object.
//     let data: GetOwnerResult = GetOwnerResult.decode(getOwnerResult.buffer);
//     return data.owner;
//   }
  lastResult = 'NOK';
}

