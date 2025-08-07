import Link from "next/link";
import React from "react";

interface FormBottom {
  text: string;
  url: string;
  linkText: string;
}

const FormBottom = ({ text, url, linkText }: FormBottom) => {
  return (
    <div className="text-muted-foreground flex justify-center gap-1 text-sm">
      <p>{text}</p>
      <Link href={url} className="text-primary font-medium hover:underline">
        {linkText}
      </Link>
    </div>
  );
};

export default FormBottom;
