'use client';

import { useState } from 'react';
import {
  Workflow,
  ArrowRight,
  Play,
  CheckCircle2,
  Copy,
  Download,
  FileCode,
  PenTool,
  Search,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { Button, toast } from '@/components/ui';

interface WorkflowStep {
  id: string;
  title: string;
  role: string;
  description: string;
  promptTemplate: string;
}

interface WorkflowDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: LucideIcon;
  color: string;
  inputPlaceholder: string;
  defaultInput: string;
  steps: WorkflowStep[];
}

const PRESET_WORKFLOWS: WorkflowDefinition[] = [
  {
    id: 'content-factory',
    name: 'Chuỗi Sản Xuất Nội Dung Đa Kênh',
    category: 'Sáng tạo nội dung & Marketing',
    description: 'Chuyển 1 ý tưởng ban đầu thành bài viết chuẩn tìm kiếm 1.000 từ, chuỗi 8 bài ngắn, bài đăng LinkedIn và bản tin chuyên sâu.',
    icon: PenTool,
    color: '#F59E0B',
    inputPlaceholder: 'Ví dụ: Cách xây dựng trợ lý AI cho công việc văn phòng năm 2026',
    defaultInput: 'Chiến lược tối ưu chi phí và bộ nhớ đệm khi xây dựng ứng dụng AI quy mô lớn',
    steps: [
      {
        id: 'step-outline',
        title: 'Bước 1: Lập dàn ý & Mở bài thu hút',
        role: 'Chuyên gia Chiến lược Nội dung',
        description: 'Tạo câu mở bài thu hút, dàn ý 4 phần và các luận điểm chính',
        promptTemplate: 'Bạn là chuyên gia chiến lược nội dung. Hãy lập dàn ý chi tiết gồm mở bài thu hút, 4 luận điểm chính và câu hỏi thường gặp cho chủ đề: {{input}}',
      },
      {
        id: 'step-blog',
        title: 'Bước 2: Viết bài Blog chuyên sâu',
        role: 'Chuyên gia Viết Blog & Tối ưu Tìm kiếm',
        description: 'Mở rộng dàn ý thành bài viết 1.000 từ mạch lạc, có tiêu đề phụ rõ ràng',
        promptTemplate: 'Dựa vào dàn ý trên, hãy viết bài blog 1.000 từ, phong cách thực tế, có ví dụ cụ thể dễ áp dụng.',
      },
      {
        id: 'step-twitter',
        title: 'Bước 3: Chuỗi bài ngắn trên mạng xã hội X',
        role: 'Chuyên gia Tăng trưởng Mạng xã hội',
        description: 'Chuyển đổi bài blog thành 8 bài ngắn cô đọng, dễ lan tỏa',
        promptTemplate: 'Chuyển nội dung bài viết thành chuỗi 8 bài ngắn. Bài 1 là câu mở đầu ấn tượng, bài 8 là tóm tắt và lời kêu gọi.',
      },
      {
        id: 'step-linkedin',
        title: 'Bước 4: Bài chia sẻ góc nhìn trên LinkedIn',
        role: 'Cố vấn Truyền thông Lãnh đạo',
        description: 'Biên tập lại theo giọng văn chuyên nghiệp, phù hợp mạng lưới nghề nghiệp',
        promptTemplate: 'Viết lại thành bài đăng LinkedIn 250–300 từ với góc nhìn thực tế của người dẫn dắt dự án, kèm bài học rút ra.',
      },
    ],
  },
  {
    id: 'code-architect',
    name: 'Quy Trình Thiết Kế & Kiểm Thử Phần Mềm',
    category: 'Lập trình & Kỹ thuật',
    description: 'Từ mô tả nhu cầu người dùng, thiết kế cấu trúc dữ liệu, xử lý máy chủ, giao diện React và bộ kiểm thử tự động.',
    icon: FileCode,
    color: '#10B981',
    inputPlaceholder: 'Ví dụ: Tính năng đánh dấu bài viết hỗ trợ lưu ngoại tuyến và đồng bộ đám mây',
    defaultInput: 'Hệ thống bình chọn câu lệnh cộng đồng có giới hạn chống spam và thống kê thời gian thực',
    steps: [
      {
        id: 'step-db',
        title: 'Bước 1: Thiết kế Cơ sở dữ liệu',
        role: 'Kiến trúc sư Cơ sở dữ liệu',
        description: 'Xác định các bảng, chỉ mục tìm kiếm, khóa liên kết và phân quyền dữ liệu',
        promptTemplate: 'Thiết kế cấu trúc bảng PostgreSQL chi tiết cho tính năng: {{input}}. Bao gồm chỉ mục, khóa ngoại và quy tắc bảo mật theo dòng.',
      },
      {
        id: 'step-api',
        title: 'Bước 2: Xử lý Máy chủ & Kiểm tra Dữ liệu',
        role: 'Kỹ sư Phần mềm Máy chủ (Backend)',
        description: 'Viết điểm kết nối xử lý dữ liệu an toàn, kiểm tra chặt chẽ đầu vào',
        promptTemplate: 'Viết mã nguồn Next.js Server Actions cho tính năng trên, có kiểm tra dữ liệu đầu vào và xử lý lỗi rõ ràng.',
      },
      {
        id: 'step-ui',
        title: 'Bước 3: Giao diện Người dùng Tương tác',
        role: 'Kỹ sư Giao diện Người dùng (Frontend)',
        description: 'Tạo thành phần giao diện hỗ trợ trợ năng, chế độ sáng/tối và phản hồi tức thì',
        promptTemplate: 'Tạo mã nguồn giao diện React hoàn chỉnh, tương thích di động, hỗ trợ chế độ sáng/tối và cập nhật trạng thái tức thì.',
      },
      {
        id: 'step-tests',
        title: 'Bước 4: Bộ Kiểm Thử Tự Động',
        role: 'Kỹ sư Kiểm thử & Bảo mật Tự động',
        description: 'Kiểm tra đầy đủ luồng chuẩn và các tình huống ngoại lệ dễ phát sinh lỗi',
        promptTemplate: 'Viết bộ kiểm thử tự động bao phủ cả tình huống chuẩn lẫn các lỗi biên như mất mạng, giới hạn lượt gửi và dữ liệu rỗng.',
      },
    ],
  },
  {
    id: 'academic-research',
    name: 'Quy Trình Nghiên Cứu & Phản Biện Đa Chiều',
    category: 'Nghiên cứu & Học thuật',
    description: 'Phân tích tài liệu phức tạp, bóc tách luận điểm, phản biện đối chứng và trích xuất thẻ ghi nhớ ôn tập.',
    icon: Search,
    color: '#6366F1',
    inputPlaceholder: 'Ví dụ: Tác động của phương pháp tra cứu tài liệu gốc giúp giảm AI bịa đặt trong y khoa',
    defaultInput: 'Phương pháp suy luận từng bước và tác động tới khả năng giải toán của các mô hình AI lớn',
    steps: [
      {
        id: 'step-synth',
        title: 'Bước 1: Tổng hợp Luận điểm Cốt lõi',
        role: 'Nghiên cứu viên Cao cấp',
        description: 'Trích xuất 5 phát hiện chính, phương pháp thực hiện và bằng chứng thực nghiệm',
        promptTemplate: 'Phân tích sâu chủ đề: {{input}}. Tóm tắt 5 luận điểm chính kèm bằng chứng thực tế.',
      },
      {
        id: 'step-counter',
        title: 'Bước 2: Phản biện Đối chứng Độc lập',
        role: 'Chuyên gia Phản biện & Kiểm chứng',
        description: 'Tìm kiếm lỗ hổng lập luận, thiên kiến và các trường hợp giả định sai lầm',
        promptTemplate: 'Đóng vai chuyên gia phản biện độc lập. Chỉ ra 3 điểm yếu lớn nhất và 2 tình huống giả định thiếu căn cứ của kết luận trên.',
      },
      {
        id: 'step-anki',
        title: 'Bước 3: Tạo Thẻ Ghi Nhớ Ôn Tập (Anki)',
        role: 'Chuyên gia Phương pháp Ghi nhớ Khoa học',
        description: 'Chuyển kiến thức thành 10 thẻ hỏi-đáp ngắn phục vụ ôn tập chủ động dài hạn',
        promptTemplate: 'Chuyển toàn bộ kiến thức trên thành 8–10 thẻ ghi nhớ Anki (dạng hỏi-đáp hoặc điền từ còn thiếu) để ôn tập chủ động.',
      },
    ],
  },
  {
    id: 'product-launch',
    name: 'Quy Trình Ra Mắt Sản Phẩm Thử Nghiệm Tối Thiểu (MVP)',
    category: 'Sáng tạo & Khởi nghiệp',
    description: 'Từ ý tưởng ban đầu xác định chân dung khách hàng mục tiêu, giá trị cốt lõi, nội dung trang bán hàng và chuỗi thư chăm sóc.',
    icon: Rocket,
    color: '#EC4899',
    inputPlaceholder: 'Ví dụ: Ứng dụng AI học từ vựng tiếng Anh qua ngữ cảnh video YouTube',
    defaultInput: 'Nền tảng AI trợ lý luyện phỏng vấn xin việc với kịch bản hỏi-đáp thực tế',
    steps: [
      {
        id: 'step-icp',
        title: 'Bước 1: Chân dung Khách hàng Mục tiêu',
        role: 'Trưởng nhóm Sản phẩm & Nghiên cứu Thị trường',
        description: 'Phân tích vấn đề nhức nhối, mục tiêu và lý do khách hàng sẵn sàng chi trả',
        promptTemplate: 'Xác định 2 nhóm khách hàng mục tiêu phù hợp nhất cho sản phẩm: {{input}}. Phân tích sâu vấn đề của họ và mức ngân sách chi trả.',
      },
      {
        id: 'step-landing',
        title: 'Bước 2: Nội dung Trang Giới Thiệu Bán Hàng',
        role: 'Chuyên gia Viết nội dung Chuyển đổi',
        description: 'Xây dựng tiêu đề chính, lợi ích nổi bật, minh chứng tin cậy và nút kêu gọi hành động',
        promptTemplate: 'Viết nội dung trang giới thiệu theo công thức Vấn đề - Tác động - Giải pháp để tăng tỷ lệ đăng ký.',
      },
      {
        id: 'step-email',
        title: 'Bước 3: Chuỗi Email Chăm sóc & Ra mắt',
        role: 'Chuyên gia Chăm sóc Khách hàng Qua Email',
        description: 'Soạn 3 email: Thông báo ra mắt, Câu chuyện phát triển và Ưu đãi dùng sớm',
        promptTemplate: 'Viết chuỗi 3 email gửi danh sách chờ (người đăng ký trước) giúp họ hào hứng dùng thử ngay ngày đầu ra mắt.',
      },
    ],
  },
];

