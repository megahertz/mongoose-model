import Model from '../Model';
import { IMeta } from '../types';

export default function method(
  model: Model,
  key: string,
  descriptor: PropertyDescriptor,
) {
  const meta: IMeta = (model.constructor as any).initMeta();

  meta.methods[key] = descriptor.value;
}
