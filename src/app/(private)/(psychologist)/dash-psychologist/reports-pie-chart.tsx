"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from "recharts"

interface ReportData {
    tipo: string
    quantidade: number
    fill: string
}

interface ReportsPieChartProps {
    data: ReportData[]
}

export function ReportsPieChart({ data }: ReportsPieChartProps) {
    const chartConfig = {
        quantidade: {
            label: "Quantidade",
        },
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribuição de Relatórios por Tipo</CardTitle>
                <CardDescription>Análise dos 9 tipos de estados emocionais</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Pie
                                data={data}
                                dataKey="quantidade"
                                nameKey="tipo"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                label={({ tipo, quantidade }) => `${tipo}: ${quantidade}`}
                                labelLine={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value, entry: any) => `${value} (${entry.payload.quantidade})`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
