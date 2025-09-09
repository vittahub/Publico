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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            {isForClinics ? (
              <div className="flex items-center space-x-2">
                <img
                  src={VittaHubLogo}
                  alt="VittaHub Logo"
                  className="w-8 h-8"
                />
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-800">
                    VittaHub
                  </span>
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    | Para Clínicas
                  </span>
                </div>
              </div>
            ) : (
              <NavLink to="/" className="flex items-center space-x-2">
                <img
                  src={VittaHubLogo}
                  alt="VittaHub Logo"
                  className="w-8 h-8"
                />
                <span className="text-2xl font-bold text-gray-800">
                  VittaHub
                </span>
              </NavLink>
            )}
            {/* Localização apenas para pacientes */}
            {!isForClinics && currentLocation && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span className="font-medium">{currentLocation}</span>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">
                    Olá,{" "}
                    {userData?.name || (isForClinics ? "Clínica" : "Paciente")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="font-semibold text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="font-semibold text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  onClick={() => handleAuthAction("Login")}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {isForClinics ? "Entrar como Clínica" : "Entrar"}
                </Button>
                <Button
                  className="font-semibold"
                  onClick={() => handleAuthAction("Cadastro")}
                >
                  {isForClinics ? "Cadastrar Clínica" : "Cadastre-se grátis"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
