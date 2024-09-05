"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useGetData from "../../lib/hooks/useGet";
import { mapSimpleSession } from "../../lib/modelmapper";

export function WithAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const {
      expect: session,
      isLoading,
      error,
    } = useGetData("/session", mapSimpleSession);

    useEffect(() => {
      if (!isLoading) {
        if (
          Object.keys(error).length != 0 ||
          !session ||
          String(session.id) !== localStorage.getItem("cookie")
        ) {
          router.push("/login");
        } else {
          setIsAuthorized(true);
        }
      }
    }, [session, isLoading, error, router]);

    if (isLoading) {
      return <div>Chargement...</div>;
    }

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };
}
