import { Query } from "mongoose";
import { Model, model, property, Ref } from "../../index";
import User from "./User";

@model
export default class Post extends Model {
  @property body: string;
  @property({ ref: User }) creator: Ref<User>;
  @property title: string;

  static findByTitle(title: string): Query<Post> {
    return this.findOne({ title });
  }
}
