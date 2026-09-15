import React, { useMemo } from 'react';
import { useIncidentContext } from '../../context/IncidentContext';
import Card from '../../components/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const EmptyChartState = () => (
  <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400 rounded-md">
    <p>No data available</p>
  </div>
);

const Analytics = () => {
  const { incidents } = useIncidentContext();

  const data = useMemo(() => {
    // 1. Incidents by Category
    const categoryCount = incidents.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});
    const categoryData = Object.keys(categoryCount).map(key => ({ name: key, value: categoryCount[key] }));

    // 2. Incidents by Severity
    const severityCount = incidents.reduce((acc, curr) => {
      acc[curr.severity] = (acc[curr.severity] || 0) + 1;
      return acc;
    }, {});
    const severityData = Object.keys(severityCount).map(key => ({ name: key, value: severityCount[key] }));

    // 3. Resolved vs Pending
    const resolved = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
    const pending = incidents.length - resolved;
    const statusData = incidents.length > 0 ? [
      { name: 'Resolved', value: resolved },
      { name: 'Pending', value: pending }
    ] : [];

    // 4. Department-wise Incidents
    const deptCount = incidents.reduce((acc, curr) => {
      const dept = curr.assignedDepartment || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
    const deptData = Object.keys(deptCount).map(key => ({ name: key, value: deptCount[key] }));

    // 5. Avg Resolution Time (in Hours) by Department
    const deptResolutionMap = incidents.reduce((acc, curr) => {
      const dept = curr.assignedDepartment || 'General';
      if (!acc[dept]) acc[dept] = { total: 0, count: 0 };
      const hours = curr.resolutionTimeHours || (curr.status === 'Resolved' || curr.status === 'Closed' ? 1.5 : 0);
      if (hours > 0) {
        acc[dept].total += hours;
        acc[dept].count += 1;
      }
      return acc;
    }, {});

    const avgResolutionData = Object.keys(deptResolutionMap).map(key => ({
      name: key,
      hours: deptResolutionMap[key].count > 0 
        ? parseFloat((deptResolutionMap[key].total / deptResolutionMap[key].count).toFixed(1)) 
        : 1.5
    }));

    return { categoryData, severityData, statusData, deptData, avgResolutionData };
  }, [incidents]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
        <p className="text-slate-500 mt-1">Data-driven insights from all reported incidents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Incidents by Category */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Incidents by Category</h2>
          <div className="h-64">
            {data.categoryData.length === 0 ? <EmptyChartState /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Incidents by Severity */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Incidents by Severity</h2>
          <div className="h-64">
            {data.severityData.length === 0 ? <EmptyChartState /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Resolved vs Pending */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Resolved vs Pending</h2>
          <div className="h-64">
            {data.statusData.length === 0 ? <EmptyChartState /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#10b981" /> {/* Resolved - Green */}
                    <Cell fill="#f59e0b" /> {/* Pending - Yellow */}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Department-wise Incidents */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Department-wise Workload</h2>
          <div className="h-64">
            {data.deptData.length === 0 ? <EmptyChartState /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.deptData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                  <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Average Resolution Time (Hours) */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Average Resolution Time (Hours) by Department</h2>
          <div className="h-64">
            {data.avgResolutionData.length === 0 ? <EmptyChartState /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.avgResolutionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} unit=" h" />
                  <RechartsTooltip cursor={{fill: '#f1f5f9'}} formatter={(val) => [`${val} Hours`, 'Avg Resolution Time']} />
                  <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Analytics;

