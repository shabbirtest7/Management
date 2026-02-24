// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import { toast } from 'react-hot-toast';
// import { 
//   FiArrowLeft,
//   FiEdit2,
//   FiTrash2,
//   FiClock,
//   FiCalendar,
//   FiUser,
//   FiMail,
//   FiFlag,
//   FiCheckCircle,
//   FiXCircle,
//   FiAlertCircle,
//   FiActivity,
//   FiFileText,
//   FiUsers,
//   FiTag,
//   FiBell,
//   FiRefreshCw
// } from 'react-icons/fi';
// import { formatDistanceToNow, format } from 'date-fns';
// import Button from '@/app/components/UI/Button';
// import Modal from '@/app/components/UI/Modal';
// import ProjectForm from '@/app/components/Projects/ProjectForm';
// import LayoutWrapper from '@/app/components/Layout/LayoutWrapper';

// interface Project {
//   id: string;
//   name: string;
//   description: string | null;
//   status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
//   priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   dueDate: string | null;
//   createdAt: string;
//   updatedAt: string;
  
//   createdBy: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//   };
//   assignedTo: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//   } | null;
//   activities: Activity[];
// }

// interface Activity {
//   id: string;
//   action: string;
//   details: string;
//   createdAt: string;
//   user: {
//     name: string;
//     email: string;
//   };
// }

// export default function ProjectDetailsPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { user } = useAuth();
  
//   const [project, setProject] = useState<Project | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showAllActivities, setShowAllActivities] = useState(false);

//   // Fetch project details
//   const fetchProject = async () => {
//     try {
//       const res = await fetch(`/api/projects/${id}`, {
//         credentials: 'include'
//       });

//       if (!res.ok) {
//         if (res.status === 404) {
//           toast.error('Project not found');
//           router.push('/projects');
//           return;
//         }
//         if (res.status === 403) {
//           toast.error('You do not have permission to view this project');
//           router.push('/projects');
//           return;
//         }
//         throw new Error('Failed to fetch project');
//       }

//       const data = await res.json();
//       setProject(data.project);
//     } catch (error) {
//       console.error('Error fetching project:', error);
//       toast.error('Failed to load project');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Handle refresh
//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchProject();
//   };

//   // Handle delete
//   const handleDelete = async () => {
//     try {
//       const res = await fetch(`/api/projects/${id}`, {
//         method: 'DELETE',
//         credentials: 'include'
//       });

//       if (res.ok) {
//         toast.success('Project deleted successfully');
//         router.push('/projects');
//       } else {
//         const error = await res.json();
//         toast.error(error.error || 'Failed to delete project');
//       }
//     } catch (error) {
//       console.error('Error deleting project:', error);
//       toast.error('Failed to delete project');
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   // Handle quick status update
//   const handleStatusUpdate = async (newStatus: string) => {
//     try {
//       const res = await fetch(`/api/projects/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: newStatus }),
//         credentials: 'include'
//       });

//       if (res.ok) {
//         toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
//         fetchProject();
//       } else {
//         const error = await res.json();
//         toast.error(error.error || 'Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   // Handle quick assign to self
//   const handleAssignToSelf = async () => {
//     if (!user) return;
    
//     try {
//       const res = await fetch(`/api/projects/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ assignedToId: user.id }),
//         credentials: 'include'
//       });

//       if (res.ok) {
//         toast.success('Project assigned to you');
//         fetchProject();
//       } else {
//         const error = await res.json();
//         toast.error(error.error || 'Failed to assign project');
//       }
//     } catch (error) {
//       console.error('Error assigning project:', error);
//       toast.error('Failed to assign project');
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchProject();
//     }
//   }, [id]);

//   // Helper functions for styling
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
//       case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
//       case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
//       case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getPriorityIcon = (priority: string) => {
//     switch (priority) {
//       case 'CRITICAL': return <FiAlertCircle className="h-4 w-4" />;
//       case 'HIGH': return <FiFlag className="h-4 w-4" />;
//       case 'MEDIUM': return <FiFlag className="h-4 w-4" />;
//       case 'LOW': return <FiFlag className="h-4 w-4" />;
//       default: return <FiTag className="h-4 w-4" />;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'COMPLETED': return <FiCheckCircle className="h-4 w-4" />;
//       case 'IN_PROGRESS': return <FiClock className="h-4 w-4" />;
//       case 'PENDING': return <FiClock className="h-4 w-4" />;
//       case 'CANCELLED': return <FiXCircle className="h-4 w-4" />;
//       default: return <FiActivity className="h-4 w-4" />;
//     }
//   };

