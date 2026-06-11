@echo off
chcp 65001 >nul 2>&1
title CoolStay Hotel Demo

echo.
echo  ============================================
echo    CoolStay Hotel Demo - 환경 세팅 및 실행
echo  ============================================
echo.

REM 스크립트가 위치한 폴더로 이동
cd /d "%~dp0"

REM ── 1. Node.js 설치 확인 ──
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Node.js가 설치되어 있지 않습니다.
    echo.
    echo      자동으로 설치를 시도합니다...
    echo.
    where winget >nul 2>&1
    if %errorlevel% equ 0 (
        echo      winget으로 Node.js LTS를 설치합니다...
        winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
        if %errorlevel% neq 0 (
            echo.
            echo  [X] 자동 설치에 실패했습니다.
            echo      아래 링크에서 직접 설치해주세요:
            echo      https://nodejs.org/ko
            echo.
            pause
            exit /b 1
        )
        echo.
        echo  [OK] Node.js 설치 완료. 이 창을 닫고 다시 실행해주세요.
        echo       (환경변수 반영을 위해 재시작이 필요합니다)
        echo.
        pause
        exit /b 0
    ) else (
        echo  [X] 아래 링크에서 Node.js를 설치한 뒤 다시 실행해주세요:
        echo      https://nodejs.org/ko
        echo.
        pause
        exit /b 1
    )
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo  [OK] Node.js %NODE_VER% 감지됨
echo.

REM ── 2. 의존성 설치 ──
echo  [..] 패키지를 확인합니다...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo  [X] 패키지 설치에 실패했습니다.
    pause
    exit /b 1
)
echo.
echo  [OK] 패키지 준비 완료
echo.

REM ── 3. 개발 서버 실행 ──
echo  [..] 서버를 시작합니다...
echo.
echo  ============================================
echo    브라우저에서 http://localhost:3000/admin 접속
echo    종료하려면 이 창을 닫으세요
echo  ============================================
echo.

start "" http://localhost:3000/admin
call npm run dev
