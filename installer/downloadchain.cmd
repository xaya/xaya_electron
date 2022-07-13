cd %1
echo "#############################"
echo "#############################"
echo "#############################"
echo " "
echo "Please wait while we download the blockchain and extract it."
echo " "
echo "This will take a few minutes depending upon your internet connection speed."
echo " "
echo "DO NOT CLOSE THIS WINDOW. IT WILL CLOSE AUTOMATICALLY WHEN DONE."
echo " "
echo "#############################"
echo "#############################"
echo "#############################"
curl.exe --progress-bar https://downloads.xaya.io/xaya_chain_xid_20190717.exe -O xaya_chain_xid_20190717.exe
xaya_chain_xid_20190717.exe -o"%appdata%\" -y
@RD /S /Q xaya_chain_xid_20190717.exe