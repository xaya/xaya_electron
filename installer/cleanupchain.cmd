IF EXIST "%appdata%\Xaya\peers.dat" del "%appdata%\Xaya\peers.dat"
IF EXIST "%appdata%\Xaya\blocks\" @RD /S /Q "%appdata%\Xaya\blocks\"
IF EXIST "%appdata%\Xaya\chainstate\" @RD /S /Q "%appdata%\Xaya\chainstate\"
IF EXIST "%appdata%\XAYA-Electron\xiddatadir\" @RD /S /Q "%appdata%\XAYA-Electron\xiddatadir\"