#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cluby
JWT_SECRET=your-super-secret-jwt-key
VITE_API_URL=http://localhost:3000
VITE_APP_URL=http://localhost:5173
EOL
    echo ".env file created successfully!"
else
    echo ".env file already exists"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Update MongoDB URI
echo "Updating MongoDB configuration..."
npx ts-node src/scripts/update-env.ts

# Check MongoDB connection
echo "Checking MongoDB connection..."
if nc -z cluby-cluster.a6odmyp.mongodb.net 27017 2>/dev/null; then
    echo "MongoDB Atlas connection successful"
else
    echo "Note: Using MongoDB Atlas cluster - no local connection required"
fi

# Start the development server
echo "Starting development server..."
npm run dev:all 