// @nearfile

import { context, u128 } from "near-sdk-as";

// Exporting a new class PostedMessage so it can be used outside of this file.
export class PostedMessage {
  premium: boolean;
  sender: string;
  constructor(public text: string) {
    this.premium = context.attachedDeposit >= u128.from('10000000000000000000000');
    this.sender = context.sender;
  }
}

export class OnDDoxGetOwnerArgs {

}

export class GetOwnerArgs {

}

export class GetOwnerResult {
  owner: string
}

export class AddItemArgs {
  accountId: string;
  itemId: string;
};