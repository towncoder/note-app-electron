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

### 打包方式

```shell
npm run make
# 需开启全局代理，连接 github
# 安装包在 out/make 文件夹下
```

### Windows

```shell
npm install electron-builder --save-dev
npx electron-builder --win
```