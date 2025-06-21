
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Absence } from "@/types/absence";
import { format, isWithinInterval, parseISO } from "date-fns";
import { it } from "date-fns/locale";

interface AbsenceCalendarProps {
  absences: Absence[];
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

export function AbsenceCalendar({ absences }: AbsenceCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getAbsencesForDate = (date: Date) => {
    return absences.filter(absence => {
      const start = parseISO(absence.startDate);
      const end = parseISO(absence.endDate);
      return isWithinInterval(date, { start, end });
    });
  };

  const selectedDateAbsences = getAbsencesForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Calendario Assenze
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={it}
            className="rounded-md border"
            modifiers={{
              hasAbsences: (date) => getAbsencesForDate(date).length > 0
            }}
            modifiersStyles={{
              hasAbsences: {
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: 'bold'
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Assenze del {format(selectedDate, "dd MMMM yyyy", { locale: it })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateAbsences.length === 0 ? (
            <p className="text-gray-500 italic">Nessuna assenza per questa data</p>
          ) : (
            <div className="space-y-3">
              {selectedDateAbsences.map((absence) => (
                <div key={absence.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{absence.employeeName}</p>
                    <p className="text-sm text-gray-600">{absence.reason}</p>
                  </div>
                  <Badge className={`${getAbsenceTypeColor(absence.type)} text-white`}>
                    {absence.type.charAt(0).toUpperCase() + absence.type.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
