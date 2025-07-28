@echo off
echo Starting development mode...
start cmd /k "npm run build:watch"
timeout /t 3 /nobreak > nul
start cmd /k "npm start"
echo Development mode started!
echo Press any key to exit...
pause > nul