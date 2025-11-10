@echo off
echo ====================================
echo  TELMI - Development Server
echo ====================================
echo.
echo Menjalankan development server...
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo ERROR: node_modules tidak ditemukan!
    echo Silakan jalankan install.bat terlebih dahulu
    pause
    exit /b 1
)

call npm run dev

pause






