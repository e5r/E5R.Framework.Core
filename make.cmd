@echo off
rem // Copyright (c) E5R Development Team. All rights reserved.
rem // Licensed under the Apache License, Version 2.0. More license information in LICENSE.txt.

where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
    echo Require NODEJS executable. Please install node.js.
    goto :error
)

where npm 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
    echo Require NPM executable. Please install npm.js.
    goto :error
)

IF NOT EXIST ".\node_modules\gulp" (
    call npm install
)

IF NOT EXIST ".\node_modules\gulp" (
    echo Require GULP executable. Please install gulp.js.
    goto :error
)

call .\node_modules\.bin\gulp.cmd %* 

goto :end

:error
endlocal
echo An error has occurred during web site deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal