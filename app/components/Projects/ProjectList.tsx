
'use client'
import { useState } from 'react'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import DeleteConfirmationModal from '@/app/components/Projects/ProjectDetails/DeleteConfirmationModal'

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  createdAt: string
  createdBy: {
    name: string
  }
  assignedTo: {
    name: string
  } | null
}

interface ProjectListProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
  onView: (project: Project) => void
}

const ProjectList = ({ projects, onEdit, onDelete, onView }: ProjectListProps) => {
  const router = useRouter()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleView = (project: Project) => {
    router.push(`/projects/${project.id}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedProject) {
      onDelete(selectedProject.id)
      setDeleteModalOpen(false)
      setSelectedProject(null)
    }
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setSelectedProject(null)
  }

  if (projects?.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects found</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects?.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  <div className="text-sm text-gray-500">Created by {project.createdBy.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.dueDate ? formatDate(new Date(project.dueDate)) : 'No due date'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.assignedTo?.name || 'Unassigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleView(project)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    title="View project details"
                  >
                    <FiEye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEdit(project)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    title="Edit project"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(project)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete project"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {selectedProject && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          projectName={selectedProject.name}
        />
      )}
    </>
  )
}

export default ProjectList