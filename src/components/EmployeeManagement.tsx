
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Employee } from "@/types/absence";
import { Trash2, Edit, Plus, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface EmployeeManagementProps {
  employees: Employee[];
  onEmployeesChange: () => void;
}

export const EmployeeManagement = ({ employees, onEmployeesChange }: EmployeeManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: ""
  });

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.department) {
      toast({
        title: "Errore",
        description: "Tutti i campi sono obbligatori",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .insert({
          name: formData.name,
          email: formData.email,
          department: formData.department
        });

      if (error) throw error;

      toast({
        title: "Dipendente aggiunto",
        description: "Il dipendente è stato aggiunto con successo"
      });

      setFormData({ name: "", email: "", department: "" });
      setIsAddDialogOpen(false);
      onEmployeesChange();

    } catch (error) {
      console.error('Error adding employee:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiungere il dipendente",
        variant: "destructive"
      });
    }
  };

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEmployee || !formData.name || !formData.email || !formData.department) {
      return;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .update({
          name: formData.name,
          email: formData.email,
          department: formData.department
        })
        .eq('id', editingEmployee.id);

      if (error) throw error;

      toast({
        title: "Dipendente modificato",
        description: "I dati del dipendente sono stati aggiornati"
      });

      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      setFormData({ name: "", email: "", department: "" });
      onEmployeesChange();

    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: "Errore",
        description: "Impossibile modificare il dipendente",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo dipendente? Verranno eliminate anche tutte le sue assenze.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Dipendente eliminato",
        description: "Il dipendente è stato rimosso dal sistema"
      });

      onEmployeesChange();

    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il dipendente",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header con pulsante aggiungi */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Gestione Dipendenti</h2>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Dipendente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aggiungi Nuovo Dipendente</DialogTitle>
              <DialogDescription>
                Inserisci i dati del nuovo dipendente
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Mario Rossi"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="mario.rossi@azienda.it"
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Dipartimento</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="IT, HR, Vendite, Marketing..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit">Aggiungi</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabella dipendenti */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Dipendenti ({employees.length})</CardTitle>
          <CardDescription>
            Gestisci i dipendenti dell'azienda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dipartimento</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(employee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Nessun dipendente presente. Aggiungi il primo dipendente per iniziare.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog per modificare dipendente */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Dipendente</DialogTitle>
            <DialogDescription>
              Modifica i dati del dipendente
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditEmployee} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-department">Dipartimento</Label>
              <Input
                id="edit-department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annulla
              </Button>
              <Button type="submit">Salva Modifiche</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
