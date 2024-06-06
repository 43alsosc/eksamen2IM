"use client";

import { createClient } from "@/utils/supabase/client";

import { Github, GithubIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function LogInWithGitHub() {
  const supabase = createClient();
  const loginWithGitHub = () => {
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button
      onClick={loginWithGitHub}
      className="bg-black text-background dark:text-white text-center border border-foreground/20 rounded-md px-4 py-2 mb-2 w-1/2 gap-1"
    >
      <Github />
      Singin with GitHub
    </Button>
  );
}
