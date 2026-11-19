'use client';

import { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle,
  Code2,
  Brain,
  Shield,
  Layers,
  Sparkles,
  Gamepad2,
  Database,
  Lock,
  Cpu,
  ArrowRight,
  Copy,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';

export interface Playbook {
  id: string;
  bookNumber: string;
  title: string;
  subtitle: string;
  originalWork: string;
  author: string;
  icon: LucideIcon;
  category: 'ai' | 'data' | 'security' | 'systems' | 'testing' | 'game';
  roles: string[];
  keyTopics: string[];
  corePrinciples: string[];
  sampleCodeOrFormula: string;
  docPath: string;
}

export const PLAYBOOKS_DATA: Playbook[] = [
  {
    id: 'agentic-ai',
    bookNumber: 'Cẩm nang 01',
    title: 'Trí tuệ Nhân tạo Tự hành (Agentic AI)',
    subtitle: 'Vòng lặp suy luận & hành động, Giao thức kết nối công cụ (MCP), Bộ nhớ phân tầng & Kiểm định tự động',
    originalWork: 'Agentic AI: Complete Guide to Autonomous Systems',
    author: 'Nhóm Nghiên cứu Kỹ thuật AI',
    icon: Brain,
    category: 'ai',
    roles: ['ai-engineer'],
    keyTopics: ['Vòng lặp ReAct (Suy luận + Hành động)', 'Giao thức kết nối công cụ MCP', 'Bộ nhớ phân tầng (Ngắn hạn, Sự kiện, Ngữ nghĩa)', 'Rào chắn an toàn & Tránh lặp vô hạn', 'Đánh giá chất lượng tự động (Evals)'],
    corePrinciples: [
      'Tách biệt bước lập luận (Reasoning) khỏi bước gọi công cụ thực thi (Action)',
      'Chuẩn hóa giao thức kết nối công cụ mở rộng qua MCP Client/Server',
      'Đo lường độ tin cậy bằng bộ dữ liệu kiểm thử chuẩn (Golden Datasets)',
    ],
    sampleCodeOrFormula: `# Vòng lặp suy luận & hành động chuẩn hóa
def react_step(user_query, context):
    thought = llm.think(user_query, context)
    action, action_input = parse_action(thought)
    observation = tool_registry.execute(action, action_input)
    return synthesize_final(thought, observation)`,
    docPath: 'docs/playbooks/01_agentic_ai_playbook.md',
  },
  {
    id: 'data-visualizations',
    bookNumber: 'Cẩm nang 02',
    title: 'Trực quan hóa Dữ liệu Thực chiến',
    subtitle: 'Phân tích bảng dữ liệu Pandas, Đa chỉ mục & Hơn 8 dạng biểu đồ Matplotlib chuyên sâu',
    originalWork: 'Data Visualizations with Python',
    author: 'Nhóm Chuyên gia Khoa học Dữ liệu',
    icon: Layers,
    category: 'data',
    roles: ['data-scientist'],
    keyTopics: ['Bảng đa chỉ mục & Biến đổi dữ liệu Pandas', 'Chuỗi thời gian & Trung bình trượt', 'Biểu đồ nhiệt, Hộp phân vị & Phân phối', 'Tối ưu bảng màu thân thiện người đọc', 'Xuất biểu đồ độ phân giải cao cho báo cáo'],
    corePrinciples: [
      'Tiết kiệm bộ nhớ bằng kiểu dữ liệu phân nhóm (category)',
      'Tối ưu tỷ lệ thông tin trên chi tiết hiển thị, loại bỏ thành phần rườm rà',
      'Xử lý giá trị bị khuyết (NaN) có chủ đích thay vì xóa bỏ hàng loạt',
    ],
    sampleCodeOrFormula: `import pandas as pd
import matplotlib.pyplot as plt

df['rolling_avg'] = df['revenue'].rolling(window=7, min_periods=1).mean()
fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
ax.plot(df.index, df['revenue'], alpha=0.3, label='Thực tế')
ax.plot(df.index, df['rolling_avg'], color='#2563eb', lw=2, label='Trung bình 7 ngày')`,
    docPath: 'docs/playbooks/02_data_visualizations_playbook.md',
  },
  {
    id: 'math-for-data-science',
    bookNumber: 'Cẩm nang 03',
    title: 'Toán học cho Khoa học Dữ liệu',
    subtitle: 'Giải tích vi phân, Xác suất Bayes, Đại số tuyến tính & Xây dựng mạng nơ-ron từ đầu',
    originalWork: 'Mathematics for Data Science and Machine Learning',
    author: 'Hội đồng Toán Ứng dụng',
    icon: Sparkles,
    category: 'data',
    roles: ['ai-engineer', 'data-scientist'],
    keyTopics: ['Quy tắc chuỗi đạo hàm & Tối ưu hàm mục tiêu', 'Xác suất điều kiện Bayes & Thống kê suy luận', 'Phân rã ma trận giá trị kỳ dị (SVD) & Giảm chiều dữ liệu (PCA)', 'Hàm mất mát Cross-Entropy', 'Lan truyền ngược sai số (Backpropagation)'],
    corePrinciples: [
      'Hiểu bản chất đạo hàm riêng trong việc cập nhật trọng số theo độ dốc',
      'Hiểu đúng khoảng tin cậy và giá trị p-value khi kiểm định thử nghiệm A/B',
      'Nắm vững ý nghĩa hình học của phép chiếu không gian khi giảm chiều dữ liệu',
    ],
    sampleCodeOrFormula: `# Công thức cập nhật sai số lan truyền ngược
dZ2 = A2 - Y
dW2 = (1 / m) * np.dot(dZ2, A1.T)
db2 = (1 / m) * np.sum(dZ2, axis=1, keepdims=True)
dZ1 = np.dot(W2.T, dZ2) * relu_derivative(Z1)`,
    docPath: 'docs/playbooks/03_math_for_data_science_playbook.md',
  },
  {
    id: 'python-graphics',
    bookNumber: 'Cẩm nang 04',
    title: 'Đồ họa Python 2D/3D & Mô phỏng Khoa học',
    subtitle: 'Biến đổi hình học, Ma trận xoay 3D, Chiếu phối cảnh & Mô phỏng ánh sáng bề mặt',
    originalWork: 'Python Graphics: 2D & 3D Scientific Computing',
    author: 'Phòng Nghiên cứu Đồ họa Tính toán',
    icon: Code2,
    category: 'game',
    roles: ['game-dev'],
    keyTopics: ['Tọa độ mở rộng cho phép xoay và dịch chuyển 3D', 'Ma trận phép chiếu phối cảnh (Perspective)', 'Mô hình ánh sáng phản xạ bề mặt', 'Mô phỏng hệ hạt vật lý & Khí hậu', 'Tối ưu tính toán hàng loạt bằng NumPy'],
    corePrinciples: [
      'Tách biệt hệ tọa độ thế giới (World Space) khỏi hệ tọa độ góc nhìn camera',
      'Sử dụng phép xoay hợp lý để tránh hiện tượng kẹt trục xoay 3D',
      'Tính toán đồng loạt trên mảng để đạt 60 khung hình/giây trên Python',
    ],
    sampleCodeOrFormula: `# Ma trận biến đổi kết hợp tỷ lệ, xoay và dịch chuyển 3D
T = np.array([
    [scale_x * cos(th), -sin(th), 0, tx],
    [sin(th), scale_y * cos(th), 0, ty],
    [0, 0, scale_z, tz],
    [0, 0, 0, 1]
])`,
    docPath: 'docs/playbooks/04_python_graphics_playbook.md',
  },
  {
    id: 'unity-game-dev',
    bookNumber: 'Cẩm nang 05',
    title: 'Kiến trúc Phát triển Game Unity',
    subtitle: 'Vòng đời thành phần, Vật lý va chạm, Trí tuệ nhân tạo trạng thái & Tối ưu bộ nhớ',
    originalWork: 'Unity Game Development (4th Edition)',
    author: 'Borromeo & Gomila',
    icon: Gamepad2,
    category: 'game',
    roles: ['game-dev'],
    keyTopics: ['Vòng đời hàm Unity (Awake, Start, FixedUpdate)', 'Máy trạng thái hữu hạn cho hành vi nhân vật', 'Chiếu tia vật lý 3D & Phân lớp va chạm', 'Tái sử dụng đối tượng chống giật khung hình', 'Kiến trúc hướng dữ liệu hiệu năng cao'],
    corePrinciples: [
      'Không gọi hàm tìm kiếm thành phần nặng bên trong vòng lặp Update() mỗi khung hình',
      'Xử lý vật lý va chạm bên trong FixedUpdate để đảm bảo tính ổn định',
      'Tái sử dụng đối tượng (Object Pooling) để tránh giật khung hình khi dọn bộ nhớ',
    ],
    sampleCodeOrFormula: `public class EnemyAI : MonoBehaviour {
    private enum State { Patrol, Chase, Attack }
    private State currentState;
    
    void Update() {
        switch(currentState) {
            case State.Patrol: HandlePatrol(); break;
            case State.Chase:  HandleChase();  break;
        }
    }
}`,
    docPath: 'docs/playbooks/05_unity_game_dev_playbook.md',
  },
  {
    id: 'agile-testing',
    bookNumber: 'Cẩm nang 06',
    title: 'Nghệ thuật Kiểm thử Agile',
    subtitle: '4 nhóm mục tiêu kiểm thử Q1-Q4, Đo lường chất lượng theo rủi ro, Kịch bản BDD & Kiểm thử khám phá',
    originalWork: 'The Art of Agile Testing (2024)',
    author: 'Hội đồng Kỹ thuật Kiểm thử Phần mềm',
    icon: CheckCircle,
    category: 'testing',
    roles: ['agile-qa'],
    keyTopics: ['4 nhóm kiểm thử Agile Q1-Q4', 'Đo lường độ bao phủ kiểm thử & mật độ lỗi theo trọng số', 'Kịch bản kiểm thử hành vi (Điều kiện - Hành động - Kết quả / Given-When-Then)', 'Quản lý phiên kiểm thử khám phá có giới hạn thời gian', 'Kiểm thử hệ thống giao dịch tài chính'],
    corePrinciples: [
      'Chất lượng là trách nhiệm chung của cả nhóm, không chỉ ở bước kiểm tra cuối cùng',
      'Định lượng mức độ rủi ro bằng trọng số nghiêm trọng của từng lỗi',
      'Tổ chức kiểm thử khám phá có cấu trúc rõ mục tiêu và khung thời gian cụ thể',
    ],
    sampleCodeOrFormula: `# Kịch bản kiểm thử hành vi (BDD Gherkin)
Scenario: Giao dịch khớp lệnh trong giới hạn trượt giá
  Given Khách hàng có số dư khả dụng 50.000 USD
  When Khách hàng gửi lệnh mua 1.5 BTC với giá thị trường 65.000 USD
  And Biên độ trượt giá tối đa cho phép là 0.2%
  Then Hệ thống khớp lệnh thành công với giá không vượt quá 65.130 USD`,
    docPath: 'docs/playbooks/06_agile_testing_playbook.md',
  },
  {
    id: 'secure-coding',
    bookNumber: 'Cẩm nang 07',
    title: 'Lập trình An toàn (Alice và Bob)',
    subtitle: 'Bảo mật dữ liệu, Nguyên tắc quyền tối thiểu, Phòng chống 10 lỗ hổng phổ biến & Mô hình hóa mối đe dọa',
    originalWork: 'Alice and Bob Learn Secure Coding (2025)',
    author: 'Tanya Janca',
    icon: Lock,
    category: 'security',
    roles: ['ai-engineer', 'backend', 'devops', 'agile-qa'],
    keyTopics: ['Phân tích mối đe dọa theo 6 nhóm rủi ro (mô hình STRIDE)', 'Phòng chống chèn mã SQL, chèn mã độc trình duyệt (XSS) và giả mạo yêu cầu', 'Nguyên tắc cấp quyền tối thiểu cần thiết', 'Bảo mật thư viện phụ thuộc (Supply Chain)', 'Quản lý khóa API và biến môi trường bí mật'],
    corePrinciples: [
      'Không bao giờ tin tưởng dữ liệu đầu vào từ người dùng — luôn kiểm tra và làm sạch',
      'Phòng ngự nhiều lớp trên mọi tầng kiến trúc từ giao diện đến cơ sở dữ liệu',
      'Tích hợp kiểm tra lỗ hổng bảo mật tự động ngay trong quy trình phát triển',
    ],
    sampleCodeOrFormula: `// Truy vấn tham số hóa giúp triệt tiêu lỗ hổng chèn mã SQL
const query = 'SELECT id, email, role FROM users WHERE id = $1 AND active = $2';
const result = await db.query(query, [userId, true]);

// Bật các tiêu đề bảo mật HTTP tiêu chuẩn
app.use(helmet({ contentSecurityPolicy: true, hsts: true }));`,
    docPath: 'docs/playbooks/07_alice_bob_secure_coding_playbook.md',
  },
  {
    id: 'sql-multidb',
    bookNumber: 'Cẩm nang 08',
    title: 'Cơ sở Dữ liệu SQL Đa Hệ quản trị',
    subtitle: 'Chuẩn hóa dữ liệu 3NF, Hàm cửa sổ phân tích, Chỉ mục B-Tree & Giao dịch an toàn',
    originalWork: 'Databases in SQL, MySQL, MS SQL & PostgreSQL',
    author: 'Nhóm Kỹ sư Cơ sở Dữ liệu',
    icon: Database,
    category: 'data',
    roles: ['data-scientist', 'backend', 'agile-qa'],
    keyTopics: ['Chuẩn hóa cấu trúc bảng từ 1NF đến 3NF', 'Hàm cửa sổ phân tích (ROW_NUMBER, LAG, LEAD)', 'Thiết kế chỉ mục B-Tree và chỉ mục bao phủ', 'Các mức độ cô lập giao dịch dữ liệu (ACID)', 'Xử lý xung đột khóa & Đọc kế hoạch chạy EXPLAIN'],
    corePrinciples: [
      'Thiết lập khóa ngoại và ràng buộc toàn vẹn ngay từ tầng cơ sở dữ liệu',
      'Tối ưu chỉ mục để truy vấn đọc trực tiếp từ chỉ mục, hạn chế đọc toàn bộ bảng',
      'Giữ giao dịch cập nhật dữ liệu ngắn gọn để tránh nghẽn và xung đột khóa',
    ],
    sampleCodeOrFormula: `SELECT 
    customer_id, order_date, order_amount,
    LAG(order_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date) as prev_amount,
    order_amount - LAG(order_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date) as delta_spending
FROM orders;`,
    docPath: 'docs/playbooks/08_sql_multidb_database_playbook.md',
  },
  {
    id: 'c-programming',
    bookNumber: 'Cẩm nang 09',
    title: 'Lập trình C & Kiến trúc Bộ nhớ Hệ thống',
    subtitle: 'Vùng nhớ Stack và Heap, Con trỏ, Cấp phát bộ nhớ động & Cấu trúc tệp thực thi',
    originalWork: 'C Programming for Beginners & Systems Architecture',
    author: 'Mike McGrath',
    icon: Cpu,
    category: 'systems',
    roles: ['backend', 'devops', 'game-dev'],
    keyTopics: ['Quy trình biên dịch từ mã nguồn ra tệp chạy', 'Bố cục vùng nhớ tiến trình (Stack, Heap, Code, Data)', 'Thao tác con trỏ bộ nhớ và con trỏ hàm', 'Quản lý cấp phát động và phát hiện rò rỉ bộ nhớ', 'Căn chỉnh bộ nhớ trong cấu trúc dữ liệu (Struct)'],
    corePrinciples: [
      'Mọi vùng nhớ cấp phát qua malloc() đều phải được giải phóng bằng free() đúng lúc',
      'Kiểm tra chặt kích thước bộ đệm để tránh lỗi tràn bộ nhớ nguy hiểm',
      'Tổ chức dữ liệu liên tiếp trong bộ nhớ để tận dụng tối đa bộ nhớ đệm CPU',
    ],
    sampleCodeOrFormula: `typedef struct {
    int id;
    char name[32];
    double score;
} Student;

Student *s = (Student *)malloc(sizeof(Student));
if (!s) { perror("Malloc failed"); exit(1); }
s->id = 101;
free(s);
s = NULL; // Tránh con trỏ trỏ tới vùng nhớ đã giải phóng`,
    docPath: 'docs/playbooks/09_c_programming_playbook.md',
  },
  {
    id: 'selinux-admin',
    bookNumber: 'Cẩm nang 10',
    title: 'Quản trị Bảo mật Hệ thống Linux (SELinux)',
    subtitle: 'Kiểm soát truy cập bắt buộc, Cô lập ứng dụng (Container) & Phân tích nhật ký từ chối',
    originalWork: 'SELinux System Administration',
    author: 'Sven Vermeulen',
    icon: Shield,
    category: 'security',
    roles: ['devops'],
    keyTopics: ['Kiểm soát truy cập bắt buộc (bảo vệ chặt hơn quyền thông thường)', 'Cấu trúc nhãn bảo mật (người dùng : vai trò : kiểu : mức độ)', 'Quy tắc phân quyền theo kiểu tệp và chuyển dịch miền an toàn', 'Cách ly máy ảo & vùng chứa (Container) theo nhãn bảo mật', 'Điều tra nhật ký từ chối truy cập để tạo quy tắc cấp quyền tối thiểu'],
    corePrinciples: [
      'Ngay cả quyền quản trị cao nhất (Root) cũng bị giới hạn trong chính sách của SELinux',
      'Không tắt tính năng bảo vệ SELinux trên máy chủ vận hành thực tế',
      'Tạo quy tắc cấp quyền tối thiểu riêng cho từng dịch vụ nội bộ',
    ],
    sampleCodeOrFormula: `# Kiểm tra nhãn bảo mật tiến trình và tệp
ls -Z /var/www/html/
ps -eZ | grep nginx

# Tra cứu nhật ký từ chối truy cập gần đây và kiểm tra các mô-đun bảo mật đang bật
ausearch -m avc -ts recent
semodule -l | head -n 10`,
    docPath: 'docs/playbooks/10_selinux_admin_playbook.md',
  },
];

export function PlaybooksDirectory() {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [activePlaybook, setActivePlaybook] = useState<Playbook | null>(null);
  const [modalTab, setModalTab] = useState<'principles' | 'topics' | 'code'>('principles');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {
        document.body.removeChild(textarea);
        toast.error('Không thể sao chép mã nguồn.');
        return;
      }
      document.body.removeChild(textarea);
    }
    setCopiedId(id);
    toast.success('Đã sao chép mã nguồn/công thức!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const rolePathways = [
    { id: 'all', label: 'Tất cả 10 Cẩm nang' },
    { id: 'ai-engineer', label: '🤖 Kỹ sư AI & LLM' },
    { id: 'data-scientist', label: '📊 Khoa học Dữ liệu' },
    { id: 'backend', label: '💻 Lập trình Backend' },
    { id: 'devops', label: '🛡️ Vận hành & Bảo mật' },
    { id: 'agile-qa', label: '✅ Kiểm thử Phần mềm' },
    { id: 'game-dev', label: '🎮 Đồ họa & Game' },
  ];

  const filteredPlaybooks = useMemo(() => {
    return PLAYBOOKS_DATA.filter((p) => {
      const matchRole = selectedRole === 'all' || p.roles.includes(selectedRole);
      const q = search.toLowerCase();
      const matchSearch =
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.keyTopics.some((t) => t.toLowerCase().includes(q)) ||
        p.originalWork.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [selectedRole, search]);

  return (
    <div className="space-y-8">
      {/* Search and Role Pathways Filter */}
      <div className="card p-6 bg-bg-surface border-border space-y-4 shadow-2xs">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Tìm kiếm cẩm nang kỹ thuật"
            placeholder="Tìm theo chủ đề hoặc từ khóa kỹ thuật (vd: ReAct, Pandas, Bayes, Unity, Kiểm thử, SELinux, SQL, Con trỏ C)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg border border-border text-sm text-text placeholder-text-muted focus:border-accent focus:outline-hidden transition-colors"
          />
        </div>

        {/* Role Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {rolePathways.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={selectedRole === r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedRole === r.id
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-bg border border-border text-text-muted hover:text-text hover:border-accent/40'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Playbooks or Empty State */}
      {filteredPlaybooks.length === 0 ? (
        <div className="rounded-2xl border border-border bg-bg-surface p-12 text-center shadow-2xs">
          <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-bold text-text mb-2">Không tìm thấy cẩm nang phù hợp</h3>
          <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
            Không có cẩm nang nào khớp với từ khóa &ldquo;{search}&rdquo; trong vai trò đã chọn.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedRole('all');
            }}
            className="px-4 py-2 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-all shadow-2xs"
          >
            Xóa bộ lọc tìm kiếm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredPlaybooks.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="rounded-2xl p-6 bg-bg-surface border border-border hover:border-accent/50 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-card-hover"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent/10">
                          {p.bookNumber}
                        </span>
                        <h3 className="font-bold text-base sm:text-lg text-text mt-1 group-hover:text-accent transition-colors leading-snug">
                          {p.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-text-muted mb-3 leading-relaxed">
                    {p.subtitle}
                  </p>

                  <p className="text-[11px] text-text-muted font-mono mb-4">
                    📖 <strong>Nguyên tác:</strong> {p.originalWork} ({p.author})
                  </p>

                  {/* Key Topics Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.keyTopics.slice(0, 4).map((topic, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-bg border border-border text-text-muted">
                        {topic}
                      </span>
                    ))}
                    {p.keyTopics.length > 4 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-bg border border-border text-text-subtle">
                        +{p.keyTopics.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Code Preview Box with Copy Button */}
                  <div className="relative mb-4 group/code">
                    <pre className="p-3.5 rounded-xl bg-bg border border-border text-[11px] font-mono text-text overflow-x-auto whitespace-pre-wrap max-h-36 overflow-y-auto pr-10 leading-relaxed">
                      {p.sampleCodeOrFormula}
                    </pre>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(p.sampleCodeOrFormula, p.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-bg-surface/90 hover:bg-hover border border-border text-text-muted hover:text-text transition-all shadow-2xs"
                      title="Sao chép mã mẫu"
                      aria-label="Sao chép mã mẫu"
                    >
                      {copiedId === p.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs gap-2">
                  <span className="text-[11px] text-text-muted font-mono truncate max-w-[180px] sm:max-w-[240px]" title={p.docPath}>
                    📄 {p.docPath}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePlaybook(p);
                      setModalTab('principles');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white font-semibold flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <span>Chi tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upgraded Modal View for Playbook Details with Tabs */}
      {activePlaybook && (
        <Modal
          isOpen={!!activePlaybook}
          onClose={() => setActivePlaybook(null)}
          title={`${activePlaybook.bookNumber}: ${activePlaybook.title}`}
          description={activePlaybook.subtitle}
          size="full"
        >
          <div className="space-y-6 pt-2">
            {/* Modal Tabs */}
            <div className="flex border-b border-border gap-2" role="tablist" aria-label="Nội dung chi tiết cẩm nang">
              <button
                type="button"
                role="tab"
                aria-selected={modalTab === 'principles'}
                onClick={() => setModalTab('principles')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                  modalTab === 'principles'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                Nguyên lý cốt lõi
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={modalTab === 'topics'}
                onClick={() => setModalTab('topics')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                  modalTab === 'topics'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                Chủ đề &amp; Nguồn gốc
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={modalTab === 'code'}
                onClick={() => setModalTab('code')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                  modalTab === 'code'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-muted hover:text-text'
                }`}
              >
                Mã nguồn &amp; Công thức
              </button>
            </div>

            {/* Tab 1: Principles */}
            {modalTab === 'principles' && (
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted">
                  3 Nguyên lý thiết kế cốt lõi
                </h4>
                <ul className="space-y-2.5">
                  {activePlaybook.corePrinciples.map((cp, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-bg border border-border text-xs sm:text-sm text-text">
                      <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{cp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tab 2: Topics */}
            {modalTab === 'topics' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">Tác phẩm &amp; Tác giả gốc</h4>
                  <p className="p-3.5 rounded-xl bg-bg border border-border text-text text-xs sm:text-sm">
                    <strong>{activePlaybook.originalWork}</strong> — {activePlaybook.author}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">Tất cả chủ đề trọng tâm</h4>
                  <div className="flex flex-wrap gap-2">
                    {activePlaybook.keyTopics.map((kt, idx) => (
                      <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-bg border border-border text-text font-medium">
                        {kt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 text-xs text-text-muted">
                  <span className="font-bold text-text block mb-1">Mã tài liệu tham chiếu:</span>
                  <code className="text-accent font-mono block break-all text-[11px]">{activePlaybook.docPath}</code>
                </div>
              </div>
            )}

            {/* Tab 3: Code */}
            {modalTab === 'code' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted">
                    Mã nguồn / Công thức đặc trưng
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(activePlaybook.sampleCodeOrFormula, 'modal')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all"
                  >
                    {copiedId === 'modal' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Đã sao chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép mã</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-bg border border-border text-xs font-mono text-text overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {activePlaybook.sampleCodeOrFormula}
                </pre>
              </div>
            )}

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setActivePlaybook(null)}
                className="py-2 px-5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
