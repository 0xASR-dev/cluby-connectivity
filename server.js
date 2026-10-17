// Server loader
const { exec } = require('child_process');
const path = require('path');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('Starting server compilation and execution...');

// Use tsx to execute the TypeScript server file
const serverProcess = exec('npx tsx src/server.ts', { cwd: process.cwd() });

serverProcess.stdout.on('data', (data) => {
  console.log(data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.error(data.toString());
});

serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Received SIGINT signal, terminating server...');
  serverProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, terminating server...');
  serverProcess.kill();
  process.exit(0);
}); 