'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import { FiFile, FiCheckCircle, FiTrash2, FiEdit } from 'react-icons/fi'

interface Activity {
  id: string
  action: string
  details: string
  createdAt: string
  user: {
    name: string
  }
  project?: {
    name: string
  }
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities?limit=10')
      const data = await res.json()
      setActivities(data.activities)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <FiFile className="text-green-500" />
      case 'UPDATE':
        return <FiEdit className="text-blue-500" />
      case 'DELETE':
        return <FiTrash2 className="text-red-500" />
      case 'COMPLETE':
        return <FiCheckCircle className="text-green-500" />
      default:
        return <FiFile className="text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities?.map((activity, idx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {idx !== activities?.length - 1 && (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getIcon(activity.action)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {activity.user.name}
                        </span>
                        <span className="text-gray-500"> {activity.details}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatDate(new Date(activity.createdAt))}
                      </p>
                    </div>
                    {activity.project && (
                      <div className="mt-1 text-sm text-gray-700">
                        Project: {activity.project.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RecentActivity