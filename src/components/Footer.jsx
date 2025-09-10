import React from "react";
import VittaHubLogo from "../assets/vittahub-logo.svg";
function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div className="flex flex-col sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={VittaHubLogo}
                alt="VittaHub Logo"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <span className="text-xl sm:text-2xl font-bold">VittaHub</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 max-w-md">
              Sua saúde conectada. Encontre os melhores profissionais com
              facilidade.
            </p>
          </div>
          <div>
            <span className="font-semibold text-base sm:text-lg text-gray-200 mb-4 block">
              Para Pacientes
            </span>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  VittaHub para Pacientes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-base sm:text-lg text-gray-200 mb-4 block">
              Para Clínicas
            </span>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
              <li>
                <a
                  href="/para-clinicas"
                  className="hover:text-white transition-colors"
                >
                  VittaHub para Clínicas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-base sm:text-lg text-gray-200 mb-4 block">
              Contato
            </span>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-sm sm:text-base text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} VittaHub. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
