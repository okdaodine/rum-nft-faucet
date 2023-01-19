这里有一个 live 版本可以让您体验一下：https://rum-chat.prsdev.club

如果您想要在本地运行，可以参考如下步骤：

## 获取代码

```
git clone https://github.com/okdaodine/rum-chat.git
```

## 配置 Rum Group

1. 打开 [Quorum open node](https://node.rumsystem.net/)
2. 使用 Github 登录
3. 创建一个 group
4. 打开 group
5. 复制 seed
6. 将 seed 填写到 `server/config.js` 里面的 `seedUrl`。

这样就完成了 Rum Group 的配置啦。

好，接下来让我们开始使用这个 Rum Group 吧。

## 启动前端服务
（这个例子使用 js 开发，所以请先安装 nodejs 哦）

在根目录下，运行：

```
yarn install
yarn dev
```

## 启动后端服务

另外起一个终端界面，执行：

```
cd server
yarn install
yarn dev
```

## 访问服务

http://localhost:3000
