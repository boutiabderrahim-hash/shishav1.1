import { Category, MenuItem, InventoryItem, Waiter } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Pizzas' },
  { id: 'cat2', name: 'Pastas' },
  { id: 'cat3', name: 'Salads' },
  { id: 'cat4', name: 'Drinks' },
  { id: 'cat5', name: 'Desserts' },
];

export const mockInventory: InventoryItem[] = [
    { id: 'inv1', name: 'Pizza Dough', quantity: 50, unit: 'units', lowStockThreshold: 10 },
    { id: 'inv2', name: 'Tomato Sauce', quantity: 20, unit: 'liters', lowStockThreshold: 5 },
    { id: 'inv3', name: 'Mozzarella', quantity: 15, unit: 'kg', lowStockThreshold: 3 },
    { id: 'inv4', name: 'Pepperoni', quantity: 5, unit: 'kg', lowStockThreshold: 1 },
    { id: 'inv5', name: 'Lettuce', quantity: 10, unit: 'heads', lowStockThreshold: 2 },
    { id: 'inv6', name: 'Pasta', quantity: 30, unit: 'kg', lowStockThreshold: 5 },
    { id: 'inv7', name: 'Cola', quantity: 100, unit: 'cans', lowStockThreshold: 24 },
    { id: 'inv8', name: 'Tiramisu Portion', quantity: 12, unit: 'units', lowStockThreshold: 4 },
    { id: 'inv9', name: 'Fanta', quantity: 100, unit: 'cans', lowStockThreshold: 24 },
    { id: 'inv10', name: 'Sprite', quantity: 100, unit: 'cans', lowStockThreshold: 24 },
    { id: 'inv11', name: 'Water', quantity: 100, unit: 'bottles', lowStockThreshold: 24 },
    { id: 'inv12', name: 'Beer', quantity: 50, unit: 'bottles', lowStockThreshold: 12 },
    { id: 'inv13', name: 'House Wine', quantity: 10, unit: 'liters', lowStockThreshold: 2 },
];


export const mockMenuItems: MenuItem[] = [
  // Pizzas
  {
    id: 'item1',
    name: 'Margherita Pizza',
    price: 8.99,
    categoryId: 'cat1',
    imageUrl: 'https://images.unsplash.com/photo-1593560704563-f176a2eb61db?w=400',
    ingredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
    customizations: [
        {
            id: 'cust1', name: 'Crust', type: 'single', options: [
                {id: 'custopt1', name: 'Thin Crust', priceModifier: 0},
                {id: 'custopt2', name: 'Thick Crust', priceModifier: 1.5},
            ]
        },
        {
            id: 'cust2', name: 'Extra Toppings', type: 'multiple', options: [
                {id: 'custopt3', name: 'Extra Cheese', priceModifier: 2.0},
                {id: 'custopt4', name: 'Mushrooms', priceModifier: 1.0},
            ]
        }
    ],
    stockItemId: 'inv1',
    stockConsumption: 1,
  },
  {
    id: 'item2',
    name: 'Pepperoni Pizza',
    price: 10.50,
    categoryId: 'cat1',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    ingredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Pepperoni'],
    stockItemId: 'inv1',
    stockConsumption: 1,
  },
  // Pastas
  {
    id: 'item3',
    name: 'Spaghetti Carbonara',
    price: 12.00,
    categoryId: 'cat2',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e326b20f58dd?w=400',
    ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Parmesan'],
    stockItemId: 'inv6',
    stockConsumption: 0.2,
  },
   // Drinks
  {
    id: 'item4',
    name: 'Coca-Cola',
    price: 2.00,
    categoryId: 'cat4',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32a2ea7?w=400',
    ingredients: [],
    stockItemId: 'inv7',
    stockConsumption: 1,
  },
  {
    id: 'item7',
    name: 'Fanta',
    price: 2.00,
    categoryId: 'cat4',
    imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
    ingredients: [],
    stockItemId: 'inv9',
    stockConsumption: 1,
  },
  {
    id: 'item8',
    name: 'Sprite',
    price: 2.00,
    categoryId: 'cat4',
    imageUrl: 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=400',
    ingredients: [],
    stockItemId: 'inv10',
    stockConsumption: 1,
  },
  {
    id: 'item9',
    name: 'Agua',
    price: 2.00,
    categoryId: 'cat4',
    imageUrl: 'https://images.unsplash.com/photo-1550411291-d2b4de425c7b?w=400',
    ingredients: [],
    stockItemId: 'inv11',
    stockConsumption: 1,
  },
  {
    id: 'item10',
    name: 'Cerveza',
    price: 3.00,
    categoryId: 'cat4',
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
    ingredients: [],
    stockItemId: 'inv12',
    stockConsumption: 1,
  },
  {
    id: 'item11',
    name: 'Vino de la casa',
    price: 3.00,
    categoryId: 'cat4',
    imageUrl: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1a?w=400',
    ingredients: [],
    stockItemId: 'inv13',
    stockConsumption: 0.15,
  },
  // Desserts
  {
    id: 'item5',
    name: 'Tiramisu',
    price: 6.00,
    categoryId: 'cat5',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    ingredients: ['Ladyfingers', 'Coffee', 'Mascarpone', 'Cocoa'],
    stockItemId: 'inv8',
    stockConsumption: 1,
  },
   // Salads
  {
    id: 'item6',
    name: 'Caesar Salad',
    price: 7.50,
    categoryId: 'cat3',
    imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400',
    ingredients: ['Lettuce', 'Croutons', 'Parmesan', 'Caesar Dressing'],
    stockItemId: 'inv5',
    stockConsumption: 0.5,
  }
];

export const mockWaiters: Waiter[] = [
  { id: 'waiter1', name: 'Alice' },
  { id: 'waiter2', name: 'Bob' },
  { id: 'waiter3', name: 'Charlie' },
  { id: 'waiter4', name: 'Diana' },
];