import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import ForClinicsPage from "./pages/ForClinicsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ClinicPage from "./pages/ClinicPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { mockClinics } from "./constants/clinics";

import VittaHubLogo from "./assets/vittahub-logo.svg";
import "./styles/App.css";

function App() {
  const [allClinics, setAllClinics] = useState(mockClinics);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSearch = ({ searchTerm, location }) => {
    setIsSearching(true);
    const lowerSearch = searchTerm.toLowerCase();
    const lowerLocation = location.toLowerCase();

    const results = allClinics.filter((clinic) => {
      const matchesSearch =
        !lowerSearch ||
        clinic.name.toLowerCase().includes(lowerSearch) ||
        clinic.specialties.some((s) => s.toLowerCase().includes(lowerSearch));
      const matchesLocation =
        !lowerLocation || clinic.address.toLowerCase().includes(lowerLocation);
      return matchesSearch && matchesLocation;
    });

    setFilteredClinics(results);
  };

  const clearSearch = () => {
    setIsSearching(false);
    setFilteredClinics([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative flex items-center justify-center">
          {/* Logo do VittaHub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <img src={VittaHubLogo} alt="VittaHub Logo" className="w-16 h-16" />
          </motion.div>

          {/* Spinner girando ao redor da logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute w-24 h-24 border-2 border-gray-200 border-t-teal-500 rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar isForClinics={location.pathname === "/para-clinicas"} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <HomePage
                allClinics={allClinics}
                handleSearch={handleSearch}
                isSearching={isSearching}
                filteredClinics={filteredClinics}
                clearSearch={clearSearch}
              />
            }
          />
          <Route path="/para-clinicas" element={<ForClinicsPage />} />
          <Route
            path="/busca"
            element={
              <SearchResultsPage
                allClinics={allClinics}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
              />
            }
          />
          <Route
            path="/clinica/:id"
            element={<ClinicPage allClinics={allClinics} />}
          />
        </Routes>
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default App;
