import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Clipboard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface VerificationInputProps {
  onVerify: (code: string) => void;
  isLoading: boolean;
}

const VerificationInput = ({ onVerify, isLoading }: VerificationInputProps) => {
  const [code, setCode] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text.trim().toUpperCase());
      toast.success("Code pasted from clipboard");
    } catch {
      toast.error("Unable to access clipboard");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onVerify(code.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full max-w-xl mx-auto px-4"
    >
      <div className="relative">
        {/* Glass container - Mobile optimized */}
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-2.5 bg-card/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-elevated border border-border/50">
          {/* Input row */}
          <div className="flex items-center gap-2 flex-1">
            {/* Search icon */}
            <div className="shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            
            {/* Input */}
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="flex-1 border-0 bg-transparent text-foreground text-base sm:text-lg font-mono tracking-wide placeholder:font-sans placeholder:text-sm sm:placeholder:text-base placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 h-10 sm:h-12 min-w-0"
              disabled={isLoading}
            />
            
            {/* Paste button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePaste}
              className="shrink-0 w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              disabled={isLoading}
            >
              <Clipboard className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Submit button */}
          <Button
            type="submit"
            disabled={!code.trim() || isLoading}
            className="shrink-0 bg-gradient-primary hover:opacity-90 text-primary-foreground px-6 sm:px-8 h-11 sm:h-12 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 w-full sm:w-auto"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
              />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 mr-2" />
                Verify
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
        
        {/* Helper text - no sample codes */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-center text-muted-foreground text-xs sm:text-sm"
        >
          Enter the unique verification code printed on your certificate
        </motion.p>
      </div>
    </motion.form>
  );
};

export default VerificationInput;
