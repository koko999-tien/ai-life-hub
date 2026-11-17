'use client';

import { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  Code2,
  Brain,
  Shield,
  Layers,
  Sparkles,
  Gamepad2,
  Terminal,
  Database,
  Lock,
  Cpu,
  ArrowRight,
  ExternalLink,
  FolderGit2
} from 'lucide-react';

export interface Playbook {
  id: string;
  bookNumber: string;
  title: string;
  subtitle: string;
  originalWork: string;
  author: string;
  icon: any;
  category: 'ai' | 'data' | 'security' | 'systems' | 'testing' | 'game';
  roles: string[];
  keyTopics: string[];
  corePrinciples: string[];
  sampleCodeOrFormula: string;
  drivePath: string;
}

export const PLAYBOOKS_DATA: Playbook[] = [
  {
    id: 'agentic-ai',
    bookNumber: 'Book 01',
    title: 'Trí tuệ Nhân tạo Tác tử (Agentic AI)',
    subtitle: 'Vòng lặp ReAct, Giao thức MCP, Bộ nhớ phân tầng & Đánh giá Evals',
    originalWork: 'Agentic AI: Complete Guide to Autonomous Systems',
    author: 'AI Engineering Group',
    icon: Brain,
    category: 'ai',
    roles: ['ai-engineer'],
    keyTopics: ['Vòng lặp ReAct (Reason + Act)', 'Model Context Protocol (MCP)', 'Bộ nhớ phân tầng (Working, Episodic, Semantic)', 'Guardrails & Tránh lặp vô hạn', 'Đánh giá Evals tự động'],
    corePrinciples: [
      'Tách biệt tư duy (Reasoning) khỏi hành động (Action/Tool Execution)',
      'Chuẩn hóa giao thức kết nối công cụ mở rộng qua MCP Client/Server',
      'Định lượng độ tin cậy bằng Benchmark bộ dữ liệu vàng (Golden Datasets)'
    ],
    sampleCodeOrFormula: `# Vòng lặp ReAct chuẩn hóa
def react_step(user_query, context):
    thought = llm.think(user_query, context)
    action, action_input = parse_action(thought)
    observation = tool_registry.execute(action, action_input)
    return synthesize_final(thought, observation)`,
    drivePath: 'D:\\AI_Knowledge_Lab\\docs\\playbooks\\01_agentic_ai_playbook.md'
  },
  {
    id: 'data-visualizations',
    bookNumber: 'Book 02',
    title: 'Trực quan hóa Dữ liệu Thực chiến (Data Visualizations)',
    subtitle: 'Pandas Series/DataFrame, Đa chỉ mục MultiIndex & 8+ Biểu đồ Matplotlib',
    originalWork: 'Data Visualizations with Python',
    author: 'Data Science Specialists',
    icon: Layers,
    category: 'data',
    roles: ['data-scientist'],
    keyTopics: ['Pandas MultiIndex & Reshaping', 'Chuỗi thời gian & Rolling Windows', 'Heatmaps, Boxplots & Violin plots', 'Tối ưu bảng màu Accessibility', 'Xuất bản vẽ chuẩn ấn phẩm'],
    corePrinciples: [
      'Tránh lãng phí bộ nhớ bằng định dạng kiểu dữ liệu danh mục (category)',
      'Tỷ lệ dữ liệu - mực in (Data-Ink Ratio) tối đa của Edward Tufte',
      'Xử lý khuyết thiếu (NaN) có chủ đích thay vì dropna() bừa bãi'
    ],
    sampleCodeOrFormula: `import pandas as pd
import matplotlib.pyplot as plt

df['rolling_avg'] = df['revenue'].rolling(window=7, min_periods=1).mean()
fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
ax.plot(df.index, df['revenue'], alpha=0.3, label='Thực tế')
ax.plot(df.index, df['rolling_avg'], color='#2563eb', lw=2, label='MA 7-Day')`,
    drivePath: 'D:\\AI_Knowledge_Lab\\docs\\playbooks\\02_data_visualizations_playbook.md'
  },
  {
    id: 'math-for-data-science',
    bookNumber: 'Book 03',
    title: 'Toán học cho Khoa học Dữ liệu (Math for Data Science)',
    subtitle: 'Giải tích vi phân, Định lý Bayes, Đại số tuyến tính & Neural Net from Scratch',
    originalWork: 'Mathematics for Data Science and Machine Learning',
    author: 'Applied Mathematics Consortium',
    icon: Sparkles,
    category: 'data',
    roles: ['ai-engineer', 'data-scientist'],
    keyTopics: ['Quy tắc chuỗi (Chain Rule) & Ma trận Jacobi', 'Định lý Bayes & Thống kê suy luận', 'Phân tích suy biến SVD & PCA', 'Hàm mất mát Cross-Entropy', 'Lan truyền ngược (Backpropagation)'],
    corePrinciples: [
      'Hiểu bản chất đạo hàm riêng (Partial Derivatives) trong tối ưu hóa Gradient Descent',
      'Khoảng tin cậy (Confidence Interval) và ý nghĩa p-value trong kiểm định A/B',
      'Ý nghĩa hình học của vector riêng (Eigenvectors) trong giảm chiều dữ liệu'
    ],
    sampleCodeOrFormula: `# Công thức lan truyền ngược gradient
dZ2 = A2 - Y
dW2 = (1 / m) * np.dot(dZ2, A1.T)
db2 = (1 / m) * np.sum(dZ2, axis=1, keepdims=True)
dZ1 = np.dot(W2.T, dZ2) * relu_derivative(Z1)`,
    drivePath: 'D:\\AI_Knowledge_Lab\\docs\\playbooks\\03_math_for_data_science_playbook.md'
  },
  {
    id: 'python-graphics',
    bookNumber: 'Book 04',
    title: 'Đồ họa Python 2D/3D & Mô phỏng Khoa học (Python Graphics)',
    subtitle: 'Biến đổi Affine, Ma trận xoay Euler, Phối cảnh 3D & Đổ bóng Lambertian',
    originalWork: 'Python Graphics: 2D & 3D Scientific Computing',
    author: 'Visual Computing Lab',
    icon: Code2,
    category: 'game',
    roles: ['game-dev'],
    keyTopics: ['Tọa độ đồng nhất (Homogeneous Coordinates)', 'Ma trận phép chiếu phối cảnh (Perspective)', 'Chiếu sáng Lambertian & Phong Shading', 'Mô phỏng vật lý hạt & Khí hậu', 'Tối ưu hóa NumPy Vectorization'],
    corePrinciples: [
      'Tách biệt mô hình không gian thế giới (World Space) và không gian camera',
      'Định lý quay Euler và giải pháp tránh khóa trục (Gimbal Lock)',
      'Vector hóa toàn bộ phép biến đổi để đạt 60 FPS trên Python thuần'
    ],
    sampleCodeOrFormula: `# Ma trận biến đổi Affine 3D đồng nhất
T = np.array([
    [scale_x * cos(th), -sin(th), 0, tx],
    [sin(th), scale_y * cos(th), 0, ty],
    [0, 0, scale_z, tz],
    [0, 0, 0, 1]
])`,
    drivePath: 'D:\\AI_Knowledge_Lab\\docs\\playbooks\\04_python_graphics_playbook.md'
  },
  {
    id: 'unity-game-dev',
    bookNumber: 'Book 05',
    title: 'Kiến trúc Phát triển Game Unity (Unity Game Dev)',
    subtitle: 'Vòng đời MonoBehaviour, Vật lý Raycast, FSM AI, URP & DOTS/ECS',
    originalWork: 'Unity Game Development (4th Edition)',
    author: 'Borromeo & Gomila',
    icon: Gamepad2,
    category: 'game',
    roles: ['game-dev'],
    keyTopics: ['MonoBehaviour Lifecycle (Awake, Start, FixedUpdate)', 'Máy trạng thái hữu hạn (FSM) cho Enemy AI', 'Vật lý 3D Raycasting & LayerMask', 'Object Pooling chống Garbage Collection', 'Data-Oriented Technology Stack (DOTS)'],
    corePrinciples: [
      'Không bao giờ gọi GetComponent() trong Update() loop',
      'Sử dụng FixedUpdate cho tương tác Rigidbody để đảm bảo tính tất định',
      'Quản lý bộ nhớ với Object Pooling triệt tiêu giật lag (GC spikes)'
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
    drivePath: 'D:\\AI_Knowledge_Lab\\docs\\playbooks\\05_unity_game_dev_playbook.md'
  },
  {
    id: 'agile-testing',
    bookNumber: 'Book 06',
    title: 'Nghệ thuật Agile Testing (The Art of Agile Testing)',
    subtitle: '4 Góc phần tư Q1-Q4, Toán chất lượng Chernov, BDD Gherkin & SBTM',
    originalWork: 'The Art of Agile Testing (2024)',
    author: 'Yuri Chernov',
    icon: CheckCircle,
    category: 'testing',
    roles: ['agile-qa'],
    keyTopics: ['Agile Testing Quadrants Q1-Q4', 'Toán học chất lượng Chernov ($K_{cov}, W_{tc}$)', 'Kịch bản BDD Given-When-Then', 'Session-Based Test Management (SBTM)', 'Kiểm thử Sàn giao dịch tài chính'],
    corePrinciples: [
      'Chất lượng là trách nhiệm của toàn bộ team, không phải chốt chặn cuối',
      'Định lượng độ rủi ro bằng trọng số mức nghiêm trọng Chernov',
      'Khám phá có cấu trúc (Exploratory Testing) qua các Charter có timebox'
    ],
    sampleCodeOrFormula: `Scenario: Giao dịch ngoại hối khớp lệnh trong giới hạn trượt giá
  Given Khách hàng có số dư khả dụng 50,000 USD
  When Khách hàng gửi lệnh mua 1.5 BTC với giá thị trường 65,000 USD
  And Biên độ trượt giá tối đa cho phép là 0.2%
  Then Hệ thống khớp lệnh thành công với giá không vượt quá 65,130 USD`,
    drivePath: 'D:\\AI_Knowledge_Lab\\docs\\playbooks\\06_agile_testing_playbook.md'
  },
  {
    id: 'secure-coding',
    bookNumber: 'Book 07',
    title: 'Lập trình An toàn Alice và Bob (Secure Coding)',
    subtitle: 'Tam giác CIA, Quyền tối thiểu, OWASP Top 10, STRIDE & SSDLC',
    originalWork: 'Alice and Bob Learn Secure Coding (2025)',
    author: 'Tanya Janca',
    icon: Lock,
    category: 'security',
    roles: ['ai-engineer', 'backend', 'devops', 'agile-qa'],
    keyTopics: ['Mô hình mối đe dọa STRIDE', 'Triệt tiêu SQLi, XSS, SSRF và Broken Auth', 'Nguyên tắc Quyền tối thiểu (Least Privilege)', 'Bảo mật chuỗi cung ứng (Supply Chain & SBOM)', 'Bảo vệ API keys & Secrets management'],
    corePrinciples: [
      'Không bao giờ tin tưởng dữ liệu đầu vào từ người dùng (Never Trust, Always Validate)',
      'Phòng ngự chiều sâu (Defense in Depth) trên mọi tầng kiến trúc',
      'Tích hợp kiểm tra an ninh tự động ngay trên pipeline CI/CD (DevSecOps)'
    ],
    sampleCodeOrFormula: `// Parameterized Query triệt tiêu SQL Injection 100%
const query = 'SELECT id, email, role FROM users WHERE id = $1 AND active = $2';
const result = await db.query(query, [userId, true]);

// Cấu hình HTTP Security Headers
app.use(helmet({ contentSecurityPolicy: true, hsts: true }));`,
    drivePath: 'D:\\AI_Knowledge_Lab\\docs\\playbooks\\07_alice_bob_secure_coding_playbook.md'
  },
  {
    id: 'sql-multidb',
    bookNumber: 'Book 08',
    title: 'Cơ sở Dữ liệu SQL Đa Hệ quản trị (SQL & Multi-DB)',
    subtitle: 'Chuẩn hóa 3NF, Hàm cửa sổ LAG/LEAD, Chỉ mục B-Tree & Giao dịch ACID',
    originalWork: 'Databases in SQL, MySQL, MS SQL & PostgreSQL',
    author: 'Database Engineering Group',
    icon: Database,
    category: 'data',
    roles: ['data-scientist', 'backend', 'agile-qa'],
    keyTopics: ['Chuẩn hóa cơ sở dữ liệu 1NF đến 3NF', 'Hàm cửa sổ phân tích (ROW_NUMBER, LAG, LEAD)', 'Chỉ mục B-Tree, Partial và Covering Index', 'Cấp độ cô lập giao dịch (Read Committed, Serializable)', 'Giải quyết Deadlock & Tối ưu EXPLAIN'],
    corePrinciples: [
      'Thiết kế khóa ngoại và ràng buộc toàn vẹn dữ liệu từ tầng cơ sở dữ liệu',
      'Hiểu rõ sự khác biệt giữa Index Scan và Index-Only Scan để tránh I/O đĩa',
      'Giữ giao dịch (Transaction) ngắn nhất có thể để giảm thiểu tranh chấp khóa (Lock Contention)'
    ],
    sampleCodeOrFormula: `SELECT 
    customer_id, order_date, order_amount,
    LAG(order_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date) as prev_amount,
    order_amount - LAG(order_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date) as delta_spending
FROM orders;`,
    drivePath: 'D:\\AI_Knowledge_Lab\\docs\\playbooks\\08_sql_multidb_database_playbook.md'
  },
  {
    id: 'c-programming',
    bookNumber: 'Book 09',
    title: 'Lập trình C & Kiến trúc Bộ nhớ Hệ thống (C Programming)',
    subtitle: 'Phân đoạn Stack vs Heap, Số học con trỏ, malloc/free & Định dạng ELF',
    originalWork: 'C Programming for Beginners & Systems Architecture',
    author: 'Mike McGrath',
    icon: Cpu,
    category: 'systems',
    roles: ['backend', 'devops', 'game-dev'],
    keyTopics: ['Chu kỳ biên dịch (Preprocessor, Compiler, Assembler, Linker)', 'Bản đồ bộ nhớ ảo (Text, Data, BSS, Stack, Heap)', 'Số học con trỏ (Pointer Arithmetic) & Con trỏ hàm', 'Quản lý bộ nhớ động và rò rỉ (Valgrind/AddressSanitizer)', 'Đóng gói cấu trúc bộ nhớ (Struct Padding & Alignment)'],
    corePrinciples: [
      'Mỗi byte bộ nhớ cấp phát qua malloc() bắt buộc phải có lệnh free() tương ứng',
      'Cảnh giác tuyệt đối với tràn bộ đệm (Buffer Overflow) và Undefined Behavior',
      'Tận dụng cấu trúc dữ liệu liên tục để tăng tỷ lệ trúng Cache L1/L2 của CPU'
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
s = NULL; // Tránh Dangling Pointer`,
    drivePath: 'D:\\AI_Knowledge_Lab\\docs\\playbooks\\09_c_programming_playbook.md'
  },
  {
    id: 'selinux-admin',
    bookNumber: 'Book 10',
    title: 'Quản trị Bảo mật Hệ thống SELinux (SELinux System Admin)',
    subtitle: 'Phân quyền Bắt buộc MAC vs DAC, Type Enforcement, sVirt & AVC Denials',
    originalWork: 'SELinux System Administration',
    author: 'Sven Vermeulen',
    icon: Shield,
    category: 'security',
    roles: ['devops'],
    keyTopics: ['Kiểm soát truy cập bắt buộc (Mandatory Access Control)', 'Cấu trúc nhãn bảo mật (user:role:type:mls)', 'Thực thi kiểu (Type Enforcement) & Chuyển dịch miền', 'Cách ly máy ảo & Docker Container với sVirt/MCS', 'Điều tra vi phạm nhật ký AVC qua audit2allow'],
    corePrinciples: [
      'Quyền Root truyền thống (DAC) vẫn bị giam cầm trong chính sách của SELinux (MAC)',
      'Không bao giờ tắt SELinux (setenforce 0) trên môi trường sản xuất',
      'Tạo module chính sách tối thiểu cho các dịch vụ tùy biến nội bộ'
    ],
    sampleCodeOrFormula: `# Kiểm tra nhãn bảo mật tiến trình và file
ls -Z /var/www/html/
ps -eZ | grep nginx

# Phân tích log từ chối AVC và sinh bản vá policy
ausearch -m avc -ts recent | audit2allow -M my_custom_service
semodule -i my_custom_service.pp`,
    drivePath: 'D:\\AI_Knowledge_Lab\\docs\\playbooks\\10_selinux_admin_playbook.md'
  }
];

export function PlaybooksDirectory() {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [activePlaybook, setActivePlaybook] = useState<Playbook | null>(null);

  const rolePathways = [
    { id: 'all', label: 'Tất cả 10 Sách' },
    { id: 'ai-engineer', label: '🤖 AI & LLM Engineer' },
    { id: 'data-scientist', label: '📊 Data Scientist' },
    { id: 'backend', label: '💻 Fullstack & Backend' },
    { id: 'devops', label: '🛡️ DevOps & SecOps' },
    { id: 'agile-qa', label: '✅ Agile QA / SDET' },
    { id: 'game-dev', label: '🎮 Game & Graphics' },
  ];

  const filteredPlaybooks = useMemo(() => {
    return PLAYBOOKS_DATA.filter((p) => {
      const matchRole = selectedRole === 'all' || p.roles.includes(selectedRole);
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.subtitle.toLowerCase().includes(search.toLowerCase()) ||
                          p.keyTopics.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
                          p.originalWork.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [selectedRole, search]);

  return (
    <div className="space-y-8">
      {/* Search and Role Pathways Filter */}
      <div className="card p-6 bg-bg-surface border-border space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo chủ đề, từ khóa kỹ thuật (vd: ReAct, Pandas, Bayes, Unity, Chernov, SELinux, SQL, C pointers)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg border border-border text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>

        {/* Role Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {rolePathways.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
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

      {/* Grid of Playbooks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlaybooks.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="card p-6 bg-bg-surface border-border hover:border-accent/50 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent/10">
                        {p.bookNumber}
                      </span>
                      <h3 className="font-bold text-lg text-text mt-1 group-hover:text-accent transition-colors">
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
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-bg border border-border/80 text-text-muted">
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Code Preview Box */}
                <pre className="p-3 rounded-xl bg-bg border border-border text-[11px] font-mono text-text overflow-x-auto whitespace-pre-wrap max-h-36 overflow-y-auto mb-4">
                  {p.sampleCodeOrFormula}
                </pre>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-text-muted font-mono truncate max-w-[200px]" title={p.drivePath}>
                  📂 {p.drivePath.replace('D:\\', '')}
                </span>
                <button
                  onClick={() => setActivePlaybook(p)}
                  className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white font-semibold flex items-center gap-1.5 transition-all"
                >
                  Chi tiết cẩm nang <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal View for Playbook Details */}
      {activePlaybook && (
        <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-border rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start gap-4 pb-4 border-b border-border">
              <div>
                <span className="text-xs font-mono font-bold text-accent px-2.5 py-0.5 rounded bg-accent/15">
                  {activePlaybook.bookNumber}
                </span>
                <h2 className="text-2xl font-bold text-text mt-2">{activePlaybook.title}</h2>
                <p className="text-xs sm:text-sm text-text-muted mt-1">{activePlaybook.subtitle}</p>
              </div>
              <button
                onClick={() => setActivePlaybook(null)}
                className="p-2 rounded-lg bg-bg border border-border text-text-muted hover:text-text"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">Tác phẩm & Nguồn gốc</h4>
                <p className="p-3 rounded-xl bg-bg border border-border text-text text-xs">
                  <strong>{activePlaybook.originalWork}</strong> — {activePlaybook.author}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">3 Nguyên lý cốt lõi</h4>
                <ul className="space-y-1.5">
                  {activePlaybook.corePrinciples.map((cp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-text">
                      <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{cp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">Toàn bộ chủ đề trọng tâm</h4>
                <div className="flex flex-wrap gap-2">
                  {activePlaybook.keyTopics.map((kt, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-bg border border-border text-text font-medium">
                      {kt}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">Mã nguồn / Công thức đặc trưng</h4>
                <pre className="p-4 rounded-xl bg-bg border border-border text-xs font-mono text-text overflow-x-auto whitespace-pre-wrap">
                  {activePlaybook.sampleCodeOrFormula}
                </pre>
              </div>

              <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 text-xs text-text-muted">
                <span className="font-bold text-text block mb-1">Đường dẫn tài liệu đầy đủ trên ổ D:</span>
                <code className="text-accent font-mono block break-all">{activePlaybook.drivePath}</code>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                onClick={() => setActivePlaybook(null)}
                className="py-2 px-5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
