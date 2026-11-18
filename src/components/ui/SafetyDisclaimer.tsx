import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { resolveCanonicalCategoryId } from '@/components/skill/categoryHelpers';

type SensitiveDomain = 'finance' | 'health' | 'legal';

const DOMAIN_DISCLAIMERS: Record<
  SensitiveDomain,
  {
    title: string;
    message: string;
    borderClass: string;
    iconClass: string;
  }
> = {
  finance: {
    title: 'Lưu ý an toàn thông tin Tài chính & Thuế',
    message:
      'Nội dung và phản hồi AI tại đây chỉ phục vụ mục đích tham khảo, lập kế hoạch cá nhân và học tập; không phải khuyến nghị đầu tư tài chính, tư vấn kế toán hay kê khai thuế chính thức. Hãy đối chiếu văn bản quy phạm hiện hành và tham vấn chuyên gia được cấp phép trước khi quyết định giao dịch.',
    borderClass: 'border-amber-500/35 bg-amber-500/5 dark:bg-amber-950/20',
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  health: {
    title: 'Lưu ý an toàn Y tế & Sức khỏe',
    message:
      'Thông tin do AI tổng hợp chỉ mang tính chất tham khảo lối sống và tìm hiểu kiến thức chung; tuyệt đối không thay thế chẩn đoán y khoa, phác đồ điều trị hoặc chỉ định của bác sĩ chuyên khoa. Khi có triệu chứng bất thường hoặc tình huống khẩn cấp, vui lòng đến cơ sở y tế uy tín.',
    borderClass: 'border-rose-500/35 bg-rose-500/5 dark:bg-rose-950/20',
    iconClass: 'text-rose-600 dark:text-rose-400',
  },
  legal: {
    title: 'Lưu ý an toàn Pháp lý & Thủ tục hành chính',
    message:
      'Các mẫu phân tích và hướng dẫn chỉ hỗ trợ tra cứu sơ bộ; không cấu thành ý kiến tư vấn pháp lý chính thức của luật sư hay văn bản hướng dẫn của cơ quan nhà nước. Quy định pháp luật có thể thay đổi theo thời điểm — vui lòng kiểm tra văn bản gốc trên Cổng Dịch vụ công Quốc gia hoặc hỏi ý kiến luật sư khi ký kết hợp đồng quan trọng.',
    borderClass: 'border-blue-500/35 bg-blue-500/5 dark:bg-blue-950/20',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
};

export function resolveSensitiveDomain(categoryIdOrSlug?: string): SensitiveDomain | null {
  if (!categoryIdOrSlug) return null;
  const canonical = resolveCanonicalCategoryId(categoryIdOrSlug);
  if (canonical === 'finance' || canonical === 'health' || canonical === 'legal') {
    return canonical;
  }
  return null;
}

interface SafetyDisclaimerProps {
  categoryId?: string;
  compact?: boolean;
}

export function SafetyDisclaimer({ categoryId, compact = false }: SafetyDisclaimerProps) {
  const domain = resolveSensitiveDomain(categoryId);
  if (!domain) return null;

  const config = DOMAIN_DISCLAIMERS[domain];

  return (
    <aside
      role="note"
      aria-label={config.title}
      className={`rounded-2xl border ${config.borderClass} ${compact ? 'p-3.5' : 'p-4 sm:p-5'} text-xs sm:text-sm leading-relaxed`}
    >
      <div className="flex items-start gap-3">
        {domain === 'health' ? (
          <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconClass}`} aria-hidden="true" />
        ) : (
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconClass}`} aria-hidden="true" />
        )}
        <div>
          <strong className="font-bold text-text block mb-1">{config.title}</strong>
          <p className="text-text-muted text-xs sm:text-[13px] leading-relaxed">{config.message}</p>
        </div>
      </div>
    </aside>
  );
}
