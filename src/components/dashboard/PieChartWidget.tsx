import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import '../../styles/dashboard/pieChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryData {
  name: string;
  value: number;
  color: string;
  priority?: number;
}

interface PieChartWidgetProps {
  data: CategoryData[];
  loading?: boolean;
}

const PieChartWidget: React.FC<PieChartWidgetProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="chart-loading">
        <div className="spinner"></div>
        Loading chart...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-loading">No data available</div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        hoverBackgroundColor: data.map(d => d.color + 'CC'),
        borderColor: 'rgba(255,255,255,0.15)',
        borderWidth: 2,
        hoverOffset: 20,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#c0c0d0',
          padding: 16,
          font: { size: 12, weight: '600' },
          boxWidth: 14,
          boxHeight: 14,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 35, 0.95)',
        borderColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        titleColor: '#e0e0f0',
        bodyColor: '#00d4ff',
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `  ${value} complaints  (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '420px' }}>
      {/* 3D shadow effect underneath */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        height: '30px',
        background: 'radial-gradient(ellipse, rgba(0,212,255,0.18) 0%, transparent 70%)',
        filter: 'blur(8px)',
        borderRadius: '50%',
        zIndex: 0,
      }} />
      <div style={{ position: 'relative', width: '100%', height: '380px', zIndex: 1 }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChartWidget;