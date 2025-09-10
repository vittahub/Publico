import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Navigation } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useGeolocation } from "../hooks/useGeolocation";
import { useNavigate } from "react-router-dom";

// Função para converter nome completo do estado para abreviação
const getStateAbbreviation = (stateName) => {
  const stateMap = {
    Acre: "AC",
    Alagoas: "AL",
    Amapá: "AP",
    Amazonas: "AM",
    Bahia: "BA",
    Ceará: "CE",
    "Distrito Federal": "DF",
    "Espírito Santo": "ES",
    Goiás: "GO",
    Maranhão: "MA",
    "Mato Grosso": "MT",
    "Mato Grosso do Sul": "MS",
    "Minas Gerais": "MG",
    Pará: "PA",
    Paraíba: "PB",
    Paraná: "PR",
    Pernambuco: "PE",
    Piauí: "PI",
    "Rio de Janeiro": "RJ",
    "Rio Grande do Norte": "RN",
    "Rio Grande do Sul": "RS",
    Rondônia: "RO",
    Roraima: "RR",
    "Santa Catarina": "SC",
    "São Paulo": "SP",
    Sergipe: "SE",
    Tocantins: "TO",
  };

  return stateMap[stateName] || stateName;
};

// Lista de cidades brasileiras para sugestões
const CITIES_DATA = [
  "São Paulo - SP",
  "São Luís - MA",
  "São Bernardo do Campo - SP",
  "Rio de Janeiro - RJ",
  "Russas - CE",
  "Fortaleza - CE",
  "Salvador - BA",
  "Brasília - DF",
  "Belo Horizonte - MG",
  "Manaus - AM",
  "Curitiba - PR",
  "Recife - PE",
  "Porto Alegre - RS",
  "Belém - PA",
  "Goiânia - GO",
  "Guarulhos - SP",
  "Campinas - SP",
  "São Gonçalo - RJ",
  "Nova Iguaçu - RJ",
  "Maceió - AL",
  "Teresina - PI",
  "João Pessoa - PB",
  "Natal - RN",
  "Campo Grande - MS",
  "Aracaju - SE",
  "Vitória - ES",
  "Cuiabá - MT",
  "Palmas - TO",
  "Boa Vista - RR",
  "Porto Velho - RO",
  "Rio Branco - AC",
  "Macapá - AP",
  "Florianópolis - SC",
];

