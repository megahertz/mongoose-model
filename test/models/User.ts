import { Query } from "mongoose";
import { Model, model, property } from "../../index";

export interface IContact {
  type: string;
  value: string;
}

@model
export default class User extends Model {
  @property public age: number;
  @property public createdAt: Date;
  @property public email: string;
  @property public contacts: IContact[];

  @property({ default: false })
  public isActive: boolean;

  @property public name: string;

  public get displayName() {
    return `${this.name} <${this.email}>`;
  }

  public static findByEmail(email: string): Query<User> {
    return this.findOne({ email });
  }
}
