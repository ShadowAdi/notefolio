import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Signin = ({
  heading = "Signin",
  logo = {
    url: "http://localhost:3000",
    title: "Notefolio",
  },
  buttonText = "Login Account",
  signupText = "Dont have an account?",
  signupUrl = "http://localhost:3000/auth/signin",
}) => {
  return (
    <main className="flex w-full h-full flex-1 items-center justify-around flex-col md:flex-row ">
      <section className="h-full flex-1 w-1/2 ">
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-6 lg:justify-start">
            <Link href={logo.url}>
              <span className="text-xl font-bold text-black">{logo.title}</span>
            </Link>
            <div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
              {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
              <div className="flex w-full flex-col gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  className="text-sm"
                  required
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  className="text-sm"
                  required
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Password"
                  className="text-sm"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {buttonText}
              </Button>
            </div>
            <div className="text-muted-foreground flex justify-center gap-1 text-sm">
              <p>{signupText}</p>
              <Link
                href={signupUrl}
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-1/2 flex-1 bg-red-600 h-full">
<Image src="https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9mZmljZXxlbnwwfHwwfHx8MA%3D%3D" alt="Ofice image" className="h-full flex-1 w-full" height={1000} width={1000}/>
      </section>
    </main>
  );
};

export default Signin;
