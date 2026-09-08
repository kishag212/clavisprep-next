import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type GoalActivity = {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  estimatedTime?: string;
  estimatedCost?: string;
  whyItHelps?: string;
  targetSchools?: string[];
  location?: string;
  distance?: string;
  format?: string;
  url?: string;
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  const { data: subscription } = await supabase.from("subscriptions").select("status").eq("user_id", user.id).maybeSingle();
  if (!subscription || !["active", "trialing"].includes(subscription.status)) {
    return NextResponse.json({ error: "A Pro subscription is required." }, { status: 403 });
  }

  const body = await request.json();
  const activities: GoalActivity[] = Array.isArray(body.activities) ? body.activities.slice(0, 10) : [];
  if (!activities.length) return NextResponse.json({ error: "No activities were provided." }, { status: 400 });

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const { data: profile } = await supabase.from("user_profiles").select("grade").eq("user_id", user.id).maybeSingle();
  const { data: existing } = await supabase.from("roadmap_activities").select("tasks").eq("user_id", user.id).eq("month_key", monthKey).maybeSingle();

  const importedTasks = activities.filter(item => item.title && item.description).map(item => ({
    title: item.title,
    description: `${item.description}${item.location ? ` Location: ${item.location}${item.distance ? ` (${item.distance})` : ""}${item.format ? ` - ${item.format}` : ""}.` : ""}`,
    category: item.category || "college-prep",
    priority: ["high", "medium", "low"].includes(item.priority || "") ? item.priority : "medium",
    estimated_time: item.estimatedTime || "Time varies",
    estimated_cost: item.estimatedCost || "Cost varies",
    why_recommended: item.whyItHelps || "This supports your target-college goals.",
    pathway: `Target colleges: ${(item.targetSchools || []).join(", ")}`,
    evidence: "Record what you completed, learned, or produced.",
    alternative: "Use the roadmap feedback option if time, cost, or access is a barrier.",
    ...(item.url && /^https?:\/\//i.test(item.url) ? { url: item.url } : { search_query: item.title }),
    completed: false,
    status: "active",
    outcome: null,
    source: "college-match",
  }));

  const currentTasks = Array.isArray(existing?.tasks) ? existing.tasks : [];
  const existingTitles = new Set(currentTasks.map((task: { title?: string }) => task.title?.toLowerCase()));
  const mergedTasks = [...currentTasks, ...importedTasks.filter(task => !existingTitles.has(task.title?.toLowerCase()))];

  const { error } = await supabase.from("roadmap_activities").upsert({
    user_id: user.id,
    month_key: monthKey,
    month_label: monthLabel,
    grade: profile?.grade || "",
    tasks: mergedTasks,
  }, { onConflict: "user_id,month_key" });

  if (error) return NextResponse.json({ error: "The activities could not be added to your roadmap." }, { status: 500 });
  return NextResponse.json({ success: true, imported: importedTasks.length });
}
