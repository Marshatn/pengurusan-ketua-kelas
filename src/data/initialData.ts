import { ClassLeaderData, DailyChecklistTask, SystemSettings } from '../types';

export const TEACHER_LIST: string[] = [
  'ALVECARLOS KASSIM @ LANTANG',
  'AMOS CHIN TZEUN HSIEN',
  'BRIAN BIN GINSOS @ CHARLY',
  'CHIA MEE HIE',
  'CHIN NYOK YEN @ EVOLYN',
  'CHOW MUI LEN',
  'DELAN BIN SOHOI',
  'DORIN GINTURUN',
  'EILY GRACESEE DONALD',
  'ERIC CHUNGXIANLONG',
  'EUDORA PRISCILLA',
  'FANNY YONG SIAU FUI',
  'FEDORA HSU JIN WEN',
  'FENNY CHIN MUI MUI',
  'FIONA EXNA JULIUS',
  'IZATUL NEZIAH BINTI JERAL',
  'JACKRYSON AHYIT',
  'JACKSON KULU',
  'JACQUELINE BINTI JAUMIN',
  'JAMUEL ROMIE',
  'JENNIFER LO YUNG TING',
  'JOYCE NGU SU FEI',
  'LAMDIN BIN JAMAN',
  'LIM CHEN CHING',
  'MASLIJAH HJ ABU BAKAR',
  'MASNIKA MASDIN',
  'MELLSIELLE EDORALINA LOUNA',
  'MOHAMMAD KHAIRUDDIN RAMLEE',
  'MUNAH BT. OSMAN',
  'NIAM YEN LEE',
  'NOOR ASHIKIN BIN TI ABD. RAHMAN',
  'OH HUI KAI',
  'PATRICK TENG JING WEI',
  'ROSNI BINTI BEDIN',
  'RUMIZAH BINTI MOHD HARRIS',
  'TAN FUI TING @ JESSICA TAN',
  'TAN MUNG PING',
  'TAN SIEW NAH',
  'VICTORY BIN MIASIN',
  'YONG FUI HAN',
  'BENNY BIN RAIJUN',
  'ANSON TONG CHENG XUN',
  'BESS LING HIE YING',
];

export const INITIAL_CLASSES_2026: ClassLeaderData[] = [
  { id: '1M', name: 'Tahun 1 Mawar (1M)', grade: 1, teacherName: 'NOOR ASHIKIN BIN TI ABD. RAHMAN', headPrefect: 'Aiman bin Zulkifli', assistantPrefect: 'Tan Mei Ling' },
  { id: '1K', name: 'Tahun 1 Kenanga (1K)', grade: 1, teacherName: 'CHIA MEE HIE', headPrefect: 'Muhammad Farhan', assistantPrefect: 'Siti Aishah binti Omar' },
  { id: '1B', name: 'Tahun 1 Melati (1B)', grade: 1, teacherName: 'CHOW MUI LEN', headPrefect: 'Kavitha a/p Ramesh', assistantPrefect: 'Haikal Hakim' },

  { id: '2M', name: 'Tahun 2 Mawar (2M)', grade: 2, teacherName: 'DELAN BIN SOHOI', headPrefect: 'Lucas Lee Jian Hao', assistantPrefect: 'Nurul Huda binti Rosli' },
  { id: '2K', name: 'Tahun 2 Kenanga (2K)', grade: 2, teacherName: 'DORIN GINTURUN', headPrefect: 'Amirul Hakim', assistantPrefect: 'Chloe Lim Xin Yi' },
  { id: '2B', name: 'Tahun 2 Melati (2B)', grade: 2, teacherName: 'EILY GRACESEE DONALD', headPrefect: 'Priya a/p Selvam', assistantPrefect: 'Daniel bin Zaid' },

  { id: '3M', name: 'Tahun 3 Mawar (3M)', grade: 3, teacherName: 'ERIC CHUNGXIANLONG', headPrefect: 'Muhammad Aqil', assistantPrefect: 'Ng Jia Hui' },
  { id: '3K', name: 'Tahun 3 Kenanga (3K)', grade: 3, teacherName: 'EUDORA PRISCILLA', headPrefect: 'Sivakumar a/l Nathan', assistantPrefect: 'Nur Fatihah' },
  { id: '3B', name: 'Tahun 3 Melati (3B)', grade: 3, teacherName: 'FANNY YONG SIAU FUI', headPrefect: 'Brandon Koh Wei Kit', assistantPrefect: 'Aina Sofea' },

  { id: '4M', name: 'Tahun 4 Mawar (4M)', grade: 4, teacherName: 'FEDORA HSU JIN WEN', headPrefect: 'Darren Lim Wei Ming', assistantPrefect: 'Nurul Ain binti Jamil' },
  { id: '4K', name: 'Tahun 4 Kenanga (4K)', grade: 4, teacherName: 'FENNY CHIN MUI MUI', headPrefect: 'Hariz Zikri', assistantPrefect: 'Jessica Tan Hui Wen' },
  { id: '4B', name: 'Tahun 4 Melati (4B)', grade: 4, teacherName: 'FIONA EXNA JULIUS', headPrefect: 'Dhivya a/p Kumar', assistantPrefect: 'Luqman Hakim' },

  { id: '5M', name: 'Tahun 5 Mawar (5M)', grade: 5, teacherName: 'IZATUL NEZIAH BINTI JERAL', headPrefect: 'Ryan Teo Ming Xuan', assistantPrefect: 'Puteri Nur Aisyah' },
  { id: '5K', name: 'Tahun 5 Kenanga (5K)', grade: 5, teacherName: 'JACKRYSON AHYIT', headPrefect: 'Vimal a/l Perumal', assistantPrefect: 'Nurul Izzah' },
  { id: '5B', name: 'Tahun 5 Melati (5B)', grade: 5, teacherName: 'JACKSON KULU', headPrefect: 'Marcus Lee Jun Wei', assistantPrefect: 'Siti Zulaikha' },

  { id: '6M', name: 'Tahun 6 Mawar (6M)', grade: 6, teacherName: 'JACQUELINE BINTI JAUMIN', headPrefect: 'Ahmad Daniel bin Rosman', assistantPrefect: 'Chloe Chong Yi En' },
  { id: '6K', name: 'Tahun 6 Kenanga (6K)', grade: 6, teacherName: 'JAMUEL ROMIE', headPrefect: 'Karthik a/l Muniandy', assistantPrefect: 'Nurul Syuhada binti Ramli' },
  { id: '6B', name: 'Tahun 6 Melati (6B)', grade: 6, teacherName: 'JENNIFER LO YUNG TING', headPrefect: 'Megan Wong Hui Ting', assistantPrefect: 'Zackery bin Zulkarnain' },
];

