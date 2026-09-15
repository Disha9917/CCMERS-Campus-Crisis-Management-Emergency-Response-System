const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');
const Incident = require('../models/Incident');

dotenv.config({ path: __dirname + '/../../.env' });

const seedDepartments = [
  {
    deptId: 'dept-1',
    name: 'Campus Security',
    head: 'Capt. Officer Carter',
    contact: 'ext. 9110',
    staffCount: 18,
    activeIncidents: 3
  },
  {
    deptId: 'dept-2',
    name: 'Medical Response',
    head: 'Dr. Sarah Jenkins',
    contact: 'ext. 9111',
    staffCount: 12,
    activeIncidents: 1
  },
  {
    deptId: 'dept-3',
    name: 'Facilities & Maintenance',
    head: 'Eng. Elena Rostova',
    contact: 'ext. 9112',
    staffCount: 25,
    activeIncidents: 2
  },
  {
    deptId: 'dept-4',
    name: 'IT Support',
    head: 'Evan Wright',
    contact: 'ext. 9113',
    staffCount: 10,
    activeIncidents: 1
  }
];

const seedUsers = [
  {
    userId: 'STU-2023-4412',
    name: 'Student User',
    email: 'student@campus.edu',
    password: 'password123',
    role: 'student',
    department: 'Computer Science'
  },
  {
    userId: 'RESP-2023-9110',
    name: 'Security Response Officer',
    email: 'response@campus.edu',
    password: 'password123',
    role: 'response',
    department: 'Campus Security'
  },
  {
    userId: 'ADM-2023-0001',
    name: 'Admin User',
    email: 'admin@campus.edu',
    password: 'password123',
    role: 'admin',
    department: 'Emergency Management'
  }
];

const seedIncidents = [
  {
    id: "INC-1001",
    title: "Chemistry Lab Chemical Spill",
    category: "Hazardous / Chemical",
    location: "Science Block - Room 204",
    description: "Small chemical spill (Solvent A) near Fume Hood 3 during morning lab session.",
    severity: "Critical",
    status: "In Progress",
    date: "2026-09-12",
    dateTime: "2026-09-12 09:30 AM",
    assignedDepartment: "Medical Response",
    assignedTo: "Dr. Sarah Jenkins",
    resolutionRemarks: "",
    reportedBy: "STU-2023-4412",
    reporterName: "Student User",
    resolutionTimeHours: 0
  },
  {
    id: "INC-1002",
    title: "Suspicious Unattended Bag Near Cafeteria",
    category: "Security",
    location: "Main Student Center - East Entrance",
    description: "Black backpack left unobserved near table 14 for over 45 minutes.",
    severity: "High",
    status: "Assigned",
    date: "2026-09-12",
    dateTime: "2026-09-12 11:15 AM",
    assignedDepartment: "Campus Security",
    assignedTo: "Capt. Officer Carter",
    resolutionRemarks: "",
    reportedBy: "STU-2023-4412",
    reporterName: "Student User",
    resolutionTimeHours: 0
  },
  {
    id: "INC-1003",
    title: "Main Library Elevator Fault & Entrapment Alert",
    category: "Maintenance",
    location: "Central Library - Elevator B",
    description: "Elevator stuck between 2nd and 3rd floor. Lights functional, emergency bell rang.",
    severity: "Medium",
    status: "Resolved",
    date: "2026-09-11",
    dateTime: "2026-09-11 02:20 PM",
    assignedDepartment: "Facilities & Maintenance",
    assignedTo: "Eng. Elena Rostova",
    resolutionRemarks: "Technician safely dispatched and occupants rescued. Relay switch replaced.",
    reportedBy: "STU-2023-4412",
    reporterName: "Student User",
    resolutionTimeHours: 1.5
  },
  {
    id: "INC-1004",
    title: "Dormitory 4 Water Pipe Leakage",
    category: "Infrastructure",
    location: "Block D Dorms - 1st Floor Hallway",
    description: "Water leaking from ceiling pipe near Room 112 causing wet slippery corridor.",
    severity: "Low",
    status: "Closed",
    date: "2026-09-10",
    dateTime: "2026-09-10 08:45 AM",
    assignedDepartment: "Facilities & Maintenance",
    assignedTo: "Eng. Elena Rostova",
    resolutionRemarks: "Main valve turned off temporarily and pipe patch installed.",
    reportedBy: "STU-2023-5102",
    reporterName: "Jordan Hayes",
    resolutionTimeHours: 2.0
  },
  {
    id: "INC-1005",
    title: "Campus Wi-Fi & Emergency Intercom Network Outage",
    category: "IT / Cyber",
    location: "Tech Park & Admin Building",
    description: "Core switch offline causing emergency panic button relay failure in North Zone.",
    severity: "Critical",
    status: "Reported",
    date: "2026-09-13",
    dateTime: "2026-09-13 01:05 AM",
    assignedDepartment: "IT Support",
    assignedTo: "Evan Wright",
    resolutionRemarks: "",
    reportedBy: "FAC-2022-1088",
    reporterName: "Prof. David Miller",
    resolutionTimeHours: 0
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ccmers';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB');

    await Department.deleteMany();
    await User.deleteMany();
    await Incident.deleteMany();

    await Department.insertMany(seedDepartments);
    console.log('[Seed] Departments inserted');

    for (const u of seedUsers) {
      await User.create(u);
    }
    console.log('[Seed] Users inserted');

    await Incident.insertMany(seedIncidents);
    console.log('[Seed] Incidents inserted');

    console.log('[Seed] Database successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = { seedDepartments, seedUsers, seedIncidents };
