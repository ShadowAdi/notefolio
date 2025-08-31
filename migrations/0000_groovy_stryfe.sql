CREATE TABLE "blog" (
	"id" uuid PRIMARY KEY NOT NULL,
	"blogTitle" text NOT NULL,
	"blogDescription" text NOT NULL,
	"blogCover" text NOT NULL,
	"authorId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "blog_blogTitle_unique" UNIQUE("blogTitle")
);
--> statement-breakpoint
CREATE TABLE "blogDownvote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blog_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogUpvote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blog_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussion" (
	"description" text NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"blodId" uuid NOT NULL,
	"authordId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "followers" (
	"followerId" uuid NOT NULL,
	"followingId" uuid NOT NULL,
	CONSTRAINT "followers_followerId_followingId_pk" PRIMARY KEY("followerId","followingId")
);
--> statement-breakpoint
CREATE TABLE "blogTags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blogId" uuid NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"profileUrl" text DEFAULT '',
	"password" varchar NOT NULL,
	"bio" text,
	"isEmailVerified" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"otp" varchar NOT NULL,
	"userId" uuid NOT NULL,
	"expiresIn" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Verification_otp_unique" UNIQUE("otp")
);
--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_authorId_User_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogDownvote" ADD CONSTRAINT "blogDownvote_blog_id_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogDownvote" ADD CONSTRAINT "blogDownvote_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogUpvote" ADD CONSTRAINT "blogUpvote_blog_id_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogUpvote" ADD CONSTRAINT "blogUpvote_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_blodId_blog_id_fk" FOREIGN KEY ("blodId") REFERENCES "public"."blog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_authordId_User_id_fk" FOREIGN KEY ("authordId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_followerId_User_id_fk" FOREIGN KEY ("followerId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_followingId_User_id_fk" FOREIGN KEY ("followingId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogTags" ADD CONSTRAINT "blogTags_blogId_blog_id_fk" FOREIGN KEY ("blogId") REFERENCES "public"."blog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;