@echo off
set rama=%1

git checkout develop
git pull
git checkout -b %rama%
git push origin %rama%
git branch