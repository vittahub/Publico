import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, ChevronRight, Navigation, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import VittaHubLogo from "../assets/vittahub-logo.svg";
import { useGeolocation } from "../hooks/useGeolocation";

const Navbar = ({ isForClinics = false }) => {
  const [currentLocation, setCurrentLocation] = useState(() => {
    // Carregar localização do localStorage ao inicializar
    const savedLocation = localStorage.getItem("selectedLocation") || "";
    return savedLocation;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const {
    location: gpsLocation,
    loading: gpsLoading,
    error: gpsError,
    getCurrentLocation,
    getAddressFromCoords,
  } = useGeolocation();

  const handleAuthAction = (action) => {
    if (isForClinics) {
      // Contexto de clínicas
      if (action === "Login") {
        console.log("Login de clínica");
        // Implementar login de clínica
      } else if (action === "Cadastro") {
        console.log("Cadastro de clínica");
        // Implementar cadastro de clínica
      }
    } else {
      // Contexto de pacientes
      if (action === "Login") {
        console.log("Login de paciente");
        // Implementar login de paciente
      } else if (action === "Cadastro") {
        console.log("Cadastro de paciente");
        // Implementar cadastro de paciente
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    // Limpar dados de sessão específicos do contexto
    if (isForClinics) {
      localStorage.removeItem("clinicAuth");
    } else {
      localStorage.removeItem("patientAuth");
    }
  };

  const handleGetCurrentLocation = async () => {
    if (gpsLocation) {
      const address = await getAddressFromCoords(
        gpsLocation.latitude,
        gpsLocation.longitude
      );
      setCurrentLocation(address);
    } else {
      getCurrentLocation();
    }
  };

  useEffect(() => {
    // Carregar estado de autenticação específico do contexto
    if (isForClinics) {
      const clinicAuth = localStorage.getItem("clinicAuth");
      if (clinicAuth) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(clinicAuth));
      }
    } else {
      const patientAuth = localStorage.getItem("patientAuth");
      if (patientAuth) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(patientAuth));
      }
    }
  }, [isForClinics]);

  useEffect(() => {
    // Apenas carregar localização para pacientes
    if (!isForClinics && gpsLocation && !currentLocation) {
      getAddressFromCoords(gpsLocation.latitude, gpsLocation.longitude).then(
        setCurrentLocation
      );
    }
  }, [gpsLocation, currentLocation, isForClinics]);

  // Sincronizar com mudanças na localização do localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedLocation = localStorage.getItem("selectedLocation");
      if (savedLocation !== currentLocation) {
        setCurrentLocation(savedLocation || "");
      }
    };

    // Verificar mudanças periodicamente também (para mudanças na mesma aba)
    const interval = setInterval(() => {
      const savedLocation = localStorage.getItem("selectedLocation");
      if (savedLocation !== currentLocation) {
        setCurrentLocation(savedLocation || "");
      }
    }, 2000); // Aumentado para 2 segundos para reduzir verificações

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [currentLocation]);

  const navLinkClasses = ({ isActive }) =>
    `font-semibold text-gray-600 hover:text-teal-600 transition-colors ${
      isActive ? "text-teal-600" : ""
    }`;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
            {isForClinics ? (
              <div className="flex items-center space-x-2">
                <img
                  src={VittaHubLogo}
                  alt="VittaHub Logo"
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <div className="flex items-center">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                    VittaHub
                  </span>
                  <span className="text-xs sm:text-sm font-normal text-gray-500 ml-1 hidden sm:inline">
                    | Para Clínicas
                  </span>
                </div>
              </div>
            ) : (
              <NavLink to="/" className="flex items-center space-x-2">
                <img
                  src={VittaHubLogo}
                  alt="VittaHub Logo"
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                  VittaHub
                </span>
              </NavLink>
            )}
            {/* Localização apenas para pacientes */}
            {!isForClinics && currentLocation && (
              <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600" />
                <span className="font-medium truncate max-w-[120px] lg:max-w-none">
                  {currentLocation}
                </span>
              </div>
            )}
          </div>
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
            {isLoggedIn ? (
              <>
                <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">
                    Olá,{" "}
                    {userData?.name || (isForClinics ? "Clínica" : "Paciente")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold text-teal-600 hover:text-teal-700 hover:bg-teal-50 text-xs sm:text-sm"
                  onClick={() => handleAuthAction("Login")}
                >
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {isForClinics ? "Entrar como Clínica" : "Entrar"}
                  </span>
                  <span className="sm:hidden">Entrar</span>
                </Button>
                <Button
                  size="sm"
                  className="font-semibold text-xs sm:text-sm px-3 sm:px-4"
                  onClick={() => handleAuthAction("Cadastro")}
                >
                  <span className="hidden sm:inline">
                    {isForClinics ? "Cadastrar Clínica" : "Cadastre-se grátis"}
                  </span>
                  <span className="sm:hidden">
                    {isForClinics ? "Cadastrar" : "Cadastrar"}
                  </span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </Button>
              </>
            )}
          </div>

          {/* Menu mobile */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              onClick={() => handleAuthAction("Login")}
            >
              <LogIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
