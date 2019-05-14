import {
  Aggregate,
  Document,
  DocumentToObjectOptions,
  model,
  Model as MongooseModel,
  ModelMapReduceOption,
  ModelPopulateOptions,
  ModelUpdateOptions,
  NativeError,
  Query,
  SaveOptions,
  Schema,
  Types,
} from 'mongoose';

export type IModelType<T extends Model> = new (model?: Document) => T;

export interface IMeta {
  methods: any;
  name: string;
  properties: any;
  schemaOptions: any;
}

export type Ref<T> = T & string;

type UpdateValues<T> = Partial<Record<keyof T, any>>;

export default class Model {
  protected static _meta: IMeta;
  protected static _Model: MongooseModel<Document>;
  protected static _schema: Schema;

  protected _document: Document;

  constructor(document?: any) {
    if (document && typeof document.__v !== 'undefined') {
      this._document = document;
      return;
    }

    const Model = (this.constructor as any)._Model;
    this._document = new Model(document);
  }

  get __v(): any {
    return this._document.__v;
  }

  set __v(value: any) {
    this._document.__v = value;
  }

  get _id(): any {
    return this._document._id;
  }

  set _id(value: any) {
    this._document._id = value;
  }

  get document(): Document {
    return this._document;
  }

  get id(): any {
    return (this._document as any).id;
  }

  set id(value: any) {
    this.set('id', value);
  }

  get isNew(): boolean {
    return this._document.isNew;
  }

  /**
   * Checks if a path is set to its default.
   */
  $isDefault(path?: string): boolean {
    return this._document.$isDefault(path);
  }

  /** Override whether mongoose thinks this doc is deleted or not */
  $isDeleted(isDeleted: boolean): void;
  /** whether mongoose thinks this doc is deleted. */
  $isDeleted(): boolean;
  /** Override whether mongoose thinks this doc is deleted or not */
  $isDeleted(isDeleted?: boolean): void | boolean {
    return this._document.$isDeleted(isDeleted);
  }

  /**
   * Alias for remove
   */
  async delete(): Promise<this> {
    return this.remove();
  }

  /**
   * Takes a populated field and returns it to its unpopulated state.
   * If the path was not populated, this is a no-op.
   */
  depopulate(path: string): this {
    this._document.depopulate(path);
    return this;
  }

  /**
   * Returns true if the Document stores the same data as doc.
   * Documents are considered equal when they have matching _ids, unless
   * neither document has an _id, in which case this function falls back to
   * using deepEqual().
   */
  equals(doc: this): boolean {
    return this._document.equals(doc.document);
  }

  /**
   * Explicitly executes population and returns a promise.
   * Useful for ES2015 integration.
   */
  async execPopulate(): Promise<this> {
    return this.wrap(await this._document.execPopulate());
  }

  /**
   * Returns the value of a path.
   */
  get(path: string, type?: any): any {
    const value = this._document.get(path, type);
    const options = (this as any).constructor._meta.properties[path];

    if (options && options.ref && value && !(value instanceof Types.ObjectId)) {
      let ref = options.ref;

      // noinspection SuspiciousTypeOfGuard
      if (typeof ref === 'string') {
        ref = (model(options.ref) as any)._OuterModel;
      }

      return new ref(value);
    }

    return value;
  }

  /**
   * Signal that we desire an increment of this documents version.
   */
  increment(): this {
    this._document.increment();
    return this;
  }

  /**
   * Initializes the document without setters or marking anything modified.
   * Called internally after a document is returned from mongodb.
   */
  init(doc: Document, opts?: object): this {
    return this.wrap(this._document.init(doc, opts));
  }

  /** Helper for console.log */
  inspect(options?: object): any {
    return this._document.inspect(options);
  }

  /**
   * Marks a path as invalid, causing validation to fail.
   * The errorMsg argument will become the message of the ValidationError.
   * The value argument (if passed) will be available through the
   * ValidationError.value property.
   */
  invalidate(
    path: string,
    errorMsg: string | NativeError,
    value: any,
    kind?: string,
  ): any {
    return this._document.invalidate(path, errorMsg, value, kind);
  }

