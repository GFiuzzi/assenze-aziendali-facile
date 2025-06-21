
import { useState } from "react";
import { AbsenceCalendar } from "@/components/AbsenceCalendar";
import { AbsenceTable } from "@/components/AbsenceTable";
import { AddAbsenceForm } from "@/components/AddAbsenceForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Absence } from "@/types/absence";
import { mockEmployees, mockAbsences } from "@/data/mockData";
import { CalendarDays, Users, Plus } from "lucide-react";

const Index = () => {
  const [absences, setAbsences] = useState<Absence[]>(mockAbsences);

  const handleAddAbsence = (newAbsence: Omit<Absence, "id" | "createdAt">) => {
    const absence: Absence = {
      ...newAbsence,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAbsences(prev => [...prev, absence]);
  };

  const handleDeleteAbsence = (id: string) => {
    setAbsences(prev => prev.filter(absence => absence.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gestione Assenze Aziendali
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistema interno per la gestione delle assenze dei dipendenti. 
            Visualizza, aggiungi e gestisci ferie, permessi e malattie in modo semplice ed efficace.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dipendenti Totali</p>
                <p className="text-2xl font-bold text-gray-900">{mockEmployees.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assenze Attive</p>
                <p className="text-2xl font-bold text-gray-900">{absences.length}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Questo Mese</p>
                <p className="text-2xl font-bold text-gray-900">
                  {absences.filter(a => {
                    const absenceDate = new Date(a.startDate);
                    const now = new Date();
                    return absenceDate.getMonth() === now.getMonth() && 
                           absenceDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendario
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tabella Assenze
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Aggiungi Assenza
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <AbsenceCalendar absences={absences} />
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            <AbsenceTable 
              absences={absences} 
              onDeleteAbsence={handleDeleteAbsence} 
            />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <AddAbsenceForm 
              employees={mockEmployees} 
              onAddAbsence={handleAddAbsence} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
