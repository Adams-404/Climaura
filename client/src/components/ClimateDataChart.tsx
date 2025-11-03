import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ClimateData } from "@shared/schema";

interface ClimateDataChartProps {
  data: ClimateData;
}

export function ClimateDataChart({ data }: ClimateDataChartProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-transparent border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              CO₂ Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white/90" data-testid="text-co2-emissions">
              {data.co2Emissions.toFixed(1)} MT
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white/90" data-testid="text-temperature">
              +{data.temperature.toFixed(1)}°C
            </div>
          </CardContent>
        </Card>

        <Card className="bg-transparent border border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Renewable Energy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white/90" data-testid="text-renewable-energy">
              {data.renewableEnergy.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-transparent border border-white/10">
        <CardHeader className="text-white/90">
          <CardTitle>Climate Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="year" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="co2" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                name="CO₂ (MT)"
                dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                name="Temp (°C)"
                dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="renewable" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                name="Renewable (%)"
                dot={{ fill: 'hsl(var(--chart-3))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
