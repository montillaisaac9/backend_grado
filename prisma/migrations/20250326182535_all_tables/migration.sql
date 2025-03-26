-- AlterTable
ALTER TABLE "Stats" ADD COLUMN     "avgDishRating" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "DishRating" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "dishId" INTEGER NOT NULL,
    "statsId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DishRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DishStats" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DishStats_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "DishRating_userId_dishId_statsId_key" ON "DishRating"("userId", "dishId", "statsId");

-- CreateIndex
CREATE INDEX "_DishStats_B_index" ON "_DishStats"("B");

-- AddForeignKey
ALTER TABLE "DishRating" ADD CONSTRAINT "DishRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishRating" ADD CONSTRAINT "DishRating_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DishRating" ADD CONSTRAINT "DishRating_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "Stats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishStats" ADD CONSTRAINT "_DishStats_A_fkey" FOREIGN KEY ("A") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishStats" ADD CONSTRAINT "_DishStats_B_fkey" FOREIGN KEY ("B") REFERENCES "Stats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
