import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const ClinicCard = ({ clinic, index }) => {
  const handleBooking = () => {
    // Agendamento não implementado
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full group"
    >
      <div className="w-full overflow-hidden border bg-card rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">
        <div className="relative">
          <img
            alt={clinic.name}
            className="h-36 w-full object-cover"
            src="https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          {clinic.featured && (
            <Badge
              variant="default"
              className="absolute top-3 left-3 bg-teal-500 text-white border-teal-500 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Destaque
            </Badge>
          )}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-semibold text-base text-white line-clamp-1">
              {clinic.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-200">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{clinic.address}</span>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-wrap gap-1.5">
              {clinic.specialties.slice(0, 2).map((specialty, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="font-medium text-xs"
                >
                  {specialty}
                </Badge>
              ))}
              {clinic.specialties.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{clinic.specialties.length - 2}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-sm text-gray-700">
                {clinic.rating}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">
            {clinic.description}
          </p>
          <div className="flex items-center justify-end mt-auto pt-3 border-t border-gray-100">
            <Button onClick={handleBooking} size="sm" className="font-semibold">
              Agendar <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClinicCard;