function buildSimulatedOutput(step: WorkflowStep, inputText: string, prevOutput: string): string {
  const contextNote = prevOutput ? '\n\n*(Đã tự động kế thừa ngữ cảnh từ bước trước)*' : '';

  const outputs: Record<string, string> = {
    'step-outline': `### 📋 Dàn ý Chiến lược: ${inputText}

- **Câu mở bài thu hút**: Trong kỷ nguyên AI phổ cập, tối ưu chi phí vận hành không chỉ là tiết kiệm ngân sách mà là yếu tố quyết định sản phẩm có thể tồn tại lâu dài hay không.
- **Phần 1 — Bản đồ tiêu thụ đơn vị chữ (Token)**: Phân tích chi phí ẩn giữa dữ liệu gửi lên, câu trả lời và phần văn bản được lưu đệm.
- **Phần 2 — 3 kỹ thuật tiết kiệm thực chiến**: Lưu bộ nhớ đệm (Prompt Caching), bộ nhớ đệm theo ngữ nghĩa và chọn mô hình gọn nhẹ cho tác vụ đơn giản.
- **Phần 3 — Rút gọn ngữ cảnh mà không mất ý**: Chia nhỏ tài liệu thông minh và tóm tắt theo tầng.
- **Phần 4 — Danh sách kiểm tra trước khi vận hành**: 5 bước rà soát chi phí và độ ổn định.`,

    'step-blog': `## Tối Ưu Chi Phí Vận Hành AI: Bí Quyết Mở Rộng Ứng Dụng Bền Vững

Khi đưa AI vào sản phẩm thực tế cho "${inputText}", rào cản lớn nhất thường không nằm ở độ thông minh của mô hình, mà ở hóa đơn sử dụng tăng vọt vào cuối tháng.

### 1. Kích hoạt lưu bộ nhớ đệm (Prompt Caching)
Các nhà cung cấp lớn đều cho phép lưu tạm phần chỉ dẫn cố định ở đầu câu lệnh. Khi tái sử dụng phần chữ tĩnh này, chi phí đầu vào có thể giảm từ 50% đến 90%.

### 2. Bộ nhớ đệm theo ngữ nghĩa
Với các câu hỏi tương đồng từ nhiều người dùng (ví dụ: "chính sách hoàn tiền" và "làm sao lấy lại tiền"), hệ thống có thể trả về câu trả lời đã tính sẵn thay vì gọi lại AI từ đầu.${contextNote}`,

    'step-twitter': `🧵 1/8: Nếu ứng dụng AI của bạn đang tiêu tốn hàng nghìn USD mỗi tháng, đây là 3 cách cắt giảm tới 68% chi phí mà vẫn giữ nguyên chất lượng trả lời: 👇

2/8: Kỹ thuật 1 — Lưu bộ nhớ đệm: Đừng gửi lại toàn bộ hướng dẫn cố định từ đầu ở mọi lượt hỏi. Hãy đặt nội dung tĩnh ở phần đầu để hưởng mức giá ưu đãi.

3/8: Kỹ thuật 2 — So khớp câu hỏi tương tự: Hơn 40% thắc mắc của người dùng lặp lại ý định giống nhau.

4/8: Kỹ thuật 3 — Ràng buộc đầu ra ngắn gọn: Quy định rõ định dạng và độ dài giúp loại bỏ phần mở đầu xã giao dư thừa.${contextNote}`,

    'step-linkedin': `🚀 Giảm 68% chi phí vận hành AI: Bài học thực tế khi triển khai "${inputText}"

Nhiều đội ngũ phát triển gặp cùng một nghịch lý: càng đông người dùng, biên lợi nhuận càng thu hẹp do chi phí gọi AI tăng nhanh.

Sau khi tối ưu hệ thống thực tế, đây là 3 nguyên tắc quan trọng nhất:
1️⃣ Tận dụng bộ nhớ đệm ngay ở tầng thiết kế câu lệnh.
2️⃣ Phân loại câu hỏi lặp lại để tránh gọi AI dư thừa.
3️⃣ Dùng mô hình gọn nhẹ cho các tác vụ phân loại, chỉ dùng mô hình lớn cho suy luận phức tạp.

Đội ngũ của bạn đang áp dụng cách nào để kiểm soát chi phí AI?${contextNote}`,

    'step-db': `### 🗄️ Thiết Kế Cấu Trúc Dữ Liệu (PostgreSQL)

Áp dụng cho yêu cầu: **${inputText}**

- **Bảng \`community_items\`**: lưu mã định danh (\`id\`), tiêu đề, tổng điểm bình chọn (\`vote_count\`), thời gian tạo.
- **Bảng \`item_votes\`**: khóa kết hợp \`(item_id, user_id)\` để đảm bảo mỗi người chỉ bình chọn 1 lần.
- **Chỉ mục (Index)**: tạo chỉ mục theo \`(vote_count DESC, created_at DESC)\` để tải bảng xếp hạng dưới 5ms.
- **Bảo mật dòng dữ liệu**: chỉ chủ sở hữu phiên đăng nhập mới được phép thêm hoặc rút lại lượt bình chọn của chính mình.`,

    'step-api': `### ⚙️ Xử Lý Máy Chủ & Chống Gửi Lặp (Server Action)

\`\`\`typescript
// Kiểm tra hợp lệ đầu vào và giới hạn tần suất (Rate Limit)
export async function toggleVote(itemId: string, userId: string) {
  if (!itemId || !userId) throw new Error('Thiếu thông tin xác thực');
  // 1. Kiểm tra giới hạn tối đa 20 lượt thao tác / phút
  // 2. Thực thi giao dịch cập nhật đồng bộ item_votes và vote_count
  return { ok: true };
}
\`\`\`${contextNote}`,

    'step-ui': `### 🎨 Giao Diện Người Dùng (React + Tailwind)

- Nút bình chọn hiển thị số lượt rõ ràng, có thuộc tính \`aria-pressed\` cho trình đọc màn hình.
- Cập nhật trạng thái tăng/giảm số lượt ngay lập tức khi bấm để mang lại cảm giác mượt mà, tự động hoàn tác nếu máy chủ báo lỗi.
- Tương thích đầy đủ cả chế độ Sáng (Light) và Tối (Dark).${contextNote}`,

    'step-tests': `### ✅ Danh Sách Kiểm Thử Tự Động (Vitest)

1. **Luồng chuẩn**: Bấm bình chọn lần 1 tăng điểm lên +1; bấm lại lần 2 thu hồi về 0.
2. **Chống gửi trùng lặp**: Hai yêu cầu gửi đồng thời cùng 1 tài khoản chỉ ghi nhận 1 lượt hợp lệ.
3. **Vượt ngưỡng giới hạn**: Gửi quá 20 lần/phút trả về thông báo chờ rõ ràng bằng tiếng Việt.
4. **Dữ liệu thiếu hoặc sai định dạng**: Từ chối an toàn trước khi chạm tới cơ sở dữ liệu.${contextNote}`,

    'step-synth': `### 📚 Tổng Hợp 5 Luận Điểm Cốt Lõi: ${inputText}

1. **Tách nhỏ bài toán giúp giảm sai số**: Khi chia nhiệm vụ thành các bước trung gian rõ ràng, tỷ lệ trả lời đúng trên các bài toán nhiều bước tăng rõ rệt.
2. **Tính minh bạch của lập luận**: Người dùng dễ dàng phát hiện bước nào bị sai thay vì chỉ nhận một đáp án cuối cùng.
3. **Đánh đổi về thời gian và chi phí**: Suy luận dài tạo ra nhiều chữ hơn nên tốn thời gian chờ và chi phí cao hơn.
4. **Phụ thuộc vào chất lượng hướng dẫn**: Gợi ý từng bước mơ hồ có thể khiến AI suy diễn vòng vo.
5. **Hiệu quả rõ nhất ở bài toán có cấu trúc**: Toán học, lập trình và phân tích nhân quả hưởng lợi nhiều nhất.`,

    'step-counter': `### ⚖️ Báo Cáo Phản Biện & Kiểm Chứng Độc Lập

- **Điểm yếu 1 — Ngụy biện hợp lý hóa**: AI có thể viết ra chuỗi lập luận nghe rất xuôi tai nhưng lại dẫn tới kết luận sai hoặc che giấu bước nhảy cóc.
- **Điểm yếu 2 — Lãng phí khi áp dụng đại trà**: Với các câu hỏi tra cứu sự kiện đơn giản, suy luận nhiều bước không làm tăng độ chính xác mà chỉ làm chậm phản hồi.
- **Giả định cần kiểm chứng**: Không phải cứ yêu cầu AI "suy nghĩ từng bước" là dữ liệu đầu vào tự động đúng — nếu dữ liệu nền sai, lập luận vẫn sai theo.${contextNote}`,

    'step-anki': `### 🗂️ Bộ Thẻ Ghi Nhớ Ôn Tập Chủ Động (Mẫu 4 thẻ tiêu biểu)

- **Thẻ 1**: *Hỏi:* Khi nào nên áp dụng cách yêu cầu AI suy luận từng bước? → *Đáp:* Khi bài toán đòi hỏi nhiều bước tính toán, logic hoặc phân tích nhân quả; tránh dùng cho câu hỏi tra cứu đơn giản.
- **Thẻ 2**: *Hỏi:* Nhược điểm chính của suy luận dài là gì? → *Đáp:* Tăng độ trễ phản hồi và tăng số lượng đơn vị chữ (token) đầu ra.
- **Thẻ 3**: *Hỏi:* "Ngụy biện hợp lý hóa" ở AI là gì? → *Đáp:* Hiện tượng AI tạo lời giải thích nghe có vẻ logic nhưng thực chất chứa bước sai hoặc bịa căn cứ.
- **Thẻ 4**: *Hỏi:* Làm sao kiểm chứng câu trả lời của AI ở bước phản biện? → *Đáp:* Kiểm tra độc lập từng giả định đầu vào và đối chiếu với nguồn dữ liệu tin cậy.${contextNote}`,

    'step-icp': `### 🎯 Chân Dung Khách Hàng Mục Tiêu: ${inputText}

1. **Nhóm 1 — Sinh viên năm cuối & Người mới chuyển ngành (21–26 tuổi)**:
   - *Vấn đề chính*: Run khi trả lời phỏng vấn thật, chưa biết cách kể câu chuyện kinh nghiệm mạch lạc.
   - *Mức sẵn sàng chi trả*: 150.000 – 300.000 đ/tháng trong giai đoạn tìm việc.
2. **Nhóm 2 — Kỹ sư & Chuyên viên 2–5 năm kinh nghiệm ứng tuyển vị trí cao hơn**:
   - *Vấn đề chính*: Cần luyện phản biện tình huống chuyên sâu và phỏng vấn bằng tiếng Anh.
   - *Mức sẵn sàng chi trả*: 400.000 – 700.000 đ/tháng.`,

    'step-landing': `### 🖥️ Nội Dung Trang Giới Thiệu Bán Hàng (Công thức Vấn đề - Tác động - Giải pháp)

- **Tiêu đề chính**: Tự Tin Bước Vào Phòng Phỏng Vấn Chỉ Sau 7 Ngày Luyện Tập Cùng Trợ Lý AI
- **Vấn đề**: Bạn có năng lực nhưng vẫn mất điểm vì lúng túng trước câu hỏi tình huống bất ngờ?
- **Giải pháp**: Luyện nói trực tiếp với người phỏng vấn ảo theo đúng vị trí bạn ứng tuyển, nhận nhận xét chi tiết ngay sau mỗi câu trả lời.
- **Kêu gọi hành động**: Dùng thử miễn phí 1 buổi phỏng vấn mô phỏng ngay hôm nay.${contextNote}`,

    'step-email': `### ✉️ Chuỗi 3 Email Chăm Sóc Danh Sách Chờ

1. **Email 1 (Chào mừng & Ra mắt)**: "Cánh cửa trải nghiệm đã mở — mời bạn nhận buổi luyện phỏng vấn đầu tiên miễn phí."
2. **Email 2 (Câu chuyện thực tế)**: "Vì sao 70% ứng viên giỏi vẫn trượt vòng đầu? Và cách khắc phục trong 15 phút mỗi tối."
3. **Email 3 (Ưu đãi dùng sớm)**: "Ưu đãi giảm 40% dành riêng cho 100 người đăng ký sớm nhất tuần này."${contextNote}`,
  };

  return (
    outputs[step.id] ||
    `### Kết quả mô phỏng: ${step.title}\n\nĐã xử lý xong bước phân tích cho "${inputText}" theo vai trò **${step.role}**.${contextNote}`
  );
}

