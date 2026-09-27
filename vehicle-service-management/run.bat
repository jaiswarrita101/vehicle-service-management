@echo off
title VSMS - Vehicle Service Management System
echo ========================================================
echo   Vehicle Service Management System (VSMS)
echo   Starting Local Web Server at http://localhost:5000/
echo ========================================================
echo.

cd /d "%~dp0"

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting Node.js Server on port 5000...
    start "" http://localhost:5000/index.html
    node server.js
) else (
    echo Node.js not detected in PATH. Opening directly in default browser...
    start "" "%~dp0index.html"
)

pause
