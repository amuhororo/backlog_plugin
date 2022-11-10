# ティラノスクリプト用「バックログプラグイン」

## 概要

バックログ関係のプラグインです。

## 主な機能

- CSS でデザインしやすいようログの html をコーティングします。
- 同じキャラのセリフが続く場合、キャラ名が重複しないようにできます。
- `[r]`タグでログも改行します。
- `[l]`で改行しないようにできます。
- `[p]`などで終わる`[macro]`直後にキャラ名が取れない事がある現象に対応しています。
- glink のテキストをログに追加します。
- ログにもルビを振ります。
- （猫）milkcat さんの「カスタムルビプラグイン」をログ対応にできます。
- ログの縦書き対応。

## ファイル構成

```
backlog
├ init.ks
├ backlog.js
├ backlog.css
└ README.md （このファイル）
```

## 導入方法

1. backlog フォルダを、`「data/other/plugin/」` へ入れてください。
2. `first.ks` 等、ゲーム起動時に必ず通過するシナリオファイルに下記コードを記述しプラグインを読み込みます。
   ```tyranoscript
   [plugin name="backlog"]
   ```
3. 必要があれば、`[plugin]` タグにパラメータを指定してください。

## パラメータ

| パラメータ名 | 必須 | 説明                                                                                               |           初期値           |
| :----------- | :--: | :------------------------------------------------------------------------------------------------- | :------------------------: |
| mark         |  ×   | キャラ名とテキストの間の記号を指定します。<br>`none`はマークなし、`line`は border が付きます。     |             ：             |
| name_color   |  ×   | `[chara_new]`で指定した `color` をログに反映する場合は `true`                                      |          `false`           |
| name_none    |  ×   | ログにキャラ名を表示させない場合は `true`                                                          |          `false`           |
| name_omit    |  ×   | 同じキャラのセリフが続く場合、キャラ名を重複しないようにする場合は`true`                           |          `false`           |
| text_center  |  ×   | 名前やテキストを中央揃え（横書き時は縦/縦書き時は横）にする場合は `true`                           |          `false`           |
| glink        |  ×   | glink の選択したテキストをログに入れる場合は`true`                                                 |           `true`           |
| glink_name   |  ×   | ログのキャラ名相当部分のテキストを指定します。 不要な場合は`none`                                  |           選択肢           |
| glink_mark   |  ×   | キャラ名とテキストの間の記号を指定できます。<br>glink とセリフではマークを変えたい時に指定します。 |         `mark`の値         |
| ruby         |  ×   | ルビをログにも入れる場合は `true`                                                                  |           `true`           |
| vertical     |  ×   | ログを縦書きにする場合は `true`。 横書きは `false`。<br>※Config.tjs と逆にしたい場合に指定します。 | `Config.tjs` の `vertical` |
| r            |  ×   | `[r]`タグで改行する場合は `true`                                                                   |           `true`           |
| l            |  ×   | `[l]`タグで改行しないようにする場合は `true`                                                       |           `true`           |

**サンプルコード**

```tyranoscript
[plugin name=backlog mark="≫" glink_name="選択！"]
```

## ログの HTML タグ構成

### 通常テキスト

- タグのキャラ名部分は、`[chara_new]`で定義した`name` が入ります。
- 無い場合は表示名がそのまま入ります。
- 名前が無い場合は `no_name` が入ります。

```html
<p class="log akane">
  <b class="backlog_chara_name akane" data-mark="：">あかね</b>
  <span class="log_text">
    <span class="backlog_text akane">もしかして、ノベルゲームの開発に興味があるの？</span>
  </span>
</p>
```

### glink

#### log_name あり

```html
<p class="log glink">
  <b class="backlog_chara_name glink" data-mark="：">選択肢</b>
  <span class="log_text">
    <span class="backlog_text glink">はい。興味あります</span>
  </span>
</p>
```

#### log_name なし

```html
<p class="log glink">
  <span class="log_text">
    <span class="backlog_text glink">はい。興味あります</span>
  </span>
</p>
```

## （猫）milkcat（ねこの）さんの「カスタムルビプラグイン」と併用する場合

