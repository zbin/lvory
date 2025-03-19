/**
 * 旧版IPC处理程序文件 - 重构后，通过新的模块化结构提供服务
 * 为保持向后兼容，请继续使用原有的导出接口
 */

// 导入新的模块化处理程序入口
const { setupIpcHandlers } = require('./ipc-handlers/index');

// 导出原本的setupIpcHandlers函数
module.exports = {
  setupIpcHandlers
}; 