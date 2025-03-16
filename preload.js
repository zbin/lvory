const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electron', {
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  
  showWindow: () => ipcRenderer.invoke('show-window'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  
  downloadProfile: (data) => ipcRenderer.invoke('download-profile', data),
  
  downloadCore: () => ipcRenderer.invoke('download-core'),
  
  onCoreDownloadProgress: (callback) => {
    ipcRenderer.on('core-download-progress', (event, progress) => callback(progress));
    return () => ipcRenderer.removeListener('core-download-progress', callback);
  },
  
  onStatusUpdate: (callback) => {
    ipcRenderer.on('status-update', (event, status) => callback(status));
    return () => ipcRenderer.removeListener('status-update', callback);
  },
  
  openConfigDir: () => ipcRenderer.invoke('openConfigDir'),
  
  singbox: {
    checkInstalled: () => ipcRenderer.invoke('singbox-check-installed'),
    getVersion: () => ipcRenderer.invoke('singbox-get-version'),
    checkConfig: (configPath) => ipcRenderer.invoke('singbox-check-config', { configPath }),
    formatConfig: (configPath) => ipcRenderer.invoke('singbox-format-config', { configPath }),
    startCore: (options) => ipcRenderer.invoke('singbox-start-core', options),
    stopCore: () => ipcRenderer.invoke('singbox-stop-core'),
    getStatus: () => ipcRenderer.invoke('singbox-get-status'),
    run: (configPath) => ipcRenderer.invoke('singbox-run', { configPath }),
    stop: () => ipcRenderer.invoke('singbox-stop'),
    downloadCore: () => ipcRenderer.invoke('singbox-download-core'),
    
    onOutput: (callback) => {
      ipcRenderer.on('singbox-output', (event, data) => callback(data));
      return () => ipcRenderer.removeListener('singbox-output', callback);
    },
    
    onExit: (callback) => {
      ipcRenderer.on('singbox-exit', (event, data) => callback(data));
      return () => ipcRenderer.removeListener('singbox-exit', callback);
    }
  },

  getSingBoxVersion: () => ipcRenderer.invoke('singbox-get-version'),

  onCoreVersionUpdate: (callback) => {
    ipcRenderer.on('core-version-update', (event, data) => callback(data));
    return () => ipcRenderer.removeListener('core-version-update', callback);
  },
  
  onDownloadComplete: (callback) => ipcRenderer.on('download-complete', (event, data) => callback(data)),
  removeDownloadComplete: (callback) => ipcRenderer.removeListener('download-complete', callback),
  
  getProfileData: () => ipcRenderer.invoke('get-profile-data'),
  
  onProfileData: (callback) => ipcRenderer.on('profile-data', (event, data) => callback(data)),
  removeProfileData: (callback) => ipcRenderer.removeListener('profile-data', callback),
  
  // 获取配置文件列表
  getProfileFiles: () => ipcRenderer.invoke('getProfileFiles'),
  
  // 导出配置文件
  exportProfile: (fileName) => ipcRenderer.invoke('exportProfile', fileName),
  
  // 重命名配置文件
  renameProfile: (data) => ipcRenderer.invoke('renameProfile', data),
  
  // 删除配置文件
  deleteProfile: (fileName) => ipcRenderer.invoke('deleteProfile', fileName),
  
  // 使用默认编辑器打开配置文件
  openFileInEditor: (fileName) => ipcRenderer.invoke('openFileInEditor', fileName),
  
  // 打开添加配置文件对话框
  openAddProfileDialog: () => ipcRenderer.send('open-add-profile-dialog'),
  
  // 监听配置文件变更事件
  onProfilesChanged: (callback) => {
    ipcRenderer.send('profiles-changed-listen');
    ipcRenderer.on('profiles-changed', () => callback());
    return () => {
      ipcRenderer.send('profiles-changed-unlisten');
      ipcRenderer.removeListener('profiles-changed', callback);
    };
  },
  
  getConfigPath: () => ipcRenderer.invoke('get-config-path'),
  setConfigPath: (filePath) => ipcRenderer.invoke('set-config-path', filePath),
  
  platform: process.platform,

  // 日志系统接口
  logs: {
    // 接收新的日志消息
    onLogMessage: (callback) => {
      ipcRenderer.on('log-message', (event, log) => callback(log));
      return () => ipcRenderer.removeListener('log-message', callback);
    },
    
    // 接收活动日志
    onActivityLog: (callback) => {
      ipcRenderer.on('activity-log', (event, log) => callback(log));
      return () => ipcRenderer.removeListener('activity-log', callback);
    },
    
    // 获取之前的日志历史
    getLogHistory: () => ipcRenderer.invoke('get-log-history'),
    
    // 清除日志历史
    clearLogs: () => ipcRenderer.invoke('clear-logs')
  }
}); 