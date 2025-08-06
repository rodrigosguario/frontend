import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Heart, Award, Users, BookOpen, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const education = [
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
  ];

  const specialties = [
    "Transplante Cardíaco",
    "Insuficiência Cardíaca Avançada", 
    "Cardiologia Preventiva",
    "Ecocardiografia",
    "Cateterismo Cardíaco",
    "Reabilitação Cardíaca"
  ];

  const values = [
    {
      icon: Heart,
      title: "Formação de Excelência",
      description: "InCor-USP, UNICAMP e UFPel. Veja a jornada acadêmica completa abaixo."
    },
    {
      icon: Users,
      title: "Foco no Paciente", 
      description: "Cuidado centrado nas necessidades individuais de cada paciente."
    },
    {
      icon: BookOpen,
      title: "Inovação e Pesquisa",
      description: "Aplicação das mais recentes tecnologias e pesquisas clínicas."
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da seção */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Sobre Mim
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Paixão pela cardiologia, compromisso com a vida
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Conteúdo principal */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-primary" />
                Minha trajetória na medicina
              </h3>
              
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>
                  Fiz residência em Clínica Médica na UNICAMP, onde aprimorei minha atuação no cuidado de 
                  pacientes clínicos e graves. Foi nesse período, especialmente no contexto da pandemia de 
                  COVID-19, que compreendi a importância de estar ao lado dos pacientes nos momentos mais 
                  críticos de sua vida.
                </p>
                
                <p>
                  A Cardiologia se tornou, então, o caminho natural a seguir, pois une ciência baseada em 
                  evidências ao acompanhamento próximo dos pacientes e de suas famílias.
                </p>
                
                <p>
                  Segui minha formação na Cardiologia pelo Instituto do Coração (InCor) da USP-SP, em que 
                  tenho orgulho de falar que é o centro de referência em cardiologia da América Latina, e 
                  após a residência me especializei em Insuficiência Cardíaca Avançada e Transplante Cardíaco 
                  na mesma instituição.
                </p>
                
                <p>
                  No InCor tive a oportunidade de lidar com casos graves e complexos, em que o conhecimento 
                  científico precisa caminhar lado a lado com o acolhimento e escuta ativa, ou seja, a medicina 
                  que eu acredito.
                </p>
                
                <p>
                  Desde minha formação universitária no interior do Rio Grande do Sul, na Universidade Federal 
                  de Pelotas (UFPel), eu tive a oportunidade de desenvolver não apenas o conhecimento técnico, 
                  mas também um olhar humanizado para a profissão.
                </p>
                
                <p className="font-medium text-foreground">
                  Este é meu compromisso desde então: oferecer um atendimento cuidadoso e baseado na melhor 
                  ciência disponível, garantindo que cada paciente receba um acompanhamento individualizado. 
                  No consultório, busco não apenas diagnosticar e tratar, mas também proporcionar segurança 
                  e confiança para que cada pessoa cuide melhor da própria saúde.
                </p>
                
                <p className="text-primary font-semibold">
                  Estarei à disposição para guiá-lo nessa jornada com responsabilidade e dedicação.
                </p>
              </div>
            </div>

            {/* Especialidades */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground">Áreas de Especialização</h4>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <motion.div
                    key={specialty}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Badge variant="secondary" className="px-3 py-1 text-sm">
                      {specialty}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar com valores e formação */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Valores */}
            <div className="space-y-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-shadow hover-lift border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <value.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">
                            {value.title}
                          </h4>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Formação acadêmica */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-foreground flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-primary" />
                Minha Jornada Acadêmica
              </h4>
              
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="border-l-4 border-l-primary bg-card/50">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h5 className="font-semibold text-foreground text-sm">
                            {edu.institution}
                          </h5>
                          <p className="text-primary font-medium text-sm">
                            {edu.degree}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {edu.period}
                          </p>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            {edu.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

