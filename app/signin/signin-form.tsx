import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../auth/SubmitButton";
import LogInWithGitHub from "@/components/LogInWithGitHub";

export default function SignInForm() {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Error: ", error);
      return redirect("/signin?message=Could not authenticate user");
    }

    return redirect("/dashboard");
  };

  return (
    <form>
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your information to sign into an account
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            required
            type="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" required type="password" />
        </div>
        <div className="flex justify-between">
          <SubmitButton
            formAction={signIn}
            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2 w-1/2"
            pendingText="Signing Up..."
          >
            Sign In
          </SubmitButton>
          <LogInWithGitHub />
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?
          <Link className="underline" href="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
