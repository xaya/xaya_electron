@echo off
setlocal EnableExtensions EnableDelayedExpansion
cls
if exist "!AppData!\Chimaera\appdata.orv" (
    set /p DataDirPath=<!AppData!\Chimaera\appdata.orv
	tasklist|find /i "chimaerad.exe" >NUL
	if errorlevel 1 chimaerad.exe -wallet=vault.dat  -wallet=game.dat -server -rpcallowip=127.0.0.1 -datadir=!DataDirPath! -namehistory -zmqpubhashtx=tcp://127.0.0.1:28332 -zmqpubhashblock=tcp://127.0.0.1:28332 -zmqpubrawblock=tcp://127.0.0.1:28332 -zmqpubrawtx=tcp://127.0.0.1:28332 -addnode=46.101.15.140
	goto :eof	
) else (
	tasklist|find /i "chimaerad.exe" >NUL
	if errorlevel 1 chimaerad.exe -wallet=vault.dat  -wallet=game.dat -server -rpcallowip=127.0.0.1 -namehistory -zmqpubhashtx=tcp://127.0.0.1:28332 -zmqpubhashblock=tcp://127.0.0.1:28332 -zmqpubrawblock=tcp://127.0.0.1:28332 -zmqpubrawtx=tcp://127.0.0.1:28332 -addnode=46.101.15.140
	goto :eof
)

