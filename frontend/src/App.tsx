import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Box, Grid, Chip, Tabs, Tab } from '@mui/material';
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
  const [foodItems, setFoodItems] = useState<[string, string][]>([]);
  const [supplyItems, setSupplyItems] = useState<[string, string][]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('Food');
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
    fetchPredefinedItems('Food');
    fetchPredefinedItems('Supplies');
  }, []);

  const fetchItems = async () => {
    const result = await backend.getItems();
    setItems(result);
  };

  const fetchPredefinedItems = async (category: string) => {
    const result = await backend.getPredefinedItems(category);
    if (category === 'Food') {
      setFoodItems(result);
    } else if (category === 'Supplies') {
      setSupplyItems(result);
    }
  };

  const onSubmit = async (data: { name: string; category: string }) => {
    await backend.addItem(data.name, data.category, false, '🛒');
    reset();
    fetchItems();
  };

  const handleAddPredefinedItem = async (name: string, emoji: string) => {
    await backend.addItem(name, currentCategory, true, emoji);
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

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentCategory(newValue);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Grocery List
      </Typography>
      <Tabs value={currentCategory} onChange={handleCategoryChange} centered>
        <Tab label="Food" value="Food" />
        <Tab label="Supplies" value="Supplies" />
      </Tabs>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {(currentCategory === 'Food' ? foodItems : supplyItems).map(([item, emoji]) => (
          <Grid item key={item}>
            <Chip
              label={`${emoji} ${item}`}
              onClick={() => handleAddPredefinedItem(item, emoji)}
              icon={<Add />}
            />
          </Grid>
        ))}
      </Grid>
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
          defaultValue={currentCategory}
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
              <option value="Food">Food</option>
              <option value="Supplies">Supplies</option>
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