//   const getActivityIcon = (action: string) => {
//     switch (action) {
//       case 'CREATE': return <FiCheckCircle className="text-green-600" />;
//       case 'UPDATE': return <FiEdit2 className="text-blue-600" />;
//       case 'COMPLETE': return <FiCheckCircle className="text-green-600" />;
//       case 'DELETE': return <FiTrash2 className="text-red-600" />;
//       default: return <FiActivity className="text-gray-600" />;
//     }
//   };

//   const getActivityBgColor = (action: string) => {
//     switch (action) {
//       case 'CREATE': return 'bg-green-100';
//       case 'UPDATE': return 'bg-blue-100';
//       case 'COMPLETE': return 'bg-green-100';
//       case 'DELETE': return 'bg-red-100';
//       default: return 'bg-gray-100';
//     }
//   };

//   const canEdit = user?.role === 'ADMIN' || user?.id === project?.createdBy?.id;
//   const canDelete = user?.role === 'ADMIN' || user?.id === project?.createdBy?.id;
//   const canAssign = user?.role === 'ADMIN' || !project?.assignedTo || project?.assignedTo.id !== user?.id;

//   if (loading) {
//     return (
//       <LayoutWrapper>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Back button skeleton */}
//           <div className="mb-6">
//             <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
//           </div>
          
//           {/* Header skeleton */}
//           <div className="mb-8">
//             <div className="h-10 w-96 bg-gray-200 rounded animate-pulse mb-4"></div>
//             <div className="flex gap-3">
//               <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
//               <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
//             </div>
//           </div>

//           {/* Content skeleton */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-6">
//               <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
//               <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
//             </div>
//             <div className="space-y-6">
//               <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
//               <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </LayoutWrapper>
//     );
//   }

//   if (!project) {
//     return (
//       <LayoutWrapper>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
//           <FiAlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
//           <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or you don't have access.</p>
//           <Button
//             variant="primary"
//             onClick={() => router.push('/projects')}
//             leftIcon={FiArrowLeft}
//           >
//             Back to Projects
//           </Button>
//         </div>
//       </LayoutWrapper>
//     );
//   }

//   return (
//     <LayoutWrapper>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Navigation Bar */}
//         <div className="mb-6 flex items-center justify-between">
//           <button
//             onClick={() => router.push('/projects')}
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
//           >
//             <div className="p-2 rounded-full group-hover:bg-gray-100">
//               <FiArrowLeft className="h-5 w-5" />
//             </div>
//             <span>Back to Projects</span>
//           </button>
          
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleRefresh}
//               leftIcon={FiRefreshCw}
//               isLoading={refreshing}
//             >
//               Refresh
//             </Button>
//             {canEdit && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 leftIcon={FiEdit2}
//                 onClick={() => setShowEditModal(true)}
//               >
//                 Edit
//               </Button>
//             )}
//             {canDelete && (
//               <Button
//                 variant="danger"
//                 size="sm"
//                 leftIcon={FiTrash2}
//                 onClick={() => setShowDeleteModal(true)}
//               >
//                 Delete
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Project Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{project.name}</h1>
//           <div className="flex flex-wrap gap-3">
//             <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
//               {getStatusIcon(project.status)}
//               {project.status.replace('_', ' ')}
//             </span>
//             <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${getPriorityColor(project.priority)}`}>
//               {getPriorityIcon(project.priority)}
//               {project.priority}
//             </span>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Description Card */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <FiFileText className="h-5 w-5 text-gray-500" />
//                   Description
//                 </h2>
//               </div>
//               <div className="p-6">
//                 <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
//                   {project.description || (
//                     <span className="text-gray-400 italic">No description provided.</span>
//                   )}
//                 </p>
//               </div>
//             </div>

