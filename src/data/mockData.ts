// Mock data for the Parent Portal

// Nationalities list for searchable dropdown
export const nationalities = [
  "Thai", "American", "British", "Chinese", "Japanese", "Korean",
  "Australian", "Canadian", "French", "German", "Indian", "Indonesian",
  "Malaysian", "Singaporean", "Vietnamese", "Filipino", "Russian",
  "Italian", "Spanish", "Dutch", "Swedish", "Swiss", "Brazilian",
  "Mexican", "Argentine", "South African", "New Zealand", "Burmese",
  "Cambodian", "Laotian", "Taiwanese", "Hong Konger", "Macanese",
  "Pakistani", "Bangladeshi", "Sri Lankan", "Nepalese", "Other"
];

// Upcoming deadlines for dashboard - covers all menu types
export const mockUpcomingDeadlines = [
  {
    id: "deadline-tuition-001",
    type: "tuition" as const,
    title: "Tuition Fee - Term 2",
    studentName: "Emma Johnson",
    studentId: 1,
    dueDate: "2025-01-15",
    amount: 155000,
    description: "Term 2 Tuition Payment"
  },
  {
    id: "deadline-eca-001",
    type: "eca" as const,
    title: "Creative Art & Design Registration",
    studentName: "Emma Johnson",
    studentId: 1,
    dueDate: "2024-12-20",
    amount: 9500,
    description: "ECA Registration Deadline"
  },
  {
    id: "deadline-eca-002",
    type: "eca" as const,
    title: "Advanced Mathematics Club",
    studentName: "Liam Johnson",
    studentId: 2,
    dueDate: "2024-12-22",
    amount: 12000,
    description: "ECA Registration Deadline"
  },
  {
    id: "deadline-trip-001",
    type: "trip" as const,
    title: "Science Museum Field Trip",
    studentName: "Emma Johnson",
    studentId: 1,
    dueDate: "2024-12-18",
    amount: 4500,
    description: "Field Trip Payment Deadline"
  },
  {
    id: "deadline-trip-002",
    type: "trip" as const,
    title: "Historical Park Excursion",
    studentName: "Liam Johnson",
    studentId: 2,
    dueDate: "2024-12-25",
    amount: 6500,
    description: "Field Trip Payment Deadline"
  },
  {
    id: "deadline-exam-001",
    type: "exam" as const,
    title: "IELTS Registration",
    studentName: "Sophia Johnson",
    studentId: 3,
    dueDate: "2024-12-22",
    amount: 7500,
    description: "Exam Registration Deadline"
  },
  {
    id: "deadline-exam-002",
    type: "exam" as const,
    title: "Cambridge English B2",
    studentName: "Liam Johnson",
    studentId: 2,
    dueDate: "2024-12-30",
    amount: 6800,
    description: "Exam Registration Deadline"
  },
  {
    id: "deadline-schoolbus-001",
    type: "schoolbus" as const,
    title: "School Bus Fee - Term 2",
    studentName: "Emma Johnson",
    studentId: 1,
    dueDate: "2024-12-19",
    amount: 18000,
    description: "School Bus Payment Deadline"
  }
];

export const mockStudents = [
  { 
    id: 1, 
    name: "Emma Johnson", 
    class: "Year 5A", 
    year: "2024", 
    avatar: "👧", 
    campus: "Pracha Uthit", 
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-700", 
    isSISB: true,
    email: "emma.johnson@sisb.ac.th",
    parentEmail: "parent.johnson@sisb.ac.th"
  },
  { 
    id: 2, 
    name: "Liam Johnson", 
    class: "Year 8B", 
    year: "2024", 
    avatar: "👦", 
    campus: "Pracha Uthit", 
    color: "bg-sky-500/10 border-sky-500/30 text-sky-700", 
    isSISB: true,
    email: "liam.johnson@sisb.ac.th",
    parentEmail: "parent.johnson@sisb.ac.th"
  },
  { 
    id: 3, 
    name: "Sophia Johnson", 
    class: "Year 11C", 
    year: "2024", 
    avatar: "👩‍🎓", 
    campus: "Suvarnabhumi", 
    color: "bg-purple-500/10 border-purple-500/30 text-purple-700", 
    isSISB: false,
    email: "sophia.external@gmail.com",
    parentEmail: "parent.external@gmail.com"
  },
];

// Mandatory courses forced by school (pre-selected in cart)
export const mandatoryCourses = [
  {
    id: "mandatory-001",
    name: "Physical Education",
    description: "Required PE course for all students",
    price: 50,
    studentId: "1",
    studentName: "Emma Johnson",
    type: "course" as const,
    isMandatory: true,
    schedule: "Mon & Fri 8:00-9:00 AM",
    location: "Sports Field"
  },
  {
    id: "mandatory-002",
    name: "Library & Research Skills",
    description: "Essential research and information literacy skills",
    price: 40,
    studentId: "2",
    studentName: "Liam Johnson",
    type: "course" as const,
    isMandatory: true,
    schedule: "Tue & Thu 10:00-11:00 AM",
    location: "Library 3F"
  }
];

