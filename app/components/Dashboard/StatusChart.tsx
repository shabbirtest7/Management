'use client'

import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface StatusChartProps {
  data: {
    pending: number
    inProgress: number
    completed: number
    cancelled: number
  }
}

const StatusChart = ({ data }: StatusChartProps) => {
  const chartData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [data.pending, data.inProgress, data.completed, data.cancelled],
        backgroundColor: [
          '#FCD34D',
          '#60A5FA',
          '#34D399',
          '#F87171',
        ],
        borderColor: [
          '#F59E0B',
          '#3B82F6',
          '#10B981',
          '#EF4444',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Project Status Distribution</h3>
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  )
}

export default StatusChart