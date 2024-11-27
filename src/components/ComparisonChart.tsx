import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Company, Metric, CompanyData } from '../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ComparisonChartProps {
  companies: Company[];
  metrics: Metric[];
  data: CompanyData[];
}

const COLORS = [
  { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgb(59, 130, 246)' },
  { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgb(239, 68, 68)' },
  { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgb(16, 185, 129)' },
  { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgb(245, 158, 11)' },
  { bg: 'rgba(139, 92, 246, 0.2)', border: 'rgb(139, 92, 246)' },
  { bg: 'rgba(236, 72, 153, 0.2)', border: 'rgb(236, 72, 153)' }
];

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  companies,
  metrics,
  data,
}) => {
  const selectedCompanies = companies.filter(c => c.selected);
  const selectedMetrics = metrics.filter(m => m.selected);

  const chartData = {
    labels: selectedMetrics.map(m => m.name),
    datasets: selectedCompanies.map((company, index) => {
      const companyData = data.find(d => d.Empresa === company.name);
      return {
        label: company.name,
        data: selectedMetrics.map(metric => {
          const value = companyData?.[metric.name];
          return value ? parseFloat(value) : 0;
        }),
        backgroundColor: COLORS[index % COLORS.length].bg,
        borderColor: COLORS[index % COLORS.length].border,
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: COLORS[index % COLORS.length].border,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: COLORS[index % COLORS.length].border,
        pointRadius: 4,
        pointHoverRadius: 6,
      };
    }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          color: '#6B7280',
          font: {
            size: 10
          }
        },
        pointLabels: {
          font: {
            size: 12,
            weight: '500'
          },
          color: '#374151'
        },
        grid: {
          color: '#E5E7EB'
        },
        angleLines: {
          color: '#E5E7EB'
        }
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'center' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg">
      <div className="h-[600px]">
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
};