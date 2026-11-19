// TypeScript 6 yêu cầu khai báo kiểu cho import side-effect của file CSS
// (trước đây tsc bỏ qua). Next không còn tự khai báo '*.css' nữa.
declare module '*.css';
