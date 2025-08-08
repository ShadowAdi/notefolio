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

const RegisterForm = ({ heading, buttonText }: RegisterInterfaceType) => {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      bio: "",
      email: "",
      password: "",
      profileUrl: "",
    },
  });

  const profileUrl = form.watch("profileUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      const response = await axios.post(`/api/auth/signup`, values);
      switch (response.status) {
        case 201:
          toast.success(response.data.message);
          router.push("/login");
          break;
        case 500:
          toast.error(response.statusText);
          break;
        case 400:
          toast.error(response.statusText);
          break;
        case 404:
          toast.error(response.statusText);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Failed to register user `, error);
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Aditya" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="adi@gmail.com"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:underline cursor-pointer"
                    >
                      {!showPassword ? <EyeClosed /> : <Eye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profileUrl"
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
                {profileUrl && !imgError && (
                  <Image
                    src={profileUrl}
                    onError={() => setImgError(true)}
                    alt="Profile Preview"
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
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add a short bio..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full !cursor-pointer">
            {buttonText}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