//             {/* Activity Feed Card */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <FiActivity className="h-5 w-5 text-gray-500" />
//                   Activity Timeline
//                 </h2>
//                 <button
//                   onClick={() => setShowAllActivities(true)}
//                   className="text-sm text-primary-600 hover:text-primary-700 font-medium"
//                 >
//                   View All
//                 </button>
//               </div>
//               <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
//                 {project.activities && project.activities.length > 0 ? (
//                   project.activities.slice(0, 5).map((activity: Activity) => (
//                     <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
//                       <div className="flex items-start gap-4">
//                         <div className={`p-2 rounded-full ${getActivityBgColor(activity.action)} flex-shrink-0`}>
//                           {getActivityIcon(activity.action)}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm text-gray-900 mb-1">{activity.details}</p>
//                           <div className="flex items-center gap-3 text-xs text-gray-500">
//                             <span className="flex items-center gap-1">
//                               <FiUser className="h-3 w-3" />
//                               {activity.user.name}
//                             </span>
//                             <span>•</span>
//                             <span className="flex items-center gap-1">
//                               <FiClock className="h-3 w-3" />
//                               {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="px-6 py-12 text-center text-gray-500">
//                     <FiActivity className="h-8 w-8 mx-auto mb-3 text-gray-400" />
//                     <p>No activity recorded yet</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Sidebar */}
//           <div className="space-y-6">
//             {/* Project Info Card */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <FiFileText className="h-5 w-5 text-gray-500" />
//                   Project Details
//                 </h2>
//               </div>
//               <div className="p-6 space-y-5">
//                 {/* Created By */}
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
//                     <FiUser className="h-3 w-3" />
//                     Created By
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <span className="text-white font-medium text-lg">
//                         {project.createdBy.name.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <p className="text-sm font-medium text-gray-900 truncate">{project.createdBy.name}</p>
//                       <p className="text-xs text-gray-500 truncate">{project.createdBy.email}</p>
//                       <p className="text-xs text-gray-400 mt-1">Role: {project.createdBy.role}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Assigned To */}
//                 {project.assignedTo ? (
//                   <div>
//                     <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
//                       <FiUsers className="h-3 w-3" />
//                       Assigned To
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//                         <span className="text-white font-medium text-lg">
//                           {project.assignedTo.name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <p className="text-sm font-medium text-gray-900 truncate">{project.assignedTo.name}</p>
//                         <p className="text-xs text-gray-500 truncate">{project.assignedTo.email}</p>
//                         <p className="text-xs text-gray-400 mt-1">Role: {project.assignedTo.role}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div>
//                     <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
//                       <FiUsers className="h-3 w-3" />
//                       Assigned To
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <p className="text-sm text-gray-400 italic">Unassigned</p>
//                       {canAssign && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={handleAssignToSelf}
//                         >
//                           Assign to me
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Due Date */}
//                 {project.dueDate && (
//                   <div>
//                     <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
//                       <FiCalendar className="h-3 w-3" />
//                       Due Date
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className={`text-sm font-medium ${
//                         new Date(project.dueDate) < new Date() && project.status !== 'COMPLETED'
//                           ? 'text-red-600'
//                           : 'text-gray-900'
//                       }`}>
//                         {format(new Date(project.dueDate), 'MMMM d, yyyy')}
//                       </span>
//                       {new Date(project.dueDate) < new Date() && project.status !== 'COMPLETED' && (
//                         <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
//                           Overdue
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Created At */}
//                 <div>
//                   <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
//                     <FiCalendar className="h-3 w-3" />
//                     Created
//                   </div>
//                   <p className="text-sm text-gray-900">
//                     {format(new Date(project.createdAt), 'MMMM d, yyyy')}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
//                   </p>
//                 </div>

//                 {/* Last Updated */}
//                 {project.updatedAt && project.updatedAt !== project.createdAt && (
//                   <div>
//                     <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
//                       <FiClock className="h-3 w-3" />
//                       Last Updated
//                     </div>
//                     <p className="text-sm text-gray-900">
//                       {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Quick Actions Card */}
//             <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-sm border border-primary-200 overflow-hidden">
//               <div className="px-6 py-4 border-b border-primary-200">
//                 <h2 className="text-lg font-semibold text-primary-800 flex items-center gap-2">
//                   <FiBell className="h-5 w-5" />
//                   Quick Actions
//                 </h2>
//               </div>
//               <div className="p-6 space-y-3">
//                 {canEdit && (
//                   <>
//                     <button
//                       onClick={() => {
//                         const nextStatus = 
//                           project.status === 'PENDING' ? 'IN_PROGRESS' :
//                           project.status === 'IN_PROGRESS' ? 'COMPLETED' :
//                           project.status === 'COMPLETED' ? 'PENDING' : 'PENDING';
//                         handleStatusUpdate(nextStatus);
//                       }}
//                       className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors border border-gray-200 shadow-sm"
//                     >
//                       <div className="font-medium">Mark as</div>
//                       <div className="text-xs text-gray-500 mt-1">
//                         {project.status === 'PENDING' ? 'In Progress' : 
//                          project.status === 'IN_PROGRESS' ? 'Completed' : 
//                          project.status === 'COMPLETED' ? 'Pending' : 'In Progress'}
//                       </div>
//                     </button>
                    
