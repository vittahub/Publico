import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import {
  CheckCircle,
  BarChart,
  Users,
  Calendar,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

const FeatureCard = ({ icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
  >
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const ForClinicsPage = () => {
  const handleRegisterClick = () => {
    // Cadastro para clínicas não implementado
  };

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Aumente sua Visibilidade",
      description:
        "Alcance milhares de novos pacientes que buscam por especialistas na sua região.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Agenda Online Inteligente",
      description:
        "Simplifique o agendamento de consultas com um sistema fácil de usar para você e seus pacientes.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gerencie seus Pacientes",
      description:
        "Mantenha um registro organizado e acesse o histórico de seus pacientes com segurança.",
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Painel com Métricas",
      description:
        "Acompanhe seu desempenho com relatórios e insights para otimizar seus serviços.",
    },
  ];

  const plans = [
    {
      name: "Básico",
      price: "Grátis",
      description: "Comece a ter visibilidade online.",
      features: [
        "Perfil na plataforma",
        "Até 10 agendamentos/mês",
        "Suporte por e-mail",
      ],
    },
    {
      name: "Profissional",
      price: "R$ 99",
      popular: true,
      description: "Ideal para clínicas em crescimento.",
      features: [
        "Tudo do Básico",
        "Agendamentos ilimitados",
        "Lembretes por WhatsApp",
        "Suporte prioritário",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Soluções para grandes redes.",
      features: [
        "Tudo do Profissional",
        "API de integração",
        "Gerente de contas dedicado",
        "Relatórios avançados",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Para Clínicas | VittaHub - Aumente seus Pacientes</title>
        <meta
          name="description"
          content="Junte-se ao VittaHub e conecte-se a milhares de novos pacientes. Oferecemos ferramentas para aumentar sua visibilidade e gerenciar sua clínica."
        />
        <meta
          property="og:title"
          content="Para Clínicas | VittaHub - Aumente seus Pacientes"
        />
        <meta
          property="og:description"
          content="Junte-se ao VittaHub e conecte-se a milhares de novos pacientes."
        />
      </Helmet>

      <main className="bg-background">
        <section className="relative py-20 md:py-32 text-center bg-white overflow-hidden">
          <div className="absolute inset-0 hero-bg-grid opacity-50 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-teal-700 bg-teal-100 rounded-full">
                PARA CLÍNICAS E PROFISSIONAIS
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Conecte-se a mais pacientes.
                <br />
                <span className="gradient-text">Expanda sua clínica.</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
                Junte-se à principal plataforma de saúde e aumente sua
                visibilidade, otimize sua agenda e foque no que realmente
                importa: o cuidado com seus pacientes.
              </p>
              <Button
                size="lg"
                className="mt-8 font-semibold"
                onClick={handleRegisterClick}
              >
                Comece agora, é grátis <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
          <div className="absolute -bottom-1 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent z-10"></div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Tudo que você precisa para crescer
              </h2>
              <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                Ferramentas poderosas para simplificar sua gestão e impulsionar
                seus resultados.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Planos flexíveis para cada necessidade
              </h2>
              <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                Escolha o plano que melhor se adapta ao tamanho e aos objetivos
                da sua clínica.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`border rounded-2xl p-8 flex flex-col h-full ${
                    plan.popular
                      ? "border-teal-500 border-2 relative"
                      : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-semibold text-white bg-teal-500 rounded-full">
                      Mais Popular
                    </span>
                  )}

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-500 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">
                      {plan.price}
                    </span>
                    {plan.name !== "Básico" && plan.name !== "Enterprise" && (
                      <span className="text-gray-500">/mês</span>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8 text-gray-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-teal-500 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={handleRegisterClick}
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full mt-auto font-semibold"
                  >
                    {plan.name === "Enterprise"
                      ? "Fale conosco"
                      : "Escolher plano"}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="cta-gradient-bg text-white p-12 md:p-16 rounded-3xl"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Pronto para transformar sua clínica?
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
                Cadastre-se gratuitamente e comece a atrair mais pacientes hoje
                mesmo. Sem compromisso, sem cartão de crédito.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-teal-600 hover:bg-gray-100 font-bold h-14 px-10 text-base"
                onClick={handleRegisterClick}
              >
                Cadastre sua clínica agora
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ForClinicsPage;
