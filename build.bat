@echo off
chcp 65001 >nul
title AeroFatigue Edu 生产构建
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js，请先安装 Node.js 20.9 或更高版本。
  pause
  exit /b 1
)

if not exist "node_modules\next\package.json" (
  echo [提示] 正在安装项目依赖……
  call npm install
  if errorlevel 1 (
    echo [错误] 依赖安装失败。
    pause
    exit /b 1
  )
)

echo [构建] 正在创建生产版本……
call npm run build
if errorlevel 1 (
  echo [错误] 生产构建失败，请查看上方错误。
  pause
  exit /b 1
)

echo [完成] 生产构建成功。
pause
