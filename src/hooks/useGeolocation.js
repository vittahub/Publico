import { useState, useEffect } from "react";

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

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo navegador");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLoading(false);
      },
      (error) => {
        let errorMessage = "Erro ao obter localização";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permissão de localização negada";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Informação de localização indisponível";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo limite para obter localização";
            break;
          default:
            errorMessage = "Erro desconhecido";
        }

        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60000, // 1 minuto
      }
    );
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: { Accept: "application/json" },
        }
      );
      const data = await response.json();

      // Extrair cidade e estado usando a mesma lógica do Patient
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

      if (city && state) {
        return `${city} - ${getStateAbbreviation(state)}`;
      } else if (city) {
        return city;
      }

      return "Localização não encontrada";
    } catch (error) {
      console.error("Erro ao obter endereço:", error);
      return "Erro ao obter endereço";
    }
  };

  useEffect(() => {
    // Tentar obter localização automaticamente ao montar o componente
    getCurrentLocation();
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    getAddressFromCoords,
  };
};
