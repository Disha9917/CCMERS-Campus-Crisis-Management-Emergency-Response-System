import React from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useIncidentContext } from '../../context/IncidentContext';
import { User as UserIcon, Mail, Phone, Building2, BadgeCheck } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useIncidentContext();

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setUser({
      name: formData.get('name') || '',
      id: formData.get('id') || '',
      department: formData.get('department') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || ''
    });
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col items-center text-center p-8">
          <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
            {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : <UserIcon size={40} />}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{user.name || 'Your Name'}</h2>
          <div className="flex items-center gap-1 text-slate-500 mt-1">
            <BadgeCheck className="w-4 h-4 text-green-500" />
            <span className="text-sm">Student / Faculty</span>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
            Personal Information
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" name="name" defaultValue={user.name} placeholder="Enter your name" />
              <Input label="University ID" name="id" defaultValue={user.id} placeholder="e.g. STU-1234" />
            </div>
            
            <Input label="Department" name="department" defaultValue={user.department} placeholder="Enter department" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Email Address" name="email" type="email" defaultValue={user.email} placeholder="you@university.edu" />
              <Input label="Phone Number" name="phone" type="tel" defaultValue={user.phone} placeholder="+1 234 567 8900" />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
