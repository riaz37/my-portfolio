import { Metadata } from "next";
import { Session } from "next-auth";
import { ClientWrapper } from '@/components/playground/client-wrapper';

export const metadata: Metadata = {
  title: "Playground",
  description: "Interactive coding playground",
};

interface PageProps {
  session: Session | null;
}

export default function Page({ session }: PageProps) {
  return <ClientWrapper session={session} />;
}