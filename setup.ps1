# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..."
    @"
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cluby
JWT_SECRET=your-super-secret-jwt-key
VITE_API_URL=http://localhost:3000
VITE_APP_URL=http://localhost:5173
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host ".env file created successfully!"
} else {
    Write-Host ".env file already exists"
}

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Update MongoDB URI
Write-Host "Updating MongoDB configuration..."
npx ts-node src/scripts/update-env.ts

# Check MongoDB connection
Write-Host "Checking MongoDB connection..."
try {
    $connection = New-Object System.Net.Sockets.TcpClient("cluby-cluster.a6odmyp.mongodb.net", 27017)
    if ($connection.Connected) {
        Write-Host "MongoDB Atlas connection successful"
    }
    $connection.Close()
} catch {
    Write-Host "Note: Using MongoDB Atlas cluster - no local connection required"
}

# Start the development server
Write-Host "Starting development server..."
npm run dev:all 