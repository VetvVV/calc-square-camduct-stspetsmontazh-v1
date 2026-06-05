@echo off
chcp 65001 >nul
cd /d D:\CalcSquare\calc-square-camduct-stspetsmontazh-v1.01

set /p MSG=Введите описание публикации (Enter = стандартное описание): 

if "%MSG%"=="" (
    set MSG=Update Calc Square
)

git add .

git diff --cached --quiet
if %errorlevel%==0 (
    echo Нет изменений для публикации.
    pause
    exit /b
)

git status --short

git commit -m "%MSG% - %date% %time%"

git push

if errorlevel 1 (
    echo Ошибка публикации!
    pause
) else (
start https://vetvvv.github.io/calc-square-camduct-stspetsmontazh-v1/home.html)
