import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ClimateData } from "@/types/schema";

interface ChartDataPoint {
  year: number;
  co2: number;
  temperature: number;
  seaLevel: number;
  renewable: number;
}

interface ClimateDataChartProps {
  data: ClimateData;
}

function transformToChartData(climateData: ClimateData): ChartDataPoint[] {
  const years = new Set<number>([
    ...climateData.yearlyData.co2.map(d => d.year),
    ...climateData.yearlyData.temperature.map(d => d.year),
    ...climateData.yearlyData.seaLevel.map(d => d.year)
  ]);

  return Array.from(years).sort().map(year => {
    const co2Data = climateData.yearlyData.co2.find(d => d.year === year);
    const tempData = climateData.yearlyData.temperature.find(d => d.year === year);
    const seaLevelData = climateData.yearlyData.seaLevel.find(d => d.year === year);
    
    return {
      year,
      co2: co2Data?.value ?? 0,
      temperature: tempData?.value ?? 0,
      seaLevel: seaLevelData?.value ?? 0,
      renewable: 0 // Placeholder for renewable data if needed
    };
  });
}

export function ClimateDataChart({ data }: ClimateDataChartProps) {
  const chartData = transformToChartData(data);
  
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
            <LineChart data={chartData}>
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
                formatter={(value: number, name: string) => {
                  const suffix = name === 'temperature' ? '°C' : 
                                name === 'co2' ? ' MT' : 
                                name === 'seaLevel' ? ' mm' : '';
                  return [`${value.toFixed(1)}${suffix}`, name];
                }}
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
                dataKey="temperature" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                name="Temp (°C)"
                dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="seaLevel" 
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
