@echo off
title Java Compile

cd C:\gitfolder\CapstoneProject\complieFolder\java
setlocal EnableDelayedExpansion
set /a count=0

javac test.java -encoding UTF-8

FOR /F "delims=" %%I in (%1) DO (

	set /a count+=1

	IF !count! EQU 1 (
		set "str=echo %%I"
	) ELSE (
		set "str=!str! & echo %%I"
	)

)
set "str=!str!)"
(
%str% | java test > test.txt
endlocal