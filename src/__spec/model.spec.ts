import { afterEach, beforeEach, describe, expect, it } from 'humile';
import User from './models/User';

const email = 'user1@example.com';

describe('Model', () => {
  beforeEach(async () => {
    return User.create<User>({
      age: 30,
      contacts: [
        { kind: 'phone', value: '+7 900 123 4567' },
      ],
      email,
      name: 'User 1',
    });
  });

  afterEach(async () => {
    return User.deleteMany();
  });

  it('should be successfully created', () => {
    const user = new User();
    expect(user instanceof User).toBe(true);
  });

  it('shouldn\'t find a not existed user', async () => {
    const user = await User.findById('51bb793aca2ab77a3200000d');
    expect(user).toBe(null);
  });

  it('should find an existed user', async () => {
    const user = await User.findByEmail(email);
    expect(user.name).toEqual('User 1');
  });

  it('should find an existed user with query', async () => {
    const users = await User.find<User[]>({ email }).limit(1);
    expect(users[0].displayName).toEqual(`User 1 <${email}>`);
  });

  it('should contain the array-like field - contacts', async () => {
    const users = await User.find<User[]>({ email });
    if (users.length > 1) {
      console.log(users.map(u => u.toJSON()));
    }
    expect(users[0].contacts[0].kind).toEqual('phone');
  });
});
