import type { Product, Order } from './types';

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Blouse en Soie "Aria"',
    description: 'Une blouse en soie luxueuse avec une coupe fluide et des détails de volants délicats. Parfaite pour une journée au bureau ou une soirée élégante.',
    price: 129.99,
    category: 'Tops',
    imageId: 'product-1',
    slug: 'blouse-soie-aria'
  },
  {
    id: 'prod_2',
    name: 'Jean Skinny "Leo"',
    description: 'Notre jean skinny le plus vendu, conçu pour épouser et flatter vos formes. Fabriqué à partir d\'un denim stretch de première qualité pour un confort qui dure toute la journée.',
    price: 89.99,
    category: 'Pantalons',
    imageId: 'product-2',
    slug: 'jean-skinny-leo'
  },
  {
    id: 'prod_3',
    name: 'Sac à Main "Stella"',
    description: 'Le compagnon idéal pour toutes les occasions. Le sac Stella est fabriqué en cuir végétalien souple et dispose de plusieurs compartiments pour garder vos essentiels organisés.',
    price: 149.99,
    category: 'Accessoires',
    imageId: 'product-3',
    slug: 'sac-main-stella'
  },
  {
    id: 'prod_4',
    name: 'Robe d\'Été "Luna"',
    description: 'Légère et aérienne, la robe Luna est votre indispensable pour les journées ensoleillées. Elle présente un imprimé floral vibrant et une taille cintrée flatteuse.',
    price: 79.99,
    category: 'Robes',
    imageId: 'product-4',
    slug: 'robe-ete-luna'
  },
  {
    id: 'prod_5',
    name: 'Baskets "Orion"',
    description: 'Alliez confort et style avec les baskets Orion. Dotées d\'une semelle intérieure coussinée et d\'un design minimaliste et élégant, elles sont parfaites pour un usage quotidien.',
    price: 119.99,
    category: 'Chaussures',
    imageId: 'product-5',
    slug: 'baskets-orion'
  },
  {
    id: 'prod_6',
    name: 'Pull en Cachemire "Kai"',
    description: 'Offrez-vous la douceur inégalée du cachemire. Le pull Kai a une coupe classique et se décline dans une gamme de couleurs intemporelles.',
    price: 199.99,
    category: 'Tops',
    imageId: 'product-6',
    slug: 'pull-cachemire-kai'
  },
  {
    id: 'prod_7',
    name: 'Jupe Midi Plissée "Clara"',
    description: 'Ajoutez une touche de sophistication à votre garde-robe. La jupe Clara présente des plis nets et un mouvement magnifique. À porter avec un chemisier ou un simple t-shirt.',
    price: 69.99,
    category: 'Pantalons',
    imageId: 'product-7',
    slug: 'jupe-midi-clara'
  },
  {
    id: 'prod_8',
    name: 'Collier Pendentif "Celeste"',
    description: 'Une pièce délicate et magnifique. Le collier Celeste est orné d\'un pendentif scintillant serti de zircons cubiques sur une fine chaîne en argent sterling.',
    price: 59.99,
    category: 'Accessoires',
    imageId: 'product-8',
    slug: 'collier-pendentif-celeste'
  },
  {
    id: 'prod_9',
    name: 'Trench-Coat "London"',
    description: 'Le vêtement d\'extérieur par excellence. Le trench-coat London est confectionné dans un tissu résistant à l\'eau et présente tous les détails classiques pour un look intemporel.',
    price: 249.99,
    category: 'Vestes',
    imageId: 'product-9',
    slug: 'trench-coat-london'
  },
  {
    id: 'prod_10',
    name: 'Pantalon Large "Paloma"',
    description: 'Confort chic. Le pantalon Paloma est taillé dans un tissu fluide et présente une silhouette large et flatteuse. Idéal pour se détendre avec style.',
    price: 79.99,
    category: 'Pantalons',
    imageId: 'product-10',
    slug: 'pantalon-large-paloma'
  },
  {
    id: 'prod_11',
    name: 'Blazer "Blake"',
    description: 'Affirmez votre style avec le blazer Blake. Coupe impeccable, épaules structurées et fermeture à un seul bouton pour un look moderne et puissant.',
    price: 179.99,
    category: 'Vestes',
    imageId: 'product-11',
    slug: 'blazer-blake'
  },
  {
    id: 'prod_12',
    name: 'Lunettes de Soleil "Ivy"',
    description: 'Protégez vos yeux avec style. Les lunettes de soleil Ivy arborent une monture œil-de-chat audacieuse et des verres offrant une protection UV à 100%.',
    price: 89.99,
    category: 'Accessoires',
    imageId: 'product-12',
    slug: 'lunettes-soleil-ivy'
  },
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
