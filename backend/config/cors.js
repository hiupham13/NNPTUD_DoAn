const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://godteam.software',
    'https://www.godteam.software',
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

module.exports = corsOptions;
