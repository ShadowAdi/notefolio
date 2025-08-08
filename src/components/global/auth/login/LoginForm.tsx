"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginInterfaceType } from "@/types/auth/Login/LoginType";
import { loginFomrSchema } from "@/zodSchema/LoginFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const LoginForm = ({ heading, buttonText }: LoginInterfaceType) => {
  const form = useForm<z.infer<typeof loginFomrSchema>>({
    resolver: zodResolver(loginFomrSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(values: z.infer<typeof loginFomrSchema>) {
    console.log(values);
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
            {buttonText}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
