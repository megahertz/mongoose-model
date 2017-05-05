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
