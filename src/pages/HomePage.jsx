import React from "react";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar";
import ClinicCard from "../components/ClinicCard";
import { useGeolocation } from "../hooks/useGeolocation";
import { Helmet } from "react-helmet";

import { Button } from "../ui/button";
import {
  Heart,
  Brain,
  Bone,
  Eye,
  Search,
  Calendar,
  CheckCircle,
  Star,
  MessageCircle,
  Smile,
} from "lucide-react";

const SpecialtyCard = ({ icon, name, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center cursor-pointer group"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 text-teal-500 mx-auto mb-3 group-hover:bg-teal-100 transition-colors">
        {icon}
      </div>
      <p className="font-semibold text-gray-800">{name}</p>
    </motion.div>
  );
};

const HowItWorksStep = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay }}
    className="text-center"
  >
    <div className="relative mb-4">
      <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ name, role, text, rating, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm h-full flex flex-col"
  >
    <div className="flex items-center mb-2">
      {Array(rating)
        .fill()
        .map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        ))}
    </div>
    <p className="text-gray-700 italic mb-4 flex-grow">"{text}"</p>
    <div>
      <p className="font-bold text-gray-900">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </motion.div>
);

const HomePage = ({
  allClinics,
  handleSearch,
  isSearching,
  filteredClinics,
  clearSearch,
}) => {
  const specialties = [
    { icon: <Heart className="w-8 h-8" />, name: "Cardiologia" },
    { icon: <Brain className="w-8 h-8" />, name: "Psicologia" },
    { icon: <Bone className="w-8 h-8" />, name: "Ortopedia" },
    { icon: <Smile className="w-8 h-8" />, name: "Odontologia" },
    { icon: <Eye className="w-8 h-8" />, name: "Oftalmologia" },
  ];

  const { location, getAddressFromCoords } = useGeolocation();

  // Persisted/selected region label (e.g., "São Paulo - SP")
  const [selectedRegion, setSelectedRegion] = React.useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("selectedLocation") || null
      : null
  );

  // Função para atualizar a região selecionada e persistir no localStorage
  const handleLocationChange = (location) => {
    setSelectedRegion(location);
    if (typeof window !== "undefined") {
      if (location && location.trim() !== "") {
        localStorage.setItem("selectedLocation", location);
      } else {
        localStorage.removeItem("selectedLocation");
        setSelectedRegion(null); // Limpar seleção manual
      }
    }
  };

  // Determina cidade/estado a partir da geolocalização, com fallback
  const [userRegion, setUserRegion] = React.useState(null);
  React.useEffect(() => {
    const resolveRegion = async () => {
      if (!selectedRegion && location) {
        const address = await getAddressFromCoords(
          location.latitude,
          location.longitude
        );
        setUserRegion(address);
      }
    };
    resolveRegion();
  }, [location, selectedRegion]);

  // Auto-definir localização do GPS se não há seleção manual
  React.useEffect(() => {
    if (!selectedRegion && userRegion && typeof window !== "undefined") {
      // Não salvar no localStorage, apenas usar para exibição
      console.log("Usando localização do GPS:", userRegion);
    }
  }, [selectedRegion, userRegion]);

  const parseCityState = (label) => {
    if (!label || typeof label !== "string") return { city: "", state: "" };

    // Remove espaços extras
    const cleanLabel = label.trim();

    // Padrões comuns de endereços brasileiros
    const patterns = [
      // "São Paulo - SP", "Rio de Janeiro - RJ"
      /^([^-]+)\s*-\s*([A-Z]{2})$/i,
      // "São Paulo, SP", "Rio de Janeiro, RJ"
      /^([^,]+),\s*([A-Z]{2})$/i,
      // "Copacabana - Rio de Janeiro, RJ"
      /^([^-]+)\s*-\s*([^,]+),\s*([A-Z]{2})$/i,
      // "Av. Paulista, 1000 - São Paulo, SP"
      /^[^-]+-\s*([^,]+),\s*([A-Z]{2})$/i,
    ];

    for (const pattern of patterns) {
      const match = cleanLabel.match(pattern);
      if (match) {
        if (match.length === 3) {
          // Padrão simples: cidade - estado
          return {
            city: match[1].trim(),
            state: match[2].trim().toUpperCase(),
          };
        } else if (match.length === 4) {
          // Padrão com bairro: bairro - cidade, estado
          return {
            city: match[2].trim(),
            state: match[3].trim().toUpperCase(),
          };
        }
      }
    }

    // Fallback: tentar extrair cidade e estado do final
    const parts = cleanLabel.split(/[-,]/);
    if (parts.length >= 2) {
      const city = parts[parts.length - 2]?.trim() || "";
      const state = parts[parts.length - 1]?.trim().toUpperCase() || "";
      return { city, state };
    }

    return { city: "", state: "" };
  };

  const regionLabel = selectedRegion || userRegion;
  const { city: regionCity, state: regionState } = parseCityState(regionLabel);

  const topNearby = React.useMemo(() => {
    // Se não há região selecionada, mostra todas as clínicas ordenadas por rating
    if (!regionCity) {
      return [...allClinics].sort((a, b) => b.rating - a.rating).slice(0, 4);
    }

    // Filtra clínicas por região
    const filteredClinics = [...allClinics].filter((c) => {
      const { city: clinicCity, state: clinicState } = parseCityState(
        c.address
      );

      // Prioriza clínicas da mesma cidade
      if (clinicCity.toLowerCase() === regionCity.toLowerCase()) {
        return true;
      }

      // Se não há clínicas na mesma cidade, mostra do mesmo estado
      if (regionState && clinicState === regionState) {
        return true;
      }

      return false;
    });

    // Se não encontrou clínicas na região, mostra as melhores avaliadas
    if (filteredClinics.length === 0) {
      return [...allClinics].sort((a, b) => b.rating - a.rating).slice(0, 4);
    }

    // Ordena: mesma cidade primeiro, depois por rating
    return filteredClinics
      .sort((a, b) => {
        const { city: clinicCityA } = parseCityState(a.address);
        const { city: clinicCityB } = parseCityState(b.address);

        // Prioriza clínicas da mesma cidade
        if (
          clinicCityA.toLowerCase() === regionCity.toLowerCase() &&
          clinicCityB.toLowerCase() !== regionCity.toLowerCase()
        ) {
          return -1;
        }
        if (
          clinicCityA.toLowerCase() !== regionCity.toLowerCase() &&
          clinicCityB.toLowerCase() === regionCity.toLowerCase()
        ) {
          return 1;
        }

        // Se mesma prioridade, ordena por rating
        return b.rating - a.rating;
      })
      .slice(0, 4);
  }, [allClinics, regionCity, regionState]);

  // Debug: mostrar informações da região
  React.useEffect(() => {
    console.log("Região atual:", {
      selectedRegion,
      userRegion,
      regionLabel,
      regionCity,
      regionState,
      totalClinics: allClinics.length,
      filteredClinics: topNearby.length,
    });
  }, [
    selectedRegion,
    userRegion,
    regionLabel,
    regionCity,
    regionState,
    topNearby.length,
  ]);

  return (
    <>
      <Helmet>
        <title>VittaHub - Encontre Clínicas e Especialistas</title>
        <meta
          name="description"
          content="Encontre e agende consultas nas melhores clínicas e com especialistas perto de você. Compare e cuide da sua saúde com VittaHub."
        />
        <meta
          property="og:title"
          content="VittaHub - Encontre Clínicas e Especialistas"
        />
        <meta
          property="og:description"
          content="Encontre e agende consultas nas melhores clínicas e com especialistas perto de você. Compare e cuide da sua saúde com VittaHub."
        />
      </Helmet>

      {!isSearching ? (
        <>
          <header className="relative pt-20 pb-24 md:pt-32 md:pb-36 text-center bg-white overflow-visible z-20">
            <div className="absolute inset-0 hero-bg-grid opacity-50 z-0"></div>
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background to-transparent z-10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight"
              >
                Sua saúde em primeiro lugar.
                <br />
                <span className="gradient-text">Sempre.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600"
              >
                Encontre, compare e agende consultas com os melhores
                especialistas. Cuidar de você nunca foi tão fácil.
              </motion.p>
              <SearchBar
                onSearch={handleSearch}
                initialLocation={selectedRegion || ""}
                onLocationChange={handleLocationChange}
              />
            </div>
          </header>

          <section className="py-20 md:py-20 -mt-16 relative z-5">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Clínicas mais bem avaliadas perto de você
                </h2>
                <p className="mt-2 text-base sm:text-lg text-gray-600">
                  {regionCity
                    ? `Encontradas ${
                        topNearby.length
                      } clínicas em ${regionCity}${
                        regionState ? `, ${regionState}` : ""
                      }`
                    : selectedRegion === null
                    ? "Clínicas mais bem avaliadas próximas a você"
                    : "Baseado na sua região"}
                </p>
              </motion.div>

              {/* Container responsivo para mobile */}
              <div className="overflow-hidden">
                <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-4 sm:pb-6 scrollbar-hide snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:snap-none">
                  {topNearby.map((clinic, index) => (
                    <div
                      key={clinic.id}
                      className="w-[280px] sm:w-auto shrink-0 snap-start sm:shrink sm:snap-none"
                    >
                      <ClinicCard clinic={clinic} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="py-12 md:py-20 pt-0 md:pt-10 relative z-5">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Navegue por especialidades
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Encontre o cuidado certo para sua necessidade.
                </p>
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
                {specialties.map((spec, index) => (
                  <SpecialtyCard
                    key={spec.name}
                    icon={spec.icon}
                    name={spec.name}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 md:py-24 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Simples, rápido e seguro
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Agende sua consulta em 3 passos.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <HowItWorksStep
                  icon={<Search className="w-10 h-10 text-teal-500" />}
                  title="Busque"
                  description="Encontre especialistas e clínicas por nome, especialidade ou localização."
                  delay={0.1}
                />
                <HowItWorksStep
                  icon={<Calendar className="w-10 h-10 text-cyan-500" />}
                  title="Agende"
                  description="Escolha o melhor horário para você e agende online em segundos."
                  delay={0.2}
                />
                <HowItWorksStep
                  icon={<CheckCircle className="w-10 h-10 text-emerald-500" />}
                  title="Cuide-se"
                  description="Compareça à sua consulta e dê o primeiro passo para uma vida mais saudável."
                  delay={0.3}
                />
              </div>
            </div>
          </section>

          {/* Removed duplicated top-rated section now placed above */}

          <section className="py-12 md:py-24 bg-teal-50/50">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  O que nossos pacientes dizem
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Histórias reais de quem confia no VittaHub.
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TestimonialCard
                  name="Ana Silva"
                  role="Paciente"
                  text="Encontrei um cardiologista excelente perto de casa. O agendamento foi super rápido e fácil. Recomendo!"
                  rating={5}
                  delay={0.1}
                />
                <TestimonialCard
                  name="Marcos Rocha"
                  role="Paciente"
                  text="Plataforma incrível! Consegui marcar uma consulta para o mesmo dia. A clínica era ótima e o atendimento impecável."
                  rating={5}
                  delay={0.2}
                />
                <TestimonialCard
                  name="Juliana Costa"
                  role="Mãe de paciente"
                  text="Usei para marcar um pediatra para meu filho. A variedade de opções e as avaliações me ajudaram muito a escolher."
                  rating={5}
                  delay={0.3}
                />
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Resultados da Busca
            </h2>
            <Button onClick={clearSearch} variant="outline">
              Limpar busca
            </Button>
          </div>

          {filteredClinics.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredClinics.map((clinic, index) => (
                <ClinicCard key={clinic.id} clinic={clinic} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl"
            >
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Nenhuma clínica encontrada
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Tente ajustar os termos da sua busca ou procure por uma
                localização diferente.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </>
  );
};

export default HomePage;
