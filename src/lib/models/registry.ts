/**
 * Shared Verified AI Model Registry
 * Single source of truth for Model Comparison (/compare), Token Calculator (/tools/token-calculator),
 * System Prompt Builder (/tools/system-prompt-builder), and AI Workspace (/workspace).
 *
 * Verification basis: Official provider pricing & model documentation + live v1beta/models & OpenRouter API metadata.
 * Last verified: 2026-11-18
 */

export type ModelProvider = 'Anthropic' | 'OpenAI' | 'DeepSeek' | 'Google' | 'Meta' | 'Open Source';
export type ModelLicense = 'Proprietary' | 'Open Weights';
export type ModelStatus = 'stable' | 'preview' | 'deprecated' | 'shutdown';
export type LatencyCategory = 'instant' | 'fast' | 'balanced' | 'reasoning';

export interface VerifiedBenchmark {
  benchmarkId: 'swe_bench_verified' | 'math_500' | 'mmlu';
  benchmarkName: string;
  score: number;
  unit: '%';
  modelVersion: string;
  sourceName: string;
  sourceUrl: string;
  evaluatedAt: string;
  methodology: string;
  limitations: string;
}

export interface RegisteredModel {
  id: string;
  name: string;
  apiModelId: string;
  provider: ModelProvider;
  providerDisplay: string;
  license: ModelLicense;
  status: ModelStatus;
  statusNote?: string;
  contextWindowTokens: number;
  contextWindowLabel: string;
  maxOutputTokens: number;
  maxOutputLabel: string;
  inputPricePer1M: number;
  outputPricePer1M: number;
  cachedInputPricePer1M: number | null;
  currency: 'USD';
  pricingUnit: '1.000.000 token';
  pricingNote?: string;
  officialDocsUrl: string;
  verifiedAt: string;
  latencyCategory: LatencyCategory;
  badge?: string;
  bestFor: string;
  strengths: string[];
  recommendedUseCases: string[];
  benchmarks: VerifiedBenchmark[];
  showInCompareDefault: boolean;
  showInCalculator: boolean;
}

export const REGISTRY_VERIFIED_DATE = '2026-11-18';
export const REGISTRY_VERIFIED_DISPLAY = '18/11/2026';

/**
 * Manually maintained USD -> VND estimate used for cost planning.
 * Explicitly disclosed in UI as a manual reference estimate, NOT live bank/FX market data.
 */
export const DEFAULT_USD_TO_VND = 25450;
export const EXCHANGE_RATE_VERIFIED_DISPLAY = '18/11/2026';

export const MODEL_STATUS_META: Record<
  ModelStatus,
  { label: string; badgeClass: string; description: string }
> = {
  stable: {
    label: 'Ổn định (Stable)',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    description: 'Đang hoạt động chính thức cho hệ thống thực tế.',
  },
  preview: {
    label: 'Thử nghiệm (Preview)',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    description: 'Bản xem trước công khai; giới hạn tốc độ hoặc giá có thể thay đổi.',
  },
  deprecated: {
    label: 'Thế hệ cũ (Deprecated)',
    badgeClass: 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400',
    description: 'Đã có lộ trình thay thế bằng thế hệ mới hơn; không khuyên dùng cho dự án mới.',
  },
  shutdown: {
    label: 'Đã ngừng hỗ trợ (Shutdown)',
    badgeClass: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
    description: 'Điểm cuối API gốc đã đóng; chỉ giữ lại để tra cứu lịch sử và chuyển đổi.',
  },
};

export const MODEL_LICENSE_LABELS: Record<ModelLicense, string> = {
  Proprietary: 'Thương mại (Qua API)',
  'Open Weights': 'Trọng số mở (Tự triển khai được)',
};

export const MODEL_LATENCY_LABELS: Record<LatencyCategory, string> = {
  instant: 'Phản hồi tức thì',
  fast: 'Tốc độ nhanh',
  balanced: 'Cân bằng',
  reasoning: 'Suy luận từng bước sâu (Chậm hơn)',
};

export function formatVndRounded(usdAmount: number, usdToVndRate: number = DEFAULT_USD_TO_VND): string {
  const safeUsd = Number.isFinite(usdAmount) ? Math.max(0, usdAmount) : 0;
  const safeRate = Number.isFinite(usdToVndRate) && usdToVndRate > 0 ? usdToVndRate : DEFAULT_USD_TO_VND;
  const roundedVnd = Math.round(safeUsd * safeRate);
  return `${roundedVnd.toLocaleString('vi-VN')} đ`;
}

export function formatUsdPrice(price: number): string {
  if (price < 0.1) return `$${price.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}`;
  if (Number.isInteger(price)) return `$${price.toFixed(2)}`;
  const twoDec = price.toFixed(2);
  if (Math.abs(Number(twoDec) - price) < 0.0001) return `$${twoDec}`;
  return `$${price.toFixed(3).replace(/0+$/, '')}`;
}

