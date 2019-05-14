import Model from '../Model';
import { addProp } from './prop';

export default function def(value: any) {
  return (model: Model, propKey: string) => {
    addProp(model, propKey, { default: value });
  };
}
