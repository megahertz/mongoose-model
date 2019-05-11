import { beforeEach, describe, expect, it } from 'humile';
import { Types } from 'mongoose';
import Post from './models/Post';
import User from './models/User';

const email = 'user1@example.com';

describe('Model relations', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await Post.deleteMany();

    const user = await User.create({
      age: 20,
      email,
      name: 'User 1',
    });

    return Post.create({
      body: 'Post body',
      creator: user,
      title: 'Post 1',
    });
  });

  it('should allow to populate related models', async () => {
    const post = await Post.findByTitle('Post 1').populate('creator');
    expect(post.title).toEqual('Post 1');
    expect(post.creator.displayName).toEqual(`User 1 <${email}>`);
    expect(post.creator.isNew).toBe(false);
  });

  it('should return objectId if not populated', async () => {
    const post = await Post.findByTitle('Post 1');
    expect(post.creator instanceof Types.ObjectId).toBe(true);
  });

  it('should allow to read a foreign field which is just set', async () => {
    const user = await User.findByEmail(email);
    const post = await Post.create<Post>({
      creator: user,
      title: 'Post 2',
    });

    expect((post.populated('creator'))).toEqual(user._id);
    expect(post.creator.email).toEqual(email);

    const savedPost = await Post.findByTitle('Post 2').populate('creator');
    expect(savedPost.creator.email).toEqual(email);
  });
});