（猫）milkcat [https://milkcat.jp/](https://milkcat.jp/)

- **「カスタムルビプラグイン」を先に読み込んでください。**
- 通常通り `[ruby]` タグを使ってください。
- メッセージとログの文字方向は統一してください。  
  メッセージは縦書き、ログは横書きなどの場合、ログのルビは正常に表示されません。

**サンプルコード**

```tyranoscript
[plugin name="custom_ruby"]  ← 「カスタムルビプラグイン」が先
[plugin name="backlog"]

[ruby text="かんじ" x=14 scale=0.4]漢字
```

## 動作確認

ティラノスクリプト v520c

## ご注意

スクリプトのエンジン本体を大幅に改造しています。  
同じ関数を変更しているプラグインとの併用はできません。

**動作確認バージョン以外のティラノスクリプトでの動作は保障できません。**  
**ティラノスクリプト v520 以降専用です。下位バージョンとの互換性はありません。**

## 改造項目

| ファイル名        | 関数名                                          |
| :---------------- | :---------------------------------------------- |
| kag.js            | tyrano.plugin.kag.pushBackLog                   |
| kag.menu.js       | tyrano.plugin.kag.menu.displayLog               |
| kag.menu.js       | tyrano.plugin.kag.menu.setMenuScrollEvents      |
| kag.tag_system.js | tyrano.plugin.kag.tag.pushlog                   |
| kag.tag.js        | tyrano.plugin.kag.tag.r                         |
| kag.tag.js        | tyrano.plugin.kag.tag.l                         |
| kag.tag.js        | tyrano.plugin.kag.tag.p                         |
| kag.tag.js        | tyrano.plugin.kag.tag.er                        |
| kag.tag.js        | tyrano.plugin.kag.tag.cm                        |
| kag.tag.js        | tyrano.plugin.kag.tag.er                        |
| kag.tag.js        | tyrano.plugin.kag.tag.ruby                      |
| kag.tag.js        | tyrano.plugin.kag.tag.text.pushTextToBackLog \* |

\* tyrano.plugin.kag.tag.text.pushTextToBackLog のみ、まるっと書き換えています。

## 免責

このプラグインを使用したことにより生じた損害・損失に対して制作者は一切責任を負いません。

## 利用規約

- 改造・再配布は自由です。ただし、有償での再配布は禁止します。  
  改造後データの配布も同様にお願いします。
- 利用報告・クレジット表記は任意です。
- このプラグインはドネーションウェア（カンパウェア）です。  
  お役に立てましたら寄付にてご支援を頂ければ幸いです。開発・運営費用とさせて頂きます。
  詳しくはブログの「利用規約」をご確認ください。  
   [https://memocho.no-tenki.me/terms](https://memocho.no-tenki.me/terms)

## 製作者

name ： hororo  
site ： めも調 [https://memocho.no-tenki.me/](https://memocho.no-tenki.me/)  
mail ： ruru.amu@gmail.com  
twitter ： [@hororo_memocho](https://twitter.com/hororo_memocho)

## 更新履歴

Github リリースノート [https://github.com/amuhororo/backlog_plugin/releases](https://github.com/amuhororo/backlog_plugin/releases)

| 更新日     | Ver      | 詳細                                                                                                                              |
| :--------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| 2022/11/03 | ver3.60  | v520 対応。下位互換なし。 [font]タグ対応、縦中横、独自タグなど大幅に機能を削除。                                                  |
| 2022/10/30 | ver3.53  | [p]などで終わる[macro]直後にキャラ名が取れない事がある現象に対応。                                                                |
| 2022/07/24 | ver3.52  | `name_color="true"` の時に定義してないキャラ名があるとログが開かない不具合を修正。`mark="none"`　でマークを非表示にできるように。 |
| 2022/07/21 | ver3.51  | セーブタイトルが入らない場合がある不具合を修正。[r]タグ改造追加。導入方法変更。v514b/v515beta5 にて動作確認                       |
| 2022/06/27 | ver3.50  | 設計変更。機能を分離して単独で使えるように。v514/v515 にて動作確認                                                                |
| 2021/09/27 | ver3.11  | [nowait]瞬間表示が[endnowait]で止まらない不具合修正。TIP プラグイン 4.05 対応。                                                   |
| 2021/02/18 | ver3.10  | [nowait]瞬間表示対応テスト版。[font]タグ等がセーブタイトルにも反映されてしまう不具合を修正。                                      |
| 2021/02/11 | ver3.02  | [mc_ruby][endruby]タグを追加。TIP プラグイン v4.03 との併用対応。v506e にて動作確認。                                             |
| 2020/09/21 | ver3.01  | TIP プラグイン V4.00 との併用対応。                                                                                               |
| 2020/09/03 | ver3.00  | 設計変更。v504a にて動作確認。                                                                                                    |
| 2018/10/12 | ver2.05  | `name_none=false` で、[l]時にログがインデントされる不具合修正。v472d にて動作確認。                                               |
| 2018/03/24 | ver2.04  | [l]時にセーブタイトルが正しく取得出来ない不具合修正。v470_rc6b にて動作確認。                                                     |
| 2017/10/24 | ver2.03  | ティラノ v457g 対応。グリフ表示方法変更に対応。                                                                                   |
| 2017/08/20 | ver2.02  | セーブにメッセージが入らない件を修正。v456d にて動作確認。                                                                        |
| 2017/07/26 | ver2.01a | console.log 削除し忘れ修正…。                                                                                                     |
| 2017/07/19 | ver2.01  | glink のログ表示を個別対応可能に、chara_name を class 指定するよう変更。ログ HTML の不要（？）な class 指定を削除。               |
| 2017/07/03 | ver2.00a | console.log 削除し忘れ修正。init.ks 整理。                                                                                        |
| 2017/07/02 | ver2.00  | ティラノ v455 対応。                                                                                                              |
| 2016/08/10 | ver1.00  | 公開                                                                                                                              |
