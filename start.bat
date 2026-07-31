@echo off
chcp 65001 >nul
title AeroFatigue Edu 启动器
cd /d "%~dp0"

echo.
echo ==========================================
echo   AeroFatigue Edu 虚拟实验教学平台
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js。
  echo 请安装 Node.js 20.9 或更高版本，然后重新双击本文件。
  echo 官方网站：https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\next\package.json" (
  echo [提示] 第一次运行，需要安装项目依赖，请保持网络连接。
  call npm install
  if errorlevel 1 (
    echo [错误] 依赖安装失败，请检查网络后重试。
    pause
    exit /b 1
  )
)

echo [完成] 环境检查通过。
echo [启动] 本地地址：http://localhost:3000
echo 请勿关闭本窗口；关闭窗口后网站会停止。
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
call npm run dev

if errorlevel 1 (
  echo.
  echo [错误] 网站启动失败，请查看上方提示。
  pause
  exit /b 1
)
