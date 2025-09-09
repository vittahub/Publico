import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Search,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  User,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle,
} from "lucide-react";
import { Button } from "../ui/button";

const AppointmentModal = ({ isOpen, onClose, professional, clinic }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [procedureSearch, setProcedureSearch] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedProfessionalLocal, setSelectedProfessionalLocal] = useState(
    professional || null
  );
  const [specialistQuery, setSpecialistQuery] = useState("");
  const currentProfessional = selectedProfessionalLocal || professional || null;

  // Mock procedures data
  const procedures = [
    {
      id: 1,
      name: "Consulta Cardiológica",
      price: 250.0,
      description: "Avaliação completa do sistema cardiovascular",
    },
    {
      id: 2,
      name: "Eletrocardiograma (ECG)",
      price: 120.0,
      description: "Exame para avaliar a atividade elétrica do coração",
    },
    {
      id: 3,
      name: "Teste Ergométrico",
      price: 350.0,
      description: "Teste de esforço para avaliar a função cardíaca",
    },
    {
      id: 4,
      name: "Ecocardiograma",
      price: 280.0,
      description: "Ultrassom do coração para avaliar estrutura e função",
    },
    {
      id: 5,
      name: "Holter 24h",
      price: 180.0,
      description: "Monitoramento contínuo do ritmo cardíaco por 24 horas",
    },
  ];

  // Generate available dates (today + next 30 days, excluding weekends)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split("T")[0]);
      }
    }

    return dates;
  };

  const availableDates = generateAvailableDates();

  // Generate available times based on selected date
  const getAvailableTimes = (date) => {
    if (!date) return [];

    const today = new Date();
    const selectedDate = new Date(date);
    const isToday = selectedDate.toDateString() === today.toDateString();

    // All possible time slots
    const allTimes = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];

    if (isToday) {
      // For today, only show future time slots
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentTime = currentHour * 60 + currentMinute;

      return allTimes.filter((time) => {
        const [hour, minute] = time.split(":").map(Number);
        const timeInMinutes = hour * 60 + minute;
        return timeInMinutes > currentTime + 30; // 30 minutes buffer
      });
    }

    // For future dates, show all available times
    return allTimes;
  };

  const steps = [
    { id: 1, title: "Especialista", icon: User },
    { id: 2, title: "Procedimento", icon: Stethoscope },
    { id: 3, title: "Horário", icon: Clock },
    { id: 4, title: "Pagamento", icon: CreditCard },
    { id: 5, title: "Confirmação", icon: Check },
  ];

  // Lista de profissionais disponíveis (da clínica ou gerada pelas especialidades)
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

  const availableProfessionals =
    clinic?.professionals && clinic.professionals.length > 0
      ? clinic.professionals
      : (clinic?.specialties || []).slice(0, 6).map((specialty, idx) => ({
          id: idx + 1,
          name: sampleProfessionalNames[idx % sampleProfessionalNames.length],
          specialty,
          rating: 4.8,
          image:
            sampleProfessionalImages[idx % sampleProfessionalImages.length],
        }));

  const filteredProfessionalsList = availableProfessionals.filter((p) => {
    const q = specialistQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.specialty || "").toLowerCase().includes(q)
    );
  });

  const filteredProcedures = procedures.filter(
    (procedure) =>
      procedure.name.toLowerCase().includes(procedureSearch.toLowerCase()) ||
      procedure.description
        .toLowerCase()
        .includes(procedureSearch.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateAvailable = (date) => {
    if (!date) return false;

    // Check if date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    if (date < today) return false;

    // Check if date is in available dates
    const dateString = date.toISOString().split("T")[0];
    return availableDates.includes(dateString);
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toISOString().split("T")[0] === selectedDate;
  };

  const isDateToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const selectDate = (date) => {
    if (!date || !isDateAvailable(date)) return;
    const dateString = date.toISOString().split("T")[0];
    setSelectedDate(dateString);
    setSelectedTime(""); // Reset time when date changes

    // If current selected time is not available for new date, reset it
    const availableTimesForDate = getAvailableTimes(dateString);
    if (selectedTime && !availableTimesForDate.includes(selectedTime)) {
      setSelectedTime("");
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    // Here you would typically send the appointment data to your backend
    console.log("Appointment confirmed:", {
      professional: currentProfessional,
      procedure: selectedProcedure,
      date: selectedDate,
      time: selectedTime,
      clinic,
    });
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentProfessional
                  ? "Especialista Selecionado"
                  : "Escolha o Especialista"}
              </h3>
              {currentProfessional ? (
                <p className="text-gray-600">
                  Você pode continuar ou trocar o especialista
                </p>
              ) : (
                <p className="text-gray-600">
                  Busque e selecione o médico para continuar
                </p>
              )}
            </div>
            {currentProfessional ? (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center ring-1 ring-gray-200">
                      {currentProfessional.image ? (
                        <img
                          src={currentProfessional.image}
                          alt={currentProfessional.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-teal-700 font-semibold text-sm">
                          {(currentProfessional.name || "").split(" ")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-gray-900 truncate">
                        {currentProfessional.name}
                      </h4>
                      <div className="inline-flex items-center gap-1 text-[13px] text-gray-600">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">
                          {currentProfessional.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-teal-700 font-medium">
                      {currentProfessional.specialty}
                    </p>
                    <div className="mt-2 grid grid-cols-1 gap-2 text-[12px] text-gray-600">
                      <div className="inline-flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1 ring-1 ring-gray-200">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        30+ consultas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={specialistQuery}
                    onChange={(e) => setSpecialistQuery(e.target.value)}
                    placeholder="Buscar especialista..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                  {filteredProfessionalsList.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProfessionalLocal(p)}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-teal-50 text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-teal-100 overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {p.specialty}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Escolha o Procedimento
              </h3>
              <p className="text-gray-600">
                Selecione o procedimento que deseja realizar
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar procedimento..."
                value={procedureSearch}
                onChange={(e) => setProcedureSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredProcedures.map((procedure) => (
                <div
                  key={procedure.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedProcedure?.id === procedure.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                  onClick={() => setSelectedProcedure(procedure)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {procedure.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {procedure.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-teal-600">
                        {formatCurrency(procedure.price)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Escolha o Horário
              </h3>
              <p className="text-gray-600">
                Selecione a data e horário para sua consulta
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Professional Calendar */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-teal-600" />
                  Selecione a Data
                </h4>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    <h5 className="text-lg font-semibold text-gray-900">
                      {currentMonth
                        .toLocaleDateString("pt-BR", {
                          month: "long",
                          year: "numeric",
                        })
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </h5>

                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                      (day) => (
                        <div
                          key={day}
                          className="p-2 text-center text-sm font-medium text-gray-500"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentMonth).map((date, index) => {
                      if (!date) {
                        return <div key={index} className="p-2"></div>;
                      }

                      const isAvailable = isDateAvailable(date);
                      const isSelected = isDateSelected(date);
                      const isToday = isDateToday(date);

                      return (
                        <button
                          key={index}
                          onClick={() => selectDate(date)}
                          disabled={!isAvailable}
                          className={`
                            p-2 text-sm rounded-lg transition-all relative
                            ${
                              isSelected
                                ? "bg-teal-500 text-white font-semibold"
                                : isToday
                                ? "bg-teal-100 text-teal-700 font-semibold"
                                : isAvailable
                                ? "hover:bg-teal-50 text-gray-700 hover:text-teal-700"
                                : "text-gray-300 cursor-not-allowed"
                            }
                          `}
                        >
                          {date.getDate()}
                          {isAvailable && !isSelected && (
                            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-teal-400 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Date Info */}
                {selectedDate && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                    <div className="flex items-center text-teal-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        Data selecionada: {formatDate(selectedDate)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Time Selection */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-teal-600" />
                  Selecione o Horário
                </h4>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  {!selectedDate ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        Selecione uma data primeiro para ver os horários
                        disponíveis
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {getAvailableTimes(selectedDate).length > 0 ? (
                        getAvailableTimes(selectedDate).map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`
                              p-3 text-center rounded-lg border transition-all font-medium
                              ${
                                selectedTime === time
                                  ? "border-teal-500 bg-teal-500 text-white shadow-md"
                                  : "border-gray-200 hover:border-teal-300 hover:bg-teal-50 text-gray-700"
                              }
                            `}
                          >
                            {time}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-4">
                          <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">
                            {(() => {
                              const today = new Date();
                              const selectedDateObj = new Date(selectedDate);
                              const isToday =
                                selectedDateObj.toDateString() ===
                                today.toDateString();

                              if (isToday) {
                                return "Não há mais horários disponíveis para hoje. Selecione outra data.";
                              }
                              return "Não há horários disponíveis para esta data.";
                            })()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Time Info */}
                {selectedTime && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                    <div className="flex items-center text-teal-700">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        Horário selecionado: {selectedTime}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Forma de Pagamento
              </h3>
              <p className="text-gray-600">
                Escolha como deseja pagar pela consulta
              </p>
            </div>

            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl border-2 border-teal-500 bg-teal-50 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Pagamento Presencial
                    </h4>
                    <p className="text-sm text-gray-600">
                      Pague na clínica no dia da consulta
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">
                  Resumo do Agendamento
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Procedimento:</span>
                    <span className="font-medium">
                      {selectedProcedure?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium">
                      {selectedDate && formatDate(selectedDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horário:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-teal-600">
                      {selectedProcedure &&
                        formatCurrency(selectedProcedure.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Confirmação do Agendamento
              </h3>
              <p className="text-gray-600">
                Revise os dados antes de confirmar
              </p>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
              <h4 className="font-semibold text-gray-900 mb-4">
                Resumo do Agendamento
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Clínica</p>
                    <p className="font-medium">{clinic.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Especialista</p>
                    <p className="font-medium">{professional.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Procedimento</p>
                    <p className="font-medium">{selectedProcedure?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Data</p>
                    <p className="font-medium">
                      {selectedDate && formatDate(selectedDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Horário</p>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-teal-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-teal-600">
                    {selectedProcedure &&
                      formatCurrency(selectedProcedure.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/95 backdrop-blur-sm ring-1 ring-black/5 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Agendar Consulta
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-80 bg-gray-50 p-6 border-r border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-6">
                Seu Agendamento
              </h3>
              <div className="space-y-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        isCurrent
                          ? "bg-teal-100 text-teal-700"
                          : isCompleted
                          ? "bg-green-100 text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-teal-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-semibold">
                            {step.id}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{step.title}</p>
                        {isCurrent && (
                          <p className="text-xs opacity-75">Em andamento</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
              {renderStepContent()}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6"
            >
              Anterior
            </Button>

            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index + 1 <= currentStep ? "bg-teal-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 2 && !selectedProcedure) ||
                  (currentStep === 3 && (!selectedDate || !selectedTime))
                }
                className="px-6 bg-teal-600 hover:bg-teal-700"
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleConfirm}
                className="px-6 bg-green-600 hover:bg-green-700"
              >
                Confirmar Agendamento
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppointmentModal;
