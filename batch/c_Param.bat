@echo off
rem 매개변수0 module.bat
rem 매개변수1 컴파일 대상 파일명
rem 매개변수2 인풋 txt파일명
rem 실행방법 module.bat test a.txt
title C Param Compile

cd C:\gitFolder\CapstoneProject\batch

setlocal EnableDelayedExpansion
set /a count=0

FOR /F "delims=" %%I in (%2) DO (

	set /a count+=1
	
	IF !count! EQU 1 (
		set "str=echo %%I"
	) ELSE (
		set "str=!str! & echo %%I"
	)
	
)
set "str=!str!)"
gcc -o %1 %1.c

(
%str% | %1.exe> %1.txt

endlocal 