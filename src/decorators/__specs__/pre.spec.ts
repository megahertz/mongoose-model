import { afterEach, describe, expect, it } from 'humile';
import { model, Model, pre, prop } from '../../index';

@model
class PreModel extends Model {
  @prop
  val;

  @pre('save')
  private preSave() {
    this.val = 2;
  }
}

afterEach(() => {
  return PreModel.deleteMany();
});

describe('@pre', () => {
  it('should attach a middleware to pre hook', async () => {
    await PreModel.create({});

    const model = await PreModel.findOne<PreModel>({});

    expect(model.val).toBe(2);
  });
});
