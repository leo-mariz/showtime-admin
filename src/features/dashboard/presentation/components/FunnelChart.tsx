
import {
  FunnelChart as RechartsFunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { mockFunnelData } from "@/utils/mockData";

export const FunnelChart = () => {
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="showtime-card !p-2">
          <p className="text-xs text-gray-500">{payload[0].payload.name}</p>
          <p className="text-sm font-medium">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsFunnelChart>
              <Tooltip content={customTooltip} />
              <Funnel
                data={mockFunnelData}
                dataKey="value"
                nameKey="name"
                fill="#FFA500"
                isAnimationActive
              >
                <LabelList
                  position="right"
                  fill="#333"
                  stroke="none"
                  dataKey="name"
                  className="text-xs"
                />
                <LabelList
                  position="left"
                  fill="#333"
                  stroke="none"
                  dataKey="value"
                  className="text-xs font-medium"
                />
              </Funnel>
            </RechartsFunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
