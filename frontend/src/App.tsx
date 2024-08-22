import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Box, Grid, Chip, Divider, Paper, AppBar, Toolbar } from '@mui/material';
import { Delete, CheckCircle, Add, ShoppingCart, LocalGroceryStore } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { styled } from '@mui/system';

type GroceryItem = {
  id: bigint;
  name: string;
  category: string;
  completed: boolean;
  isPredefined: boolean;
  emoji: string;
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}));

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
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <LocalGroceryStore sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Grocery List
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <StyledPaper elevation={3}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>Add Custom Item</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => <TextField {...field} label="Item Name" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth startIcon={<Add />}>
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>

        {categories.map((category) => (
          <StyledPaper key={category} elevation={3}>
            <Typography variant="h5" gutterBottom>{category}</Typography>
            <Box sx={{ mb: 2 }}>
              {predefinedItems[category]?.map(([item, emoji]) => (
                <StyledChip
                  key={item}
                  label={`${emoji} ${item}`}
                  onClick={() => handleAddPredefinedItem(item, emoji, category)}
                  icon={<Add />}
                />
              ))}
            </Box>
            <List>
              {items.filter(item => item.category === category).map((item) => (
                <ListItem key={Number(item.id)} sx={{
                  bgcolor: item.completed ? 'rgba(76, 175, 80, 0.1)' : 'inherit',
                  borderRadius: '8px',
                  mb: 1,
                }}>
                  <ListItemText
                    primary={`${item.emoji} ${item.name}`}
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
          </StyledPaper>
        ))}
      </Container>
    </>
  );
}

export default App;
