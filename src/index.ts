import 'reflect-metadata';

export { default as Model, Ref, IMeta } from './Model';
export { default as def } from './decorators/def';
export { default as index } from './decorators/index';
export { default as method } from './decorators/method';
export { default as model } from './decorators/model';
export { default as nested } from './decorators/nested';
export { default as prop } from './decorators/prop';
export { default as propertyTransformers }
  from './decorators/propertyTransformers';
export { default as ref } from './decorators/ref';
export { default as subdoc } from './decorators/subdoc';
export { Query } from 'mongoose';