  /**
   * Returns true if path was directly set and modified, else false.
   */
  isDirectModified(path: string): boolean {
    return this._document.isDirectModified(path);
  }

  /**
   * Checks if path was explicitly selected. If no projection, always returns
   * true.
   */
  isDirectSelected(path: string): boolean {
    return this._document.isDirectSelected(path);
  }

  /**
   * Checks if path was initialized
   */
  isInit(path: string): boolean {
    return this._document.isInit(path);
  }

  /**
   * Returns true if this document was modified, else false.
   * If path is given, checks if a path or any full path containing path as
   * part of its path chain has been modified.
   */
  isModified(path?: string): boolean {
    return this._document.isModified(path);
  }

  /**
   * Checks if path was selected in the source query which initialized this
   * document.
   */
  isSelected(path: string): boolean {
    return this._document.isSelected(path);
  }

  /**
   * Marks the path as having pending changes to write to the db.
   * Very helpful when using Mixed types.
   * @param path the path to mark modified
   */
  markModified(path: string): void {
    this._document.markModified(path);
  }

  /**
   * Returns another Model instance.
   */
  model(name: string): MongooseModel<any> {
    return this._document.model(name);
  }

  /**
   * Returns the list of paths that have been modified.
   */
  modifiedPaths(): string[] {
    return this._document.modifiedPaths();
  }

  /**
   * Populates document references, executing the callback when complete.
   * If you want to use promises instead, use this function with
   * execPopulate()
   * Population does not occur unless a callback is passed or you explicitly
   * call execPopulate(). Passing the same path a second time will overwrite
   * the previous path options. See Model.populate() for explaination of
   * options.
   */
  populate(...args: any[]): this {
    return this.wrap((this._document as any).populate(...args));
  }

  /**
   * Gets _id(s) used during population of the given path. If the path was not
   * populated, undefined is returned.
   */
  populated(path: string): any {
    return this._document.populated(path);
  }

  /**
   * Removes this document from the db.
   */
  async remove(): Promise<this> {
    return this._document.remove().then(() => this);
  }

  /**
   * Saves this document.
   */
  async save(options?: SaveOptions): Promise<this> {
    return this.wrap(await this._document.save(options));
  }

  /**
   * Sets the value of a path, or many paths.
   */
  set<T = Model>(key: keyof T, value: any, type?: any, options?: object): this;
  set<T = Model>(
    values: Partial<T>,
    value?: any,
    type?: any,
    options?: object,
  ): this;
  set(...values: any[]): this {
    if (typeof values[0] === 'string') {
      values[1] = Model.unwrap(values[1]);
    } else {
      values[0] = Model.unwrap(values[0]);
    }

    (this._document as any).set(...values);
    return this;
  }

  /**
   * The return value of this method is used in calls to JSON.stringify(doc).
   * This method accepts the same options as Document#toObject. To apply the
   * options to every document of your schema by default, set your schemas
   * toJSON option to the same argument.
   */
  toJSON(options?: DocumentToObjectOptions): object {
    return this._document.toJSON(options);
  }

  /**
   * Converts this document into a plain javascript object, ready for storage
   * in MongoDB. Buffers are converted to instances of mongodb.Binary for
   * proper storage.
   */
  toObject(options?: DocumentToObjectOptions): object {
    return this._document.toObject(options);
  }

  /**
   * Helper for console.log
   */
  toString(): string {
    return this._document.toString();
  }

  /**
   * Clears the modified state on the specified path.
   * @param path the path to unmark modified
   */
  unmarkModified(path: string): void {
    this._document.unmarkModified(path);
  }

  /**
   * Sends an update command with this document _id as the query selector.
   */
  update(doc: UpdateValues<this>, options?: ModelUpdateOptions): Query<any> {
    return this._document.update(doc, options);
  }

  /**
   * Executes registered validation rules for this document.
   */
  validate(optional?: object): Promise<void> {
    return this._document.validate(optional);
  }

