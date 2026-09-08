import { NextRequest, NextResponse } from "next/server";
import Perplexity from "@perplexity-ai/perplexity_ai";

type CollegeGroups = Record<"reach" | "match" | "safety", unknown[]> & { activityPlan: unknown[] };

/* ==========================================================================
   COLLEGE MATCH API - Generates personalized results based on quiz answers
   ========================================================================== */

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();
    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Quiz answers are required" }, { status: 400 });
    }

    // Build a prompt with all the user's answers
    const prompt = `You are an expert college admissions counselor. Based on the following student profile, recommend exactly 9 colleges: 3 reach schools, 3 match schools, and 3 safety schools.

STUDENT PROFILE:
- GPA: ${answers.gpa || "Not specified"}
- Test Scores: ${answers.testScore || "Not specified"}
- Home State: ${answers.state || "Not specified"}
- City or ZIP Code: ${answers.cityZip || "Not specified"}
- Intended Major: ${answers.major || "Undecided"}
- Preferred School Size: ${answers.size || "Any"}
- Preferred Region: ${answers.region || "Anywhere"}
- Campus Setting: ${answers.setting || "Any"}
- Cost Sensitivity: ${answers.cost || "Moderate"}
- Financial Aid Type: ${answers.aidType || "Any"}
- Important Activities: ${answers.activities || "Not specified"}
- Learning Style: ${answers.learning || "Any"}
- Career Goal: ${answers.career || "Not specified"}
- Prestige Importance: ${answers.prestige || "Somewhat important"}
- Social Vibe Preference: ${answers.vibe || "Balanced"}
- Top Priority: ${answers.priority || "Academic reputation"}

Return your response as a JSON object with this exact structure (no markdown, just raw JSON):
{
  "reach": [
    {
      "name": "University Name",
      "location": "City, State",
      "acceptance": "X%",
      "avgGPA": "X.XX",
      "avgSAT": "XXXX",
      "size": "XX,XXX",
      "tuition": "$XX,XXX",
      "category": "reach",
      "url": "https://www.college.edu/",
      "whyGoodFit": "2-3 sentences explaining why this school fits this specific student based on their answers"
    }
  ],
  "match": [...],
  "safety": [...],
  "activityPlan": [
    {
      "title": "Specific action",
      "description": "What the student should do",
      "category": "leadership",
      "priority": "high",
      "estimatedTime": "2 hours per week",
      "estimatedCost": "Free",
      "whyItHelps": "How this improves candidacy for the recommended schools and intended major",
      "targetSchools": ["School from the recommendations"],
      "location": "City, State or Online",
      "distance": "Approximate miles from the student's city or ZIP",
      "format": "In person, Hybrid, or Online",
      "url": "https://real-program-or-resource.org/"
    }
  ]
}

Requirements:
- Use REAL colleges with accurate data
- Use web search to verify current admissions and tuition data
- Include the college's official website as "url"; never invent a URL
- Consider their home state for in-state options if they prefer to stay close
- Match schools to their major interest
- Consider their budget/cost sensitivity
- Match school size and vibe preferences
- Reach schools should have acceptance rates where student has 15-30% chance
- Match schools should have acceptance rates where student has 40-60% chance  
- Safety schools should have acceptance rates where student has 80%+ chance
- Each "whyGoodFit" should reference their specific answers
- Generate exactly 6 concrete activities in "activityPlan" that help this student become a stronger candidate for the recommended colleges
- Mix academic preparation, major exploration, leadership, service, projects, and application readiness as appropriate
- Tie every activity to one or more recommended colleges and explain why it helps
- Respect the student's cost, location, learning style, current activities, and career preferences
- Include a real verified URL when a specific program or resource exists; otherwise omit the URL
- Prioritize active programs within 30 miles of ${answers.cityZip || answers.state || "the student's home"}; use regional or online options only when a strong local option is unavailable
- Every specific local activity must include its city/state, approximate distance, format, and a directly clickable official URL
- Never invent a local organization, program, address, distance, or URL

Return ONLY the JSON object, no other text.`;

    const perplexity = new Perplexity({ apiKey: process.env.PERPLEXITY_API_KEY });
    const response = await perplexity.responses.create({
      preset: "pro-search",
      input: prompt,
      tools: [{ type: "web_search" }],
      instructions: "Use current primary sources, especially official college admissions and tuition pages. Return only the requested valid JSON object with no citations or markdown outside the JSON. Never invent schools, statistics, or URLs.",
    });

    if (!response || response.status !== "completed" || !response.output_text) {
      throw new Error("College research did not complete");
    }

    // Parse the JSON response
    let colleges: CollegeGroups;
    try {
      let jsonText = response.output_text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
      const firstBrace = jsonText.indexOf("{");
      const lastBrace = jsonText.lastIndexOf("}");
      if (firstBrace >= 0 && lastBrace > firstBrace) jsonText = jsonText.slice(firstBrace, lastBrace + 1);
      colleges = JSON.parse(jsonText.trim()) as CollegeGroups;
      const groups: Array<"reach" | "match" | "safety"> = ["reach", "match", "safety"];
      if (!groups.every(group => Array.isArray(colleges[group]) && colleges[group].length >= 3) || !Array.isArray(colleges.activityPlan) || colleges.activityPlan.length < 6) {
        throw new Error("Incomplete college groups");
      }
    } catch {
      console.error("Failed to parse Perplexity response:", response.output_text.slice(0, 1000));
      throw new Error("Failed to parse college recommendations");
    }

    // Optional: Save email and answers to database for lead nurturing
    // if (email) {
    //   const supabase = createClient();
    //   await supabase.from('quiz_submissions').insert({
    //     email,
    //     answers,
    //     results: colleges,
    //     created_at: new Date().toISOString()
    //   });
    // }

    return NextResponse.json(colleges);

  } catch (error) {
    console.error("College match error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
