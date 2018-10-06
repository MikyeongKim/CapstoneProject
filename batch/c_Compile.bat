@echo off
title C Compile

cd C:\gitfolder\CapstoneProject\complieFolder\c
gcc -o %1 %1.c
%1 > %1.txt
