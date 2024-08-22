export const idlFactory = ({ IDL }) => {
  const GroceryItem = IDL.Record({
    'id' : IDL.Nat,
    'isPredefined' : IDL.Bool,
    'name' : IDL.Text,
    'completed' : IDL.Bool,
    'category' : IDL.Text,
  });
  return IDL.Service({
    'addItem' : IDL.Func([IDL.Text, IDL.Text, IDL.Bool], [IDL.Nat], []),
    'getItems' : IDL.Func([], [IDL.Vec(GroceryItem)], ['query']),
    'getPredefinedItems' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'markItemComplete' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'removeItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
