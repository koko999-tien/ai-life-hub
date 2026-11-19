# AI Life Hub

Kho câu lệnh AI thực chiến tiếng Việt giúp viết email, làm báo cáo, tóm tắt tài
liệu — cùng bộ công cụ tính chi phí, so sánh các dòng AI và AI Workspace thực
thi trực tiếp trên máy chủ.

## Yêu cầu

- Node.js **>= 20.9** (khuyên dùng Node 22, xem `.nvmrc`).
- npm (đi kèm Node).

## Chạy dự án

```bash
npm ci
npm run dev      # chạy ở http://localhost:3000
npm run build    # build production
npm start        # chạy bản production sau khi build
```

Kiểm tra chất lượng:

```bash
npm run type-check   # tsc --noEmit
npm run lint
npm test             # chạy bộ kiểm tra E2E (tests/e2e/run.ts)
npm run test:e2e      # tương đương npm test
```

## Biến môi trường

Sao chép `.env.example` thành `.env.local` và điền các giá trị cần thiết.
**Không bao giờ** đặt tiền tố `NEXT_PUBLIC_` cho các API key AI — chúng chỉ
được dùng phía máy chủ.

| Biến | Bắt buộc | Mô tả |
| --- | --- | --- |
| `GEMINI_API_KEY` | Một trong các key AI | Bật AI Workspace qua Google Gemini |
| `OPENAI_API_KEY` | Một trong các key AI | Bật AI Workspace qua OpenAI |
| `ANTHROPIC_API_KEY` | Một trong các key AI | Bật AI Workspace qua Anthropic |
| `DEEPSEEK_API_KEY` | Một trong các key AI | Bật AI Workspace qua DeepSeek |
| `OPENROUTER_API_KEY` | Một trong các key AI | Bật AI Workspace qua OpenRouter |
| `NEXT_PUBLIC_SUPABASE_URL` | Không | Supabase; nếu thiếu, app dùng chế độ LocalStorage |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Không | Khóa anon Supabase |
| `NEXT_PUBLIC_SITE_URL` | Không | URL chính thức của site (mặc định `https://ai-life-hub-omega.vercel.app`) |

## Deploy

Deploy lên Vercel: import repo, đặt các biến môi trường trên trong phần
Environment Variables của project (chỉ đặt key AI ở phía server, không expose
cho client), rồi deploy. Xem thêm trong phần biến môi trường ở trên.

## Cấu trúc thư mục chính

```
src/app/                 # App Router: trang, API route (/api/workspace/*)
src/components/          # Component UI theo nhóm (layout, workspace, learn, tools...)
src/lib/ai/              # Tầng AI phía server: registry, provider, rate-limiter
src/lib/                 # Tiện ích dùng chung (hooks, supabase, content...)
content/                 # Nội dung (prompt, bài học...)
scripts/                 # Script build/validate (search index, content)
tests/e2e/               # Bộ kiểm tra E2E (run.ts)
public/                  # Tài nguyên tĩnh
```

## Lưu ý

- **API key chỉ ở server:** các key AI chỉ được đọc trong API route
  (`src/app/api/workspace/*`); client không bao giờ thấy key.
- **Rate-limit:** API `/api/workspace/execute` giới hạn số yêu cầu liên tiếp
  theo client; vượt quá sẽ trả `429 RATE_LIMITED` kèm header `Retry-After`.
- **Không có key AI:** khi chưa cấu hình provider nào, thực thi AI trả `503
  AI_PROVIDER_NOT_CONFIGURED` thay vì trả kết quả giả.
- **Model không tồn tại:** yêu cầu `modelId` không có trong provider đã cấu
  hình sẽ trả `400 MODEL_NOT_FOUND` — server không tự đổi sang model khác.
