import { motion } from "framer-motion";
import { 
  Shield, Calendar, Building2, Copy, Check, AlertTriangle, 
  Award, User, Hash, Clock, Globe, 
  BadgeCheck, QrCode
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Certificate {
  serial: string;
  code: string;
  name: string;
  title: string;
  issueDate: string;
  expiryDate: string;
  organization: string;
  image: string;
  status: string;
}

interface CertificateDisplayProps {
  certificate: Certificate;
}

const CertificateDisplay = ({ certificate }: CertificateDisplayProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const isValid = certificate.status === "valid";

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`Copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = () => {
    const expiry = new Date(certificate.expiryDate);
    const today = new Date();
    const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Main Certificate Card */}
      <div className="relative bg-card rounded-2xl shadow-elevated overflow-hidden border border-border">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />

        {/* Header with stamp */}
        <div className="relative bg-gradient-hero p-4 sm:p-6 overflow-hidden">
          <div className="absolute inset-0 security-pattern opacity-50" />
          
          {/* Verified stamp */}
          <motion.div
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border-2 ${
              isValid 
                ? "border-success bg-success/20 text-success" 
                : "border-warning bg-warning/20 text-warning"
            } font-bold text-xs sm:text-sm uppercase tracking-wider`}
            initial={{ scale: 3, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: -6 }}
            transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
          >
            <div className="flex items-center gap-1.5">
              {isValid ? <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              {isValid ? "VERIFIED" : "EXPIRED"}
            </div>
          </motion.div>

          {/* Organization */}
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/20">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
            <div>
              <p className="text-primary-foreground/60 text-[10px] sm:text-xs uppercase tracking-wider">Issued By</p>
              <h3 className="text-primary-foreground font-display text-sm sm:text-lg font-semibold">{certificate.organization}</h3>
            </div>
          </div>
        </div>

        {/* Certificate Image */}
        <div className="relative -mt-2 mx-4 sm:mx-6 z-10">
          <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-card bg-card">
            <img
              src={certificate.image}
              alt="Certificate"
              className="w-full h-32 sm:h-44 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            
            {/* QR Code */}
            <div className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-card/95 backdrop-blur-sm rounded-lg flex items-center justify-center border border-border">
              <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 pt-4 space-y-4 sm:space-y-6">
          {/* Title & Recipient */}
          <div className="text-center border-b border-border pb-4 sm:pb-6">
            <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-widest mb-1">Certifies</p>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
              {certificate.name}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">Has completed</p>
            <h2 className="font-display text-base sm:text-lg font-semibold text-gradient-gold mt-1">
              {certificate.title}
            </h2>
          </div>

          {/* Info Grid - Compact on mobile */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Serial */}
            <div className="bg-muted/40 rounded-xl p-3 sm:p-4 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Serial</p>
                    <p className="font-mono font-bold text-foreground text-xs sm:text-sm truncate">{certificate.serial}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(certificate.serial, "Serial")}
                  className="shrink-0 w-7 h-7 sm:w-8 sm:h-8"
                >
                  {copiedField === "Serial" ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>

            {/* Code */}
            <div className="bg-muted/40 rounded-xl p-3 sm:p-4 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Code</p>
                    <p className="font-mono font-bold text-foreground text-xs sm:text-sm truncate">{certificate.code}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(certificate.code, "Code")}
                  className="shrink-0 w-7 h-7 sm:w-8 sm:h-8"
                >
                  {copiedField === "Code" ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>

            {/* Issue Date */}
            <div className="bg-muted/40 rounded-xl p-3 sm:p-4 border border-border/50">
              <div className="flex items-center gap-2">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-success" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Issued</p>
                  <p className="font-semibold text-foreground text-xs sm:text-sm">{formatDate(certificate.issueDate)}</p>
                </div>
              </div>
            </div>

            {/* Expiry Date */}
            <div className="bg-muted/40 rounded-xl p-3 sm:p-4 border border-border/50">
              <div className="flex items-center gap-2">
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isValid ? "bg-primary/10" : "bg-destructive/10"}`}>
                  <Clock className={`w-4 h-4 ${isValid ? "text-primary" : "text-destructive"}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Expires</p>
                  <p className="font-semibold text-foreground text-xs sm:text-sm">{formatDate(certificate.expiryDate)}</p>
                  {isValid && <p className="text-[9px] text-success">{daysRemaining} days left</p>}
                </div>
              </div>
            </div>

            {/* Holder */}
            <div className="bg-muted/40 rounded-xl p-3 sm:p-4 border border-border/50">
              <div className="flex items-center gap-2">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Holder</p>
                  <p className="font-semibold text-foreground text-xs sm:text-sm truncate">{certificate.name}</p>
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="bg-muted/40 rounded-xl p-3 sm:p-4 border border-border/50">
              <div className="flex items-center gap-2">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">Authority</p>
                  <p className="font-semibold text-foreground text-xs sm:text-sm truncate">{certificate.organization}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`rounded-xl p-4 ${
            isValid 
              ? "bg-success/10 border border-success/20" 
              : "bg-destructive/10 border border-destructive/20"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                isValid ? "bg-success" : "bg-destructive"
              }`}>
                {isValid ? (
                  <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm sm:text-base ${isValid ? "text-success" : "text-destructive"}`}>
                  {isValid ? "Valid & Authentic" : "Expired"}
                </h4>
                <p className="text-muted-foreground text-[10px] sm:text-xs mt-0.5 line-clamp-2">
                  {isValid 
                    ? "This certificate is verified and currently active."
                    : "Contact issuing authority for renewal."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border text-[10px] sm:text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              <span>verify.kroxyio.com</span>
            </div>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateDisplay;
