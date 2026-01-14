-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "google_id" TEXT,
ADD COLUMN     "reset_password_code" TEXT,
ADD COLUMN     "reset_password_code_expires" TIMESTAMP(3),
ADD COLUMN     "verification_code" TEXT,
ADD COLUMN     "verification_code_expires" TIMESTAMP(3),
ALTER COLUMN "password_hash" DROP NOT NULL;
