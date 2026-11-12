import { ClassLeaderData, DailyChecklistTask, SystemSettings, TeacherRecord } from '../types';

export const INITIAL_CLASSES_2026: ClassLeaderData[] = [
  {
    "id": "1M",
    "name": "TAHUN 1 MERAH (1M)",
    "grade": 1,
    "teacherName": "FANNY YONG SIAU FUI",
    "headPrefect": "CHEVINIYA HILARY",
    "assistantPrefect": "CLARA BELLA IZWAN ZIKRY BINTI ABDULLAH"
  },
  {
    "id": "1K",
    "name": "Tahun 1 Kuning (1K)",
    "grade": 1,
    "teacherName": "CHIA MEE HIE",
    "headPrefect": "GENEVIE JANUARIUS",
    "assistantPrefect": "ADELYNE GOH"
  },
  {
    "id": "1B",
    "name": "Tahun 1 Biru (1B)",
    "grade": 1,
    "teacherName": "JENNIFER LO YUNG TING",
    "headPrefect": "HAYSLEY NICOLE LIM",
    "assistantPrefect": "LIM SU XUAN"
  },
  {
    "id": "2M",
    "name": "Tahun 2 Merah (2M)",
    "grade": 2,
    "teacherName": "JAMUEL ROMIE",
    "headPrefect": "WONG WEN XUAN BRITTANY",
    "assistantPrefect": "EARL WAYNN JR.ERWIN"
  },
  {
    "id": "2K",
    "name": "Tahun 2 Kuning (2K)",
    "grade": 2,
    "teacherName": "DELAN BIN SOHOI",
    "headPrefect": "NOAH HANSSON CHOO",
    "assistantPrefect": "DELISHA BINTI MOHAMAD SHARULNIZAM"
  },
  {
    "id": "2B",
    "name": "Tahun 2 Biru (2B)",
    "grade": 2,
    "teacherName": "JOYCE NGU SU FEI",
    "headPrefect": "LUCINTA LEE WEI",
    "assistantPrefect": "CARLVEN ELVERICK HO KAY REN"
  },
  {
    "id": "3M",
    "name": "Tahun 3 Merah (3M)",
    "grade": 3,
    "teacherName": "JACQUELINE BINTI JAUMIN",
    "headPrefect": "NGUI MEI RU",
    "assistantPrefect": "CHRISHAWN CHESTER CYPRIAN"
  },
  {
    "id": "3K",
    "name": "Tahun 3 Kuning (3K)",
    "grade": 3,
    "teacherName": "CHOW MUI LEN",
    "headPrefect": "JASMEN LIM QIAO YING",
    "assistantPrefect": "VICTORIA BELLE MOO"
  },
  {
    "id": "3B",
    "name": "Tahun 3 Biru (3B)",
    "grade": 3,
    "teacherName": "TAN FUI TING @ JESSICA TAN",
    "headPrefect": "CHLOE CHRIST FAITH",
    "assistantPrefect": "SCOTT TAN LI WEI"
  },
  {
    "id": "4M",
    "name": "Tahun 4 Merah (4M)",
    "grade": 4,
    "teacherName": "MASNIKA MASDIN",
    "headPrefect": "ALDENIE MABBLE JUNAIDDI",
    "assistantPrefect": "FINNYLLA VONA VIANNA ZAFFIN"
  },
  {
    "id": "4K",
    "name": "Tahun 4 Kuning (4K)",
    "grade": 4,
    "teacherName": "FIONA EXNA JULIUS",
    "headPrefect": "IAN THOR HILARY",
    "assistantPrefect": "SITI SOLIHATUN NABILA BINTI MOHD ARIF"
  },
  {
    "id": "4B",
    "name": "Tahun 4 Biru (4B)",
    "grade": 4,
    "teacherName": "BRIAN BIN GINSOS @ CHARLY",
    "headPrefect": "MOHAMMAD FIRASH IZZUDDIN FATHI ARYEIZ BIN ZULHAFIDZE",
    "assistantPrefect": "ANGELA RYICA CHRISTOPHER"
  },
  {
    "id": "5M",
    "name": "Tahun 5 Merah (5M)",
    "grade": 5,
    "teacherName": "AMOS CHIN TZEUN HSIEN",
    "headPrefect": "NAFIZ HAQ ADDIN BIN ABDUL HAFIZ",
    "assistantPrefect": "ALEXANDRA EMERY SAMUEL"
  },
  {
    "id": "5K",
    "name": "Tahun 5 Kuning (5K)",
    "grade": 5,
    "teacherName": "BENNY BIN RAIJUN",
    "headPrefect": "FICA BARTHEZCYA BINTI BURNET",
    "assistantPrefect": "NUR ALYSSA DYANA BINTI ABDULLAH @ LIN"
  },
  {
    "id": "5B",
    "name": "Tahun 5 Biru (5B)",
    "grade": 5,
    "teacherName": "FENNY CHIN MUI MUI",
    "headPrefect": "MOHAMMAD AAWAIZ RUWAYFIE BIN DATU ABDUL HAFIZ",
    "assistantPrefect": "SAMMY CHONG JIA HSING"
  },
  {
    "id": "6M",
    "name": "Tahun 6 Merah (6M)",
    "grade": 6,
    "teacherName": "FEDORA HSU JIN WEN",
    "headPrefect": "NUR ASHMIA RAMADHANI BINTI AZNAN",
    "assistantPrefect": "MOHAMMAD DANISH RIFQI BIN MOHAMMAD AZIZI"
  },
  {
    "id": "6K",
    "name": "Tahun 6 Kuning (6K)",
    "grade": 6,
    "teacherName": "NIAM YEN LEE",
    "headPrefect": "NATHAN NOEL RONALD",
    "assistantPrefect": "JAYFFERSON MELVIN WONG"
  },
  {
    "id": "6B",
    "name": "Tahun 6 Biru (6B)",
    "grade": 6,
    "teacherName": "NOOR ASHIKIN BINTI ABD. RAHMAN",
    "headPrefect": "AMOS GUI YUN SIANG",
    "assistantPrefect": "LACEY REVERA LAWAD"
  }
];

