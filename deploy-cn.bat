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
  echo [错误] 未找到 pnpm。请在 Codex 中运行本文件，或先安装 Node.js 和 pnpm。
  pause
  exit /b 1
)

set "EDGEONE_PAGES=true"
set "GITHUB_PAGES="
set "NEXT_PUBLIC_BASE_PATH="

echo [1/2] 构建中国站生产版本...
call "%PNPM%" run build
if errorlevel 1 (
  echo [错误] 构建失败，未发布任何内容。
  pause
  exit /b 1
)

set "NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "EDGEONE=%~dp0tmp\edgeone-cli\node_modules\edgeone\edgeone-bin\edgeone.js"

echo [2/2] 上传到腾讯云 EdgeOne 中国站...
if exist "%NODE%" if exist "%EDGEONE%" (
  "%NODE%" "%EDGEONE%" makers deploy "%~dp0out" --name aerofatigue-edu --env production --area global
) else (
  call "%PNPM%" dlx edgeone@latest makers deploy "%~dp0out" --name aerofatigue-edu --env production --area global
)

if errorlevel 1 (
  echo [错误] 部署失败，请在 Codex 中检查 EdgeOne 登录状态。
  pause
  exit /b 1
)

echo.
echo 中国站发布完成：
echo https://aerofatigue-edu-0yfyjkod.edgeone.cool/
pause
