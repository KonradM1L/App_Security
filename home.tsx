import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessagePanel from "@/components/message-panel";
import EncryptionVisualizer from "@/components/encryption-visualizer"; 
import AttackSimulator from "@/components/attack-simulator";
import SecurityTutorial from "@/components/security-tutorial";
import SecurityDetails from "@/components/security-details";

export default function Home() {
  const [activeTab, setActiveTab] = useState("messaging");

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>System Demonstracji Bezpieczeństwa</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ta aplikacja demonstruje koncepcje szyfrowania i bezpieczeństwa poprzez interaktywne przykłady:
          </p>
          <ul className="list-disc list-inside mt-2 text-muted-foreground">
            <li>Bezpieczna komunikacja z wizualizacją szyfrowania</li>
            <li>Symulacja ataku man-in-the-middle</li>
            <li>Porównanie zabezpieczonej i niezabezpieczonej komunikacji</li>
            <li>Interaktywny tutorial bezpieczeństwa</li>
            <li>Szczegółowy opis protokołów i zabezpieczeń</li>
          </ul>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="messaging">Komunikacja</TabsTrigger>
          <TabsTrigger value="visualization">Proces Szyfrowania</TabsTrigger>
          <TabsTrigger value="attack">Symulator Ataków</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          <TabsTrigger value="details">Szczegóły Techniczne</TabsTrigger>
        </TabsList>

        <TabsContent value="messaging">
          <MessagePanel />
        </TabsContent>

        <TabsContent value="visualization">
          <EncryptionVisualizer />
        </TabsContent>

        <TabsContent value="attack">
          <AttackSimulator />
        </TabsContent>

        <TabsContent value="tutorial">
          <SecurityTutorial />
        </TabsContent>

        <TabsContent value="details">
          <SecurityDetails />
        </TabsContent>
      </Tabs>
    </div>
  );
}