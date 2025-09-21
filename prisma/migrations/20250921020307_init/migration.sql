-- CreateTable
CREATE TABLE "public"."FormSession" (
    "id" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "currentFieldIndex" INTEGER NOT NULL DEFAULT 0,
    "session_lang" TEXT NOT NULL,
    "sessionStarted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "FormSession_pkey" PRIMARY KEY ("id")
);
