export const idlFactory = ({ IDL }) => {
  const GroceryItem = IDL.Record({
    'id' : IDL.Nat,
    'isPredefined' : IDL.Bool,
    'name' : IDL.Text,
    'completed' : IDL.Bool,
    'emoji' : IDL.Text,
    'quantity' : IDL.Nat,
    'category' : IDL.Text,
  });
  return IDL.Service({
    'addItem' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Bool, IDL.Text, IDL.Nat],
        [IDL.Nat],
        [],
      ),
    'getCategories' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getItems' : IDL.Func([], [IDL.Vec(GroceryItem)], ['query']),
    'getPredefinedItems' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'markItemComplete' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'removeItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'updateItemQuantity' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
