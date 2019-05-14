import { SchemaDefinition } from 'mongoose';
import Model from '../Model';
import { addProp } from './prop';

export default function subdoc(model: Model, key: string);
export default function subdoc(cfg: SchemaDefinition | any);
export default function subdoc(modelOrCfg: Model | any, key?: string) {
  // normal decorator
  if (modelOrCfg instanceof Model) {
    addProp(modelOrCfg, key, { _subdoc: true });
    return;
  }

  // decorator with arguments
  return (model: Model, propKey: string) => {
    addProp(model, propKey, { _subdoc: modelOrCfg });
  };
}
