import Model, { IMeta } from '../Model';

export default function prop(model: Model, key: string): void;
export default function prop(cfg: any): (model: Model, key: string) => void;
export default function prop(modelOrCfg: Model | any, key?: string) {
  // normal decorator
  if (modelOrCfg instanceof Model) {
    addProp(modelOrCfg, key);
    return;
  }

  // decorator with arguments
  return (model: Model, propKey: string) => {
    addProp(model, propKey, modelOrCfg);
  };
}

/**
 * Add a property to the model schema
 */
export function addProp(model: Model, key: string, cfg: object = {}) {
  const meta: IMeta = (model.constructor as any).initMeta();

  if (meta.properties[key]) {
    Object.assign(meta.properties[key], cfg);
  } else {
    meta.properties[key] = cfg;
  }
}
