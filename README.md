# pkg-scripts

package.json scripts.

## 安装

```shell
yarn add pkg-scripts -D
```

## 用法

在 `package.json` 的 `scripts` 中添加：

```json
{
  "name": "your project name",
  "scripts": {
    "release": "pkg-scripts release"
  }
}
```

- pkg-scripts release: 发布一个版本到 npm 仓库上，会按照顺序做以下事情：
  <!-- - 0. 验证分支是否为发布分支 -->
  - 1. 更改 package.json 中的 version 字段
  - 2. 发布到 npm 仓库上
  - 4. 自动 commit，且打上 tag
  - 5. 将 commit 和 tag push 到 git 仓库上
