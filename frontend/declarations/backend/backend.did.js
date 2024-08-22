export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const GroceryItem = IDL.Record({
    'id' : IDL.Nat,
    'isPredefined' : IDL.Bool,
    'name' : IDL.Text,
    'completed' : IDL.Bool,
    'emoji' : IDL.Text,
    'quantity' : IDL.Nat,
    'category' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  return IDL.Service({
    'addItem' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Bool, IDL.Text, IDL.Nat],
        [Result_1],
        [],
      ),
    'getCategories' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getItems' : IDL.Func([], [IDL.Vec(GroceryItem)], ['query']),
    'getPredefinedItems' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'markItemComplete' : IDL.Func([IDL.Nat], [Result], []),
    'removeItem' : IDL.Func([IDL.Nat], [Result], []),
    'updateItemQuantity' : IDL.Func([IDL.Nat, IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
