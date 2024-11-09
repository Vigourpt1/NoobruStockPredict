import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ChartData } from '../types';

interface SalesChartProps {
  data: ChartData[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-4 shadow-lg rounded-lg border">
                    <p className="font-semibold">{label}</p>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        Envelopes: {payload[0].value}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        6-Month Boxes: {payload[1].value}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        12-Month Boxes: {payload[2].value}
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="envelopes" name="Envelopes" fill="#60a5fa" />
          <Bar dataKey="sixMonthBoxes" name="6-Month Boxes" fill="#34d399" />
          <Bar dataKey="twelveMonthBoxes" name="12-Month Boxes" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}