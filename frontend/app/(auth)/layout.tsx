import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-xl p-6 bg-white rounded-lg ">{children}</div>
    </main>
  );
}
