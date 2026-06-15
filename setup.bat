@echo off
chcp 65001 >NUL 2>&1
title CoolStay Hotel Demo

echo.
echo  ============================================
echo    CoolStay Hotel Demo
echo  ============================================
echo.

cd /d "%~dp0"

set LOG_FILE=setup-log.txt
echo [%date% %time%] setup start > "%LOG_FILE%"

REM -- 1. Node.js check --
node --version >NUL 2>&1
if not errorlevel 1 goto :node_ok

echo  [!] Node.js not found. Installing...
echo [%date% %time%] Node.js not found >> "%LOG_FILE%"

winget --version >NUL 2>&1
if errorlevel 1 goto :no_winget

echo  [..] winget install Node.js LTS...
echo [%date% %time%] winget install start >> "%LOG_FILE%"
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
if errorlevel 1 goto :install_fail

echo.
echo  [OK] Node.js installed. Close this window and run setup.bat again.
echo [%date% %time%] Node.js installed - restart needed >> "%LOG_FILE%"
echo.
pause
exit /b 0

:no_winget
echo.
echo  [X] Please install Node.js manually:
echo      https://nodejs.org/ko
echo [%date% %time%] winget not found >> "%LOG_FILE%"
echo.
pause
exit /b 1

:install_fail
echo.
echo  [X] Node.js install failed.
echo      Please install manually: https://nodejs.org/ko
echo [%date% %time%] Node.js install failed >> "%LOG_FILE%"
echo.
pause
exit /b 1

:node_ok
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo  [OK] Node.js %NODE_VER%
echo [%date% %time%] Node.js %NODE_VER% >> "%LOG_FILE%"
echo.

REM -- 2. npm install --
echo  [..] npm install...
echo [%date% %time%] npm install start >> "%LOG_FILE%"
call npm install 2>> "%LOG_FILE%"
if errorlevel 1 goto :npm_fail

echo  [OK] packages ready
echo [%date% %time%] npm install done >> "%LOG_FILE%"
echo.
goto :start_server

:npm_fail
echo.
echo  [X] npm install failed. See %LOG_FILE%
echo [%date% %time%] npm install failed >> "%LOG_FILE%"
echo.
pause
exit /b 1

:start_server
REM -- 3. dev server --
echo  [..] starting server...
echo [%date% %time%] npm run dev start >> "%LOG_FILE%"
echo.
echo  ============================================
echo    http://localhost:3002/admin
echo    Close this window to stop.
echo  ============================================
echo.

start /b cmd /c "timeout /t 5 /nobreak >NUL && start http://localhost:3002/admin"
call npm run dev 2>> "%LOG_FILE%"

echo.
echo [%date% %time%] server stopped >> "%LOG_FILE%"
echo  [!] Server stopped. See %LOG_FILE%
echo.
pause
