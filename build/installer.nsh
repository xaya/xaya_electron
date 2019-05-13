!macro preInit
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Xaya"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Xaya"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Xaya"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Xaya"
!macroend

/*
COMMENT FOR NOW, KEEP FOR LATER USE
WHEN WILL BE ADDING EXTERNAL SYNCH 
DATA

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
Var /global DESTTEXT
Var /global pathVar

Var Dialog
Page custom nsDialogsPage nsDialogsPageLeave

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
	
	StrCpy $SOURCEXAYAORV "\appdata.orv"
    StrCpy $SOURCEXAYAFULL "$SOURCEXAYAPARTIAL$SOURCEXAYAORV"
	
    ${If} $pathVar != $SOURCEXAYAPARTIAL
		FileOpen $9 $SOURCEXAYAFULL w
		FileWrite $9 $pathVar
		FileClose $9
	${EndIf}

FunctionEnd

Section
SectionEnd*/