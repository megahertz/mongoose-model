import Model from '../Model';
import { addProp } from './prop';

export default function ref(model: Model, key: string);
export default function ref(ref: IRef);
export default function ref(modelOrRef: Model | IRef, key?: string) {
  // normal decorator
  if (modelOrRef instanceof Model) {
    addProp(modelOrRef, key, { ref: true });
    return;
  }

  // decorator with arguments
  return (model: Model, propKey: string) => {
    if (typeof modelOrRef === 'string') {
      modelOrRef = { ref: modelOrRef };
    }

    addProp(model, propKey, { ref: true, ...modelOrRef });
  };
}

type IRef = string | {
  ref?: (new(...args: any[]) => any) | string;
  type?: any;
};
