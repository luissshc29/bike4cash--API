import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type BikeRating = {
  id: number;
  username: string;
  bikeId: number;
  rating: number;
  message: string;
};

export async function getBikeRatings(id?: number) {
  const bikeRatingsFull = id
    ? await prisma.bikeRatings.findMany({
        where: {
          bikeId: id,
        },
      })
    : await prisma.bikeRatings.findMany();

  return bikeRatingsFull;
}

export async function getAverageBikeRating(id: number) {
  const bikeRatingsFull = await getBikeRatings(id);

  const bikeRatingsNumbers = bikeRatingsFull.map(
    (item: BikeRating) => item.rating
  );

  var averageBikeRating = 0;

  for (let i = 0; i < bikeRatingsNumbers.length; i++) {
    averageBikeRating += bikeRatingsNumbers[i] / bikeRatingsNumbers.length;
  }

  return Number(averageBikeRating.toFixed(1));
}

export async function checkIfBikeIsRecommended(id: number): Promise<boolean> {
  const allBikeRatingsFull = await getBikeRatings();

  const allBikeRatingsNumbers = allBikeRatingsFull
    .map((item: BikeRating) => {
      return {
        bikeId: Number(item.bikeId),
        rating: Number(item.rating),
      };
    })
    .sort(
      (a: { bikeId: number }, b: { bikeId: number }) => a.bikeId - b.bikeId
    );

  const groupedBikeRatings = allBikeRatingsNumbers.reduce(
    (
      acc: { [bikeId: number]: { totalRating: number; count: number } },
      { bikeId, rating }: { bikeId: number; rating: number }
    ) => {
      if (acc[bikeId]) {
        acc[bikeId].totalRating += rating;
        acc[bikeId].count += 1;
      } else {
        acc[bikeId] = { totalRating: rating, count: 1 };
      }
      return acc;
    },
    {}
  );

  const result = Object.keys(groupedBikeRatings)
    .map((bikeId) => {
      return {
        bikeId: Number(bikeId),
        rating:
          groupedBikeRatings[Number(bikeId)].totalRating /
          groupedBikeRatings[Number(bikeId)].count,
      };
    })
    .sort((a, b) => b.rating - a.rating);

  const recommendedBikes = result.slice(0, 4);

  return recommendedBikes.map((item) => item.bikeId).includes(id);
}