  /**
   * Executes registered validation rules (skipping asynchronous validators for
   * this document. This method is useful if you need synchronous validation.
   */
  validateSync(pathsToValidate: string | string[]) {
    return this._document.validateSync(pathsToValidate);
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
  static get Model(): MongooseModel<Document> {
    return this._Model;
  }

  /**
   * Returns schema instance
   */
  static get schema(): Schema {
    return this._schema;
  }

  /**
   * Creates a Query and specifies a $where condition.
   */
  static $where<T extends Model[]>(
    argument: string | Function,
  ): Query<T> {
    return this.wrap(this._Model.$where(argument));
  }

  /**
   * Performs aggregations on the models collection.
   */
  static aggregate(...aggregations: any[]): Aggregate<any[]> {
    return this._Model.aggregate(...aggregations);
  }

  /**
   * Sends multiple insertOne, updateOne, updateMany, replaceOne, deleteOne,
   * and/or deleteMany operations to the MongoDB server in one command.
   * This is faster than sending multiple independent operations (like)
   * if you use create()) because with bulkWrite() there is only one round
   * trip to MongoDB.
   * Mongoose will perform casting on all operations you provide.
   * This function does not trigger any middleware, not save() nor update().
   * If you need to trigger save() middleware for every document use create()
   * instead.
   * @param writes Operations
   * @param cb callback
   * @return `BulkWriteOpResult` if the operation succeeds
   */
  static bulkWrite(writes: any[], cb?: (err, res) => void) {
    return this._Model.bulkWrite(writes, cb);
  }

  /**
   * Counts number of matching documents in a database collection.
   * @deprecated
   */
  static count(conditions?: object): Query<number> {
    return this._Model.count(conditions);
  }

  /**
   * Counts number of documents matching `criteria` in a database collection.
   *
   * If you want to count all documents in a large collection,
   * use the `estimatedDocumentCount()` instead.
   * If you call `countDocuments({})`, MongoDB will always execute
   * a full collection scan and **not** use any indexes.
   */
  static countDocuments(conditions, callback?): Query<number> {
    return this._Model.countDocuments(conditions, callback);
  }

  /**
   * Shortcut for saving one or more documents to the database.
   * MyModel.create(docs) does new MyModel(doc).save() for every doc in docs.
   * Triggers the save() hook.
   */
  static async create<T>(doc: T): Promise<T>;
  static async create<T extends Model>(doc: Partial<T>): Promise<T>;
  static async create<T extends Model[]>(doc: T): Promise<T>;
  static async create<T>(doc: T): Promise<T> {
    return this.wrapResults(await this._Model.create(this.unwrap(doc))) as any;
  }

  /**
   * Similar to ensureIndexes(), except for it uses the createIndex function.
   * The ensureIndex() function checks to see if an index with that name
   * already exists, and, if not, does not attempt to create the index.
   * createIndex() bypasses this check.
   * @param cb Optional callback
   */
  static async createIndexes(cb?: (err: any) => void): Promise<void> {
    return this._Model.createIndexes(cb);
  }

  /**
   * Removes documents from the collection.
   */
  static deleteMany(conditions?: any, callback?: (err) => void): Query<any> {
    return this._Model.deleteMany(conditions, callback);
  }

  /**
   * Removes documents from the collection.
   */
  static deleteOne(conditions?: any, callback?: (err) => void): Query<any> {
    return this._Model.deleteOne(conditions, callback);
  }

  static discriminator(name: string, schema: any): MongooseModel<any> {
    return this._Model.discriminator(name, schema);
  }

  /**
   * Creates a Query for a distinct operation.
   */
  static distinct(field: string, conditions?: object): Query<any[]> {
    return this._Model.distinct(field, conditions);
  }

  /**
   * Sends ensureIndex commands to mongo for each index declared in the schema.
   */
  static async ensureIndexes(callback?: (err: any) => void): Promise<void>;
  static async ensureIndexes(
    options: any,
    callback?: (err: any) => void,
   ): Promise<void> {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return this._Model.ensureIndexes(options, callback);
  }

  /**
   * Estimates the number of documents in the MongoDB collection. Faster than
   * using `countDocuments()` for large collections because
   * `estimatedDocumentCount()` uses collection metadata rather than scanning
   * the entire collection.
   */
  static estimatedDocumentCount(
    callback?: (err: any, count: number) => void,
  ): Query<number>;
  static estimatedDocumentCount(
    options: any,
    callback?: (err: any, count: number) => void,
  ): Query<number> {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    return this._Model.estimatedDocumentCount(options, callback);
  }

  /**
   * Finds documents.
   */
  static find<T extends Model[]>(
    conditions?: object,
    projection?: object,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.find(conditions, projection, options));
  }

