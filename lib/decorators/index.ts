import { SchemaTypeOpts } from 'mongoose';
import Model from '../Model';
import { addProp } from './prop';

export default function index(model: Model, key: string);
export default function index(cfg: IIndexCfg);
export default function index(modelOrRef: Model | IIndexCfg, key?: string) {
  // normal decorator
  if (modelOrRef instanceof Model) {
    addProp(modelOrRef, key, { index: true });
    return;
  }

  // decorator with arguments
  return (model: Model, propKey: string) => {
    addProp(model, propKey, { index: modelOrRef });
  };
}

type IIndexCfg = SchemaTypeOpts.IndexOpts | boolean | string;
