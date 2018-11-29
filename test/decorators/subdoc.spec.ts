import { expect } from "chai";
import { Schema } from "mongoose";
import { def, model, Model, prop, subdoc } from "../../index";

@model
class SubdocModelChild extends Model {
  @def("Default name") name: string;
}

@model
class SubdocModelMain extends Model {
  @subdoc({
    inlineProp: { default: "inline default", type: String },
  })
  inline;

  @def(() => [{}])
  @subdoc({
    inlineArrayProp: { default: "inline array default", type: String },
  })
  inlineArray: any[];

  @def(SubdocModelChild)
  @subdoc
  simple: SubdocModelChild;

  @subdoc(SubdocModelChild)
  simpleArray: SubdocModelChild[];
}

describe("@subdoc", () => {
  it("should define subdoc schema inline", () => {
    const schema: Schema = (SubdocModelMain as any)._schema;

    expect((schema.path("inline") as any).instance).equals("Embedded");
    expect((schema.path("inlineArray") as any).instance).equals("Array");

    const model = new SubdocModelMain();
    expect(model.inlineArray[0].toObject())
      .to.deep.equal({ inlineArrayProp: "inline array default"});
  });

  it("should define subdoc schema from another model", () => {
    const schema: Schema = (SubdocModelMain as any)._schema;

    expect((schema.path("simple") as any).instance).equals("Embedded");
    expect((schema.path("simpleArray") as any).instance).equals("Array");

    const model = new SubdocModelMain();
    expect(model.simple.name).equals("Default name");
  });
});
