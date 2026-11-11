import { ClassLeaderData, DailyChecklistTask, SystemSettings, TeacherRecord } from '../types';

export const INITIAL_TEACHER_RECORDS: TeacherRecord[] = [
  { name: 'ALVECARLOS KASSIM @ LANTANG', ic: '850112125101' },
  { name: 'AMOS CHIN TZEUN HSIEN', ic: '860320125202' },
  { name: 'BRIAN BIN GINSOS @ CHARLY', ic: '870415125303' },
  { name: 'CHIA MEE HIE', ic: '880215125544' },
  { name: 'CHIN NYOK YEN @ EVOLYN', ic: '850523125405' },
  { name: 'CHOW MUI LEN', ic: '860614125506' },
  { name: 'DELAN BIN SOHOI', ic: '870719125607' },
  { name: 'DORIN GINTURUN', ic: '880822125708' },
  { name: 'EILY GRACESEE DONALD', ic: '890911125809' },
  { name: 'EUDORA PRISCILLA', ic: '900105125910' },
  { name: 'FANNY YONG SIAU FUI', ic: '860218126011' },
  { name: 'FEDORA HSU JIN WEN', ic: '870329126112' },
  { name: 'FENNY CHIN MUI MUI', ic: '880416126213' },
  { name: 'FIONA EXNA JULIUS', ic: '890525126314' },
  { name: 'IZATUL NEZIAH BINTI JERAL', ic: '900608126415' },
  { name: 'JACKRYSON AHYIT', ic: '870712126516' },
  { name: 'JACKSON KULU', ic: '880803126617' },
  { name: 'JACQUELINE BINTI JAUMIN', ic: '890924126718' },
  { name: 'JAMUEL ROMIE', ic: '901017126819' },
  { name: 'JENNIFER LO YUNG TING', ic: '861121126920' },
  { name: 'JOYCE NGU SU FEI', ic: '871204127021' },
  { name: 'LAMDIN BIN JAMAN', ic: '850119127122' },
  { name: 'LIM CHEN CHING', ic: '860228127223' },
  { name: 'MASLIJAH HJ ABU BAKAR', ic: '870315127324' },
  { name: 'MASNIKA MASDIN', ic: '880409127425' },
  { name: 'MELLSIELLE EDORALINA LOUNA', ic: '890518127526' },
  { name: 'MOHAMMAD KHAIRUDDIN RAMLEE', ic: '900627127627' },
  { name: 'MUNAH BT. OSMAN', ic: '850703127728' },
  { name: 'NIAM YEN LEE', ic: '860816127829' },
  { name: 'NOOR ASHIKIN BIN TI ABD. RAHMAN', ic: '870929127930' },
  { name: 'OH HUI KAI', ic: '881014128031' },
  { name: 'PATRICK TENG JING WEI', ic: '891102128132' },
  { name: 'ROSNI BINTI BEDIN', ic: '901225128233' },
  { name: 'RUMIZAH BINTI MOHD HARRIS', ic: '850108128334' },
  { name: 'TAN FUI TING @ JESSICA TAN', ic: '860214128435' },
  { name: 'TAN MUNG PING', ic: '870305128536' },
  { name: 'TAN SIEW NAH', ic: '880419128637' },
  { name: 'VICTORY BIN MIASIN', ic: '890507128738' },
  { name: 'YONG FUI HAN', ic: '900612128839' },
  { name: 'BENNY BIN RAIJUN', ic: '850720128940' },
  { name: 'ANSON TONG CHENG XUN', ic: '860831129041' },
  { name: 'BESS LING HIE YING', ic: '870918129142' },
];

export const TEACHER_LIST: string[] = INITIAL_TEACHER_RECORDS.map((t) => t.name);