//                     {!project.assignedTo && (
//                       <button
//                         onClick={handleAssignToSelf}
//                         className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors border border-gray-200 shadow-sm"
//                       >
//                         <div className="font-medium">Assign to Me</div>
//                         <div className="text-xs text-gray-500 mt-1">Take ownership of this project</div>
//                       </button>
//                     )}
//                   </>
//                 )}
                
//                 <button
//                   onClick={() => setShowAllActivities(true)}
//                   className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors border border-gray-200 shadow-sm"
//                 >
//                   <div className="font-medium">View All Activities</div>
//                   <div className="text-xs text-gray-500 mt-1">See complete project history</div>
//                 </button>
                
//                 <button
//                   onClick={() => router.push('/projects')}
//                   className="w-full text-left px-4 py-3 bg-white rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors border border-gray-200 shadow-sm"
//                 >
//                   <div className="font-medium">Back to Projects</div>
//                   <div className="text-xs text-gray-500 mt-1">Return to projects list</div>
//                 </button>
//               </div>
//             </div>

//             {/* Project Stats Card */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <FiActivity className="h-5 w-5 text-gray-500" />
//                   Statistics
//                 </h2>
//               </div>
//               <div className="p-6 grid grid-cols-2 gap-4">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-primary-600">
//                     {project.activities?.length || 0}
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">Total Activities</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-600">
//                     {Math.ceil((new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 3600 * 24))}
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">Days Active</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-green-600">
//                     {project.assignedTo ? '1' : '0'}
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">Team Members</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-purple-600">
//                     {project.status === 'COMPLETED' ? '100' :
//                      project.status === 'IN_PROGRESS' ? '50' : '0'}%
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">Progress</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       <Modal
//         isOpen={showEditModal}
//         onClose={() => setShowEditModal(false)}
//         title="Edit Project"
//       >
//         <ProjectForm
//           project={project}
//           onClose={() => setShowEditModal(false)}
//           onSuccess={() => {
//             fetchProject();
//             setShowEditModal(false);
//           }}
//         />
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         title="Delete Project"
//       >
//         <div className="space-y-4">
//           <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
//             <FiAlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
//             <p className="text-sm text-red-700">
//               This action cannot be undone. This will permanently delete the project and all associated activities.
//             </p>
//           </div>
//           <p className="text-gray-700">
//             Are you sure you want to delete <span className="font-semibold">{project.name}</span>?
//           </p>
//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               variant="outline"
//               onClick={() => setShowDeleteModal(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="danger"
//               onClick={handleDelete}
//             >
//               Delete Project
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {/* All Activities Modal */}
//       <Modal
//         isOpen={showAllActivities}
//         onClose={() => setShowAllActivities(false)}
//         title="All Activities"
//         size="lg"
//       >
//         <div className="space-y-4 max-h-96 overflow-y-auto">
//           {project.activities && project.activities.length > 0 ? (
//             project.activities.map((activity: Activity) => (
//               <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
//                 <div className={`p-2 rounded-full ${getActivityBgColor(activity.action)} flex-shrink-0`}>
//                   {getActivityIcon(activity.action)}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm text-gray-900 mb-1">{activity.details}</p>
//                   <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
//                     <span className="flex items-center gap-1">
//                       <FiUser className="h-3 w-3" />
//                       {activity.user.name}
//                     </span>
//                     <span>•</span>
//                     <span className="flex items-center gap-1">
//                       <FiMail className="h-3 w-3" />
//                       {activity.user.email}
//                     </span>
//                     <span>•</span>
//                     <span className="flex items-center gap-1">
//                       <FiClock className="h-3 w-3" />
//                       {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-12 text-gray-500">
//               <FiActivity className="h-12 w-12 mx-auto mb-3 text-gray-400" />
//               <p>No activities recorded</p>
//             </div>
//           )}
//         </div>
//       </Modal>
//     </LayoutWrapper>
//   );
// }










