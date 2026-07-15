"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/services/profile.service";
import type { ProfileDetail } from "@/types/profile";

type ProfilePersonalInfoFormProps = {
  profile: ProfileDetail;
};

const BIO_MAX_LENGTH = 280;

export function ProfilePersonalInfoForm({
  profile,
}: ProfilePersonalInfoFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [bio, setBio] = useState(profile.bio);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile(profile.id, {
        firstName,
        lastName,
        phone,
        location,
        bio,
      });
      setSuccess(true);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while saving your profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      id="personal-information"
      className="scroll-mt-24 border border-slate-100 bg-white p-6 shadow-sm ring-0"
    >
      <h3 className="text-base font-semibold text-[#1A365D]">
        Personal Information
      </h3>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="h-10"
              autoComplete="given-name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="h-10"
              autoComplete="family-name"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            value={profile.email}
            disabled
            className="h-10"
            autoComplete="email"
          />
          <p className="text-xs text-slate-400">
            Your email address can&apos;t be changed here.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+27 XX XXX XXXX"
            className="h-10"
            autoComplete="tel"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City, Province"
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(event) =>
              setBio(event.target.value.slice(0, BIO_MAX_LENGTH))
            }
            placeholder="Tell the SAWA community about yourself and the causes you care about."
            className="min-h-24"
          />
          <p className="text-right text-xs text-slate-400">
            {bio.length}/{BIO_MAX_LENGTH}
          </p>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? (
          <p className="text-sm text-emerald-600">
            Your profile has been updated.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A365D] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a4a7f] disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </Card>
  );
}
