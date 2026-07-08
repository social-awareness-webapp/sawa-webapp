"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, UploadCloud, X, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CAMPAIGN_CATEGORIES,
  DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "@/lib/campaigns/campaign-schema";
import type {
  CampaignCategory,
  CampaignDraftInput,
  CampaignMediaFiles,
} from "@/types/campaign";

const formSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(TITLE_MIN_LENGTH, `Title must be at least ${TITLE_MIN_LENGTH} characters`)
      .max(TITLE_MAX_LENGTH, `Title must be ${TITLE_MAX_LENGTH} characters or less`),
    category: z.string().min(1, "Please select a category"),
    description: z
      .string()
      .trim()
      .min(
        DESCRIPTION_MIN_LENGTH,
        `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters`
      ),
    goal: z.string().optional(),
    targetAudience: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    confirmGuidelines: z.boolean(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be after the start date",
    path: ["endDate"],
  })
  .refine((data) => data.confirmGuidelines, {
    message: "Please confirm your campaign follows the community guidelines",
    path: ["confirmGuidelines"],
  });

type PostCampaignFormValues = z.infer<typeof formSchema>;

const defaultValues: PostCampaignFormValues = {
  title: "",
  category: "",
  description: "",
  goal: "",
  targetAudience: "",
  startDate: "",
  endDate: "",
  confirmGuidelines: false,
};

function toDraftInput(values: PostCampaignFormValues): CampaignDraftInput {
  return {
    title: values.title.trim(),
    category: values.category
      ? (values.category as CampaignCategory)
      : undefined,
    description: values.description.trim() || undefined,
    goal: values.goal?.trim() || undefined,
    targetAudience: values.targetAudience?.trim() || undefined,
    startDate: values.startDate || undefined,
    endDate: values.endDate || undefined,
  };
}

type PostCampaignFormProps = {
  onSubmit: (input: CampaignDraftInput, media: CampaignMediaFiles) => void;
  onSaveDraft: (input: CampaignDraftInput, media: CampaignMediaFiles) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
};

export function PostCampaignForm({
  onSubmit,
  onSaveDraft,
  onCancel,
  isSubmitting,
  error,
}: PostCampaignFormProps) {
  const form = useForm<PostCampaignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [bannerFile, setBannerFile] = useState<File[]>([]);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);

  const titleLength = form.watch("title")?.length ?? 0;

  const collectMedia = (): CampaignMediaFiles => ({
    banner: bannerFile[0] ?? null,
    supportingDocuments: supportingFiles,
  });

  const handleSaveDraft = () => {
    const values = form.getValues();

    if (!values.title.trim()) {
      form.setError("title", {
        message: "Add a title before saving a draft",
      });
      return;
    }

    onSaveDraft(toDraftInput(values), collectMedia());
  };

  return (
    <Card className="border border-slate-100 bg-white shadow-sm ring-0">
      <CardContent className="p-6 sm:p-8">
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <XCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              onSubmit(toDraftInput(values), collectMedia())
            )}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3748]">
                    Campaign Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      maxLength={TITLE_MAX_LENGTH}
                      placeholder="e.g., Clean Up Soweto Parks"
                      className="h-10 rounded-lg border-slate-200 px-3 text-sm placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage className="text-xs text-red-600" />
                    <span className="ml-auto text-xs text-slate-400">
                      {titleLength} / {TITLE_MAX_LENGTH} characters
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3748]">
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    value={field.value || null}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 px-3 text-sm data-placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CAMPAIGN_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3748]">
                    Campaign Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describe your cause, its impact, and why people should care. Minimum 100 characters."
                      className="rounded-lg border-slate-200 text-sm placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3748]">
                    Campaign Goal
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="e.g., Collect 500 signatures to petition the municipality."
                      className="rounded-lg border-slate-200 text-sm placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-[#2D3748]">
                    Target Audience
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Johannesburg residents aged 18–35"
                      className="h-10 rounded-lg border-slate-200 px-3 text-sm placeholder:text-slate-400 focus-visible:ring-[#2B6CB0]/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      Start Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-10 rounded-lg border-slate-200 px-3 text-sm text-slate-600 focus-visible:ring-[#2B6CB0]/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-[#2D3748]">
                      End Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-10 rounded-lg border-slate-200 px-3 text-sm text-slate-600 focus-visible:ring-[#2B6CB0]/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-[#2D3748]">
                Upload Banner Image
              </p>
              <FileDropzone
                accept="image/png,image/jpeg"
                hint="JPG, PNG — max 5MB"
                maxFiles={1}
                maxSizeMb={5}
                files={bannerFile}
                onFilesChange={setBannerFile}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-[#2D3748]">
                Supporting Documents{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
              </p>
              <FileDropzone
                accept="application/pdf,image/png,image/jpeg"
                hint="Upload PDFs or images · Max 3 files, 10MB each"
                maxFiles={3}
                maxSizeMb={10}
                files={supportingFiles}
                onFilesChange={setSupportingFiles}
              />
            </div>

            <FormField
              control={form.control}
              name="confirmGuidelines"
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
                        I confirm this campaign does not violate SAWA&apos;s
                        community guidelines.
                      </FormLabel>
                      <FormMessage className="text-xs text-red-600" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-slate-200 px-5 text-slate-600 hover:bg-slate-50"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="rounded-lg px-5 text-[#1A365D] hover:bg-[#1A365D]/5"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-lg bg-[#1A365D] py-2.5 text-white hover:bg-[#2a4a7f]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-[#2B6CB0]/5 p-3 text-xs text-[#2B6CB0]">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>
                Your campaign will be reviewed by a SAWA administrator within 2–3
                business days.
              </span>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

type FileDropzoneProps = {
  accept: string;
  hint: string;
  maxFiles: number;
  maxSizeMb: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
};

function FileDropzone({
  accept,
  hint,
  maxFiles,
  maxSizeMb,
  files,
  onFilesChange,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSelect = (selected: FileList | null) => {
    if (!selected || selected.length === 0) {
      return;
    }

    const maxBytes = maxSizeMb * 1024 * 1024;
    const incoming = Array.from(selected);
    const tooLarge = incoming.find((file) => file.size > maxBytes);

    if (tooLarge) {
      setMessage(`"${tooLarge.name}" exceeds the ${maxSizeMb}MB limit.`);
      return;
    }

    const combined = [...files, ...incoming].slice(0, maxFiles);
    setMessage(null);
    onFilesChange(combined);
  };

  const handleRemove = (index: number) => {
    onFilesChange(files.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 px-4 py-6 text-center transition-colors hover:border-[#2B6CB0]/60 hover:bg-slate-50"
      >
        <UploadCloud className="size-6 text-slate-400" />
        <span className="text-sm text-slate-500">
          Drag &amp; drop or{" "}
          <span className="font-medium text-[#2B6CB0]">click to upload</span>
        </span>
        <span className="text-xs text-slate-400">{hint}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        className="hidden"
        onChange={(event) => handleSelect(event.target.files)}
      />

      {message ? <p className="text-xs text-red-600">{message}</p> : null}

      {files.length > 0 ? (
        <ul className="space-y-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600"
            >
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => handleRemove(index)}
                className="ml-2 shrink-0 text-slate-400 transition-colors hover:text-red-600"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
