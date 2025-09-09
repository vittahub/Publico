import React, { useState } from "react";

import { useParams, Link, useLocation, useNavigate } from "react-router-dom";

import { Helmet } from "react-helmet";

import { motion } from "framer-motion";

import {
  MapPin,
  Star,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle,
  Users,
  Phone,
  Clock,
  Search,
} from "lucide-react";

import { Button } from "../ui/button";
import AppointmentModal from "../components/AppointmentModal";

const ClinicPage = ({ allClinics }) => {
  const { id } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [professionalQuery, setProfessionalQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  // Verificar se veio da página de resultados

  const cameFromSearchResults =
    location.state?.fromSearchResults || document.referrer.includes("/busca");

  const clinic = allClinics.find((c) => c.id === parseInt(id));

  if (!clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Clínica não encontrada
          </h1>

          <button
            onClick={() => {
              if (cameFromSearchResults) {
                navigate(-1); // Volta para a página anterior (resultados)
              } else {
                navigate("/"); // Volta para a página inicial
              }
            }}
            className="text-teal-600 hover:text-teal-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const reviews = [
    {
      id: 1,

      name: "Ana Silva",

      rating: 5,

      date: "2024-01-15",

      comment:
        "Excelente atendimento! O médico foi muito atencioso e profissional.",
    },

    {
      id: 2,

      name: "Carlos Santos",

      rating: 5,

      date: "2024-01-10",

      comment: "Clínica muito bem organizada e limpa. Recomendo!",
    },

    {
      id: 3,

      name: "Maria Costa",

      rating: 4,

      date: "2024-01-05",

      comment: "Bom atendimento, mas poderia ter mais horários disponíveis.",
    },
  ];

  const sampleProfessionalNames = [
    "Dr. Ana Lima",
    "Dr. Carlos Mendes",
    "Dra. Júlia Rocha",
    "Dr. Pedro Alves",
    "Dra. Marina Torres",
    "Dr. Rafael Nunes",
  ];

  const sampleProfessionalImages = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1472099645785-648ed127bb54?w=300&h=300&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=faces",
  ];

  const professionals =
    clinic.professionals && clinic.professionals.length > 0
      ? clinic.professionals
      : clinic.specialties.slice(0, 6).map((specialty, idx) => ({
          id: idx + 1,
          name: sampleProfessionalNames[idx % sampleProfessionalNames.length],
          specialty,
          rating: 4.8,
          image:
            sampleProfessionalImages[idx % sampleProfessionalImages.length],
        }));

  const specialtyOptions = Array.from(
    new Set(professionals.map((p) => p.specialty))
  );

  const filteredProfessionals = professionals.filter((p) => {
    const q = professionalQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q);
    const matchesSpecialty =
      !selectedSpecialty || p.specialty === selectedSpecialty;
    return matchesQuery && matchesSpecialty;
  });

  return (
    <>
      <Helmet>
        <title>{clinic.name} - VittaHub</title>

        <meta name="description" content={clinic.description} />
      </Helmet>

      {/* Header removido conforme solicitado (área de compartilhar/favoritar) */}

      <div className="bg-gray-50">
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-4">
              <button
                onClick={() => {
                  if (cameFromSearchResults) {
                    navigate(-1);
                  } else {
                    navigate("/");
                  }
                }}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Informações da Clínica - Lado Esquerdo */}
              <div className="lg:col-span-1 lg:sticky lg:top-24 self-start h-fit">
                {/* Card principal da clínica (como a imagem) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 mb-6"
                >
                  <div className="h-40 rounded-xl overflow-hidden mb-4 bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6"
                      alt={clinic.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">
                      {clinic.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-gray-900 font-semibold truncate">
                        {clinic.name}
                      </h1>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                        Atende esta semana
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="w-full h-11 rounded-xl"
                    onClick={() => {
                      setSelectedProfessional(null);
                      setIsModalOpen(true);
                    }}
                  >
                    Agendar consulta
                  </Button>
                </motion.div>

                {/* Card secundário: localização, telefone e horários */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md p-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-gray-900 text-sm font-medium">
                          Localização
                        </div>
                        <div className="text-gray-600 text-sm truncate">
                          {clinic.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-gray-900 text-sm font-medium">
                          Telefone
                        </div>
                        <div className="text-gray-600 text-sm">
                          (11) 3456-7890
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-gray-900 text-sm font-medium">
                          Horário de atendimento
                        </div>
                        <div className="text-gray-600 text-sm">
                          Seg - Sex: 08:00 - 18:00
                        </div>
                        <div className="text-gray-500 text-xs">
                          Sáb: 08:00 - 12:00
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Profissionais - Lado Direito */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Profissionais
                        </h2>
                        <p className="text-sm text-gray-600">
                          Escolha seu especialista
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-1 sm:flex-initial">
                      <div className="relative">
                        <input
                          type="text"
                          value={professionalQuery}
                          onChange={(e) => setProfessionalQuery(e.target.value)}
                          placeholder="Buscar por nome ou procedimento..."
                          className="w-full sm:w-64 md:w-80 px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder-gray-500"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Search className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                      >
                        <option value="">Todas as especialidades</option>
                        {specialtyOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredProfessionals.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p>Nenhum profissional encontrado.</p>
                      </div>
                    ) : (
                      filteredProfessionals.map((pro) => (
                        <motion.div
                          key={pro.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * (pro.id || 0) }}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm flex-shrink-0 border border-gray-200">
                                {pro.image ? (
                                  <img
                                    src={pro.image}
                                    alt={pro.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <span className="text-teal-700 font-semibold text-sm">
                                    {pro.name.split(" ")[0]}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-900 font-semibold text-base mb-0.5">
                                {pro.name}
                              </h3>
                              <p className="text-teal-700 font-medium text-sm mb-2">
                                {pro.specialty}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-gray-900 font-semibold text-sm">
                                    {pro.rating}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-600">
                                  (Excelente)
                                </span>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <span className="text-xs text-gray-500">
                                  15+ consultas
                                </span>
                              </div>
                            </div>

                            <div className="flex-shrink-0">
                              <Button
                                size="sm"
                                className="font-semibold"
                                onClick={() => {
                                  setSelectedProfessional(pro);
                                  setIsModalOpen(true);
                                }}
                              >
                                Agendar
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>

                {/* Avaliações */}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-sm">
                        <Star className="w-5 h-5 text-white fill-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Avaliações dos Pacientes
                        </h2>
                        <p className="text-sm text-gray-600">
                          O que nossos pacientes dizem
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white rounded-lg px-3.5 py-1.5 border border-gray-200">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-base font-semibold text-gray-900">
                          4.7
                        </span>
                      </div>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <span className="text-xs text-gray-600">
                        12 avaliações
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                              <span className="text-white font-bold text-sm">
                                {review.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-base">
                                {review.name}
                              </h3>
                              <p className="text-gray-600 text-xs">
                                {new Date(review.date).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-white rounded-md px-2.5 py-1 border border-gray-200">
                            {Array(review.rating)
                              .fill()
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                          </div>
                        </div>

                        <p className="text-gray-800 leading-relaxed text-sm">
                          {review.comment}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 pt-4 border-t border-gray-200"
                  >
                    <Button className="w-full" size="sm">
                      Ver todas as avaliações
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {isModalOpen && (
        <AppointmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProfessional(null);
          }}
          professional={selectedProfessional}
          clinic={clinic}
        />
      )}
    </>
  );
};

export default ClinicPage;
