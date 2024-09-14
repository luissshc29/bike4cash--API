import { bikeRatings, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    (item: bikeRatings) => item.rating
  );

  var averageBikeRating = 0;

  for (let i = 0; i < bikeRatingsNumbers.length; i++) {
    averageBikeRating += bikeRatingsNumbers[i] / bikeRatingsNumbers.length;
  }

  return Number(averageBikeRating.toFixed(1));
}

export async function checkIfBikeIsRecommended(id: number) {
  const allBikeRatingsFull = await getBikeRatings();

  const allBikeRatingsNumbers = allBikeRatingsFull
    .map((item: bikeRatings) => {
      return {
        bikeId: item.bikeId,
        rating: item.rating,
      };
    })
    .sort((item) => item.bikeId);

  const groupedBikeRatings = allBikeRatingsNumbers.reduce<{
    [bikeId: number]: { totalRating: number; count: number };
  }>((acc, { bikeId, rating }) => {
    if (acc[bikeId]) {
      acc[bikeId].totalRating += rating;
      acc[bikeId].count += 1;
    } else {
      acc[bikeId] = { totalRating: rating, count: 1 };
    }
    return acc;
  }, {});

  const result = Object.keys(groupedBikeRatings)
    .map((bikeId) => ({
      bikeId: Number(bikeId),
      rating:
        groupedBikeRatings[Number(bikeId)].totalRating /
        groupedBikeRatings[Number(bikeId)].count,
    }))
    .sort((a, b) => b.rating - a.rating);

  const recommendedBikes = result.slice(0, 4);

  if (recommendedBikes.map((item) => item.bikeId).includes(id)) {
    return true;
  }

  return false;
}
