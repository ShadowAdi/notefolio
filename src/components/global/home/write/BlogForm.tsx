"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterInterfaceType } from "@/types/auth/register/RegisterType";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerFormSchema } from "@/zodSchema/RegisterFormSchema";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Eye, EyeClosed } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { blogFormSchema } from "@/zodSchema/blogFormSchema";

const BlogForm = ({ heading, buttonText }: RegisterInterfaceType) => {
  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
     blogCover:"",
     blogDescription:"",
     blogTitle:""
    },
  });

  const coverImageError = form.watch("blogCover");
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof blogFormSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(`/api/blog`, values);
      switch (response.status) {
        case 201:
          form.reset();
          toast.success(response.data.message);
          router.push("/home");
          break;
        case 500:
          form.reset();
          toast.error(response.statusText);
          break;
        case 400:
          form.reset();
          toast.error(response.statusText);
          break;
        case 404:
          form.reset();
          toast.error(response.statusText);
          break;
        default:
          if (response.data.success) {
            toast.success(`Blog Created`);
          } else {
            toast.error(`Failed to create Blog`);
          }
          form.reset();
          router.push("/home");
          break;
      }
    } catch (error) {
      form.reset();
      console.error(`Failed to create blog `, error);
      toast.error(`Failed to create blog ` + error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-w-sm w-full max-w-lg bg-white border border-muted rounded-md px-10 md:px-6 py-8 shadow-md">
      {heading && (
        <h1 className="text-lg font-semibold text-center mb-6">{heading}</h1>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="blogTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tite</FormLabel>
                  <FormControl>
                    <Input placeholder="This is the title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blogDescription"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="This is the bio..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="blogCover"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://image.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {coverImageError && !imgError && (
                  <Image
                    src={coverImageError}
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

          <Button type="submit" className="w-full !cursor-pointer">
            {!loading ? buttonText : "Loading..."}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BlogForm;
