'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Mail,
  GraduationCap,
  Briefcase,
  BarChart3,
  Megaphone,
  Building,
  UserCheck,
  Code2,
  Play,
  ArrowRight,
  CheckCircle2,
  FileInput,
  Sparkles,
  Users,
} from 'lucide-react';
import type { Skill } from '@/types';
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '@/lib/constants';
import { resolveCanonicalCategoryId } from '@/components/skill/categoryHelpers';

export interface WorkGroupDefinition {
  id: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  inputNeeded: string;
  expectedOutput: string;
  workspaceWorkflow?: {
    id: string;
    label: string;
    href: string;
  };
  categoryIds: string[];
  icon: typeof Mail;
}

const WORK_GROUPS: WorkGroupDefinition[] = [
  {
    id: 'viet-va-giao-tiep',
    title: 'Viết và giao tiếp',
    subtitle: 'Soạn email công sở, thư đề xuất, phản hồi khách hàng và biên tập văn bản trôi chảy.',
    targetAudience: 'Nhân viên văn phòng, Chăm sóc khách hàng, Quản lý dự án',
    inputNeeded: 'Người nhận, mục đích trao đổi, ý chính hoặc email gốc cần trả lời',
    expectedOutput: 'Bản thảo email lịch sự, đúng trọng tâm, có thể rút gọn hoặc đổi sang tiếng Anh ngay',
    workspaceWorkflow: {
      id: 'email-assistant',
      label: 'Mở Trợ lý Email trong AI Workspace',
      href: '/workspace?workflow=email-assistant',
    },
    categoryIds: ['writing', 'work'],
    icon: Mail,
  },
  {
    id: 'cong-viec-van-phong',
    title: 'Công việc văn phòng',
    subtitle: 'Tóm tắt biên bản cuộc họp, lập kế hoạch tuần, chuẩn bị phỏng vấn và bàn giao đầu việc.',
    targetAudience: 'Trưởng nhóm, Thư ký dự án, Chuyên viên nhân sự & Vận hành',
    inputNeeded: 'Ghi chú thô cuộc họp, danh sách việc tồn đọng hoặc mô tả vị trí công việc',
    expectedOutput: 'Tóm tắt điều hành, quyết định đã chốt, danh sách việc cần làm và câu hỏi còn bỏ ngỏ',
    workspaceWorkflow: {
      id: 'meeting-summary',
      label: 'Tóm tắt cuộc họp trong AI Workspace',
      href: '/workspace?workflow=meeting-summary',
    },
    categoryIds: ['work', 'legal'],
    icon: Briefcase,
  },
  {
    id: 'hoc-tap-va-nghien-cuu',
    title: 'Học tập và nghiên cứu',
    subtitle: 'Đọc hiểu tài liệu dài, hệ thống hóa kiến thức mới, tự học ngoại ngữ và ôn tập chủ động.',
    targetAudience: 'Sinh viên, Nghiên cứu viên, Người đi làm học thêm kỹ năng mới',
    inputNeeded: 'Đoạn văn bản tài liệu, bài báo chuyên ngành hoặc chủ đề cần nắm vững',
    expectedOutput: 'Luận điểm cốt lõi, bảng trích xuất thông tin, giải thích dễ hiểu và hỏi đáp bám sát văn bản',
    workspaceWorkflow: {
      id: 'document-analysis',
      label: 'Phân tích tài liệu trong AI Workspace',
      href: '/workspace?workflow=document-analysis',
    },
    categoryIds: ['learning', 'research', 'parenting'],
    icon: GraduationCap,
  },
  {
    id: 'phan-tich-du-lieu',
    title: 'Phân tích dữ liệu & Báo cáo',
    subtitle: 'Đọc bảng số liệu, đối chiếu báo cáo, bóc tách nguyên nhân gốc rễ và lập dự toán ngân sách.',
    targetAudience: 'Chuyên viên phân tích, Kế toán quản trị, Chủ doanh nghiệp nhỏ',
    inputNeeded: 'Báo cáo văn bản, bảng chỉ số thu chi hoặc câu hỏi cần kiểm chứng từ dữ liệu',
    expectedOutput: 'Bảng tổng hợp phát hiện chính, xu hướng nổi bật và các điểm thiếu dữ liệu cần lưu ý',
    workspaceWorkflow: {
      id: 'document-analysis',
      label: 'Trích xuất bảng dữ liệu trong AI Workspace',
      href: '/workspace?workflow=document-analysis',
    },
    categoryIds: ['research', 'finance'],
    icon: BarChart3,
  },
  {
    id: 'marketing-va-sang-tao',
    title: 'Marketing và sáng tạo',
    subtitle: 'Lên kịch bản video ngắn, viết bài truyền thông đa kênh, ý tưởng thiết kế và câu mở đầu thu hút.',
    targetAudience: 'Chuyên viên tiếp thị, Người sáng tạo nội dung, Thiết kế giao diện',
    inputNeeded: 'Sản phẩm/dịch vụ, chân dung khách hàng mục tiêu và kênh đăng tải',
    expectedOutput: 'Dàn ý nội dung, kịch bản phân cảnh, biến thể tiêu đề và gợi ý hình ảnh minh họa',
    workspaceWorkflow: {
      id: 'custom-prompt',
      label: 'Soạn nội dung trong AI Workspace',
      href: '/workspace?workflow=custom-prompt',
    },
    categoryIds: ['writing', 'design'],
    icon: Megaphone,
  },
  {
    id: 'kinh-doanh',
    title: 'Kinh doanh & Khởi nghiệp',
    subtitle: 'Kiểm chứng ý tưởng sản phẩm, tính toán kinh tế đơn vị, lập kế hoạch ra mắt và đàm phán.',
    targetAudience: 'Nhà sáng lập, Chủ cửa hàng, Người làm tự do (Freelancer)',
    inputNeeded: 'Mô hình kinh doanh, chi phí dự kiến, vấn đề của khách hàng mục tiêu',
    expectedOutput: 'Khung kiểm chứng nhu cầu, bảng phân tích rủi ro, kịch bản chào hàng và kế hoạch 30 ngày',
    categoryIds: ['sideproject', 'finance', 'legal'],
    icon: Building,
  },
  {
    id: 'quan-ly-ca-nhan',
    title: 'Quản lý cá nhân & Đời sống',
    subtitle: 'Quản lý thời gian, chi tiêu gia đình, lịch trình du lịch, sức khỏe thể chất và không gian sống.',
    targetAudience: 'Mọi cá nhân & gia đình muốn tổ chức cuộc sống khoa học hơn',
    inputNeeded: 'Quỹ thời gian hiện có, mục tiêu sức khỏe/tài chính hoặc điểm đến dự kiến',
    expectedOutput: 'Lịch trình theo ngày, danh sách chuẩn bị chi tiết và thói quen thực hành cụ thể',
    categoryIds: ['health', 'family', 'travel', 'home', 'entertainment'],
    icon: UserCheck,
  },
  {
    id: 'cong-nghe',
    title: 'Công nghệ & Kỹ thuật phần mềm',
    subtitle: 'Thiết kế hệ thống, rà soát mã nguồn, gỡ lỗi thực tế, viết chỉ dẫn hệ thống và tối ưu chi phí AI.',
    targetAudience: 'Lập trình viên, Kỹ sư AI, Kiến trúc sư phần mềm',
    inputNeeded: 'Đoạn mã nguồn, thông báo lỗi, yêu cầu kiến trúc hoặc thông số lưu lượng',
    expectedOutput: 'Phân tích lỗi gốc, mã nguồn cải tiến, cấu trúc chỉ dẫn AI và bảng ước tính chi phí token',
    categoryIds: ['coding', 'prompt-engineering'],
    icon: Code2,
  },
];

interface AIWorkHubProps {
  skills: Skill[];
}

export function AIWorkHub({ skills }: AIWorkHubProps) {
  const [activeGroupId, setActiveGroupId] = useState<string>(WORK_GROUPS[0].id);

  const activeGroup = useMemo(
    () => WORK_GROUPS.find((g) => g.id === activeGroupId) || WORK_GROUPS[0],
    [activeGroupId]
  );

  const matchingSkills = useMemo(() => {
    const catSet = new Set(activeGroup.categoryIds);
    return skills.filter((s) => catSet.has(resolveCanonicalCategoryId(s.categoryId)));
  }, [skills, activeGroup]);

  return (
    <div className="space-y-10">
      {/* 4-Step Flow Banner */}
      <div className="rounded-3xl border border-border bg-bg-surface p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
          {[
            { step: 'Bước 1', title: 'Chọn nhóm công việc', desc: 'Xác định đúng nhu cầu thực tế bạn đang cần giải quyết hôm nay.' },
            { step: 'Bước 2', title: 'Xem đầu vào & kết quả', desc: 'Biết trước cần chuẩn bị thông tin gì và AI sẽ trả về định dạng nào.' },
            { step: 'Bước 3', title: 'Tạo kết quả trong Workspace', desc: 'Chạy quy trình AI ngay trên trang hoặc mở mẫu câu lệnh chi tiết.' },
            { step: 'Bước 4', title: 'Chỉnh sửa & Lưu lại', desc: 'Biên tập kết quả trực tiếp, tải file Markdown hoặc lưu vào phiên làm việc.' },
          ].map((item) => (
            <div key={item.step} className="p-3.5 rounded-2xl bg-bg border border-border/80">
              <span className="text-[11px] font-mono font-bold uppercase text-accent block mb-1">
                {item.step}
              </span>
              <strong className="text-text font-bold block mb-1">{item.title}</strong>
              <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 8 Task Group Selector Grid */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-text mb-4">
          8 Nhóm Công Việc Thực Tế
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          role="tablist"
          aria-label="Chọn nhóm công việc"
        >
          {WORK_GROUPS.map((group) => {
            const Icon = group.icon;
            const isSelected = group.id === activeGroupId;
            return (
              <button
                key={group.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveGroupId(group.id)}
                className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-accent bg-accent/10 shadow-sm ring-1 ring-accent/40'
                    : 'border-border bg-bg-surface hover:border-accent/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isSelected ? 'bg-accent text-white' : 'bg-bg border border-border text-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-text">{group.title}</span>
                </div>
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{group.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Work Group Overview & Direct Execution */}
      <div className="rounded-3xl border border-accent/30 bg-bg-elevated p-6 sm:p-8 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              Nhóm việc đang chọn
            </span>
            <h3 className="text-2xl font-display font-bold text-text">{activeGroup.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{activeGroup.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {activeGroup.workspaceWorkflow && (
              <Link
                href={activeGroup.workspaceWorkflow.href}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm font-semibold shadow-sm transition-all"
              >
                <Play className="w-4 h-4" />
                <span>{activeGroup.workspaceWorkflow.label}</span>
              </Link>
            )}
            <Link
              href="/prompts"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-bg hover:border-accent/50 text-text text-sm font-medium transition-all"
            >
              <span>Xem tất cả câu lệnh mẫu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Problem / Audience / Input / Output Structured Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-bg border border-border">
            <div className="flex items-center gap-2 text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              <Users className="w-4 h-4 text-brand-500" />
              Phù hợp cho ai?
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{activeGroup.targetAudience}</p>
          </div>
          <div className="p-4 rounded-2xl bg-bg border border-border">
            <div className="flex items-center gap-2 text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              <FileInput className="w-4 h-4 text-accent" />
              Đầu vào bạn cần chuẩn bị
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{activeGroup.inputNeeded}</p>
          </div>
          <div className="p-4 rounded-2xl bg-bg border border-border">
            <div className="flex items-center gap-2 text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Kết quả bạn nhận được
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{activeGroup.expectedOutput}</p>
          </div>
        </div>
      </div>

      {/* Concrete Skills & Ready Workflows in this Group */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-5">
          <h3 className="text-lg font-bold text-text">
            Hướng dẫn &amp; Mẫu thực hành thuộc nhóm &ldquo;{activeGroup.title}&rdquo; ({matchingSkills.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matchingSkills.map((skill) => {
            const promptCount = skill.prompts?.length || 0;
            const firstPrompt = skill.prompts?.[0];

            return (
              <article
                key={skill.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-bg-surface p-5 shadow-sm hover:border-accent/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${DIFFICULTY_COLORS[skill.difficulty]}`}>
                      {DIFFICULTY_LABELS[skill.difficulty]}
                    </span>
                    <span className="text-xs text-text-muted">
                      {skill.estimatedTime} • {promptCount} mẫu câu lệnh
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-text leading-snug">
                    <Link href={`/skill/${skill.slug}`} className="hover:text-accent transition-colors">
                      {skill.name}
                    </Link>
                  </h4>

                  <p className="text-xs sm:text-sm text-text-muted line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>

                  {skill.whenToUse && skill.whenToUse.length > 0 && (
                    <div className="rounded-xl bg-bg p-3 border border-border/70 text-xs">
                      <span className="font-semibold text-text block mb-1">Khi nào nên dùng:</span>
                      <span className="text-text-muted line-clamp-2">{skill.whenToUse[0]}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-2">
                  <Link
                    href={`/skill/${skill.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-text hover:text-accent transition-colors"
                  >
                    <span>Xem hướng dẫn &amp; ví dụ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {firstPrompt && (
                    <Link
                      href={`/workspace?workflow=custom-prompt&promptId=${encodeURIComponent(firstPrompt.id)}`}
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          sessionStorage.setItem(
                            'ai_life_hub_workspace_draft_prompt',
                            JSON.stringify({
                              id: firstPrompt.id,
                              title: firstPrompt.name,
                              template: firstPrompt.template,
                              categoryId: skill.categoryId,
                            })
                          );
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent/10 hover:bg-accent text-accent hover:text-white text-xs font-semibold transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      <span>Tạo ngay</span>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