export const INITIAL_CLASSES_2026: ClassLeaderData[] = [
  { id: '1M', name: 'Tahun 1 Merah (1M)', grade: 1, teacherName: 'NOOR ASHIKIN BIN TI ABD. RAHMAN', headPrefect: 'Aiman bin Zulkifli', assistantPrefect: 'Tan Mei Ling' },
  { id: '1K', name: 'Tahun 1 Kuning (1K)', grade: 1, teacherName: 'CHIA MEE HIE', headPrefect: 'Muhammad Farhan', assistantPrefect: 'Siti Aishah binti Omar' },
  { id: '1B', name: 'Tahun 1 Biru (1B)', grade: 1, teacherName: 'CHOW MUI LEN', headPrefect: 'Kavitha a/p Ramesh', assistantPrefect: 'Haikal Hakim' },

  { id: '2M', name: 'Tahun 2 Merah (2M)', grade: 2, teacherName: 'DELAN BIN SOHOI', headPrefect: 'Lucas Lee Jian Hao', assistantPrefect: 'Nurul Huda binti Rosli' },
  { id: '2K', name: 'Tahun 2 Kuning (2K)', grade: 2, teacherName: 'DORIN GINTURUN', headPrefect: 'Amirul Hakim', assistantPrefect: 'Chloe Lim Xin Yi' },
  { id: '2B', name: 'Tahun 2 Biru (2B)', grade: 2, teacherName: 'EILY GRACESEE DONALD', headPrefect: 'Priya a/p Selvam', assistantPrefect: 'Daniel bin Zaid' },

  { id: '3M', name: 'Tahun 3 Merah (3M)', grade: 3, teacherName: 'BENNY BIN RAIJUN', headPrefect: 'Muhammad Aqil', assistantPrefect: 'Ng Jia Hui' },
  { id: '3K', name: 'Tahun 3 Kuning (3K)', grade: 3, teacherName: 'EUDORA PRISCILLA', headPrefect: 'Sivakumar a/l Nathan', assistantPrefect: 'Nur Fatihah' },
  { id: '3B', name: 'Tahun 3 Biru (3B)', grade: 3, teacherName: 'FANNY YONG SIAU FUI', headPrefect: 'Brandon Koh Wei Kit', assistantPrefect: 'Aina Sofea' },

  { id: '4M', name: 'Tahun 4 Merah (4M)', grade: 4, teacherName: 'FEDORA HSU JIN WEN', headPrefect: 'Darren Lim Wei Ming', assistantPrefect: 'Nurul Ain binti Jamil' },
  { id: '4K', name: 'Tahun 4 Kuning (4K)', grade: 4, teacherName: 'FENNY CHIN MUI MUI', headPrefect: 'Hariz Zikri', assistantPrefect: 'Jessica Tan Hui Wen' },
  { id: '4B', name: 'Tahun 4 Biru (4B)', grade: 4, teacherName: 'FIONA EXNA JULIUS', headPrefect: 'Dhivya a/p Kumar', assistantPrefect: 'Luqman Hakim' },

  { id: '5M', name: 'Tahun 5 Merah (5M)', grade: 5, teacherName: 'IZATUL NEZIAH BINTI JERAL', headPrefect: 'Ryan Teo Ming Xuan', assistantPrefect: 'Puteri Nur Aisyah' },
  { id: '5K', name: 'Tahun 5 Kuning (5K)', grade: 5, teacherName: 'JACKRYSON AHYIT', headPrefect: 'Vimal a/l Perumal', assistantPrefect: 'Nurul Izzah' },
  { id: '5B', name: 'Tahun 5 Biru (5B)', grade: 5, teacherName: 'JACKSON KULU', headPrefect: 'Marcus Lee Jun Wei', assistantPrefect: 'Siti Zulaikha' },

  { id: '6M', name: 'Tahun 6 Merah (6M)', grade: 6, teacherName: 'JACQUELINE BINTI JAUMIN', headPrefect: 'Ahmad Daniel bin Rosman', assistantPrefect: 'Chloe Chong Yi En' },
  { id: '6K', name: 'Tahun 6 Kuning (6K)', grade: 6, teacherName: 'JAMUEL ROMIE', headPrefect: 'Karthik a/l Muniandy', assistantPrefect: 'Nurul Syuhada binti Ramli' },
  { id: '6B', name: 'Tahun 6 Biru (6B)', grade: 6, teacherName: 'JENNIFER LO YUNG TING', headPrefect: 'Megan Wong Hui Ting', assistantPrefect: 'Zackery bin Zulkarnain' },
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
  announcement: 'Selamat datang ke Sistem Pengurusan Pemimpin Murid Sesi 2026. Sila semak senarai kelas 1M hingga 6B (Merah, Kuning, Biru).',
  schoolName: 'SJK (C) CHUNG HWA KOTA BELUD',
};
