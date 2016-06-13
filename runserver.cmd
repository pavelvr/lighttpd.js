@echo off

if not "%1"=="" (
	%~d1
	cd "%~1"
)

"%~dp0\node.exe" "%~dp0\lighttpd.js"
