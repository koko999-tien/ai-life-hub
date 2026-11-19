'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Mail,
  FileCheck2,
  FileSearch,
  Sparkles,
  Play,
  Square,
  RotateCcw,
  Copy,
  Check,
  Download,
  Save,
  Plus,
  Trash2,
  Clock,
  History,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Edit3,
  Eye,
  Send,
  FolderOpen,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { Button, toast } from '@/components/ui';
import { SafetyDisclaimer } from '@/components/ui/SafetyDisclaimer';
import { WorkspaceOnboarding } from '@/components/workspace/WorkspaceOnboarding';
import type {
  AIWorkflowId,
  AIStreamChunk,
  UsageMetrics,
  WorkspacePublicStatus,
} from '@/lib/ai/types';
import type { DocumentAnalysisMode, EmailActionMode } from '@/lib/ai/prompts';
import {
  listWorkspaceSessions,
  saveWorkspaceSession,
  deleteWorkspaceSession,
  listPersonalTemplates,
  createPersonalTemplate,
  type WorkspaceSessionRecord,
  type PersonalTemplateRecord,
} from '@/lib/workspace/storage';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { WORKSPACE_REOPEN_SESSION_KEY } from '@/components/workspace/WorkspaceHistory';
import { copyToClipboardWithFallback } from '@/components/skill/categoryHelpers';
import { trackEvent } from '@/lib/analytics';

const WORKFLOW_META: Array<{
  id: AIWorkflowId;
  title: string;
  shortDesc: string;
  icon: typeof Mail;
}> = [
  {
    id: 'email-assistant',
    title: 'Trợ lý Email AI',
    shortDesc: 'Soạn mới, viết lại, rút gọn, chuyên nghiệp hóa & đổi ngôn ngữ',
    icon: Mail,
  },
  {
    id: 'meeting-summary',
    title: 'Tóm tắt Cuộc họp',
    shortDesc: 'Tóm tắt điều hành, quyết định, việc cần làm & câu hỏi mở',
    icon: FileCheck2,
  },
  {
    id: 'document-analysis',
    title: 'Phân tích Tài liệu',
    shortDesc: 'Tóm tắt, trích xuất thông tin, lập bảng & hỏi đáp bám sát văn bản',
    icon: FileSearch,
  },
  {
    id: 'custom-prompt',
    title: 'Câu lệnh tùy chọn',
    shortDesc: 'Chạy mẫu từ Thư viện câu lệnh hoặc mẫu cá nhân của bạn',
    icon: Sparkles,
  },
];

const QUICK_SAMPLE_INPUTS = {
  email: {
    recipient: 'Anh Minh — Giám đốc Tài chính Đối tác',
    purpose: 'Đề nghị xác nhận lịch họp rà soát hợp đồng cung ứng Quý tới',
    tone: 'Lịch sự, chuyên nghiệp, tôn trọng thời gian',
    language: 'Tiếng Việt',
    contextOrDraft:
      'Phòng Mua hàng đã hoàn tất bản dự thảo phụ lục điều chỉnh đơn giá vận chuyển năm nay. Đề xuất 2 khung giờ họp trực tuyến 30 phút vào 10:00 sáng Thứ Năm hoặc 14:30 chiều Thứ Sáu tuần này để chốt trước ngày 25.',
  },
  meeting: {
    meetingTitle: 'Họp giao ban triển khai chiến dịch ra mắt tính năng AI Workspace',
    participants: 'Lan (Quản lý sản phẩm), Hùng (Kỹ thuật), Mai (Thiết kế), Tuấn (Nội dung)',
    notesText: `- Lan trình bày mục tiêu ra mắt bản AI Workspace cho người dùng Việt Nam vào đầu tháng sau.
- Quyết định thống nhất: Tập trung hoàn thiện 3 luồng công việc cốt lõi trước gồm Email, Biên bản họp và Phân tích tài liệu thay vì dàn trải nhiều tính năng mạng xã hội.
- Hùng phụ trách hoàn thành kiểm tra giới hạn tốc độ gọi API trước ngày 22/11.
- Mai cập nhật lại giao diện trên màn hình điện thoại 375px trước thứ Sáu tuần này.
- Cần soạn bộ hướng dẫn nhanh cho người mới bắt đầu (chưa phân công ai phụ trách cụ thể và chưa chốt hạn nộp).
- Câu hỏi còn bỏ ngỏ: Có nên mở thêm gói lưu trữ đám mây cho nhóm doanh nghiệp nhỏ ngay trong đợt đầu hay để sang giai đoạn 2?`,
  },
  document: {
    analysisMode: 'summarize' as DocumentAnalysisMode,
    question: 'Chính sách hoàn tiền và thời gian xử lý yêu cầu hỗ trợ kỹ thuật được quy định thế nào?',
    documentText: `QUY ĐỊNH DỊCH VỤ PHẦN MỀM ĐÁM MÂY NỘI BỘ (PHIÊN BẢN 2.4)
1. Thời gian cam kết hoạt động (SLA): Hệ thống duy trì tỷ lệ sẵn sàng tối thiểu 99,5% mỗi tháng dương lịch, không tính lịch bảo trì định kỳ đã thông báo trước tối thiểu 48 giờ.
2. Thời gian phản hồi hỗ trợ kỹ thuật:
- Sự cố mức Nghiêm trọng (ngừng toàn bộ dịch vụ): Kỹ sư trực xác nhận và xử lý trong vòng 30 phút.
- Yêu cầu hỗ trợ thông thường: Phản hồi trong vòng 08 giờ làm việc hành chính (Thứ Hai đến Thứ Sáu).
3. Chính sách hoàn phí: Khách hàng đăng ký gói tháng được yêu cầu hoàn tiền 100% trong vòng 07 ngày đầu tiên nếu tổng dung lượng sử dụng chưa vượt quá 50 lượt xử lý. Sau thời hạn 07 ngày, phí dịch vụ của kỳ hiện tại không hoàn lại nhưng khách hàng có thể hủy gia hạn cho kỳ tiếp theo bất cứ lúc nào.`,
  },
};

