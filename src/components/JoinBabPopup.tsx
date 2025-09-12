import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Users, QrCode } from "lucide-react";

export function JoinBabPopup() {
  const [isOpen, setIsOpen] = useState(false);
  
  // WhatsApp group link - you can update this with your actual group link
  const whatsappGroupLink = "https://chat.whatsapp.com/Jaad8oEOUrDDxPMRkGmRbb?mode=ems_copy_c";
  
  // Generate QR code using QR Server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(whatsappGroupLink)}`;

  const handleJoinClick = () => {
    window.open(whatsappGroupLink, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Users className="w-4 h-4" />
          <span className="text-sm">join bab</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-sm mx-auto text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5" />
            BAB WhatsApp
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg">
              <img
                src={qrCodeUrl}
                alt="WhatsApp Group QR Code"
                className="w-48 h-48"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Scan the QR code with your phone to join our WhatsApp group
            </p>
            
            <Button onClick={handleJoinClick} className="w-full gap-2">
              <Users className="w-4 h-4" />
              Join WhatsApp Group
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}