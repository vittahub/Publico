import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ClinicCard from "./ClinicCard";
import { Button } from "../ui/button";

const ClinicCarousel = ({ title, subtitle, clinics }) => {
  const handleViewAll = () => {
    // Visualização completa não implementada
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 sm:mb-8"
        >
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>
            <p className="mt-2 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
              {subtitle}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleViewAll}
            className="self-start sm:self-auto text-teal-600 font-semibold hover:bg-teal-50 hover:text-teal-700 px-4 py-2"
          >
            <span className="hidden sm:inline">Ver todos</span>
            <span className="sm:hidden">Ver todos</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>

        <div className="relative">
          {/* Scroll horizontal para mobile */}
          <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 sm:pb-6 scrollbar-hide snap-x snap-mandatory">
            {clinics.map((clinic, index) => (
              <div
                key={clinic.id}
                className="w-[280px] sm:w-[320px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] shrink-0 snap-start"
              >
                <ClinicCard clinic={clinic} index={index} />
              </div>
            ))}
          </div>

          {/* Indicadores de scroll para mobile */}
          <div className="flex justify-center mt-4 sm:hidden">
            <div className="flex space-x-2">
              {clinics
                .slice(0, Math.ceil(clinics.length / 2))
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-gray-300"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicCarousel;
