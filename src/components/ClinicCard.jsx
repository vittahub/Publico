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
      <div className="w-full overflow-hidden border bg-card rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full">
        <div className="relative">
          <img
            alt={clinic.name}
            className="h-32 sm:h-36 md:h-40 w-full object-cover"
            src="https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          {clinic.featured && (
            <Badge
              variant="default"
              className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-teal-500 text-white border-teal-500 shadow-md text-xs sm:text-sm"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline">Destaque</span>
              <span className="sm:hidden">★</span>
            </Badge>
          )}
          <div className="absolute bottom-2 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4">
            <h3 className="font-semibold text-sm sm:text-base text-white line-clamp-1">
              {clinic.name}
            </h3>
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-200">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <span className="line-clamp-1">{clinic.address}</span>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2 sm:gap-0">
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {clinic.specialties.slice(0, 2).map((specialty, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="font-medium text-xs px-2 py-1"
                >
                  {specialty}
                </Badge>
              ))}
              {clinic.specialties.length > 2 && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  +{clinic.specialties.length - 2}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-xs sm:text-sm text-gray-700">
                {clinic.rating}
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 flex-grow">
            {clinic.description}
          </p>
          <div className="flex items-center justify-end mt-auto pt-2 sm:pt-3 border-t border-gray-100">
            <Button
              onClick={handleBooking}
              size="sm"
              className="font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <span className="hidden sm:inline">Agendar</span>
              <span className="sm:hidden">Agendar</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClinicCard;
