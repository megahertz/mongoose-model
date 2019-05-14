import Model from '../Model';
import { IMeta, IPostHookEvent } from '../types';

export default function post(event: IPostHookEvent) {
  return (model: Model, key: string, descriptor: PropertyDescriptor) => {
    const meta: IMeta = (model.constructor as any).initMeta();

    meta.postHooks.push({ event, callback: descriptor.value });
  };
}
