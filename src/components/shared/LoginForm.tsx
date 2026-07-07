"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff, Globe, Lock, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { LoginFormData } from "@/types/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => void;
  onGoogleSignIn: () => void;
  isLoading: boolean;
  isGoogleLoading: boolean;
  error: string | null;
  successMessage: string | null;
};

export function LoginForm({
  onSubmit,
  onGoogleSignIn,
  isLoading,
  isGoogleLoading,
  error,
  successMessage,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Card className="border border-slate-100 shadow-sm">
      <CardContent className="space-y-6 p-8">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#1A365D]/10">
            <Lock className="size-5 text-[#1A365D]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-[#2D3748]">Welcome Back</h1>
            <p className="text-sm text-slate-500">
              Sign in to your SAWA account to continue.
            </p>
          </div>
        </div>

        <Separator />

        {successMessage ? (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert variant="destructive">
            <XCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3748]">
                    Email Address *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="rounded-lg border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3748]">
                    Password *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="rounded-lg border-slate-200 px-3 py-2 pr-10 text-sm placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-[#2B6CB0] hover:underline"
              >
                Forgot password
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full rounded-lg bg-[#1A365D] py-2.5 text-white hover:bg-[#2a4a7f]"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-400">
            — or continue with —
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
          onClick={onGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        >
          <Globe className="size-4" />
          {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[#2B6CB0] hover:underline"
          >
            Join SAWA →
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
