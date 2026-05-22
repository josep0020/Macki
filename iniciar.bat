@echo off
title Maule Leña
cd /d "C:\Users\josea\OneDrive\Escritorio\leña"
echo ============================================
echo         MAULE LENA - Servidor Local
echo ============================================
echo.
for /f "tokens=2 delims=:" %%a in ('powershell -Command "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike '*Loopback*' -and $_.PrefixOrigin -ne 'WellKnown' }).IPAddress"') do set ip=%%a
set ip=%ip: =%
echo  Abre estas URLs en tu navegador:
echo.
echo  Local:    http://localhost:3000
echo  Red:      http://%ip%:3000
echo.
echo  Para que otros accedan desde su celular:
echo  - Conectate a la misma red Wi-Fi / Hotspot
echo  - Abre http://%ip%:3000
echo  - Ve a "Mi Cuenta" ^> "Mostrar QR"
echo.
echo ============================================
echo.
npx vite --port=3000 --host=0.0.0.0
pause
