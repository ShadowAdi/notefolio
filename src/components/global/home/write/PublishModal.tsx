"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { blogFormSchema } from "@/zodSchema/blogFormSchema";
import { publishBlogSchema } from "@/zodSchema/publishBlogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const PublishModal = () => {
  const form = useForm<z.infer<typeof publishBlogSchema>>({
    resolver: zodResolver(publishBlogSchema),
    defaultValues: {
      blogCover: "",
      tags: [],
    },
  });
  const blogCover = form.watch("blogCover");
  const router=useRouter()

  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blogTags, setBlogTags] = useState<string[]>([]);

  
  // async function onSubmit(values: z.infer<typeof blogFormSchema>) {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`/api/auth/register`, values);
  //     switch (response.status) {
  //       case 201:
  //         form.reset();
  //         toast.success(response.data.message);
  //         router.push("/auth/signin");
  //         break;
  //       case 500:
  //         form.reset();
  //         toast.error(response.statusText);
  //         break;
  //       case 400:
  //         form.reset();
  //         toast.error(response.statusText);
  //         break;
  //       case 404:
  //         form.reset();
  //         toast.error(response.statusText);
  //         break;
  //       default:
  //         if (response.data.success) {
  //           toast.success(`User Created`);
  //         } else {
  //           toast.error(`Failed to create User`);
  //         }
  //         form.reset();
  //         router.push("/auth/signin");
  //         break;
  //     }
  //   } catch (error) {
  //     form.reset();
  //     console.error(`Failed to register user `, error);
  //     toast.error(`Failed to register user ` + error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Publish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Final Steps 🎉</DialogTitle>
          <DialogDescription>
            Add a cover image and tags before publishing your post.
          </DialogDescription>

          {/* <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="blogCover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://image.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {blogCover && !imgError && (
                      <Image
                        src={blogCover}
                        onError={() => setImgError(true)}
                        alt="Cover Image"
                        height={300}
                        width={600}
                        className="mt-3 rounded-md border object-cover w-full max-h-[300px]"
                      />
                    )}
                    {imgError && (
                      <p className="text-sm text-red-500 mt-2">
                        Couldn't load image from the provided URL.
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const value = e.currentTarget.value.trim();
                            if (
                              value &&
                              !blogTags.includes(value) &&
                              blogTags.length < 10
                            ) {
                              const newTags = [...blogTags, value];
                              setBlogTags(newTags);
                              form.setValue("tags", newTags);
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                        type="text"
                        placeholder="tagName"
                        {...field}
                      />
                    </FormControl>
                    <div className="w-full flex flex-row items-center gap-3 ">
                      {blogTags.length > 0 &&
                        blogTags.map((blog, i) => (
                          <Badge
                            key={i}
                            className="px-5 py-5 rounded-md flex items-center justify-center"
                          >
                            {blog}
                          </Badge>
                        ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PublishModal;
