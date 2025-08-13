import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="section-padding bg-business-800 text-white">
      <div className="container-custom text-center">
        <div className="max-w-3xl mx-auto reveal fade-bottom">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Pronto para Maximizar seu Return On Life?
          </h2>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Não deixe que suas decisões financeiras sejam tomadas por acaso. 
            Nossa abordagem Life Centered Financial Planning vai ajudar você a 
            alinhar seu dinheiro com seus valores e objetivos de vida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="font-medium text-lg px-8 py-4"
              asChild
            >
              <a
                href="https://bit.ly/Pedro-Disponibilidade"
                target="_blank"
                rel="noopener noreferrer"
              >
                Agendar Reunião Gratuita <ArrowRight className="ml-2" size={20} />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-medium text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-business-800"
              onClick={() => window.location.href = '/home'}
            >
              Entrar no Sistema
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;