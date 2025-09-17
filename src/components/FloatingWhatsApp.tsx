import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "+64221942319";
  const message = "Hi! I'm interested in learning more about Jovial's video content services.";

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Main WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Open WhatsApp chat"
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <MessageCircle className="w-7 h-7 text-white" />
          )}
        </button>

        {/* Pulse Animation Ring */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 bg-white rounded-3xl shadow-2xl border border-border animate-slide-in-right">
          <div className="bg-green-500 rounded-t-3xl p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">Jovial Studio</h4>
                <p className="text-white/80 text-sm">Typically replies instantly</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="bg-gray-100 rounded-2xl p-3 text-sm">
              <p className="text-gray-800">
                👋 Hi there! Ready to create amazing video content for your business?
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-2xl p-3 text-sm">
              <p className="text-gray-800">
                We're here to help you build culture, energy, and brand presence through video!
              </p>
            </div>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-2xl font-medium transition-colors duration-200"
            >
              Start Chat on WhatsApp
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              You'll be redirected to WhatsApp
            </p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default FloatingWhatsApp;