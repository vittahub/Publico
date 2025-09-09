import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { MapPin, Star, Filter, Navigation, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import SearchBar from "../components/SearchBar";

const SearchResultsPage = ({ allClinics, handleSearch, clearSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("");
  const [locationParam, setLocationParam] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get("q") || "";
    const locationParam = queryParams.get("location") || "";

    // Só atualizar se realmente mudou
    if (term !== searchTerm) {
      setSearchTerm(term);
    }
    if (locationParam !== currentLocation) {
      setCurrentLocation(locationParam);
    }
    setLocationParam(locationParam);

    // Filtrar clínicas baseado no termo de busca e localização
    const results = allClinics.filter((clinic) => {
      // PRIMEIRO: Verificar se a clínica está na localização selecionada (obrigatório)
      if (locationParam && clinic.address) {
        const clinicLocation = clinic.address.toLowerCase();
        const normalizedLocationParam = locationParam.toLowerCase();

        // Extrair cidade e estado da localização
        const locationParts = normalizedLocationParam.split(" - ");
        const city = locationParts[0];
        const state = locationParts[1];

        // Verificar se a clínica está na cidade ou estado especificado
        if (!clinicLocation.includes(city) && !clinicLocation.includes(state)) {
          return false; // Se não está na localização, não incluir
        }
      }

      // SEGUNDO: Se não há termo de busca, incluir todas da localização
      if (!term) {
        return true;
      }

      // TERCEIRO: Se há termo de busca, verificar se a clínica corresponde
      const normalizedTerm = term.toLowerCase().trim();

      // Buscar no nome da clínica (incluindo variações)
      const clinicName = clinic.name.toLowerCase();
      if (clinicName.includes(normalizedTerm)) return true;

      // Buscar por palavras parciais no nome
      const nameWords = clinicName.split(/\s+/);
      if (nameWords.some((word) => word.includes(normalizedTerm))) return true;

      // Buscar nas especialidades
      if (
        clinic.specialties &&
        clinic.specialties.some((specialty) =>
          specialty.toLowerCase().includes(normalizedTerm)
        )
      )
        return true;

      // Buscar na categoria
      if (
        clinic.category &&
        clinic.category.toLowerCase().includes(normalizedTerm)
      )
        return true;

      // Buscar na descrição
      if (
        clinic.description &&
        clinic.description.toLowerCase().includes(normalizedTerm)
      )
        return true;

      return false;
    });
    setFilteredClinics(results);
  }, [location.search, allClinics]);

  const handleSearchSubmit = (searchData) => {
    const locationParam = searchData.location
      ? `&location=${encodeURIComponent(searchData.location)}`
      : "";
    navigate(
      `/busca?q=${encodeURIComponent(searchData.searchTerm)}${locationParam}`
    );
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Localização obtida:", position.coords);
        },
        () => {
          console.log("Erro ao obter localização");
        }
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Resultados da Busca por "{searchTerm}" - VittaHub</title>
        <meta
          name="description"
          content={`Encontre as melhores clínicas e especialistas para "${searchTerm}".`}
        />
      </Helmet>

      {/* Header com busca */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-20">
            {/* Botão Voltar */}
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Voltar</span>
            </Button>

            {/* Barra de Busca Centralizada */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <SearchBar
                  onSearch={handleSearchSubmit}
                  initialLocation={currentLocation}
                />
              </div>
            </div>

            {/* Botões da direita */}
            <div className="flex gap-2">
              <Button variant="outline" className="hidden md:inline-flex">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
        <div className="w-full flex flex-col min-h-[calc(100vh-200px)] items-center">
          {/* Título dos Resultados */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center w-full max-w-4xl"
          >
            <h1 className="text-3xl font-light text-gray-800 mb-2">
              {filteredClinics.length === 0
                ? "Nenhum resultado encontrado"
                : filteredClinics.length === 1
                ? "1 resultado encontrado"
                : `${filteredClinics.length} resultados encontrados`}
            </h1>
            {searchTerm && (
              <p className="text-lg text-gray-500 font-normal">
                para{" "}
                <span className="text-teal-600 font-medium">
                  "{searchTerm}"
                </span>
                {locationParam && (
                  <span className="text-gray-400"> em {locationParam}</span>
                )}
              </p>
            )}
          </motion.div>

          {/* Lista de Clínicas */}
          <div className="space-y-8 flex-1 w-full max-w-4xl">
            {filteredClinics.map((clinic, index) => (
              <motion.div
                key={clinic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/clinica/${clinic.id}`}
                  state={{ fromSearchResults: true }}
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Imagem da Clínica */}
                    <div className="w-full lg:w-40 h-28 flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
                        <span className="text-teal-600 font-semibold text-base">
                          {clinic.name.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Informações da Clínica */}
                    <div className="flex-grow flex flex-col justify-between min-h-[112px]">
                      <div>
                        <p className="text-teal-600 font-semibold text-xs mb-1">
                          {clinic.category}
                        </p>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">
                          {clinic.name}
                        </h2>
                        <div className="flex items-center gap-2 text-xs mb-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{clinic.rating}</span>
                          <span className="text-gray-500">(Excelente)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-xs mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{clinic.address}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {clinic.specialties
                            .slice(0, 3)
                            .map((specialty, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Botão de Agendamento */}
                    <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
                      <Button className="bg-teal-600 hover:bg-teal-700 px-4 py-1.5 text-xs font-medium">
                        Agendar
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Estado Vazio */}
          {filteredClinics.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl"
            >
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-light text-gray-800 mb-3">
                Nenhuma clínica encontrada
              </h3>
              <p className="text-gray-500 max-w-lg mx-auto mb-8 text-center leading-relaxed">
                Não encontramos clínicas que correspondam aos seus critérios de
                busca. Tente ajustar os termos da pesquisa ou selecionar uma
                localização diferente.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Voltar à busca
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResultsPage;
