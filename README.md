# WebRTC Playground

</br>
<div align="center">
    <a href="https://github.com/whtsht/webrtc-playground/blob/main/README.md">English</a>
    &nbsp;&nbsp;| &nbsp;&nbsp;
    日本語
</div>
</br>

WebRTC を利用したチャット，ビデオ通話，ゲームの試験アプリ．

## 機能

- リアルタイムのチャット
- ビデオ通話
- Pong ゲーム
- 最大 4 人まで接続可能

## デモ

[![WebRTC Playground Demo Video](https://img.youtube.com/vi/ON8khxFI73k/0.jpg)](https://www.youtube.com/watch?v=ON8khxFI73k)

https://www.youtube.com/watch?v=ON8khxFI73k

## 実行方法

リポジトリをクローンしてください．

```
$ git clone https://github.com/whtsht/webrtc-playground
$ cd webrtc-playground
```

### ウェブサーバーを起動

```
$ cd web
yarn を使う場合
$ yarn
$ yarn run dev
npm を使う場合
$ npm install
$ npm run dev
```

### シグナリングサーバーの起動

```
$ cd ap
yarn を使う場合
$ yarn
$ yarn run dev
npm を使う場合
$ npm install
$ npm run dev
```

http://localhost:5173 でアプリが起動します．

## ライセンス

MIT ライセンスで公開しています．自由にコードを修正して遊んでみてください．
