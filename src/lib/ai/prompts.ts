import type { AIWorkflowId } from './types';

export type EmailActionMode = 'generate' | 'rewrite' | 'shorter' | 'professional' | 'translate';
export type DocumentAnalysisMode = 'summarize' | 'extract-key-info' | 'main-findings' | 'qa' | 'structured-table';

export interface EmailWorkflowInputs {
  actionMode: EmailActionMode;
  recipient: string;
  purpose: string;
  tone: string;
  language: string;
  contextOrDraft: string;
}

export interface MeetingSummaryInputs {
  meetingTitle?: string;
  participants?: string;
  notesText: string;
}

export interface DocumentAnalysisInputs {
  analysisMode: DocumentAnalysisMode;
  documentText: string;
  question?: string;
}

export interface CustomPromptInputs {
  systemInstruction?: string;
  promptText: string;
  refinementInstruction?: string;
}

export function buildWorkflowPrompts(
  workflowId: AIWorkflowId,
  payload: Record<string, unknown>
): { systemPrompt: string; userPrompt: string; titleHint: string } {
  if (workflowId === 'email-assistant') {
    const mode = (String(payload.actionMode || 'generate') as EmailActionMode);
    const recipient = String(payload.recipient || 'Đồng nghiệp / Đối tác').trim();
    const purpose = String(payload.purpose || '').trim();
    const tone = String(payload.tone || 'Lịch sự, chuyên nghiệp').trim();
    const language = String(payload.language || 'Tiếng Việt').trim();
    const contextOrDraft = String(payload.contextOrDraft || '').trim();

    const modeInstructions: Record<EmailActionMode, string> = {
      generate: 'Soạn mới hoàn chỉnh một bức email rõ ràng, có dòng Tiêu đề (Subject) cụ thể và lời chào/kết chuẩn mực.',
      rewrite: 'Viết lại bản nháp email sao cho mạch lạc, thuyết phục và tự nhiên hơn nhưng giữ nguyên thông tin cốt lõi.',
      shorter: 'Rút gọn bức email thật súc tích (giảm tối thiểu 35% số chữ), đi thẳng vào trọng tâm và đầu việc cần phản hồi.',
      professional: 'Nâng cấp giọng văn sang chuẩn mực chuyên nghiệp công sở cao cấp, lịch thiệp và chặt chẽ.',
      translate: `Chuyển ngữ tự nhiên toàn bộ nội dung email sang ${language} theo đúng văn phong giao tiếp thương mại.`,
    };

    const systemPrompt = [
      'Bạn là Chuyên gia Giao tiếp & Soạn thảo Email Công sở thuộc AI Life Hub.',
      'Nguyên tắc bắt buộc:',
      '1. Luôn kèm dòng "Tiêu đề email đề xuất:" ở đầu kết quả.',
      '2. Không tự bịa đặt số liệu, ngày giờ, tên người hoặc cam kết không có trong thông tin người dùng đưa vào. Nếu cần thông tin bổ sung, hãy để trong ngoặc vuông rõ ràng như [Ngày cụ thể] để người dùng điền.',
      `3. Ngôn ngữ đầu ra bắt buộc: ${language}.`,
      `4. Giọng điệu yêu cầu: ${tone}.`,
      '5. Trình bày sạch sẽ, chia đoạn thoáng mắt, sẵn sàng để người dùng sao chép gửi ngay.',
    ].join('\n');

    const userPrompt = [
      `Nhiệm vụ: ${modeInstructions[mode] || modeInstructions.generate}`,
      `Người nhận: ${recipient}`,
      purpose ? `Mục đích chính: ${purpose}` : '',
      `Ngôn ngữ mong muốn: ${language}`,
      `Giọng văn: ${tone}`,
      '',
      'Bối cảnh / Nội dung đầu vào:',
      contextOrDraft,
    ]
      .filter(Boolean)
      .join('\n');

    return {
      systemPrompt,
      userPrompt,
      titleHint: purpose ? `Email: ${purpose.slice(0, 48)}` : `Email gửi ${recipient.slice(0, 36)}`,
    };
  }

  if (workflowId === 'meeting-summary') {
    const meetingTitle = String(payload.meetingTitle || '').trim();
    const participants = String(payload.participants || '').trim();
    const notesText = String(payload.notesText || '').trim();

    const systemPrompt = [
      'Bạn là Thư ký Điều hành & Tổng hợp Biên bản Họp chuyên nghiệp thuộc AI Life Hub.',
      'Quy tắc trung thực tuyệt đối (BẮT BUỘC TUÂN THỦ):',
      '1. CHỈ tổng hợp dựa trên nội dung ghi chú cuộc họp được cung cấp.',
      '2. TUYỆT ĐỐI KHÔNG tự suy diễn hoặc bịa đặt tên người phụ trách (Owner) hay thời hạn hoàn thành (Deadline) nếu biên bản không nêu rõ. Nếu không có thông tin người phụ trách hoặc hạn chót, BẮT BUỘC ghi rõ: "Chưa nêu rõ trong biên bản".',
      '3. Bắt buộc trình bày bằng tiếng Việt rõ ràng với đúng 5 mục tiêu đề Markdown sau:',
      '## 1. Tóm tắt điều hành',
      '## 2. Các điểm thảo luận chính',
      '## 3. Quyết định đã thống nhất',
      '## 4. Danh sách việc cần làm (Kèm người phụ trách & thời hạn nếu có)',
      '## 5. Vấn đề còn bỏ ngỏ / Câu hỏi cần làm rõ',
    ].join('\n');

    const userPrompt = [
      meetingTitle ? `Tên/Chủ đề cuộc họp: ${meetingTitle}` : '',
      participants ? `Thành phần tham dự: ${participants}` : '',
      '',
      'Nội dung ghi chú / biên bản thô của cuộc họp:',
      notesText,
    ]
      .filter(Boolean)
      .join('\n');

    return {
      systemPrompt,
      userPrompt,
      titleHint: meetingTitle ? `Họp: ${meetingTitle.slice(0, 48)}` : 'Tóm tắt biên bản cuộc họp',
    };
  }

  if (workflowId === 'document-analysis') {
    const mode = (String(payload.analysisMode || 'summarize') as DocumentAnalysisMode);
    const documentText = String(payload.documentText || '').trim();
    const question = String(payload.question || '').trim();

    const modeDirectives: Record<DocumentAnalysisMode, string> = {
      summarize:
        'Tóm tắt cấu trúc toàn bộ văn bản gồm: Ý chính cốt lõi (3-5 gạch đầu dòng), Nội dung chi tiết theo từng phần, và Điểm cần lưu ý.',
      'extract-key-info':
        'Trích xuất toàn bộ thực thể, con số, mốc thời gian, điều khoản, định nghĩa hoặc cam kết quan trọng xuất hiện trong văn bản.',
      'main-findings':
        'Phân tích các luận điểm chính, bằng chứng được nêu trong văn bản và các khoảng trống thông tin chưa được đề cập.',
      qa: `Trả lời chính xác câu hỏi sau dựa HOÀN TOÀN vào văn bản được cung cấp: "${question || 'Nêu nội dung quan trọng nhất của văn bản này.'}"`,
      'structured-table':
        'Chuyển hóa các thông tin, hạng mục, số liệu hoặc điều khoản trong văn bản thành Bảng Markdown có cột rõ ràng để dễ đối chiếu.',
    };

    const systemPrompt = [
      'Bạn là Chuyên gia Phân tích & Kiểm chứng Tài liệu thuộc AI Life Hub.',
      'Quy tắc bám sát nguồn (GROUNDING RULES - BẮT BUỘC):',
      '1. Chỉ sử dụng thông tin có mặt trực tiếp trong phần [VĂN BẢN NGUỒN] do người dùng cung cấp.',
      '2. Không đưa kiến thức suy đoán bên ngoài vào như thể đó là nội dung của tài liệu. Nếu câu hỏi hoặc mục trích xuất không có trong văn bản nguồn, hãy ghi rõ: "Tài liệu được cung cấp không đề cập thông tin này."',
      '3. Khi trích dẫn số liệu hoặc nhận định quan trọng, hãy giữ nguyên con số/thuật ngữ gốc trong văn bản.',
      '4. Trình bày bằng tiếng Việt mạch lạc, sử dụng tiêu đề và danh sách/bảng Markdown dễ đọc.',
    ].join('\n');

    const userPrompt = [
      `Yêu cầu xử lý: ${modeDirectives[mode] || modeDirectives.summarize}`,
      question && mode !== 'qa' ? `Câu hỏi/Trọng tâm bổ sung cần chú ý: ${question}` : '',
      '',
      '[VĂN BẢN NGUỒN BẮT ĐẦU]',
      documentText,
      '[VĂN BẢN NGUỒN KẾT THÚC]',
    ]
      .filter(Boolean)
      .join('\n');

    return {
      systemPrompt,
      userPrompt,
      titleHint: question ? `Phân tích: ${question.slice(0, 44)}` : 'Phân tích tài liệu',
    };
  }

  // custom-prompt execution (from /prompts, PromptBuilder, or follow-up refinement)
  const systemInstruction = String(payload.systemInstruction || '').trim();
  const promptText = String(payload.promptText || '').trim();
  const refinementInstruction = String(payload.refinementInstruction || '').trim();

  const systemPrompt =
    systemInstruction ||
    'Bạn là trợ lý công việc chuyên nghiệp của AI Life Hub. Hãy thực hiện yêu cầu chính xác, trình bày rõ ràng bằng tiếng Việt (trừ khi người dùng yêu cầu ngôn ngữ khác) và tuyệt đối không tự bịa đặt dữ liệu thực tế.';

  const userPrompt = refinementInstruction
    ? `${promptText}\n\n---\nYêu cầu tinh chỉnh bổ sung: ${refinementInstruction}`
    : promptText;

  return {
    systemPrompt,
    userPrompt,
    titleHint: `Câu lệnh: ${promptText.slice(0, 44)}`,
  };
}
