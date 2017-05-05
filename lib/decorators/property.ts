import "reflect-metadata";
import Model from "../Model";

export default function property(target: Model, propertyKey: string): void;
export default function property(
  meta: any,
): (target: Model, propertyKey: string) => void;
export default function property(
  targetOrMeta: Model|any,
  propertyKey?: string,
) {
  if (targetOrMeta instanceof Model) {
    savePropertyMeta(targetOrMeta, propertyKey);
    return;
  }

  const meta = targetOrMeta;
  return (target: Model, propKey: string) => {
    savePropertyMeta(target, propKey, meta);
  };
}

function savePropertyMeta(target: Model, propertyKey: string, meta: any = {}) {
  const propsMeta: object = (target.constructor as any)._meta.properties;

  if (!meta.type) {
    const type = Reflect.getMetadata("design:type", target, propertyKey);
    if (type) {
      meta.type = type;
    } else {
      const name = (target.constructor as any).name;
      throw new Error(
        `Type of ${name}.${propertyKey} isn't set. Uf you use typescript ` +
        "you need to enable emitDecoratorMetadata in tsconfig.json",
      );
    }
  }

  propsMeta[propertyKey] = meta;
}
