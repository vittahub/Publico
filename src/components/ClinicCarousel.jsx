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
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between md:items-center mb-8"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleViewAll}
            className="mt-4 md:mt-0 text-teal-600 font-semibold hover:bg-teal-50 hover:text-teal-700"
          >
            Ver todos <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>

        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-hide">
            {clinics.map((clinic, index) => (
              <div
                key={clinic.id}
                className="w-full max-w-sm md:w-[calc(33.333%-16px)] shrink-0"
              >
                <ClinicCard clinic={clinic} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicCarousel;
