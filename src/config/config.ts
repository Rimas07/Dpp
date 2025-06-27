import { encrypt } from "src/utils/encrypt";

/* eslint-disable prettier/prettier */
export default () => ({
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
  security: {
    encryptionSecretKey: process.env.ENCRYPTION_KEY,
  },
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  server: {
    port: process.env.PORT || 3005,
  },
});