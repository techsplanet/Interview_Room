import Link from "next/link";
import React, { ReactNode } from "react";
import Image from "next/image";
import { isAuthenticated } from "@/lib/actions/auth_action";
import { redirect } from "next/navigation";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if(!isUserAuthenticated) redirect('/signin');
  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">InterviewRoom</h2>
        </Link>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
