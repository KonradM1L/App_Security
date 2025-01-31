import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Shield, Lock, Key, AlertTriangle, Database, Zap, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const socket = io();

// Types
interface Message {
  id: string;
  text: string;
  encrypted: string;
  timestamp: number;
}

interface EncryptionStep {
  step: string;
  result: string;
}

interface TutorialStep {
  title: string;
  content: string;
  icon: JSX.Element;
  exercise?: {
    task: string;
    solution: string;
  };
}

// Attack Simulator Component
export function AttackSimulator() {
  const [isSecure, setIsSecure] = useState(true);
  const [isAttackActive, setIsAttackActive] = useState(false);
  const [interceptedData, setInterceptedData] = useState<string | null>(null);

  const simulateTransfer = async () => {
    setInterceptedData(null);
    
    if (!isSecure && isAttackActive) {
      setInterceptedData("INTERCEPTED: User credentials and session data");
    }

    setTimeout(() => {
      if (isSecure) {
        setInterceptedData("Transfer completed securely - No data leaked");
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Man-in-the-Middle Attack Simulator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={isSecure}
                onCheckedChange={setIsSecure}
              />
              <span>Use Secure Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={isAttackActive}
                onCheckedChange={setIsAttackActive}
              />
              <span>Activate MITM Attack</span>
            </div>
          </div>

          <Button 
            className="w-full"
            variant={isSecure ? "default" : "destructive"}
            onClick={simulateTransfer}
          >
            Simulate Data Transfer
          </Button>
        </CardContent>
      </Card>

      {interceptedData && (
        <Alert variant={isSecure ? "default" : "destructive"}>
          {isSecure ? (
            <Shield className="h-4 w-4" />
          ) : (
            <ShieldAlert className="h-4 w-4" />
          )}
          <AlertDescription>
            {interceptedData}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Encryption Visualizer Component
export function EncryptionVisualizer() {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState<EncryptionStep[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const visualizeEncryption = async () => {
    if (!input.trim()) return;

    setIsAnimating(true);
    setSteps([]);

    try {
      const res = await apiRequest("POST", "/api/visualize-encryption", { text: input });
      const data = await res.json();

      for (const step of data.steps) {
        setSteps(prev => [...prev, step]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    } catch (error) {
      console.error("Failed to visualize encryption:", error);
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Encryption Process Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Enter text to encrypt..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isAnimating}
            />
            <Button 
              onClick={visualizeEncryption}
              disabled={isAnimating}
              className="relative"
            >
              {isAnimating ? (
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              ) : null}
              Visualize
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence mode="popLayout">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  Step {index + 1}: {step.step}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ background: "rgba(var(--primary) / 0.1)" }}
                  animate={{ background: "transparent" }}
                  transition={{ duration: 1 }}
                  className="rounded-md overflow-hidden"
                >
                  <code className="block p-4 bg-muted rounded-md text-sm font-mono">
                    {step.result}
                  </code>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Message Panel Component
export function MessagePanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const { data: messageHistory } = useQuery({
    queryKey: ['/api/messages'],
    queryFn: async () => {
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Failed to fetch message history');
      return response.json() as Promise<Message[]>;
    }
  });

  useEffect(() => {
    if (messageHistory) {
      setMessages(messageHistory);
    }
  }, [messageHistory]);

  useEffect(() => {
    socket.on("message", (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on("error", (error: string) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error
      });
    });

    return () => {
      socket.off("message");
      socket.off("error");
    };
  }, [toast]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("send_message", input);
    setInput("");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <ScrollArea className="h-[400px] mb-4 p-4 border rounded-md">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">Message:</span>
                <span>{msg.text}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Encrypted</Badge>
                <code className="text-xs bg-muted p-1 rounded">
                  {msg.encrypted}
                </code>
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Security Details Component
const algorithmDetails = [
  {
    name: "AES (Advanced Encryption Standard)",
    icon: <Lock className="w-6 h-6" />,
    description: "Symetryczny algorytm szyfrowania używany w naszej aplikacji do zabezpieczania komunikacji. Wykorzystuje 256-bitowy klucz i zapewnia wysoki poziom bezpieczeństwa.",
    implementation: "Implementacja poprzez bibliotekę CryptoJS z bezpiecznym zarządzaniem kluczami.",
  },
  {
    name: "Szyfrowanie symetryczne",
    icon: <Shield className="w-6 h-6" />,
    description: "Proces wykorzystujący ten sam klucz do szyfrowania i deszyfrowania danych. W naszej aplikacji demonstrujemy ten proces w czasie rzeczywistym.",
    implementation: "Wizualizacja procesu szyfrowania i deszyfrowania w interfejsie użytkownika.",
  }
];

const attackTypes = [
  {
    name: "Man-in-the-Middle (MITM)",
    icon: <AlertTriangle className="w-6 h-6" />,
    description: "Atak polegający na przechwyceniu komunikacji między dwiema stronami. Demonstrowany w symulatorze ataków.",
    prevention: "Wykorzystanie szyfrowania end-to-end i certyfikatów SSL/TLS.",
  },
  {
    name: "SQL Injection",
    icon: <Database className="w-6 h-6" />,
    description: "Atak polegający na wstrzyknięciu złośliwego kodu SQL do aplikacji. Może prowadzić do nieautoryzowanego dostępu do bazy danych.",
    prevention: "Wykorzystanie ORM (Drizzle) i parametryzowanych zapytań. Walidacja danych wejściowych.",
  },
  {
    name: "Denial of Service (DOS)",
    icon: <Zap className="w-6 h-6" />,
    description: "Atak mający na celu przeciążenie systemu i uniemożliwienie dostępu prawowitym użytkownikom.",
    prevention: "Rate limiting, monitorowanie ruchu, firewall aplikacyjny.",
  }
];

export function SecurityDetails() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Szczegóły Bezpieczeństwa Systemu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-4">Wykorzystane Algorytmy</h3>
              <Accordion type="single" collapsible className="w-full">
                {algorithmDetails.map((algo, index) => (
                  <AccordionItem key={index} value={`algo-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        {algo.icon}
                        <span>{algo.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 p-4 bg-secondary/20 rounded-md">
                        <p className="text-sm text-muted-foreground">{algo.description}</p>
                        <div className="mt-2">
                          <strong className="text-sm">Implementacja:</strong>
                          <p className="text-sm text-muted-foreground">{algo.implementation}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">Potencjalne Ataki i Zabezpieczenia</h3>
              <Accordion type="single" collapsible className="w-full">
                {attackTypes.map((attack, index) => (
                  <AccordionItem key={index} value={`attack-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        {attack.icon}
                        <span>{attack.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 p-4 bg-secondary/20 rounded-md">
                        <p className="text-sm text-muted-foreground">{attack.description}</p>
                        <div className="mt-2">
                          <strong className="text-sm">Zabezpieczenia:</strong>
                          <p className="text-sm text-muted-foreground">{attack.prevention}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Security Tutorial Component
const tutorialSteps: TutorialStep[] = [
  {
    title: "Podstawy Bezpieczeństwa",
    content: "Bezpieczna komunikacja opiera się na szyfrowaniu danych. Szyfrowanie przekształca Twoją wiadomość w kod, który może odczytać tylko zamierzony odbiorca.",
    icon: <Shield className="w-6 h-6" />,
    exercise: {
      task: "Spróbuj wysłać zaszyfrowaną wiadomość 'Hello' używając panelu komunikacji.",
      solution: "Wpisz 'Hello' w pole tekstowe i kliknij 'Wyślij'. Zauważ, jak tekst jest automatycznie szyfrowany."
    }
  },
  {
    title: "Szyfrowanie w Praktyce",
    content: "Twoja wiadomość jest szyfrowana przy użyciu zaawansowanego algorytmu AES. Proces ten zapewnia, że nawet jeśli ktoś przechwyci Twoją wiadomość, nie będzie w stanie jej odczytać bez klucza.",
    icon: <Lock className="w-6 h-6" />,
    exercise: {
      task: "Przejdź do zakładki 'Encryption Process' i zobacz, jak działa szyfrowanie w czasie rzeczywistym.",
      solution: "Obserwuj, jak każdy krok szyfrowania przekształca Twoją wiadomość w zaszyfrowany tekst."
    }
  },
  {
    title: "Zagrożenia Bezpieczeństwa",
    content: "Ataki typu man-in-the-middle to jedna z najczęstszych form zagrożeń. Sprawdź, jak szyfrowanie chroni przed takimi atakami.",
    icon: <AlertTriangle className="w-6 h-6" />,
    exercise: {
      task: "Wypróbuj symulator ataku w zakładce 'Attack Simulation'. Włącz i wyłącz szyfrowanie, aby zobaczyć różnicę.",
      solution: "Zauważ, jak włączone szyfrowanie uniemożliwia przechwycenie danych, podczas gdy wyłączone szyfrowanie naraża dane na wyciek."
    }
  },
  {
    title: "Klucze i Bezpieczeństwo",
    content: "Klucze szyfrowania są jak cyfrowe zamki. Tylko osoby z odpowiednim kluczem mogą odszyfrować wiadomość.",
    icon: <Key className="w-6 h-6" />,
    exercise: {
      task: "Sprawdź historię zaszyfrowanych wiadomości. Zauważ, że każda wiadomość ma swoją zaszyfrowaną formę.",
      solution: "Wszystkie zaszyfrowane wiadomości są bezpiecznie przechowywane w bazie danych i można je przeglądać w panelu wiadomości."
    }
  }
];

export function SecurityTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setShowSolution(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setShowSolution(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tutorial Bezpiecznej Komunikacji</CardTitle>
            <Progress value={progress} className="w-[100px]" />
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  {tutorialSteps[currentStep].icon}
                </div>
                <h3 className="text-xl font-semibold">
                  {tutorialSteps[currentStep].title}
                </h3>
              </div>

              <p className="text-muted-foreground">
                {tutorialSteps[currentStep].content}
              </p>

              {tutorialSteps[currentStep].exercise && (
                <Card className="bg-secondary/50">
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-2">Ćwiczenie:</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tutorialSteps[currentStep].exercise.task}
                    </p>
                    
                    {showSolution && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-background p-4 rounded-md"
                      >
                        <p className="text-sm">
                          {tutorialSteps[currentStep].exercise.solution}
                        </p>
                      </motion.div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSolution(!showSolution)}
                      className="mt-2"
                    >
                      {showSolution ? "Ukryj rozwiązanie" : "Pokaż rozwiązanie"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Poprzedni
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === tutorialSteps.length - 1}
            >
              Następny
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
