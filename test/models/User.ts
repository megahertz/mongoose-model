import { Query } from "mongoose";
import { Model, model, property } from "../../index";

export interface IContact {
  type: string;
  value: string;
}

@model
export default class User extends Model {
  @property age: number;
  @property contacts: IContact[];
  @property createdAt: Date;
  @property email: string;
  @property({ default: false }) isActive: boolean;
  @property public name: string;

  get displayName() {
    return `${this.name} <${this.email}>`;
  }

  static findByEmail(email: string): Query<User> {
    return this.findOne({ email });
  }
}
