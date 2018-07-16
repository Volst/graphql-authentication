import 'reflect-metadata';
import { createConnection } from 'typeorm';

export { User } from './entities/User';

createConnection();
