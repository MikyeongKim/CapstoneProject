@echo off
title C Compile
chcp 65001
cd C:\gitfolder\CapstoneProject\complieFolder\c
gcc -o %1 %1.c
%1 > %1.txt
