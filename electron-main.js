const { app, BrowserWindow, Menu, ipcMain, screen } = require('electron');
const path = require('path');

// Windows 7/8 兼容性设置
app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');

// 保持窗口对象的全局引用，防止被垃圾回收
let mainWindow;
let floatBallWindow = null;

function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon: path.join(__dirname, 'pet', '仓鼠', '1.png'),
        title: '班级积分管理系统宠物版',
        show: false // 先不显示，等加载完成后再显示
    });

    // 加载应用
    mainWindow.loadFile('index.html');

    // 开发工具（可选）
    // mainWindow.webContents.openDevTools();

    // 窗口加载完成后显示
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // 窗口关闭时触发
    mainWindow.on('closed', function () {
        mainWindow = null;
        // 主窗口关闭时，关闭悬浮球
        if (floatBallWindow) {
            floatBallWindow.close();
            floatBallWindow = null;
        }
    });

    // 创建菜单
    createMenu();
    
    // 创建悬浮球窗口
    createFloatBallWindow();
}

// 创建桌面悬浮球窗口
function createFloatBallWindow() {
    if (floatBallWindow) return;
    
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    
    floatBallWindow = new BrowserWindow({
        width: 60,
        height: 60,
        x: width - 80,
        y: height - 160,
        frame: false,           // 无边框
        alwaysOnTop: true,      // 始终置顶
        skipTaskbar: true,      // 不显示在任务栏
        resizable: false,       // 不可调整大小
        movable: true,          // 可移动
        transparent: true,      // 透明背景
        hasShadow: false,       // 无阴影
        opacity: 1,             // 完全不透明
        show: false,            // 初始不显示，等加载完成后再显示
        backgroundColor: '#00000000',  // 完全透明背景 (ARGB)
        thickFrame: false,      // 禁用厚边框
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false       // 禁用调试
        }
    });
    
    // 加载悬浮球页面
    floatBallWindow.loadFile('float-ball.html');
    
    // 页面加载完成后显示窗口
    floatBallWindow.once('ready-to-show', () => {
        // 使用最高级别的置顶
        floatBallWindow.setAlwaysOnTop(true, 'screen-saver', 1);
        floatBallWindow.setVisibleOnAllWorkspaces(true);
        floatBallWindow.show();
        floatBallWindow.setFullScreenable(false);
        console.log('✅ 悬浮球窗口已显示');
    });
    
    // 悬浮球关闭时清理引用
    floatBallWindow.on('closed', () => {
        floatBallWindow = null;
    });
    
    // 阻止窗口获得焦点时闪烁
    floatBallWindow.setFocusable(false);
    
    // 打开开发者工具用于调试（可选）
    // floatBallWindow.webContents.openDevTools({ mode: 'detach' });
}

// 显示/隐藏悬浮球
function toggleFloatBall(show) {
    if (floatBallWindow) {
        if (show) {
            floatBallWindow.show();
        } else {
            floatBallWindow.hide();
        }
    }
}

// IPC 通信处理
ipcMain.on('toggle-float-ball', (event, show) => {
    toggleFloatBall(show);
});

