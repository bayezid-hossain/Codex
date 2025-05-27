"use client";

import Avatar from "@/app/components/Avatar";
import {
  SignedIn,
  SignIn,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { toast } from "sonner";
import { useEffect } from "react";

function LoginPage() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    // This will run when auth state changes and user is signed in
    if (isLoaded && isSignedIn && userId) {
      handleSignIn();
    }
  }, [isLoaded, isSignedIn, userId]);

  const handleSignIn = async () => {
    const name = user?.fullName;
    const email = user?.primaryEmailAddress?.emailAddress;

    console.log(name, email);
    try {
      const promise = fetch("/api/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          clerk_user_id: userId,
          created_at: new Date(),
        }),
      });

      toast.promise(promise, {
        loading: "Updating user...",
        success: "User updated successfully!",
        error: "Failed to update user",
      });
    } catch (error) {
      console.log(
        "Error updating the user in the database: ",
        error
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-[#64B5F5] py-10 md:py-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col items-center justify-center space-y-5 text-white">
          <div className="rounded-full bg-white p-5">
            <Avatar
              seed="KARTHIK Support Agent"
              className="h-60 w-60"
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl">Assistly</h1>
            <h2 className="text-base font-light">
              Your Customisable AI Chat Agent
            </h2>
            <h3 className="my-5 font-bold">
              Sign in to get started
            </h3>
          </div>
        </div>
        <SignIn routing="hash" fallbackRedirectUrl="/" />
      </div>
    </div>
  );
}

export default LoginPage;
