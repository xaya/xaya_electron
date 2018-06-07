setlocal EnableDelayedExpansion
if exist "!AppData!\Chimaera\appdata.orvald" (
    set /p DataDirPath=<!AppData!\Chimaera\appdata.orvald

	tasklist|find /i "chimaerad.exe" >NUL
	if errorlevel 1 %~dp0chimaerad.exe -testnet -server -rpcallowip=127.0.0.1 -datadir=!DataDirPath! -namehistory -zmqpubhashtx=tcp://127.0.0.1:28332 -zmqpubhashblock=tcp://127.0.0.1:28332 -zmqpubrawblock=tcp://127.0.0.1:28332 -zmqpubrawtx=tcp://127.0.0.1:28332 -addnode=46.101.15.140 -rpcport=10133
	goto :eof	
) else (
	tasklist|find /i "chimaerad.exe" >NUL
	if errorlevel 1 %~dp0chimaerad.exe -testnet -server -rpcallowip=127.0.0.1 -namehistory -zmqpubhashtx=tcp://127.0.0.1:28332 -zmqpubhashblock=tcp://127.0.0.1:28332 -zmqpubrawblock=tcp://127.0.0.1:28332 -zmqpubrawtx=tcp://127.0.0.1:28332 -addnode=46.101.15.140 -rpcport=10133
	goto :eof
)

