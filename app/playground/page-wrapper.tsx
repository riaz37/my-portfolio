import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PlaygroundPage from "./page";
import { Session } from "next-auth";

export default async function PlaygroundWrapper() {
  const session = await getServerSession(authOptions);
  
  return <PlaygroundPage session={session} />;
}
