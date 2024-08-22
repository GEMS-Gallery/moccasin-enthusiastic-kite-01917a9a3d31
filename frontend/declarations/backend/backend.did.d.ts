import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface GroceryItem {
  'id' : bigint,
  'isPredefined' : boolean,
  'name' : string,
  'completed' : boolean,
  'emoji' : string,
  'quantity' : bigint,
  'category' : string,
}
export type Result = { 'ok' : boolean } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'addItem' : ActorMethod<[string, string, boolean, string, bigint], Result_1>,
  'getCategories' : ActorMethod<[], Array<string>>,
  'getItems' : ActorMethod<[], Array<GroceryItem>>,
  'getPredefinedItems' : ActorMethod<[string], Array<[string, string]>>,
  'markItemComplete' : ActorMethod<[bigint], Result>,
  'removeItem' : ActorMethod<[bigint], Result>,
  'updateItemQuantity' : ActorMethod<[bigint, bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
