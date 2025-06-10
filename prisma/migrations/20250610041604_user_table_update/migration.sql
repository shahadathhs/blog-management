/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `email_verifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password_resets` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name",
ADD COLUMN     "emailLoginCode" INTEGER,
ADD COLUMN     "emailLoginCodeExpiry" TIMESTAMP(3);

-- DropTable
DROP TABLE "email_verifications";

-- DropTable
DROP TABLE "password_resets";
