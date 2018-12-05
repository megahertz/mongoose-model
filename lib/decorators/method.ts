import Model, { IMeta } from "../Model";

export default function method(
  model: Model,
  key: string,
  descriptor: PropertyDescriptor,
) {
  const meta: IMeta = (model.constructor as any).initMeta();

  meta.methods[key] = descriptor.value;
}
