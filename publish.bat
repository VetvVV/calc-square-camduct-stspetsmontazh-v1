@echo off
cd /d D:\CalcSquare\calc-square-camduct-stspetsmontazh-v1.01

echo Добавляю изменения...
git add .

echo Создаю commit...
git commit -m "Update Calc Square"

echo Отправляю на GitHub...
git push

echo.
echo Готово. Нажмите любую клавишу для выхода.
pause