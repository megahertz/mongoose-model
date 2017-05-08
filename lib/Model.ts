import {
  Document,
  Model as MongooseModel,
  Query,
  Schema,
} from "mongoose";
import Doc = Mocha.reporters.Doc;

export interface IModelType<T extends Model> {
  new (model?: Document): T;
}

export interface IMeta {
  properties: any;
  schemaOptions: any;
}

export default class Model {
  protected static _Model: MongooseModel<Document>;
  protected static _meta: IMeta = {
    properties: {},
    schemaOptions: {},
  };
  protected static _schema: Schema;

  protected _document: Document;

  constructor(model?: any) {
    if (model && typeof model.__v !== "undefined") {
      this._document = model;
      return;
    }

    const Schema = (this.constructor as any)._Schema;
    this._document = new Schema(model);
  }

  public get document(): Document {
    return this._document;
  }

  public save(options?: any): Promise<Document> {
    return this._document.save(options);
  }

  public increment() {
    return this._document.increment();
  }

  public remove(options?: any): Promise<Document> {
    return this._document.remove(options);
  }

  public static get Model(): MongooseModel<Document> {
    return this._Model;
  }

  public static get schema(): Schema {
    return this._schema;
  }

  public static remove(conditions?: any): Promise<any> {
    return this._Model.remove(conditions).exec();
  }

  public static find<T extends Model>(
    conditions: any,
    projection?: any,
    options?: any,
  ): Promise<T[]> {
    return this.wrapMany(this._Model.find(conditions, projection, options));
  }

  public static async findById<T extends Model>(id: string): Promise<T> {
    return (this as any).wrap(this._Model.findById(id));
  }

  public static findOne<T extends Model>(
    conditions: any,
    projection?: any,
    options?: any,
  ): Promise<T> {
    return this.wrap(this._Model.findOne(conditions, projection, options));
  }

  protected static async wrapMany<T extends Model>(
    this: IModelType<T>,
    query: Query<any>,
  ): Promise<T[]> {
    const result: any[] = await query.exec();
    return result.map(r => new this(r));
  }

  protected static async wrap<T extends Model>(
    this: IModelType<T>,
    query: Query<any>,
  ): Promise<T> {
    const result = await query.exec();
    if (result) {
      return new this(result);
    } else {
      return null;
    }
  }

  // tslint:disable-next-line no-empty
  protected static initSchema(): void {}
}
