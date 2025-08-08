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
    <main className="flex w-full h-screen flex-1 items-center justify-between flex-col md:flex-row-reverse relative">
      <section className="w-full py-6 md:w-[60%] h-full  flex items-center justify-center">
        <div className="flex flex-col items-center gap-10 w-full max-w-md px-4">
          <FormHeader logo={logo} />
          <RegisterForm buttonText={buttonText} heading={heading} />
          <FormBottom linkText={"Signin"} text={signupText} url={signupUrl} />
        </div>
      </section>
      <section className="w-[0%] md:w-[40%] h-[0] md:h-full">
        <SharedSection />
      </section>
    </main>
  );
};

export default Signup;
