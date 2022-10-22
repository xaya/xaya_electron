RequestExecutionLevel admin

!macro preInit
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Xaya"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Xaya"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Xaya"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Xaya"
	
	${nsProcess::FindProcess} "xayad.exe" $R0
	${If} $R0 == 0
		DetailPrint "Xaya daemon is running. Closing it down before going further."
	${Else}      
	${EndIf}    

	${nsProcess::Unload}		
!macroend

!macro customInstall

 MessageBox MB_OK "Chain files folder will get cleaned for 1.4.3, its recommended to predownload it next step" IDOK 
    ExecWait '"$INSTDIR\resources\installer\cleanupchain.cmd"'  

 MessageBox MB_YESNO "Would you like to predownload the blockchain data? This could save you several hours of syncing the blockchain. If you are upgrading, press NO." IDYES true IDNO false
	true:
	  ExecWait '"$INSTDIR\resources\installer\downloadchain.cmd" "$INSTDIR\resources\installer\"'  
	false:
      DetailPrint "Continue"
!macroend

/*
!include nsDialogs.nsh
!include LogicLib.nsh

XPStyle on

Var /global SOURCE
Var /global SOURCEXAYA
Var /global SOURCEXAYAORV
Var /global SOURCEXADIALOG
Var /global SOURCEXAYAPARTIAL
Var /global SOURCEXAYAFULL
Var /global BROWSESOURCE
Var /global BROWSEDEST
Var /global SOURCETEXT
Var /global SOURCETEXTFF
Var /global DESTTEXT
Var /global pathVar

Var Dialog

Function nsDialogsPage

    SetShellVarContext current
	
    nsDialogs::Create 1018
    Pop $Dialog

    ${If} $Dialog == error
        Abort
    ${EndIf}

    StrCpy $SOURCE $APPDATA
    StrCpy $SOURCEXAYA "\Xaya"
	StrCpy $SOURCEXAYAPARTIAL "$SOURCE$SOURCEXAYA"

    ${NSD_CreateLabel} 0 10 30% 12u "Datadir Path"
    ${NSD_CreateText} 0 30 70% 12u "$SOURCEXAYAPARTIAL"
    pop $SOURCETEXT
    ${NSD_CreateBrowseButton} 320 30 20% 12u "Browse"
    pop $BROWSESOURCE
    ${NSD_OnClick} $BROWSESOURCE Browsesource
    nsDialogs::Show

FunctionEnd

Function Browsesource
nsDialogs::SelectFolderDialog "Select Datadir Path Folder" $SOURCEXADIALOG
pop $SOURCEXADIALOG
${NSD_SetText} $SOURCETEXT $SOURCEXADIALOG
FunctionEnd

Function nsDialogsPageLeave

    ${NSD_GetText} $SOURCETEXT $pathVar

    ${If} $pathVar == ""
        MessageBox MB_OK "Path must be set"
        Abort
    ${EndIf}
	
	GetDlgItem $0 $HWNDPARENT 1
    EnableWindow $0 0
	
	StrCpy $SOURCEXAYAORV "\appdata.orv"
    StrCpy $SOURCEXAYAFULL "$SOURCEXAYAPARTIAL$SOURCEXAYAORV"
	
    ${If} $pathVar != $SOURCEXAYAPARTIAL
		FileOpen $9 $SOURCEXAYAFULL w
		FileWrite $9 $pathVar
		FileClose $9
	${EndIf}
	
	StrCpy $SOURCETEXTFF "$pathVar\xaya_20190715.zip"
	
	MessageBox MB_YESNO "Pre-download wallet blockchain data?" IDYES true IDNO false
	true:
	  StrCpy $2 "$SOURCETEXT\xaya_20190715.zip"
	  inetc::get /POPUP "" /CAPTION "xaya_20190715.zip" "http://xaya.io/downloads/xaya_20190716.zip" $SOURCETEXTFF /END
	  Pop $0 # return value = exit code, "OK" if OK
      	  
	  ${If} $0 == "OK"
		nsisunz::Unzip $SOURCETEXTFF $pathVar		
	  ${EndIf}
	  
	   MessageBox MB_OK "Download Status: $0"
	   
	false:
	  GetDlgItem $0 $HWNDPARENT 1
      EnableWindow $0 1	  
	  	  
	  StrCpy $R9 2
      Call RelGotoPage
FunctionEnd

Section
SectionEnd

Page License
Page Directory
Page InstFiles
Page custom nsDialogsPage nsDialogsPageLeave
Page Finish*/