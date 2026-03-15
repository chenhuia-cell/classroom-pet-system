const { app, BrowserWindow, Menu, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// 创建日志文件用于调试
const logFile = path.join(__dirname, 'app-debug.log');
function log(message) {
    try {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(logFile, logMessage);
        console.log(logMessage);
    } catch (e) {
        console.log('日志写入失败:', e.message);
    }
}

log('==========================================');
log('应用启动 - 学校兼容版');
log(`Electron版本: ${process.versions.electron}`);
log(`Node版本: ${process.versions.node}`);
log(`平台: ${process.platform}`);
log(`架构: ${process.arch}`);

// 学校电脑兼容性设置
app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor,HardwareMediaKeyHandling');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('no-sandbox');  // 禁用沙盒（解决某些学校系统限制）
app.commandLine.appendSwitch('disable-setuid-sandbox');
app.commandLine.appendSwitch('disable-dev-shm-usage');  // 解决/dev/shm限制
app.commandLine.appendSwitch('disable-accelerated-2d-canvas');
app.commandLine.appendSwitch('disable-accelerated-jpeg-decoding');
app.commandLine.appendSwitch('disable-accelerated-mjpeg-decode');
app.commandLine.appendSwitch('disable-accelerated-video-decode');

// 禁用GPU加速
app.disableHardwareAcceleration();

log('已应用学校兼容性设置');

// 全局错误处理 - 防止权限错误导致程序崩溃
process.on('uncaughtException', (error) => {
    log(`未捕获的异常: ${error.message}`);
    log(`错误堆栈: ${error.stack}`);
    // 不退出程序，继续运行
});

process.on('unhandledRejection', (reason, promise) => {
    log(`未处理的Promise拒绝: ${reason}`);
    // 不退出程序，继续运行
});

// 保持窗口对象的全局引用
let mainWindow;
let floatBallWindow = null;

function createWindow() {
    log('开始创建主窗口');
    
    try {
        // 创建浏览器窗口 - 学校兼容配置
        mainWindow = new BrowserWindow({
            width: 1400,
            height: 900,
            minWidth: 1200,
            minHeight: 700,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
                webSecurity: false,
                allowRunningInsecureContent: true,
                experimentalFeatures: false,
                offscreen: false
            },
            show: false,  // 先不显示
            backgroundColor: '#f5f5f5',  // 设置背景色避免白屏
            title: '班级积分管理系统宠物版'
        });
        
        log('主窗口创建成功');

        // 加载应用
        const indexPath = path.join(__dirname, 'index.html');
        log(`加载文件: ${indexPath}`);
        
        // 检查文件是否存在
        if (!fs.existsSync(indexPath)) {
            log(`错误: index.html 不存在于 ${indexPath}`);
            return;
        }
        
        mainWindow.loadFile(indexPath);

        // 窗口加载完成后显示
        mainWindow.once('ready-to-show', () => {
            log('窗口准备就绪，开始显示');
            mainWindow.show();
            mainWindow.focus();
            log('窗口已显示并聚焦');
        });
        
        // 监听加载失败
        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            log(`页面加载失败: ${errorCode} - ${errorDescription}`);
        });
        
        // 监听加载完成
        mainWindow.webContents.on('did-finish-load', () => {
            log('页面加载完成');
        });
        
        // 监听崩溃
        mainWindow.webContents.on('crashed', () => {
            log('渲染进程崩溃');
        });
        
        // 监听无响应
        mainWindow.on('unresponsive', () => {
            log('窗口无响应');
        });

        // 窗口关闭时触发
        mainWindow.on('closed', function () {
            log('主窗口关闭');
            mainWindow = null;
            if (floatBallWindow) {
                floatBallWindow.close();
                floatBallWindow = null;
            }
        });

        // 创建菜单
        createMenu();
        
        // 学校环境下禁用悬浮球（可能被拦截）
        // createFloatBallWindow();
        log('学校模式：已禁用悬浮球功能');
        
    } catch (error) {
        log(`创建窗口错误: ${error.message}`);
        log(`错误堆栈: ${error.stack}`);
    }
}

// 简化的菜单
function createMenu() {
    try {
        const template = [
            {
                label: '文件',
                submenu: [
                    {
                        label: '刷新',
                        accelerator: 'F5',
                        click: () => {
                            if (mainWindow) {
                                mainWindow.webContents.reload();
                            }
                        }
                    },
                    {
                        label: '开发者工具',
                        accelerator: 'F12',
                        click: () => {
                            if (mainWindow) {
                                mainWindow.webContents.openDevTools();
                            }
                        }
                    },
                    { type: 'separator' },
                    {
                        label: '退出',
                        accelerator: 'Ctrl+Q',
                        click: () => {
                            app.quit();
                        }
                    }
                ]
            }
        ];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
        log('菜单创建成功');
    } catch (error) {
        log(`创建菜单错误: ${error.message}`);
    }
}

// Electron 初始化完成
log('等待Electron就绪...');
app.whenReady().then(() => {
    log('Electron已就绪');
    createWindow();
}).catch(err => {
    log(`Electron就绪失败: ${err.message}`);
    log(`错误堆栈: ${err.stack}`);
});

// 所有窗口关闭时退出应用
app.on('window-all-closed', function () {
    log('所有窗口关闭');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    log('应用激活');
    if (mainWindow === null) {
        createWindow();
    }
});

// 应用退出
app.on('quit', () => {
    log('应用退出');
});

// 防止多开实例
log('请求单实例锁...');
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    log('已有实例运行，退出');
    app.quit();
} else {
    log('获得单实例锁');
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        log('检测到第二个实例启动');
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
            mainWindow.show();
        }
    });
}
