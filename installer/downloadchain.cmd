cd %1
curl.exe --progress-bar https://xaya.io/downloads/xaya_chain_xid_20190717.exe -O xaya_chain_xid_20190717.exe
@RD /S /Q "%appdata%\Xaya\blocks"
@RD /S /Q "%appdata%\Xaya\chainstate"
del "%appdata%\Xaya\peers.dat"
xaya_chain_xid_20190717.exe -o"%appdata%\" -y
del xaya_chain_xid_20190717.exe