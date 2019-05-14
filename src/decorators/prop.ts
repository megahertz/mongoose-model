import { SchemaTypeOpts } from 'mongoose';
import Model from '../Model';
import { IMeta } from '../types';

export default function prop(model: Model, key: string);
export default function prop<T extends any>(cfg: SchemaTypeOpts<T>);
export default function prop<T extends any>(
  modelOrCfg: Model | SchemaTypeOpts<T>,
  key?: string,
) {
  // normal decorator
  if (modelOrCfg instanceof Model) {
    addProp<T>(modelOrCfg, key);
    return;
  }

  // decorator with arguments
  return (model: Model, propKey: string) => {
    addProp<T>(model, propKey, modelOrCfg);
  };
}

/**
 * Add a property to the model schema
 */
export function addProp<T>(
  model: Model,
  key: string,
  cfg: SchemaTypeOpts<T> = {},
) {
  const meta: IMeta = (model.constructor as any).initMeta();

  if (meta.properties[key]) {
    Object.assign(meta.properties[key], cfg);
  } else {
    meta.properties[key] = cfg;
  }
}
