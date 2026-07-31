@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

set "PNPM="
where pnpm >nul 2>nul
if not errorlevel 1 set "PNPM=pnpm"
if not defined PNPM (
  if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd" (
    set "PNPM=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"
  )
)

if not defined PNPM (
  where npm >nul 2>nul
  if not errorlevel 1 set "PNPM=npm"
)

if not defined PNPM (
  echo [错误] 未找到 pnpm 或 npm。请先安装 Node.js，或在 Codex 中运行本文件。
  pause
  exit /b 1
)

set "GITHUB_PAGES=true"
set "GITHUB_REPOSITORY=wehrleymullanag18-design/aerofatigue-edu"
set "NEXT_PUBLIC_BASE_PATH=/aerofatigue-edu"

echo [1/3] 检查生产构建...
call "%PNPM%" run build
if errorlevel 1 (
  echo [错误] 构建失败，未发布任何内容。
  pause
  exit /b 1
)

echo [2/3] 提交网站更新...
git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "更新 AeroFatigue Edu 网站"
  if errorlevel 1 (
    echo [错误] Git 提交失败。
    pause
    exit /b 1
  )
) else (
  echo 没有新的文件需要提交。
)

echo [3/3] 推送并触发 GitHub Pages 部署...
git push origin main
if errorlevel 1 (
  echo [错误] 推送失败，请在 Codex 中检查 GitHub 登录状态。
  pause
  exit /b 1
)

echo.
echo 发布任务已提交。公开网址：
echo https://wehrleymullanag18-design.github.io/aerofatigue-edu/
echo GitHub 通常需要 1 至 3 分钟完成更新。
pause
