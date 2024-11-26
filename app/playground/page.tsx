import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { type AuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ClientWrapper } from '@/components/playground/client-wrapper';

export const metadata: Metadata = {
  title: "Playground",
  description: "Interactive coding playground",
};

export default async function Page() {
  const session = await getServerSession(authOptions satisfies AuthOptions);
  return <ClientWrapper session={session} />;
}