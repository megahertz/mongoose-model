import { Schema } from "mongoose";
import "reflect-metadata";
import Model from "../Model";

const transformers = [
  def,
  type,
  getSet,
  ref,
  subdoc,
  nested,
];

export default transformers;

export function transformProperties(model: Model, properties: object) {
  for (const i in properties) {
    if (!properties.hasOwnProperty(i)) continue;

    for (const transformer of transformers) {
      properties[i] = transformer(model, i, properties[i]);
    }
  }

  return properties;
}

function def(model: Model, key: string, cfg: any) {
  if (!cfg.default) return cfg;

  if (cfg.default.prototype instanceof Model) {
    const modelConstructor = cfg.default;
    cfg.default = () => new modelConstructor();
  }

  return cfg;
}

function getSet(model: Model, key: string, cfg: any) {
  Object.defineProperty(model, key, {
    configurable: true,
    enumerable: true,
    get() {
      return this.get && this.get(key);
    },
    set(value: any) {
      return this.set && this.set(key, value);
    },
  });

  return cfg;
}

function nested(model: Model, key: string, cfg: any) {
  if (!cfg._nested) return cfg;

  delete cfg.type;
  delete cfg._nested;

  return cfg;
}

function ref(model: Model, key: string, cfg: any) {
  if (!cfg.ref) return cfg;

  if (cfg.ref === true) {
    if (!cfg.type) {
      const name = (model.constructor as any)._meta.name;
      throw new Error(
        "It seems that your code has circular references. In this case " +
        `${name}.${key} reference should be decorated explicitly:  ` +
        `@ref('Model') ${key}: Model instead of @ref ${key}: Model. ` +
        `Unfortunately, typescript doesn't support circular ` +
        "references between classes with decorators. " +
        "https://github.com/Microsoft/TypeScript/issues/4521",
      );
    }

    cfg.ref = cfg.type;
  }

  if (cfg.ref.name) {
    cfg.ref = cfg.ref.name;
  }

  cfg.type = Schema.Types.ObjectId;

  return cfg;
}

function subdoc(model: Model, key: string, cfg: any) {
  if (!cfg._subdoc) return cfg;

  if (cfg._subdoc === true) {
    cfg._subdoc = cfg.type;
  }

  const schema = cfg._subdoc._schema || new Schema(cfg._subdoc);
  delete cfg._subdoc;

  cfg.type = cfg.type === Array ? [schema] : schema;

  return cfg;
}

function type(model: Model, key: string, cfg: any) {
  if (cfg.type) return cfg;

  cfg.type = Reflect.getMetadata("design:type", model, key);

  if (cfg.type || cfg.ref) {
    return cfg;
  }

  const name = (model.constructor as any)._meta.name;
  throw new Error(
    `Type of ${name}.${key} isn't set. If you use typescript ` +
    "you need to enable emitDecoratorMetadata in tsconfig.json",
  );
}