export const INITIAL_TEACHER_RECORDS: TeacherRecord[] = [
  {
    "name": "ALVECARLOS KASSIM @ LANTANG",
    "ic": "990708125745"
  },
  {
    "name": "AMOS CHIN TZEUN HSIEN",
    "ic": "000305120303"
  },
  {
    "name": "BRIAN BIN GINSOS @ CHARLY",
    "ic": "931204125637"
  },
  {
    "name": "CHIA MEE HIE",
    "ic": "010530130734"
  },
  {
    "name": "CHIN NYOK YEN @ EVOLYN",
    "ic": "801106125080"
  },
  {
    "name": "CHOW MUI LEN",
    "ic": "790701125922"
  },
  {
    "name": "DELAN BIN SOHOI",
    "ic": "710908125521"
  },
  {
    "name": "DORIN GINTURUN",
    "ic": "791221125178"
  },
  {
    "name": "EILY GRACESEE DONALD",
    "ic": "890911125809"
  },
  {
    "name": "EUDORA PRISCILLA",
    "ic": "890901125220"
  },
  {
    "name": "FANNY YONG SIAU FUI",
    "ic": "880905125472"
  },
  {
    "name": "FEDORA HSU JIN WEN",
    "ic": "910704125446"
  },
  {
    "name": "FENNY CHIN MUI MUI",
    "ic": "950803125384"
  },
  {
    "name": "FIONA EXNA JULIUS",
    "ic": "020915121096"
  },
  {
    "name": "IZATUL NEZIAH BINTI JERAL",
    "ic": "890112126036"
  },
  {
    "name": "JACKRYSON AHYIT",
    "ic": "930324125741"
  },
  {
    "name": "JACKSON KULU",
    "ic": "820208125325"
  },
  {
    "name": "JACQUELINE BINTI JAUMIN",
    "ic": "930501126068"
  },
  {
    "name": "JAMUEL ROMIE",
    "ic": "020610120017"
  },
  {
    "name": "JENNIFER LO YUNG TING",
    "ic": "020826120358"
  },
  {
    "name": "JOYCE NGU SU FEI",
    "ic": "900824136466"
  },
  {
    "name": "LAMDIN BIN JAMAN",
    "ic": "661110125727"
  },
  {
    "name": "LIM CHEN CHING",
    "ic": "921012126302"
  },
  {
    "name": "MASLIJAH HJ ABU BAKAR",
    "ic": "730812125314"
  },
  {
    "name": "MASNIKA MASDIN",
    "ic": "930823126642"
  },
  {
    "name": "MELLSIELLE EDORALINA LOUNA",
    "ic": "910602125592"
  },
  {
    "name": "MOHAMMAD KHAIRUDDIN RAMLEE",
    "ic": "920602126615"
  },
  {
    "name": "MUNAH BT. OSMAN",
    "ic": "790515125216"
  },
  {
    "name": "NIAM YEN LEE",
    "ic": "980303126062"
  },
  {
    "name": "NOOR ASHIKIN BINTI ABD. RAHMAN",
    "ic": "920603126684"
  },
  {
    "name": "OH HUI KAI",
    "ic": "910406125157"
  },
  {
    "name": "PATRICK TENG JING WEI",
    "ic": "910930136231"
  },
  {
    "name": "ROSNI BINTI BEDIN",
    "ic": "770728125414"
  },
  {
    "name": "RUMIZAH BINTI MOHD HARRIS",
    "ic": "890225125152"
  },
  {
    "name": "TAN FUI TING @ JESSICA TAN",
    "ic": "780121125476"
  },
  {
    "name": "TAN MUNG PING",
    "ic": "781122125616"
  },
  {
    "name": "TAN SIEW NAH",
    "ic": "680321125202"
  },
  {
    "name": "VICTORY BIN MIASIN",
    "ic": "831008125391"
  },
  {
    "name": "YONG FUI HAN",
    "ic": "870630496100"
  },
  {
    "name": "BENNY BIN RAIJUN",
    "ic": "920129126125"
  },
  {
    "name": "ANSON TONG CHENG XUN",
    "ic": "020803130385"
  },
  {
    "name": "BESS LING HIE YING",
    "ic": "030516130074"
  }
];

