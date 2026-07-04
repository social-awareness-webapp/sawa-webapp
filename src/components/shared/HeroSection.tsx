import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="bg-[#1A365D] py-20 text-white">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#D69E2E]/20 px-4 py-1.5 text-sm font-medium text-[#D69E2E]">
            <Megaphone className="size-4" />
            Community-Powered Awareness
          </div>
          <h1 className="text-4xl leading-tight font-bold">
            Amplify Causes That Matter in Your Community
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/80">
            SAWA connects community members, local businesses, and organisers
            to launch awareness campaigns that drive real change in your
            neighbourhood.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#featured-campaigns"
              className={cn(
                buttonVariants({ variant: "default" }),
                "gap-2 rounded-lg bg-[#D69E2E] px-6 py-2.5 text-white hover:bg-[#D69E2E]/90"
              )}
            >
              Explore Campaigns
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-lg border-white bg-transparent px-6 py-2.5 text-white hover:bg-white/10"
              )}
            >
              Start a Campaign
            </Link>
          </div>
        </div>
        <div className="relative hidden h-72 w-full justify-self-end lg:block lg:h-80 lg:max-w-xl">
          <Image
            src="/homepage_hero.png"
            alt="Community members connecting around shared causes"
            fill
            priority
            className="object-contain object-right"
            sizes="(min-width: 1024px) 576px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
