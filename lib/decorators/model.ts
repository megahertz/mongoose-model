import { model as mongooseModel, Schema } from "mongoose";
import Model from "../Model";

export default function model(constructor: typeof Model);
export default function model(options: object);
export default function model(constructorOrOptions: typeof Model | object) {
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

  cls._schema = new Schema(properties, cls._meta.schemaOptions);
  cls.initSchema();
  cls._Model = mongooseModel(name, cls._schema);
  cls._Model._OuterModel = cls;
}

function initProp(name: string, options: any, constructor: typeof Model) {
  const result = { ...options };

  if (options.ref) {
    // tslint:disable prefer-conditional-expression
    // noinspection SuspiciousTypeOfGuard
    if (typeof options.ref === "string") {
      result.ref = options.ref;
      options.ref = (mongooseModel(options.ref) as any)._OuterModel;
    } else {
      result.ref = options.ref.name;
    }

    result.type = Schema.Types.ObjectId;
  }

  Object.defineProperty(constructor.prototype, name, {
    configurable: true,
    enumerable: true,
    get() {
      return this.get && this.get(name);
    },
    set(value: any) {
      return this.set && this.set(name, value);
    },
  });

  return result;
}
