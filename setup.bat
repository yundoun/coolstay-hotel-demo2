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

REM 로그 파일 설정
set LOG_FILE=setup-log.txt
echo [%date% %time%] === setup 시작 === > "%LOG_FILE%"

REM ── 1. Node.js 설치 확인 ──
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Node.js가 설치되어 있지 않습니다.
    echo [%date% %time%] Node.js 미설치 >> "%LOG_FILE%"
    echo.
    echo      자동으로 설치를 시도합니다...
    echo.
    where winget >nul 2>&1
    if %errorlevel% equ 0 (
        echo      winget으로 Node.js LTS를 설치합니다...
        echo [%date% %time%] winget으로 Node.js 설치 시도 >> "%LOG_FILE%"
        winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
        if %errorlevel% neq 0 (
            echo.
            echo  [X] 자동 설치에 실패했습니다.
            echo      아래 링크에서 직접 설치해주세요:
            echo      https://nodejs.org/ko
            echo [%date% %time%] Node.js 자동 설치 실패 >> "%LOG_FILE%"
            echo.
            pause
            exit /b 1
        )
        echo.
        echo  [OK] Node.js 설치 완료. 이 창을 닫고 다시 실행해주세요.
        echo       (환경변수 반영을 위해 재시작이 필요합니다)
        echo [%date% %time%] Node.js 설치 완료 - 재시작 필요 >> "%LOG_FILE%"
        echo.
        pause
        exit /b 0
    ) else (
        echo  [X] 아래 링크에서 Node.js를 설치한 뒤 다시 실행해주세요:
        echo      https://nodejs.org/ko
        echo [%date% %time%] winget 없음 - 수동 설치 필요 >> "%LOG_FILE%"
        echo.
        pause
        exit /b 1
    )
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo  [OK] Node.js %NODE_VER% 감지됨
echo [%date% %time%] Node.js %NODE_VER% 감지됨 >> "%LOG_FILE%"
echo.

REM ── 2. 의존성 설치 ──
echo  [..] 패키지를 확인합니다...
echo [%date% %time%] npm install 시작 >> "%LOG_FILE%"
call npm install 2>> "%LOG_FILE%"
if %errorlevel% neq 0 (
    echo.
    echo  [X] 패키지 설치에 실패했습니다.
    echo      상세 로그: %cd%\%LOG_FILE%
    echo [%date% %time%] npm install 실패 >> "%LOG_FILE%"
    echo.
    pause
    exit /b 1
)
echo.
echo  [OK] 패키지 준비 완료
echo [%date% %time%] npm install 완료 >> "%LOG_FILE%"
echo.

REM ── 3. 개발 서버 실행 ──
echo  [..] 서버를 시작합니다...
echo [%date% %time%] npm run dev 시작 >> "%LOG_FILE%"
echo.
echo  ============================================
echo    잠시 후 브라우저가 자동으로 열립니다.
echo    종료하려면 이 창을 닫으세요.
echo  ============================================
echo.

REM 5초 후 브라우저 오픈 (서버 준비 시간 확보)
start /b cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000/admin"
call npm run dev 2>> "%LOG_FILE%"

echo.
echo [%date% %time%] npm run dev 종료 (코드: %errorlevel%) >> "%LOG_FILE%"
echo  ============================================
echo    [!] 서버가 종료되었습니다.
echo    상세 로그: %cd%\%LOG_FILE%
echo    위 메시지를 확인하고 아무 키나 누르세요.
echo  ============================================
echo.
pause
