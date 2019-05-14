import Model from '../Model';
import { addProp } from './prop';

export default function ref(model: Model, key: string): void;
export default function ref(ref: any): (model: Model, key: string) => void;
export default function ref(modelOrRef: Model | any, key?: string) {
  // normal decorator
  if (modelOrRef instanceof Model) {
    addProp(modelOrRef, key, { ref: true });
    return;
  }

  // decorator with arguments
  return (model: Model, propKey: string) => {
    addProp(model, propKey, { ref: true, ...modelOrRef });
  };
}
