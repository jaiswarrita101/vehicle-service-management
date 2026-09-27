@echo off
title VSMS - Push to GitHub
color 0A
echo ========================================================
echo    VSMS AUTOMATIC GITHUB DEPLOYMENT
echo    Target: https://github.com/jaiswarrita101/vehicle-service-management
echo ========================================================
echo.
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/jaiswarrita101/vehicle-service-management.git
echo Uploading files to GitHub...
echo.
git push -u origin main
echo.
echo ========================================================
echo   DONE! Code is now live on GitHub.
echo ========================================================
pause
