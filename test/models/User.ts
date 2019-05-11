import { Query } from 'mongoose';
import { def, Model, model, prop } from '../../index';

export interface IContact {
  kind: string;
  value: string;
}

@model
export default class User extends Model {
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