export function getBenchmarkScore(
  model: RegisteredModel,
  benchmarkId: VerifiedBenchmark['benchmarkId']
): VerifiedBenchmark | undefined {
  return model.benchmarks.find((b) => b.benchmarkId === benchmarkId);
}

export const MODEL_REGISTRY: RegisteredModel[] = [
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    apiModelId: 'claude-sonnet-4-6',
    provider: 'Anthropic',
    providerDisplay: 'Anthropic',
    license: 'Proprietary',
    status: 'stable',
    contextWindowTokens: 1_000_000,
    contextWindowLabel: '1M',
    maxOutputTokens: 128_000,
    maxOutputLabel: '128k',
    inputPricePer1M: 3.0,
    outputPricePer1M: 15.0,
    cachedInputPricePer1M: 0.3,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    pricingNote: 'Giá tiêu chuẩn cho ngữ cảnh <= 200k token; Prompt Caching giảm 90% phí đọc lại.',
    officialDocsUrl: 'https://docs.anthropic.com/en/docs/about-claude/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'fast',
    badge: 'Lập trình & Trợ lý AI',
    bestFor: 'Lập trình phần mềm chuyên sâu & Điều phối trợ lý tự động',
    strengths: [
      'Độ chính xác cao khi đọc hiểu mã nguồn lớn và làm theo chỉ dẫn hệ thống nhiều tầng',
      'Hỗ trợ ngữ cảnh mở rộng tới 1.000.000 token và đầu ra 128k token',
      'Lưu bộ nhớ đệm (Prompt Caching) chỉ $0.30 / 1M token đọc lại',
    ],
    recommendedUseCases: [
      'Xây dựng tính năng phần mềm toàn phần và rà soát lỗi mã nguồn',
      'Soạn thảo tài liệu kỹ thuật, hợp đồng và phân tích báo cáo dài',
      'Điều phối quy trình làm việc nhiều bước cần tuân thủ định dạng chặt chẽ',
    ],
    benchmarks: [
      {
        benchmarkId: 'swe_bench_verified',
        benchmarkName: 'SWE-bench Verified',
        score: 72.7,
        unit: '%',
        modelVersion: 'Claude Sonnet 4 series (Anthropic System Card)',
        sourceName: 'Anthropic Official Model Card',
        sourceUrl: 'https://www.anthropic.com/claude/sonnet',
        evaluatedAt: '2025-05',
        methodology: 'Giải quyết issue thực tế trên kho mã Python kiểm chứng độc lập (không dùng chế độ tính toán mở rộng).',
        limitations: 'Chỉ đo tác vụ kho mã Python; hiệu quả thực tế phụ thuộc bộ công cụ (scaffold) đi kèm.',
      },
    ],
    showInCompareDefault: true,
    showInCalculator: true,
  },
  {
    id: 'claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    apiModelId: 'claude-haiku-4-5',
    provider: 'Anthropic',
    providerDisplay: 'Anthropic',
    license: 'Proprietary',
    status: 'stable',
    contextWindowTokens: 200_000,
    contextWindowLabel: '200k',
    maxOutputTokens: 64_000,
    maxOutputLabel: '64k',
    inputPricePer1M: 1.0,
    outputPricePer1M: 5.0,
    cachedInputPricePer1M: 0.1,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    officialDocsUrl: 'https://docs.anthropic.com/en/docs/about-claude/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'instant',
    bestFor: 'Tác vụ phản hồi tức thì & Trợ lý phụ trợ khối lượng lớn',
    strengths: [
      'Tốc độ phản hồi cực nhanh cho trải nghiệm tương tác trực tiếp',
      'Đầu ra tối đa 64k token kèm Prompt Caching $0.10 / 1M token',
      'Chi phí bằng 1/3 so với dòng Sonnet cho các bước phân loại và trích xuất',
    ],
    recommendedUseCases: [
      'Phân loại yêu cầu khách hàng và trích xuất dữ liệu có cấu trúc',
      'Trợ lý phụ trợ chạy song song trong hệ thống nhiều bước',
      'Tóm tắt nhanh email và biên bản họp ngắn',
    ],
    benchmarks: [],
    showInCompareDefault: true,
    showInCalculator: true,
  },
  {
    id: 'gpt-4-1',
    name: 'OpenAI GPT-4.1',
    apiModelId: 'gpt-4.1',
    provider: 'OpenAI',
    providerDisplay: 'OpenAI',
    license: 'Proprietary',
    status: 'stable',
    contextWindowTokens: 1_047_576,
    contextWindowLabel: '1M',
    maxOutputTokens: 32_768,
    maxOutputLabel: '32k',
    inputPricePer1M: 2.0,
    outputPricePer1M: 8.0,
    cachedInputPricePer1M: 0.5,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    pricingNote: 'Giảm 75% chi phí token đầu vào khi khớp bộ nhớ đệm tự động ($0.50 / 1M).',
    officialDocsUrl: 'https://platform.openai.com/docs/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'fast',
    badge: 'Ngữ cảnh 1M chuẩn',
    bestFor: 'Bám sát chỉ dẫn phức tạp, lập trình & Đọc tài liệu 1 triệu token',
    strengths: [
      'Cửa sổ ngữ cảnh hơn 1 triệu token với mức giá tối ưu hơn thế hệ tiền nhiệm 20%',
      'Cải thiện mạnh khả năng tuân thủ định dạng và sửa mã nguồn theo diff',
      'Tự động giảm 75% phí đầu vào khi tái sử dụng ngữ cảnh lặp lại',
    ],
    recommendedUseCases: [
      'Phân tích hồ sơ, tài liệu dài hàng trăm trang trong một lần gọi',
      'Ứng dụng doanh nghiệp cần đầu ra JSON chuẩn xác',
      'Viết và kiểm tra mã nguồn giao diện, API',
    ],
    benchmarks: [
      {
        benchmarkId: 'swe_bench_verified',
        benchmarkName: 'SWE-bench Verified',
        score: 54.6,
        unit: '%',
        modelVersion: 'gpt-4.1-2025-04-14',
        sourceName: 'OpenAI GPT-4.1 Release Report',
        sourceUrl: 'https://openai.com/index/gpt-4-1/',
        evaluatedAt: '2025-04',
        methodology: 'Tỷ lệ giải quyết thành công bộ 500 bài toán sửa lỗi phần mềm thực tế của OpenAI công bố.',
        limitations: 'Điểm số do nhà phát triển tự công bố trên tập SWE-bench Verified tiêu chuẩn.',
      },
      {
        benchmarkId: 'mmlu',
        benchmarkName: 'MMLU',
        score: 90.2,
        unit: '%',
        modelVersion: 'gpt-4.1-2025-04-14',
        sourceName: 'OpenAI GPT-4.1 Release Report',
        sourceUrl: 'https://openai.com/index/gpt-4-1/',
        evaluatedAt: '2025-04',
        methodology: 'Đánh giá câu hỏi trắc nghiệm đa lĩnh vực học thuật và chuyên môn.',
        limitations: 'MMLU tiếng Anh không phản ánh toàn bộ chất lượng diễn đạt tiếng Việt tự nhiên.',
      },
    ],
    showInCompareDefault: true,
    showInCalculator: true,
  },
  {
    id: 'gpt-4-1-mini',
    name: 'OpenAI GPT-4.1 mini',
    apiModelId: 'gpt-4.1-mini',
    provider: 'OpenAI',
    providerDisplay: 'OpenAI',
    license: 'Proprietary',
    status: 'stable',
    contextWindowTokens: 1_047_576,
    contextWindowLabel: '1M',
    maxOutputTokens: 32_768,
    maxOutputLabel: '32k',
    inputPricePer1M: 0.4,
    outputPricePer1M: 1.6,
    cachedInputPricePer1M: 0.1,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    officialDocsUrl: 'https://platform.openai.com/docs/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'instant',
    badge: 'Cân bằng giá/hiệu năng',
    bestFor: 'Ứng dụng sản phẩm số lượng người dùng lớn cần ngữ cảnh 1M giá tiết kiệm',
    strengths: [
      'Giữ nguyên ngữ cảnh 1 triệu token với mức giá chỉ bằng 1/5 bản đầy đủ',
      'Độ trễ thấp phù hợp làm mô hình mặc định cho sản phẩm SaaS',
    ],
    recommendedUseCases: ['Trợ lý viết email, tóm tắt cuộc họp', 'Hỏi đáp trên tài liệu dài'],
    benchmarks: [],
    showInCompareDefault: false,
    showInCalculator: true,
  },
  {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o',
    apiModelId: 'gpt-4o',
    provider: 'OpenAI',
    providerDisplay: 'OpenAI',
    license: 'Proprietary',
    status: 'stable',
    contextWindowTokens: 128_000,
    contextWindowLabel: '128k',
    maxOutputTokens: 16_384,
    maxOutputLabel: '16k',
    inputPricePer1M: 2.5,
    outputPricePer1M: 10.0,
    cachedInputPricePer1M: 1.25,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    officialDocsUrl: 'https://platform.openai.com/docs/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'fast',
    badge: 'Phổ biến rộng rãi',
    bestFor: 'Xử lý đa phương thức (Chữ, Ảnh, Âm thanh) ổn định và phổ biến',
    strengths: [
      'Xử lý đồng nhất văn bản và hình ảnh với độ ổn định cao',
      'Tương thích rộng rãi với hầu hết thư viện và công cụ hiện có',
      'Lưu bộ nhớ đệm tự động giảm 50% chi phí đầu vào ($1.25 / 1M)',
    ],
    recommendedUseCases: [
      'Phân tích ảnh chụp tài liệu, biểu đồ kèm văn bản',
      'Soạn thảo nội dung văn phòng và giao tiếp đa ngôn ngữ',
      'Làm mốc tham chiếu chi phí khi lập ngân sách AI',
    ],
    benchmarks: [
      {
        benchmarkId: 'mmlu',
        benchmarkName: 'MMLU',
        score: 88.7,
        unit: '%',
        modelVersion: 'gpt-4o-2024-08-06',
        sourceName: 'OpenAI Simple-Evals Official Repo',
        sourceUrl: 'https://openai.com/index/hello-gpt-4o/',
        evaluatedAt: '2024-08',
        methodology: '0-shot Chain-of-Thought trên tập MMLU tiêu chuẩn.',
        limitations: 'Đã có dòng GPT-4.1 mới hơn với chi phí thấp hơn cho tác vụ thuần văn bản và lập trình.',
      },
    ],
    showInCompareDefault: true,
    showInCalculator: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o mini',
    apiModelId: 'gpt-4o-mini',
    provider: 'OpenAI',
    providerDisplay: 'OpenAI',
    license: 'Proprietary',
    status: 'stable',
    contextWindowTokens: 128_000,
    contextWindowLabel: '128k',
    maxOutputTokens: 16_384,
    maxOutputLabel: '16k',
    inputPricePer1M: 0.15,
    outputPricePer1M: 0.6,
    cachedInputPricePer1M: 0.075,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    officialDocsUrl: 'https://platform.openai.com/docs/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'instant',
    badge: 'Tiết kiệm cao',
    bestFor: 'Tác vụ văn bản ngắn chi phí thấp và tốc độ nhanh',
    strengths: [
      'Chi phí đầu vào chỉ $0.15 / 1M token cho các tác vụ cơ bản',
      'Phản hồi nhanh cho chatbot chăm sóc khách hàng và phân loại thẻ',
    ],
    recommendedUseCases: ['Biên tập câu chữ ngắn', 'Trích xuất thông tin đơn giản'],
    benchmarks: [],
    showInCompareDefault: false,
    showInCalculator: true,
  },
  {
    id: 'openai-o3',
    name: 'OpenAI o3',
    apiModelId: 'o3',
    provider: 'OpenAI',
    providerDisplay: 'OpenAI',
    license: 'Proprietary',
    status: 'stable',
    contextWindowTokens: 200_000,
    contextWindowLabel: '200k',
    maxOutputTokens: 100_000,
    maxOutputLabel: '100k',
    inputPricePer1M: 2.0,
    outputPricePer1M: 8.0,
    cachedInputPricePer1M: 0.5,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    pricingNote: 'Token đầu ra bao gồm cả phần token suy nghĩ ẩn bên trong mô hình.',
    officialDocsUrl: 'https://platform.openai.com/docs/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'reasoning',
    badge: 'Suy luận chuyên sâu',
    bestFor: 'Bài toán suy luận nhiều bước, Toán học, Khoa học & Kiến trúc hệ thống',
    strengths: [
      'Tự kiểm tra giả thuyết bằng suy luận từng bước (Chain-of-Thought) trước khi trả lời',
      'Đầu ra tối đa tới 100.000 token cho báo cáo phân tích dài',
      'Mức giá đã giảm mạnh còn $2.00 / $8.00 trên mỗi triệu token',
    ],
    recommendedUseCases: [
      'Phân tích nguyên nhân gốc rễ lỗi hệ thống phức tạp',
      'Giải bài toán tối ưu hóa, tài chính định lượng và thuật toán',
      'Rà soát logic hợp đồng hoặc đặc tả kỹ thuật nhiều ràng buộc',
    ],
    benchmarks: [
      {
        benchmarkId: 'swe_bench_verified',
        benchmarkName: 'SWE-bench Verified',
        score: 69.1,
        unit: '%',
        modelVersion: 'o3-2025-04-16',
        sourceName: 'OpenAI o3 and o4-mini System Card',
        sourceUrl: 'https://openai.com/index/introducing-o3-and-o4-mini/',
        evaluatedAt: '2025-04',
        methodology: 'Đánh giá trên tập SWE-bench Verified với mức suy luận tiêu chuẩn của OpenAI.',
        limitations: 'Tổng chi phí thực tế mỗi lượt cao hơn mô hình thường do phát sinh token suy nghĩ ẩn.',
      },
    ],
    showInCompareDefault: true,
    showInCalculator: true,
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Google Gemini 2.5 Pro',
    apiModelId: 'gemini-2.5-pro',
    provider: 'Google',
    providerDisplay: 'Google AI',
    license: 'Proprietary',
    status: 'stable',
    contextWindowTokens: 1_048_576,
    contextWindowLabel: '1M',
    maxOutputTokens: 65_536,
    maxOutputLabel: '65k',
    inputPricePer1M: 1.25,
    outputPricePer1M: 10.0,
    cachedInputPricePer1M: 0.125,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    pricingNote: 'Áp dụng cho lời nhắc <= 200k token ($1.25 đầu vào / $10.00 đầu ra); trên 200k token tính bậc $2.50 / $15.00.',
    officialDocsUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'reasoning',
    badge: 'Tài liệu dài & Tư duy',
    bestFor: 'Đọc hiểu kho tài liệu lớn 1 triệu token, phân tích đa phương thức & lập trình',
    strengths: [
      'Sức chứa 1.048.576 token đầu vào và 65.536 token đầu ra (xác thực trực tiếp từ Gemini API)',
      'Tích hợp sẵn khả năng suy luận sâu có thể điều chỉnh ngân sách suy nghĩ',
      'Chi phí lưu bộ nhớ đệm cực thấp ($0.125 / 1M token đọc lại)',
    ],
    recommendedUseCases: [
      'Đọc và đối chiếu nhiều tài liệu PDF, báo cáo hoặc toàn bộ kho mã nguồn',
      'Phân tích video, âm thanh và tài liệu kỹ thuật dài',
      'Soạn thảo báo cáo chuyên sâu có trích dẫn từ văn bản cung cấp',
    ],
    benchmarks: [
      {
        benchmarkId: 'swe_bench_verified',
        benchmarkName: 'SWE-bench Verified',
        score: 63.8,
        unit: '%',
        modelVersion: 'gemini-2.5-pro',
        sourceName: 'Google DeepMind Gemini 2.5 Technical Report',
        sourceUrl: 'https://deepmind.google/technologies/gemini/pro/',
        evaluatedAt: '2025-05',
        methodology: 'Đánh giá tác nhân sửa lỗi phần mềm tùy chỉnh của Google DeepMind trên SWE-bench Verified.',
        limitations: 'Cần lưu ý bậc giá tăng gấp đôi nếu tổng độ dài đầu vào vượt mốc 200.000 token.',
      },
    ],
    showInCompareDefault: true,
    showInCalculator: true,
  },
  {
    id: 'gemini-2-5-flash',
    name: 'Google Gemini 2.5 Flash',
    apiModelId: 'gemini-2.5-flash',
    provider: 'Google',
    providerDisplay: 'Google AI',
    license: 'Proprietary',
    status: 'stable',
    contextWindowTokens: 1_048_576,
    contextWindowLabel: '1M',
    maxOutputTokens: 65_536,
    maxOutputLabel: '65k',
    inputPricePer1M: 0.3,
    outputPricePer1M: 2.5,
    cachedInputPricePer1M: 0.03,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    officialDocsUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'instant',
    badge: 'Nhanh & Kinh tế',
    bestFor: 'Thực thi công việc hàng ngày tốc độ cao với ngữ cảnh 1M token',
    strengths: [
      'Cân bằng xuất sắc giữa tốc độ phản hồi nhanh, ngữ cảnh 1M và chi phí thấp',
      'Hỗ trợ gói miễn phí giới hạn trên Google AI Studio để thử nghiệm sản phẩm',
      'Lưu bộ nhớ đệm giảm 90% còn $0.03 / 1M token',
    ],
    recommendedUseCases: [
      'Trợ lý viết email, tóm tắt cuộc họp và phân tích tài liệu trong AI Workspace',
      'Hệ thống hỏi đáp tài liệu nội bộ phản hồi thời gian thực',
      'Xử lý văn bản tiếng Việt số lượng lớn mỗi ngày',
    ],
    benchmarks: [],
    showInCompareDefault: true,
    showInCalculator: true,
  },
  {
    id: 'gemini-2-5-flash-lite',
    name: 'Google Gemini 2.5 Flash-Lite',
    apiModelId: 'gemini-2.5-flash-lite',
    provider: 'Google',
    providerDisplay: 'Google AI',
    license: 'Proprietary',
    status: 'stable',
    contextWindowTokens: 1_048_576,
    contextWindowLabel: '1M',
    maxOutputTokens: 65_536,
    maxOutputLabel: '65k',
    inputPricePer1M: 0.1,
    outputPricePer1M: 0.4,
    cachedInputPricePer1M: 0.01,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    officialDocsUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'instant',
    badge: 'Rẻ nhất ngữ cảnh 1M',
    bestFor: 'Xử lý khối lượng cực lớn với ngân sách tối thiểu',
    strengths: [
      'Mức giá đầu vào chỉ $0.10 / 1M và đầu ra $0.40 / 1M token',
      'Vẫn giữ trọn cửa sổ ngữ cảnh 1 triệu token',
    ],
    recommendedUseCases: ['Phân loại hàng loạt', 'Dịch thuật & chuẩn hóa dữ liệu quy mô lớn'],
    benchmarks: [],
    showInCompareDefault: false,
    showInCalculator: true,
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    apiModelId: 'deepseek-chat',
    provider: 'DeepSeek',
    providerDisplay: 'DeepSeek',
    license: 'Open Weights',
    status: 'stable',
    contextWindowTokens: 163_840,
    contextWindowLabel: '164k',
    maxOutputTokens: 16_384,
    maxOutputLabel: '16k',
    inputPricePer1M: 0.27,
    outputPricePer1M: 1.1,
    cachedInputPricePer1M: 0.07,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    pricingNote: 'Giá tiêu chuẩn công bố trên DeepSeek API (khung giờ thấp điểm có thể giảm thêm theo chính sách hãng).',
    officialDocsUrl: 'https://api-docs.deepseek.com/quick_start/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'fast',
    badge: 'Tối ưu chi phí',
    bestFor: 'Tiết kiệm chi phí tối đa cho tác vụ viết lách, dịch thuật & xử lý văn bản',
    strengths: [
      'Chất lượng ngôn ngữ và lập trình rất tốt trong tầm giá dưới $1.20 / 1M đầu ra',
      'Trọng số mở cho phép doanh nghiệp tự triển khai trên hạ tầng riêng khi cần',
      'Cơ chế lưu bộ nhớ đệm tự động trên ổ cứng giảm mạnh phí đầu vào xuống $0.07 / 1M',
    ],
    recommendedUseCases: [
      'Tóm tắt văn bản, biên tập bài viết và xử lý dữ liệu hàng loạt',
      'Chatbot hỗ trợ người dùng với chi phí vận hành rất thấp',
      'Tích hợp qua API tương thích chuẩn OpenAI',
    ],
    benchmarks: [
      {
        benchmarkId: 'swe_bench_verified',
        benchmarkName: 'SWE-bench Verified',
        score: 42.0,
        unit: '%',
        modelVersion: 'DeepSeek-V3 (671B MoE)',
        sourceName: 'DeepSeek-V3 Technical Report (arXiv:2412.19437)',
        sourceUrl: 'https://arxiv.org/abs/2412.19437',
        evaluatedAt: '2024-12',
        methodology: 'Đánh giá chính thức trong báo cáo kỹ thuật DeepSeek-V3.',
        limitations: 'Các bản cập nhật điểm phụ (như V3-0324 / V3.1) có thông số thực tế cao hơn bản gốc.',
      },
      {
        benchmarkId: 'math_500',
        benchmarkName: 'MATH-500',
        score: 90.2,
        unit: '%',
        modelVersion: 'DeepSeek-V3 (671B MoE)',
        sourceName: 'DeepSeek-V3 Technical Report (arXiv:2412.19437)',
        sourceUrl: 'https://arxiv.org/abs/2412.19437',
        evaluatedAt: '2024-12',
        methodology: 'Đánh giá giải toán tự luận trên tập 500 bài MATH.',
        limitations: 'Đo trên tiếng Anh/ký hiệu toán học chuẩn.',
      },
      {
        benchmarkId: 'mmlu',
        benchmarkName: 'MMLU',
        score: 88.5,
        unit: '%',
        modelVersion: 'DeepSeek-V3 (671B MoE)',
        sourceName: 'DeepSeek-V3 Technical Report (arXiv:2412.19437)',
        sourceUrl: 'https://arxiv.org/abs/2412.19437',
        evaluatedAt: '2024-12',
        methodology: '5-shot MMLU tiêu chuẩn.',
        limitations: 'Tốc độ phản hồi trên API quốc tế của DeepSeek đôi khi dao động vào giờ cao điểm.',
      },
    ],
    showInCompareDefault: true,
    showInCalculator: true,
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    apiModelId: 'deepseek-reasoner',
    provider: 'DeepSeek',
    providerDisplay: 'DeepSeek',
    license: 'Open Weights',
    status: 'stable',
    contextWindowTokens: 163_840,
    contextWindowLabel: '164k',
    maxOutputTokens: 32_768,
    maxOutputLabel: '32k',
    inputPricePer1M: 0.55,
    outputPricePer1M: 2.19,
    cachedInputPricePer1M: 0.14,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    officialDocsUrl: 'https://api-docs.deepseek.com/quick_start/pricing',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'reasoning',
    badge: 'Suy luận trọng số mở',
    bestFor: 'Suy luận logic, Toán học & Giải thuật với chi phí thấp và trọng số mở',
    strengths: [
      'Trả về chuỗi suy nghĩ từng bước minh bạch trước câu trả lời chính thức',
      'Chi phí suy luận thấp bậc nhất thị trường ($0.55 đầu vào / $2.19 đầu ra)',
      'Giấy phép mở MIT cho phép chưng cất và tự triển khai nội bộ',
    ],
    recommendedUseCases: [
      'Kiểm tra tính chặt chẽ logic, giải toán và thiết kế thuật toán',
      'Đối chiếu chéo kết quả phân tích phức tạp với chi phí tiết kiệm',
      'Nghiên cứu mô hình suy luận tự vận hành',
    ],
    benchmarks: [
      {
        benchmarkId: 'swe_bench_verified',
        benchmarkName: 'SWE-bench Verified',
        score: 49.2,
        unit: '%',
        modelVersion: 'DeepSeek-R1',
        sourceName: 'DeepSeek-R1 Technical Report (arXiv:2501.12948)',
        sourceUrl: 'https://arxiv.org/abs/2501.12948',
        evaluatedAt: '2025-01',
        methodology: 'Đánh giá trên tập SWE-bench Verified công bố trong bài báo gốc.',
        limitations: 'Thời gian chờ chữ đầu tiên lâu hơn do mô hình phải sinh phần suy nghĩ trước.',
      },
      {
        benchmarkId: 'math_500',
        benchmarkName: 'MATH-500',
        score: 97.3,
        unit: '%',
        modelVersion: 'DeepSeek-R1',
        sourceName: 'DeepSeek-R1 Technical Report (arXiv:2501.12948)',
        sourceUrl: 'https://arxiv.org/abs/2501.12948',
        evaluatedAt: '2025-01',
        methodology: 'Pass@1 trên tập kiểm thử toán học MATH-500.',
        limitations: 'Tổng lượng token đầu ra cao hơn mô hình thường vì tính cả token suy nghĩ.',
      },
      {
        benchmarkId: 'mmlu',
        benchmarkName: 'MMLU',
        score: 90.8,
        unit: '%',
        modelVersion: 'DeepSeek-R1',
        sourceName: 'DeepSeek-R1 Technical Report (arXiv:2501.12948)',
        sourceUrl: 'https://arxiv.org/abs/2501.12948',
        evaluatedAt: '2025-01',
        methodology: 'Đánh giá kiến thức tổng hợp đa ngành MMLU.',
        limitations: 'Không tối ưu cho các tác vụ hội thoại ngắn cần phản hồi tức thì.',
      },
    ],
    showInCompareDefault: true,
    showInCalculator: true,
  },
  {
    id: 'llama-3-3-70b',
    name: 'Meta Llama 3.3 70B',
    apiModelId: 'meta-llama/llama-3.3-70b-instruct',
    provider: 'Meta',
    providerDisplay: 'Meta (Hạ tầng đám mây / Tự chủ)',
    license: 'Open Weights',
    status: 'stable',
    statusNote: 'Mô hình trọng số mở; mức giá hiển thị tham chiếu theo biểu phí API đám mây phổ biến (Groq / Together). Tự chạy trên máy chủ riêng không tốn phí token.',
    contextWindowTokens: 128_000,
    contextWindowLabel: '128k',
    maxOutputTokens: 32_768,
    maxOutputLabel: '32k',
    inputPricePer1M: 0.59,
    outputPricePer1M: 0.79,
    cachedInputPricePer1M: null,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    pricingNote: 'Giá tham chiếu dịch vụ lưu trữ Groq Cloud; giá thay đổi tùy nhà cung cấp hạ tầng.',
    officialDocsUrl: 'https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_3/',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'fast',
    bestFor: 'Triển khai riêng tư trên máy chủ nội bộ doanh nghiệp (On-premise)',
    strengths: [
      'Cài đặt độc lập hoàn toàn trong mạng nội bộ qua vLLM, TGI hoặc Ollama',
      'Cộng đồng tinh chỉnh (fine-tuning) phong phú và tài liệu minh bạch',
      'Không phụ thuộc nhà cung cấp API độc quyền bên ngoài',
    ],
    recommendedUseCases: [
      'Xử lý dữ liệu nhạy cảm nội bộ không được phép gửi ra đám mây công cộng',
      'Tinh chỉnh mô hình chuyên biệt cho nghiệp vụ riêng của tổ chức',
    ],
    benchmarks: [
      {
        benchmarkId: 'math_500',
        benchmarkName: 'MATH',
        score: 77.0,
        unit: '%',
        modelVersion: 'Llama-3.3-70B-Instruct',
        sourceName: 'Meta Official Llama 3.3 Model Card',
        sourceUrl: 'https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/MODEL_CARD.md',
        evaluatedAt: '2024-12',
        methodology: '0-shot Chain-of-Thought trên tập MATH theo công bố của Meta.',
        limitations: 'Cần máy chủ GPU tối thiểu ~40GB–80GB VRAM (ở dạng lượng tử hóa 4-bit hoặc 8-bit) khi tự vận hành.',
      },
      {
        benchmarkId: 'mmlu',
        benchmarkName: 'MMLU',
        score: 86.0,
        unit: '%',
        modelVersion: 'Llama-3.3-70B-Instruct',
        sourceName: 'Meta Official Llama 3.3 Model Card',
        sourceUrl: 'https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/MODEL_CARD.md',
        evaluatedAt: '2024-12',
        methodology: '5-shot MMLU công bố trên thẻ mô hình chính thức của Meta.',
        limitations: 'Chất lượng tiếng Việt thấp hơn một bậc so với các dòng mô hình thương mại đầu bảng.',
      },
    ],
    showInCompareDefault: true,
    showInCalculator: true,
  },
  {
    id: 'qwen-2-5-coder-32b',
    name: 'Qwen 2.5 Coder 32B',
    apiModelId: 'qwen/qwen-2.5-coder-32b-instruct',
    provider: 'Open Source',
    providerDisplay: 'Qwen (Mã nguồn mở)',
    license: 'Open Weights',
    status: 'stable',
    statusNote: 'Giấy phép Apache 2.0; giá API tham chiếu qua OpenRouter, hoặc miễn phí token khi chạy cục bộ qua Ollama.',
    contextWindowTokens: 32_768,
    contextWindowLabel: '32k',
    maxOutputTokens: 16_384,
    maxOutputLabel: '16k',
    inputPricePer1M: 0.66,
    outputPricePer1M: 1.0,
    cachedInputPricePer1M: null,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    pricingNote: 'Giá tham chiếu trung bình trên OpenRouter; chạy trên máy trạm cá nhân tốn $0 phí API.',
    officialDocsUrl: 'https://qwenlm.github.io/blog/qwen2.5-coder-family/',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'fast',
    bestFor: 'Trợ lý lập trình ngoại tuyến trên máy trạm cá nhân (24GB+ VRAM / Apple Silicon)',
    strengths: [
      'Giấy phép Apache 2.0 tự do thương mại và bảo mật mã nguồn tuyệt đối',
      'Kích thước 32B vừa vặn để chạy mượt trên một GPU RTX 3090/4090 hoặc Mac 32GB+ RAM',
    ],
    recommendedUseCases: [
      'Gợi ý mã nguồn ngoại tuyến trong VS Code (Continue.dev / Ollama)',
      'Viết kiểm thử đơn vị (unit test) không gửi mã nội bộ lên internet',
    ],
    benchmarks: [],
    showInCompareDefault: false,
    showInCalculator: false,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    apiModelId: 'claude-3-5-sonnet-20241022',
    provider: 'Anthropic',
    providerDisplay: 'Anthropic',
    license: 'Proprietary',
    status: 'deprecated',
    statusNote: 'Thế hệ cũ (Deprecated) — Khuyên nâng cấp lên Claude Sonnet 4.6 với cùng mức giá $3/$15 nhưng ngữ cảnh lớn gấp 5 lần.',
    contextWindowTokens: 200_000,
    contextWindowLabel: '200k',
    maxOutputTokens: 8_192,
    maxOutputLabel: '8k',
    inputPricePer1M: 3.0,
    outputPricePer1M: 15.0,
    cachedInputPricePer1M: 0.3,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    officialDocsUrl: 'https://docs.anthropic.com/en/docs/resources/model-deprecations',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'fast',
    bestFor: 'Tra cứu đối chiếu các hệ thống cũ chưa nâng cấp lên dòng Sonnet 4.6',
    strengths: [
      'Từng là mô hình lập trình tiêu chuẩn năm 2024 trước khi được thay thế bởi dòng Claude 4',
    ],
    recommendedUseCases: ['Đối chiếu chi phí khi di chuyển sang Claude Sonnet 4.6'],
    benchmarks: [
      {
        benchmarkId: 'swe_bench_verified',
        benchmarkName: 'SWE-bench Verified',
        score: 49.0,
        unit: '%',
        modelVersion: 'claude-3-5-sonnet-20241022',
        sourceName: 'Anthropic Model Addendum (Oct 2024)',
        sourceUrl: 'https://www.anthropic.com/news/3-5-models-and-computer-use',
        evaluatedAt: '2024-10',
        methodology: 'Đánh giá SWE-bench Verified công bố tháng 10/2024.',
        limitations: 'Mô hình thuộc diện ngừng khuyến nghị cho dự án mới.',
      },
    ],
    showInCompareDefault: false,
    showInCalculator: false,
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    apiModelId: 'gemini-1.5-pro',
    provider: 'Google',
    providerDisplay: 'Google AI',
    license: 'Proprietary',
    status: 'shutdown',
    statusNote: 'Đã ngừng hỗ trợ (Shutdown) trên Gemini API công khai — Bắt buộc chuyển sang Gemini 2.5 Pro.',
    contextWindowTokens: 2_000_000,
    contextWindowLabel: '2M',
    maxOutputTokens: 8_192,
    maxOutputLabel: '8k',
    inputPricePer1M: 1.25,
    outputPricePer1M: 5.0,
    cachedInputPricePer1M: 0.3125,
    currency: 'USD',
    pricingUnit: '1.000.000 token',
    pricingNote: 'Biểu giá lịch sử cuối cùng (<= 128k token) trước khi ngừng hoạt động.',
    officialDocsUrl: 'https://ai.google.dev/gemini-api/docs/deprecations',
    verifiedAt: REGISTRY_VERIFIED_DATE,
    latencyCategory: 'balanced',
    bestFor: 'Mốc lịch sử để đối chiếu khi nâng cấp mã nguồn cũ sang Gemini 2.5 Pro',
    strengths: [
      'Chỉ lưu giữ trong bảng đối chiếu để kỹ sư kiểm tra chênh lệch khi nâng cấp hệ thống cũ',
    ],
    recommendedUseCases: ['Chuyển đổi cấu hình sang gemini-2.5-pro'],
    benchmarks: [],
    showInCompareDefault: false,
    showInCalculator: false,
  },
];

export function getCompareDefaultModels(): RegisteredModel[] {
  return MODEL_REGISTRY.filter((m) => m.showInCompareDefault);
}

export function getCalculatorModels(): RegisteredModel[] {
  return MODEL_REGISTRY.filter((m) => m.showInCalculator);
}

export function getModelById(id: string): RegisteredModel | undefined {
  return MODEL_REGISTRY.find((m) => m.id === id || m.apiModelId === id);
}
