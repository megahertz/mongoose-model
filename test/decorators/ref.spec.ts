import { afterEach, describe, expect, it } from 'humile';
import { model, Model, prop, ref } from '../../index';

@model
class RefModelStringId extends Model {
  @prop
  _id: string;
}

@model
class RefModelParent extends Model {
  @ref({ type: String })
  child: RefModelStringId;
}

afterEach(async () => {
  await RefModelStringId.deleteMany();
  await RefModelParent.deleteMany();
});

describe('@def', () => {
  it('should set false default correctly', async () => {
    await RefModelStringId.create<RefModelStringId>({ _id: '1' });
    await RefModelParent.create({ child: '1' });

    const parent = await RefModelParent.findOne<RefModelParent>({})
      .populate('child');

    expect(parent.child.id).toBe('1');
  });
});
