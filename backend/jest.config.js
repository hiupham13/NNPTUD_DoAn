module.exports = {
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'unit',
      testMatch: ['**/tests/unit/**/*.test.js'],
      // Unit Test: KHÔNG cần MongoDB, chạy nhanh bằng Jest Mock
    },
    {
      displayName: 'integration',
      testMatch: ['**/tests/integration/**/*.test.js'],
      setupFilesAfterEnv: ['./tests/setup.js'],
      // Integration Test: Cần MongoDB Memory Server
    },
  ],
};
