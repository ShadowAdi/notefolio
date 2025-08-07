import RegisterForm from "@/components/global/auth/register/RegisterForm";
import SharedSection from "@/components/global/auth/SharedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Signup = ({
  heading = "Signup",
  logo = {
    url: "http://localhost:3000",
    title: "Notefolio",
  },
  buttonText = "Create Account",
  signupText = "Already Have an Account?",
  signupUrl = "http://localhost:3000/auth/signin",
}) => {
  return (
    <main className="flex w-full h-full flex-1 items-center justify-between flex-col md:flex-row-reverse">
      <section className="h-full flex-1  ">
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-10 lg:justify-start">
            <Link href={logo.url}>
              <span className="text-xl font-bold text-black">{logo.title}</span>
            </Link>
            <RegisterForm buttonText={buttonText} heading={heading} />
            <div className="text-muted-foreground flex justify-center gap-1 text-sm">
              <p>{signupText}</p>
              <Link
                href={signupUrl}
                className="text-primary font-medium hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SharedSection />
    </main>
  );
};

export default Signup;