export const INITIAL_VOTES: VoteRecord[] = [
  {
    "year": 2026,
    "voterId": "781122125616",
    "voterName": "TAN MUNG PING",
    "category": "ketua_tahap2",
    "candidateName": "AMOS GUI YUN SIANG",
    "classId": "6B",
    "id": "oz0btcd",
    "timestamp": "2026-11-12T01:00:13.303Z"
  },
  {
    "year": 2026,
    "voterId": "781122125616",
    "voterName": "TAN MUNG PING",
    "category": "ketua_tahap1",
    "candidateName": "CHEVINIYA HILARY",
    "classId": "1M",
    "id": "x4s70y7",
    "timestamp": "2026-11-12T00:59:59.424Z"
  }
];

export const INITIAL_CHECKLIST: DailyChecklistTask[] = [
  {
    "id": "c1",
    "category": "ketua",
    "session": "pagi",
    "task": "Memimpin bacaan doa pagi dan ikrar rukun negara bersama rakan sekelas",
    "completed": false
  },
  {
    "id": "c2",
    "category": "ketua",
    "session": "pagi",
    "task": "Memeriksa kehadiran murid dan melaporkan murid tidak hadir kepada Guru Kelas",
    "completed": false
  },
  {
    "id": "c3",
    "category": "ketua",
    "session": "pagi",
    "task": "Memastikan disiplin ketenteraman kelas terkawal sementara menunggu guru subjek masuk",
    "completed": false
  },
  {
    "id": "c4",
    "category": "ketua",
    "session": "rehat",
    "task": "Memastikan keselamatan murid dan tiada murid tertinggal di dalam kelas semasa rehat",
    "completed": false
  },
  {
    "id": "c5",
    "category": "ketua",
    "session": "rehat",
    "task": "Melaporkan sebarang salah laku disiplin atau kecemasan kepada Guru Bertugas",
    "completed": false
  },
  {
    "id": "c6",
    "category": "ketua",
    "session": "balik",
    "task": "Memimpin bacaan doa penutup dan memastikan barisan murid teratur sewaktu balik",
    "completed": false
  },
  {
    "id": "p1",
    "category": "penolong",
    "session": "pagi",
    "task": "Memastikan papan putih bersih dan pen marker / pemadam lengkap tersedia",
    "completed": false
  },
  {
    "id": "p2",
    "category": "penolong",
    "session": "pagi",
    "task": "Membantu guru membawa buku rujukan atau alat bantuan mengajar ke kelas",
    "completed": false
  },
  {
    "id": "p3",
    "category": "penolong",
    "session": "rehat",
    "task": "Memastikan suis lampu, kipas, dan penghawa dingin ditutup (penjimatan tenaga)",
    "completed": false
  },
  {
    "id": "p4",
    "category": "penolong",
    "session": "rehat",
    "task": "Menyemak kebersihan fizikal kelas dan bakul sampah dikosongkan",
    "completed": false
  },
  {
    "id": "p5",
    "category": "penolong",
    "session": "balik",
    "task": "Memastikan kerusi dianjak rapat ke meja dan tingkap kelas dikunci rapi",
    "completed": false
  }
];


export const INITIAL_SETTINGS: SystemSettings = {
  votingOpen: true,
  announcement: 'Selamat datang ke Sistem Pengurusan Pemimpin Murid Sesi 2026. Sila semak senarai kelas 1M hingga 6B (Merah, Kuning, Biru).',
  schoolName: 'SJK (C) CHUNG HWA KOTA BELUD',
};
