import { model as mongooseModel, Schema } from "mongoose";
import Model from "../Model";

export default function model(constructor: typeof Model);
export default function model(options: object);
export default function model(constructorOrOptions: typeof Model|object) {
  if (typeof constructorOrOptions === "function") {
    initializeModel(constructorOrOptions);
    return;
  }

  const options = constructorOrOptions;
  return (constructor: typeof Model) => {
    initializeModel(constructor, options);
  };
}

function initializeModel(constructor: typeof Model, options?: any) {
  const cls = constructor as any;
  const name: string = cls.name;

  if (options) {
    cls._meta.schemaOptions = options;
  }

  Object.keys(cls._meta.properties).forEach((propertyKey) => {
    Object.defineProperty(constructor.prototype, propertyKey, {
      configurable: true,
      enumerable: true,
      get() {
        const doc = this._document;
        return doc ? doc[propertyKey] : undefined;
      },
      set(value: any) {
        if (!this._document) {
          return;
        }

        this._document[propertyKey] = value;
      },
    });
  });

  cls._schema = new Schema(cls._meta.properties);
  cls._Model = mongooseModel(name, cls._schema);
  cls.initSchema();
}
