module.exports = {
  apps: [
    {
      name: 'Info Screen API',
      script: 'infoScreenApi.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      cron_restart: '0 0 * * *', // Restart at midnight every day
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
     {
      name: 'Info Screen Frontend file server',
      script: 'infoScreenFrontend.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      cron_restart: '0 0 * * *', // Restart at midnight every day
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },

  ],
};
