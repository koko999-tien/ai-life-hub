'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShieldCheck,
  Clock,
  Bookmark,
  FileText,
  Download,
  Trash2,
  ArrowRight,
  LogOut,
  LogIn,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { Button, toast } from '@/components/ui';
import {
  isSupabaseConfigured,
  supabase,
  fetchBookmarks,
  clearAllLocalPersonalData,
  type BookmarkItem,
} from '@/lib/supabase/client';
import {
  listWorkspaceSessions,
  deleteWorkspaceSession,
  listPersonalTemplates,
  createPersonalTemplate,
  deletePersonalTemplate,
  type WorkspaceSessionRecord,
  type PersonalTemplateRecord,
} from '@/lib/workspace/storage';
import { trackEvent } from '@/lib/analytics';

export function AccountClient() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authLoading, setAuthLoading] = useState(false);

  const [sessions, setSessions] = useState<WorkspaceSessionRecord[]>([]);
  const [templates, setTemplates] = useState<PersonalTemplateRecord[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [newTplTitle, setNewTplTitle] = useState('');
  const [newTplBody, setNewTplBody] = useState('');
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const loadAllUserData = async (uid?: string) => {
    setLoadingData(true);
    try {
      const [s, t, b] = await Promise.all([
        listWorkspaceSessions(uid),
        listPersonalTemplates(uid),
        fetchBookmarks(uid),
      ]);
      setSessions(s);
      setTemplates(t);
      setBookmarks(b);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function init() {
      let uid: string | undefined;
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getUser();
          if (data.user && mounted) {
            setUser({ id: data.user.id, email: data.user.email });
            uid = data.user.id;
          }
        } catch {
          // Ignore
        }
      }
      if (mounted) {
        await loadAllUserData(uid);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) return;
    if (!authEmail.trim() || authPassword.length < 6) {
      toast.error('Vui lòng nhập email hợp lệ và mật khẩu tối thiểu 6 ký tự.');
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
        });
        if (error) {
          toast.error(error.message);
        } else {
          trackEvent('signup_completed', { mode: 'cloud' });
          toast.success('Đã đăng ký tài khoản! Vui lòng kiểm tra hộp thư nếu hệ thống yêu cầu xác nhận email.');
          if (data.user) {
            setUser({ id: data.user.id, email: data.user.email });
            await loadAllUserData(data.user.id);
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword,
        });
        if (error) {
          toast.error('Thông tin đăng nhập chưa chính xác.');
        } else if (data.user) {
          setUser({ id: data.user.id, email: data.user.email });
          await loadAllUserData(data.user.id);
          toast.success('Đăng nhập thành công!');
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    await loadAllUserData(undefined);
    toast.success('Đã đăng xuất tài khoản.');
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTplTitle.trim() || !newTplBody.trim()) {
      toast.error('Vui lòng nhập tên mẫu và nội dung câu lệnh.');
      return;
    }
    const created = await createPersonalTemplate(
      {
        title: newTplTitle.trim(),
        description: 'Mẫu câu lệnh cá nhân',
        template: newTplBody.trim(),
      },
      user?.id
    );
    setTemplates((prev) => [created, ...prev]);
    setNewTplTitle('');
    setNewTplBody('');
    toast.success('Đã tạo mẫu câu lệnh cá nhân mới!');
  };

  const handleExportBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      storageMode: user ? 'supabase-cloud' : 'browser-local',
      bookmarks,
      workspaceSessions: sessions,
      personalTemplates: templates,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-life-hub-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Đã tải xuống bản sao lưu dữ liệu cá nhân (.json)!');
  };

  const handleDeleteAllPersonalData = async () => {
    if (user && isSupabaseConfigured && supabase) {
      try {
        await Promise.all([
          (supabase as any).from('workspace_sessions').delete().eq('user_id', user.id),
          (supabase as any).from('personal_templates').delete().eq('user_id', user.id),
          (supabase as any).from('bookmarks').delete().eq('user_id', user.id),
        ]);
      } catch {
        // Continue to clear local data as well
      }
    }

    clearAllLocalPersonalData();
    setSessions([]);
    setTemplates([]);
    setBookmarks([]);
    setConfirmClearAll(false);
    toast.success('Đã xóa sạch toàn bộ dữ liệu cá nhân trên trình duyệt này!');
  };

  return (
    <div className="space-y-10">
      {/* Storage Mode & Account Status Card */}
      <section className="rounded-3xl border border-border bg-bg-elevated p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {isSupabaseConfigured
                  ? user
                    ? `Đã đăng nhập đồng bộ (${user.email})`
                    : 'Đã kết nối cơ sở dữ liệu đám mây (Chưa đăng nhập)'
                  : 'Chế độ Lưu Cục Bộ Riêng Tư Trên Trình Duyệt'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-text">
              Tài Khoản &amp; Quản Lý Dữ Liệu Cá Nhân
            </h1>
            <p className="text-sm text-text-muted leading-relaxed">
              {isSupabaseConfigured
                ? 'Đăng nhập để đồng bộ các mục yêu thích, lịch sử phiên AI Workspace và mẫu câu lệnh cá nhân trên nhiều thiết bị với chính sách phân quyền bảo mật theo người dùng (RLS).'
                : 'Triển khai hiện tại chưa gắn biến môi trường Supabase đám mây: toàn bộ phiên làm việc, mục yêu thích và mẫu cá nhân của bạn được lưu riêng tư ngay trên trình duyệt này — không ai khác có thể truy cập.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg hover:border-accent text-xs font-semibold text-text transition-colors"
            >
              <Download className="w-4 h-4 text-accent" />
              <span>Xuất sao lưu (.json)</span>
            </button>

            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-bg hover:text-red-500 text-xs font-semibold text-text transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            )}
          </div>
        </div>

        {/* Supabase Auth Form when Supabase IS configured and user is signed out */}
        {isSupabaseConfigured && !user && (
          <form onSubmit={handleAuthSubmit} className="mt-6 pt-6 border-t border-border max-w-xl space-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  authMode === 'signin' ? 'bg-accent text-white' : 'bg-bg text-text-muted'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  authMode === 'signup' ? 'bg-accent text-white' : 'bg-bg text-text-muted'
                }`}
              >
                Tạo tài khoản mới
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="Email của bạn"
                aria-label="Email đăng nhập"
                className="px-3.5 py-2.5 rounded-xl border border-border bg-bg text-sm text-text focus:outline-hidden focus:border-accent"
              />
              <input
                type="password"
                required
                minLength={6}
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                aria-label="Mật khẩu"
                className="px-3.5 py-2.5 rounded-xl border border-border bg-bg text-sm text-text focus:outline-hidden focus:border-accent"
              />
            </div>

            <Button type="submit" size="sm" disabled={authLoading} className="gap-1.5">
              <LogIn className="w-4 h-4" />
              <span>
                {authLoading
                  ? 'Đang xử lý...'
                  : authMode === 'signin'
                  ? 'Đăng nhập đồng bộ'
                  : 'Đăng ký tài khoản'}
              </span>
            </Button>
          </form>
        )}
      </section>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-bg-surface p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-text-muted">Phiên AI Workspace</span>
            <Clock className="w-4 h-4 text-accent" />
          </div>
          <p className="text-3xl font-mono font-extrabold text-text">{sessions.length}</p>
          <Link href="/workspace" className="inline-flex items-center gap-1 text-xs font-semibold text-accent mt-2 hover:underline">
            <span>Mở AI Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-bg-surface p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-text-muted">Mẫu Câu Lệnh Cá Nhân</span>
            <FileText className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-3xl font-mono font-extrabold text-text">{templates.length}</p>
          <span className="text-xs text-text-muted block mt-2">Tái sử dụng nhanh trong Workspace</span>
        </div>

        <div className="rounded-2xl border border-border bg-bg-surface p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-text-muted">Mục Đã Đánh Dấu</span>
            <Bookmark className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-mono font-extrabold text-text">{bookmarks.length}</p>
          <Link href="/favorites" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mt-2 hover:underline">
            <span>Xem danh sách Yêu thích</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Personal Templates Manager & Saved Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Prompt Templates */}
        <section className="rounded-3xl border border-border bg-bg-surface p-6 space-y-4">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            Mẫu Câu Lệnh Cá Nhân Của Bạn
          </h2>

          <form onSubmit={handleCreateTemplate} className="space-y-3 p-4 rounded-2xl bg-bg border border-border">
            <input
              type="text"
              value={newTplTitle}
              onChange={(e) => setNewTplTitle(e.target.value)}
              placeholder="Tên mẫu cá nhân (VD: Báo cáo tiến độ tuần cho Sếp)"
              aria-label="Tên mẫu câu lệnh cá nhân"
              className="w-full px-3 py-2 rounded-xl border border-border bg-bg-surface text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent"
            />
            <textarea
              rows={3}
              value={newTplBody}
              onChange={(e) => setNewTplBody(e.target.value)}
              placeholder="Nội dung câu lệnh mẫu của bạn..."
              aria-label="Nội dung mẫu câu lệnh cá nhân"
              className="w-full px-3 py-2 rounded-xl border border-border bg-bg-surface text-xs sm:text-sm text-text focus:outline-hidden focus:border-accent resize-y"
            />
            <Button type="submit" size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Lưu mẫu cá nhân</span>
            </Button>
          </form>

          {loadingData ? (
            <p className="text-xs text-text-muted py-4">Đang tải dữ liệu...</p>
          ) : templates.length === 0 ? (
            <p className="text-xs text-text-muted py-4 text-center">Chưa có mẫu câu lệnh cá nhân nào.</p>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {templates.map((tpl) => (
                <div key={tpl.id} className="p-3.5 rounded-2xl bg-bg border border-border flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-text truncate">{tpl.title}</h3>
                    <p className="text-xs text-text-muted line-clamp-2 mt-1 font-mono">{tpl.template}</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await deletePersonalTemplate(tpl.id, user?.id);
                      setTemplates((prev) => prev.filter((item) => item.id !== tpl.id));
                      toast.success('Đã xóa mẫu cá nhân.');
                    }}
                    className="p-1.5 text-text-muted hover:text-red-500 shrink-0"
                    aria-label={`Xóa mẫu ${tpl.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Workspace Sessions */}
        <section className="rounded-3xl border border-border bg-bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              Lịch Sử Phiên AI Workspace
            </h2>
            <Link href="/workspace" className="text-xs font-semibold text-accent hover:underline">
              Mở Workspace
            </Link>
          </div>

          {loadingData ? (
            <p className="text-xs text-text-muted py-4">Đang tải lịch sử...</p>
          ) : sessions.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-border text-center text-xs text-text-muted">
              Chưa có phiên làm việc nào được lưu. Hãy thực thi một tác vụ trong AI Workspace để lưu kết quả tại đây.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto">
              {sessions.map((s) => (
                <div key={s.id} className="p-3.5 rounded-2xl bg-bg border border-border flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-text truncate">{s.title}</h3>
                    <p className="text-xs text-text-muted line-clamp-2 mt-1">{s.resultText}</p>
                    <span className="text-[11px] text-text-muted block mt-1.5">
                      Cập nhật: {new Date(s.updatedAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteWorkspaceSession(s.id, user?.id);
                      setSessions((prev) => prev.filter((item) => item.id !== s.id));
                      toast.success('Đã xóa phiên làm việc.');
                    }}
                    className="p-1.5 text-text-muted hover:text-red-500 shrink-0"
                    aria-label={`Xóa phiên ${s.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 1-Click Complete Personal Data Deletion Zone */}
      <section className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h2 className="text-base font-bold text-text flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Quyền Kiểm Soát &amp; Xóa Toàn Bộ Dữ Liệu Cá Nhân
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Xóa sạch toàn bộ lịch sử phiên AI Workspace, mẫu câu lệnh cá nhân, mục yêu thích, đánh giá cục bộ và nhật ký sự kiện đang lưu trên trình duyệt của bạn.
            </p>
          </div>

          {!confirmClearAll ? (
            <button
              type="button"
              onClick={() => setConfirmClearAll(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/40 bg-bg hover:bg-red-600 text-red-600 hover:text-white text-xs font-semibold transition-colors shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa toàn bộ dữ liệu cá nhân</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleDeleteAllPersonalData}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Xác nhận xóa vĩnh viễn
              </button>
              <button
                type="button"
                onClick={() => setConfirmClearAll(false)}
                className="px-3 py-2.5 rounded-xl border border-border bg-bg text-xs font-medium text-text"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
