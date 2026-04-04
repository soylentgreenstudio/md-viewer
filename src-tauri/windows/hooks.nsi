; FileAssociation macros (inlined from FileAssociation.nsh)
; Registers .md file extension to open with MdViewer

!macro customInstall
  ; Register .md file association
  WriteRegStr HKCU "Software\Classes\.md" "" "MdViewer.md"
  WriteRegStr HKCU "Software\Classes\MdViewer.md" "" "Markdown Document"
  WriteRegStr HKCU "Software\Classes\MdViewer.md\DefaultIcon" "" "$INSTDIR\MdViewer.exe,0"
  WriteRegStr HKCU "Software\Classes\MdViewer.md\shell\open\command" "" '"$INSTDIR\MdViewer.exe" "%1"'

  ; Register .markdown file association
  WriteRegStr HKCU "Software\Classes\.markdown" "" "MdViewer.markdown"
  WriteRegStr HKCU "Software\Classes\MdViewer.markdown" "" "Markdown Document"
  WriteRegStr HKCU "Software\Classes\MdViewer.markdown\DefaultIcon" "" "$INSTDIR\MdViewer.exe,0"
  WriteRegStr HKCU "Software\Classes\MdViewer.markdown\shell\open\command" "" '"$INSTDIR\MdViewer.exe" "%1"'

  ; Notify Windows of the change
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0x0000, p 0, p 0)'
!macroend

!macro customUnInstall
  ; Remove .md file association
  DeleteRegKey HKCU "Software\Classes\.md"
  DeleteRegKey HKCU "Software\Classes\MdViewer.md"

  ; Remove .markdown file association
  DeleteRegKey HKCU "Software\Classes\.markdown"
  DeleteRegKey HKCU "Software\Classes\MdViewer.markdown"

  ; Notify Windows of the change
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0x0000, p 0, p 0)'
!macroend
