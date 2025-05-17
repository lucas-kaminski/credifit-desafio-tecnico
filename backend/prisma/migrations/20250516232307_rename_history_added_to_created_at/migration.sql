/*
  Warnings:

  - You are about to drop the column `ADDED` on the `History` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "ADDED",
ADD COLUMN     "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
