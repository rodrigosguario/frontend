import React, { useState, useEffect } from 'react';
import { Heart, Users, BookOpen, GraduationCap, Award, Stethoscope } from 'lucide-react';
import { siteContentAPI } from '../config/api';

const About = () => {
  const [aboutData, setAboutData] = useState({
    title: "Sobre o Dr. Rodrigo",
    description: "Médico cardiologista com ampla experiência em transplante cardíaco e cuidado humanizado.",
    education: [
      {
        institution: "Instituto do Coração (InCor) - USP-SP",
        degree: "Especialização em Insuficiência Cardíaca e Transplante",
        period: "2023-2024",
        description: "Centro de referência em cardiologia da América Latina"
      },
      {
        institution: "UNICAMP",
        degree: "Residência em Cardiologia",
        period: "2021-2023",
        description: "Formação especializada em cardiologia clínica e intervencionista"
      },
      {
        institution: "Universidade Federal de Pelotas (UFPel)",
        degree: "Graduação em Medicina",
        period: "2015-2020",
        description: "Formação médica com foco humanizado"
      }
    ],
    specialties: [
      "Transplante Cardíaco",
      "Insuficiência Cardíaca Avançada",
      "Cardiologia Preventiva",
      "Ecocardiografia",
      "Cateterismo Cardíaco",
      "Reabilitação Cardíaca"
    ],
    values: [
      {
        icon: "Heart",
        title: "Formação de Excelência",
        description: "InCor-USP, UNICAMP e UFPel. Formação acadêmica completa."
      },
      {
        icon: "Users",
        title: "Foco no Paciente",
        description: "Cuidado centrado nas necessidades individuais de cada paciente."
      },
      {
        icon: "BookOpen",
        title: "Atualização Constante",
        description: "Sempre em busca das mais recentes inovações em cardiologia."
      }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAboutContent();
  }, []);

  const loadAboutContent = async () => {
    try {
      setLoading(true);
      
      // Carregar todo o conteúdo e extrair a seção about
      const allContentResponse = await siteContentAPI.getAllContent();
      
      if (allContentResponse.success && allContentResponse.data && allContentResponse.data.about) {
        setAboutData(allContentResponse.data.about);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo do About:', error);
      // Manter dados padrão se houver erro
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      Heart: Heart,
      Users: Users,
      BookOpen: BookOpen,
      GraduationCap: GraduationCap,
      Award: Award,
      Stethoscope: Stethoscope
    };
    return icons[iconName] || Heart;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 mx-auto max-w-md"></div>
            <div className="h-4 bg-gray-300 rounded mb-8 mx-auto max-w-2xl"></div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {aboutData.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {aboutData.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Education & Experience */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <GraduationCap className="mr-3 h-6 w-6 text-blue-600" />
              Formação e Experiência
            </h3>
            
            <div className="space-y-6">
              {aboutData.education && aboutData.education.map((edu, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-600 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-blue-700 font-medium mb-2">{edu.institution}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{edu.description}</p>
                </div>
              ))}
            </div>

            {/* Specialties */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Stethoscope className="mr-3 h-6 w-6 text-blue-600" />
                Especialidades
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aboutData.specialties && aboutData.specialties.map((specialty, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-gray-800 font-medium">{specialty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Values & Philosophy */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Heart className="mr-3 h-6 w-6 text-blue-600" />
              Valores e Filosofia
            </h3>
            
            <div className="space-y-6">
              {aboutData.values && aboutData.values.map((value, index) => {
                const IconComponent = getIcon(value.icon);
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {value.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
              <h4 className="text-xl font-bold mb-4">Cuidado Personalizado</h4>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Cada paciente é único e merece um tratamento personalizado. 
                Minha abordagem combina experiência técnica com cuidado humano, 
                sempre priorizando o bem-estar e a qualidade de vida.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Agendar Consulta
                <Heart className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
