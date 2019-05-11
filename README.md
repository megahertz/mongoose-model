# mongoose-model
[![Build Status](https://travis-ci.org/megahertz/mongoose-model.svg?branch=master)](https://travis-ci.org/megahertz/mongoose-model)
[![NPM version](https://badge.fury.io/js/mongoose-model.svg)](https://badge.fury.io/js/mongoose-model)
[![Dependencies status](https://david-dm.org/megahertz/mongoose-model/status.svg)](https://david-dm.org/megahertz/mongoose-model)

## Installation

Install with [npm](https://npmjs.org/package/mongoose-model):

    npm install mongoose-model reflect-metadata
    
reflect-metadata is here for example, you can use any of Reflect API polyfills:

 - [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
 - [core-js (core-js/es7/reflect)](https://www.npmjs.com/package/core-js)
 - [reflection](https://www.npmjs.com/package/@abraham/reflection)

## Usage

```typescript
import { def, Model, model, prop, Query, ref } from 'mongoose-model';

export interface IContact {
  kind: string;
  value: string;
}

@model
export class User extends Model {
  @prop age: number;
  @prop({
    kind: String,
    value: String,
  })
  contacts: IContact[];
  @prop createdAt: Date;
  @prop email: string;
  @def(false) isActive: boolean;
  @prop name: string;

  get displayName() {
    return `${this.name} <${this.email}>`;
  }

  static findByEmail(email: string): Query<User> {
    return this.findOne({ email });
  }
}

@model
export class Post extends Model {
  @prop body: string;
  @ref  creator: User;
  @prop title: string;

  static findByTitle(title: string): Query<Post> {
    return this.findOne({ title });
  }
}
```
