import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Award, FileCheck, Lock, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import VerificationInput from "@/components/VerificationInput";
import VerificationScanner from "@/components/VerificationScanner";
import CertificateDisplay from "@/components/CertificateDisplay";
import certificatesData from "@/data/certificates.json";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type VerificationState = "idle" | "scanning" | "success-transition" | "success" | "error";

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

const Index = () => {
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");
  const [foundCertificate, setFoundCertificate] = useState<Certificate | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (verificationState === "scanning") {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1.5;
        });
      }, 80);
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [verificationState]);

  const handleVerify = async (code: string) => {
    setVerificationState("scanning");
    setFoundCertificate(null);
    setScanProgress(0);

    // Wait for scanning animation (slower - ~5.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 5500));

    const certificate = certificatesData.certificates.find(
      cert => cert.code.toUpperCase() === code.toUpperCase() || 
              cert.serial.toUpperCase() === code.toUpperCase()
    );

    if (certificate) {
      setFoundCertificate(certificate);
      // Show green fingerprint transition
      setVerificationState("success-transition");
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVerificationState("success");
      toast.success("Certificate verified!", {
        description: `${certificate.name} - ${certificate.status}`,
      });
    } else {
      setVerificationState("error");
      toast.error("Not found", {
        description: "No certificate with this code",
      });
    }
  };

  const handleNewVerification = () => {
    setVerificationState("idle");
    setFoundCertificate(null);
    setScanProgress(0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden flex-shrink-0">
        {/* Decorative elements */}
        <div className="absolute inset-0 security-pattern" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

        <div className="container relative py-8 sm:py-12 lg:py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass text-accent mb-4 sm:mb-6"
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">Secure Portal</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success animate-pulse" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight"
            >
              Certificate{" "}
              <span className="text-gradient-gold">Verification</span>
            </motion.h1>

            {/* Verification States */}
            <AnimatePresence mode="wait">
              {verificationState === "idle" && (
                <VerificationInput 
                  key="input"
                  onVerify={handleVerify} 
                  isLoading={false}
                />
              )}

              {verificationState === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-4 sm:py-6"
                >
                  <VerificationScanner isScanning={true} progress={scanProgress} />
                </motion.div>
              )}

              {verificationState === "success-transition" && (
                <motion.div
                  key="success-transition"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="py-4 sm:py-6"
                >
                  <VerificationScanner isScanning={false} progress={100} isComplete={true} />
                </motion.div>
              )}

              {verificationState === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-8 sm:py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-destructive/20 flex items-center justify-center mb-4 sm:mb-6"
                  >
                    <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-display font-semibold mb-2">Verification Failed</h3>
                  <p className="text-primary-foreground/60 text-sm mb-6">
                    No certificate found. Please check your code.
                  </p>
                  <Button
                    onClick={handleNewVerification}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8 sm:h-12 md:h-16">
            <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 36C840 40 960 48 1080 52C1200 56 1320 56 1380 56L1440 56V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Certificate Result Section */}
      <AnimatePresence>
        {verificationState === "success" && foundCertificate && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container flex-1 py-6 sm:py-10 lg:py-12 px-4"
          >
            {/* Success header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6 sm:mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success mb-4 border border-success/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold text-sm">Verified</span>
              </motion.div>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                Certificate Details
              </h2>
            </motion.div>

            {/* Certificate Display */}
            <CertificateDisplay certificate={foundCertificate} />

            {/* Verify another button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-6 sm:mt-8"
            >
              <Button
                onClick={handleNewVerification}
                variant="outline"
                size="sm"
                className="font-semibold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Verify Another
              </Button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features Section */}
      {verificationState === "idle" && (
        <section className="container flex-1 py-10 sm:py-14 lg:py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
              Trusted Verification
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Enterprise-grade security for authentic certificate verification.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Shield,
                title: "Secure",
                description: "256-bit SSL encryption protects all verification requests."
              },
              {
                icon: FileCheck,
                title: "Instant Scan",
                description: "Advanced verification confirms authenticity in seconds."
              },
              {
                icon: Award,
                title: "Complete Records",
                description: "Access full certificate details and validity status."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="group relative bg-card rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-elegant border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mb-4 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-auto">
        <div className="container py-4 sm:py-6 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Shield className="w-4 h-4 text-accent" />
              </div>
              <span className="font-display font-semibold text-foreground text-sm">verify.kroxyio.com</span>
            </div>
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Kroxyio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
