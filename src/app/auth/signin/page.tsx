import FormBottom from "@/components/global/auth/FormBottom";
import FormHeader from "@/components/global/auth/FormHeader";
import LoginForm from "@/components/global/auth/login/LoginForm";
import SharedSection from "@/components/global/auth/SharedSection";
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
  signupUrl = "http://localhost:3000/auth/signup",
  verifyEmailUrl = "http://localhost:3000/auth/verify-email",
}) => {
  return (
    <main className="flex w-full h-screen flex-1 items-center justify-between flex-col md:flex-row relative">
      <section className="w-full md:w-[60%] h-full  flex items-center justify-center">
        <div className="flex flex-col items-center gap-10 w-full max-w-md px-4">
          <FormHeader logo={logo} />
          <LoginForm buttonText={buttonText} heading={heading} />
          <div className="flex flex-col space-y-2">
          <FormBottom linkText={"Signup"} text={signupText} url={signupUrl} />
          <FormBottom
            linkText={"Verify"}
            text={"Email Not Verified?"}
            url={verifyEmailUrl}
          />

          </div>
        </div>
      </section>
      <section className="w-[0%] md:w-[40%] h-[0] md:h-full">
        <SharedSection />
      </section>{" "}
    </main>
  );
};

export default Signin;
