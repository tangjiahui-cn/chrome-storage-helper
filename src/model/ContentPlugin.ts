/**
 * 管理content注册的插件
 *
 * At 2023/12/29
 * By TangJiaHui
 */

export interface Plugin <T = any, RETURN = any> {
  id: string;
  handle: (data: T) => Promise<RETURN>;
}

export class ContentPlugin {
  plugins: Plugin[] = [];

  // 使用一个插件
  use (plugin: Plugin) {
    if (this.plugins.find(x => x.id === plugin.id)) {
      throw new Error(`plugin ${plugin.id} is already exist.`)
    }
    this.plugins.push(plugin)
  }

  // 删除一个插件
  delete (pluginId: string) {
    this.plugins = this.plugins.filter(plugin => plugin.id !== pluginId)
  }

  // 处理一个数据
  async process (data: SendDataPayload) {
    const targetPlugin = this.plugins.find(plugin => data.type === plugin.id)
    return targetPlugin?.handle?.(data.data)
  }
}
