-- CreateTable
CREATE TABLE "FailLogin" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FailLogin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FailLogin_ip_key" ON "FailLogin"("ip");