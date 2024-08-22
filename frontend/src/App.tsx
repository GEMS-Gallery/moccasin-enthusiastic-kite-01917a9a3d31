import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Box, Grid, Chip, Divider, Paper, AppBar, Toolbar, Select, MenuItem, FormControl, InputLabel, CircularProgress, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import { Delete, CheckCircle, Add, LocalGroceryStore } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { styled } from '@mui/system';

type GroceryItem = {
  id: number;
  name: string;
  category: string;
  completed: boolean;
  isPredefined: boolean;
  emoji: string;
  quantity: number;
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
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPredefinedItem, setSelectedPredefinedItem] = useState<{ name: string, emoji: string, category: string } | null>(null);
  const { control, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    const result = await backend.getItems();
    setItems(result.map(item => ({
      ...item,
      id: Number(item.id),
      quantity: Number(item.quantity)
    })));
  };

  const fetchCategories = async () => {
    try {
      const result = await backend.getCategories();
      setCategories(result);
      result.forEach(fetchPredefinedItems);
      if (result.length > 0) {
        setValue('category', result[0]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setIsLoading(false);
    }
  };

  const fetchPredefinedItems = async (category: string) => {
    const result = await backend.getPredefinedItems(category);
    setPredefinedItems(prev => ({ ...prev, [category]: result }));
  };

  const onSubmit = async (data: { name: string; category: string; quantity: number }) => {
    await backend.addItem(data.name, data.category, false, '🛒', data.quantity);
    reset();
    fetchItems();
  };

  const handleAddPredefinedItem = (name: string, emoji: string, category: string) => {
    setSelectedPredefinedItem({ name, emoji, category });
    setOpenDialog(true);
  };

  const handleConfirmAddPredefinedItem = async (quantity: number) => {
    if (selectedPredefinedItem) {
      await backend.addItem(selectedPredefinedItem.name, selectedPredefinedItem.category, true, selectedPredefinedItem.emoji, quantity);
      fetchItems();
    }
    setOpenDialog(false);
    setSelectedPredefinedItem(null);
  };

  const handleComplete = async (id: number) => {
    await backend.markItemComplete(id);
    fetchItems();
  };

  const handleDelete = async (id: number) => {
    await backend.removeItem(id);
    fetchItems();
  };

  const getCategoryItemCount = (category: string) => {
    return items
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

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
              <Grid item xs={12} sm={4}>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => <TextField {...field} label="Item Name" fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Controller
                    name="category"
                    control={control}
                    defaultValue={categories[0] || ''}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-label"
                        label="Category"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name="quantity"
                  control={control}
                  defaultValue={1}
                  rules={{ required: true, min: 1 }}
                  render={({ field }) => <TextField {...field} label="Quantity" type="number" fullWidth InputProps={{ inputProps: { min: 1 } }} />}
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="div">{category}</Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  Items: {getCategoryItemCount(category)}
                </Typography>
                <Tooltip title={`${getCategoryItemCount(category)} items in ${category}`} arrow>
                  <Badge badgeContent={getCategoryItemCount(category)} color="primary">
                    <LocalGroceryStore />
                  </Badge>
                </Tooltip>
              </Box>
            </Box>
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
                <ListItem key={item.id} sx={{
                  bgcolor: item.completed ? 'rgba(76, 175, 80, 0.1)' : 'inherit',
                  borderRadius: '8px',
                  mb: 1,
                }}>
                  <ListItemText
                    primary={`${item.emoji} ${item.name} (${item.quantity})`}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add {selectedPredefinedItem?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={1}
            InputProps={{ inputProps: { min: 1 } }}
            onChange={(e) => setValue('predefinedQuantity', parseInt(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => handleConfirmAddPredefinedItem(1)}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
