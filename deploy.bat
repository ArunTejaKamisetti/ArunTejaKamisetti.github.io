@echo off
REM ============================================================
REM  One-click publish for Arun's portfolio
REM  Drops any new/changed files (decks, resume, content) into
REM  git, commits, and pushes. GitHub Pages auto-updates the site.
REM ============================================================
cd /d "%~dp0"
echo.
echo === Publishing portfolio to GitHub ===
echo.
git add -A
set /p msg="Commit message (or press Enter for 'update'): "
if "%msg%"=="" set msg=update
git commit -m "%msg%"
git push
echo.
echo === Done! Your live site updates in about a minute. ===
pause
