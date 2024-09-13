import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import {
  checkIfBikeIsRecommended,
  getAverageBikeRating,
  getBikeRatings,
} from "../utils/functions/bikes";
import { bikes } from "../utils/constants/bikes";

export const Bike = objectType({
  name: "Bike",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("image");
    t.nonNull.string("name");
    t.nonNull.string("category");
    t.nonNull.int("price");
    t.nonNull.field("rating", {
      type: "RatingInfo",
      async resolve(parent) {
        const { id } = parent;
        const averageRating = await getAverageBikeRating(id);
        const ratingList = await getBikeRatings(id);

        return {
          average: averageRating,
          list: ratingList,
        };
      },
    });
    t.nonNull.field("recommended", {
      type: "Boolean",
      async resolve(parent) {
        const { id } = parent;
        const recommended = await checkIfBikeIsRecommended(id);
        return recommended;
      },
    });
  },
});

export const RatingInfo = objectType({
  name: "RatingInfo",
  definition(t) {
    t.nonNull.float("average");
    t.nonNull.list.field("list", {
      type: "Rating",
    });
  },
});

export const Rating = objectType({
  name: "Rating",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("username");
    t.nonNull.float("rating");
    t.nonNull.string("message");
  },
});

export const BikeQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("bikes", {
      type: "Bike",
      args: {
        category: stringArg(),
        maxPrice: intArg(),
        search: stringArg(),
      },
      async resolve(_, args, __) {
        const { category, maxPrice, search } = args;

        var temp = await Promise.all(
          bikes.map(async (item) => {
            return {
              ...item,
              recommended: await checkIfBikeIsRecommended(item.id),
            };
          })
        );

        if (category) {
          if (category.toLowerCase() === "recommended") {
            temp = temp.filter((item) => item.recommended === true);
          } else if (category.toLowerCase() === "all") {
            temp = temp;
          } else {
            temp = temp.filter(
              (item) => item.category.toLowerCase() === category.toLowerCase()
            );
          }
        }

        if (maxPrice) {
          temp = temp.filter((item) => item.price <= maxPrice);
        }

        if (search) {
          temp = temp.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        return temp;
      },
    });
    t.nonNull.field("bike", {
      type: "Bike",
      args: {
        id: nonNull(intArg()),
      },
      resolve(p, args, ctx) {
        const bike = bikes.find((bike) => bike.id === args.id);

        if (!bike) {
          throw new Error(`Bike with ID ${args.id} not found`);
        }

        return bike;
      },
    });
  },
});