ipcMain.on('float-ball-action', (event, action) => {
    console.log('📨 收到悬浮球操作:', action);
    
    // 检查主窗口状态
    console.log('🔍 主窗口状态:', {
        exists: !!mainWindow,
        destroyed: mainWindow ? mainWindow.isDestroyed() : 'N/A',
        visible: mainWindow ? mainWindow.isVisible() : 'N/A',
        minimized: mainWindow ? mainWindow.isMinimized() : 'N/A'
    });
    
    // 处理特定操作
    if (action === 'minimize-main-window') {
        if (mainWindow && !mainWindow.isDestroyed()) {
            console.log('📺 最小化主窗口');
            mainWindow.minimize();
        }
        return;
    }
    
    if (action === 'toggle-main-window') {
        if (mainWindow && !mainWindow.isDestroyed()) {
            if (mainWindow.isVisible() && !mainWindow.isMinimized()) {
                console.log('📺 隐藏主窗口');
                mainWindow.minimize();
            } else {
                console.log('📺 显示主窗口');
                if (!mainWindow.isVisible()) mainWindow.show();
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.focus();
            }
        }
        return;
    }
    
    // 将悬浮球的操作转发给主窗口
    if (mainWindow && !mainWindow.isDestroyed()) {
        // 确保窗口显示
        if (!mainWindow.isVisible()) {
            console.log('📺 显示主窗口');
            mainWindow.show();
        }
        
        // 如果主窗口最小化，恢复它
        if (mainWindow.isMinimized()) {
            console.log('📺 恢复最小化的主窗口');
            mainWindow.restore();
        }
        
        // 取消最大化状态（如果已最大化）
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        }
        
        // 将窗口移到最前并聚焦
        mainWindow.setAlwaysOnTop(true);
        mainWindow.focus();
        mainWindow.show();
        
        setTimeout(() => {
            mainWindow.setAlwaysOnTop(false);
        }, 200);
        
        // 发送操作到渲染进程（如果不是仅显示窗口的操作）
        if (action !== 'show-main-window') {
            mainWindow.webContents.send('float-ball-action', action);
        }
        
        console.log('✅ 主窗口操作完成');
    } else {
        console.log('❌ 主窗口不存在或已销毁');
        // 尝试重新创建主窗口
        if (!mainWindow || mainWindow.isDestroyed()) {
            console.log('🔄 尝试重新创建主窗口...');
            createMainWindow();
        }
    }
});

// 悬浮球拖动相关变量
let isDraggingFloatBall = false;
let dragOffset = { x: 0, y: 0 };

ipcMain.on('float-ball-drag-start', (event, { x, y }) => {
    isDraggingFloatBall = true;
    if (floatBallWindow) {
        const [winX, winY] = floatBallWindow.getPosition();
        dragOffset.x = x - winX;
        dragOffset.y = y - winY;
    }
});

ipcMain.on('float-ball-drag-move', (event, { x, y }) => {
    if (isDraggingFloatBall && floatBallWindow) {
        floatBallWindow.setPosition(x - dragOffset.x, y - dragOffset.y);
    }
});

ipcMain.on('float-ball-drag-end', () => {
    isDraggingFloatBall = false;
});

function createMenu() {
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '刷新',
                    accelerator: 'F5',
                    click: () => {
                        mainWindow.reload();
                    }
                },
                {
                    label: '强制刷新',
                    accelerator: 'Ctrl+F5',
                    click: () => {
                        mainWindow.webContents.reloadIgnoringCache();
                    }
                },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: '视图',
            submenu: [
                {
                    label: '放大',
                    accelerator: 'Ctrl+=',
                    click: () => {
                        const currentZoom = mainWindow.webContents.getZoomLevel();
                        mainWindow.webContents.setZoomLevel(currentZoom + 1);
                    }
                },
                {
                    label: '缩小',
                    accelerator: 'Ctrl+-',
                    click: () => {
                        const currentZoom = mainWindow.webContents.getZoomLevel();
                        mainWindow.webContents.setZoomLevel(currentZoom - 1);
                    }
                },
                {
                    label: '重置缩放',
                    accelerator: 'Ctrl+0',
                    click: () => {
                        mainWindow.webContents.setZoomLevel(0);
                    }
                },
                { type: 'separator' },
                {
                    label: '全屏',
                    accelerator: 'F11',
                    click: () => {
                        mainWindow.setFullScreen(!mainWindow.isFullScreen());
                    }
                }
            ]
        },
        {
            label: '悬浮球',
            submenu: [
                {
                    label: '显示悬浮球',
                    click: () => {
                        toggleFloatBall(true);
                        if (mainWindow) {
                            mainWindow.webContents.send('float-ball-setting-changed', { enabled: true });
                        }
                    }
                },
                {
                    label: '隐藏悬浮球',
                    click: () => {
                        toggleFloatBall(false);
                        if (mainWindow) {
                            mainWindow.webContents.send('float-ball-setting-changed', { enabled: false });
                        }
                    }
                }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: '关于',
                            message: '班级积分管理系统宠物版',
                            detail: '版本: 3.8\n一个用于班级积分管理的桌面应用程序。'
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Electron 初始化完成
app.whenReady().then(createWindow);

// 所有窗口关闭时退出应用
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// 防止多开实例
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        }
    });
}
