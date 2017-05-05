import { expect } from "chai";
import User from "./User";

describe("Model instance", () => {
  beforeEach(() => {
    const user = new User({
      age: 20,
      email: "user1@example.com",
      name: "User 1",
    });
    return user.save();
  });

  afterEach(() => {
    return User.remove();
  });

  it("should be successfully created", () => {
    const user = new User();
    expect(user instanceof User).to.be.true;
  });

  it("shouldn't find a not existed user",  () => {
    return User.findById("51bb793aca2ab77a3200000d")
      .then(result => expect(result).to.be.null);
  });

  it("should find an existed user", () => {
    return User.findByEmail("user1@example.com")
      .then(u => expect(u.name).to.be.equal("User 1"));
  });
});
