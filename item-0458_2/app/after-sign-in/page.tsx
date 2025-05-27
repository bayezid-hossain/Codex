// "use client";
// import { useEffect } from "react";
// import { auth, currentUser } from "@clerk/nextjs/server";
// import { useRouter } from "next/navigation"; // Correct import for app router
// import { toast } from "sonner";

// async function updateUserDatabase() {
//   // Renamed for clarity
//   const { userId } = await auth();
//   const user = await currentUser();
//   const name = user?.fullName!;
//   const email = user?.primaryEmailAddress?.emailAddress;
//   console.log(name, email, userId);
//   try {
//     const promise = fetch(
//       "http://localhost:3000/api/update-user",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name,
//           email: email,
//           clerk_user_id: userId,
//           created_at: new Date(), // Use new Date() for current timestamp
//         }),
//       }
//     );
//     toast.promise(promise, {
//       loading: "Updating user...",
//       success: "User updated successfully!",
//       error: "Failed to update user",
//     });
//   } catch (error) {
//     console.log(
//       "Error updating the user in the database: ",
//       error
//     );
//   }
// }
// function AfterSignInPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const callUpdate = async () => {
//       await updateUserDatabase();
//       console.log("hello");
//       router.push("/"); // Redirect back to the main page or somewhere else
//     };

//     callUpdate();
//   }, [router]);

//   return (
//     <div>
//       <p>Processing after sign-in...</p>
//       {/* You might want to show a loading indicator */}
//     </div>
//   );
// }

// export default AfterSignInPage;
