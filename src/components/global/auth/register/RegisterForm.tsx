import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterInterfaceType } from "@/types/auth/register/RegisterType";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerFormSchema } from "@/zodSchema/RegisterFormSchema";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

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
  const url = form.watch("profileUrl");

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    console.log(values);
  }
  return (
    <div className="min-w-sm border-muted bg-[#fafafa] flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
      {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <Input placeholder="adi@gmail.com" type="email" {...field} />
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
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profileUrl"
            render={({ field }) => (
              <div className="flex flex-col items-center space-y-3">
                <FormItem>
                  <FormLabel>Profile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://image.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                {url && (
                  <Image
                    src={url}
                    className="h-full w-full object-cover"
                    height={300}
                    width={1000}
                    alt="Profile Preview"
                  />
                )}
              </div>
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
                    placeholder="Add A Bio..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{buttonText}</Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
