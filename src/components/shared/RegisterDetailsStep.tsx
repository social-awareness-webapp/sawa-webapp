"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PasswordStrengthMeter } from "@/components/shared/PasswordStrengthMeter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirm_password: z.string(),
    accept_terms: z.boolean(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  })
  .refine((data) => data.accept_terms, {
    message: "You must accept the terms and conditions",
    path: ["accept_terms"],
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
  const form = useForm<RegisterDetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      accept_terms: false,
    },
  });

  const passwordValue = form.watch("password");

  return (
    <Card className="rounded-2xl border border-slate-100 shadow-sm">
      <CardContent className="space-y-6 p-8">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-[#2D3748]">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-500">
            Signing up as a{" "}
            <span className="font-semibold text-[#2D3748]">
              {roleLabels[role]}
            </span>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Jane"
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
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        className="rounded-lg border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3748]">
                    Email Address <span className="text-red-500">*</span>
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
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Create a password (min. 8 characters)"
                      className="rounded-lg border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30"
                      {...field}
                    />
                  </FormControl>
                  <PasswordStrengthMeter password={passwordValue} />
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
                    Confirm Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
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
              name="accept_terms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal text-slate-600">
                        I agree to SAWA&apos;s{" "}
                        <Link
                          href="/terms"
                          className="text-[#2B6CB0] underline hover:no-underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-[#2B6CB0] underline hover:no-underline"
                        >
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-[#1A365D] px-6 text-[#1A365D] hover:bg-[#1A365D]/5"
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
