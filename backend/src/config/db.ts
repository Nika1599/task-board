import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar';

export const initMongoDB = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');
    const mongoUri = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;

    console.log('Connecting to MongoDB at:', mongoUri); // Для дебагу

    await mongoose.connect(mongoUri);
    console.log('MongoDB connection successfully established!');
  } catch (e) {
    console.error('Error while setting up mongo connection:', e);
    throw e;
  }
};
