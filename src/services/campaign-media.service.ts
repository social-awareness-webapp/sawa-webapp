import { createClient } from "@/lib/supabase/client";

const CAMPAIGN_MEDIA_BUCKET = "campaign-media";

type UploadCampaignMediaParams = {
  userId: string;
  banner: File | null;
  supportingFiles: File[];
};

export type UploadCampaignMediaResult = {
  bannerImageUrl?: string;
  supportingDocuments?: string[];
};

function buildObjectPath(userId: string, folder: string, file: File) {
  const extension =
    file.name.includes(".") && !file.name.endsWith(".")
      ? file.name.split(".").pop()
      : "bin";

  return `${userId}/${folder}/${crypto.randomUUID()}.${extension}`;
}

export async function uploadCampaignMedia({
  userId,
  banner,
  supportingFiles,
}: UploadCampaignMediaParams): Promise<UploadCampaignMediaResult> {
  const supabase = createClient();

  const uploadFile = async (file: File, folder: string) => {
    const path = buildObjectPath(userId, folder, file);

    const { error } = await supabase.storage
      .from(CAMPAIGN_MEDIA_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    return supabase.storage.from(CAMPAIGN_MEDIA_BUCKET).getPublicUrl(path).data
      .publicUrl;
  };

  const bannerImageUrl = banner
    ? await uploadFile(banner, "banners")
    : undefined;

  const supportingDocuments =
    supportingFiles.length > 0
      ? await Promise.all(
          supportingFiles.map((file) => uploadFile(file, "documents"))
        )
      : undefined;

  return { bannerImageUrl, supportingDocuments };
}
