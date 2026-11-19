// ESLint flat config (ESLint 9 + Next.js 16).
// Migrate thủ công từ .eslintrc.js: codemod next-lint-to-eslint-cli sinh ra
// config FlatCompat bị lỗi circular structure với eslint-config-next 16,
// nên dùng trực tiếp flat export của eslint-config-next.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn",
      // eslint-plugin-react-hooks v6 (đi kèm Next 16) bật thêm 3 rule mới
      // dạng error; codebase hiện tại có sẵn các pattern này (setState
      // trong effect, component tạo trong render...). Tạm hạ xuống warn để
      // không chặn nâng cấp, sửa dần từng chỗ sau thay vì đổi hành vi hàng loạt.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  globalIgnores([
    "node_modules/",
    ".next/",
    "out/",
    "public/",
    "*.config.js",
    "*.config.mjs",
    "scripts/",
  ]),
]);