export const mockInvoices = [
  // Emma Johnson (student_id: 1) - Termly Invoices
  {
    id: "INV-2024-001",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 155000,
    due_date: "2025-08-15",
    status: "paid" as const,
    description: "Tuition Fee 2025-2026",
    term: "Term 1 (August - November 2025)"
  },
  {
    id: "INV-2024-002",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 155000,
    due_date: "2026-01-15",
    status: "overdue" as const,
    description: "Tuition Fee 2025-2026",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "INV-2024-003",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 155000,
    due_date: "2026-04-15",
    status: "pending" as const,
    description: "Tuition Fee 2025-2026",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "INV-2024-010",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 45000,
    due_date: "2026-05-01",
    status: "pending" as const,
    description: "Registration Fee 2026-2027",
    term: "Pre-enrollment (May 2026)"
  },
  {
    id: "INV-2024-011",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 25000,
    due_date: "2026-03-25",
    status: "pending" as const,
    description: "Development Levy",
    term: "Term 2 (December 2025 - March 2026)"
  },

  // Liam Johnson (student_id: 2) - Termly Invoices
  {
    id: "INV-2024-004",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 155000,
    due_date: "2025-08-15",
    status: "paid" as const,
    description: "Tuition Fee 2025-2026",
    term: "Term 1 (August - November 2025)"
  },
  {
    id: "INV-2024-005",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 155000,
    due_date: "2025-12-15",
    status: "paid" as const,
    description: "Tuition Fee 2025-2026",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "INV-2024-006",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 155000,
    due_date: "2026-04-15",
    status: "pending" as const,
    description: "Tuition Fee 2025-2026",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "INV-2024-012",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 45000,
    due_date: "2026-05-01",
    status: "pending" as const,
    description: "Registration Fee 2026-2027",
    term: "Pre-enrollment (May 2026)"
  },
  {
    id: "INV-2024-013",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 155000,
    due_date: "2026-02-15",
    status: "overdue" as const,
    description: "Tuition Fee 2025-2026 (Late)",
    term: "Term 2 (December 2025 - March 2026)"
  },

  // Sophia Johnson (student_id: 3) - Termly Invoices
  {
    id: "INV-2024-007",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 155000,
    due_date: "2025-08-15",
    status: "paid" as const,
    description: "Tuition Fee 2025-2026",
    term: "Term 1 (August - November 2025)"
  },
  {
    id: "INV-2024-008",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 155000,
    due_date: "2026-01-10",
    status: "overdue" as const,
    description: "Tuition Fee 2025-2026",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "INV-2024-009",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 155000,
    due_date: "2026-04-15",
    status: "pending" as const,
    description: "Tuition Fee 2025-2026",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "INV-2024-014",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 35000,
    due_date: "2026-03-20",
    status: "pending" as const,
    description: "Technology & Lab Fee",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "INV-2024-015",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 45000,
    due_date: "2026-05-01",
    status: "pending" as const,
    description: "Registration Fee 2026-2027",
    term: "Pre-enrollment (May 2026)"
  },
  {
    id: "INV-2024-016",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 80000,
    due_date: "2026-03-01",
    status: "partial" as const,
    description: "Tuition Fee 2025-2026 (Remaining)",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "INV-2024-017",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 60000,
    due_date: "2026-03-10",
    status: "partial" as const,
    description: "Tuition Fee 2025-2026 (Remaining)",
    term: "Term 2 (December 2025 - March 2026)"
  }
];

// ECA (After School) Invoices
export const mockECAInvoices = [
  {
    id: "ECA-2024-001",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 12000,
    due_date: "2026-01-20",
    status: "overdue" as const,
    description: "After School Activities - Term 2",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "ECA-2024-002",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 15000,
    due_date: "2026-03-15",
    status: "pending" as const,
    description: "After School Activities - Term 2",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "ECA-2024-003",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 8500,
    due_date: "2026-04-10",
    status: "pending" as const,
    description: "Swimming Club - Term 3",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "ECA-2024-004",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 9500,
    due_date: "2026-03-28",
    status: "pending" as const,
    description: "Robotics Workshop",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "ECA-2024-005",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 7000,
    due_date: "2026-02-10",
    status: "overdue" as const,
    description: "Basketball Training",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "ECA-2024-006",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 11000,
    due_date: "2026-04-05",
    status: "pending" as const,
    description: "Music Ensemble - Term 3",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "ECA-2024-007",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 13500,
    due_date: "2026-03-30",
    status: "pending" as const,
    description: "Drama & Theatre Club",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "ECA-2024-008",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 6000,
    due_date: "2026-01-25",
    status: "overdue" as const,
    description: "Art & Painting Class",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "ECA-2024-009",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 4500,
    due_date: "2026-03-05",
    status: "partial" as const,
    description: "Coding Club (Remaining)",
    term: "Term 2 (December 2025 - March 2026)"
  }
];

// Trip & Activity Invoices
export const mockTripInvoices = [
  {
    id: "TRIP-2024-001",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 8500,
    due_date: "2026-03-10",
    status: "pending" as const,
    description: "Educational Trip - Science Museum",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "TRIP-2024-002",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 8500,
    due_date: "2026-02-05",
    status: "overdue" as const,
    description: "Educational Trip - Science Museum",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "TRIP-2024-003",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 15000,
    due_date: "2026-04-20",
    status: "pending" as const,
    description: "Chiang Mai Cultural Trip (3 Days)",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "TRIP-2024-004",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 4500,
    due_date: "2026-02-28",
    status: "overdue" as const,
    description: "Bangkok Art Gallery Visit",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "TRIP-2024-005",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 12000,
    due_date: "2026-04-18",
    status: "pending" as const,
    description: "Khao Yai Nature Camp (2 Days)",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "TRIP-2024-006",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 25000,
    due_date: "2026-05-10",
    status: "pending" as const,
    description: "Singapore STEM Exchange Program",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "TRIP-2024-007",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 3500,
    due_date: "2026-02-20",
    status: "overdue" as const,
    description: "University Campus Tour",
    term: "Term 2 (December 2025 - March 2026)"
  }
];

// Exam Invoices
export const mockExamInvoices = [
  {
    id: "EXAM-2024-001",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 5000,
    due_date: "2026-02-10",
    status: "overdue" as const,
    description: "Cambridge Assessment English",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "EXAM-2024-002",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 6500,
    due_date: "2026-03-20",
    status: "pending" as const,
    description: "IELTS Preparation & Test",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "EXAM-2024-003",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 7500,
    due_date: "2026-04-25",
    status: "pending" as const,
    description: "SAT Practice Exam",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "EXAM-2024-004",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 3500,
    due_date: "2026-03-15",
    status: "pending" as const,
    description: "Thai Language Proficiency Test",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "EXAM-2024-005",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 8000,
    due_date: "2026-01-30",
    status: "overdue" as const,
    description: "Cambridge IGCSE Mock Exam",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "EXAM-2024-006",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 12000,
    due_date: "2026-04-15",
    status: "pending" as const,
    description: "AP Exam Registration (3 subjects)",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "EXAM-2024-007",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 9500,
    due_date: "2026-03-05",
    status: "overdue" as const,
    description: "TOEFL iBT Test",
    term: "Term 2 (December 2025 - March 2026)"
  }
];

