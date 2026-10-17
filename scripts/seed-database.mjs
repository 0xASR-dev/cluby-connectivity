import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

// MongoDB connection string
const uri = 'mongodb+srv://Singh:4DrhdSXblcVKPMYF@cluby.tkfcyvx.mongodb.net/cluby?retryWrites=true&w=majority&appName=cluby';

// Sample data
const sampleClubs = [
  {
    _id: new ObjectId(),
    name: "Programming Club",
    description: "A community of coding enthusiasts",
    logo_url: "/placeholder.svg",
    objectives: "Learn and grow together through coding projects",
    status: "approved",
    representative_id: new ObjectId(),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new ObjectId(),
    name: "Photography Club",
    description: "Capturing moments that matter",
    logo_url: "/placeholder.svg",
    objectives: "Develop photography skills and showcase talent",
    status: "approved",
    representative_id: new ObjectId(),
    created_at: new Date(),
    updated_at: new Date()
  }
];

const sampleUsers = [
  {
    _id: new ObjectId(),
    email: "admin@cluby.com",
    password: "hashed_password_here", // In production, this should be properly hashed
    role: "admin",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new ObjectId(),
    email: "student@cluby.com",
    password: "hashed_password_here",
    role: "student",
    created_at: new Date(),
    updated_at: new Date()
  }
];

const sampleProfiles = [
  {
    _id: new ObjectId(),
    user_id: sampleUsers[0]._id,
    full_name: "Admin User",
    username: "admin",
    avatar_url: "/placeholder.svg",
    department: "Administration",
    year: "2024",
    bio: "System Administrator",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: new ObjectId(),
    user_id: sampleUsers[1]._id,
    full_name: "Student User",
    username: "student",
    avatar_url: "/placeholder.svg",
    department: "Computer Science",
    year: "2024",
    bio: "Student Member",
    created_at: new Date(),
    updated_at: new Date()
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Create collections and insert data
    console.log('\n📝 Creating collections and inserting data...');
    
    // Create User collection
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      role: String,
      created_at: Date,
      updated_at: Date
    }));
    
    // Create Profile collection
    const Profile = mongoose.model('Profile', new mongoose.Schema({
      user_id: mongoose.Schema.Types.ObjectId,
      full_name: String,
      username: String,
      avatar_url: String,
      department: String,
      year: String,
      bio: String,
      created_at: Date,
      updated_at: Date
    }));
    
    // Create Club collection
    const Club = mongoose.model('Club', new mongoose.Schema({
      name: String,
      description: String,
      logo_url: String,
      objectives: String,
      status: String,
      representative_id: mongoose.Schema.Types.ObjectId,
      created_at: Date,
      updated_at: Date
    }));

    // Clear existing data
    console.log('\n🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Club.deleteMany({})
    ]);

    // Insert new data
    console.log('\n📥 Inserting sample data...');
    const [users, profiles, clubs] = await Promise.all([
      User.insertMany(sampleUsers),
      Profile.insertMany(sampleProfiles),
      Club.insertMany(sampleClubs)
    ]);

    console.log('\n✅ Database seeded successfully!');
    console.log(`- ${users.length} users created`);
    console.log(`- ${profiles.length} profiles created`);
    console.log(`- ${clubs.length} clubs created`);

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
  }
}

seedDatabase(); 