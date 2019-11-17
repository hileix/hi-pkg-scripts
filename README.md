# hi-pkg-scripts

package.json scripts.

- [x] 发布包到 npm（或其他）仓库
- pkg-scripts release `<branch>`: 发布一个版本到 npm 仓库上，会按照顺序做以下事情
  - 验证分支是否为发布分支
  - 更改 package.json 中的 version 字段
  - 发布到 npm 仓库上
  - 自动 commit，且打上 tag
  - 将 commit 和 tag push 到 git 仓库上
  - 根据 commit 信息自动生成（或更新）changelog.md 文件（可配置，默认不开启）

- [ ] mock 服务


## 更新日志

[点击查看](./changelog.md)


## 安装

```shell
yarn add hi-pkg-scripts -D
```

## 用法


### 命令行
在 `package.json` 的 `scripts` 中添加：

```json
{
  "name": "your project name",
  "scripts": {
    "release": "hi-pkg-scripts release"
  }
}
```

### 配置
在 `package.json` 的 `hi-pkg-scripts` 中添加：

```json
{
  "name": "your project name",
  "hi-pkg-scripts": {
    "release": { // release 命令下的配置
      "generateChangelog": true // 是否生成（更新） changelog，默认为 false
    }
  }
}
```



## 待办事项
- [ ] 增加 mock 服务