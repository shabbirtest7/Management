export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  assignedTo: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  activities: Activity[];
}

export interface Activity {
  id: string;
  action: string;
  details: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}