export function WorkspaceClient() {
  const searchParams = useSearchParams();
  const initialWorkflowParam = searchParams.get('workflow') as AIWorkflowId | null;

  const [activeWorkflow, setActiveWorkflow] = useState<AIWorkflowId>(() => {
    if (
      initialWorkflowParam &&
      ['email-assistant', 'meeting-summary', 'document-analysis', 'custom-prompt'].includes(initialWorkflowParam)
    ) {
      return initialWorkflowParam;
    }
    return 'email-assistant';
  });

  // Server Provider Status
  const [status, setStatus] = useState<WorkspacePublicStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [temperature, setTemperature] = useState<number>(0.4);
  // Chế độ Đơn giản: cài đặt nâng cao (chọn AI, độ sáng tạo, mẫu cá nhân)
  // mặc định đóng, AI đã tự chọn giúp người dùng.
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  // AI chưa bật (đã tải xong trạng thái mà chưa có khóa AI): chặn chạy ngay
  // từ đầu, không để người dùng điền xong mới báo lỗi.
  const aiNotReady = !statusLoading && status !== null && !status.configured;

  // Auth User (Optional Supabase)
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // Sessions & Personal Templates
  const [sessions, setSessions] = useState<WorkspaceSessionRecord[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined);
  const [sessionTitle, setSessionTitle] = useState<string>('');
  const [personalTemplates, setPersonalTemplates] = useState<PersonalTemplateRecord[]>([]);

  // Workflow A: Email Assistant State
  const [emailMode, setEmailMode] = useState<EmailActionMode>('generate');
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailPurpose, setEmailPurpose] = useState('');
  const [emailTone, setEmailTone] = useState('Lịch sự, chuyên nghiệp');
  const [emailLanguage, setEmailLanguage] = useState('Tiếng Việt');
  const [emailContext, setEmailContext] = useState('');

  // Workflow B: Meeting Summary State
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingParticipants, setMeetingParticipants] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  // Workflow C: Document Analysis State
  const [docMode, setDocMode] = useState<DocumentAnalysisMode>('summarize');
  const [docText, setDocText] = useState('');
  const [docQuestion, setDocQuestion] = useState('');
  const [docSensitiveCategory, setDocSensitiveCategory] = useState<string>('');

  // Custom Prompt Workflow State
  const [customSystemPrompt, setCustomSystemPrompt] = useState('');
  const [customPromptText, setCustomPromptText] = useState('');

  // Execution & Result State
  const [isStreaming, setIsStreaming] = useState(false);
  const [resultText, setResultText] = useState('');
  const [isEditingResult, setIsEditingResult] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [lastUsage, setLastUsage] = useState<UsageMetrics | null>(null);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);
  const [lastModelLabel, setLastModelLabel] = useState<string>('');
  const [copiedResult, setCopiedResult] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load Server AI Provider Status + Local/Cloud Sessions + Draft Prompt from Library
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const res = await fetch('/api/workspace/status', { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as WorkspacePublicStatus;
          if (mounted) {
            setStatus(data);
            if (data.defaultModelId) {
              setSelectedModelId(data.defaultModelId);
            }
          }
        }
      } catch {
        // Keep status null
      } finally {
        if (mounted) setStatusLoading(false);
      }

      let currentUid: string | undefined;
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getUser();
          currentUid = data.user?.id;
          if (mounted) setUserId(currentUid);
        } catch {
          // Ignore auth check errors
        }
      }

      const [loadedSessions, loadedTemplates] = await Promise.all([
        listWorkspaceSessions(currentUid),
        listPersonalTemplates(currentUid),
      ]);

      if (mounted) {
        setSessions(loadedSessions);
        setPersonalTemplates(loadedTemplates);
      }

      // Hydrate draft prompt passed from /prompts or /playground
      if (typeof window !== 'undefined') {
        const draftRaw = sessionStorage.getItem('ai_life_hub_workspace_draft_prompt');
        if (draftRaw) {
          try {
            const draft = JSON.parse(draftRaw);
            if (draft?.template && mounted) {
              setActiveWorkflow('custom-prompt');
              setCustomPromptText(String(draft.template));
              if (draft.systemPrompt) setCustomSystemPrompt(String(draft.systemPrompt));
              if (draft.title) setSessionTitle(String(draft.title));
              if (draft.categoryId) setDocSensitiveCategory(String(draft.categoryId));
              toast.info(`Đã nạp câu lệnh: ${draft.title || 'Mẫu từ thư viện'}`);
            }
          } catch {
            // Ignore
          }
          sessionStorage.removeItem('ai_life_hub_workspace_draft_prompt');
        }
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Update active workflow if URL query param changes
  useEffect(() => {
    if (
      initialWorkflowParam &&
      ['email-assistant', 'meeting-summary', 'document-analysis', 'custom-prompt'].includes(initialWorkflowParam)
    ) {
      setActiveWorkflow(initialWorkflowParam);
    }
  }, [initialWorkflowParam]);

  // Detect sensitive keywords for contextual safety disclaimer
  const detectedSensitiveCategory = useMemo(() => {
    if (docSensitiveCategory) return docSensitiveCategory;
    const combined = `${emailContext} ${meetingNotes} ${docText} ${customPromptText}`.toLowerCase();
    if (/đơn thuốc|triệu chứng bệnh|chẩn đoán y khoa|kháng sinh|phác đồ điều trị/.test(combined)) {
      return 'health';
    }
    if (/hợp đồng lao động|khởi kiện|bộ luật|tranh chấp pháp lý|vi phạm hành chính/.test(combined)) {
      return 'legal';
    }
    if (/cổ phiếu|quyết toán thuế|lãi suất vay|đầu tư chứng khoán|trái phiếu/.test(combined)) {
      return 'finance';
    }
    return '';
  }, [docSensitiveCategory, emailContext, meetingNotes, docText, customPromptText]);

  const buildCurrentInputs = useCallback(
    (overrideRefinement?: string): Record<string, unknown> => {
      if (activeWorkflow === 'email-assistant') {
        const baseContext =
          overrideRefinement && resultText
            ? `${resultText}\n\nYêu cầu điều chỉnh thêm: ${overrideRefinement}`
            : emailContext;
        return {
          actionMode: overrideRefinement ? 'rewrite' : emailMode,
          recipient: emailRecipient,
          purpose: emailPurpose,
          tone: emailTone,
          language: emailLanguage,
          contextOrDraft: baseContext,
        };
      }

      if (activeWorkflow === 'meeting-summary') {
        const notes =
          overrideRefinement && resultText
            ? `${meetingNotes}\n\nBản tóm tắt trước đó:\n${resultText}\n\nYêu cầu bổ sung: ${overrideRefinement}`
            : meetingNotes;
        return {
          meetingTitle,
          participants: meetingParticipants,
          notesText: notes,
        };
      }

      if (activeWorkflow === 'document-analysis') {
        return {
          analysisMode: overrideRefinement ? 'qa' : docMode,
          documentText: docText,
          question: overrideRefinement || docQuestion,
        };
      }

      return {
        systemInstruction: customSystemPrompt,
        promptText:
          overrideRefinement && resultText
            ? `Nội dung gốc:\n${customPromptText}\n\nKết quả trước:\n${resultText}`
            : customPromptText,
        refinementInstruction: overrideRefinement || '',
      };
    },
    [
      activeWorkflow,
      resultText,
      emailMode,
      emailRecipient,
      emailPurpose,
      emailTone,
      emailLanguage,
      emailContext,
      meetingTitle,
      meetingParticipants,
      meetingNotes,
      docMode,
      docText,
      docQuestion,
      customSystemPrompt,
      customPromptText,
    ]
  );

  const deriveDefaultTitle = useCallback((): string => {
    if (sessionTitle.trim()) return sessionTitle.trim();
    if (activeWorkflow === 'email-assistant') {
      return emailPurpose.trim()
        ? `Email: ${emailPurpose.trim().slice(0, 48)}`
        : `Email gửi ${emailRecipient.trim() || 'đối tác'}`;
    }
    if (activeWorkflow === 'meeting-summary') {
      return meetingTitle.trim() ? `Họp: ${meetingTitle.trim().slice(0, 48)}` : 'Tóm tắt cuộc họp';
    }
    if (activeWorkflow === 'document-analysis') {
      return docQuestion.trim()
        ? `Tài liệu: ${docQuestion.trim().slice(0, 44)}`
        : `Phân tích tài liệu (${docText.trim().slice(0, 32)}...)`;
    }
    return `Câu lệnh: ${customPromptText.trim().slice(0, 44) || 'Tùy chỉnh'}`;
  }, [
    sessionTitle,
    activeWorkflow,
    emailPurpose,
    emailRecipient,
    meetingTitle,
    docQuestion,
    docText,
    customPromptText,
  ]);

  const handleLoadSample = () => {
    setErrorBanner(null);
    if (activeWorkflow === 'email-assistant') {
      setEmailRecipient(QUICK_SAMPLE_INPUTS.email.recipient);
      setEmailPurpose(QUICK_SAMPLE_INPUTS.email.purpose);
      setEmailTone(QUICK_SAMPLE_INPUTS.email.tone);
      setEmailLanguage(QUICK_SAMPLE_INPUTS.email.language);
      setEmailContext(QUICK_SAMPLE_INPUTS.email.contextOrDraft);
      toast.success('Đã điền dữ liệu mẫu cho Trợ lý Email!');
    } else if (activeWorkflow === 'meeting-summary') {
      setMeetingTitle(QUICK_SAMPLE_INPUTS.meeting.meetingTitle);
      setMeetingParticipants(QUICK_SAMPLE_INPUTS.meeting.participants);
      setMeetingNotes(QUICK_SAMPLE_INPUTS.meeting.notesText);
      toast.success('Đã điền biên bản họp mẫu (có cả mục khuyết người phụ trách để kiểm chứng tính trung thực)!');
    } else if (activeWorkflow === 'document-analysis') {
      setDocMode(QUICK_SAMPLE_INPUTS.document.analysisMode);
      setDocQuestion(QUICK_SAMPLE_INPUTS.document.question);
      setDocText(QUICK_SAMPLE_INPUTS.document.documentText);
      toast.success('Đã điền văn bản tài liệu mẫu!');
    } else {
      setCustomPromptText(
        'Hãy lập bảng kế hoạch hành động 5 ngày làm việc để chuẩn bị buổi thuyết trình báo cáo kết quả kinh doanh Quý cho nhóm 8 người, nêu rõ đầu việc và sản phẩm đầu ra mỗi ngày.'
      );
      toast.success('Đã điền câu lệnh mẫu!');
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    toast.info('Đã dừng nhận phản hồi theo yêu cầu của bạn.');
  };

  const handleExecute = async (overrideRefinement?: string) => {
    const inputs = buildCurrentInputs(overrideRefinement);

    // Client-side empty input check before calling API
    const primaryText =
      activeWorkflow === 'email-assistant'
        ? `${emailPurpose} ${emailContext}`
        : activeWorkflow === 'meeting-summary'
        ? meetingNotes
        : activeWorkflow === 'document-analysis'
        ? docText
        : customPromptText;

    if (!primaryText.trim()) {
      setErrorBanner('Vui lòng nhập nội dung đầu vào (hoặc bấm "Điền ví dụ mẫu") trước khi tạo.');
      toast.error('Chưa có nội dung đầu vào để xử lý.');
      return;
    }

    // Chặn chạy ngay khi web chưa bật AI: đừng để người dùng mất công
    // điền form rồi mới nhận lỗi sau khi bấm nút.
    if (status && !status.configured) {
      setErrorBanner(
        'AI trên web chưa bật nên chưa tạo được kết quả. Bạn nhờ người quản trị web thêm khóa AI giúp nhé. Trong lúc chờ, bạn vẫn có thể bấm "Điền ví dụ mẫu" để xem trước cách điền.'
      );
      toast.error('AI chưa bật nên chưa tạo được kết quả.');
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsStreaming(true);
    setIsEditingResult(false);
    setErrorBanner(null);
    if (!overrideRefinement) {
      setResultText('');
    }
    setLastUsage(null);
    setLastLatencyMs(null);

    trackEvent('workflow_started', {
      workflowId: activeWorkflow,
      modelId: selectedModelId || 'default',
    });

    let streamedText = '';
    if (overrideRefinement) {
      setResultText('');
    }

    try {
      const response = await fetch('/api/workspace/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowId: activeWorkflow,
          modelId: selectedModelId || undefined,
          temperature,
          inputs,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        let errMessage = `Máy chủ trả về lỗi HTTP ${response.status}.`;
        try {
          const errJson = await response.json();
          if (errJson?.message) errMessage = errJson.message;
        } catch {
          // Ignore JSON parse error
        }
        setErrorBanner(errMessage);
        toast.error(errMessage);
        setIsStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalUsage: UsageMetrics | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const rawEvt of events) {
          const line = rawEvt.trim();
          if (!line.startsWith('data:')) continue;
          const payloadStr = line.slice(5).trim();
          if (!payloadStr) continue;

          try {
            const chunk = JSON.parse(payloadStr) as AIStreamChunk;
            if (chunk.type === 'text') {
              streamedText += chunk.delta;
              setResultText(streamedText);
            } else if (chunk.type === 'done') {
              finalUsage = chunk.usage;
              setLastUsage(chunk.usage);
              setLastLatencyMs(chunk.latencyMs);
              setLastModelLabel(`${chunk.modelLabel} (${chunk.providerLabel})`);
              trackEvent('workflow_completed', {
                workflowId: activeWorkflow,
                modelId: selectedModelId || 'default',
                durationMs: chunk.latencyMs,
              });
            } else if (chunk.type === 'error') {
              setErrorBanner(chunk.message);
              toast.error(chunk.message);
            }
          } catch {
            // Skip partial SSE frames
          }
        }
      }

      // Auto-save completed session so user never loses work across reloads
      if (streamedText.trim().length > 0) {
        const computedTitle = deriveDefaultTitle();
        const isNewSession = !activeSessionId;
        const saved = await saveWorkspaceSession(
          {
            id: activeSessionId,
            title: computedTitle,
            workflowId: activeWorkflow,
            modelId: selectedModelId || 'default',
            inputs,
            resultText: streamedText,
            messages: [],
            usage: finalUsage,
            createdAt: new Date().toISOString(),
          },
          userId
        );
        setActiveSessionId(saved.id);
        setSessionTitle(saved.title);
        const refreshed = await listWorkspaceSessions(userId);
        setSessions(refreshed);
        if (isNewSession) {
          trackEvent('workspace_session_created', {
            workflowId: activeWorkflow,
            mode: saved.storageMode,
          });
        }
        if (overrideRefinement) {
          setFollowUpText('');
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const msg = 'Kết nối tới máy chủ xử lý AI bị gián đoạn. Vui lòng kiểm tra mạng và thử lại.';
      setErrorBanner(msg);
      toast.error(msg);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSaveEditedSession = async () => {
    if (!resultText.trim()) {
      toast.error('Chưa có kết quả để lưu.');
      return;
    }
    const saved = await saveWorkspaceSession(
      {
        id: activeSessionId,
        title: deriveDefaultTitle(),
        workflowId: activeWorkflow,
        modelId: selectedModelId || 'default',
        inputs: buildCurrentInputs(),
        resultText,
        messages: [],
        usage: lastUsage || undefined,
        createdAt: new Date().toISOString(),
      },
      userId
    );
    setActiveSessionId(saved.id);
    setSessionTitle(saved.title);
    const refreshed = await listWorkspaceSessions(userId);
    setSessions(refreshed);
    trackEvent('result_saved', { workflowId: activeWorkflow, mode: saved.storageMode });
    toast.success(
      saved.storageMode === 'cloud'
        ? 'Đã lưu phiên làm việc vào tài khoản của bạn!'
        : 'Đã lưu phiên làm việc trên trình duyệt này!'
    );
  };

  const handleSelectSession = (session: WorkspaceSessionRecord) => {
    if (isStreaming) handleStopStreaming();
    setActiveSessionId(session.id);
    setSessionTitle(session.title);
    setActiveWorkflow(session.workflowId);
    if (session.modelId && session.modelId !== 'default') {
      setSelectedModelId(session.modelId);
    }
    setResultText(session.resultText || '');
    setLastUsage(session.usage || null);
    setErrorBanner(null);

    const inp = session.inputs || {};
    if (session.workflowId === 'email-assistant') {
      setEmailMode((inp.actionMode as EmailActionMode) || 'generate');
      setEmailRecipient(String(inp.recipient || ''));
      setEmailPurpose(String(inp.purpose || ''));
      setEmailTone(String(inp.tone || 'Lịch sự, chuyên nghiệp'));
      setEmailLanguage(String(inp.language || 'Tiếng Việt'));
      setEmailContext(String(inp.contextOrDraft || ''));
    } else if (session.workflowId === 'meeting-summary') {
      setMeetingTitle(String(inp.meetingTitle || ''));
      setMeetingParticipants(String(inp.participants || ''));
      setMeetingNotes(String(inp.notesText || ''));
    } else if (session.workflowId === 'document-analysis') {
      setDocMode((inp.analysisMode as DocumentAnalysisMode) || 'summarize');
      setDocText(String(inp.documentText || ''));
      setDocQuestion(String(inp.question || ''));
    } else {
      setCustomSystemPrompt(String(inp.systemInstruction || ''));
      setCustomPromptText(String(inp.promptText || ''));
    }

    trackEvent('workspace_session_reused', { workflowId: session.workflowId });
    toast.info(`Đã mở lại phiên: ${session.title}`);
  };

  // Mở lại session từ trang /workspace/history: trang đó lưu id cần mở vào
  // sessionStorage rồi chuyển về /workspace; khi sessions đã tải xong thì
  // khôi phục session tương ứng vào form rồi xóa key để không mở lại lần sau.
  useEffect(() => {
    if (typeof window === 'undefined' || sessions.length === 0) return;
    const reopenId = sessionStorage.getItem(WORKSPACE_REOPEN_SESSION_KEY);
    if (!reopenId) return;
    sessionStorage.removeItem(WORKSPACE_REOPEN_SESSION_KEY);
    const session = sessions.find((s) => s.id === reopenId);
    if (session) {
      handleSelectSession(session);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions]);

  const handleNewSession = () => {
    if (isStreaming) handleStopStreaming();
    setActiveSessionId(undefined);
    setSessionTitle('');
    setResultText('');
    setErrorBanner(null);
    setLastUsage(null);
    setLastLatencyMs(null);
    setFollowUpText('');
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteWorkspaceSession(id, userId);
    const refreshed = await listWorkspaceSessions(userId);
    setSessions(refreshed);
    if (activeSessionId === id) {
      handleNewSession();
    }
    toast.success('Đã xóa phiên làm việc.');
  };

  const handleCopyResult = async () => {
    if (!resultText) return;
    const ok = await copyToClipboardWithFallback(resultText);
    if (ok) {
      setCopiedResult(true);
      toast.success('Đã sao chép kết quả vào bộ nhớ tạm!');
      setTimeout(() => setCopiedResult(false), 2000);
    }
  };

  const handleDownloadResult = () => {
    if (!resultText) return;
    const title = deriveDefaultTitle();
    const md = `# ${title}\n\n> Tạo từ AI Life Hub Workspace (${new Date().toLocaleString('vi-VN')})\n\n${resultText}\n`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-workspace-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Đã tải xuống tệp Markdown (.md)!');
  };

  const handleSaveAsPersonalTemplate = async () => {
    const templateContent =
      activeWorkflow === 'custom-prompt'
        ? customPromptText
        : activeWorkflow === 'email-assistant'
        ? `Soạn email gửi ${emailRecipient || '{{nguoi_nhan}}'} về mục đích: ${emailPurpose || '{{muc_dich}}'}.\nBối cảnh: ${emailContext || '{{boi_canh}}'}`
        : activeWorkflow === 'meeting-summary'
        ? meetingNotes
        : docText;

    if (!templateContent.trim()) {
      toast.error('Hãy nhập nội dung trước khi lưu thành mẫu cá nhân.');
      return;
    }

    const created = await createPersonalTemplate(
      {
        title: deriveDefaultTitle(),
        description: `Mẫu lưu nhanh từ luồng ${WORKFLOW_META.find((w) => w.id === activeWorkflow)?.title}`,
        template: templateContent,
        workflowId: activeWorkflow,
      },
      userId
    );
    setPersonalTemplates((prev) => [created, ...prev]);
    toast.success('Đã lưu vào Mẫu câu lệnh cá nhân!');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1440px]">
      {/* Workspace Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Workspace • Làm việc thật với AI</span>
            </span>

            {!statusLoading && status && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                  status.configured
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                }`}
              >
                {status.configured ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>AI đã bật</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>AI chưa bật — cần thêm khóa AI</span>
                  </>
                )}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-bg-surface text-text-muted text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
              <span>
                {isSupabaseConfigured && userId
                  ? 'Lưu đồng bộ tài khoản'
                  : 'Lưu phiên cục bộ trên trình duyệt'}
              </span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-text">
            Không Gian Làm Việc AI (AI Workspace)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/workspace/history"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-bg-surface hover:border-accent text-xs font-semibold text-text transition-colors"
          >
            <History className="w-3.5 h-3.5 text-accent" />
            <span>Lịch sử</span>
          </Link>
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3.5 py-2 rounded-xl border border-border bg-bg-surface hover:border-accent text-xs font-semibold text-text transition-colors"
          >
            Điền ví dụ mẫu nhanh
          </button>
          <button
            type="button"
            onClick={handleNewSession}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Phiên làm việc mới</span>
          </button>
        </div>
      </div>

      {/* Cảnh báo khi AI chưa bật: nói rõ trước khi người dùng điền form */}
      {!statusLoading && status && !status.configured && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs sm:text-sm text-text"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold block">
                AI trên web chưa bật — tạm thời chưa tạo được kết quả
              </strong>
              <p className="text-text-muted leading-relaxed">
                Bạn chưa cần điền gì vội. Để chạy được, người quản trị web cần thêm khóa AI cho trang này.
                Trong lúc chờ, bạn vẫn có thể bấm &ldquo;Điền ví dụ mẫu&rdquo; để xem trước cách điền,
                hoặc lấy mẫu viết sẵn ở Thư viện câu lệnh.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hướng dẫn 3 bước, chỉ hiện lần đầu vào Workspace */}
      <WorkspaceOnboarding onFillSample={handleLoadSample} />

      {/* 3-Column Desktop / Single-Column Responsive Workspace Grid.
          Trên điện thoại: form lên trước, chọn việc thành chip ngang phía trên,
          cài đặt nâng cao xuống cuối — để người dùng thấy ô nhập và nút Tạo ngay ngay. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANE (3 cols): Workflows & Saved Sessions */}
        <aside className="lg:col-span-3 space-y-5 order-2 lg:order-none" aria-label="Quy trình và lịch sử phiên">
          {/* Workflow Switcher */}
          <div className="rounded-2xl border border-border bg-bg-surface p-4 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
              Chọn việc cần làm
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0 lg:space-y-2" role="tablist" aria-label="Danh sách quy trình AI Workspace">
              {WORKFLOW_META.map((wf) => {
                const Icon = wf.icon;
                const isActive = activeWorkflow === wf.id;
                return (
                  <button
                    key={wf.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveWorkflow(wf.id);
                      setErrorBanner(null);
                    }}
                    className={`shrink-0 lg:shrink lg:w-full text-left p-3 rounded-xl border transition-all flex items-center lg:items-start gap-3 ${
                      isActive
                        ? 'border-accent bg-accent/10 shadow-2xs'
                        : 'border-border/70 bg-bg hover:border-accent/40'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isActive ? 'bg-accent text-white' : 'bg-bg-surface border border-border text-accent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-text block whitespace-nowrap lg:whitespace-normal">{wf.title}</span>
                      <span className="hidden lg:block text-[11px] text-text-muted line-clamp-2 mt-0.5 leading-snug">
                        {wf.shortDesc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Sessions History */}
          <div className="rounded-2xl border border-border bg-bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Lịch Sử Phiên ({sessions.length})
              </h2>
              <Link href="/account" className="text-[11px] font-semibold text-accent hover:underline">
                Quản lý
              </Link>
            </div>

            {sessions.length === 0 ? (
              <p className="text-xs text-text-muted py-4 text-center border border-dashed border-border rounded-xl px-2">
                Chưa có phiên nào được lưu. Kết quả sau khi chạy sẽ tự động lưu tại đây.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {sessions.map((s) => {
                  const isCurrent = s.id === activeSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSession(s)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleSelectSession(s)}
                      className={`group flex items-start justify-between gap-2 p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                        isCurrent
                          ? 'border-accent bg-accent/10'
                          : 'border-border/70 bg-bg hover:border-accent/40'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-text truncate">{s.title}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {new Date(s.updatedAt).toLocaleDateString('vi-VN')} •{' '}
                          {s.storageMode === 'cloud' ? 'Đám mây' : 'Trình duyệt'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="p-1 text-text-muted hover:text-red-500 opacity-70 group-hover:opacity-100 transition-opacity shrink-0"
                        aria-label={`Xóa phiên ${s.title}`}
                        title="Xóa phiên này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {sessions.length > 0 && (
              <Link
                href="/workspace/history"
                className="block text-center text-[11px] font-semibold text-accent hover:underline mt-3"
              >
                Xem tất cả lịch sử →
              </Link>
            )}
          </div>
        </aside>

        {/* CENTER PANE (6 cols): Structured Task Input + Streaming / Editable Output */}
        <div className="lg:col-span-6 space-y-6 min-w-0 order-1 lg:order-none">
          {/*Contextual Safety Disclaimer when medical/legal/financial content is detected */}
          {detectedSensitiveCategory && (
            <SafetyDisclaimer categoryId={detectedSensitiveCategory} compact />
          )}

          {/* Task Input Card */}
          <div className="rounded-3xl border border-border bg-bg-elevated p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
              <h2 className="text-base sm:text-lg font-bold text-text">
                {WORKFLOW_META.find((w) => w.id === activeWorkflow)?.title}
              </h2>
            </div>

            {/* WORKFLOW A: EMAIL ASSISTANT */}
            {activeWorkflow === 'email-assistant' && (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-text mb-2">
                    Chế độ xử lý email:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'generate', label: 'Soạn mới' },
                      { id: 'rewrite', label: 'Viết lại mượt hơn' },
                      { id: 'shorter', label: 'Rút gọn súc tích' },
                      { id: 'professional', label: 'Nâng cấp chuyên nghiệp' },
                      { id: 'translate', label: 'Đổi ngôn ngữ' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        aria-pressed={emailMode === m.id}
                        onClick={() => setEmailMode(m.id as EmailActionMode)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          emailMode === m.id
                            ? 'border-accent bg-accent text-white'
                            : 'border-border bg-bg text-text-muted hover:text-text'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="ws-email-recipient" className="block text-xs font-semibold text-text mb-1">
                      Người nhận
                    </label>
                    <input
                      id="ws-email-recipient"
                      type="text"
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      placeholder="VD: Chị Lan (Trưởng phòng Nhân sự)"
                      className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="ws-email-purpose" className="block text-xs font-semibold text-text mb-1">
                      Mục đích chính
                    </label>
                    <input
                      id="ws-email-purpose"
                      type="text"
                      value={emailPurpose}
                      onChange={(e) => setEmailPurpose(e.target.value)}
                      placeholder="VD: Xin phê duyệt ngân sách sự kiện tháng 12"
                      className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="ws-email-tone" className="block text-xs font-semibold text-text mb-1">
                      Giọng điệu (Tone)
                    </label>
                    <select
                      id="ws-email-tone"
                      value={emailTone}
                      onChange={(e) => setEmailTone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent"
                    >
                      <option value="Lịch sự, chuyên nghiệp">Lịch sự, chuyên nghiệp</option>
                      <option value="Ngắn gọn, dứt khoát, đi thẳng vào việc">Ngắn gọn, đi thẳng vào việc</option>
                      <option value="Thân thiện, cởi mở, hợp tác">Thân thiện, cởi mở</option>
                      <option value="Khéo léo, mềm mỏng khi từ chối hoặc xin gia hạn">Khéo léo, mềm mỏng</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ws-email-lang" className="block text-xs font-semibold text-text mb-1">
                      Ngôn ngữ đầu ra
                    </label>
                    <select
                      id="ws-email-lang"
                      value={emailLanguage}
                      onChange={(e) => setEmailLanguage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent"
                    >
                      <option value="Tiếng Việt">Tiếng Việt</option>
                      <option value="Tiếng Anh thương mại (Business English)">Tiếng Anh thương mại</option>
                      <option value="Song ngữ Việt - Anh">Song ngữ Việt – Anh</option>
                      <option value="Tiếng Nhật kính ngữ công sở">Tiếng Nhật công sở</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="ws-email-context" className="block text-xs font-semibold text-text mb-1">
                    Các ý chính cần đưa vào hoặc bản nháp email gốc <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="ws-email-context"
                    rows={5}
                    value={emailContext}
                    onChange={(e) => setEmailContext(e.target.value)}
                    placeholder="Gạch đầu dòng các thông tin thực tế, mốc thời gian hoặc dán email cần viết lại vào đây..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent leading-relaxed resize-y"
                  />
                </div>
              </div>
            )}

            {/* WORKFLOW B: MEETING SUMMARY */}
            {activeWorkflow === 'meeting-summary' && (
              <div className="space-y-4">
                <div className="rounded-xl bg-bg p-3 border border-border text-xs text-text-muted">
                  <strong className="text-text">Nguyên tắc chống bịa đặt:</strong> AI chỉ trích xuất người phụ trách và thời hạn khi có ghi trong biên bản; mọi mục chưa chốt sẽ được đánh dấu rõ <em>&ldquo;Chưa nêu rõ trong biên bản&rdquo;</em>.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="ws-meeting-title" className="block text-xs font-semibold text-text mb-1">
                      Tên / Chủ đề cuộc họp (tùy chọn)
                    </label>
                    <input
                      id="ws-meeting-title"
                      type="text"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      placeholder="VD: Họp rà soát tiến độ dự án Quý 4"
                      className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="ws-meeting-participants" className="block text-xs font-semibold text-text mb-1">
                      Người tham dự (tùy chọn)
                    </label>
                    <input
                      id="ws-meeting-participants"
                      type="text"
                      value={meetingParticipants}
                      onChange={(e) => setMeetingParticipants(e.target.value)}
                      placeholder="VD: Anh Nam, Chị Thảo, Nhóm Kỹ thuật"
                      className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ws-meeting-notes" className="block text-xs font-semibold text-text mb-1">
                    Ghi chú thô hoặc nội dung gỡ băng cuộc họp <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="ws-meeting-notes"
                    rows={7}
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    placeholder="Dán toàn bộ ghi chú nhanh, tin nhắn trao đổi hoặc bản chép lời cuộc họp vào đây..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent leading-relaxed resize-y"
                  />
                </div>
              </div>
            )}

            {/* WORKFLOW C: DOCUMENT ANALYSIS */}
            {activeWorkflow === 'document-analysis' && (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-text mb-2">
                    Chế độ phân tích tài liệu (chỉ bám sát văn bản cung cấp):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'summarize', label: 'Tóm tắt cấu trúc' },
                      { id: 'extract-key-info', label: 'Trích xuất số liệu & mốc chính' },
                      { id: 'main-findings', label: 'Luận điểm & Khoảng trống' },
                      { id: 'structured-table', label: 'Chuyển thành Bảng' },
                      { id: 'qa', label: 'Hỏi đáp trên văn bản' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        aria-pressed={docMode === m.id}
                        onClick={() => setDocMode(m.id as DocumentAnalysisMode)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          docMode === m.id
                            ? 'border-accent bg-accent text-white'
                            : 'border-border bg-bg text-text-muted hover:text-text'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="ws-doc-text" className="block text-xs font-semibold text-text mb-1">
                    Nội dung văn bản nguồn cần phân tích <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="ws-doc-text"
                    rows={7}
                    value={docText}
                    onChange={(e) => setDocText(e.target.value)}
                    placeholder="Dán nội dung báo cáo, quy định, điều khoản hợp đồng hoặc bài viết chuyên môn vào đây (tối đa 40.000 ký tự)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent leading-relaxed resize-y"
                  />
                </div>

                <div>
                  <label htmlFor="ws-doc-question" className="block text-xs font-semibold text-text mb-1">
                    Câu hỏi cụ thể hoặc trọng tâm cần kiểm tra (bắt buộc khi chọn Hỏi đáp)
                  </label>
                  <input
                    id="ws-doc-question"
                    type="text"
                    value={docQuestion}
                    onChange={(e) => setDocQuestion(e.target.value)}
                    placeholder="VD: Các điều kiện phạt vi phạm hoặc nghĩa vụ thanh toán được nêu như thế nào?"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-bg text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent"
                  />
                </div>
              </div>
            )}

            {/* CUSTOM PROMPT WORKFLOW */}
            {activeWorkflow === 'custom-prompt' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="ws-custom-system" className="block text-xs font-semibold text-text mb-1">
                    Vai trò &amp; Ràng buộc hệ thống (tùy chọn)
                  </label>
                  <textarea
                    id="ws-custom-system"
                    rows={2}
                    value={customSystemPrompt}
                    onChange={(e) => setCustomSystemPrompt(e.target.value)}
                    placeholder="Mặc định: Trợ lý công việc chuyên nghiệp, trình bày rõ ràng, không tự bịa số liệu..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-bg font-mono text-xs text-text focus:outline-hidden focus:border-accent resize-y"
                  />
                </div>

                <div>
                  <label htmlFor="ws-custom-prompt" className="block text-xs font-semibold text-text mb-1">
                    Nội dung câu lệnh thực thi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="ws-custom-prompt"
                    rows={7}
                    value={customPromptText}
                    onChange={(e) => setCustomPromptText(e.target.value)}
                    placeholder="Nhập câu lệnh của bạn hoặc chọn một mẫu từ Thư viện câu lệnh (/prompts) để nạp vào đây..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg font-mono text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent leading-relaxed resize-y"
                  />
                </div>
              </div>
            )}

            {/* Error Alert */}
            {errorBanner && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl border border-red-500/40 bg-red-500/10 text-xs sm:text-sm text-red-700 dark:text-red-300 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{errorBanner}</p>
                </div>
              </div>
            )}

            {/* Nút tạo kết quả */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {!isStreaming ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => handleExecute()}
                    disabled={aiNotReady}
                    title={aiNotReady ? 'AI chưa bật nên tạm thời chưa tạo được kết quả' : undefined}
                    className="gap-2 bg-accent hover:bg-accent-hover text-white font-semibold shadow-md disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{aiNotReady ? 'AI chưa bật' : 'Tạo ngay'}</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={handleStopStreaming}
                    className="gap-2 border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Dừng tạo</span>
                  </Button>
                )}

                <button
                  type="button"
                  onClick={handleSaveAsPersonalTemplate}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-bg hover:border-accent/50 text-xs font-semibold text-text transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-accent" />
                  <span>Lưu làm mẫu cá nhân</span>
                </button>
              </div>

              <span className="text-[11px] text-text-muted">
                Mỗi phút chạy tối đa {status?.rateLimitPerMinute ?? 15} lần
              </span>
            </div>
          </div>

          {/* Result Area (Streaming + Editable + Follow-up Refinement) */}
          <div className="rounded-3xl border border-border bg-bg-elevated overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-border bg-bg/70 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-text">Kết Quả Công Việc</span>
                {isStreaming && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[11px] font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    Đang tạo kết quả...
                  </span>
                )}
              </div>

              {/* Result Action Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={!resultText || isStreaming}
                  onClick={() => setIsEditingResult((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-bg hover:border-accent text-xs font-medium text-text disabled:opacity-40 transition-colors"
                >
                  {isEditingResult ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-accent" />
                      <span>Xem trình bày</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5 text-accent" />
                      <span>Chỉnh sửa</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={!resultText}
                  onClick={handleCopyResult}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-bg hover:border-accent text-xs font-medium text-text disabled:opacity-40 transition-colors"
                >
                  {copiedResult ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={!resultText || isStreaming}
                  onClick={() => handleExecute()}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-bg hover:border-accent text-xs font-medium text-text disabled:opacity-40 transition-colors"
                  title="Chạy lại để tạo phương án mới"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tạo lại</span>
                </button>

                <button
                  type="button"
                  disabled={!resultText || isStreaming}
                  onClick={handleSaveEditedSession}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-bg hover:border-emerald-500 text-xs font-medium text-text disabled:opacity-40 transition-colors"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Lưu lại</span>
                </button>

                <button
                  type="button"
                  disabled={!resultText}
                  onClick={handleDownloadResult}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-bg hover:border-accent text-xs font-medium text-text disabled:opacity-40 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải .md</span>
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 min-h-[260px]">
              {isEditingResult ? (
                <textarea
                  value={resultText}
                  onChange={(e) => setResultText(e.target.value)}
                  rows={14}
                  aria-label="Chỉnh sửa trực tiếp nội dung kết quả"
                  className="w-full p-3.5 rounded-xl border border-accent/40 bg-bg font-sans text-sm text-text leading-relaxed focus:outline-hidden focus:border-accent resize-y"
                />
              ) : resultText ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans text-sm text-text leading-relaxed">
                  {resultText}
                </div>
              ) : (
                <div className="py-14 text-center text-xs sm:text-sm text-text-muted space-y-2">
                  <Sparkles className="w-8 h-8 text-accent/50 mx-auto mb-2" />
                  <p className="font-medium text-text">Sẵn sàng tạo kết quả cho bạn</p>
                  <p className="max-w-md mx-auto">
                    Điền thông tin ở khung phía trên (hoặc bấm <strong>&ldquo;Điền ví dụ mẫu nhanh&rdquo;</strong>) rồi nhấn <strong>&ldquo;Tạo ngay&rdquo;</strong> để nhận kết quả.
                  </p>
                </div>
              )}
            </div>

            {/* Follow-up / Continue Refinement Input */}
            {resultText && !isStreaming && (
              <div className="px-5 py-4 border-t border-border bg-bg/50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (followUpText.trim()) {
                      handleExecute(followUpText.trim());
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                    placeholder="Tinh chỉnh tiếp kết quả này (VD: Rút gọn còn 5 dòng, dịch sang tiếng Anh, đổi giọng trang trọng hơn)..."
                    aria-label="Yêu cầu tinh chỉnh tiếp kết quả"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-bg-surface text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!followUpText.trim()}
                    className="gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Tiếp tục tinh chỉnh</span>
                  </Button>
                </form>
              </div>
            )}

            {/* Usage & Cost Footer */}
            {(lastUsage || lastLatencyMs !== null) && (
              <div className="px-5 py-2.5 border-t border-border bg-bg text-[11px] font-mono text-text-muted flex flex-wrap items-center justify-between gap-2">
                <span>
                  Mô hình: <strong className="text-text">{lastModelLabel || selectedModelId}</strong>
                  {lastLatencyMs !== null && ` • ${(lastLatencyMs / 1000).toFixed(1)}s`}
                </span>
                {lastUsage && (
                  <span>
                    Đã dùng {lastUsage.totalTokens.toLocaleString('vi-VN')} tokens · Ước tính{' '}
                    {lastUsage.estimatedCostVnd.toLocaleString('vi-VN')} VNĐ
                    {` (${lastUsage.inputTokens.toLocaleString('vi-VN')} vào / ${lastUsage.outputTokens.toLocaleString('vi-VN')} ra)`}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE (3 cols): Cài đặt nâng cao — mặc định đóng, AI đã tự chọn giúp bạn */}
        <aside className="lg:col-span-3 space-y-5 order-3 lg:order-none" aria-label="Cài đặt nâng cao">
          <div className="rounded-2xl border border-border bg-bg-surface shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvancedSettings((prev) => !prev)}
              aria-expanded={showAdvancedSettings}
              className="w-full flex items-center justify-between gap-2 p-4 text-left hover:bg-hover transition-colors"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-500" />
                Cài đặt nâng cao
              </span>
              <ChevronDown
                className={`w-4 h-4 text-text-muted transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`}
              />
            </button>
            {!showAdvancedSettings && (
              <p className="px-4 pb-4 text-[11px] text-text-muted leading-relaxed">
                AI đã tự chọn giúp bạn. Chỉ mở mục này khi bạn muốn tự chọn AI, chỉnh độ sáng tạo hay đặt tên cho phiên làm việc.
              </p>
            )}
            {showAdvancedSettings && (
              <div className="px-4 pb-4 pt-1 space-y-4 border-t border-border">
                <div>
                  <label htmlFor="ws-session-title" className="block text-xs font-semibold text-text mb-1.5">
                    Tên phiên làm việc (tùy chọn)
                  </label>
                  <input
                    id="ws-session-title"
                    type="text"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="VD: Email xin gia hạn nộp báo cáo"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs text-text focus:outline-hidden focus:border-accent"
                  />
                </div>

                <div>
                  <label htmlFor="ws-model-select" className="block text-xs font-semibold text-text mb-1.5">
                    AI sẽ dùng
                  </label>
                  <p className="text-[11px] text-text-muted mb-1.5">
                    Đã tự chọn giúp bạn — muốn đổi thì chọn lại ở đây.
                  </p>
              {status?.availableModels && status.availableModels.length > 0 ? (
                <select
                  id="ws-model-select"
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs font-medium text-text focus:outline-hidden focus:border-accent"
                >
                  {status.availableModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-3 py-2 rounded-xl border border-border bg-bg text-xs text-text-muted">
                  {statusLoading ? 'Đang kiểm tra kết nối...' : 'Chưa có mô hình kích hoạt'}
                </div>
              )}
              {status?.availableModels && selectedModelId && (
                <p className="text-[11px] text-text-muted mt-1.5 leading-snug">
                  {status.availableModels.find((m) => m.id === selectedModelId)?.recommendedFor}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label htmlFor="ws-temperature" className="font-semibold text-text">
                  Độ sáng tạo
                </label>
                <span className="font-mono font-bold text-accent">{temperature}</span>
              </div>
              <input
                id="ws-temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-text-muted mt-0.5">
                <span>0.0 (Chặt chẽ, bám sát)</span>
                <span>1.0 (Linh hoạt)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <Link href="/tools/token-calculator" className="text-brand-500 hover:underline font-medium">
                Bảng tính chi phí Token
              </Link>
              <Link href="/compare" className="text-text-muted hover:text-accent">
                So sánh mô hình
              </Link>
            </div>

            {/* Mẫu cá nhân */}
            <div className="pt-3 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Mẫu cá nhân của bạn ({personalTemplates.length})
                </h2>
              <Link href="/prompts" className="text-[11px] font-semibold text-accent hover:underline">
                + Thư viện 80+
              </Link>
            </div>

            {personalTemplates.length === 0 ? (
              <p className="text-xs text-text-muted leading-relaxed">
                Bạn có thể bấm <strong>&ldquo;Lưu làm mẫu cá nhân&rdquo;</strong> để tái sử dụng nhanh các cấu hình thường dùng.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {personalTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setActiveWorkflow('custom-prompt');
                      setCustomPromptText(tpl.template);
                      setSessionTitle(tpl.title);
                      toast.info(`Đã nạp mẫu cá nhân: ${tpl.title}`);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-border/70 bg-bg hover:border-accent/50 transition-colors"
                  >
                    <span className="text-xs font-semibold text-text block truncate">{tpl.title}</span>
                    <span className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{tpl.template}</span>
                  </button>
                ))}
              </div>
            )}
            </div>
            </div>
            )}
          </div>
        </aside>
      </div>

      {/* Nút Tạo ngay luôn thấy ở cuối màn hình trên điện thoại */}
      <div className="sticky bottom-3 z-40 mt-6 lg:hidden">
        {!isStreaming ? (
          <Button
            type="button"
            size="lg"
            onClick={() => handleExecute()}
            disabled={aiNotReady}
            className="w-full gap-2 bg-accent hover:bg-accent-hover text-white font-semibold shadow-lg disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{aiNotReady ? 'AI chưa bật — chưa tạo được' : 'Tạo ngay'}</span>
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={handleStopStreaming}
            className="w-full gap-2 border-red-500/50 bg-bg text-red-600 dark:text-red-400 shadow-lg"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Dừng tạo</span>
          </Button>
        )}
      </div>
    </div>
  );
}
