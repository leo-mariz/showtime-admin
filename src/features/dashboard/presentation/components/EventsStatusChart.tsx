import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface EventsStatusChartProps {
  eventsByStatus: {
    pending: number;
    accepted: number;
    confirmed: number;
    finished: number;
    cancelled: number;
  };
}

const COLORS = {
  pending: "#eab308", // yellow
  accepted: "#3b82f6", // blue
  confirmed: "#a855f7", // purple
  finished: "#6b7280", // gray
  cancelled: "#ef4444", // red
};

export const EventsStatusChart = ({ eventsByStatus }: EventsStatusChartProps) => {
  const data = [
    { name: "Pendente", value: eventsByStatus.pending, color: COLORS.pending },
    { name: "Aceito", value: eventsByStatus.accepted, color: COLORS.accepted },
    { name: "Confirmado", value: eventsByStatus.confirmed, color: COLORS.confirmed },
    { name: "Finalizado", value: eventsByStatus.finished, color: COLORS.finished },
    { name: "Cancelado", value: eventsByStatus.cancelled, color: COLORS.cancelled },
  ].filter(item => item.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status dos Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                `${value} eventos (${((value / total) * 100).toFixed(1)}%)`,
                "Quantidade"
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

