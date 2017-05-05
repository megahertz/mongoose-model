import {
  Document,
  Model as MongooseModel,
  Query,
  Schema,
} from "mongoose";

export interface IModelType<T extends Model> {
  new (model?: Document): T;
}

export interface IMeta {
  properties: any;
  schemaOptions: any;
}

export default class Model {
  public static schema: MongooseModel<Document>;
  protected static _meta: IMeta = {
    properties: {},
    schemaOptions: {},
  };

  public document: Document;

  constructor(model?: any) {
    if (model && typeof model.__v !== "undefined") {
      this.document = model;
      return;
    }

    // tslint:disable-next-line variable-name
    const Schema = (this.constructor as any).schema;
    this.document = new Schema(model);
  }

  public save(options?: any): Promise<Document> {
    return this.document.save(options);
  }

  public increment() {
    return this.document.increment();
  }

  public remove(options?: any): Promise<Document> {
    return this.document.remove(options);
  }

  public static remove(conditions?: any): Promise<any> {
    return this.schema.remove(conditions).exec();
  }

  public static find<T extends Model>(
    conditions: any,
    projection?: any,
    options?: any,
  ): Promise<T[]> {
    return this.wrapMany(this.schema.find(conditions, projection, options));
  }

  public static async findById<T extends Model>(id: string): Promise<T> {
    return (this as any).wrap(this.schema.findById(id));
  }

  public static findOne<T extends Model>(
    conditions: any,
    projection?: any,
    options?: any,
  ): Promise<T> {
    return this.wrap(this.schema.findOne(conditions, projection, options));
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
  protected static initSchema(schema: Schema): void {}
}
