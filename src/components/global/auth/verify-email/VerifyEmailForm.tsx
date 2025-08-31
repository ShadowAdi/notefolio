"use client";
import { RegisterInterfaceType } from "@/types/auth/register/RegisterType";
import { verifyEmailFormSchema } from "@/zodSchema/verifyEmailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const VerifyEmailForm = ({ heading, buttonText }: RegisterInterfaceType) => {
  const form = useForm<z.infer<typeof verifyEmailFormSchema>>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof verifyEmailFormSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(`/api/auth/verify-email`, values);
      switch (response.status) {
        case 201:
          form.reset();
          toast.success(response.data.message);
          router.push("/auth/signin");
          break;
        case 500:
          form.reset();
          toast.error(response.data.message);
          break;
        case 400:
          form.reset();
          toast.error(response.data.message);
          break;
        case 410:
          form.reset();
          toast.error(`Click Again. Token Got Expired`);
          break;
        case 404:
          form.reset();
          toast.error(response.data.message);
          break;
        default:
          if (response.data.success) {
            toast.success(`Email Verified`);
          } else {
            toast.error(`Failed to verify User`);
          }
          form.reset();
          router.push("/auth/signin");
          break;
      }
    } catch (error) {
      form.reset();
      console.error(`Failed to verify email `, error);
      toast.error(`Failed to verify email ` + error);
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
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="000000" {...field} />
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

export default VerifyEmailForm;
