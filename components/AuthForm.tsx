"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3, "Name must be at least have 3 characters") : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8,"Password must have at least 8 characters"),
  });
};
const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    console.log('entering the handleSubmit')
    try {
      console.log('inside try block');
      if (type === "sign-up") {
        console.log("inside try if block");
        toast.success('Account created successfully');
        router.push('/signin');
      } else {
        console.log('inside try else block');
        toast.success('Sign In successful');
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
    console.log('exiting the handleSubmit')
  }

  const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10 justify-center items-center">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width="38" height="32" />
          <h2 className="text-primary-100">InterviewRoom</h2>
        </div>
        <h3>Practice your job interviews with Ai</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full mt-4 form space-y-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name='name'
                label="User Name:"
                placeholder="Your name"
              />
            )}
             <FormField
                control={form.control}
                name='email'
                label="email:"
                placeholder="Enter Your Email"
                type="email"
              />
               <FormField
                control={form.control}
                name='password'
                label="Password:"
                placeholder="Enter Your Password"
                type="password"
              />
            <Button type="submit" className="btn" >
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account?"}

          <Link
            href={!isSignIn ? "/signin" : "/signup"}
            className="font-bold text-primary-100 ml-2"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
