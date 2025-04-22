# JAL SOALA

## 起動方法

<!-- ```
$ yarn install
```

```
$ yarn dev
``` -->
dockerイメージビルド
```
$ yarn docker-build
```

起動
```
$ yarn docker-up
```

## 実機での確認方法
※ESETの関係で、ファイアーウォールを無効にする必要がある。

1. 有線LANに接続する。

2. ローカルのスタブAPI接続先を修正
/front_src/config/config.ts

```
/**
 * API通信の接続先
 */
 export namespace ServerConfig {
    // export const API_SERVER = "http://localhost:3000"; <- コメントアウト
    export const API_SERVER = "http://10.1.101.53:3000";  <- 追加
};
```

3. サーバーを起動

```
$ yarn dev --host 0.0.0.0

```

または

```
$ yarn pro --host 0.0.0.0
```

4. 端末でアプリの設定の「Login URL」に下記を設定

```
http://{PCのIPアドレス}:3333
```

5. アプリ起動

## 静的コード解析

TSLint を使用しています。

```
$ yarn lint
```

## コードフォーマット

Prettier と TSLint を使用しています。

```
$ yarn fmt
```

VScodeで下記のプラグインを利用してください。
- Prettier - Code formatter
