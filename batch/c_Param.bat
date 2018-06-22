@echo off
title C Param Compile

cd C:\gitFolder\CapstoneProject\complieFolder\c

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
