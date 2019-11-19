# hi-pkg-scripts

发布、mock 服务

支持的系统：

- [x] Mac Os
- [x] Linux
- [ ] Windows

## 一、简介

### 发布

```shell
# 命令
hi-pkg-scripts release master
```

- hi-pkg-scripts release master: 发布一个版本到 npm 仓库上，会按照顺序做以下事情：

  - 验证分支是否为发布分支（这里指定了 master 为发布分支）
  - 更改 package.json 中的 version 字段
  - 发布到 npm 仓库上
  - 自动 commit，且打上 tag
  - 将 commit 和 tag push 到 git 仓库上
  - 根据 commit 信息自动生成（或更新）changelog.md 文件（可配置，默认不开启）

### mock 服务

```shell
# 命令
hi-pkg-scripts mock
```

在项目的 `package.json` 文件中：

```json
{
  "name": "your project name",
  "proxy": "http://localhost:4000",
  "hi-pkg-scripts": {
    "mock": {
      "port": 4000,
      "proxy": "http://api.test.com",
      "notifier": false
    }
  }
}
```

在项目中新建 `mock` 文件夹，添加 `index.js`：

```javascript
module.exports = {
  // 直接返回值
  'get /api/users': {
    code: 0,
    users: [1, 2],
    message: 'success'
  },

  // 自定义函数返回值，api 参考 express: http://www.expressjs.com.cn/
  'post /api/users/create': (req, res) => {
    res.json({ code: 0, message: 'success' });
  }
};
```

- hi-pkg-scripts mock：开启一个 mock 服务
- `package.json` 文件中各字段的含义：

  - proxy：代理，当项目是使用 [create-react-app](https://github.com/facebook/create-react-app) 创建出来的 app 时，可以定义 proxy 代理，app 中所有的请求都会代理到 `hi-pkg-scripts` 开启的 mock 服务
  - hi-pkg-scripts：`hi-pkg-scripts` 的配置
    - mock：mock 服务的配置
      - port：mock 服务监听的端口号。默认 `3006`
      - proxy：mock 服务的代理。若在 `mock/*.js` 中，未定义相应的 `mock`，则会走该代理。mock 服务代理的存在，使得 `hi-pkg-scripts` 在对接老项目时，不必 `mock` 所有的 api，实现渐进式的 `mock`。默认 `''`
      - notifier：是否在 mock 服务发生变化时，进行系统弹窗提示。默认 `true`

## 二、安装

### 本地安装（推荐）

```shell
yarn add hi-pkg-scripts -D

# or

npm install hi-pkg-scripts -D -g
```

### 全局安装（不推荐）

```shell
yarn global add hi-pkg-scripts

# or

npm add hi-pkg-scripts -g
```

## 三、用法

### 发布

- 在项目的 `package.json` 的 `scripts` 字段中添加 `release`（或其他）字段

```json
{
  "name": "your project name",
  "scripts": {
    "release": "hi-pkg-scripts release"
  }
}
```

- 在项目的 `package.json` 中添加 `release` 的配置：
  - generateChangelog：是否在项目根目录根据 `commit` 生成（更新）`changelog.md` 文件。默认 `false`

```json
{
  "name": "your project name",
  "scripts": {
    "release": "hi-pkg-scripts release"
  }
  "hi-pkg-scripts": {
    "release": {
      "generateChangelog": true
    }
  }
}
```

### mock 服务（目前只支持带 proxy 的项目）

- 在项目的 `package.json` 的 `scripts` 字段中添加 `release`（或其他）字段

```json
{
  "name": "your project name",
  "scripts": {
    "mock": "hi-pkg-scripts mock"
  }
}
```

- 在项目的 `package.json` 中添加 `mock` 的配置：
  - proxy：代理，当项目是使用 [create-react-app](https://github.com/facebook/create-react-app) 创建出来的 app 时，可以定义 proxy 代理，app 中所有的请求都会代理到 `hi-pkg-scripts` 开启的 mock 服务
  - hi-pkg-scripts：`hi-pkg-scripts` 的配置
    - mock：mock 服务的配置
      - port：mock 服务监听的端口号。默认 `3006`
      - proxy：mock 服务的代理。若在 `mock/*.js` 中，未定义相应的 `mock`，则会走该代理。mock 服务代理的存在，使得 `hi-pkg-scripts` 在对接老项目时，不必 `mock` 所有的 api，实现渐进式的 `mock`。默认 `''`
      - notifier：是否在 mock 服务发生变化时，进行系统弹窗提示。默认 `true`

```json
{
  "name": "your project name",
  "scripts": {
    "mock": "hi-pkg-scripts mock"
  },
  "proxy": "http://localhost:4000",
  "hi-pkg-scripts": {
    "mock": {
      "port": 4000,
      "proxy": "http://api.test.com",
      "notifier": false
    }
  }
}
```

- 然后运行 `npm run mock` 即可

## 更新日志

[点击查看](./changelog.md)

## 待办事项

- [x] 发布
- [x] mock 服务

## 许可

[MIT](./LICENSE)
