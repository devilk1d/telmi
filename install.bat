@echo off
echo ====================================
echo  TELMI - Install Dependencies
echo ====================================
echo.
echo Menggunakan Command Prompt untuk menghindari PowerShell execution policy error...
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js tidak ditemukan!
    echo Silakan install Node.js dari https://nodejs.org
    pause
    exit /b 1
)

echo Node.js ditemukan!
echo.
echo Menginstall dependencies...
echo.

call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo  Install berhasil!
    echo ====================================
    echo.
    echo Untuk menjalankan development server, ketik:
    echo   npm run dev
    echo.
) else (
    echo.
    echo ====================================
    echo  Install gagal!
    echo ====================================
    echo.
)

pause