export const INITIAL_CHECKLIST: DailyChecklistTask[] = [
  { id: 'c1', category: 'ketua', session: 'pagi', task: 'Memimpin bacaan doa pagi dan ikrar rukun negara bersama rakan sekelas', completed: false },
  { id: 'c2', category: 'ketua', session: 'pagi', task: 'Memeriksa kehadiran murid dan melaporkan murid tidak hadir kepada Guru Kelas', completed: false },
  { id: 'c3', category: 'ketua', session: 'pagi', task: 'Memastikan disiplin ketenteraman kelas terkawal sementara menunggu guru subjek masuk', completed: false },
  { id: 'c4', category: 'ketua', session: 'rehat', task: 'Memastikan keselamatan murid dan tiada murid tertinggal di dalam kelas semasa rehat', completed: false },
  { id: 'c5', category: 'ketua', session: 'rehat', task: 'Melaporkan sebarang salah laku disiplin atau kecemasan kepada Guru Bertugas', completed: false },
  { id: 'c6', category: 'ketua', session: 'balik', task: 'Memimpin bacaan doa penutup dan memastikan barisan murid teratur sewaktu balik', completed: false },
  { id: 'p1', category: 'penolong', session: 'pagi', task: 'Memastikan papan putih bersih dan pen marker / pemadam lengkap tersedia', completed: false },
  { id: 'p2', category: 'penolong', session: 'pagi', task: 'Membantu guru membawa buku rujukan atau alat bantuan mengajar ke kelas', completed: false },
  { id: 'p3', category: 'penolong', session: 'rehat', task: 'Memastikan suis lampu, kipas, dan penghawa dingin ditutup (penjimatan tenaga)', completed: false },
  { id: 'p4', category: 'penolong', session: 'rehat', task: 'Menyemak kebersihan fizikal kelas dan bakul sampah dikosongkan', completed: false },
  { id: 'p5', category: 'penolong', session: 'balik', task: 'Memastikan kerusi dianjak rapat ke meja dan tingkap kelas dikunci rapi', completed: false },
];

export const INITIAL_SETTINGS: SystemSettings = {
  votingOpen: true,
  announcement: 'Selamat datang ke Sistem Pengurusan Pemimpin Murid Sesi 2026. Sila semak senarai kelas 1M hingga 6B.',
  schoolName: 'SK / SJKC Pilihan Malaysia',
};
