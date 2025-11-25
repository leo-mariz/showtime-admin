import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PaymentsStatusChartProps {
  overdue: number;
  contested: number;
  pending: number;
  paid: number;
}

export const PaymentsStatusChart = ({
  overdue,
  contested,
  pending,
  paid
}: PaymentsStatusChartProps) => {
  const data = [
    {
      name: "Status",
      "Atrasados": overdue,
      "Contestados": contested,
      "Pendentes": pending,
      "Pagos": paid,
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pagamentos por Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Atrasados" fill="#ef4444" />
            <Bar dataKey="Contestados" fill="#f97316" />
            <Bar dataKey="Pendentes" fill="#3b82f6" />
            <Bar dataKey="Pagos" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

