import * as mongoose from "mongoose";

before(() => {
  return (mongoose as any).connect("mongodb://localhost/mongoose-model", {
    promiseLibrary: global.Promise,
    useNewUrlParser: true,
  });
});

after(() => {
  mongoose.disconnect();
});
