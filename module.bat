@echo off
rem 매개변수0 module.bat
rem 매개변수1 자바파일명
rem 매개변수2 인풋 txt파일명
:: module.bat test a.txt

set argc=0
for %%x in (%*) do Set /A argc+=1

javac %1.java

setlocal EnableDelayedExpansion

if %argc% EQU 2 (
	FOR /F "delims=" %%I in (%2) DO (
		set /a count+=1
		set param[!count!]=%%I
	)

	FOR /L %%I in (1,1,!count!) do (
		call echo %%param[%%I]%%		
	)
) 

endlocal