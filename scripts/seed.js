const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env');
  process.exit(1);
}

// Define inline schemas for seeding to avoid TS compiling issues in a quick node script
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  fabric: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: { type: [String], required: true },
  description: { type: String, required: true },
  dimensions: { type: String, default: '' },
  careInstructions: { type: String, default: '' },
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const products = [
  {
    name: 'Amuraa Puffer Tote Bag',
    category: 'Puffer Tote Bags',
    fabric: 'Pink Leopard Print',
    price: 75,
    stock: 8,
    images: ['/images/products/tote_pink_leopard_1.jpg', '/images/products/tote_pink_leopard_2.jpg'],
    description: 'A spacious, cloud-soft quilted tote bag featuring a bold pink leopard print. Perfect for daily essentials, laptops, and market runs. Features a comfortable padded shoulder strap and a convenient inner zipper pocket.',
    dimensions: '14" H x 16" W x 4" D. Strap drop: 11"',
    careInstructions: 'Hand wash cold with mild detergent. Lay flat to dry. Do not iron or bleach.',
    isFeatured: true,
  },
  {
    name: 'Amuraa Puffer Tote Bag',
    category: 'Puffer Tote Bags',
    fabric: 'Mauve Check',
    price: 75,
    stock: 5,
    images: ['/images/products/tote_mauve_check_1.jpg', '/images/products/tote_mauve_check_2.jpg'],
    description: 'A cozy quilted puffer tote in a charming mauve check pattern. Offers light cushioning for your belongings and adds a stylish craft detail to any outfit.',
    dimensions: '14" H x 16" W x 4" D. Strap drop: 11"',
    careInstructions: 'Hand wash cold. Lay flat to dry.',
    isFeatured: true,
  },
  {
    name: 'Amuraa Puffer Tote Bag',
    category: 'Puffer Tote Bags',
    fabric: 'Pink Polka Dot',
    price: 75,
    stock: 3,
    images: ['/images/products/tote_pink_polka_1.jpg'],
    description: 'Playful and retro, this pink polka dot puffer tote brings a joyful vibe. Crafted with thick quilting and soft premium lining.',
    dimensions: '14" H x 16" W x 4" D. Strap drop: 11"',
    careInstructions: 'Hand wash cold. Lay flat to dry.',
    isFeatured: false,
  },
  {
    name: 'Amuraa Puffer Tote Bag',
    category: 'Puffer Tote Bags',
    fabric: 'Pink Gingham',
    price: 75,
    stock: 6,
    images: ['/images/products/tote_pink_gingham_1.jpg'],
    description: 'Classic cottage-core styling meets puffer function. Made from a lovely soft pink and cream gingham fabric, fully lined with pink pastel fabric.',
    dimensions: '14" H x 16" W x 4" D. Strap drop: 11"',
    careInstructions: 'Hand wash cold. Lay flat to dry.',
    isFeatured: false,
  },
  {
    name: 'Heart Print Mini Bag',
    category: 'Heart Print Mini Bags',
    fabric: 'Sweetheart Print',
    price: 58,
    stock: 4,
    images: ['/images/products/mini_heart_1.jpg', '/images/products/mini_heart_2.jpg'],
    description: 'An adorable mini bag detailed with heart-printed fabric and a feminine ruffle strap design. Fits your phone, keys, and lip gloss. Zippered top closures keep your essentials safe.',
    dimensions: '7" H x 9" W x 2" D. Strap drop: 8"',
    careInstructions: 'Hand wash cold. Spot clean ruffles carefully. Dry flat.',
    isFeatured: true,
  },
  {
    name: 'Striped Ruffle-Strap Shoulder Bag',
    category: 'Striped Ruffle-Strap Shoulder Bags',
    fabric: 'Blue & White Stripes',
    price: 62,
    stock: 7,
    images: ['/images/products/shoulder_striped_1.jpg', '/images/products/shoulder_striped_2.jpg'],
    description: 'A refreshing blue and white stripe shoulder bag with playful ruffled strap details. Perfectly quilted for structure and softness. A dreamy addition to summer strolls.',
    dimensions: '8" H x 11" W x 3" D. Strap drop: 10"',
    careInstructions: 'Hand wash cold. Lay flat to dry.',
    isFeatured: true,
  },
  {
    name: 'Amuraa AirPod Bag / Pouch',
    category: 'AirPod Bags / Small Pouches',
    fabric: 'Heart Print',
    price: 24,
    stock: 12,
    images: ['/images/products/pouch_heart_1.jpg'],
    description: 'Keep your AirPods or tiny items secure in this quilted mini pouch. Includes a small lobster clasp to hook onto your tote bag or belt loop.',
    dimensions: '4" H x 3.5" W x 1" D',
    careInstructions: 'Spot clean with a damp cloth.',
    isFeatured: false,
  },
  {
    name: 'Amuraa AirPod Bag / Pouch',
    category: 'AirPod Bags / Small Pouches',
    fabric: 'Leopard Print',
    price: 24,
    stock: 9,
    images: ['/images/products/pouch_leopard_1.jpg'],
    description: 'A fierce mini accessory! Perfect size for AirPods, keys, or spare change. Softly quilted with premium zip closure.',
    dimensions: '4" H x 3.5" W x 1" D',
    careInstructions: 'Spot clean with a damp cloth.',
    isFeatured: false,
  },
  {
    name: 'Handmade Makeup Pouch',
    category: 'Makeup Pouches',
    fabric: 'Floral Grey',
    price: 32,
    stock: 10,
    images: ['/images/products/makeup_floral_grey_1.jpg'],
    description: 'A stylish cosmetic bag in muted grey floral print. Generous flat-bottom design stands upright, making it easy to access your makeup. Quilted layer protects glass bottles.',
    dimensions: '5.5" H x 8" W x 4" D',
    careInstructions: 'Machine wash gentle cold in a mesh laundry bag. Lay flat to dry.',
    isFeatured: false,
  },
  {
    name: 'Handmade Makeup Pouch',
    category: 'Makeup Pouches',
    fabric: 'Leaf Print',
    price: 32,
    stock: 6,
    images: ['/images/products/makeup_leaf_1.jpg'],
    description: 'Bring nature to your vanity with this green leaf print makeup pouch. Offers ample room for brushes, moisturizers, and cosmetic tools.',
    dimensions: '5.5" H x 8" W x 4" D',
    careInstructions: 'Hand wash cold. Lay flat to dry.',
    isFeatured: false,
  },
  {
    name: 'Handmade Makeup Pouch',
    category: 'Makeup Pouches',
    fabric: 'Blue Gingham',
    price: 32,
    stock: 8,
    images: ['/images/products/makeup_blue_gingham_1.jpg'],
    description: 'Cute and highly functional. Blue and white gingham quilted pouch. Keeps your skincare and makeup organized in style.',
    dimensions: '5.5" H x 8" W x 4" D',
    careInstructions: 'Hand wash cold. Lay flat to dry.',
    isFeatured: false,
  },
  {
    name: 'Indigo Block-Print Organizer Pouch',
    category: 'Indigo Block-Print Organizer Pouches',
    fabric: 'Traditional Indigo Block-Print',
    price: 38,
    stock: 11,
    images: ['/images/products/organizer_indigo_1.jpg', '/images/products/organizer_indigo_2.jpg'],
    description: 'A gorgeous multi-purpose organizer quilted from traditional indigo block-printed cotton fabric. Features a secure zipper and multiple pockets inside to keep passports, chargers, or stationery neat.',
    dimensions: '6.5" H x 9.5" W x 2" D',
    careInstructions: 'Wash separately in cold water as indigo dye may bleed slightly in first wash. Lay flat to dry.',
    isFeatured: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding.');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Seed products
    const createdProducts = await Product.insertMany(products);
    console.log(`Successfully seeded ${createdProducts.length} products!`);

    // Create an Admin user if one does not exist
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@amuraa.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
    
    await User.deleteMany({ role: 'admin' });
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
      name: 'Amuraa Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      addresses: [{
        street: '123 Craft Lane',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302001',
        country: 'India',
        isDefault: true
      }]
    });
    
    await adminUser.save();
    console.log(`Admin user created: ${adminEmail}`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
