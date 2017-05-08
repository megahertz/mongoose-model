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

export type Ref<T> = T | string;

export default class Model {
  protected static _Model: MongooseModel<Document>;
  protected static _meta: IMeta = {
    properties: {},
    schemaOptions: {},
  };
  protected static _schema: Schema;

  protected _document: Document;

  constructor(document?: any) {
    if (document && typeof document.__v !== "undefined") {
      this._document = document;
      return;
    }

    const Model = (this.constructor as any)._Model;
    this._document = new Model(document);
  }

  public get document(): Document {
    return this._document;
  }

  public get _id(): any {
    return this._document._id;
  }

  public set _id(value: any) {
    this._document._id = value;
  }

  public get __v(): any {
    return this._document.__v;
  }

  public set __v(value: any) {
    this._document.__v = value;
  }

  public get id(): any {
    return (this._document as any).id;
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

  public static find<T extends Model[]>(
    conditions: any,
    projection?: any,
    options?: any,
  ): Query<T> {
    return this.wrapMany(
      (this._Model as any).find(conditions, projection, options),
    );
  }

  public static findById<T extends Model>(id: string): Query<T> {
    return this.wrap(this._Model.findById(id));
  }

  public static findOne<T extends Model>(
    conditions: any,
    projection?: any,
    options?: any,
  ): Query<T> {
    return this.wrap(this._Model.findOne(conditions, projection, options));
  }

  // tslint:disable-next-line no-empty
  protected static initSchema(): void {}

  private static wrap<T extends Model>(
    query: Query<Document>,
  ): Query<T> {
    const exec = query.exec;
    const then = query.then;

    query.exec = async (...args: any[]) => {
      return this.wrapResults(await exec.apply(query, args));
    };
    query.then = async (...args: any[]) => {
      return this.wrapResults(await then.apply(query, args));
    };

    return query as any;
  }

  private static wrapMany<T extends Model[]>(
    query: Query<Document>,
  ): Query<T> {
    return this.wrap(query) as any;
  }

  private static wrapResults<T extends Model>(
    this: IModelType<T>,
    result: any,
  ) {
    if (!result) {
      return null;
    }

    if (result.unshift) {
      return result.map(r => new this(r));
    } else {
      return new this(result);
    }
  }
}
