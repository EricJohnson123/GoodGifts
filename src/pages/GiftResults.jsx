import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Gift, RefreshCw } from "lucide-react";
import GiftCard from "../components/gifts/GiftCard";

export default function GiftResults() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const answersRaw = urlParams.get("answers");
  const questionsRaw = urlParams.get("questions");
  const additionalInfo = urlParams.get("additionalInfo") || "";

  const fetchGifts = async () => {
    setLoading(true);

    let answers = {};
    let questions = [];
    try {
      answers = JSON.parse(answersRaw || "{}");
      questions = JSON.parse(questionsRaw || "[]");
    } catch {}

    const qaPairs = questions
      .map((q, i) => {
        const ans = answers[i];
        const answerText = Array.isArray(ans) && ans.length > 0 ? ans.join(", ") : "Skipped";
        return `Q: ${q}\nA: ${answerText}`;
      })
      .join("\n\n");

    const prompt = `You are a creative gift recommendation engine. Based on the following quiz answers, suggest 8 unique and thoughtful gift ideas.

Quiz Answers:
${qaPairs}

${additionalInfo ? `Additional context from the user: "${additionalInfo}"` : ""}

For each gift, provide:
- name: A clear, specific gift name
- description: A 1-2 sentence description of why this gift is a great match
- price_range: A price range like "$15–$30" or "$50–$75"
- category: A short category label like "Experience", "Tech", "Home", "Food & Drink", etc.
- image_url: A relevant Unsplash image URL in the format https://images.unsplash.com/photo-XXXXX?w=600&h=400&fit=crop (use real, well-known Unsplash photo IDs that you are confident exist)

Make the recommendations diverse, creative, and personalized. Mix price points within the stated budget.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          gifts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                price_range: { type: "string" },
                category: { type: "string" },
                image_url: { type: "string" }
              }
            }
          }
        }
      }
    });

    setGifts(result.gifts || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link to={createPageUrl("Quiz")}>
            <Button variant="ghost" className="text-gray-500 hover:text-gray-900 -ml-3 mb-2">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Quiz
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Your Gift <span className="text-[#D94040]">Picks</span>
          </h1>
          <p className="text-gray-500 mt-1">Curated just for you based on your answers</p>
        </div>
        {!loading && (
          <Button
            onClick={fetchGifts}
            variant="outline"
            className="border-[#F0E6CC] hover:border-[#D94040]/30 hover:bg-[#FFF5DC] text-gray-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FFE8E8] flex items-center justify-center mb-6">
            <Loader2 className="w-7 h-7 text-[#D94040] animate-spin" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Finding perfect gifts...</h2>
          <p className="text-sm text-gray-400">This takes just a moment</p>
        </motion.div>
      )}

      {/* Results Grid */}
      {!loading && gifts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {gifts.map((gift, index) => (
            <GiftCard key={index} gift={gift} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && gifts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FFF5DC] flex items-center justify-center mb-6">
            <Gift className="w-7 h-7 text-[#D94040]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">No gifts found</h2>
          <p className="text-sm text-gray-400 mb-6">Try answering more questions for better results</p>
          <Link to={createPageUrl("Quiz")}>
            <Button className="bg-[#D94040] hover:bg-[#B83030] text-white">
              Retake Quiz
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
