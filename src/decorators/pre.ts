import Model from '../Model';
import { IMeta, IPreHookEvent } from '../types';

export default function pre(event: IPreHookEvent) {
  return (model: Model, key: string, descriptor: PropertyDescriptor) => {
    const meta: IMeta = (model.constructor as any).initMeta();

    meta.preHooks.push({ event, callback: descriptor.value });
  };
}
