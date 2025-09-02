CREATE TABLE "saved" (
	"userId" uuid NOT NULL,
	"blogId" uuid NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"saved_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saved" ADD CONSTRAINT "saved_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved" ADD CONSTRAINT "saved_blogId_blog_id_fk" FOREIGN KEY ("blogId") REFERENCES "public"."blog"("id") ON DELETE no action ON UPDATE no action;