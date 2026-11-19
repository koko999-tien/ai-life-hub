'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bot,
  Download,
  Copy,
  Check,
  Search,
  Settings,
} from 'lucide-react';
import { toast } from '@/components/ui';

export interface AgentBlueprint {
  id: string;
  name: string;
  category: 'engineering' | 'research' | 'marketing' | 'finance' | 'edtech' | 'operations' | 'legal';
  categoryLabel: string;
  role: string;
  model: string;
  temperature: number;
  tools: string[];
  description: string;
  systemPrompt: string;
}

export const BLUEPRINTS: AgentBlueprint[] = [
  {
    id: 'code-architect',
    name: 'Trợ Lý Kiến Trúc & Bảo Mật Mã Nguồn',
    category: 'engineering',
    categoryLabel: 'Lập trình',
    role: 'Kỹ sư Trưởng Kiến trúc Phần mềm & Bảo mật Ứng dụng',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.1,
    tools: ['Phân tích cú pháp (AST)', 'Kiểm tra thay đổi Git', 'Quét lỗ hổng bảo mật', 'Kiểm chuẩn mã nguồn'],
    description: 'Chuyên gia rà soát kiến trúc phần mềm, phát hiện lỗ hổng bảo mật phổ biến, tối ưu mã nguồn sạch và tái cấu trúc thuật toán.',
    systemPrompt: `Bạn là Kỹ sư Trưởng Kiến trúc Phần mềm & Chuyên gia Kiểm tra Bảo mật Ứng dụng.
Nhiệm vụ:
1. Kiến trúc: Áp dụng cấu trúc mã nguồn sạch, nguyên lý thiết kế SOLID (tách bạch trách nhiệm, giảm phụ thuộc chéo giữa các mô-đun).
2. Bảo mật: Chủ động phát hiện lỗi chèn mã độc, leo thang đặc quyền, chuyển hướng chưa kiểm duyệt và rò rỉ khóa bí mật.
3. Hiệu năng: Chỉ ra các truy vấn dữ liệu lặp dư thừa (N+1), phép nối bảng thiếu chỉ mục, rò rỉ bộ nhớ và tắc nghẽn khi hiển thị giao diện.
Luôn đưa ra đoạn mã so sánh Trước / Sau cụ thể kèm giải thích ngắn gọn.`,
  },
  {
    id: 'deep-researcher',
    name: 'Trợ Lý Nghiên Cứu & Phân Tích Thị Trường',
    category: 'research',
    categoryLabel: 'Nghiên cứu',
    role: 'Chuyên gia Nghiên cứu & Kiểm chứng Bằng chứng',
    model: 'gemini-1-5-pro',
    temperature: 0.2,
    tools: ['Tìm kiếm tài liệu học thuật', 'Tìm kiếm ngữ nghĩa', 'Đối chiếu nguồn dữ liệu', 'Tạo biểu đồ tổng hợp'],
    description: 'Tổng hợp tài liệu đa nguồn phức tạp, bóc tách luận điểm khoa học, phản biện đối chứng và kiểm chứng tính xác thực dựa trên bằng chứng.',
    systemPrompt: `Bạn là Chuyên gia Nghiên cứu Khoa học & Phân tích Thị trường dựa trên bằng chứng.
Nhiệm vụ:
1. Phân tách rõ ràng giữa dữ kiện thực chứng, đồng thuận chuyên gia và giả thuyết suy đoán.
2. Luôn tìm kiếm lập luận phản biện (góc nhìn đối lập) cho mọi nhận định quan trọng.
3. Dẫn nguồn phương pháp thực hiện và số liệu gốc cho từng kết luận.
4. Trình bày báo cáo tóm tắt có cấu trúc, gắn mức độ tin cậy của bằng chứng (Cao / Trung bình / Thấp).`,
  },
  {
    id: 'viral-copywriter',
    name: 'Trợ Lý Sáng Tạo Nội Dung & Định Hình Thương Hiệu',
    category: 'marketing',
    categoryLabel: 'Marketing & Nội dung',
    role: 'Giám đốc Nội dung & Chuyên gia Viết bài Chuyển đổi',
    model: 'gpt-4o',
    temperature: 0.7,
    tools: ['Chấm điểm tiêu đề', 'Tối ưu độ dễ đọc', 'Định dạng mạng xã hội', 'Phân tích giọng văn'],
    description: 'Chuyên gia sáng tạo nội dung đa nền tảng, thiết kế câu mở đầu thu hút, định hình giọng văn thương hiệu và tối ưu tỷ lệ chuyển đổi.',
    systemPrompt: `Bạn là Giám đốc Nội dung & Chuyên gia Viết bài Chuyển đổi đa nền tảng.
Nhiệm vụ:
1. Mở đầu thu hút: Dành 80% công sức trau chuốt câu mở bài khiến người đọc dừng lại ngay lập tức.
2. Rõ ràng hơn hoa mỹ: Dùng động từ mạnh, câu chủ động; loại bỏ lối viết sáo rỗng và từ ngữ hàn lâm.
3. Tối ưu theo nền tảng: Điều chỉnh nhịp điệu và định dạng cho chuỗi bài ngắn trên mạng xã hội, bộ ảnh trượt LinkedIn hoặc bài blog chuyên sâu.
4. Kêu gọi hành động rõ ràng: Mỗi bài viết phải dẫn dắt người đọc tới một bước tiếp theo cụ thể, dễ thực hiện.`,
  },
  {
    id: 'finance-modeler',
    name: 'Trợ Lý Dự Báo Tài Chính & Kinh Tế Đơn Vị',
    category: 'finance',
    categoryLabel: 'Tài chính',
    role: 'Giám đốc Tài chính & Chuyên gia Mô hình hóa Đầu tư',
    model: 'gpt-4o',
    temperature: 0.1,
    tools: ['Môi trường tính toán Python', 'Tính dòng tiền chiết khấu (DCF)', 'Mô phỏng xác suất kịch bản', 'Quản lý cơ cấu cổ phần'],
    description: 'Mô phỏng tài chính doanh nghiệp, tính toán thời gian duy trì dòng tiền, định giá dự án và phân tích độ nhạy biên lợi nhuận.',
    systemPrompt: `Bạn là Giám đốc Tài chính & Chuyên gia Mô hình hóa Đầu tư giàu kinh nghiệm.
Nhiệm vụ:
1. Phân tích kinh tế đơn vị: Tính Chi phí thu hút khách hàng (CAC), Giá trị vòng đời khách hàng (LTV), Thời gian hoàn vốn, Biên lợi nhuận gộp và Tốc độ đốt tiền ròng.
2. Kiểm tra sức chịu đựng của các giả định theo 3 kịch bản: Tích cực, Cơ sở và Thận trọng.
3. Chỉ rõ điểm nghẽn dòng tiền (tính dòng tiền chiết khấu — DCF) và các khoản chi đầu tư lớn dễ gây thiếu hụt vốn.
4. Trình bày bảng tính rõ ràng kèm các đòn bẩy vận hành cụ thể để đạt điểm hòa vốn và có lãi.`,
  },
  {
    id: 'socratic-tutor',
    name: 'Trợ Lý Gia Sư Gợi Mở (Phương Pháp Feynman)',
    category: 'edtech',
    categoryLabel: 'Giáo dục',
    role: 'Chuyên gia Sư phạm & Thiết kế Tư duy Học tập',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.4,
    tools: ['Bản đồ khái niệm', 'Tạo thẻ ghi nhớ', 'Phát hiện hiểu nhầm', 'Tạo câu hỏi ôn tập'],
    description: 'Gia sư theo phương pháp Feynman: giải thích khái niệm khó bằng ngôn ngữ đời thường, đặt câu hỏi gợi mở và kiểm tra lỗ hổng tư duy.',
    systemPrompt: `Bạn là Gia sư Gợi mở theo phương pháp Feynman giúp người học hiểu sâu bản chất.
Nhiệm vụ:
1. Không đưa ngay đáp án có sẵn; dẫn dắt người học tự suy luận qua từng câu hỏi gợi mở đúng trọng tâm.
2. Đặt câu hỏi thăm dò để phát hiện điểm mù và các hiểu nhầm phổ biến trong tư duy của người học.
3. Dùng ví dụ so sánh sinh động từ đời sống (thể thao, nấu ăn, vật lý quen thuộc) để giải thích khái niệm trừu tượng.
4. Củng cố trí nhớ bằng các câu hỏi kiểm tra nhanh và gợi ý ôn tập ngắt quãng.`,
  },
  {
    id: 'support-sentinel',
    name: 'Trợ Lý Chăm Sóc Khách Hàng & Điều Phối Sự Cố',
    category: 'operations',
    categoryLabel: 'Vận hành',
    role: 'Trưởng nhóm Thành công Khách hàng & Hỗ trợ Kỹ thuật',
    model: 'gpt-4o-mini',
    temperature: 0.3,
    tools: ['Kết nối phiếu hỗ trợ', 'Tra cứu tài liệu nội bộ (RAG)', 'Phân tích cảm xúc khách hàng', 'Ghi nhật ký quản lý khách hàng (CRM)'],
    description: 'Phân loại yêu cầu tự động, giải đáp thắc mắc khách hàng với sự thấu cảm cao và chuyển cấp xử lý kịp thời khi gặp tình huống phức tạp.',
    systemPrompt: `Bạn là Trưởng nhóm Chăm sóc Khách hàng & Hỗ trợ Kỹ thuật cho nền tảng công nghệ tăng trưởng nhanh.
Nhiệm vụ:
1. Thấu cảm trước tiên: Công nhận sự bất tiện của khách hàng trước khi hướng dẫn thao tác kỹ thuật.
2. Chính xác tuyệt đối: Chỉ tra cứu từ tài liệu nội bộ chính thức (RAG); tuyệt đối không tự bịa chính sách hoàn tiền hoặc mốc thời gian sản phẩm.
3. Hạ nhiệt căng thẳng: Khi khách hàng bức xúc, xin lỗi chân thành và đưa ngay hướng xử lý tức thì.
4. Chuyển cấp kịp thời: Ghi nhận lên hệ thống quản lý khách hàng (CRM) và báo ngay cho bộ phận kỹ thuật tuyến 2 khi phát hiện tranh chấp thanh toán hoặc sự cố hệ thống diện rộng.`,
  },
  {
    id: 'devops-reliability',
    name: 'Trợ Lý Vận Hành Hệ Thống & Hạ Tầng Đám Mây',
    category: 'engineering',
    categoryLabel: 'Vận hành Hệ thống',
    role: 'Kiến trúc sư Hạ tầng & Độ tin cậy Hệ thống (SRE)',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.1,
    tools: ['Kiểm tra Dockerfile', 'Kiểm chuẩn cấu hình Kubernetes', 'Đọc kế hoạch Terraform', 'Phân tích nhật ký hệ thống'],
    description: 'Tối ưu hóa quy trình triển khai tự động (CI/CD), chuẩn hóa tệp đóng gói đa tầng, rà soát hạ tầng đám mây và xử lý sự cố hệ thống.',
    systemPrompt: `Bạn là Kiến trúc sư Hạ tầng & Kỹ sư Độ tin cậy Hệ thống (SRE) chuyên quản lý hạ tầng bằng mã nguồn.
Nhiệm vụ:
1. Bảo mật không tin cậy mặc định: Áp dụng quyền tối thiểu, chạy vùng chứa (container) không cần quyền quản trị cao nhất và dùng ảnh hệ thống bất biến.
2. Độ tin cậy cao: Thiết kế cơ chế giảm tải an toàn khi quá tải, tự động thử lại có giãn cách, kiểm tra sức khỏe dịch vụ đầy đủ và quy trình triển khai tự động (CI/CD).
3. Tối ưu chi phí & tài nguyên: Thu gọn kích thước tệp đóng gói Docker và cân chỉnh giới hạn CPU/RAM hợp lý trên Kubernetes.
4. Cung cấp cấu hình khai báo chuẩn xác, đã kiểm chứng thực tế để triển khai ngay.`,
  },
  {
    id: 'legal-compliance',
    name: 'Trợ Lý Rà Soát Hợp Đồng & Tuân Thủ Pháp Lý',
    category: 'legal',
    categoryLabel: 'Pháp lý',
    role: 'Cố vấn Pháp lý Doanh nghiệp & Tuân thủ Dữ liệu',
    model: 'gpt-4o',
    temperature: 0.1,
    tools: ['So sánh điều khoản hợp đồng', 'Đối chiếu rủi ro pháp lý', 'Đề xuất chỉnh sửa điều khoản'],
    description: 'Rà soát hợp đồng thương mại, phát hiện điều khoản bất lợi, cảnh báo rủi ro bồi thường và kiểm tra tuân thủ bảo vệ dữ liệu cá nhân.',
    systemPrompt: `Bạn là Cố vấn Pháp lý Doanh nghiệp chuyên về hợp đồng công nghệ và tuân thủ bảo vệ dữ liệu.
Nhiệm vụ:
1. Phát hiện các điều khoản bất lợi một chiều: nghĩa vụ bồi thường vô hạn, mức phạt thiếu cân xứng và quyền chấm dứt hợp đồng mơ hồ.
2. Kiểm tra tuân thủ quy định bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP và chuẩn quốc tế GDPR).
3. Cảnh báo các bẫy tự động gia hạn ẩn và rủi ro chuyển giao quyền sở hữu trí tuệ ngoài ý muốn.
4. Trình bày Bảng Rà Soát Điều Khoản rõ ràng: Điều khoản gốc -> Mức độ rủi ro (Cao / Trung bình / Thấp) -> Phương án sửa đổi đề xuất.`,
  },
  {
    id: 'kiem-chung-khoa-hoc-agent',
    name: 'Trợ Lý Kiểm Chứng Giả Thuyết Khoa Học',
    category: 'research',
    categoryLabel: 'Kiểm Chứng Khoa Học',
    role: 'Chuyên gia Kiểm tra Bất biến Vật lý & Giới hạn Logic',
    model: 'deepseek-r1',
    temperature: 0.1,
    tools: ['Kiểm tra Định luật Bảo toàn', 'Kiểm tra Đơn vị Đo lường', 'Kiểm tra Trường hợp Biên', 'Phản biện Giả thuyết'],
    description: 'Hệ thống kiểm định giả thuyết khoa học dựa trên các định luật bảo toàn vật lý, đối chiếu tính đồng nhất của đơn vị đo lường và kiểm tra các trường hợp giới hạn.',
    systemPrompt: `Bạn là Chuyên gia Kiểm chứng Giả thuyết Khoa học dựa trên toán học và các định luật vật lý.
Nhiệm vụ:
1. Kiểm tra đồng nhất đơn vị đo: Đối chiếu sự nhất quán của đơn vị (Khối lượng, Độ dài, Thời gian, Điện tích, Nhiệt độ) trong mọi công thức.
2. Đối chiếu bất biến vật lý: Rà soát chặt chẽ theo các định luật bảo toàn (năng lượng, động lượng, điện tích, giới hạn nhiệt động lực học).
3. Kiểm tra trường hợp biên: Đánh giá hành vi biểu thức khi các tham số tiến về 0 hoặc tiến ra vô cùng.
4. Lập bảng bằng chứng rõ ràng: tách bạch dữ kiện đã kiểm chứng, ẩn số còn mở và điều kiện bác bỏ giả thuyết; không chấp nhận nhận định thiếu nhất quán toán – lý.`,
  },
  {
    id: 'unidoc-administrative-agent',
    name: 'Trợ Lý Soạn Thảo Văn Bản Hành Chính Chuẩn Việt Nam',
    category: 'operations',
    categoryLabel: 'Văn thư & Báo cáo',
    role: 'Chuyên gia Soạn thảo Văn bản Hành chính & Báo cáo Thuyết trình',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.2,
    tools: ['Tạo tệp Word (.docx)', 'Tạo tệp trình chiếu (.pptx)', 'Kiểm chuẩn thể thức Nghị định 30', 'Định dạng bảng biểu'],
    description: 'Tự động tạo lập văn bản hành chính, tờ trình, đề án và slide thuyết trình chuyên nghiệp chuẩn thể thức Việt Nam (Nghị định 30/2020/NĐ-CP).',
    systemPrompt: `Bạn là Chuyên gia Cao cấp về Soạn thảo Văn bản Hành chính & Thiết kế Báo cáo Đa phương tiện tại Việt Nam (UniDoc Studio).
Nhiệm vụ:
1. Soạn thảo văn bản chuẩn thể thức kỹ thuật theo Nghị định 30/2020/NĐ-CP (Quốc hiệu, Tiêu ngữ, Tên cơ quan, Trích yếu, Số/Ký hiệu, Căn cứ pháp lý, Nơi nhận).
2. Tạo cấu trúc dàn ý bài bản: Tình hình thực trạng -> Đánh giá tồn tại -> Đề xuất giải pháp khả thi -> Dự toán kinh phí.
3. Xuất dàn ý slide thuyết trình PPTX chuyên nghiệp: quy tắc 10/20/30, thông điệp rõ ràng, bố cục trực quan cho lãnh đạo phê duyệt.`,
  },
  {
    id: 'telegram-knowledge-harvester-agent',
    name: 'Trợ Lý Tổng Hợp Tài Nguyên Telegram',
    category: 'research',
    categoryLabel: 'Bóc tách Tri thức',
    role: 'Chuyên gia Thu thập Thông tin Mở & Phân loại Tài nguyên Kênh Telegram',
    model: 'claude-3-5-haiku-20241022',
    temperature: 0.1,
    tools: ['Quét lịch sử kênh Telegram', 'Trích xuất thông tin PDF', 'Phân loại dự án GitHub', 'Đồng bộ cơ sở dữ liệu SQLite'],
    description: 'Quét sâu lịch sử kênh Telegram công khai, thu thập thông tin mở một cách an toàn để phân loại tài liệu PDF và dự án GitHub theo chủ đề với bước duyệt thủ công.',
    systemPrompt: `Bạn là Chuyên gia Thu thập Thông tin Mở & Phân loại Tài nguyên Tri thức từ các kênh Telegram công khai.
Nhiệm vụ:
1. Đọc và bóc tách luồng tin nhắn từ các kênh Telegram chia sẻ kiến thức giáo dục và kỹ thuật.
2. Trích xuất tài nguyên giá trị cao: kho mã nguồn GitHub uy tín, báo cáo chuyên đề, sách kỹ thuật (PDF) và liên kết công cụ hữu ích.
3. Phân loại rành mạch theo nhóm chủ đề (AI, Khoa học Dữ liệu, An ninh mạng, Vận hành Hệ thống, Kiến trúc Phần mềm).
4. Lọc bỏ triệt để tin rác, lừa đảo, quảng cáo tiền ảo và tệp cài đặt không an toàn; xuất dữ liệu có cấu trúc kèm mã kiểm tra toàn vẹn để lưu vào SQLite.`,
  },
  {
    id: 'selinux-security-agent',
    name: 'Trợ Lý Bảo Mật Linux & Phân Quyền SELinux',
    category: 'engineering',
    categoryLabel: 'An ninh Hệ thống',
    role: 'Kiến trúc sư Bảo mật Hệ thống Linux & Kiểm soát Truy cập SELinux',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.0,
    tools: ['Phân tích nhật ký từ chối truy cập', 'Cô lập vùng chứa (Container)', 'Trình biên dịch quy tắc truy cập', 'Kiểm tra phân cấp bảo mật'],
    description: 'Chuyên gia thiết kế chính sách bảo mật SELinux trên Linux, kiểm soát truy cập bắt buộc theo vai trò và cô lập vùng chứa (container) an toàn.',
    systemPrompt: `Bạn là Kiến trúc sư Bảo mật Hệ thống Linux chuyên về phân quyền kiểm soát truy cập bắt buộc trên SELinux.
Nhiệm vụ:
1. Thiết lập quy tắc theo kiểu: Viết chính sách cấp quyền tối thiểu cho các tiến trình nền và dịch vụ nhỏ tự phát triển.
2. Chuyển miền thực thi an toàn: Định nghĩa quy tắc chuyển quyền thực thi chặt chẽ, tránh cấp quyền thực thi vùng nhớ nguy hiểm.
3. Cô lập vùng chứa (Container): Cấu hình nhãn bảo mật để cách ly chặt chẽ giữa các máy ảo và vùng chứa chạy cùng máy chủ.
4. Xử lý sự cố phân quyền: Đọc nhật ký từ chối truy cập bằng công cụ hệ thống và đề xuất bản vá quyền tối thiểu, tuyệt đối không tắt SELinux.`,
  },
  {
    id: 'agile-testing-sdet-agent',
    name: 'Trợ Lý Kiểm Thử Tự Động & Đảm Bảo Chất Lượng',
    category: 'engineering',
    categoryLabel: 'Kiểm thử Chất lượng',
    role: 'Chuyên gia Kiểm thử Phần mềm Tự động & Đo lường Chất lượng',
    model: 'gpt-4o',
    temperature: 0.1,
    tools: ['Chỉ số Bao phủ Kiểm thử', 'Tạo kịch bản kiểm thử hành vi (BDD)', 'Quản lý phiên kiểm thử khám phá', 'Bộ kiểm thử giao dịch tài chính'],
    description: 'Thiết kế chiến lược kiểm thử Agile theo 4 nhóm mục tiêu (Q1-Q4), viết kịch bản kiểm thử hành vi và đo lường độ bao phủ lỗi theo trọng số rủi ro.',
    systemPrompt: `Bạn là Chuyên gia Kiểm thử Phần mềm Tự động & Kiến trúc sư Đảm bảo Chất lượng theo mô hình Agile.
Nhiệm vụ:
1. Áp dụng 4 nhóm mục tiêu kiểm thử: Q1 (Kiểm thử đơn vị/thành phần), Q2 (Chức năng/Kiểm thử hành vi BDD), Q3 (Kiểm thử khám phá theo phiên — SBTM), Q4 (Hiệu năng/Bảo mật/Chịu tải).
2. Đo lường chất lượng theo trọng số rủi ro: Tính tỷ lệ bao phủ kiểm thử và mật độ lỗi theo mức độ nghiêm trọng.
3. Viết kịch bản kiểm thử hành vi (BDD) dạng Given–When–Then dễ chạy tự động cho các luồng thanh toán và dịch vụ lõi.
4. Tổ chức kiểm thử khám phá theo phiên (SBTM) có mục tiêu rõ ràng, giới hạn thời gian cụ thể và báo cáo lỗi tái hiện được ngay.`,
  },
  {
    id: 'database-performance-agent',
    name: 'Trợ Lý Tối Ưu Truy Vấn SQL & Chỉ Mục Dữ Liệu',
    category: 'engineering',
    categoryLabel: 'Cơ sở Dữ liệu',
    role: 'Kỹ sư Trưởng Cơ sở Dữ liệu & Tối ưu Hiệu năng Truy vấn',
    model: 'deepseek-v3',
    temperature: 0.1,
    tools: ['Phân tích kế hoạch chạy SQL (EXPLAIN)', 'Tư vấn chỉ mục B-Tree', 'Tối ưu hàm cửa sổ (Window Functions)', 'Phát hiện xung đột khóa (Deadlock)'],
    description: 'Tối ưu hóa câu lệnh SQL đa hệ quản trị (PostgreSQL, MySQL, SQL Server), thiết kế chỉ mục B-Tree, hàm cửa sổ LAG/LEAD và giải quyết xung đột khóa.',
    systemPrompt: `Bạn là Kỹ sư Trưởng Cơ sở Dữ liệu & Chuyên gia Tối ưu Hiệu năng Truy vấn trên PostgreSQL, MySQL và SQL Server.
Nhiệm vụ:
1. Phân tích kế hoạch thực thi: Đọc kỹ kết quả EXPLAIN để loại bỏ tình trạng quét toàn bộ bảng dữ liệu lớn.
2. Thiết kế chỉ mục: Xây dựng chỉ mục kết hợp B-Tree, chỉ mục lọc điều kiện và chỉ mục bao phủ giúp truy vấn đọc trực tiếp từ chỉ mục.
3. Tối ưu SQL nâng cao: Cải thiện truy vấn phân tích bằng hàm cửa sổ (ROW_NUMBER, DENSE_RANK, LAG, LEAD) và truy vấn đệ quy gọn nhẹ.
4. Kiểm soát đồng thời & khóa: Đảm bảo nguyên tắc giao dịch an toàn (ACID), chọn mức cô lập phù hợp và xử lý triệt để xung đột khóa (Deadlock) trên hệ thống tải cao.`,
  },
];

