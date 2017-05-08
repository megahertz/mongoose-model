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
  let properties = cls._meta.properties;

  if (options) {
    cls._meta.schemaOptions = options;
  }

  properties = Object.keys(properties).reduce((result, key) => {
    result[key] = initProp(key, properties[key], constructor);
    return result;
  }, {});

  cls._schema = new Schema(properties);
  cls._Model = mongooseModel(name, cls._schema);
  cls.initSchema();
}

function initProp(name: string, options: any, constructor: typeof Model) {
  const result = Object.assign({}, options);
  if (options.ref) {
    result.ref = options.ref.name;
  }

  Object.defineProperty(constructor.prototype, name, {
    configurable: true,
    enumerable: true,
    get() {
      const doc = this._document;
      const value = doc ? doc[name] : undefined;

      if (options.ref && value) {
        return new options.ref(value);
      }

      return value;
    },
    set(value: any) {
      if (!this._document) {
        return;
      }

      this._document[name] = value;
    },
  });

  return result;
}
