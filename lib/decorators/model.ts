import { model as mongooseModel, Schema, SchemaOptions } from 'mongoose';
import Model, { IMeta } from '../Model';
import { transformProperties } from './propertyTransformers';

export default function model(constructor: typeof Model);
export default function model(options: SchemaOptions);
export default function model(constructorOrCfg: typeof Model | SchemaOptions) {
  // normal decorator
  if (typeof constructorOrCfg === 'function') {
    initializeModel(constructorOrCfg as any);
    return;
  }

  // decorator with arguments
  return (constructor: typeof Model) => {
    initializeModel(constructor, constructorOrCfg);
  };
}

function initializeModel(constructor: typeof Model, cfg?: SchemaOptions) {
  const cls = constructor as any;
  const meta: IMeta = cls.initMeta();

  meta.schemaOptions = cfg;
  meta.properties = transformProperties(constructor.prototype, meta.properties);

  cls._schema = cls.initSchema(meta);

  cls._Model = mongooseModel(meta.name, cls._schema);
  cls._Model._OuterModel = cls;
}