// School Bus Invoices
export const mockSchoolBusInvoices = [
  {
    id: "BUS-2024-001",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 18000,
    due_date: "2025-12-01",
    status: "paid" as const,
    description: "School Bus Service - Term 1",
    term: "Term 1 (August - November 2025)"
  },
  {
    id: "BUS-2024-002",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 18000,
    due_date: "2026-03-01",
    status: "pending" as const,
    description: "School Bus Service - Term 2",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "BUS-2024-003",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 18000,
    due_date: "2026-03-20",
    status: "pending" as const,
    description: "School Bus Service - Term 2",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "BUS-2024-004",
    student_id: 1,
    type: "Termly" as const,
    amount_due: 18000,
    due_date: "2026-04-30",
    status: "pending" as const,
    description: "School Bus Service - Term 3",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "BUS-2024-005",
    student_id: 2,
    type: "Termly" as const,
    amount_due: 18000,
    due_date: "2026-04-30",
    status: "pending" as const,
    description: "School Bus Service - Term 3",
    term: "Term 3 (April - July 2026)"
  },
  {
    id: "BUS-2024-006",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 22000,
    due_date: "2026-03-15",
    status: "pending" as const,
    description: "School Bus Service - Term 2 (Suvarnabhumi)",
    term: "Term 2 (December 2025 - March 2026)"
  },
  {
    id: "BUS-2024-007",
    student_id: 3,
    type: "Termly" as const,
    amount_due: 22000,
    due_date: "2026-01-15",
    status: "overdue" as const,
    description: "School Bus Service - Term 1 (Late)",
    term: "Term 1 (August - November 2025)"
  }
];

export const mockCreditNotes = [
  { 
    id: 1, 
    student_id: 1, 
    balance: 500,
    items: [
      { title: "Tuition Refund - Term 1", amount: 300 },
      { title: "After School Course Cancellation", amount: 200 }
    ]
  },
  { 
    id: 2, 
    student_id: 2, 
    balance: 1200,
    items: [
      { title: "Tuition Overpayment", amount: 800 },
      { title: "Activity Refund", amount: 400 }
    ]
  },
  { 
    id: 3, 
    student_id: 3, 
    balance: 0,
    items: []
  },
];

// Credit Note History for Transaction History page
export const mockCreditNoteHistory = [
  {
    id: "CN-2024-005",
    student_id: 1,
    studentName: "Emma Johnson",
    amount: 3500,
    description: "Early payment discount reward",
    issued_at: "2024-11-20",
    type: "refund" as const,
    status: "active" as const,
    academicYear: "2024",
    usedAmount: 0
  },
  {
    id: "CN-2024-001",
    student_id: 1,
    studentName: "Emma Johnson",
    amount: 5000,
    description: "Refund for cancelled swimming course",
    issued_at: "2024-11-15",
    type: "refund" as const,
    status: "active" as const,
    academicYear: "2024",
    usedAmount: 0
  },
  {
    id: "CN-2024-002",
    student_id: 2,
    studentName: "Liam Johnson",
    amount: 1800,
    description: "Overpayment adjustment from previous term",
    issued_at: "2024-11-10",
    type: "overpayment" as const,
    status: "active" as const,
    academicYear: "2024",
    usedAmount: 0
  },
  {
    id: "CN-2024-003",
    student_id: 2,
    studentName: "Liam Johnson",
    amount: 3700,
    description: "Course cancellation refund - Robotics",
    issued_at: "2024-10-25",
    type: "cancellation" as const,
    status: "active" as const,
    academicYear: "2024",
    usedAmount: 0
  },
  {
    id: "CN-2023-015",
    student_id: 1,
    studentName: "Emma Johnson",
    amount: 2500,
    description: "Activity partial refund",
    issued_at: "2023-08-15",
    type: "refund" as const,
    status: "used" as const,
    academicYear: "2023",
    usedAmount: 2500,
    appliedToInvoice: "INV-2024-002",
    appliedAt: "2024-01-10"
  },
  {
    id: "CN-2023-012",
    student_id: 2,
    studentName: "Liam Johnson",
    amount: 1800,
    description: "Term 2 tuition adjustment",
    issued_at: "2023-06-10",
    type: "overpayment" as const,
    status: "used" as const,
    academicYear: "2023",
    usedAmount: 1800,
    appliedToInvoice: "INV-2024-005",
    appliedAt: "2024-02-01"
  },
  {
    id: "CN-2024-006",
    student_id: 1,
    studentName: "Emma Johnson",
    amount: 4200,
    description: "Term 1 tuition payment",
    issued_at: "2024-03-15",
    type: "used" as const,
    status: "used" as const,
    academicYear: "2024",
    usedAmount: 4200,
    appliedToInvoice: "INV-2024-008",
    appliedAt: "2024-05-20"
  },
  {
    id: "CN-2024-007",
    student_id: 3,
    studentName: "Sophia Johnson",
    amount: 2800,
    description: "Trip cancellation credit",
    issued_at: "2024-06-01",
    type: "cancellation" as const,
    status: "used" as const,
    academicYear: "2024",
    usedAmount: 2800,
    appliedToInvoice: "INV-2024-010",
    appliedAt: "2024-07-15"
  },
  {
    id: "CN-2023-018",
    student_id: 2,
    studentName: "Liam Johnson",
    amount: 5500,
    description: "Exam fee overpayment",
    issued_at: "2023-09-20",
    type: "overpayment" as const,
    status: "used" as const,
    academicYear: "2023",
    usedAmount: 5500,
    appliedToInvoice: "INV-2024-003",
    appliedAt: "2024-01-05"
  }
];

// Student-specific course data
export const mockCoursesData = {
  1: [ // Emma Johnson - Year 5A
    {
      id: "course-001",
      name: "Creative Art & Design",
      description: "Learn drawing, painting and basic design principles",
      capacity: 15,
      enrolled: 12,
      schedule: "Mon & Wed 3:30-4:30 PM",
      day: "Mon",
      startTime: "15:30",
      endTime: "16:30",
      location: "Art Room 201",
      price: 95,
      duration: "8 weeks",
      vendor: "Ms. Jennifer Taylor",
      hasConflict: false
    },
    {
      id: "course-001-wed",
      name: "Creative Art & Design",
      description: "Learn drawing, painting and basic design principles",
      capacity: 15,
      enrolled: 12,
      schedule: "Mon & Wed 3:30-4:30 PM",
      day: "Wed",
      startTime: "15:30",
      endTime: "16:30",
      location: "Art Room 201",
      price: 95,
      duration: "8 weeks",
      vendor: "Ms. Jennifer Taylor",
      hasConflict: false
    },
    {
      id: "course-002", 
      name: "Elementary Science Club",
      description: "Fun experiments and discovery activities for young learners",
      capacity: 18,
      enrolled: 14,
      schedule: "Tue & Thu 4:00-5:00 PM",
      day: "Tue",
      startTime: "16:00",
      endTime: "17:00",
      location: "Science Lab A",
      price: 110,
      duration: "6 weeks",
      vendor: "Mr. Peter Chen",
      hasConflict: false
    },
    {
      id: "course-002-thu",
      name: "Elementary Science Club",
      description: "Fun experiments and discovery activities for young learners",
      capacity: 18,
      enrolled: 14,
      schedule: "Tue & Thu 4:00-5:00 PM",
      day: "Thu",
      startTime: "16:00",
      endTime: "17:00",
      location: "Science Lab A",
      price: 110,
      duration: "6 weeks",
      vendor: "Mr. Peter Chen",
      hasConflict: false
    },
    {
      id: "course-003",
      name: "Reading Adventures",
      description: "Develop reading skills through storytelling and book clubs",
      capacity: 12,
      enrolled: 10,
      schedule: "Wed & Fri 3:30-4:30 PM",
      day: "Fri",
      startTime: "15:30",
      endTime: "16:30",
      location: "Library Reading Corner",
      price: 85,
      duration: "8 weeks",
      vendor: "Ms. Sarah Johnson",
      hasConflict: false
    },
    {
      id: "course-003-sat",
      name: "Junior Swimming Class",
      description: "Learn swimming basics and water safety",
      capacity: 16,
      enrolled: 14,
      schedule: "Sat 10:00-11:30 AM",
      day: "Sat",
      startTime: "10:00",
      endTime: "11:30",
      location: "Swimming Pool",
      price: 120,
      duration: "8 weeks",
      vendor: "Coach Lisa Williams",
      hasConflict: false
    },
    {
      id: "course-003-sun",
      name: "Kids Yoga & Mindfulness",
      description: "Relaxation techniques and basic yoga poses for children",
      capacity: 15,
      enrolled: 11,
      schedule: "Sun 9:00-10:00 AM",
      day: "Sun",
      startTime: "09:00",
      endTime: "10:00",
      location: "Wellness Studio",
      price: 90,
      duration: "6 weeks",
      vendor: "Ms. Emma Green",
      hasConflict: false
    },
    {
      id: "course-003-conflict",
      name: "Music Theory Basics",
      description: "Learn fundamental music theory and notation",
      capacity: 15,
      enrolled: 8,
      schedule: "Mon & Wed 3:30-4:30 PM",
      day: "Mon",
      startTime: "15:30",
      endTime: "16:30",
      location: "Music Room 105",
      price: 100,
      duration: "8 weeks",
      vendor: "Mr. James Williams",
      hasConflict: true
    }
  ],
  2: [ // Liam Johnson - Year 8B
    {
      id: "course-004",
      name: "Advanced Mathematics Club",
      description: "Explore advanced mathematical concepts and problem-solving techniques",
      capacity: 20,
      enrolled: 18,
      schedule: "Mon & Wed 3:30-4:30 PM",
      day: "Mon",
      startTime: "15:30",
      endTime: "16:30",
      location: "Math Lab Room 205",
      price: 120,
      duration: "8 weeks",
      vendor: "Dr. Sarah Wilson",
      hasConflict: false
    },
    {
      id: "course-004-wed",
      name: "Advanced Mathematics Club",
      description: "Explore advanced mathematical concepts and problem-solving techniques",
      capacity: 20,
      enrolled: 18,
      schedule: "Mon & Wed 3:30-4:30 PM",
      day: "Wed",
      startTime: "15:30",
      endTime: "16:30",
      location: "Math Lab Room 205",
      price: 120,
      duration: "8 weeks",
      vendor: "Dr. Sarah Wilson",
      hasConflict: false
    },
    {
      id: "course-005",
      name: "Robotics Engineering",
      description: "Learn programming and build robots using LEGO Mindstorms",
      capacity: 12,
      enrolled: 12,
      schedule: "Wed & Fri 3:30-5:00 PM",
      day: "Fri",
      startTime: "15:30",
      endTime: "17:00",
      location: "STEM Lab Room 101",
      price: 180,
      duration: "10 weeks",
      vendor: "Mr. David Kim",
      hasConflict: false
    },
    {
      id: "course-006",
      name: "Digital Photography",
      description: "Learn photography techniques and digital editing",
      capacity: 15,
      enrolled: 11,
      schedule: "Tue & Thu 4:00-5:30 PM",
      day: "Tue",
      startTime: "16:00",
      endTime: "17:30",
      location: "Media Lab Room 305",
      price: 140,
      duration: "8 weeks",
      vendor: "Ms. Rachel Martinez",
      hasConflict: false
    },
    {
      id: "course-006-thu",
      name: "Digital Photography",
      description: "Learn photography techniques and digital editing",
      capacity: 15,
      enrolled: 11,
      schedule: "Tue & Thu 4:00-5:30 PM",
      day: "Thu",
      startTime: "16:00",
      endTime: "17:30",
      location: "Media Lab Room 305",
      price: 140,
      duration: "8 weeks",
      vendor: "Ms. Rachel Martinez",
      hasConflict: false
    },
    {
      id: "course-007-sat",
      name: "Basketball Training",
      description: "Improve basketball skills and game strategy",
      capacity: 20,
      enrolled: 18,
      schedule: "Sat 2:00-4:00 PM",
      day: "Sat",
      startTime: "14:00",
      endTime: "16:00",
      location: "Sports Court",
      price: 150,
      duration: "10 weeks",
      vendor: "Coach Mike Johnson",
      hasConflict: false
    },
    {
      id: "course-007-sun",
      name: "Chess Strategy Club",
      description: "Learn advanced chess tactics and tournament preparation",
      capacity: 12,
      enrolled: 9,
      schedule: "Sun 10:00-12:00 PM",
      day: "Sun",
      startTime: "10:00",
      endTime: "12:00",
      location: "Activity Room 203",
      price: 100,
      duration: "8 weeks",
      vendor: "Grandmaster Alex Chen",
      hasConflict: false
    },
    {
      id: "course-006-conflict",
      name: "Spanish Language",
      description: "Introduction to Spanish language and culture",
      capacity: 18,
      enrolled: 14,
      schedule: "Mon & Wed 3:30-4:30 PM",
      day: "Mon",
      startTime: "15:30",
      endTime: "16:30",
      location: "Language Lab 210",
      price: 130,
      duration: "8 weeks",
      vendor: "Señora Maria Garcia",
      hasConflict: true
    }
  ],
  3: [ // Sophia Johnson - Year 11C
    {
      id: "course-008",
      name: "Academic Writing Workshop",
      description: "Develop advanced writing skills for college preparation",
      capacity: 15,
      enrolled: 13,
      schedule: "Mon & Wed 4:00-5:30 PM",
      day: "Mon",
      startTime: "16:00",
      endTime: "17:30",
      location: "English Department Room 402",
      price: 160,
      duration: "10 weeks",
      vendor: "Dr. Emily Roberts",
      hasConflict: false
    },
    {
      id: "course-008-wed",
      name: "Academic Writing Workshop",
      description: "Develop advanced writing skills for college preparation",
      capacity: 15,
      enrolled: 13,
      schedule: "Mon & Wed 4:00-5:30 PM",
      day: "Wed",
      startTime: "16:00",
      endTime: "17:30",
      location: "English Department Room 402",
      price: 160,
      duration: "10 weeks",
      vendor: "Dr. Emily Roberts",
      hasConflict: false
    },
    {
      id: "course-009",
      name: "Advanced Biology Lab",
      description: "Hands-on laboratory experiments and research projects",
      capacity: 18,
      enrolled: 16,
      schedule: "Tue & Thu 3:30-5:00 PM",
      day: "Tue",
      startTime: "15:30",
      endTime: "17:00",
      location: "Biology Lab Room 501",
      price: 200,
      duration: "12 weeks",
      vendor: "Dr. Michael Thompson",
      hasConflict: false
    },
    {
      id: "course-009-thu",
      name: "Advanced Biology Lab",
      description: "Hands-on laboratory experiments and research projects",
      capacity: 18,
      enrolled: 16,
      schedule: "Tue & Thu 3:30-5:00 PM",
      day: "Thu",
      startTime: "15:30",
      endTime: "17:00",
      location: "Biology Lab Room 501",
      price: 200,
      duration: "12 weeks",
      vendor: "Dr. Michael Thompson",
      hasConflict: false
    },
    {
      id: "course-010",
      name: "Leadership & Communication",
      description: "Develop leadership skills and public speaking abilities",
      capacity: 20,
      enrolled: 17,
      schedule: "Fri 4:00-5:30 PM",
      day: "Fri",
      startTime: "16:00",
      endTime: "17:30",
      location: "Conference Room B",
      price: 175,
      duration: "8 weeks",
      vendor: "Ms. Amanda Lee",
      hasConflict: false
    },
    {
      id: "course-011-sat",
      name: "SAT Preparation Course",
      description: "Intensive SAT test preparation and practice",
      capacity: 25,
      enrolled: 22,
      schedule: "Sat 9:00-12:00 PM",
      day: "Sat",
      startTime: "09:00",
      endTime: "12:00",
      location: "Study Hall 401",
      price: 280,
      duration: "12 weeks",
      vendor: "Dr. James Patterson",
      hasConflict: false
    },
    {
      id: "course-011-sun",
      name: "College Essay Workshop",
      description: "Craft compelling college application essays",
      capacity: 15,
      enrolled: 13,
      schedule: "Sun 1:00-3:00 PM",
      day: "Sun",
      startTime: "13:00",
      endTime: "15:00",
      location: "Writing Center",
      price: 190,
      duration: "8 weeks",
      vendor: "Ms. Rebecca Stone",
      hasConflict: false
    }
  ]
};

// Student-specific event activities data (School Events)
export const mockEventActivitiesData = {
  1: [ // Emma Johnson - Year 5A
    {
      id: "event-001",
      name: "Sports Day 2024",
      description: "Annual school sports day competition and activities",
      capacity: 150,
      enrolled: 120,
      schedule: "Oct 15, 8:00 AM - 4:00 PM",
      location: "Main Sports Complex",
      price: 150,
      duration: "1 day",
      vendor: "PE Department",
      discount: "Family Package: 15% off"
    },
    {
      id: "event-002",
      name: "Science Fair Exhibition",
      description: "Student science projects showcase and competition",
      capacity: 80,
      enrolled: 65,
      schedule: "Nov 8-9, 9:00 AM - 3:00 PM",
      location: "Main Hall & Science Building",
      price: 120,
      duration: "2 days", 
      vendor: "Science Department",
      discount: "Early Registration: $20 off"
    },
    {
      id: "event-003",
      name: "Winter Concert Performance",
      description: "Participate in annual winter music concert",
      capacity: 50,
      enrolled: 42,
      schedule: "Dec 12, 6:00 PM - 8:30 PM",
      location: "School Auditorium",
      price: 100,
      duration: "1 evening",
      vendor: "Music Department"
    }
  ],
  2: [ // Liam Johnson - Year 8B
    {
      id: "event-004",
      name: "Math Olympiad Competition",
      description: "Inter-school mathematics competition",
      capacity: 40,
      enrolled: 35,
      schedule: "Oct 28, 9:00 AM - 4:00 PM",
      location: "Academic Building Room 301",
      price: 200,
      duration: "1 day",
      vendor: "Math Department",
      discount: "Top Students: 20% off"
    },
    {
      id: "event-005",
      name: "Robotics Challenge 2024",
      description: "STEM robotics competition and exhibition",
      capacity: 30,
      enrolled: 28,
      schedule: "Nov 15-16, 9:00 AM - 5:00 PM",
      location: "STEM Lab & Exhibition Hall",
      price: 250,
      duration: "2 days",
      vendor: "STEM Team"
    },
    {
      id: "event-006",
      name: "Cultural Day Festival",
      description: "Multicultural celebration and performances",
      capacity: 200,
      enrolled: 180,
      schedule: "Dec 5, 10:00 AM - 6:00 PM",
      location: "School Campus",
      price: 180,
      duration: "1 day",
      vendor: "Cultural Activities Team",
      discount: "Group Discount: 10% off"
    }
  ],
  3: [ // Sophia Johnson - Year 11C
    {
      id: "event-007",
      name: "Model United Nations Conference",
      description: "Inter-school MUN conference and debate",
      capacity: 60,
      enrolled: 55,
      schedule: "Nov 22-24, 8:00 AM - 6:00 PM",
      location: "Conference Center",
      price: 350,
      duration: "3 days",
      vendor: "Social Studies Department",
      discount: "Delegate Scholarship: $50 off"
    },
    {
      id: "event-008",
      name: "Art Exhibition & Workshop",
      description: "Student art showcase and creative workshops",
      capacity: 45,
      enrolled: 38,
      schedule: "Dec 1-3, 1:00 PM - 5:00 PM",
      location: "Art Gallery & Studios",
      price: 220,
      duration: "3 days", 
      vendor: "Art Department",
      discount: "Portfolio Package: $30 off"
    },
    {
      id: "event-009",
      name: "Academic Excellence Awards",
      description: "Year-end academic achievement ceremony",
      capacity: 300,
      enrolled: 250,
      schedule: "Dec 18, 5:00 PM - 8:00 PM",
      location: "Main Auditorium",
      price: 150,
      duration: "1 evening",
      vendor: "Academic Affairs"
    }
  ]
};

// Legacy exports for backward compatibility
export const mockCourses = mockCoursesData[1];
export const mockEventActivities = mockEventActivitiesData[1];

export const mockReceipts = [
  {
    id: "REC-2024-001",
    type: "tuition" as const,
    usedCreditNotes: [
      {
        id: "CN-2024-001",
        amount: 500,
        appliedTo: "Tuition Fee - Term 1 2025-2026",
        used_at: "2025-08-28T17:30:00Z"
      },
      {
        id: "CN-2024-002",
        amount: 300,
        appliedTo: "Tuition Fee - Term 1 2025-2026",
        used_at: "2025-08-28T17:30:00Z"
      }
    ],
    invoice_id: "INV-2024-001",
    student_id: 1,
    studentName: "Emma Johnson",
    year: "2025",
    amount: 154200,
    payment_method: "credit_card" as const,
    paid_at: "2025-08-28T10:30:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Tuition Fee - Term 1 2025-2026",
    reference_number: "TXN-20250828-001"
  },
  {
    id: "REC-2024-002",
    type: "eca" as const,
    usedCreditNotes: [
      {
        id: "CN-2024-003",
        amount: 200,
        appliedTo: "After School Activities - Term 1",
        used_at: "2025-08-25T14:00:00Z"
      }
    ],
    invoice_id: "ECA-2023-002",
    student_id: 2,
    studentName: "Liam Johnson",
    year: "2025",
    amount: 14800,
    payment_method: "bank_transfer" as const,
    paid_at: "2025-08-25T14:15:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "After School Activities - Term 1",
    reference_number: "TXN-20250825-002"
  },
  {
    id: "REC-2024-003",
    type: "trip" as const,
    usedCreditNotes: [],
    invoice_id: "TRIP-2023-001",
    student_id: 3,
    studentName: "Sophia Johnson",
    year: "2025",
    amount: 8500,
    payment_method: "credit_note" as const,
    paid_at: "2025-09-20T09:45:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Educational Trip - Science Museum",
    reference_number: "TXN-20250920-003"
  },
  {
    id: "REC-2024-004",
    type: "tuition" as const,
    usedCreditNotes: [],
    invoice_id: "INV-2024-005",
    student_id: 2,
    studentName: "Liam Johnson",
    year: "2025",
    amount: 155000,
    payment_method: "credit_card" as const,
    paid_at: "2025-12-15T16:20:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Tuition Fee - Term 2 2025-2026",
    reference_number: "TXN-20251215-004"
  },
  {
    id: "REC-2023-001",
    type: "tuition" as const,
    usedCreditNotes: [],
    invoice_id: "INV-2023-001",
    student_id: 2,
    studentName: "Liam Johnson",
    year: "2024",
    amount: 155000,
    payment_method: "bank_transfer" as const,
    paid_at: "2024-08-15T10:30:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Tuition Fee - Term 1 2024-2025",
    reference_number: "TXN-20240815-001"
  },
  {
    id: "REC-2023-002",
    type: "tuition" as const,
    usedCreditNotes: [
      {
        id: "CN-2023-001",
        amount: 1000,
        appliedTo: "Tuition Fee - Term 1 2024-2025",
        used_at: "2024-07-20T14:00:00Z"
      }
    ],
    invoice_id: "INV-2023-002",
    student_id: 3,
    studentName: "Sophia Johnson",
    year: "2024",
    amount: 154000,
    payment_method: "credit_card" as const,
    paid_at: "2024-07-20T14:15:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Tuition Fee - Term 1 2024-2025",
    reference_number: "TXN-20240720-002"
  },
  {
    id: "REC-2025-001",
    type: "eca" as const,
    usedCreditNotes: [],
    invoice_id: "ECA-2024-001",
    student_id: 1,
    studentName: "Emma Johnson",
    year: "2025",
    amount: 12000,
    payment_method: "bank_transfer" as const,
    paid_at: "2025-08-10T09:00:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "After School Activities - Term 1",
    reference_number: "TXN-20250810-001"
  },
  {
    id: "REC-2025-002",
    type: "trip" as const,
    usedCreditNotes: [],
    invoice_id: "TRIP-2024-001",
    student_id: 1,
    studentName: "Emma Johnson",
    year: "2025",
    amount: 8500,
    payment_method: "credit_card" as const,
    paid_at: "2025-09-05T11:30:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Educational Trip - Science Museum",
    reference_number: "TXN-20250905-002"
  },
  {
    id: "REC-2025-003",
    type: "exam" as const,
    usedCreditNotes: [
      {
        id: "CN-2023-015",
        amount: 500,
        appliedTo: "Cambridge Assessment English",
        used_at: "2025-10-01T08:00:00Z"
      }
    ],
    invoice_id: "EXAM-2024-001",
    student_id: 1,
    studentName: "Emma Johnson",
    year: "2025",
    amount: 4500,
    payment_method: "credit_card" as const,
    paid_at: "2025-10-01T08:15:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Cambridge Assessment English",
    reference_number: "TXN-20251001-003"
  },
  {
    id: "REC-2025-004",
    type: "schoolbus" as const,
    usedCreditNotes: [],
    invoice_id: "BUS-2024-001",
    student_id: 1,
    studentName: "Emma Johnson",
    year: "2025",
    amount: 18000,
    payment_method: "bank_transfer" as const,
    paid_at: "2025-12-01T10:00:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "School Bus Service - Term 1",
    reference_number: "TXN-20251201-004"
  },
  {
    id: "REC-2025-005",
    type: "eca" as const,
    usedCreditNotes: [],
    invoice_id: "ECA-2024-002",
    student_id: 2,
    studentName: "Liam Johnson",
    year: "2025",
    amount: 15000,
    payment_method: "credit_card" as const,
    paid_at: "2025-08-12T14:00:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "After School Activities - Term 1",
    reference_number: "TXN-20250812-005"
  },
  {
    id: "REC-2025-006",
    type: "exam" as const,
    usedCreditNotes: [],
    invoice_id: "EXAM-2024-002",
    student_id: 2,
    studentName: "Liam Johnson",
    year: "2025",
    amount: 6500,
    payment_method: "bank_transfer" as const,
    paid_at: "2025-10-15T09:30:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "IELTS Preparation & Test",
    reference_number: "TXN-20251015-006"
  },
  {
    id: "REC-2025-007",
    type: "trip" as const,
    usedCreditNotes: [],
    invoice_id: "TRIP-2024-002",
    student_id: 2,
    studentName: "Liam Johnson",
    year: "2025",
    amount: 8500,
    payment_method: "bank_transfer" as const,
    paid_at: "2025-09-20T13:00:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "Educational Trip - Science Museum",
    reference_number: "TXN-20250920-007"
  },
  {
    id: "REC-2025-008",
    type: "schoolbus" as const,
    usedCreditNotes: [],
    invoice_id: "BUS-2024-002",
    student_id: 2,
    studentName: "Liam Johnson",
    year: "2025",
    amount: 18000,
    payment_method: "credit_card" as const,
    paid_at: "2025-12-03T10:00:00Z",
    receipt_url: "#",
    status: "completed" as const,
    description: "School Bus Service - Term 1",
    reference_number: "TXN-20251203-008"
  }
];

// Mock exam data
export const mockExamActivitiesData: Record<number, any[]> = {
  1: [ // Emma Johnson - Year 5A
    {
      id: "exam-001",
      name: "Cambridge Primary English Test",
      description: "International standardized English assessment for primary students",
      date: "Dec 15, 2024",
      time: "9:00 AM - 12:00 PM",
      location: "Examination Hall A",
      capacity: 50,
      enrolled: 35,
      examPrice: 2500,
      deliveryPrice: 500,
      vendor: "Cambridge Assessment",
      examType: "general"
    },
    {
      id: "exam-002",
      name: "Math Olympiad Qualifier",
      description: "Regional mathematics competition preliminary round",
      date: "Jan 10, 2025",
      time: "1:00 PM - 4:00 PM",
      location: "Math Lab Room 205",
      capacity: 30,
      enrolled: 28,
      examPrice: 1500,
      deliveryPrice: 300,
      vendor: "Thailand Math Association",
      examType: "general"
    },
    {
      id: "exam-ipsle-001",
      name: "iPSLE 2026 Examination",
      description: "2026 Singapore International Primary School Leaving Examination",
      date: "Jun 29 - Jul 2, 2026",
      time: "Various Times",
      location: "Examination Hall",
      capacity: 100,
      enrolled: 45,
      examPrice: 5000,
      deliveryPrice: 0,
      vendor: "SEAB Singapore",
      examType: "ipsle",
      subjects: [
        { id: "english", labelEn: "ENGLISH LANGUAGE", labelZh: "英语" },
        { id: "mathematics", labelEn: "MATHEMATICS", labelZh: "数学" },
        { id: "science", labelEn: "SCIENCE", labelZh: "科学" },
        { id: "chinese", labelEn: "CHINESE LANGUAGE", labelZh: "汉语" }
      ],
      timetable: {
        oral: [
          { date: "Mon 29 Jun 2026", subjects: ["English Language Oral & LC", "Chinese Language Oral & LC"] },
          { date: "Tue 30 Jun 2026", subjects: ["English Language Oral & LC", "Chinese Language Oral & LC"] }
        ],
        written: [
          { date: "Wed 1 Jul 2026", subjects: ["English Language", "Mathematics"] },
          { date: "Thu 2 Jul 2026", subjects: ["Science", "Chinese Language"] }
        ]
      }
    },
    {
      id: "exam-hsk-001",
      name: "HSK Level 4 Examination",
      description: "Hanyu Shuiping Kaoshi Chinese proficiency test",
      date: "Feb 15, 2025",
      time: "9:00 AM - 12:00 PM",
      location: "Language Center",
      capacity: 40,
      enrolled: 20,
      examPrice: 3000,
      deliveryPrice: 500,
      vendor: "Hanban",
      examType: "hsk"
    }
  ],
  2: [ // Liam Johnson - Year 8B
    {
      id: "exam-003",
      name: "IGCSE Mock Examination",
      description: "Practice examination for IGCSE preparation",
      date: "Dec 20, 2024",
      time: "8:30 AM - 3:30 PM",
      location: "Examination Hall B",
      capacity: 60,
      enrolled: 45,
      examPrice: 3500,
      deliveryPrice: 600,
      vendor: "Cambridge Assessment"
    },
    {
      id: "exam-004",
      name: "Science Competition",
      description: "National science knowledge competition",
      date: "Jan 15, 2025",
      time: "9:00 AM - 12:00 PM",
      location: "Science Lab A",
      capacity: 40,
      enrolled: 32,
      examPrice: 1800,
      deliveryPrice: 400,
      vendor: "Thailand Science Society"
    }
  ],
  3: [ // Sophia Johnson - Year 11C
    {
      id: "exam-005",
      name: "SAT Practice Test",
      description: "Full-length SAT practice examination with detailed scoring",
      date: "Dec 18, 2024",
      time: "8:00 AM - 1:00 PM",
      location: "Study Hall 401",
      capacity: 40,
      enrolled: 38,
      examPrice: 4500,
      deliveryPrice: 800,
      vendor: "College Board"
    },
    {
      id: "exam-006",
      name: "IELTS Preparation Exam",
      description: "Mock IELTS examination with all four components",
      date: "Jan 20, 2025",
      time: "8:30 AM - 2:30 PM",
      location: "Language Center",
      capacity: 35,
      enrolled: 30,
      examPrice: 5000,
      deliveryPrice: 700,
      vendor: "British Council"
    }
  ]
};

