
import { useState, useEffect } from "react";
import { AbsenceCalendar } from "@/components/AbsenceCalendar";
import { AbsenceTable } from "@/components/AbsenceTable";
import { AddAbsenceForm } from "@/components/AddAbsenceForm";
import { EmployeeManagement } from "@/components/EmployeeManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Absence, Employee } from "@/types/absence";
import { CalendarDays, Users, Plus, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Carica dipendenti dal database
  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dipendenti",
        variant: "destructive"
      });
    }
  };

  // Carica assenze dal database
  const fetchAbsences = async () => {
    try {
      const { data, error } = await supabase
        .from('absences')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      
      // Converti il formato del database al formato dell'interfaccia
      const formattedAbsences: Absence[] = (data || []).map(absence => ({
        id: absence.id,
        employeeId: absence.employee_id,
        employeeName: absence.employee_name,
        startDate: absence.start_date,
        endDate: absence.end_date,
        type: absence.type as 'ferie' | 'permesso' | 'malattia',
        reason: absence.reason,
        createdAt: absence.created_at
      }));
      
      setAbsences(formattedAbsences);
    } catch (error) {
      console.error('Error fetching absences:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le assenze",
        variant: "destructive"
      });
    }
  };

  // Carica dati all'avvio
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmployees(), fetchAbsences()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const handleAddAbsence = async (newAbsence: Omit<Absence, "id" | "createdAt">) => {
    try {
      const { data, error } = await supabase
        .from('absences')
        .insert({
          employee_id: newAbsence.employeeId,
          employee_name: newAbsence.employeeName,
          start_date: newAbsence.startDate,
          end_date: newAbsence.endDate,
          type: newAbsence.type,
          reason: newAbsence.reason
        })
        .select()
        .single();

      if (error) throw error;

      // Aggiungi la nuova assenza alla lista
      const formattedAbsence: Absence = {
        id: data.id,
        employeeId: data.employee_id,
        employeeName: data.employee_name,
        startDate: data.start_date,
        endDate: data.end_date,
        type: data.type,
        reason: data.reason,
        createdAt: data.created_at
      };

      setAbsences(prev => [formattedAbsence, ...prev]);
      
      toast({
        title: "Assenza aggiunta",
        description: "L'assenza è stata registrata con successo"
      });

    } catch (error) {
      console.error('Error adding absence:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiungere l'assenza",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAbsence = async (id: string) => {
    try {
      const { error } = await supabase
        .from('absences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAbsences(prev => prev.filter(absence => absence.id !== id));
      
      toast({
        title: "Assenza cancellata",
        description: "L'assenza è stata rimossa con successo"
      });

    } catch (error) {
      console.error('Error deleting absence:', error);
      toast({
        title: "Errore",
        description: "Impossibile cancellare l'assenza",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento dati...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
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
          <TabsList className="grid w-full grid-cols-4 bg-white">
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
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Gestione Dipendenti
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
              employees={employees} 
              onAddAbsence={handleAddAbsence} 
            />
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <EmployeeManagement 
              employees={employees} 
              onEmployeesChange={fetchEmployees}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
