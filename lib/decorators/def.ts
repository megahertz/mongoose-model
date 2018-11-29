import Model from "../Model";
import { addProp } from "./property";

export default function def(model: Model, key: string): void;
export default function def(value: any): (model: Model, key: string) => void;
export default function def(modelOrValue: Model | any, key?: string) {
  // normal decorator
  if (modelOrValue instanceof Model) {
    throw new Error(`'@def ${key}' decorator requires 1 argument`);
  }

  // decorator with arguments
  return (model: Model, propKey: string) => {
    addProp(model, propKey, { default: modelOrValue });
  };
}
