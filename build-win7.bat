@echo off
chcp 65001
cls
echo ==========================================
echo  班级积分管理系统 - Windows 7/8 兼容版打包
echo ==========================================
echo.

:: 检查是否安装了兼容版 Electron
echo [1/4] 检查 Electron 版本...
if not exist "node_modules\electron\package.json" (
    echo 正在安装 Windows 7/8 兼容版 Electron...
    call npm install electron@22.3.27 --save-dev
) else (
    echo Electron 已安装
)

echo.
echo [2/4] 清理旧构建...
if exist "dist-win7" (
    rmdir /s /q "dist-win7"
    echo 已清理旧构建目录
)

echo.
echo [3/4] 开始打包...
echo 这可能需要几分钟，请耐心等待...
echo.

:: 使用 electron-builder 打包
call npx electron-builder --win --ia32 --x64 --config.productName="班级积分管理系统宠物版" --config.appId="com.classroom.pet.manager"

echo.
echo [4/4] 打包完成！
echo.
echo ==========================================
echo  输出目录: dist-win7
echo ==========================================
echo.
echo 生成的文件:
for %%f in (dist-win7\*.exe) do echo   - %%~nxf
echo.
pause
