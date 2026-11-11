export type Role = 'admin' | 'teacher' | 'student';

export interface UserSession {
  role: Role;
  username: string;
  name: string;
  classId?: string;
}

export interface TeacherRecord {
  name: string;
  ic: string;
}

export interface ClassLeaderData {
  id: string; // e.g., "1M", "1K", "1B" ... "6B"
  name: string; // e.g., "Tahun 1 Mawar (1M)"
  grade: number; // 1 to 6
  teacherName: string;
  headPrefect: string; // Ketua Kelas
  assistantPrefect: string; // Penolong Ketua Kelas
}

export type VoteCategory =
  | 'ketua_tahap1'
  | 'ketua_tahap2'
  | 'penolong_tahap1'
  | 'penolong_tahap2'
  | 'ketua'
  | 'penolong';

export interface VoteRecord {
  id: string;
  year: number;
  voterId: string; // IC or teacher/student ID
  voterName?: string; // Nama Guru / Pengundi
  category: VoteCategory;
  candidateName: string;
  classId: string;
  timestamp: string;
}

export interface DailyChecklistTask {
  id: string;
  category: 'ketua' | 'penolong' | 'etika';
  session: 'pagi' | 'rehat' | 'balik';
  task: string;
  completed: boolean;
}

export interface SystemSettings {
  votingOpen: boolean;
  announcement: string;
  schoolName: string;
}
