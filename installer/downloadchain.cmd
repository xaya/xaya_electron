cd %1
curl.exe --progress-bar https://downloads.xaya.io/xaya_chain_xid_20190717.exe -O xaya_chain_xid_20190717.exe
xaya_chain_xid_20190717.exe -o"%appdata%\" -y
@RD /S /Q xaya_chain_xid_20190717.exe