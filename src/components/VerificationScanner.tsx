import { motion } from "framer-motion";
import { Fingerprint, ScanLine } from "lucide-react";

interface VerificationScannerProps {
  isScanning: boolean;
  progress: number;
  isComplete?: boolean;
}

const VerificationScanner = ({ isScanning, progress, isComplete = false }: VerificationScannerProps) => {
  const stages = [
    "Initializing secure connection...",
    "Scanning document signature...",
    "Verifying certificate hash...",
    "Checking issuer credentials...",
    "Validating certificate chain...",
    "Finalizing verification..."
  ];

  const currentStage = Math.min(Math.floor(progress / 18), stages.length - 1);

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {/* Main scanner container */}
      <div className="relative">
        {/* Outer rotating ring */}
        {isScanning && !isComplete && (
          <motion.div
            className="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-dashed border-accent/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Success glow ring */}
        {isComplete && (
          <motion.div
            className="absolute -inset-4 sm:-inset-6 rounded-full border-2 border-success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Pulsing ring */}
        {isScanning && !isComplete && (
          <motion.div
            className="absolute -inset-3 sm:-inset-4 rounded-full border border-accent/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        {/* Main circle */}
        <motion.div
          className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 ${
            isComplete 
              ? "bg-success" 
              : "bg-gradient-primary"
          }`}
          animate={
            isComplete 
              ? { boxShadow: "0 0 50px rgba(34,197,94,0.6)" }
              : isScanning 
                ? { boxShadow: ["0 0 20px rgba(218,165,32,0.2)", "0 0 35px rgba(218,165,32,0.4)", "0 0 20px rgba(218,165,32,0.2)"] } 
                : {}
          }
          transition={{ duration: 2, repeat: isComplete ? 0 : Infinity }}
        >
          {/* Hexagon pattern */}
          {!isComplete && <div className="absolute inset-0 security-pattern opacity-30" />}

          {/* Scanning beam */}
          {isScanning && !isComplete && (
            <motion.div
              className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
              style={{ boxShadow: "0 0 15px hsl(38 85% 52% / 0.6)" }}
              initial={{ top: "15%" }}
              animate={{ top: ["15%", "85%", "15%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* Center icon - Fingerprint */}
          <motion.div
            animate={
              isComplete 
                ? { scale: [1, 1.15, 1] }
                : isScanning 
                  ? { scale: [1, 1.03, 1] } 
                  : {}
            }
            transition={{ duration: isComplete ? 0.6 : 2, repeat: isComplete ? 0 : Infinity }}
            className="relative z-10"
          >
            <Fingerprint 
              className={`w-10 h-10 sm:w-14 sm:h-14 drop-shadow-lg transition-colors duration-500 ${
                isComplete ? "text-white" : "text-accent"
              }`} 
            />
          </motion.div>

          {/* Corner brackets */}
          {isScanning && !isComplete && (
            <>
              <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-accent/60 rounded-tl" />
              <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-accent/60 rounded-tr" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-accent/60 rounded-bl" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-accent/60 rounded-br" />
            </>
          )}
        </motion.div>
      </div>

      {/* Progress section */}
      {isScanning && !isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 sm:mt-8 w-full max-w-[240px] sm:max-w-xs"
        >
          {/* Progress bar */}
          <div className="relative h-1.5 sm:h-2 bg-primary-foreground/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-gold rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            {/* Shimmer */}
            <motion.div
              className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Status text */}
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-accent text-xs sm:text-sm font-medium">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <ScanLine className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.div>
              <span>{stages[currentStage]}</span>
            </div>
            <p className="text-primary-foreground/50 text-[10px] sm:text-xs mt-1.5">{Math.round(progress)}% Complete</p>
          </motion.div>
        </motion.div>
      )}

      {/* Success message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-success text-lg sm:text-xl font-semibold">Verified Successfully</p>
          <p className="text-primary-foreground/60 text-xs sm:text-sm mt-1">Loading certificate...</p>
        </motion.div>
      )}
    </div>
  );
};

export default VerificationScanner;
