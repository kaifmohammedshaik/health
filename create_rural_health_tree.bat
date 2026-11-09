@echo off
setlocal
title Rural Health Project - Create Folder Tree

REM Run this file from the folder where you want the RuralHealth project created.
set "ROOT=RuralHealth"

echo Creating %ROOT% project structure...
if not exist "%ROOT%" mkdir "%ROOT%"

REM Folders
for %%D in (
  "assets"
  "assets\images"
  "components"
  "lib"
  "lib\ai"
  "models"
  "public"
  "screens"
  "server"
) do if not exist "%ROOT%\%%~D" mkdir "%ROOT%\%%~D"

REM Assets and components
call :touch "%ROOT%\assets\images\android-icon-backdrop.png"
call :touch "%ROOT%\assets\images\android-icon-foreground.png"
call :touch "%ROOT%\assets\images\android-icon-monochrome.png"
call :touch "%ROOT%\assets\images\favicon.png"
call :touch "%ROOT%\assets\images\icon.png"
call :touch "%ROOT%\assets\images\splash-icon.png"
call :touch "%ROOT%\components\Illustrations.tsx"
call :touch "%ROOT%\components\ui.tsx"

REM AI and application libraries
for %%F in (
  engines.ts pixels.ts samples.ts vision.ts confirm.ts crypto.ts data.ts
  jwt.ts kv.ts nav.ts network.ts store.ts theme.ts triage.ts types.ts
) do call :touch "%ROOT%\lib\ai\%%F"

REM Models, public files, screens, and server
call :touch "%ROOT%\models\README.md"
call :touch "%ROOT%\public\manifest.json"
call :touch "%ROOT%\public\sw.js"

for %%F in (
  AnalyzingScreen.tsx ArticleScreen.tsx AuditScreen.tsx CallScreen.tsx
  ConsultScreen.tsx HistoryScreen.tsx HomeScreen.tsx LearnScreen.tsx
  LiveCameraScreen.tsx LockScreen.tsx ModelsScreen.tsx NewScreeningScreen.tsx
  OnboardingScreen.tsx ProfileScreen.tsx QueueScreen.tsx ReferralDetailScreen.tsx
  ResultsScreen.tsx ScheduleScreen.tsx SymptomCheckScreen.tsx
) do call :touch "%ROOT%\screens\%%F"

call :touch "%ROOT%\server\main.py"
call :touch "%ROOT%\server\requirements.txt"

REM Root files shown in the screenshots
call :touch "%ROOT%\.gitignore"
call :touch "%ROOT%\AGENTS.md"
call :touch "%ROOT%\app.json"
call :touch "%ROOT%\App.tsx"
call :touch "%ROOT%\eas.json"
call :touch "%ROOT%\index.ts"
call :touch "%ROOT%\LICENSE"
call :touch "%ROOT%\package-lock.json"
call :touch "%ROOT%\package.json"
call :touch "%ROOT%\tsconfig.json"
call :touch "%ROOT%\vercel.json"

echo.
echo Done. Open the project in VS Code with:
echo   code "%ROOT%"
echo.
echo NOTE: This creates empty starter files only; it does not implement app logic or install dependencies.
pause
exit /b

:touch
if not exist "%~1" type nul > "%~1"
exit /b
