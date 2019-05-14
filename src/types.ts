export interface IMeta {
  methods: any;
  name: string;
  postHooks: IPostHook[];
  preHooks: IPreHook[];
  properties: any;
  schemaOptions: any;
}

export type IPreHookEvent =
  | 'aggregate'
  | 'count'
  | 'deleteMany'
  | 'deleteOne'
  | 'find'
  | 'findOne'
  | 'findOneAndDelete'
  | 'findOneAndRemove'
  | 'findOneAndUpdate'
  | 'init'
  | 'insertMany'
  | 'remove'
  | 'save'
  | 'update'
  | 'updateMany'
  | 'updateOne'
  | 'validate';

export type IPostHookEvent = IPreHookEvent;

export interface IPreHook {
  callback: Function;
  event: string;
}

export interface IPostHook {
  callback: Function;
  event: string;
}
