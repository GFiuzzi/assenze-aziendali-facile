
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Absence } from "@/types/absence";
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AbsenceTableProps {
  absences: Absence[];
  onDeleteAbsence: (id: string) => void;
}

const getAbsenceTypeColor = (type: string) => {
  switch (type) {
    case 'ferie':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'permesso':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'malattia':
      return 'bg-red-500 hover:bg-red-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};

export function AbsenceTable({ absences, onDeleteAbsence }: AbsenceTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    onDeleteAbsence(id);
    setDeletingId(null);
    toast({
      title: "Assenza cancellata",
      description: "L'assenza è stata rimossa con successo e verrà inviata una notifica email.",
    });
  };

  const sortedAbsences = [...absences].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Tutte le Assenze
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dipendente</TableHead>
                <TableHead>Data Inizio</TableHead>
                <TableHead>Data Fine</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAbsences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 italic py-8">
                    Nessuna assenza registrata
                  </TableCell>
                </TableRow>
              ) : (
                sortedAbsences.map((absence) => (
                  <TableRow key={absence.id}>
                    <TableCell className="font-medium">{absence.employeeName}</TableCell>
                    <TableCell>
                      {format(parseISO(absence.startDate), "dd/MM/yyyy", { locale: it })}
                    </TableCell>
                    <TableCell>
                      {format(parseISO(absence.endDate), "dd/MM/yyyy", { locale: it })}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getAbsenceTypeColor(absence.type)} text-white`}>
                        {absence.type.charAt(0).toUpperCase() + absence.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{absence.reason}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Conferma cancellazione</AlertDialogTitle>
                            <AlertDialogDescription>
                              Sei sicuro di voler cancellare l'assenza di {absence.employeeName} 
                              dal {format(parseISO(absence.startDate), "dd/MM/yyyy", { locale: it })} 
                              al {format(parseISO(absence.endDate), "dd/MM/yyyy", { locale: it })}?
                              Questa azione non può essere annullata.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(absence.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Cancella
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
