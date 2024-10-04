import { extendType, objectType, nonNull, stringArg } from "nexus";
import { categories } from "../utils/constants/categories";

export const Category = objectType({
  name: "Category",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
  },
});

export const CategoryQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("categories", {
      type: "Category",
      resolve() {
        return categories;
      },
    });
    t.field("category", {
      type: "Category",
      args: {
        name: nonNull(stringArg()),
      },
      resolve(_, { name }, __) {
        const category = categories.find(
          (cat) => cat.name.toLowerCase() === name.toLowerCase()
        );

        if (category) return category;

        throw new Error(`Category "${name}" not found`);
      },
    });
  },
});
