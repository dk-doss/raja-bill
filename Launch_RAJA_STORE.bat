@echo off
title RAJA STORE - Launch Application
color 0E

echo ===================================================
echo     RAJA STORE - Customer & Store Management App
echo ===================================================
echo.
echo Starting RAJA STORE services...

:: Check if server is already running on port 5000
netstat -ano | findstr :5000 >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] RAJA STORE Server is already active on port 5000.
) else (
    echo [*] Starting server in background...
    start /min "RAJA STORE SERVER" cmd /c "node server/index.js"
    timeout /t 2 /nobreak >nul
)

:: Try opening in Google Chrome App mode (standalone window)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    echo [*] Launching RAJA STORE App window...
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=http://localhost:5000
    exit
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    echo [*] Launching RAJA STORE App window...
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app=http://localhost:5000
    exit
)

:: Fallback to Microsoft Edge App mode (standard on all Windows machines)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    echo [*] Launching RAJA STORE App window via Edge...
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:5000
    exit
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    echo [*] Launching RAJA STORE App window via Edge...
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:5000
    exit
)

:: Generic default browser fallback
start http://localhost:5000
exit
