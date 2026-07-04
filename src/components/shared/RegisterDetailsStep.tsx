"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, XCircle } from "lucide-react";
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
import type { RegisterDetailsFormData, UserRole } from "@/types/auth";

const detailsSchema = z
  .object({
    full_name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

const roleLabels: Record<UserRole, string> = {
  user: "Community Member",
  business_owner: "Small Business Owner",
};

type RegisterDetailsStepProps = {
  role: UserRole;
  onSubmit: (data: RegisterDetailsFormData) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
};

export function RegisterDetailsStep({
  role,
  onSubmit,
  onBack,
  isLoading,
  error,
}: RegisterDetailsStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterDetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  return (
    <Card className="border border-slate-100 shadow-sm">
      <CardContent className="space-y-6 p-8">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-[#1A365D]">Your Details</h1>
          <p className="text-sm text-slate-500">
            Creating your account as{" "}
            <span className="font-medium text-[#2D3748]">
              {roleLabels[role]}
            </span>
            .
          </p>
        </div>

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
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3748]">
                    Full Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
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
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
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
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3748]">
                    Confirm Password *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="rounded-lg border-slate-200 px-3 py-2 pr-10 text-sm placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
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
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-[#1A365D] text-[#1A365D] hover:bg-[#1A365D]/5"
                onClick={onBack}
                disabled={isLoading}
              >
                ← Back
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-lg bg-[#1A365D] py-2.5 text-white hover:bg-[#2a4a7f]"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