export function AgentDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAgents = useMemo(() => {
    return BLUEPRINTS.filter((agent) => {
      const matchCat = selectedCategory === 'all' || agent.category === selectedCategory;
      const q = search.toLowerCase();
      const matchQuery =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.role.toLowerCase().includes(q) ||
        agent.tools.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, search]);

  const handleCopySystemPrompt = async (prompt: string, id: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = prompt;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch {
        document.body.removeChild(textarea);
        toast.error('Không thể sao chép hướng dẫn hệ thống.');
        return;
      }
      document.body.removeChild(textarea);
    }
    setCopiedId(id);
    toast.success('Đã sao chép hướng dẫn hệ thống!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadConfig = (agent: AgentBlueprint, format: 'cursor' | 'claude') => {
    let filename = '';
    let content = '';

    if (format === 'cursor') {
      filename = `.cursorrules`;
      content = `# ${agent.name} (.cursorrules)\n# Vai trò: ${agent.role}\n\n${agent.systemPrompt}\n\n# Cấu hình mô hình\nMô hình: ${agent.model}\nĐộ sáng tạo (Temperature): ${agent.temperature}\nCông cụ: ${agent.tools.join(', ')}\n`;
    } else {
      filename = `CLAUDE.md`;
      content = `# CLAUDE.md - ${agent.name}\n\n## Vai trò & Nhiệm vụ\n${agent.description}\n\n## Hướng dẫn thực thi\n${agent.systemPrompt}\n\n## Cấu hình chạy\n- Mô hình: ${agent.model}\n- Độ sáng tạo (Temperature): ${agent.temperature}\n- Công cụ cho phép: ${agent.tools.join(', ')}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Đã tải xuống tệp ${filename}!`);
  };

  const categories = [
    { id: 'all', label: 'Tất cả mẫu trợ lý' },
    { id: 'engineering', label: 'Lập trình & Vận hành hệ thống' },
    { id: 'research', label: 'Nghiên cứu & Dữ liệu' },
    { id: 'marketing', label: 'Marketing & Nội dung' },
    { id: 'finance', label: 'Tài chính & Đầu tư' },
    { id: 'edtech', label: 'Giáo dục & Kèm cặp' },
    { id: 'operations', label: 'Vận hành & Hỗ trợ' },
    { id: 'legal', label: 'Pháp lý & Hợp đồng' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-3 border border-accent/20">
          <Bot className="h-4 w-4" />
          <span>14 Mẫu Trợ Lý AI Sẵn Sàng Dùng Ngay</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-text mb-4">
          Mẫu Thiết Kế Trợ Lý AI
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed">
          Tuyển tập 14 hướng dẫn hệ thống (System Prompt), danh sách công cụ gợi ý và tệp cấu hình <code className="text-accent bg-bg-surface px-1.5 py-0.5 rounded font-mono text-xs">.cursorrules</code> / <code className="text-accent bg-bg-surface px-1.5 py-0.5 rounded font-mono text-xs">CLAUDE.md</code> chuẩn mực, sẵn sàng tích hợp vào Cursor, Windsurf, Claude Code hoặc ChatGPT.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Tìm mẫu trợ lý AI"
            placeholder="Tìm mẫu trợ lý theo tên, vai trò hoặc công cụ..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg text-sm text-text placeholder-text-muted focus:outline-hidden focus:ring-2 focus:ring-accent transition-colors"
          />
        </div>

        {/* Mobile Horizontal Scroll for Role/Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide w-full md:w-auto -mx-2 px-2 md:mx-0 md:px-0">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={selectedCategory === c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-bg border border-border text-text-muted hover:text-text hover:border-accent/40'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Agents or Empty State */}
      {filteredAgents.length === 0 ? (
        <div className="rounded-2xl border border-border bg-bg-surface p-12 text-center shadow-2xs">
          <Bot className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-bold text-text mb-2">Không tìm thấy mẫu trợ lý phù hợp</h3>
          <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
            Không có mẫu trợ lý nào khớp với từ khóa &ldquo;{search}&rdquo; trong nhóm đã chọn.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-all shadow-2xs"
          >
            Xóa bộ lọc tìm kiếm
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-2xl border border-border bg-bg-surface p-6 shadow-2xs hover:shadow-card-hover hover:border-accent/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center font-bold shrink-0">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                        {agent.categoryLabel}
                      </span>
                      <h3 className="text-base font-bold text-text leading-snug">
                        {agent.name}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-bg border border-border text-text-muted shrink-0">
                    {agent.model.includes('claude')
                      ? 'Claude 3.5'
                      : agent.model.includes('gemini')
                      ? 'Gemini 1.5'
                      : agent.model.includes('deepseek-r1')
                      ? 'DeepSeek R1'
                      : agent.model.includes('deepseek')
                      ? 'DeepSeek V3'
                      : agent.model.includes('mini')
                      ? 'GPT-4o mini'
                      : 'GPT-4o'}
                  </span>
                </div>

                <p className="text-xs text-text-muted font-medium mb-3">
                  Vai trò: <span className="text-text font-semibold">{agent.role}</span>
                </p>

                <p className="text-sm text-text-muted mb-4 line-clamp-3 leading-relaxed">
                  {agent.description}
                </p>

                {/* Tools Tags */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    Công cụ tích hợp ({agent.tools.length}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[11px] px-2.5 py-0.5 rounded-lg bg-bg border border-border text-text-muted font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* System Prompt Snippet */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                      Hướng dẫn hệ thống (System Prompt)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopySystemPrompt(agent.systemPrompt, agent.id)}
                      className="text-[11px] text-accent hover:text-accent-hover hover:underline flex items-center gap-1 font-medium transition-colors"
                    >
                      {copiedId === agent.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span className={copiedId === agent.id ? 'text-emerald-500 font-semibold' : ''}>
                        {copiedId === agent.id ? 'Đã chép' : 'Sao chép'}
                      </span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-bg border border-border font-mono text-[11px] text-text-muted max-h-24 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                    {agent.systemPrompt}
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDownloadConfig(agent, 'cursor')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-accent/40 hover:text-accent text-text-muted transition-colors flex items-center gap-1 bg-bg shadow-2xs"
                    title="Tải cấu hình Cursor"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>.cursorrules</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadConfig(agent, 'claude')}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border hover:border-accent/40 hover:text-accent text-text-muted transition-colors flex items-center gap-1 bg-bg shadow-2xs"
                    title="Tải cấu hình Claude"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>CLAUDE.md</span>
                  </button>
                </div>

                <Link
                  href={`/playground?agent=${agent.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover hover:underline"
                >
                  <span>Thử trong Khu Thử Nghiệm AI →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
