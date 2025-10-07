"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"

// Dados mockados: conclusões ao longo do tempo
const data = [
    { mes: "Jan", conclusoes: 2 },
    { mes: "Fev", conclusoes: 3 },
    { mes: "Mar", conclusoes: 5 },
    { mes: "Abr", conclusoes: 4 },
    { mes: "Mai", conclusoes: 6 },
    { mes: "Jun", conclusoes: 8 },
    { mes: "Jul", conclusoes: 7 },
    { mes: "Ago", conclusoes: 3 },
    { mes: "Set", conclusoes: 5 },
    { mes: "Out", conclusoes: 2 },
]

const chartConfig = {
    conclusoes: {
        label: "Conclusões",
        color: "hsl(var(--chart-2))",
    },
}

export function CompletionChart() {
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
                                fill="var(--success)"
                                fillOpacity={0.25}
                                dataKey="conclusoes"
                                stroke="var(--success)"
                                strokeWidth={2}
                                dot={{ fill: "var(--success)", r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
