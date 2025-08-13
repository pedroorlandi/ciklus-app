import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulingModal = ({ isOpen, onClose }: SchedulingModalProps) => {
  const handleSchedule = () => {
    window.open("https://bit.ly/Pedro-Disponibilidade", "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-business-950">
            Agendar Reunião
          </DialogTitle>
          <DialogDescription className="text-center">
            Vamos conversar sobre como podemos ajudar você a maximizar seu Return On Life
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="text-center">
            <img
              src="/color_logo_transparent.png"
              alt="Ciklus Logo"
              className="h-16 w-auto mx-auto mb-4"
            />
            <p className="text-sm text-gray-600 mb-6">
              Nossa reunião é totalmente gratuita e sem compromisso. 
              Vamos entender seus objetivos e mostrar como nosso planejamento 
              financeiro pode transformar sua vida.
            </p>
          </div>
          <Button
            onClick={handleSchedule}
            size="lg"
            className="w-full"
          >
            Agendar Agora <ArrowRight className="ml-2" size={16} />
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulingModal;