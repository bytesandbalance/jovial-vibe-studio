import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
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
    <section className="py-20 px-6 bg-accent/20">
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
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Business Name *
                  </label>
                  <Input 
                    placeholder="Your Business Name"
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Contact Name *
                  </label>
                  <Input 
                    placeholder="Your Name"
                    className="h-12"
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
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Industry *
                </label>
                <Select>
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
                />
              </div>

              <Button className="btn-hero w-full h-12">
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
                  <p className="text-muted-foreground">hello@jovialstudio.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-coral rounded-2xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Phone</h4>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-dark rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Location</h4>
                  <p className="text-muted-foreground">Los Angeles, CA</p>
                </div>
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