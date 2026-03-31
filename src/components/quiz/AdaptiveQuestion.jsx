import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function AdaptiveQuestion({ index, question, selections, onToggle }) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0E6CC] p-7 shadow-sm">
      {/* Question number badge + text */}
      <div className="mb-6">
        <span className="inline-block text-xs font-semibold text-[#D94040] bg-[#FFE8E8] px-3 py-1 rounded-full mb-3">
          Question {index + 1}
        </span>
        <h2 className="text-xl font-semibold text-gray-900 leading-snug">
          {question.text}
        </h2>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, i) => {
          const isSelected = selections.includes(option);
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              onClick={() => onToggle(option)}
              className={`relative text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-3 ${
                isSelected
                  ? "bg-[#D94040] text-white border-[#D94040] shadow-sm"
                  : "bg-[#FFFBF0] text-gray-700 border-[#F0E6CC] hover:border-[#D94040]/40 hover:bg-[#FFF5DC]"
              }`}
            >
              {/* Checkbox indicator */}
              <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                isSelected
                  ? "bg-white/20 border-white/50"
                  : "border-[#D0C9B8]"
              }`}>
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </span>
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
