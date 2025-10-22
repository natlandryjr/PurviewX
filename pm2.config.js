module.exports = {
  apps: [
    {
      name: 'web',
      script: 'serve',
      // Serve the built React app from the 'public' directory
      args: '-s public -l 3000',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
    },
    {
      name: 'api',
      script: './server/api.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: ['./server'],
    },
    {
      name: 'worker',
      script: './server/worker.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: ['./server'],
    },
  ],
};
