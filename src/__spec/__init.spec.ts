import { afterAll, beforeAll } from 'humile';
import * as mongoose from 'mongoose';

beforeAll(() => {
  return (mongoose as any).connect('mongodb://localhost/mongoose-model', {
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
  });
});

afterAll(() => {
  mongoose.disconnect();
});
