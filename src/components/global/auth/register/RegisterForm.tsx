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
import { Eye, EyeClosed } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const RegisterForm = ({ heading, buttonText }: RegisterInterfaceType) => {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(`/api/auth/register`, values);
      switch (response.status) {
        case 201:
          form.reset();
          toast.success(response.data.message);
          router.push("/auth/verify-email");
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
            toast.success(`User Created`);
          } else {
            toast.error(`Failed to create User`);
          }
          form.reset();
          router.push("/auth/signin");
          break;
      }
    } catch (error) {
      form.reset();
      console.error(`Failed to register user `, error);
      toast.error(`Failed to register user ` + error);
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
                  <Input type="email" placeholder="adi@gmail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <Button type="submit" className="w-full !cursor-pointer">
            {!loading ? buttonText : "Loading..."}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
