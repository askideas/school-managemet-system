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
    Bell
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
                label: 'All Teachers',
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
        id: 'classes',
        label: 'Classes',
        icon: <School size={18} />,
        link: false,
        hasSubmenu: true,
        subItems: [
            {
                id: 'all-classes',
                label: 'All Classes',
                link: '/classes'
            },
            {
                id: 'add-class',
                label: 'Add Class',
                link: '/addclass'
            },
        ]
    },
    {
        id: 'subjects',
        label: 'Subjects',
        icon: <BookOpen size={18} />,
        link: false,
        hasSubmenu: true,
        subItems: [
            {
                id: 'all-subjects',
                label: 'All Subjects',
                link: '/subjects'
            },
            {
                id: 'add-subject',
                label: 'Add Subject',
                link: '/addsubjects'
            },
        ]
    },
    {
        id: 'finance',
        label: 'Finance',
        icon: <DollarSign size={18} />,
        link: false,
        hasSubmenu: true,
        subItems: [
            {
                id: 'student-fees',
                label: 'Student Fees',
                link: '/studentfees'
            },
            {
                id: 'expenses',
                label: 'Expenses',
                link: '/expenses'
            },
            {
                id: 'salary',
                label: 'Salary',
                link: '/salary'
            },
            {
                id: 'financial-reports',
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
                id: 'all-exams',
                label: 'All Exams',
                link: '/exams'
            },
            {
                id: 'create-exam',
                label: 'Add Exam',
                link: '/addexam'
            },
            {
                id: 'results',
                label: 'Results',
                link: '/examresults'
            }
        ]
    },
    {
        id: 'attendance',
        label: 'Attendance',
        icon: <Calendar size={18} />,
        link: '/attendance',
        hasSubmenu: false
    },
    {
        id: 'library',
        label: 'Library',
        icon: <BookOpen size={18} />,
        link: '/library',
        hasSubmenu: false
    },
    {
        id: 'transport',
        label: 'Transport',
        icon: <Clock size={18} />,
        link: '/transport',
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