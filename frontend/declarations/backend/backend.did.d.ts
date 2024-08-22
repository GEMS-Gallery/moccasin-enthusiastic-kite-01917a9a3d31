import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GroceryItem {
  'id' : bigint,
  'isPredefined' : boolean,
  'name' : string,
  'completed' : boolean,
  'category' : string,
}
export interface _SERVICE {
  'addItem' : ActorMethod<[string, string, boolean], bigint>,
  'getItems' : ActorMethod<[], Array<GroceryItem>>,
  'getPredefinedItems' : ActorMethod<[], Array<string>>,
  'markItemComplete' : ActorMethod<[bigint], boolean>,
  'removeItem' : ActorMethod<[bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
