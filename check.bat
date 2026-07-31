@echo off
chcp 65001 >nul
title AeroFatigue Edu 完整检查
cd /d "%~dp0"

if not exist "node_modules\next\package.json" (
  echo [提示] 正在安装项目依赖……
  call npm install
  if errorlevel 1 goto :error
)

echo [1/4] 检查代码规范……
call npm run lint
if errorlevel 1 goto :error

echo [2/4] 检查 TypeScript 类型……
call npm run typecheck
if errorlevel 1 goto :error

echo [3/4] 运行单元测试……
call npm run test
if errorlevel 1 goto :error

echo [4/4] 创建生产构建……
call npm run build
if errorlevel 1 goto :error

echo.
echo [完成] 代码规范、类型、单元测试和生产构建全部通过。
pause
exit /b 0

:error
echo.
echo [错误] 检查未通过，请查看上方信息。
pause
exit /b 1