// Mock trip data
export const mockTripActivitiesData: Record<number, any[]> = {
  1: [ // Emma Johnson - Year 5A
    {
      id: "trip-001",
      name: "Ayutthaya Historical Trip",
      description: "Educational trip to explore Thailand's ancient capital",
      date: "January 25, 2026",
      time: "7:00 AM - 5:00 PM",
      location: "Ayutthaya Province",
      price: 1200,
      paymentDeadline: "2026-01-15",
      details: "• Transportation by air-conditioned bus\n• Includes lunch and snacks\n• Visit 3 historical temples\n• English/Thai speaking guide",
      organizer: "History Department",
      status: "pending" as const
    },
    {
      id: "trip-002",
      name: "Science Museum Field Trip",
      description: "Interactive learning experience at Bangkok Science Museum",
      date: "February 20, 2026",
      time: "8:30 AM - 3:00 PM",
      location: "National Science Museum, Pathumthani",
      price: 650,
      paymentDeadline: "2026-02-10",
      details: "• Bus transportation included\n• Museum entry fee included\n• Planetarium show\n• Lunch provided",
      organizer: "Science Department",
      status: "accepted" as const
    }
  ],
  2: [ // Liam Johnson - Year 8B
    {
      id: "trip-003",
      name: "Khao Yai Nature Camp",
      description: "Outdoor adventure and nature exploration at Khao Yai National Park",
      date: "January 28-30, 2026",
      time: "6:00 AM Day 1 - 6:00 PM Day 3",
      location: "Khao Yai National Park",
      price: 4500,
      paymentDeadline: "2026-01-20",
      details: "• 3 days 2 nights camping\n• Wildlife watching tours\n• Waterfall trekking\n• Night safari included\n• All meals provided",
      organizer: "Outdoor Education",
      status: "pending" as const
    },
    {
      id: "trip-004",
      name: "Tech Company Visit",
      description: "Visit to leading tech companies in Bangkok",
      date: "February 15, 2026",
      time: "9:00 AM - 4:00 PM",
      location: "True Digital Park, Bangkok",
      price: 350,
      paymentDeadline: "2026-02-05",
      details: "• Tour of tech startup offices\n• Workshop on coding basics\n• Meet tech professionals\n• Lunch included",
      organizer: "IT Department",
      status: "declined" as const
    }
  ],
  3: [ // Sophia Johnson - Year 11C
    {
      id: "trip-005",
      name: "University Campus Tour",
      description: "Visit top universities in Bangkok for college preparation",
      date: "February 20, 2026",
      time: "8:00 AM - 5:00 PM",
      location: "Multiple Universities, Bangkok",
      price: 500,
      paymentDeadline: "2026-02-10",
      details: "• Visit Chulalongkorn University\n• Visit Thammasat University\n• Meet admissions officers\n• Information sessions\n• Transportation and lunch included",
      organizer: "Guidance Counseling",
      status: "pending" as const
    },
    {
      id: "trip-006",
      name: "Art Museum & Gallery Tour",
      description: "Cultural exploration at Bangkok's finest art venues",
      date: "February 5, 2026",
      time: "10:00 AM - 4:00 PM",
      location: "MOCA & BACC, Bangkok",
      price: 450,
      paymentDeadline: "2026-01-30",
      details: "• Museum of Contemporary Art visit\n• Bangkok Art and Culture Centre\n• Guided art appreciation session\n• Sketch workshop included",
      organizer: "Art Department",
      status: "paid" as const
    }
  ]
};

export const getMockDataForStudent = (studentId: number) => {
  const invoices = mockInvoices.filter(inv => inv.student_id === studentId);
  const creditNote = mockCreditNotes.find(cn => cn.student_id === studentId);
  
  return {
    invoices,
    creditBalance: creditNote?.balance || 0,
    courses: mockCoursesData[studentId] || mockCoursesData[1],
    eventActivities: mockEventActivitiesData[studentId] || mockEventActivitiesData[1],
    examActivities: mockExamActivitiesData[studentId] || mockExamActivitiesData[1],
    tripActivities: mockTripActivitiesData[studentId] || mockTripActivitiesData[1],
    receipts: mockReceipts
  };
};