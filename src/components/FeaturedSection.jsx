import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Users, Heart } from 'lucide-react';

const FeaturedSection = () => {
  const stats = [
    { icon: Users, value: '50,000+', label: 'Pacientes Atendidos', color: 'text-teal-600' },
    { icon: Award, value: '200+', label: 'Clínicas Parceiras', color: 'text-emerald-600' },
    { icon: Heart, value: '98%', label: 'Satisfação', color: 'text-cyan-600' },
    { icon: TrendingUp, value: '24/7', label: 'Suporte', color: 'text-teal-600' }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 gradient-bg opacity-5"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Conectando Você aos 
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent"> Melhores Cuidados</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre as clínicas mais qualificadas da sua região com facilidade e agende sua consulta em poucos cliques
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative mb-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedSection;