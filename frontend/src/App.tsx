import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Box } from '@mui/material';
import { Delete, CheckCircle } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

type GroceryItem = {
  id: bigint;
  name: string;
  category: string;
  completed: boolean;
};

function App() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const result = await backend.getItems();
    setItems(result);
  };

  const onSubmit = async (data: { name: string; category: string }) => {
    await backend.addItem(data.name, data.category);
    reset();
    fetchItems();
  };

  const handleComplete = async (id: bigint) => {
    await backend.markItemComplete(id);
    fetchItems();
  };

  const handleDelete = async (id: bigint) => {
    await backend.removeItem(id);
    fetchItems();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Grocery List
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 2 }}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => <TextField {...field} label="Item Name" fullWidth margin="normal" />}
        />
        <Controller
          name="category"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => <TextField {...field} label="Category" fullWidth margin="normal" />}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Item
        </Button>
      </Box>
      <List>
        {items.map((item) => (
          <ListItem key={Number(item.id)} sx={{ bgcolor: item.completed ? 'rgba(76, 175, 80, 0.1)' : 'inherit' }}>
            <ListItemText
              primary={item.name}
              secondary={item.category}
              sx={{ textDecoration: item.completed ? 'line-through' : 'none' }}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="complete" onClick={() => handleComplete(item.id)} disabled={item.completed}>
                <CheckCircle />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
