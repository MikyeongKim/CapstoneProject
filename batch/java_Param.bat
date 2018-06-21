@echo off
title Java Compile

cd C:\Users\KimTaeKyeong\dev\CapstoneProject\complieFolder\java

setlocal EnableDelayedExpansion
set /a count=0

javac %1.java -encoding UTF-8

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
%str% | java %1 > %1.txt

endlocal
