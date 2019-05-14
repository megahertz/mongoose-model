import 'reflect-metadata';

export { default as Model, Ref, IMeta } from './lib/Model';
export { default as def } from './lib/decorators/def';
export { default as index } from './lib/decorators/index';
export { default as method } from './lib/decorators/method';
export { default as model } from './lib/decorators/model';
export { default as nested } from './lib/decorators/nested';
export {
  default as property,
  default as prop,
} from './lib/decorators/prop';
export { default as propertyTransformers }
  from './lib/decorators/propertyTransformers';
export { default as ref } from './lib/decorators/ref';
export { default as subdoc } from './lib/decorators/subdoc';
export { Query } from 'mongoose';
