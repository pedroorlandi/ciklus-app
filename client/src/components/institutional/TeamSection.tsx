import { Linkedin, Mail } from "lucide-react";

export default function TeamSection() {
  const team = [
    {
      name: "Pedro Orlandi",
      role: "Founder & CEO",
      description: "Especialista em planejamento financeiro familiar com mais de 10 anos de experiência em gestão patrimonial.",
      image: "/api/placeholder/300/300",
      linkedin: "#",
      email: "pedro@ciklus.com.br"
    },
    {
      name: "Ana Silva",
      role: "Head de Tecnologia",
      description: "Engenheira de software com expertise em sistemas financeiros e segurança de dados.",
      image: "/api/placeholder/300/300",
      linkedin: "#",
      email: "ana@ciklus.com.br"
    },
    {
      name: "Carlos Santos",
      role: "Consultor Financeiro Senior",
      description: "CFP certificado com especialização em planejamento sucessório e gestão de patrimônio familiar.",
      image: "/api/placeholder/300/300",
      linkedin: "#",
      email: "carlos@ciklus.com.br"
    }
  ];

  return (
    <section id="team" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nossa <span className="text-business-600">Equipe</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Profissionais experientes e certificados, comprometidos em ajudar sua família 
              a alcançar a independência financeira.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div 
              key={index}
              className={`reveal delay-${index * 300} bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-business-200 text-center`}
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-business-100 to-blue-100 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for profile image */}
                  <div className="w-20 h-20 rounded-full bg-business-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-business-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {member.name}
              </h3>
              
              <p className="text-business-600 font-semibold mb-4">
                {member.role}
              </p>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {member.description}
              </p>

              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a 
                  href={member.linkedin}
                  className="bg-business-100 hover:bg-business-200 p-2 rounded-lg transition-colors"
                  aria-label={`LinkedIn de ${member.name}`}
                >
                  <Linkedin className="h-5 w-5 text-business-600" />
                </a>
                <a 
                  href={`mailto:${member.email}`}
                  className="bg-business-100 hover:bg-business-200 p-2 rounded-lg transition-colors"
                  aria-label={`Email de ${member.name}`}
                >
                  <Mail className="h-5 w-5 text-business-600" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Company Culture Section */}
        <div className="mt-20">
          <div className="reveal">
            <div className="bg-gradient-to-r from-business-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Nosso Compromisso
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                Acreditamos que o sucesso financeiro não é apenas sobre números, mas sobre 
                criar um futuro seguro e próspero para sua família. Nossa equipe trabalha 
                incansavelmente para democratizar o acesso ao planejamento financeiro de qualidade.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">5+</div>
                  <div className="text-blue-100">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">100+</div>
                  <div className="text-blue-100">Famílias Atendidas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-blue-100">Suporte Disponível</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-16">
          <div className="reveal">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-8">
                Certificações e Parcerias
              </h3>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="bg-gray-200 px-6 py-3 rounded-lg">
                  <span className="text-gray-600 font-semibold">CFP</span>
                </div>
                <div className="bg-gray-200 px-6 py-3 rounded-lg">
                  <span className="text-gray-600 font-semibold">CFA</span>
                </div>
                <div className="bg-gray-200 px-6 py-3 rounded-lg">
                  <span className="text-gray-600 font-semibold">FGV</span>
                </div>
                <div className="bg-gray-200 px-6 py-3 rounded-lg">
                  <span className="text-gray-600 font-semibold">PLANEJAR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}