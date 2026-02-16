"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AdminMRRChartProps {
    data: {
        month: string
        mrr: number
    }[]
}

export function AdminMRRChart({ data }: AdminMRRChartProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00FF94" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00FF94" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#00FF94' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="mrr"
                        stroke="#00FF94"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorMrr)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
