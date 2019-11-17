# hi-pkg-scripts

package.json scripts.

- 发布并且根据 commit 生成 changelog

## 更新日志

[点击查看](./changelog.md)


## 安装

```shell
yarn add hi-pkg-scripts -D
```

## 用法

在 `package.json` 的 `scripts` 中添加：

```json
{
  "name": "your project name",
  "scripts": {
    "release": "hi-pkg-scripts release"
  }
}
```

- pkg-scripts release `<branch>`: 发布一个版本到 npm 仓库上，会按照顺序做以下事情：
  - 验证分支是否为发布分支
  - 更改 package.json 中的 version 字段
  - 发布到 npm 仓库上
  - 自动 commit，且打上 tag
  - 将 commit 和 tag push 到 git 仓库上
  - 根据 commit 信息自动生成（或更新）changelog.md 文件

## 待办事项
- [ ] 增加 package.json 配置
- [ ] 增加 mock 服务