// Lista de clínicas baseada nos dados reais fornecidos
const CLINICS_DATA = [
  // Clínica VittaHub
  {
    id: "1",
    name: "Clínica VittaHub",
    specialty: "Clínica Geral",
    city: "Russas",
    state: "CE",
    rating: 4.8,
    phone: "(88) 99999-9999",
    whatsapp: "(88) 99999-9999",
    address: {
      street: "Rua Principal",
      number: "456",
      neighborhood: "Centro",
      zip_code: "62900-000",
      country: "Brasil",
    },
  },
  // Clínica São João
  {
    id: "2",
    name: "Clínica São João",
    specialty: "Clínica Geral",
    city: "São Paulo",
    state: "SP",
    rating: 4.6,
    phone: "(11) 99999-9999",
    whatsapp: "(11) 99999-9999",
    address: {
      street: "Rua das Flores",
      number: "123",
      neighborhood: "Centro",
      zip_code: "01234-567",
      country: "Brasil",
    },
  },
  // Clínica Saúde Total - Unidade Centro
  {
    id: "3",
    name: "Clínica Saúde Total - Unidade Centro",
    specialty: "Cardiologia",
    city: "São Paulo",
    state: "SP",
    rating: 4.7,
    phone: "(11) 91111-1111",
    whatsapp: "(11) 91111-1111",
    address: {
      street: "Av. Paulista",
      number: "1000",
      neighborhood: "Bela Vista",
      zip_code: "01310-100",
      country: "Brasil",
    },
  },
  // Clínica Saúde Total - Unidade Vila Olímpia
  {
    id: "4",
    name: "Clínica Saúde Total - Unidade Vila Olímpia",
    specialty: "Cardiologia",
    city: "São Paulo",
    state: "SP",
    rating: 4.9,
    phone: "(11) 93333-3333",
    whatsapp: "(11) 93333-3333",
    address: {
      street: "Rua Funchal",
      number: "500",
      neighborhood: "Vila Olímpia",
      zip_code: "04551-060",
      country: "Brasil",
    },
  },
  // Clínica Especializada em Cardiologia
  {
    id: "5",
    name: "Clínica Especializada em Cardiologia",
    specialty: "Cardiologia",
    city: "São Paulo",
    state: "SP",
    rating: 4.9,
    phone: "(11) 88888-8888",
    whatsapp: "(11) 88888-8888",
    address: {
      street: "Rua das Palmeiras",
      number: "789",
      neighborhood: "Jardins",
      zip_code: "01234-890",
      country: "Brasil",
    },
  },
  // Centro de Dermatologia Avançada
  {
    id: "6",
    name: "Centro de Dermatologia Avançada",
    specialty: "Dermatologia",
    city: "São Paulo",
    state: "SP",
    rating: 4.8,
    phone: "(11) 77777-7777",
    whatsapp: "(11) 77777-7777",
    address: {
      street: "Av. Brigadeiro Faria Lima",
      number: "1500",
      neighborhood: "Itaim Bibi",
      zip_code: "01452-002",
      country: "Brasil",
    },
  },
  // Instituto de Oftalmologia
  {
    id: "7",
    name: "Instituto de Oftalmologia",
    specialty: "Oftalmologia",
    city: "São Paulo",
    state: "SP",
    rating: 4.7,
    phone: "(11) 66666-6666",
    whatsapp: "(11) 66666-6666",
    address: {
      street: "Rua Augusta",
      number: "2000",
      neighborhood: "Consolação",
      zip_code: "01412-000",
      country: "Brasil",
    },
  },
  // Clínica de Ortopedia e Traumatologia
  {
    id: "8",
    name: "Clínica de Ortopedia e Traumatologia",
    specialty: "Ortopedia",
    city: "São Paulo",
    state: "SP",
    rating: 4.6,
    phone: "(11) 55555-5555",
    whatsapp: "(11) 55555-5555",
    address: {
      street: "Rua Oscar Freire",
      number: "1200",
      neighborhood: "Jardins",
      zip_code: "01426-001",
      country: "Brasil",
    },
  },
  // Centro de Ginecologia e Obstetrícia
  {
    id: "9",
    name: "Centro de Ginecologia e Obstetrícia",
    specialty: "Ginecologia",
    city: "São Paulo",
    state: "SP",
    rating: 4.8,
    phone: "(11) 44444-4444",
    whatsapp: "(11) 44444-4444",
    address: {
      street: "Av. São João",
      number: "800",
      neighborhood: "Vila Buarque",
      zip_code: "01234-000",
      country: "Brasil",
    },
  },
  // Clínica de Psicologia e Psiquiatria
  {
    id: "10",
    name: "Clínica de Psicologia e Psiquiatria",
    specialty: "Psiquiatria",
    city: "São Paulo",
    state: "SP",
    rating: 4.5,
    phone: "(11) 33333-3333",
    whatsapp: "(11) 33333-3333",
    address: {
      street: "Rua Maria Antônia",
      number: "600",
      neighborhood: "Vila Buarque",
      zip_code: "01222-010",
      country: "Brasil",
    },
  },
];

