import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";

actor {
  // Define the GroceryItem type
  type GroceryItem = {
    id: Nat;
    name: Text;
    category: Text;
    completed: Bool;
  };

  // Stable variables for persistence
  stable var nextId: Nat = 0;
  stable var groceryItemsEntries: [(Nat, GroceryItem)] = [];

  // Create a HashMap to store grocery items
  let groceryItems = HashMap.fromIter<Nat, GroceryItem>(groceryItemsEntries.vals(), 0, Int.equal, Int.hash);

  // Add a new grocery item
  public func addItem(name: Text, category: Text) : async Nat {
    let id = nextId;
    let item: GroceryItem = {
      id = id;
      name = name;
      category = category;
      completed = false;
    };
    groceryItems.put(id, item);
    nextId += 1;
    id
  };

  // Get all grocery items
  public query func getItems() : async [GroceryItem] {
    Iter.toArray(groceryItems.vals())
  };

  // Mark an item as complete
  public func markItemComplete(id: Nat) : async Bool {
    switch (groceryItems.get(id)) {
      case (null) { false };
      case (?item) {
        let updatedItem: GroceryItem = {
          id = item.id;
          name = item.name;
          category = item.category;
          completed = true;
        };
        groceryItems.put(id, updatedItem);
        true
      };
    }
  };

  // Remove an item from the list
  public func removeItem(id: Nat) : async Bool {
    switch (groceryItems.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  // System functions for upgrades
  system func preupgrade() {
    groceryItemsEntries := Iter.toArray(groceryItems.entries());
  };

  system func postupgrade() {
    groceryItemsEntries := [];
  };
}
