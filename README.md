# mongoose-model
[![Build Status](https://travis-ci.org/megahertz/mongoose-model.svg?branch=master)](https://travis-ci.org/megahertz/mongoose-model)
[![NPM version](https://badge.fury.io/js/mongoose-model.svg)](https://badge.fury.io/js/mongoose-model)
[![Dependencies status](https://david-dm.org/megahertz/mongoose-model/status.svg)](https://david-dm.org/megahertz/mongoose-model)

## This package is experimental and not ready for production

## Installation

Install with [npm](https://npmjs.org/package/mongoose-model):

    npm install mongoose-model

## Usage

```typescript
import { Model, model, property } from "..";

@model
export default class User extends Model {
  @property public age: number;
  @property public createdAt: Date;
  @property public email: string;

  @property({ default: false })
  public isActive: boolean;

  @property public name: string;

  public static findByEmail(email: string): Promise<User> {
    return this.findOne<User>({ email });
  }
}
```
## License

Licensed under MIT.
