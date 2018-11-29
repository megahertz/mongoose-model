import { Query } from "mongoose";
import { Model, model, prop, ref } from "../../index";
import User from "./User";

@model
export default class Post extends Model {
  @prop body: string;
  @ref  creator: User;
  @prop title: string;

  static findByTitle(title: string): Query<Post> {
    return this.findOne({ title });
  }
}
