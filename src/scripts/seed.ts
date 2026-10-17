require('dotenv').config();
const { seedUsers } = require('../lib/mongodb/seed/seedUsers');

async function seed() {
  try {
    console.log('Starting database seeding...');
    await seedUsers();
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seed(); 