Dim WinScriptHost
Set WinScriptHost = CreateObject("WScript.Shell")
WinScriptHost.Run Chr(34) & "chim86.bat" & Chr(34), 0
Set WinScriptHost = Nothing