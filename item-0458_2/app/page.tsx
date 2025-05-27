import { SignedIn, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import LoginPage from "./login/page";

export default function Home() {
  return (
    <div className="w-auto h-screen justify-center items-center flex flex-col max-w-7xl bg-white text-black">
      <LoginPage />
      <SignedIn>
        <div className="bg-amber-300 p-4 rounded-2xl hover:bg-amber-200">
          <SignOutButton redirectUrl="/login" />
        </div>
      </SignedIn>
    </div>
  );
}