const SearchBar = ({ onSearch, initialLocation = "", onLocationChange }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState(() => {
    // Priorizar localização inicial passada como prop, depois localStorage
    const savedLocation = localStorage.getItem("selectedLocation") || "";
    const finalLocation = initialLocation || savedLocation || "";
    return finalLocation;
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [cityHighlightedIdx, setCityHighlightedIdx] = useState(-1);
  const [clinicSuggestions, setClinicSuggestions] = useState([]);
  const [isClinicDropdownOpen, setIsClinicDropdownOpen] = useState(false);
  const [clinicHighlightedIdx, setClinicHighlightedIdx] = useState(-1);
  const [gpsCity, setGpsCity] = useState("");
  const [gpsState, setGpsState] = useState("");

  const {
    location: gpsLocation,
    loading: gpsLoading,
    error: gpsError,
    getCurrentLocation,
    getAddressFromCoords,
  } = useGeolocation();

  // Salvar localização no localStorage sempre que ela mudar
  useEffect(() => {
    if (location) {
      localStorage.setItem("selectedLocation", location);
    } else {
      localStorage.removeItem("selectedLocation");
    }
    try {
      if (typeof onLocationChange === "function") {
        onLocationChange(location);
      }
    } catch (e) {
      // no-op
    }
  }, [location]);

  // Atualizar localização quando initialLocation mudar
  useEffect(() => {
    if (initialLocation !== location) {
      setLocation(initialLocation || "");
    }
  }, [initialLocation]);

  // Filtrar cidades baseado na busca do modal de localização
  const filterCities = (query) => {
    if (!query.trim()) return [];

    const normalizedQuery = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return CITIES_DATA.filter((city) => {
      const normalizedCity = city
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedCity.includes(normalizedQuery);
    }).slice(0, 5); // Limitar a 5 sugestões
  };

  // Filtrar clínicas baseado na busca principal e cidade selecionada
  const filterClinics = (query) => {
    if (!query.trim()) return [];

    const normalizedQuery = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Extrair cidade e estado da localização selecionada
    const selectedCityName = location.split(" - ")[0];
    const selectedState = location.split(" - ")[1];

    // Normalizar o estado (CE -> CE, Ceará -> CE)
    const normalizedState = selectedState === "Ceará" ? "CE" : selectedState;

    // Filtrar clínicas com busca mais flexível
    const clinicsInCity = CLINICS_DATA.filter((clinic) => {
      // Verificar se a clínica está na cidade selecionada
      const isInSelectedCity =
        clinic.city === selectedCityName && clinic.state === normalizedState;

      if (!isInSelectedCity) return false;

      // Buscar por nome da clínica (incluindo palavras parciais)
      const normalizedName = clinic.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      // Verificar se o termo de busca está contido no nome
      if (normalizedName.includes(normalizedQuery)) return true;

      // Verificar se alguma palavra do nome contém o termo de busca
      const nameWords = normalizedName.split(/\s+/);
      if (nameWords.some((word) => word.includes(normalizedQuery))) return true;

      // Buscar por especialidade
      const normalizedSpecialty = clinic.specialty
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return normalizedSpecialty.includes(normalizedQuery);
    });

    // Buscar especialidades disponíveis na cidade
    const availableSpecialties = [
      ...new Set(clinicsInCity.map((clinic) => clinic.specialty)),
    ];
    const matchingSpecialties = availableSpecialties.filter((specialty) => {
      const normalizedSpecialty = specialty
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedSpecialty.includes(normalizedQuery);
    });

    const results = [];

    // Adicionar clínicas encontradas
    results.push(...clinicsInCity.slice(0, 3));

    // Adicionar especialidades encontradas (como clínicas virtuais)
    matchingSpecialties.slice(0, 2).forEach((specialty) => {
      results.push({
        name: `Especialistas em ${specialty}`,
        specialty: specialty,
        city: selectedCityName,
        state: selectedState,
        rating: 4.5,
        isSpecialty: true,
      });
    });

    return results.slice(0, 5); // Limitar a 5 sugestões
  };

  // Atualizar sugestões de cidade quando a busca do modal muda
  useEffect(() => {
    const filteredCities = filterCities(locationSearchQuery);
    setCitySuggestions(filteredCities);
    setIsCityDropdownOpen(
      filteredCities.length > 0 && locationSearchQuery.trim().length > 0
    );
    setCityHighlightedIdx(-1);
  }, [locationSearchQuery]);

  // Atualizar sugestões de clínicas quando a busca principal muda
  useEffect(() => {
    const filteredClinics = filterClinics(searchTerm);
    setClinicSuggestions(filteredClinics);

    // Mostrar dropdown se há busca digitada (mesmo sem resultados)
    setIsClinicDropdownOpen(searchTerm.trim().length > 0);
    setClinicHighlightedIdx(-1);
  }, [searchTerm, location]);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const searchBarElement = document.querySelector("[data-search-bar]");

      if (searchBarElement && !searchBarElement.contains(target)) {
        setIsClinicDropdownOpen(false);
        setClinicHighlightedIdx(-1);
        setIsLocationModalOpen(false);
        setIsCityDropdownOpen(false);
        setCityHighlightedIdx(-1);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsClinicDropdownOpen(false);
        setClinicHighlightedIdx(-1);
        setIsLocationModalOpen(false);
        setIsCityDropdownOpen(false);
        setCityHighlightedIdx(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() || location.trim()) {
      onSearch({ searchTerm, location });
    }
  };

  const handleGetCurrentLocation = async () => {
    console.log("handleGetCurrentLocation chamado");
    console.log("gpsLocation:", gpsLocation);
    console.log("gpsLoading:", gpsLoading);
    console.log("gpsError:", gpsError);

    if (gpsLocation) {
      console.log("Usando localização existente:", gpsLocation);
      const address = await getAddressFromCoords(
        gpsLocation.latitude,
        gpsLocation.longitude
      );
      console.log("Endereço obtido:", address);
      setLocation(address);
    } else {
      console.log("Obtendo nova localização...");
      getCurrentLocation();
    }
  };

  // Selecionar cidade do modal
  const handleCitySelect = (city) => {
    setLocation(city);
    setIsLocationModalOpen(false);
    setLocationSearchQuery("");
    setIsCityDropdownOpen(false);
    setCityHighlightedIdx(-1);
  };

  // Selecionar clínica da busca principal
  const handleClinicSelect = (clinic) => {
    // Redirecionar imediatamente para a página da clínica
    if (clinic.id) {
      navigate(`/clinica/${clinic.id}`);
    } else if (clinic.isSpecialty) {
      // Para especialidades, navegar para busca por especialidade
      const locationParam = location
        ? `&location=${encodeURIComponent(location)}`
        : "";
      navigate(`/busca?q=${clinic.specialty}${locationParam}`);
    }
  };

  // Função para lidar com o clique no botão de busca
  const handleSearchButtonClick = () => {
    if (searchTerm.trim()) {
      // Sempre navegar para a página de resultados quando clicar em "Buscar"
      const locationParam = location
        ? `&location=${encodeURIComponent(location)}`
        : "";
      navigate(`/busca?q=${encodeURIComponent(searchTerm)}${locationParam}`);
    }
  };

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      // Verificar se o clique foi fora do SearchBar
      const searchBarElement = document.querySelector("[data-search-bar]");
      if (searchBarElement && !searchBarElement.contains(target)) {
        // Fechar dropdown de clínicas
        setIsClinicDropdownOpen(false);
        setClinicHighlightedIdx(-1);

        // Fechar modal de localização
        setIsLocationModalOpen(false);
        setIsCityDropdownOpen(false);
        setCityHighlightedIdx(-1);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        // Fechar dropdown de clínicas
        setIsClinicDropdownOpen(false);
        setClinicHighlightedIdx(-1);

        // Fechar modal de localização
        setIsLocationModalOpen(false);
        setIsCityDropdownOpen(false);
        setCityHighlightedIdx(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Obter cidade do GPS
  useEffect(() => {
    const getGpsCity = async () => {
      if (gpsLocation) {
        console.log("Obtendo cidade do GPS:", gpsLocation);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gpsLocation.latitude}&lon=${gpsLocation.longitude}&addressdetails=1`,
            {
              headers: { Accept: "application/json" },
            }
          );
          const data = await response.json();
          console.log("Dados do Nominatim:", data);

          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            "";
          const state =
            data?.address?.state ||
            data?.address?.region ||
            data?.address?.county ||
            "";

          console.log("Cidade extraída:", city);
          console.log("Estado extraído:", state);

          setGpsCity(city);
          setGpsState(state);

          // Definir localização inicial se não estiver definida
          if (!location && city && state) {
            // Converter nome completo do estado para abreviação
            const stateAbbreviation = getStateAbbreviation(state);
            const gpsLabel = `${city} - ${stateAbbreviation}`;
            console.log("Definindo localização inicial:", gpsLabel);
            setLocation(gpsLabel);
          }
        } catch (error) {
          console.error("Erro ao obter cidade do GPS:", error);
        }
      }
    };

    getGpsCity();
  }, [gpsLocation, location]);

  return (
    <>
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchButtonClick();
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-6 sm:mt-8 md:mt-10 p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-full shadow-lg max-w-3xl mx-auto relative z-30"
        data-search-bar
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="relative flex-[2] w-full">
            <Input
              placeholder="Especialidade ou nome da clínica"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (isClinicDropdownOpen) {
                    setClinicHighlightedIdx((prev) =>
                      prev < clinicSuggestions.length - 1 ? prev + 1 : 0
                    );
                  }
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (isClinicDropdownOpen) {
                    setClinicHighlightedIdx((prev) =>
                      prev > 0 ? prev - 1 : clinicSuggestions.length - 1
                    );
                  }
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (
                    clinicHighlightedIdx >= 0 &&
                    clinicSuggestions[clinicHighlightedIdx]
                  ) {
                    handleClinicSelect(clinicSuggestions[clinicHighlightedIdx]);
                  } else if (searchTerm.trim()) {
                    // Se não há clínica selecionada mas há termo de busca, navegar para resultados
                    handleSearchButtonClick();
                  }
                } else if (e.key === "Escape") {
                  setIsClinicDropdownOpen(false);
                  setClinicHighlightedIdx(-1);
                }
              }}
              onFocus={() => {
                // Fechar dropdown de localização quando focar no input de busca
                setIsLocationModalOpen(false);
                setIsCityDropdownOpen(false);
                setCityHighlightedIdx(-1);

                if (clinicSuggestions.length > 0) {
                  setIsClinicDropdownOpen(true);
                }
              }}
              className="pl-4 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-10 sm:h-12 text-sm sm:text-base w-full placeholder:text-gray-400 placeholder:font-medium"
            />

            {/* Dropdown de sugestões de clínicas */}
            {isClinicDropdownOpen && clinicSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[999997] max-h-[280px] overflow-y-auto w-full sm:min-w-[500px]">
                <div className="py-2">
                  {clinicSuggestions.map((clinic, idx) => (
                    <button
                      key={`${clinic.id || clinic.name}-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClinicSelect(clinic);
                      }}
                      onMouseEnter={() => setClinicHighlightedIdx(idx)}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 text-left hover:bg-gray-50 transition-colors duration-150 ${
                        clinicHighlightedIdx === idx ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base text-gray-900 truncate">
                          {clinic.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          {clinic.specialty} • {clinic.city} - {clinic.state}
                        </div>
                        {clinic.address && (
                          <div className="text-xs text-gray-400 truncate">
                            {clinic.address.street}, {clinic.address.number} -{" "}
                            {clinic.address.neighborhood}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1">
                        <span className="text-yellow-400 text-sm sm:text-base">
                          ★
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {clinic.rating}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem quando não encontra clínicas */}
            {isClinicDropdownOpen &&
              clinicSuggestions.length === 0 &&
              searchTerm.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[999997] min-w-[500px] w-full">
                  <div className="px-4 py-6 text-center text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Nenhuma clínica encontrada em {location}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Não encontramos clínicas com "{searchTerm}" em {location}
                    </p>
                    <p className="text-xs text-teal-600 mb-3">
                      Tente uma busca diferente ou selecione outra cidade
                    </p>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>💡 Dicas:</p>
                      <p>
                        • Tente buscar por especialidade (ex: "Cardiologia")
                      </p>
                      <p>• Verifique se a cidade está correta</p>
                      <p>• Em breve teremos mais clínicas disponíveis!</p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          <div className="w-full sm:w-px h-px sm:h-6 bg-gray-200"></div>

          <div className="relative flex-1 w-full z-40">
            <MapPin className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-teal-600 w-4 h-4 sm:w-5 sm:h-5" />
            <button
              type="button"
              onClick={() => {
                // Fechar dropdown de clínicas quando abrir modal de localização
                setIsClinicDropdownOpen(false);
                setClinicHighlightedIdx(-1);
                setIsLocationModalOpen((v) => !v);
              }}
              className="w-full text-left pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-none h-10 sm:h-12 text-sm sm:text-base placeholder:text-gray-400 placeholder:font-medium location-button"
            >
              {gpsLoading
                ? "Obtendo localização..."
                : location || "Selecionar localização"}
            </button>

            {/* Modal de seleção de cidade */}
            {isLocationModalOpen && (
              <div
                className="absolute bg-white border border-gray-200 rounded-xl shadow-xl z-[999999] p-3 w-full sm:min-w-[320px] search-modal"
                style={{
                  position: "absolute",
                  zIndex: 99999999,
                  top: "100%",
                  left: "0",
                  right: "0",
                  marginTop: "0.5rem",
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                {/* Campo de busca de cidade */}
                <input
                  type="text"
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      if (isCityDropdownOpen) {
                        setCityHighlightedIdx((prev) =>
                          prev < citySuggestions.length - 1 ? prev + 1 : 0
                        );
                      }
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      if (isCityDropdownOpen) {
                        setCityHighlightedIdx((prev) =>
                          prev > 0 ? prev - 1 : citySuggestions.length - 1
                        );
                      }
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      if (
                        cityHighlightedIdx >= 0 &&
                        citySuggestions[cityHighlightedIdx]
                      ) {
                        handleCitySelect(citySuggestions[cityHighlightedIdx]);
                      }
                    } else if (e.key === "Escape") {
                      setIsLocationModalOpen(false);
                      setIsCityDropdownOpen(false);
                      setCityHighlightedIdx(-1);
                    }
                  }}
                  onFocus={() => {
                    if (citySuggestions.length > 0) {
                      setIsCityDropdownOpen(true);
                    }
                  }}
                  placeholder="Buscar cidade..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-600"
                />

                {/* Lista de resultados */}
                <div className="mt-3 max-h-[280px] overflow-auto divide-y divide-gray-100">
                  {/* Cidade do GPS */}
                  <button
                    type="button"
                    onClick={async () => {
                      console.log("Botão GPS clicado");
                      // Limpar localização selecionada manualmente
                      localStorage.removeItem("selectedLocation");

                      // Se já temos localização GPS, usar ela
                      if (gpsCity && gpsState) {
                        const gpsLabel = `${gpsCity} - ${getStateAbbreviation(
                          gpsState
                        )}`;
                        console.log("Usando GPS existente:", gpsLabel);
                        setLocation(gpsLabel);
                      } else {
                        // Tentar obter localização GPS
                        console.log("Obtendo nova localização GPS...");
                        await handleGetCurrentLocation();
                      }

                      setIsLocationModalOpen(false);
                      setLocationSearchQuery("");
                    }}
                    className="w-full flex items-center justify-between gap-2 px-3 py-3 hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {gpsCity && gpsState
                          ? `${gpsCity} - ${getStateAbbreviation(gpsState)}`
                          : "Usar minha localização"}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase text-teal-600 font-semibold">
                      GPS
                    </span>
                  </button>

                  {/* Sugestões de cidade */}
                  {locationSearchQuery && citySuggestions.length > 0 && (
                    <>
                      {citySuggestions.map((city, idx) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleCitySelect(city)}
                          onMouseEnter={() => setCityHighlightedIdx(idx)}
                          className={`w-full flex items-center gap-2 px-3 py-3 text-left ${
                            cityHighlightedIdx === idx
                              ? "bg-gray-100"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{city}</span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Mensagem quando não encontra cidades */}
                  {locationSearchQuery && citySuggestions.length === 0 && (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Nenhuma cidade encontrada
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Não encontramos cidades com "{locationSearchQuery}"
                      </p>
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>💡 Dicas:</p>
                        <p>• Digite o nome completo da cidade</p>
                        <p>• Tente sem acentos (ex: "Sao Paulo")</p>
                        <p>• Verifique se a cidade existe no Brasil</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="rounded-full w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-6"
            onClick={handleSearchButtonClick}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 sm:hidden mr-2" />
            <span className="text-sm sm:text-base">Buscar</span>
          </Button>
        </div>
      </motion.form>
    </>
  );
};

export default SearchBar;
