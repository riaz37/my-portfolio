import { Metadata } from "next";
import { ClientWrapper } from '@/components/playground/client-wrapper';

export const metadata: Metadata = {
  title: "Playground",
  description: "Interactive coding playground",
};

export default function Page() {
  return <ClientWrapper />;
}