import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, DollarSign, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function GiftCard({ gift, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="bg-white rounded-2xl border border-[#F0E6CC] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      {gift.image_url && (
        <div className="h-48 overflow-hidden bg-[#FFF5DC]">
          <img
            src={gift.image_url}
            alt={gift.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{gift.name}</h3>
          {gift.price_range && (
            <Badge className="bg-[#FFE8E8] text-[#D94040] border-0 shrink-0 text-xs font-medium">
              {gift.price_range}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">{gift.description}</p>
        {gift.category && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Tag className="w-3 h-3" />
            <span>{gift.category}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
