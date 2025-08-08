"use client";

import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";

export default function withHOC(Component: ComponentType) {
  return function ProtectedPage(props: any) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/auth/signin");
      }
    }, [loading, isAuthenticated, router]);

    if (loading) {
      return (
        <section className="flex items-center justify-center w-full min-h-[80vh]">
          <Spinner />
        </section>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
