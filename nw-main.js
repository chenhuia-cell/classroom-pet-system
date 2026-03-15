// NW.js 主入口文件
// 用于设置菜单和窗口行为

// 等待 NW.js 初始化完成
nw.Window.open('index.html', {
    title: '班级积分管理系统宠物版',
    icon: 'pet/仓鼠/1.png',
    width: 1400,
    height: 900,
    min_width: 1200,
    min_height: 700,
    position: 'center'
}, function(win) {
    // 窗口创建后的回调
    
    // 创建菜单栏
    var menu = new nw.Menu({ type: 'menubar' });
    
    // 文件菜单
    var fileMenu = new nw.Menu();
    fileMenu.append(new nw.MenuItem({
        label: '刷新',
        key: 'F5',
        click: function() {
            win.reload();
        }
    }));
    fileMenu.append(new nw.MenuItem({
        label: '强制刷新',
        key: 'F5',
        modifiers: 'ctrl',
        click: function() {
            win.reloadIgnoringCache();
        }
    }));
    fileMenu.append(new nw.MenuItem({ type: 'separator' }));
    fileMenu.append(new nw.MenuItem({
        label: '退出',
        key: 'q',
        modifiers: 'ctrl',
        click: function() {
            nw.App.quit();
        }
    }));
    
    menu.append(new nw.MenuItem({
        label: '文件',
        submenu: fileMenu
    }));
    
    // 视图菜单
    var viewMenu = new nw.Menu();
    viewMenu.append(new nw.MenuItem({
        label: '放大',
        key: '=',
        modifiers: 'ctrl',
        click: function() {
            win.zoomLevel += 1;
        }
    }));
    viewMenu.append(new nw.MenuItem({
        label: '缩小',
        key: '-',
        modifiers: 'ctrl',
        click: function() {
            win.zoomLevel -= 1;
        }
    }));
    viewMenu.append(new nw.MenuItem({
        label: '重置缩放',
        key: '0',
        modifiers: 'ctrl',
        click: function() {
            win.zoomLevel = 0;
        }
    }));
    viewMenu.append(new nw.MenuItem({ type: 'separator' }));
    viewMenu.append(new nw.MenuItem({
        label: '全屏',
        key: 'F11',
        click: function() {
            win.toggleFullscreen();
        }
    }));
    viewMenu.append(new nw.MenuItem({
        label: '开发者工具',
        key: 'F12',
        click: function() {
            win.showDevTools();
        }
    }));
    
    menu.append(new nw.MenuItem({
        label: '视图',
        submenu: viewMenu
    }));
    
    // 帮助菜单
    var helpMenu = new nw.Menu();
    helpMenu.append(new nw.MenuItem({
        label: '关于',
        click: function() {
            alert('班级积分管理系统宠物版\n版本: 3.8\n一个用于班级积分管理的桌面应用程序。');
        }
    }));
    
    menu.append(new nw.MenuItem({
        label: '帮助',
        submenu: helpMenu
    }));
    
    // 设置菜单栏
    win.menu = menu;
    
    // 窗口事件监听
    win.on('close', function() {
        // 保存数据或执行清理操作
        this.hide();
        this.close(true);
    });
    
    win.on('minimize', function() {
        console.log('窗口最小化');
    });
    
    win.on('restore', function() {
        console.log('窗口恢复');
    });
    
    // 监听全屏变化
    win.on('enter-fullscreen', function() {
        console.log('进入全屏模式');
    });
    
    win.on('leave-fullscreen', function() {
        console.log('退出全屏模式');
    });
});

// 应用级别的事件监听
nw.App.on('open', function(args) {
    console.log('应用被打开，参数:', args);
});

nw.App.on('reopen', function() {
    console.log('应用被重新打开');
    // 显示所有窗口
    nw.Window.getAll().forEach(function(win) {
        win.show();
    });
});

// 防止多开实例
var singleInstanceLock = localStorage.getItem('app-running');
if (singleInstanceLock) {
    // 如果已经有实例在运行，退出当前实例
    console.log('已有实例在运行，退出当前实例');
    nw.App.quit();
} else {
    // 标记应用正在运行
    localStorage.setItem('app-running', 'true');
    
    // 应用退出时清除标记
    nw.App.on('close', function() {
        localStorage.removeItem('app-running');
    });
}
