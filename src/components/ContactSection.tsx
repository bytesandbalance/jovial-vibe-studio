import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Instagram, Youtube, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.businessName || !formData.contactName || !formData.email || !formData.industry || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Create mailto link with form data
    const subject = `New Project Inquiry from ${formData.businessName}`;
    const body = `Business Name: ${formData.businessName}
Contact Name: ${formData.contactName}
Email: ${formData.email}
Phone: ${formData.phone}
Industry: ${formData.industry}

Brand Goals / Key Message:
${formData.message}`;
    
    const mailtoLink = `mailto:pegah@jovial.co.nz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    toast({
      title: "Email Client Opening",
      description: "Your default email client should open with the project details filled in."
    });
  };

  const industries = [
    "Food & Restaurants",
    "Fitness & Gyms", 
    "Retail & Shopping",
    "Automotive",
    "Real Estate",
    "Beauty & Salons",
    "Healthcare",
    "Professional Services",
    "Other"
  ];

  return (
    <section id="contact" className="py-20 px-6 bg-accent/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Let's Create <span className="gradient-text">Together</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your brand with video content that builds culture and drives engagement?
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-soft">
            <h3 className="text-2xl font-semibold text-foreground mb-8">Start Your Project</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Business Name *
                  </label>
                  <Input 
                    placeholder="Your Business Name"
                    className="h-12"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Contact Name *
                  </label>
                  <Input 
                    placeholder="Your Name"
                    className="h-12"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <Input 
                    type="email"
                    placeholder="your@email.com"
                    className="h-12"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <Input 
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="h-12"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Industry *
                </label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)} required>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase().replace(/\s+/g, '-')}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Brand Goals / Key Message *
                </label>
                <Textarea 
                  placeholder="Tell us about your brand goals, the energy you want to create, and what makes your business special..."
                  className="min-h-[120px] resize-none"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="btn-hero w-full h-12">
                Get Started Today
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Ready to bring your brand to life? Let's discuss how we can create 
                video content that builds your culture and attracts customers naturally.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <a href="mailto:pegah@jovial.co.nz" className="text-muted-foreground hover:text-primary transition-colors">
                    pegah@jovial.co.nz
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-coral rounded-2xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Phone</h4>
                  <a href="tel:+64221942319" className="text-muted-foreground hover:text-primary transition-colors">
                    +64 22 194 2319
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-dark rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Location</h4>
                  <p className="text-muted-foreground">Wellington, New Zealand</p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <a 
                  href="https://www.instagram.com/jovial.co.nz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-accent/50 hover:bg-accent transition-colors"
                >
                  <Instagram className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">Instagram</span>
                </a>
                
                <a 
                  href="https://www.youtube.com/@jovial.modulet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-accent/50 hover:bg-accent transition-colors"
                >
                  <Youtube className="w-5 h-5 text-coral" />
                  <span className="text-sm font-medium text-foreground">YouTube</span>
                </a>
                
                <a 
                  href="https://www.tiktok.com/@dancingai.5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-accent/50 hover:bg-accent transition-colors"
                >
                  <Music className="w-5 h-5 text-foreground" />
                  <span className="text-sm font-medium text-foreground">TikTok</span>
                </a>
                
                <a 
                  href="https://chat.whatsapp.com/KLr3nx5Q4G25NVzo5xdWtd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-accent/50 hover:bg-accent transition-colors"
                >
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-foreground">WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="bg-gradient-hero rounded-3xl p-8 text-white">
              <h4 className="text-xl font-semibold mb-4">Quick Response Promise</h4>
              <p className="text-white/90 leading-relaxed">
                We'll get back to you within 2 hours during business hours. 
                Need it faster? Call us directly or use our WhatsApp chat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;