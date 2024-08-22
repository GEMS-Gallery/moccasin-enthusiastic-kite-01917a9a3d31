import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Result "mo:base/Result";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Error "mo:base/Error";

actor {
  // Define the GroceryItem type
  type GroceryItem = {
    id: Nat;
    name: Text;
    category: Text;
    completed: Bool;
    isPredefined: Bool;
    emoji: Text;
    quantity: Nat;
  };

  // Stable variables for persistence
  stable var nextId: Nat = 0;
  stable var groceryItemsEntries: [(Nat, GroceryItem)] = [];

  // Create a HashMap to store grocery items
  let groceryItems = HashMap.fromIter<Nat, GroceryItem>(groceryItemsEntries.vals(), 0, Int.equal, Int.hash);

  // Predefined list of food items with emojis
  let predefinedFood: [(Text, Text)] = [
    ("Apple", "🍎"), ("Banana", "🍌"), ("Bread", "🍞"), ("Milk", "🥛"), ("Eggs", "🥚"),
    ("Cheese", "🧀"), ("Chicken", "🍗"), ("Rice", "🍚"), ("Pasta", "🍝"), ("Tomato", "🍅"),
    ("Potato", "🥔"), ("Onion", "🧅"), ("Carrot", "🥕"), ("Lettuce", "🥬"), ("Cucumber", "🥒"),
    ("Yogurt", "🥛"), ("Cereal", "🥣"), ("Coffee", "☕"), ("Tea", "🍵"), ("Juice", "🧃"),
    ("Fish", "🐟"), ("Beef", "🥩"), ("Pork", "🥓"), ("Garlic", "🧄"), ("Lemon", "🍋"),
    ("Orange", "🍊"), ("Grapes", "🍇"), ("Strawberry", "🍓"), ("Watermelon", "🍉"), ("Pineapple", "🍍")
  ];

  // Predefined list of supplies with emojis
  let predefinedSupplies: [(Text, Text)] = [
    ("Paper Towels", "🧻"), ("Dish Soap", "🧼"), ("Laundry Detergent", "🧺"),
    ("Trash Bags", "🗑️"), ("Aluminum Foil", "🔲"), ("Plastic Wrap", "🎁"),
    ("Toothpaste", "🦷"), ("Shampoo", "🧴"), ("Soap", "🧼"),
    ("Toilet Paper", "🧻"), ("Tissues", "🤧"), ("Sponges", "🧽"),
    ("Dishwasher Tablets", "🍽️"), ("Air Freshener", "🌸"), ("Bleach", "🧪"),
    ("Glass Cleaner", "🪟"), ("Floor Cleaner", "🧹"), ("Insect Repellent", "🦟")
  ];

  // Predefined list of household items with emojis
  let predefinedHousehold: [(Text, Text)] = [
    ("Light Bulbs", "💡"), ("Batteries", "🔋"), ("Candles", "🕯️"),
    ("Air Freshener", "🌸"), ("Cleaning Gloves", "🧤"), ("Broom", "🧹"),
    ("Mop", "🧼"), ("Dustpan", "🧹"), ("Garbage Bags", "🗑️"),
    ("Dish Cloths", "🧽"), ("Scrub Brush", "🧽"), ("Plunger", "🪠"),
    ("Flashlight", "🔦"), ("Duct Tape", "📼"), ("Scissors", "✂️"),
    ("Matches", "🔥"), ("Clothespins", "🧷"), ("Hangers", "🧥")
  ];

  // Predefined list of personal care items with emojis
  let predefinedPersonalCare: [(Text, Text)] = [
    ("Toothbrush", "🪥"), ("Deodorant", "💨"), ("Razor", "🪒"),
    ("Lotion", "🧴"), ("Sunscreen", "🧴"), ("Lip Balm", "💄"),
    ("Cotton Swabs", "🦻"), ("Nail Clippers", "✂️"), ("Hair Brush", "🧼"),
    ("Hair Ties", "🎀"), ("Feminine Products", "🩸"), ("Cologne/Perfume", "🌺")
  ];

  // Predefined list of beverages with emojis
  let predefinedBeverages: [(Text, Text)] = [
    ("Water", "💧"), ("Soda", "🥤"), ("Beer", "🍺"),
    ("Wine", "🍷"), ("Juice", "🧃"), ("Milk", "🥛"),
    ("Tea", "🍵"), ("Coffee", "☕"), ("Energy Drink", "⚡"),
    ("Sparkling Water", "🫧"), ("Lemonade", "🍋"), ("Iced Tea", "🧊🍵")
  ];

  // Get predefined items by category
  public query func getPredefinedItems(category: Text) : async [(Text, Text)] {
    switch (category) {
      case ("Food") { predefinedFood };
      case ("Supplies") { predefinedSupplies };
      case ("Household") { predefinedHousehold };
      case ("Personal Care") { predefinedPersonalCare };
      case ("Beverages") { predefinedBeverages };
      case (_) { [] };
    }
  };

  // Get all categories
  public query func getCategories() : async [Text] {
    ["Food", "Supplies", "Household", "Personal Care", "Beverages"]
  };

  // Add a new grocery item (custom or predefined)
  public func addItem(name: Text, category: Text, isPredefined: Bool, emoji: Text, quantity: Nat) : async Result.Result<Nat, Text> {
    try {
      let id = nextId;
      let item: GroceryItem = {
        id = id;
        name = name;
        category = category;
        completed = false;
        isPredefined = isPredefined;
        emoji = emoji;
        quantity = quantity;
      };
      groceryItems.put(id, item);
      nextId += 1;
      #ok(id)
    } catch (e) {
      #err("Failed to add item: " # Error.message(e))
    }
  };

  // Get all grocery items
  public query func getItems() : async [GroceryItem] {
    Iter.toArray(groceryItems.vals())
  };

  // Mark an item as complete
  public func markItemComplete(id: Nat) : async Result.Result<Bool, Text> {
    switch (groceryItems.get(id)) {
      case (null) { #err("Item not found") };
      case (?item) {
        let updatedItem: GroceryItem = {
          id = item.id;
          name = item.name;
          category = item.category;
          completed = true;
          isPredefined = item.isPredefined;
          emoji = item.emoji;
          quantity = item.quantity;
        };
        groceryItems.put(id, updatedItem);
        #ok(true)
      };
    }
  };

  // Remove an item from the list
  public func removeItem(id: Nat) : async Result.Result<Bool, Text> {
    switch (groceryItems.remove(id)) {
      case (null) { #err("Item not found") };
      case (?_) { #ok(true) };
    }
  };

  // Update item quantity
  public func updateItemQuantity(id: Nat, newQuantity: Nat) : async Result.Result<Bool, Text> {
    switch (groceryItems.get(id)) {
      case (null) { #err("Item not found") };
      case (?item) {
        let updatedItem: GroceryItem = {
          id = item.id;
          name = item.name;
          category = item.category;
          completed = item.completed;
          isPredefined = item.isPredefined;
          emoji = item.emoji;
          quantity = newQuantity;
        };
        groceryItems.put(id, updatedItem);
        #ok(true)
      };
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
