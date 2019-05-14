import { SchemaDefinition } from 'mongoose';
import Model from '../Model';
import { addProp } from './prop';

export default function nested(cfg: SchemaDefinition) {
  return (model: Model, propKey: string) => {
    addProp(model, propKey, { ...cfg, _nested: true });
  };
}
