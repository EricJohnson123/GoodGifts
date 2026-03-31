import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import AdaptiveQuestion from "../components/quiz/AdaptiveQuestion";

const TOTAL_QUESTIONS = 10;

const FIRST_QUESTION = {
  text: "What's the occasion for this gift?",
  options: ["Birthday", "Holiday / Christmas", "Anniversary", "Wedding", "Baby Shower", "Just Because", "Graduation", "Thank You"]
};

export default function Quiz() {
  const [questions, setQuestions] = useState([FIRST_QUESTION]);
  const [answers, setAnswers] = useState([]); // array of arrays (multi-select per question)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSelections, setCurrentSelections] = useState([]);
  const [loadingNext, setLoadingNext] = useState(false);
  const navigate = useNavigate();

  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;
  const progress = ((currentIndex) / TOTAL_QUESTIONS) * 100;

  const toggleOption = (option) => {
    setCurrentSelections(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const generateNextQuestion = async (allAnswers) => {
    setLoadingNext(true);

    const history = questions.map((q, i) => ({
      question: q.text,
      answer: allAnswers[i]?.length ? allAnswers[i].join(", ") : "Skipped"
    }));

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are helping someone find the perfect gift. They've answered ${history.length} questions so far out of ${TOTAL_QUESTIONS} total.

Previous Q&A:
${history.map((h, i) => `Q${i + 1}: ${h.question}\nA: ${h.answer}`).join("\n\n")}

Generate the single most useful next question to narrow down the best gift recommendation. 
- Make it specific and informed by the previous answers
- Provide 4-8 answer options that are diverse and cover the space well
- Options should be short (2-5 words each)
- Don't repeat themes already well-covered

Respond ONLY with JSON in this exact format:
{"text": "Question text here?", "options": ["Option 1", "Option 2", "Option 3", "Option 4"]}`,
      response_json_schema: {
        type: "object",
        properties: {
          text: { type: "string" },
          options: { type: "array", items: { type: "string" } }
        }
      }
    });

    setLoadingNext(false);
    return result;
  };

  const handleNext = async () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = currentSelections;
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      // Go to results
      const queryData = {
        questions: JSON.stringify(questions.map(q => q.text)),
        answers: JSON.stringify(updatedAnswers)
      };
      navigate(createPageUrl("GiftResults") + "?" + new URLSearchParams(queryData).toString());
      return;
    }

    // Generate next question or use cached
    const nextIndex = currentIndex + 1;
    if (!questions[nextIndex]) {
      const nextQ = await generateNextQuestion(updatedAnswers);
      setQuestions(prev => [...prev, nextQ]);
    }

    setCurrentSelections(answers[nextIndex] || []);
    setCurrentIndex(nextIndex);
  };

  const handleBack = () => {
    if (currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    setCurrentSelections(answers[prevIndex] || []);
    setCurrentIndex(prevIndex);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Hero */}
      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
            Find the <span className="text-[#D94040]">Perfect</span> Gift
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Answer a few questions and we'll curate personalised gift ideas just for you.
          </p>
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400 font-medium">
            Question {currentIndex + 1} of {TOTAL_QUESTIONS}
          </span>
          <span className="text-[#D94040] font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-[#F0E6CC] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#D94040] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestion ? (
            <AdaptiveQuestion
              index={currentIndex}
              question={currentQuestion}
              selections={currentSelections}
              onToggle={toggleOption}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-[#D94040] animate-spin mb-3" />
              <p className="text-gray-400 text-sm">Generating your next question...</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Skip / None hint */}
      <p className="text-center text-xs text-gray-400 mt-4 mb-6">
        You can select multiple answers, or skip by clicking Next with nothing selected.
      </p>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="text-gray-500 hover:text-gray-900 disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={loadingNext}
          className="bg-[#D94040] hover:bg-[#B83030] text-white px-7 py-5 text-sm font-semibold rounded-xl shadow-md shadow-[#D94040]/20 hover:shadow-lg transition-all duration-300 disabled:opacity-60"
        >
          {loadingNext ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Thinking...
            </>
          ) : isLastQuestion ? (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Find My Gifts
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
