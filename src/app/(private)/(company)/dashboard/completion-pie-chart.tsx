"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"

interface CompletionPieChartProps {
    concluidos: number
    pendentes: number
}

const chartConfig = {
    concluidos: {
        label: "Concluídos",
        color: "var(--success)",
    },
    pendentes: {
        label: "Pendentes",
        color: "color-mix(in oklch, var(--muted-foreground), transparent 50%)",
    },
}

export function CompletionPieChart({ concluidos, pendentes }: CompletionPieChartProps) {
    const data = [
        { name: "Concluídos", value: concluidos, color: chartConfig.concluidos.color },
        { name: "Pendentes", value: pendentes, color: chartConfig.pendentes.color },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Status dos Colaboradores</CardTitle>
                <CardDescription>Distribuição entre cadastros concluídos e pendentes</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="hsl(var(--chart-2))"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
