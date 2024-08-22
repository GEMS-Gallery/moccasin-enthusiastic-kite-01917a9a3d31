import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Box, Grid, Chip, Divider } from '@mui/material';
import { Delete, CheckCircle, Add } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

type GroceryItem = {
  id: bigint;
  name: string;
  category: string;
  completed: boolean;
  isPredefined: boolean;
  emoji: string;
};

function App() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [predefinedItems, setPredefinedItems] = useState<{ [key: string]: [string, string][] }>({});
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    const result = await backend.getItems();
    setItems(result);
  };

  const fetchCategories = async () => {
    const result = await backend.getCategories();
    setCategories(result);
    result.forEach(fetchPredefinedItems);
  };

  const fetchPredefinedItems = async (category: string) => {
    const result = await backend.getPredefinedItems(category);
    setPredefinedItems(prev => ({ ...prev, [category]: result }));
  };

  const onSubmit = async (data: { name: string; category: string }) => {
    await backend.addItem(data.name, data.category, false, '🛒');
    reset();
    fetchItems();
  };

  const handleAddPredefinedItem = async (name: string, emoji: string, category: string) => {
    await backend.addItem(name, category, true, emoji);
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
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Grocery List
      </Typography>
      {categories.map((category) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {category}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {predefinedItems[category]?.map(([item, emoji]) => (
              <Grid item key={item}>
                <Chip
                  label={`${emoji} ${item}`}
                  onClick={() => handleAddPredefinedItem(item, emoji, category)}
                  icon={<Add />}
                />
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 2 }} />
        </Box>
      ))}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ my: 2 }}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={({ field }) => <TextField {...field} label="Custom Item Name" fullWidth margin="normal" />}
        />
        <Controller
          name="category"
          control={control}
          defaultValue={categories[0] || ''}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Category"
              fullWidth
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </TextField>
          )}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth startIcon={<Add />}>
          Add Custom Item
        </Button>
      </Box>
      <List>
        {items.map((item) => (
          <ListItem key={Number(item.id)} sx={{ bgcolor: item.completed ? 'rgba(76, 175, 80, 0.1)' : 'inherit' }}>
            <ListItemText
              primary={`${item.emoji} ${item.name}`}
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
