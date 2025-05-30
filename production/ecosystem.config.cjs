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
      name: 'Info Screen Frontend  server',
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
      {
      name: 'Info Screen Frontend Svelte server',
      script: 'infoScreenFrontendSvelte.js',
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
      name: 'Info Screen rooms management server',
      script: 'roomsmanagement.js',
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
      name: 'Info Screen Api',
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
  ],
};
