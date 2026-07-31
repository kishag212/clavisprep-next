"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Question = {
  id: string;
  prompt: string;
  helper: string;
  options: string[];
};

const QUESTIONS: Question[] = [
  {
    id: "grade",
    prompt: "What grade are you in?",
    helper: "This helps us time your roadmap correctly.",
    options: ["Freshman", "Sophomore", "Junior", "Senior"],
  },
  {
    id: "gpa",
    prompt: "What's your unweighted GPA?",
    helper: "A rough estimate is fine.",
    options: ["Below 3.0", "3.0 – 3.4", "3.5 – 3.7", "3.8+"],
  },
  {
    id: "interest",
    prompt: "What are you most interested in studying?",
    helper: "Pick whichever feels closest right now.",
    options: ["STEM", "Business", "Humanities & Arts", "Undecided"],
  },
  {
    id: "location",
    prompt: "Where would you like to go to college?",
    helper: "We'll factor this into your school list.",
    options: ["In-state", "Out-of-state", "No preference"],
  },
  {
    id: "size",
    prompt: "What size school are you looking for?",
    helper: "Think about the campus feel you want.",
    options: ["Small (<5k)", "Medium (5k–15k)", "Large (15k+)", "No preference"],
  },
  {
    id: "aid",
    prompt: "How important is financial aid to your decision?",
    helper: "Be honest — this shapes your safety schools.",
    options: ["Very important", "Somewhat important", "Not a major factor"],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = QUESTIONS[step];
  const progress = Math.round(((step + 1) / QUESTIONS.length) * 100);

  const selectOption = (value: string) => {
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("clavisprep_quiz", JSON.stringify(nextAnswers));
    }
    router.push("/app/roadmap");
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col">
      <nav className="h-[68px] flex items-center justify-between px-8 border-b border-[rgba(200,140,36,0.2)]">
        <a href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="ClavisPrep" width={40} height={40} unoptimized className="rounded-lg" />
          <span className="font-display text-lg text-[#E7BF69] tracking-wide" style={{ fontFamily: "var(--font-display)" }}>ClavisPrep</span>
        </a>
        <Badge className="bg-[rgba(200,140,36,0.12)] text-[#C88C24] border border-[rgba(200,140,36,0.3)] hover:bg-[rgba(200,140,36,0.12)] text-xs tracking-widest uppercase px-4 py-1.5">
          Question {step + 1} of {QUESTIONS.length}
        </Badge>
      </nav>

      <div className="h-1 w-full bg-[rgba(200,140,36,0.15)]">
        <div
          className="h-1 bg-[#C88C24] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          <p className="text-xs font-medium tracking-widest uppercase text-[#C88C24] mb-3 text-center">
            Build my college list
          </p>
          <h1 className="text-3xl md:text-4xl text-[#F5F0E8] text-center mb-3 font-normal" style={{ fontFamily: "var(--font-display)" }}>
            {question.prompt}
          </h1>
          <p className="text-[rgba(245,240,232,0.55)] text-center mb-10">{question.helper}</p>

          <div className="flex flex-col gap-3">
            {question.options.map(option => (
              <Card
                key={option}
                onClick={() => selectOption(option)}
                className={`cursor-pointer bg-[#132240] border transition-all duration-150 rounded-2xl hover:-translate-y-0.5 hover:border-[#CBA354] ${
                  answers[question.id] === option ? "border-[#C88C24]" : "border-[rgba(200,140,36,0.2)]"
                }`}
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <span className="text-[#F5F0E8] text-base">{option}</span>
                  <span className="text-[#C88C24] text-lg">→</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={goBack}
              disabled={step === 0}
              className="border-[rgba(200,140,36,0.4)] text-[#E7BF69] bg-transparent hover:bg-[rgba(200,140,36,0.08)] px-8"
            >
              ← Back
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
