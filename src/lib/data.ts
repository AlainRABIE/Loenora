import type { Product, Order } from './types';

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'W Jacket',
    description: 'Une veste élégante et moderne, disponible en plusieurs couleurs. Parfaite pour toutes les saisons.',
    price: 45,
    originalPrice: 52,
    category: 'Vestes',
    imageId: 'product-1',
    slug: 'w-jacket',
    colors: ['Noir', 'Bleu Marine', 'Gris', 'Bordeaux', 'Vert Forêt'],
  },
  {
    id: 'prod_2',
    name: 'Capes jacket',
    description: 'Une cape jacket chic et polyvalente, idéale pour superposer vos tenues avec style.',
    price: 85,
    category: 'Vestes',
    imageId: 'product-9',
    slug: 'capes-jacket',
    colors: ['Noir', 'Camel', 'Gris chiné'],
  }
];

export const orders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    date: '2023-10-26',
    total: 219.98,
    status: 'Shipped',
    items: [
      { id: 'prod_3', name: 'Sac à Main "Stella"', price: 149.99, quantity: 1, imageId: 'product-3', slug: 'sac-main-stella' },
      { id: 'prod_4', name: 'Robe d\'Été "Luna"', price: 79.99, quantity: 1, imageId: 'product-4', slug: 'robe-ete-luna' },
    ],
  },
  {
    id: 'ORD-002',
    customerName: 'Bob Williams',
    customerEmail: 'bob@example.com',
    date: '2023-10-25',
    total: 129.99,
    status: 'Delivered',
    items: [
      { id: 'prod_1', name: 'Blouse en Soie "Aria"', price: 129.99, quantity: 1, imageId: 'product-1', slug: 'blouse-soie-aria' },
    ],
  },
  {
    id: 'ORD-003',
    customerName: 'Charlie Brown',
    customerEmail: 'charlie@example.com',
    date: '2023-10-24',
    total: 129.98,
    status: 'Processing',
    items: [
      { id: 'prod_7', name: 'Jupe Midi Plissée "Clara"', price: 69.99, quantity: 1, imageId: 'product-7', slug: 'jupe-midi-clara' },
      { id: 'prod_8', name: 'Collier Pendentif "Celeste"', price: 59.99, quantity: 1, imageId: 'product-8', slug: 'collier-pendentif-celeste' },
    ],
  },
    {
    id: 'ORD-004',
    customerName: 'Diana Prince',
    customerEmail: 'diana@example.com',
    date: '2023-10-23',
    total: 209.98,
    status: 'Delivered',
    items: [
      { id: 'prod_2', name: 'Jean Skinny "Leo"', price: 89.99, quantity: 1, imageId: 'product-2', slug: 'jean-skinny-leo' },
      { id: 'prod_5', name: 'Baskets "Orion"', price: 119.99, quantity: 1, imageId: 'product-5', slug: 'baskets-orion' },
    ],
  },
  {
    id: 'ORD-005',
    customerName: 'Ethan Hunt',
    customerEmail: 'ethan@example.com',
    date: '2023-10-22',
    total: 329.98,
    status: 'Pending',
    items: [
      { id: 'prod_10', name: 'Pantalon Large "Paloma"', price: 79.99, quantity: 1, imageId: 'product-10', slug: 'pantalon-large-paloma' },
      { id: 'prod_9', name: 'Trench-Coat "London"', price: 249.99, quantity: 1, imageId: 'product-9', slug: 'trench-coat-london' },
    ],
  },
    {
    id: 'ORD-006',
    customerName: 'Fiona Glenanne',
    customerEmail: 'fiona@example.com',
    date: '2023-10-21',
    total: 269.98,
    status: 'Cancelled',
    items: [
      { id: 'prod_11', name: 'Blazer "Blake"', price: 179.99, quantity: 1, imageId: 'product-11', slug: 'blazer-blake' },
      { id: 'prod_12', name: 'Lunettes de Soleil "Ivy"', price: 89.99, quantity: 1, imageId: 'product-12', slug: 'lunettes-soleil-ivy' },
    ],
  },
];