export function WorkflowExplorer() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition>(PRESET_WORKFLOWS[0]);
  const [inputText, setInputText] = useState<string>(PRESET_WORKFLOWS[0].defaultInput);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepOutputs, setStepOutputs] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleSelectWorkflow = (wf: WorkflowDefinition) => {
    setSelectedWorkflow(wf);
    setInputText(wf.defaultInput);
    setCurrentStepIndex(0);
    setStepOutputs({});
  };

  const runSingleStep = async (
    index: number,
    existingOutputs: Record<string, string>
  ): Promise<Record<string, string>> => {
    const step = selectedWorkflow.steps[index];
    if (!step) return existingOutputs;

    const prevOutput = index > 0 ? existingOutputs[selectedWorkflow.steps[index - 1].id] || '' : '';

    // Simulate generation with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    const outputText = buildSimulatedOutput(step, inputText, prevOutput);
    const updated = { ...existingOutputs, [step.id]: outputText };
    setStepOutputs(updated);
    setCurrentStepIndex(index + 1);
    toast.success(`Hoàn thành mô phỏng: ${step.title}`);
    return updated;
  };

  const handleRunStep = async (index: number) => {
    setIsRunning(true);
    try {
      await runSingleStep(index, stepOutputs);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunAll = async () => {
    setIsRunning(true);
    try {
      let currentOutputs: Record<string, string> = {};
      setStepOutputs({});
      setCurrentStepIndex(0);
      for (let i = 0; i < selectedWorkflow.steps.length; i++) {
        currentOutputs = await runSingleStep(i, currentOutputs);
        if (i < selectedWorkflow.steps.length - 1) {
          await new Promise((r) => setTimeout(r, 350));
        }
      }
      toast.success('Đã hoàn thành toàn bộ quy trình mô phỏng!');
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadFullReport = () => {
    let report = `# BÁO CÁO QUY TRÌNH MÔ PHỎNG: ${selectedWorkflow.name}\n\n**Chủ đề đầu vào**: ${inputText}\n**Ngày tạo**: ${new Date().toLocaleString('vi-VN')}\n\n---\n\n`;
    selectedWorkflow.steps.forEach((step) => {
      report += `## ${step.title} (${step.role})\n\n${stepOutputs[step.id] || '_Chưa chạy thử_'}\n\n---\n\n`;
    });

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quy-trinh-${selectedWorkflow.id}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Đã tải xuống toàn bộ báo cáo quy trình!');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
            <Workflow className="h-4 w-4" />
            <span>Dành cho Lập trình viên & Kỹ thuật</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            Mô phỏng quy trình (Demo)
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-text mb-4">
          Quy Trình AI Đa Nhiệm
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed">
          Trải nghiệm mô phỏng cách chia một công việc lớn thành chuỗi nhiều trợ lý AI nối tiếp nhau: kết quả của bước trước tự động làm ngữ cảnh đầu vào cho bước tiếp theo.
        </p>
      </div>

      {/* Workflow Selector Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {PRESET_WORKFLOWS.map((wf) => {
          const IconComp = wf.icon;
          const isSelected = selectedWorkflow.id === wf.id;
          return (
            <button
              key={wf.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSelectWorkflow(wf)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-accent bg-accent/10 shadow-md ring-1 ring-accent/40'
                  : 'border-border bg-bg-surface hover:border-accent/40'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${wf.color}20`, color: wf.color }}
              >
                <IconComp className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-text mb-1">{wf.name}</h3>
              <p className="text-xs text-text-muted line-clamp-2">{wf.description}</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-accent">
                <span>{wf.steps.length} bước liên hoàn</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Execution Area */}
      <div className="rounded-3xl border border-border bg-bg-surface p-6 sm:p-8 shadow-sm mb-12">
        {/* Input Configuration */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label htmlFor="workflow-input" className="block text-sm font-bold text-text">
              Chủ đề / Yêu cầu đầu vào của quy trình:
            </label>
            <span className="text-[11px] text-text-muted">
              Chế độ mô phỏng minh họa luồng dữ liệu (chưa kết nối máy chủ AI trực tiếp)
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="workflow-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={selectedWorkflow.inputPlaceholder}
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button
              size="lg"
              disabled={isRunning || !inputText.trim()}
              onClick={handleRunAll}
              className="gap-2 shrink-0 bg-accent hover:bg-accent-hover text-white"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{isRunning ? 'Đang chạy mô phỏng...' : `Chạy thử mô phỏng (${selectedWorkflow.steps.length} bước)`}</span>
            </Button>
          </div>
        </div>

        {/* Steps Visualizer */}
        <div className="space-y-6">
          {selectedWorkflow.steps.map((step, idx) => {
            const hasOutput = Boolean(stepOutputs[step.id]);
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`rounded-2xl border transition-all ${
                  hasOutput
                    ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/15'
                    : isCurrent
                    ? 'border-accent bg-bg-elevated shadow-sm'
                    : 'border-border bg-bg/60 opacity-80'
                }`}
              >
                {/* Step Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        hasOutput
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-accent text-white'
                          : 'bg-bg border border-border text-text-muted'
                      }`}
                    >
                      {hasOutput ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text flex flex-wrap items-center gap-2">
                        <span>{step.title}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-bg border border-border text-text-muted">
                          {step.role}
                        </span>
                      </h4>
                      <p className="text-xs text-text-muted mt-0.5">{step.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant={hasOutput ? 'outline' : 'primary'}
                      size="sm"
                      disabled={isRunning}
                      onClick={() => handleRunStep(idx)}
                      className="text-xs gap-1.5"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>{hasOutput ? 'Chạy lại bước này' : 'Chạy thử bước này'}</span>
                    </Button>
                  </div>
                </div>

                {/* Step Output Box */}
                {hasOutput && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-emerald-500/20">
                    <div className="rounded-xl bg-bg p-4 border border-border text-xs sm:text-sm text-text whitespace-pre-wrap font-sans leading-relaxed shadow-sm">
                      {stepOutputs[step.id]}
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(stepOutputs[step.id]);
                          toast.success('Đã sao chép kết quả bước này!');
                        }}
                        className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" /> Sao chép
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Export Footer */}
        {Object.keys(stepOutputs).length > 0 && (
          <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-text-muted">
              Đã hoàn thành mô phỏng {Object.keys(stepOutputs).length} / {selectedWorkflow.steps.length} bước trong quy trình.
            </span>
            <Button variant="outline" onClick={handleDownloadFullReport} className="gap-2 text-xs">
              <Download className="h-3.5 w-3.5" />
              <span>Tải xuống báo cáo mô phỏng (.md)</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
