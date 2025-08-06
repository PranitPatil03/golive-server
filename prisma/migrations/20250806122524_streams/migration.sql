/*
  Warnings:

  - A unique constraint covering the columns `[channelName]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'VIEWER', 'STREAMER');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED', 'SUBSCRIBERS_ONLY');

-- CreateEnum
CREATE TYPE "StreamLatency" AS ENUM ('NORMAL', 'LOW', 'ULTRA_LOW');

-- CreateEnum
CREATE TYPE "StreamStatus" AS ENUM ('CREATED', 'LIVE', 'ENDED', 'SCHEDULED', 'ERROR');

-- CreateEnum
CREATE TYPE "StreamQuality" AS ENUM ('SOURCE', 'HD_1080P', 'HD_720P', 'SD_480P', 'SD_360P', 'SD_240P');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "channelName" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "subscriptionsCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "stream" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "StreamStatus" NOT NULL DEFAULT 'CREATED',
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "streamKey" TEXT,
    "streamUrl" TEXT,
    "thumbnailUrl" TEXT,
    "previewImageUrl" TEXT,
    "recordingUrl" TEXT,
    "hlsPlaylistUrl" TEXT,
    "currentViewers" INTEGER NOT NULL DEFAULT 0,
    "peakViewers" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalDuration" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stream_metadata" (
    "id" TEXT NOT NULL,
    "tags" TEXT[],
    "categories" TEXT[],
    "language" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
    "streamLatency" "StreamLatency" NOT NULL DEFAULT 'NORMAL',
    "enableChat" BOOLEAN NOT NULL DEFAULT true,
    "enableRecording" BOOLEAN NOT NULL DEFAULT false,
    "chatMode" TEXT NOT NULL DEFAULT 'everyone',
    "scheduleDate" TIMESTAMP(3),
    "scheduledStartTime" TIMESTAMP(3),
    "scheduledEndTime" TIMESTAMP(3),
    "streamingKey" TEXT,
    "streamingUrl" TEXT,
    "backupStreamingUrl" TEXT,
    "maxBitrate" INTEGER,
    "maxResolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "streamId" TEXT NOT NULL,

    CONSTRAINT "stream_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stream_quality_option" (
    "id" TEXT NOT NULL,
    "quality" "StreamQuality" NOT NULL,
    "resolution" TEXT NOT NULL,
    "bitrate" INTEGER NOT NULL,
    "fps" INTEGER NOT NULL,
    "codec" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isAdaptive" BOOLEAN NOT NULL DEFAULT false,
    "adaptiveBitrates" INTEGER[],
    "adaptiveResolutions" TEXT[],
    "streamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stream_quality_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "streamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stream_view" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "duration" INTEGER,
    "streamId" TEXT NOT NULL,

    CONSTRAINT "stream_view_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stream_streamKey_key" ON "stream"("streamKey");

-- CreateIndex
CREATE UNIQUE INDEX "stream_metadata_streamingKey_key" ON "stream_metadata"("streamingKey");

-- CreateIndex
CREATE UNIQUE INDEX "stream_metadata_streamId_key" ON "stream_metadata"("streamId");

-- CreateIndex
CREATE UNIQUE INDEX "stream_quality_option_streamId_quality_key" ON "stream_quality_option"("streamId", "quality");

-- CreateIndex
CREATE INDEX "chat_message_streamId_createdAt_idx" ON "chat_message"("streamId", "createdAt");

-- CreateIndex
CREATE INDEX "stream_view_streamId_joinedAt_idx" ON "stream_view"("streamId", "joinedAt");

-- CreateIndex
CREATE INDEX "notification_userId_createdAt_idx" ON "notification"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_channelName_key" ON "user"("channelName");

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stream_metadata" ADD CONSTRAINT "stream_metadata_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stream_quality_option" ADD CONSTRAINT "stream_quality_option_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stream_view" ADD CONSTRAINT "stream_view_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stream_view" ADD CONSTRAINT "stream_view_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
