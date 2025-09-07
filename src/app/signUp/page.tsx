"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function SignUpForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const name = nameRef.current?.value || "";

    const { data, error } = await authClient.signUp.email(
      {
        email: email,
        name: name,
        password: password,
        callbackURL: "/signIn",
      },
      {
        //callbacks
        onRequest: (ctx) => {
          console.log("Request is being made");
          console.log("ctx: ", ctx);
        },
        onSuccess: (ctx) => {
          console.log("Login worked!");
          console.log("ctx: ", ctx);
          redirect("/");
        },
        onError: (ctx) => {
          // display the error message
          console.log("error", ctx.error.message);
        },
      }
    );

    console.log("Data: ", data);
    console.log("error: ", error);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-80 p-6 border rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-semibold">Create Account</h2>

      <Input ref={emailRef} type="email" placeholder="Email" />
      <Input ref={nameRef} type="name" placeholder="name" />
      <Input ref={passwordRef} type="password" placeholder="Password" />

      <Button type="submit">Sign Up</Button>
    </form>
  );
}
