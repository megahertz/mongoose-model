import {
  Aggregate,
  Document,
  Model as MongooseModel, ModelMapReduceOption,
  ModelUpdateOptions,
  Query,
  SaveOptions,
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

  /**
   * Saves this document.
   */
  public async save(options?: SaveOptions): Promise<this> {
    return this.wrap(await this._document.save(options));
  }

  /**
   * Signal that we desire an increment of this documents version.
   */
  public increment(): this {
    this._document.increment();
    return this;
  }

  /**
   * Removes this document from the db.
   */
  public remove(): Promise<this> {
    return this._document.remove().then(() => this);
  }

  /**
   * Makes a model instance from document
   */
  protected wrap(document: Document): this {
    const Model = this.constructor as any;
    return new Model(document);
  }

  /**
   * Returns Model class
   */
  public static get Model(): MongooseModel<Document> {
    return this._Model;
  }

  /**
   * Returns schema instance
   */
  public static get schema(): Schema {
    return this._schema;
  }

  /**
   * Removes documents from the collection.
   */
  public static remove(conditions: object): Query<void> {
    return this._Model.remove(conditions);
  }

  /**
   * Finds documents.
   */
  public static find<T extends Model[]>(
    conditions: object,
    projection?: object,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.find(conditions, projection, options));
  }

  /**
   * Finds a single document by its _id field. findById(id) is almost*
   * equivalent to findOne({ _id: id }). findById() triggers findOne hooks.
   */
  public static findById<T extends Model>(
    id: object | string | number,
    projection?: object,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findById(id, projection, options));
  }

  /**
   * Finds one document. The conditions are cast to their respective
   * SchemaTypes before the command is sent.
   */
  public static findOne<T extends Model>(
    conditions: object,
    projection?: object,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findOne(conditions, projection, options));
  }

  /**
   * Counts number of matching documents in a database collection.
   */
  public static count(conditions?: object): Query<number> {
    return this._Model.count(conditions);
  }

  /**
   * Creates a Query for a distinct operation.
   */
  public static distinct(field: string, conditions?: object): Query<any[]> {
    return this._Model.distinct(field, conditions);
  }

  /**
   * Creates a Query, applies the passed conditions, and returns the Query.
   */
  public static where<T extends Model[]>(
    path: string,
    conditions?: object,
  ): Query<T> {
    return this.wrap(this._Model.where(path, conditions));
  }

  /**
   * Creates a Query and specifies a $where condition.
   */
  public static $where<T extends Model[]>(
    argument: string | Function,
  ): Query<T> {
    return this.wrap(this._Model.$where(argument));
  }

  /**
   * Issues a mongodb findAndModify update command.
   * Finds a matching document, updates it according to the update arg, passing
   * any options, and returns the found document.
   */
  public static findOneAndUpdate<T extends Model>(
    conditions?: object,
    update?: object,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findOneAndUpdate(conditions, update, options));
  }

  /**
   * Issues a mongodb findAndModify update command by a document's _id field.
   * findByIdAndUpdate(id, ...) is equivalent to
   * findOneAndUpdate({ _id: id }, ...).
   */
  public static findByIdAndUpdate<T extends Model>(
    id: object | number | string,
    update?: object,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findByIdAndUpdate(id, update, options));
  }

  /**
   * Issue a mongodb findAndModify remove command.
   * Finds a matching document, removes it.
   */
  public static findOneAndRemove<T extends Model>(
    conditions?: object,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findOneAndRemove(conditions, options));
  }

  /**
   * Issue a mongodb findAndModify remove command by a document's _id field.
   * findByIdAndRemove(id, ...) is equivalent to
   * findOneAndRemove({ _id: id }, ...). Finds a matching document, removes it.
   */
  public static findByIdAndRemove<T extends Model>(
    id: object | number | string,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findByIdAndRemove(id, options));
  }

  /**
   * Shortcut for saving one or more documents to the database.
   * MyModel.create(docs) does new MyModel(doc).save() for every doc in docs.
   * Triggers the save() hook.
   */
  public static async create<T extends Model>(doc: any[]): Promise<T[]>;
  public static async create<T extends Model>(doc: any): Promise<T> {
    return this.wrapResults(await this._Model.create(doc)) as any;
  }

  /**
   * Shortcut for validating an array of documents and inserting them into
   * MongoDB if they're all valid. This function is faster than .create()
   * because it only sends one operation to the server, rather than one for each
   * document.
   * This function does not trigger save middleware.
   */
  public static async insertMany<T extends Model>(docs: any): Promise<T>;
  public static async insertMany<T extends Model>(docs: any[]): Promise<T[]> {
    return this.wrapResults(await this._Model.insertMany(docs)) as any;
  }

  /**
   * Shortcut for creating a new Document from existing raw data,
   * pre-saved in the DB. The document returned has no paths marked
   * as modified initially.
   */
  public static hydrate<T extends Model>(obj: object): T {
    return this.wrapResults(this._Model.hydrate(obj)) as T;
  }

  /**
   * Updates documents in the database without returning them.
   * All update values are cast to their appropriate SchemaTypes before being
   * sent.
   */
  public static update(
    conditions: object,
    doc: object,
    options?: ModelUpdateOptions,
  ): Query<any> {
    return this._Model.update(conditions, doc, options);
  }

  /**
   * Same as `update()`, except MongoDB will update _all_ documents that match
   * `criteria` (as opposed to just the first one) regardless of the value of
   * the `multi` option.
   * **Note** updateMany will _not_ fire update middleware. Use
   * `pre('updateMany')` and `post('updateMany')` instead.
   */
  public static updateMany(
    conditions: object,
    doc: object,
    options?: ModelUpdateOptions,
  ): Query<any> {
    return (this._Model as any).updateMany(conditions, doc, options);
  }

  /**
   * Same as `update()`, except MongoDB will update _only_ the first document
   * that matches `criteria` regardless of the value of the `multi` option.
   *
   * **Note** updateMany will _not_ fire update middleware. Use
   * `pre('updateMany')` and `post('updateMany')` instead.
   */
  public static updateOne(
    conditions: object,
    doc: object,
    options?: ModelUpdateOptions,
  ): Query<any> {
    return (this._Model as any).updateOne(conditions, doc, options);
  }

  /**
   * Same as `update()`, except MongoDB replace the existing document with the
   * given document (no atomic operators like `$set`).
   *
   * **Note** updateMany will _not_ fire update middleware. Use
   * `pre('updateMany')` and `post('updateMany')` instead.
   */
  public static replaceOne(
    conditions: object,
    doc: object,
    options?: ModelUpdateOptions,
  ): Query<any> {
    return (this._Model as any).replaceOne(conditions, doc, options);
  }

  /**
   * Executes a mapReduce command.
   */
  public static mapReduce<Key, Value>(
    o: ModelMapReduceOption<Document, Key, Value>,
  ): Promise<any> {
      return this._Model.mapReduce(o);
  }

  /**
   * geoNear support for Mongoose
   */
  public static geoNear<T extends Model[]>(
    near: any | any[],
    options: object,
  ): Query<T> {
    return this.wrap(this._Model.geoNear(near, options));
  }

  /**
   * Performs aggregations on the models collection.
   */
  public static aggregate(...aggregations: object[]): Aggregate<object[]> {
    return this._Model.aggregate(...aggregations);
  }

  /**
   * Implements $geoSearch functionality for Mongoose
   */
  public static geoSearch<T extends Model[]>(
    conditions: object,
    options: {
      /** x,y point to search for */
      near: number[];
      /** the maximum distance from the point near that a result can be */
      maxDistance: number;
      /** The maximum number of results to return */
      limit?: number;
      /** return the raw object instead of the Mongoose Model */
      lean?: boolean;
    }): Query<T> {
    return this.wrap(this._Model.geoSearch(conditions, options));
  }

  // tslint:disable-next-line no-empty
  protected static initSchema(): void {}

  protected static wrap<T extends Model[]>(query: Query<any>): Query<any>;
  protected static wrap<T extends Model>(query: Query<any>): Query<any> {
    const exec = query.exec;
    const then = query.then;

    (query as any).exec = async (...args: any[]) => {
      return this.wrapResults(await exec.apply(query, args));
    };
    (query as any).then = async (...args: any[]) => {
      return this.wrapResults(await then.apply(query, args));
    };

    return query as any;
  }

  protected static wrapResults<T extends Model>(
    this: IModelType<T>,
    result: any,
  ): T | T[] {
    if (!result) {
      return null;
    }

    if (Array.isArray(result)) {
      return result.map(r => new this(r));
    } else {
      return new this(result);
    }
  }
}
