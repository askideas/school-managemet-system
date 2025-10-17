import { 
    LayoutDashboard,
    Users,
    Clock, 
    Calendar, 
    BookOpen,
    GraduationCap,
    School,
    DollarSign,
    ClipboardList,
    Settings,
    Bell,
    IndianRupee,
    PencilRuler,
    Briefcase
} from "lucide-react";

export const schoolMenuItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard size={18} />,
        link: '/',
        hasSubmenu: false
    },
    {
        id: 'teachers',
        label: 'Teachers',
        icon: <Users size={18} />,
        link: false,
        hasSubmenu: true,
        subItems: [
            {
                id: 'all-teachers',
                label: 'Teachers',
                link: '/teachers'
            },
            {
                id: 'add-teacher',
                label: 'Add Teacher',
                link: '/addteacher'
            },
        ]
    },
    {
        id: 'staff',
        label: 'Staff',
        icon: <Briefcase size={18} />,
        link: false,
        hasSubmenu: true,
        subItems: [
            {
                id: 'all-staff',
                label: 'All Staff',
                link: '/staff'
            },
            {
                id: 'add-staff',
                label: 'Add Staff',
                link: '/addstaff'
            },
        ]
    },
    {
        id: 'students',
        label: 'Students',
        icon: <GraduationCap size={18} />,
        link: false,
        hasSubmenu: true,
        subItems: [
            {
                id: 'all-students',
                label: 'All Students',
                link: '/students'
            },
            {
                id: 'add-student',
                label: 'Add Student',
                link: '/addstudent'
            }
        ]
    },
    {
        id: 'academic',
        label: 'Academic',
        icon: <School size={18} />,
        link: false,
        hasSubmenu: true,
        subItems: [
            {
                id: 'classes',
                label: 'Classes',
                link: '/classes'
            },
            {
                id: 'sections',
                label: 'Sections',
                link: '/sections'
            },
            {
                id: 'subjects',
                label: 'Subjects',
                link: '/subjects'
            },
        ]
    },
    {
        id: 'finance',
        label: 'Finance',
        icon: <IndianRupee size={18} />,
        link: false,
        hasSubmenu: true,
        subItems: [
            {
                id: 'studentfee',
                label: 'Student Fee',
                link: '/studentfee'
            },
            {
                id: 'expenses',
                label: 'Expenses',
                link: '/expenses'
            },
            {
                id: 'payroll',
                label: 'Payroll',
                link: '/payroll'
            },
            {
                id: 'financereport',
                label: 'Finance Reports',
                link: '/financereport'
            }
        ]
    },
    {
        id: 'exams',
        label: 'Exams',
        icon: <ClipboardList size={18} />,
        link: false,
        hasSubmenu: true,
        subItems: [
            {
                id: 'exams',
                label: 'Exams',
                link: '/exams'
            },
            {
                id: 'examresults',
                label: 'Exam Results',
                link: '/examresults'
            }
        ]
    },
    {
        id: 'timetablessection',
        label: 'Time Tables',
        icon: <PencilRuler size={18} />,
        link: false,
        hasSubmenu: true,
        subItems: [
            {
                id: 'slots',
                label: 'Slots',
                link: '/slots'
            },
            {
                id: 'timetables',
                label: 'Time Tables',
                link: '/timetables'
            }
        ]
    },
    {
        id: 'attendance',
        label: 'Attendance',
        icon: <Calendar size={18} />,
        link: '/attendance',
        hasSubmenu: true,
        subItems: [
            {
                id: 'studentsattendance',
                label: 'Students Attendance',
                link: '/studentsattendance'
            },
            {
                id: 'teachersAttendance',
                label: 'Teachers Attendance',
                link: '/teachersattendance'
            },
            {
                id: 'staffattendance',
                label: 'Staff Attendance',
                link: '/staffattendance'
            }
        ]
    },
    {
        id: 'library',
        label: 'Library',
        icon: <BookOpen size={18} />,
        link: '/library',
        hasSubmenu: false
    },
    {
        id: 'noticeboard',
        label: 'Notice Board',
        icon: <Bell size={18} />,
        link: '/noticeboard',
        hasSubmenu: false
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <Settings size={18} />,
        link: '/settings',
        hasSubmenu: false
    }
];