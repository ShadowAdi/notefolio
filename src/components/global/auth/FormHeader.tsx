import Link from "next/link";
import React from "react";

interface LogoType {
  logo: { url: string; title: string };
}
const FormHeader = ({ logo }: LogoType) => {
  return (
    <Link href={logo.url}>
      <span className="text-2xl font-bold text-black">{logo.title}</span>
    </Link>
  );
};

export default FormHeader;
