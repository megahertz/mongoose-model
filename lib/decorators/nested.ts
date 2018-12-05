import Model from "../Model";
import { addProp } from "./prop";

export default function nested(model: Model, key: string): void;
export default function nested(cfg: any): (model: Model, key: string) => void;
export default function nested(modelOrCfg: Model | any, key?: string) {
  // normal decorator
  if (modelOrCfg instanceof Model) {
    throw new Error(`'@nested ${key}' decorator requires 1 argument`);
  }

  // decorator with arguments
  return (model: Model, propKey: string) => {
    addProp(model, propKey, { ...modelOrCfg, _nested: true });
  };
}
