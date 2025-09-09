import React from "react";
import VittaHubLogo from "../assets/vittahub-logo.svg";
function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <img src={VittaHubLogo} alt="VittaHub Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold">VittaHub</span>
            </div>
            <p className="text-gray-400">
              Sua saúde conectada. Encontre os melhores profissionais com
              facilidade.
            </p>
          </div>
          <div>
            <span className="font-semibold text-lg text-gray-200 mb-4 block">
              Para Pacientes
            </span>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  VittaHub para Pacientes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-lg text-gray-200 mb-4 block">
              Para Clínicas
            </span>
            <ul className="space-y-3 text-gray-400">
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
            <span className="font-semibold text-lg text-gray-200 mb-4 block">
              Contato
            </span>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
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
