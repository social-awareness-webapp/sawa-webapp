export async function reviewCampaign(
  campaignId: string,
  decision: "approved" | "rejected",
  notes?: string
): Promise<void> {
  const response = await fetch("/campaigns/approve", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId, decision, notes }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error ?? "Failed to update the campaign review.");
  }
}
