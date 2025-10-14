"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"

interface CompletionChartProps {
    data: Array<{ mes: string; conclusoes: number }>
}

const chartConfig = {
    conclusoes: {
        label: "Conclusões",
        color: "hsl(var(--chart-2))",
    },
}

export function CompletionChart({ data }: CompletionChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Conclusões ao Longo do Tempo</CardTitle>
                <CardDescription>Número de cadastros concluídos por mês</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="mes" className="text-xs" tickLine={false} axisLine={false} />
                            <YAxis className="text-xs" tickLine={false} axisLine={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                                type="monotone"
                                fill="var(--primary)"
                                fillOpacity={0.25}
                                dataKey="conclusoes"
                                stroke="var(--primary)"
                                strokeWidth={2}
                                dot={{ fill: "var(--primary)", r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
