Dim WinScriptHost
Set WinScriptHost = CreateObject("WScript.Shell")
WinScriptHost.Run Chr(34) & "chim_main.bat" & Chr(34), 0
Set WinScriptHost = Nothing