  /**
   * Finds a single document by its _id field. findById(id) is almost*
   * equivalent to findOne({ _id: id }). findById() triggers findOne hooks.
   */
  static findById<T extends Model>(
    id: object | string | number,
    projection?: object,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findById(id, projection, options));
  }

  /**
   * Issue a mongodb findAndModify remove command by a document's _id field.
   * findByIdAndRemove(id, ...) is equivalent to
   * findOneAndRemove({ _id: id }, ...). Finds a matching document, removes it.
   */
  static findByIdAndRemove<T extends Model>(
    id: object | number | string,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findByIdAndRemove(id, options));
  }

  /**
   * Issues a mongodb findAndModify update command by a document's _id field.
   * findByIdAndUpdate(id, ...) is equivalent to
   * findOneAndUpdate({ _id: id }, ...).
   */
  static findByIdAndUpdate<T extends Model>(
    id: object | number | string,
    update?: UpdateValues<T>,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findByIdAndUpdate(id, update, options));
  }

  /**
   * Finds one document. The conditions are cast to their respective
   * SchemaTypes before the command is sent.
   */
  static findOne<T extends Model>(
    conditions: object,
    projection?: object,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findOne(conditions, projection, options));
  }

  /**
   * Issue a mongodb findAndModify remove command.
   * Finds a matching document, removes it.
   */
  static findOneAndRemove<T extends Model>(
    conditions?: object,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findOneAndRemove(conditions, options));
  }

  /**
   * Issues a mongodb findAndModify update command.
   * Finds a matching document, updates it according to the update arg, passing
   * any options, and returns the found document.
   */
  static findOneAndUpdate<T extends Model>(
    conditions?: object,
    update?: UpdateValues<T>,
    options?: object,
  ): Query<T> {
    return this.wrap(this._Model.findOneAndUpdate(conditions, update, options));
  }

  /**
   * Implements $geoSearch functionality for Mongoose
   */
  static geoSearch<T extends Model[]>(
    conditions: object,
    options: {
      /** return the raw object instead of the Mongoose Model */
      lean?: boolean;
      /** The maximum number of results to return */
      limit?: number;
      /** the maximum distance from the point near that a result can be */
      maxDistance: number;
      /** x,y point to search for */
      near: number[];
    }): Query<T> {
    return this.wrap(this._Model.geoSearch(conditions, options));
  }

  /**
   * Shortcut for creating a new Document from existing raw data,
   * pre-saved in the DB. The document returned has no paths marked
   * as modified initially.
   */
  static hydrate<T extends Model>(obj: object): T {
    return this.wrapResults(this._Model.hydrate(obj)) as T;
  }

  /**
   * Performs any async initialization of this model against MongoDB.
   * This function is called automatically, so you don't need to call it.
   * This function is also idempotent, so you may call it to get back a promise
   * that will resolve when your indexes are finished building as an alternative
   * to `MyModel.on('index')`
   * @param callback optional
   */
  static init<T>(callback?: (err: any) => void): Promise<T> {
    return this._Model.init(callback) as any;
  }

  /**
   * Shortcut for validating an array of documents and inserting them into
   * MongoDB if they're all valid. This function is faster than .create()
   * because it only sends one operation to the server, rather than one for each
   * document.
   * This function does not trigger save middleware.
   */
  static async insertMany<T extends Model>(docs: any): Promise<T>;
  static async insertMany<T extends Model>(docs: any[]): Promise<T[]>;
  static async insertMany<T extends Model>(docs: any): Promise<any> {
    return this.wrapResults(await this._Model.insertMany(docs)) as any;
  }

  /**
   * Executes a mapReduce command.
   */
  static mapReduce<Key, Value>(
    o: ModelMapReduceOption<Document, Key, Value>,
  ): Promise<any> {
    return this._Model.mapReduce(o);
  }

  static model<T extends Document>(name: string): MongooseModel<T> {
    return this._Model.model(name) as any;
  }

  /**
   * Populates document references.
   * @param docs Either a single document or array of documents to populate.
   * @param options A hash of key/val (path, options) used for population.
   * @param callback Optional callback, executed upon completion. Receives err
   * and the doc(s).
   */
  static async populate<T>(
    docs: any[],
    options: ModelPopulateOptions | ModelPopulateOptions[],
    callback?: (err: any, res: T[]) => void,
  ): Promise<T[]>;
  static async populate<T>(
    docs: any,
    options: ModelPopulateOptions | ModelPopulateOptions[],
    callback?: (err: any, res: T) => void,
  ): Promise<T> {
    return this.wrapResults(
      await this._Model.populate(docs, options, callback),
    ) as any;
  }

  /**
   * Removes documents from the collection.
   * @deprecated
   */
  static remove(conditions?: object): Query<any> {
    return this._Model.remove(conditions);
  }

  /**
   * Same as `update()`, except MongoDB replace the existing document with the
   * given document (no atomic operators like `$set`).
   *
   * **Note** updateMany will _not_ fire update middleware. Use
   * `pre('updateMany')` and `post('updateMany')` instead.
   */
  static replaceOne(
    conditions: object,
    doc: object,
    options?: ModelUpdateOptions,
  ): Query<any> {
    return (this._Model as any).replaceOne(conditions, doc, options);
  }

  /**
   * Translate any aliases fields/conditions so the final query or document
   * object is pure
   * @param raw fields/conditions that may contain aliased keys
   * @return the translated 'pure' fields/conditions
   */
  static translateAliases(raw: any): any {
    return this._Model.translateAliases(raw);
  }

  /**
   * Updates documents in the database without returning them.
   * All update values are cast to their appropriate SchemaTypes before being
   * sent.
   */
  static update<T extends Model>(
    conditions: object,
    doc: UpdateValues<T>,
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
  static updateMany<T extends Model>(
    conditions: object,
    doc: UpdateValues<T>,
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
  static updateOne<T extends Model>(
    conditions: object,
    doc: UpdateValues<T>,
    options?: ModelUpdateOptions,
  ): Query<any> {
    return (this._Model as any).updateOne(conditions, doc, options);
  }

  /**
   * Watches the underlying collection for changes using MongoDB change streams.
   * This function does not trigger any middleware.
   */
  static watch(options: any) {
    return this._Model.watch(options);
  }

  /**
   * Creates a Query, applies the passed conditions, and returns the Query.
   */
  static where<T extends Model[]>(
    path: string,
    conditions?: object,
  ): Query<T> {
    return this.wrap(this._Model.where(path, conditions));
  }

  /**
   * Initialize static _meta field with empty values
   */
  protected static initMeta(): IMeta {
    if (this._meta) {
      return this._meta;
    }

    this._meta = {
      methods: {},
      name: this.name,
      properties: {},
      schemaOptions: {},
    };

    return this._meta;
  }

  // tslint:disable-next-line no-empty
  protected static initSchema(meta: IMeta): Schema {
    const schema = new Schema(meta.properties, meta.schemaOptions);
    schema.methods = meta.methods;
    return schema;
  }

  /**
   * Return document from model instance. Can traverse arrays and objects
   */
  protected static unwrap(doc: any): any {
    if (Array.isArray(doc)) {
      return doc.map(this.unwrap);
    }

    if (doc instanceof Model) {
      return doc.document;
    }

    if (doc) {
      Object.keys(doc).forEach((key) => {
        if (doc[key] instanceof Model) {
          doc[key] = doc[key].document;
        }
      });
    }

    return doc;
  }

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
