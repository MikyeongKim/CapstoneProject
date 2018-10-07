@echo off
title PYTHON Compile

chcp 65001
cd C:\gitfolder\CapstoneProject\complieFolder\python

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
(
%str% | python %1.py > %1.txt

endlocal
