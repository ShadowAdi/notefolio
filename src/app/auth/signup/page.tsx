import FormBottom from "@/components/global/auth/FormBottom";
import FormHeader from "@/components/global/auth/FormHeader";
import RegisterForm from "@/components/global/auth/register/RegisterForm";
import SharedSection from "@/components/global/auth/SharedSection";
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
            <FormHeader logo={logo} />
            <RegisterForm buttonText={buttonText} heading={heading} />
            <FormBottom linkText={"Signin"} text={signupText} url={signupUrl} />
          </div>
        </div>
      </section>
      <SharedSection />
    </main>
  );
};

export default Signup;
