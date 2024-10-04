import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getBikes() {
  const bikes = await prisma.bikes.findMany();

  return bikes;
}

export async function getBike(id: number) {
  const bike = await prisma.bikes.findUnique({
    where: {
      id,
    },
  });

  return bike;
}

export async function getBikeRatings(id: number) {
  const bikeRatings = await prisma.bikeRatings.findMany({
    where: { bikeId: id },
  });

  return bikeRatings || [];
}

export async function checkIfBikeIsRecommended(id: number): Promise<boolean> {
  const orderedBikes = (await getBikes()).sort(
    (a, b) => b.average_rating - a.average_rating
  );

  const isRecommended = orderedBikes.findIndex((item) => item.id === id) <= 3;

  return isRecommended;
}
