import { afterEach, describe, expect, it } from 'humile';
import { def, model, Model } from '../../index';

@model
class DefModel extends Model {
  @def(false)
  isFalse: boolean;
}

afterEach(() => {
  return DefModel.deleteMany();
});

describe('@def', () => {
  it('should set false default correctly', async () => {
    const { id } = await DefModel.create<DefModel>({});
    const model = await DefModel.findById<DefModel>(id);
    expect(model.isFalse).toBe(false);
  });
});