'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import Button from '@/app/components/UI/Button';
import Modal from '@/app/components/UI/Modal';
import ProjectForm from '@/app/components/Projects/ProjectForm';
import LayoutWrapper from '@/app/components/Layout/LayoutWrapper';
import ProjectHeader from '@/app/components/Projects/ProjectDetails/ProjectHeader';
import ActivityFeed from '@/app/components/Projects/ProjectDetails/ActivityFeed';
import ProjectInfoSidebar from '@/app/components/Projects/ProjectDetails/ProjectInfoSidebar';
import QuickActions from '@/app/components/Projects/ProjectDetails/QuickActions';
import ProjectStats from '@/app/components/Projects/ProjectDetails/ProjectStats';
import DeleteConfirmationModal from '@/app/components/Projects/ProjectDetails/DeleteConfirmationModal';
import { Project } from '@/app/types/project';
import AllActivitiesModal from '@/app/components/Projects/ProjectDetails/Modals/AllActivitiesModal';
import ProjectDetailsSkeleton from '@/app/components/Projects/ProjectDetails/Skeletons/ProjectDetailsSkeleton';
import ProjectDescription from '@/app/components/Projects/ProjectDetails/ProjectDescription';



export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fetchProject = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/projects/${id}`, {
        credentials: 'include'
      });

      if (!res.ok) {
        if (res.status === 404) {
          toast.error('Project not found');
          router.push('/projects');
          return;
        }
        if (res.status === 403) {
          toast.error('You do not have permission to view this project');
          router.push('/projects');
          return;
        }
        throw new Error('Failed to fetch project');
      }
      const data = await res.json();
      setProject(data.project);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProject();
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        toast.success('Project deleted successfully');
        router.push('/projects');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (res.ok) {
        toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
        fetchProject();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAssignToSelf = async () => {
    if (!user) return;
    
    try {
      const res = await fetch(`${baseUrl}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToId: user.id }),
        credentials: 'include'
      });

      if (res.ok) {
        toast.success('Project assigned to you');
        fetchProject();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to assign project');
      }
    } catch (error) {
      console.error('Error assigning project:', error);
      toast.error('Failed to assign project');
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const canEdit = user?.role === 'ADMIN' || user?.id === project?.createdBy?.id;
  const canDelete = user?.role === 'ADMIN' || user?.id === project?.createdBy?.id;
  const canAssign = user?.role === 'ADMIN' || !project?.assignedTo || project?.assignedTo.id !== user?.id;

  if (loading) {
    return (
      <LayoutWrapper>
        <ProjectDetailsSkeleton />
      </LayoutWrapper>
    );
  }

  if (!project) {
    return (
      <LayoutWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <FiAlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or you don't have access.</p>
          <Button
            variant="primary"
            onClick={() => router.push('/projects')}
            leftIcon={FiArrowLeft}
          >
            Back to Projects
          </Button>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectHeader
          onBack={() => router.push('/projects')}
          onRefresh={handleRefresh}
          onEdit={() => setShowEditModal(true)}
          onDelete={() => setShowDeleteModal(true)}
          canEdit={canEdit}
          canDelete={canDelete}
          isRefreshing={refreshing}
        />

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{project.name}</h1>
          <ProjectHeader.StatusBadges status={project.status} priority={project.priority} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProjectDescription description={project.description} />
            <ActivityFeed 
              activities={project.activities} 
              onViewAll={() => setShowAllActivities(true)}
            />
          </div>

          <div className="space-y-6">
            <ProjectInfoSidebar
              createdBy={project.createdBy}
              assignedTo={project.assignedTo}
              dueDate={project.dueDate}
              createdAt={project.createdAt}
              updatedAt={project.updatedAt}
              canAssign={canAssign}
              onAssignToSelf={handleAssignToSelf}
            />
            
            <QuickActions
              currentStatus={project.status}
              hasAssignee={!!project.assignedTo}
              canEdit={canEdit}
              onStatusUpdate={handleStatusUpdate}
              onAssignToSelf={handleAssignToSelf}
              onViewAllActivities={() => setShowAllActivities(true)}
              onBackToProjects={() => router.push('/projects')}
            />
            
            <ProjectStats
              activitiesCount={project.activities?.length || 0}
              createdAt={project.createdAt}
              hasAssignee={!!project.assignedTo}
              status={project.status}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
      >
        <ProjectForm
          project={project}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            fetchProject();
            setShowEditModal(false);
          }}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        projectName={project.name}
      />

      <AllActivitiesModal
        isOpen={showAllActivities}
        onClose={() => setShowAllActivities(false)}
        activities={project.activities}
      />
    </LayoutWrapper>
  );
}