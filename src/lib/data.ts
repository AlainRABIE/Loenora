import type { Product, Order } from './types';

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Aether-Watch Pro',
    description: 'Experience the future on your wrist. With a stunning edge-to-edge display and a suite of health sensors, the Aether-Watch Pro is your ultimate daily companion. Tracks everything from your heart rate to your sleep patterns.',
    price: 399.99,
    category: 'Electronics',
    imageId: 'product-1',
    slug: 'aether-watch-pro'
  },
  {
    id: 'prod_2',
    name: 'SonicWave Headphones',
    description: 'Immerse yourself in pure, high-fidelity sound. The SonicWave headphones feature active noise cancellation, a 30-hour battery life, and a crystal-clear microphone for calls. Perfect for music lovers and professionals alike.',
    price: 249.99,
    category: 'Electronics',
    imageId: 'product-2',
    slug: 'sonicwave-headphones'
  },
  {
    id: 'prod_3',
    name: 'Nomad Urban Backpack',
    description: 'The perfect blend of style and function. The Nomad Urban Backpack is crafted from water-resistant materials, featuring multiple compartments, a padded laptop sleeve, and an anti-theft pocket. Your ideal partner for city adventures.',
    price: 129.99,
    category: 'Apparel',
    imageId: 'product-3',
    slug: 'nomad-urban-backpack'
  },
  {
    id: 'prod_4',
    name: 'Zenith Tech-Fleece',
    description: 'Stay warm without the bulk. The Zenith Tech-Fleece is made from a revolutionary lightweight fabric that provides exceptional warmth and breathability. Its modern, athletic cut ensures you look sharp and feel comfortable.',
    price: 89.99,
    category: 'Apparel',
    imageId: 'product-4',
    slug: 'zenith-tech-fleece'
  },
  {
    id: 'prod_5',
    name: 'Strider-Lite Sneakers',
    description: 'Engineered for comfort, designed for life. The Strider-Lite sneakers feature a cushioned sole and a breathable mesh upper, making them perfect for all-day wear. From your morning commute to a night out, they\'ve got you covered.',
    price: 119.99,
    category: 'Apparel',
    imageId: 'product-5',
    slug: 'strider-lite-sneakers'
  },
  {
    id: 'prod_6',
    name: 'Artisan Ceramic Mug',
    description: 'Elevate your coffee ritual. Each Artisan Ceramic Mug is handcrafted by skilled potters, featuring a unique glaze and a comfortable, ergonomic handle. A small piece of art for your daily routine.',
    price: 29.99,
    category: 'Home Goods',
    imageId: 'product-6',
    slug: 'artisan-ceramic-mug'
  },
  {
    id: 'prod_7',
    name: 'Lumina Smart Bulbs',
    description: 'Set the perfect mood for any occasion. Lumina Smart Bulbs offer millions of colors and shades of white, all controllable from your smartphone or voice assistant. Easy to set up, and even easier to enjoy.',
    price: 49.99,
    category: 'Electronics',
    imageId: 'product-7',
    slug: 'lumina-smart-bulbs'
  },
  {
    id: 'prod_8',
    name: 'SoundBlock Go Speaker',
    description: 'Big sound that fits in your hand. The SoundBlock Go is a rugged, waterproof Bluetooth speaker that delivers impressive audio quality. With a 12-hour battery, it’s ready for any adventure.',
    price: 79.99,
    category: 'Electronics',
    imageId: 'product-8',
    slug: 'soundblock-go-speaker'
  },
  {
    id: 'prod_9',
    name: 'Evernote Leather Journal',
    description: 'Capture your thoughts in style. The Evernote Leather Journal is bound in genuine full-grain leather and filled with high-quality, acid-free paper. It lies flat for a seamless writing experience.',
    price: 39.99,
    category: 'Home Goods',
    imageId: 'product-9',
    slug: 'evernote-leather-journal'
  },
  {
    id: 'prod_10',
    name: 'ErgoForm Office Chair',
    description: 'Support your body, boost your productivity. The ErgoForm chair features fully adjustable lumbar support, armrests, and seat depth, all designed to promote healthy posture through the longest workdays.',
    price: 349.99,
    category: 'Home Goods',
    imageId: 'product-10',
    slug: 'ergoform-office-chair'
  },
  {
    id: 'prod_11',
    name: 'Raptor-X Gaming Mouse',
    description: 'Precision and speed at your fingertips. The Raptor-X boasts a 16,000 DPI optical sensor, customizable RGB lighting, and programmable buttons. Gain the competitive edge you need to win.',
    price: 69.99,
    category: 'Electronics',
    imageId: 'product-11',
    slug: 'raptor-x-gaming-mouse'
  },
  {
    id: 'prod_12',
    name: 'Eclipse Aviator Sunglasses',
    description: 'Timeless style meets modern technology. The Eclipse Aviators feature polarized lenses that reduce glare and provide 100% UV protection, all set in a lightweight yet durable metal frame.',
    price: 149.99,
    category: 'Apparel',
    imageId: 'product-12',
    slug: 'eclipse-aviator-sunglasses'
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
      { id: 'prod_3', name: 'Nomad Urban Backpack', price: 129.99, quantity: 1, imageId: 'product-3', slug: 'nomad-urban-backpack' },
      { id: 'prod_4', name: 'Zenith Tech-Fleece', price: 89.99, quantity: 1, imageId: 'product-4', slug: 'zenith-tech-fleece' },
    ],
  },
  {
    id: 'ORD-002',
    customerName: 'Bob Williams',
    customerEmail: 'bob@example.com',
    date: '2023-10-25',
    total: 399.99,
    status: 'Delivered',
    items: [
      { id: 'prod_1', name: 'Aether-Watch Pro', price: 399.99, quantity: 1, imageId: 'product-1', slug: 'aether-watch-pro' },
    ],
  },
  {
    id: 'ORD-003',
    customerName: 'Charlie Brown',
    customerEmail: 'charlie@example.com',
    date: '2023-10-24',
    total: 109.98,
    status: 'Processing',
    items: [
      { id: 'prod_7', name: 'Lumina Smart Bulbs', price: 49.99, quantity: 1, imageId: 'product-7', slug: 'lumina-smart-bulbs' },
      { id: 'prod_8', name: 'SoundBlock Go Speaker', price: 79.99, quantity: 1, imageId: 'product-8', slug: 'soundblock-go-speaker' },
    ],
  },
    {
    id: 'ORD-004',
    customerName: 'Diana Prince',
    customerEmail: 'diana@example.com',
    date: '2023-10-23',
    total: 369.98,
    status: 'Delivered',
    items: [
      { id: 'prod_2', name: 'SonicWave Headphones', price: 249.99, quantity: 1, imageId: 'product-2', slug: 'sonicwave-headphones' },
      { id: 'prod_5', name: 'Strider-Lite Sneakers', price: 119.99, quantity: 1, imageId: 'product-5', slug: 'strider-lite-sneakers' },
    ],
  },
  {
    id: 'ORD-005',
    customerName: 'Ethan Hunt',
    customerEmail: 'ethan@example.com',
    date: '2023-10-22',
    total: 389.98,
    status: 'Pending',
    items: [
      { id: 'prod_10', name: 'ErgoForm Office Chair', price: 349.99, quantity: 1, imageId: 'product-10', slug: 'ergoform-office-chair' },
      { id: 'prod_9', name: 'Evernote Leather Journal', price: 39.99, quantity: 1, imageId: 'product-9', slug: 'evernote-leather-journal' },
    ],
  },
    {
    id: 'ORD-006',
    customerName: 'Fiona Glenanne',
    customerEmail: 'fiona@example.com',
    date: '2023-10-21',
    total: 219.98,
    status: 'Cancelled',
    items: [
      { id: 'prod_11', name: 'Raptor-X Gaming Mouse', price: 69.99, quantity: 1, imageId: 'product-11', slug: 'raptor-x-gaming-mouse' },
      { id: 'prod_12', name: 'Eclipse Aviator Sunglasses', price: 149.99, quantity: 1, imageId: 'product-12', slug: 'eclipse-aviator-sunglasses' },
    ],
  },
];
