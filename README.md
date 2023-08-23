## 产品介绍

### 随记

使用`ALT + N`唤起和隐藏。

![](https://yitiaoit.oss-cn-beijing.aliyuncs.com/img/20230810111554.png)

### 法思特翻译

使用`ALT + T`唤起和隐藏，调用有道翻译 API 。

![](https://yitiaoit.oss-cn-beijing.aliyuncs.com/img/20230822175446.png)

## 安装包

### Mac M系列

![](https://yitiaoit.oss-cn-beijing.aliyuncs.com/img/20230811154211.png)

### Windows

#### 简单打包

```shell
npm install electron-builder --save-dev
npx electron-builder --win
```

#### 自定义打包

- 生成图标

    ```shell
    # 安装依赖
    cnpm i electron-icon-builder
    # 在 package.json 的 scripts 属下下添加执行命令
    "electron:generate-icons":"electron-icon-builder --input=./resources/icon.png --output=build --flatten"
    # 将图标放入 resources 目录，并命名为 icon.png，执行上述命令
    # 会在 build 文件夹下生成 icon
    ```

- 自定义打包配置
  ```yaml
  # 新建打包配置文件 electron-builder.yml 输入以下内容：
  nsis:
    artifactName: ${name}-${version}-setup.${ext}
    shortcutName: ${productName}
    uninstallDisplayName: ${productName}
    createDesktopShortcut: always
    installerIcon: 'build/icons/icon.ico'
    uninstallerIcon: 'build/icons/icon.ico' 
  ```
  
- 添加打包命令
  ```json
  {
    "scripts": {
      "build:win": "electron-builder --win --config"
    }
  }
  ```