import { expect } from "chai";
import Post from "./models/Post";
import User from "./models/User";

const email = "user1@example.com";

describe("Model relations", () => {
  beforeEach(async () => {
    const user = new User({
      age: 20,
      email,
      name: "User 1",
    });
    await user.save();

    const post = new Post({
      body: "Post body",
      creator: user._id,
      title: "Post 1",
    });

    await post.save();
  });

  afterEach(async () => {
    await User.remove();
    await Post.remove();
  });

  it("should allow to populate related models", async () => {
    const post = await Post.findByTitle("Post 1").populate("creator");
    expect(post.title).to.be.equal("Post 1");
    expect((post.creator as User).displayName)
      .to.be.equal(`User 1 <${email}>`);
    expect((post.creator as User).isNew).to.be.false;
  });

  it("should allow to read a foreign field which is just set", async () => {
    const user = await User.findByEmail(email);
    const post = await Post.create<Post>({
      creator: user,
      title: "Post 2",
    });

    expect((post.populated("creator"))).to.equals(user._id);
    expect((post.creator as User).email).to.equals(email);

    const savedPost = await Post.findByTitle("Post 2").populate("creator");
    expect((savedPost.creator as User).email).to.equals(email);
  });
});
