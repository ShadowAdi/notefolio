import FormBottom from "@/components/global/auth/FormBottom";
import FormHeader from "@/components/global/auth/FormHeader";
import SharedSection from "@/components/global/auth/SharedSection";
import VerifyEmailForm from "@/components/global/auth/verify-email/VerifyEmailForm";
import React from "react";

const VerifyEmail = ({
  heading = "Verify Email",
  logo = {
    url: "http://localhost:3000",
    title: "Notefolio",
  },
  buttonText = "Verify",
  signupText = "Don't get the mail?",
  signupUrl = "Click",
}) => {
  return (
    <main className="flex w-full h-screen flex-1 items-center justify-between flex-col md:flex-row-reverse relative">
      <section className="w-full py-6 md:w-[60%] h-full  flex items-center justify-center">
        <div className="flex flex-col items-center gap-10 w-full max-w-md px-4">
          <FormHeader logo={logo} />
          <VerifyEmailForm buttonText={buttonText} heading={heading} />
          <FormBottom linkText={"Click"} text={signupText} url={signupUrl} />
        </div>
      </section>
      <section className="w-[0%] md:w-[40%] h-[0] md:h-full">
        <SharedSection />
      </section>
    </main>
  );
};

export default VerifyEmail;
