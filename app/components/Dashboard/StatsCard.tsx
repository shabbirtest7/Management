import { IconType } from 'react-icons'

interface StatsCardProps {
  title: string
  value: number | string
  icon: IconType
  color: string
  change?: string
}

const StatsCard = ({ title, value, icon: Icon, color, change }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className="text-xs text-green-600 mt-1">{change}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default StatsCard