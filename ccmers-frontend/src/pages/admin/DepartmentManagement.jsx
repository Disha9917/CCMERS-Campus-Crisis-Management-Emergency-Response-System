import React, { useState } from 'react';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const DepartmentManagement = () => {
  const { departments, setDepartments, incidents } = useIncidentContext();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newStaffCount, setNewStaffCount] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newDeptName) return;
    
    const newDept = {
      id: Date.now().toString(),
      name: newDeptName,
      staffCount: parseInt(newStaffCount) || 0
    };
    
    setDepartments([...departments, newDept]);
    setNewDeptName('');
    setNewStaffCount('');
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  const getActiveIncidentsCount = (deptName) => {
    return incidents.filter(i => i.assignedDepartment === deptName && i.status !== 'Resolved' && i.status !== 'Closed').length;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Department Management</h1>
          <p className="text-slate-500 mt-1">Manage response teams and their workloads.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-2" /> Add Department
        </Button>
      </div>

      {isAdding && (
        <Card className="p-4 bg-slate-50 border-dashed border-2">
          <form onSubmit={handleAdd} className="flex gap-4 items-end">
            <div className="flex-1">
              <Input 
                label="Department Name" 
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="e.g. IT Support"
                required
              />
            </div>
            <div className="w-32">
              <Input 
                label="Staff Count" 
                type="number"
                value={newStaffCount}
                onChange={(e) => setNewStaffCount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        {departments.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <div className="text-4xl mb-4">🏢</div>
            <p className="text-lg">No departments added yet</p>
            <p className="text-sm mt-1">Click the button above to add one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Department Name</th>
                  <th className="px-6 py-4">Staff Count</th>
                  <th className="px-6 py-4">Active Incidents</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{dept.name}</td>
                    <td className="px-6 py-4">{dept.staffCount}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 py-1 px-2.5 rounded-full text-xs font-medium">
                        {getActiveIncidentsCount(dept.name)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        onClick={() => handleDelete(dept.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DepartmentManagement;
