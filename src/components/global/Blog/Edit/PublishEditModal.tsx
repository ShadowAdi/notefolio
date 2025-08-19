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
import { useAuth } from "@/context/AuthContext";
import { WriteBlogContext } from "@/context/WriteBlogContext";
import { publishBlogSchema } from "@/zodSchema/publishBlogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const PublishEditModal = () => {
  const {
    blogTags,
    setBlogTags,
    blogCover,
    setBlogCover,
    blogDescription,
    blogTitle,
  } = useContext(WriteBlogContext);
  const pathname=usePathname()
  const blogId=pathname.split("/")[2]
  const form = useForm<z.infer<typeof publishBlogSchema>>({
    resolver: zodResolver(publishBlogSchema),
    defaultValues: {
      blogCover: blogCover || "",
      tags: blogTags || [],
    },
  });
  const router = useRouter();
  const { isAuthenticated, token, loading: userLoading, user } = useAuth();

  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  async function onSubmit(values: z.infer<typeof publishBlogSchema>) {
    if (userLoading) {
      return;
    }
    if (!isAuthenticated || !token || !user) {
      toast(`You are not Logged In`);
      router.push(`/auth/signin`);
    }
    if (!blogId) {
      toast(`Blog Id Is Not Provided`)
    }
    setLoading(true);
    const payload = {
      blogTitle,
      blogDescription,
      tags: values.tags,
      blogCover: values.blogCover,
      authorId: user?.id,
    };
    try {
      const response = await axios.patch(`/api/blog/${blogId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.data;
      if (!data.success) {
        toast(`Failed to edit and publish Blog. ${data.error}`);
        form.setValue("blogCover", "");
        form.setValue("tags", []);
        setBlogCover("");
        setBlogTags([]);
      } else {
        form.reset();
        toast.success(`Blog  Saved and Published Successfully`);
        router.back();
      }
    } catch (error) {
      console.error(`Failed to edit Blog: ${error}`);
      toast.error(`Failed to edit Blog: ${error}`);
      form.setValue("blogCover", "");
      form.setValue("tags", []);
      setBlogCover("");
      setBlogTags([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="!cursor-pointer">Save and Publish</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[640px] no-scrollbar publishModal">
        <DialogHeader className="w-full">
          <DialogTitle>Final Steps 🎉</DialogTitle>
          <DialogDescription>
            Add a cover image and tags before publishing your post.
          </DialogDescription>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
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
                        onChange={(e) => {
                          field.onChange(e);
                          setBlogCover(e.target.value);
                          setImgError(false);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {blogCover && !imgError && (
                      <img
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
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const value = tagInput.trim();
                            if (
                              value &&
                              !blogTags.includes(value) &&
                              blogTags.length < 10
                            ) {
                              const newTags = [...blogTags, value];
                              setBlogTags(newTags);
                              form.setValue("tags", newTags);
                            }
                            setTagInput("");
                          }
                        }}
                        type="text"
                        placeholder="tagName"
                      />
                    </FormControl>
                    <div className="mt-3 flex flex-row items-center  flex-wrap w-full gap-2">
                      {blogTags.length > 0 &&
                        blogTags.map((blog, i) => (
                          <Badge
                            key={i}
                            onClick={() => {
                              const updatedTags = blogTags.filter(
                                (_, index) => index !== i
                              );
                              setBlogTags(updatedTags);
                              form.setValue("tags", updatedTags);
                            }}
                            className="px-3 py-2 flex items-center justify-between gap-2 rounded-md cursor-pointer bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                          >
                            <span className="truncate">{blog}</span>
                          </Badge>
                        ))}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full !cursor-pointer">
                {!loading && !userLoading ? "Save and Publish" : "Loading..."}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PublishEditModal;
