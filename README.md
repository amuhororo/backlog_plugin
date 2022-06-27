# ティラノスクリプト用「バックログプラグイン」

## 概要

バックログ関係のプラグインです。  

機能別に5つのプラグインに分かれています。  
それぞれ単独でも動作しますので、必要な機能のみを使う事ができます。

| プラグイン名 | 説明 | 改造 |
| --- | --- | --- |
| backlog | バックログを整形します。 | 有 |
| mc_ruby | バックログにもルビを振ります。 |  |
| mc_font | 指定したスタイルをバックログにも反映します。 | 有 |
| mc_glink | 選択したのテキストをバックログにも入れます。 |  |
| mc_tcy | 縦書き時に縦中横を使う事ができます。ログにも入ります。 |  |


### 主な機能

<details open>
<summary>折り畳み</summary>

#### backlog

- ログをCSSで自由に整形できます。
- 同じキャラのセリフが続く場合、キャラ名が重複しないようにできます。
- ログのhtmlタグに、`[chara_new]` で定義した `name` が `class`名として入ります。
- `[chara_new]` で指定した `color` をログに反映するか選択可能です。
- `[rb]` タグを追加。`[r]`の代わりに使うとログも改行します。
- `[l]`で改行しないようにするか選択可能です。
- ログの縦書き対応。

#### mc_ruby

- バックログにもルビを振ります。
- `[mc_ruby]` ~ `[endruby]` で囲う事で、複数テキストにまとめてルビを振る事が出来ます。
- （猫）milkcatさんの「カスタムルビプラグイン」をログ対応にできます。

#### mc_font

- スタイルをログに反映できます。
- `[mc_font]`タグに `name` を指定できます。
- `[mc_resetfont]` でリセットするスタイルを指定できます。

#### mc_glink

- `[mc_glink]` タグを使うと、選択したglinkのテキストをログに追加します。
- キャラクター名にあたる部分のテキストを指定できます。
- キャラクター名とテキストの間のマークを指定できます。

#### mc_tcy

- `[mc_tcy]` タグでメッセージに縦中横を表示できます。ログにも入ります。
- HTMLで`<tcy>`タグが使えます。

</details>


## 使い方

### 導入方法

#### 一括で導入する

1. 使用するプラグインのフォルダを全て、`「data/other/plugin/」` へ入れてください。  
 ※`backlog` は必須です。
2. `first.ks` 等ゲーム起動時に必ず通過するシナリオファイルに `[plugin name=backlog storage=setup.ks]` を記述しプラグインを読み込みます。
3. 必要な機能があれば、`[plugin]` タグにパラメータを指定してください。

#### 個別に導入する

1. 使用するプラグインのフォルダを、`「data/other/plugin/」` へ入れてください。  
2. `first.ks` 等ゲーム起動時に必ず通過するシナリオファイルに `[plugin name=（プラグイン名）]` を記述しプラグインを読み込みます。
3. 必要な機能があれば、`[plugin]` タグにパラメータを指定してください。

#### [plugin] タグ用パラメータ

<details open>
<summary>折り畳み</summary>

##### backlog

| パラメータ名 | 必須 | 説明 | 初期値 |
| --- | :---: | --- | --- |
| mark | × | キャラ名とテキストの間の記号を指定できます。文字コードを指定すれば絵文字なども入れられます。 | ： |
| name_color | × | ログのキャラ名に`[chara_new]`で指定した `color` を反映するか。する場合は `true` | `false` |
| name_none | × | ログにキャラ名を表示させない場合は `true` | `false` |
| name_repeat | × | 同じキャラのセリフが続く場合、キャラ名を重複しないようにするか。する場合は `false` | `true` |
| text_center | × | 名前やテキストを中央揃えにするか。する場合は `true` <br> ※`name_repeat` が `true` の時は無効になります。 | `false` |
| vertical | × | ログを縦書きにするか。縦書きは `true`。 横書きは `false`。<br>※Config.tjsと逆にしたい場合に指定します。 | `Config.tjs` の `vertical` |
| l_join | × | `[l]`で改行しないようにするか。する場合は `true` | - |

##### mc_font

| パラメータ名 | 必須 | 説明 | 初期値 |
| --- | :---: | --- | --- |
| save_style | × | セーブのメッセージにもスタイルを反映するか。する場合は `true` | `false` |

##### mc_glink

| パラメータ名 | 必須 | 説明 | 初期値 |
| --- | :---: | --- | --- |
| log_name | × | ログのキャラ名相当部分のテキストを指定します。 |  |
| glink_mark | × | キャラ名相当部分とテキストの間の記号を指定できます。<br>※`log_name` を指定した場合のみ有効。 | `backlog` の `mark` or ： |

**サンプルコード**
``` tyranoscript
一括（別機能のパラメータも backlog に書いてOK）
[plugin name=backlog storage=setup.ks mark="≫" l_join="true" log_name="選択！"]

個別
[plugin name="backlog" mark="≫" l_join="true"]
[plugin name="mc_glink" log_name="選択！" glink_mark="≫"]
[plugin name="mc_ruby"]
[plugin name="mc_font"]
[plugin name="mc_tcy"]
```

</details>


### 追加タグ

<details open>
<summary>折り畳み</summary>

#### [br]

backlog で追加します。  
ログにも改行を入れたい時に`[r]` タグの代わりに使います。  

指定できるパラメータはありません。

**サンプルコード**
``` tyranoscript
改行します。[br]ログも改行します。
```

#### [mc_ruby]

mc_ruby で追加します。  
複数テキストにルビを振ります。  

| パラメータ名 | 必須 | 説明 | 初期値 |
| --- | :---: | --- | --- |
| text | ○ | ルビとして表示させる文字を指定します。 |  |

**サンプルコード**
``` tyranoscript
[mc_ruby text="かんじ"]漢字[endruby]
```

#### [endruby]

mc_ruby で追加します。  
ルビの指定範囲を終了します。  

指定できるパラメータはありません。

**サンプルコード**
``` tyranoscript
[mc_ruby text="かんじ"]漢字[endruby]
```

#### [mc_font]

mc_font で追加します。  
指定したスタイルをログにも反映します。

| パラメータ名 | 必須 | 説明 | 初期値 |
| --- | :---: | --- | --- |
| name | × | テキストにHTMLのクラス属性を追加します。 |  |

他、公式の `[font]` タグと同じパラメータを指定できます。

**サンプルコード**
``` tyranoscript
[mc_font color="0xFF0000" size="40" bold=true]
文字を太く大きく赤色にします。
[mc_resetfont bold=""]
太字だけ解除しました。
[mc_resetfont]
全解除でデフォルトになりました。
```

#### [mc_resetfont]

mc_font で追加します。  
指定したスタイルをリセットします。  
※`[resetfont]` でもメッセージのスタイルはリセットされますが、ログはリセットされないのでご注意ください。

| パラメータ名 | 必須 | 説明 | 初期値 |
| --- | :---: | --- | --- |
| name | × | テキストにHTMLのクラス属性を削除します。 |  |

他、公式の `[font]` タグと同じパラメータを指定できます。

**サンプルコード**
``` tyranoscript
[mc_font color="0xFF0000" size="40" bold=true]
文字を太く大きく赤色にします。
[mc_resetfont bold=""]
太字だけ解除しました。
[mc_resetfont]
全解除でデフォルトになりました。
```

#### [mc_glink]

mc_glink で追加します。  
選択をログにも追加します。  
plugin で指定した値と変えたい時はパラメータを指定してください。

| パラメータ名 | 必須 | 説明 | 初期値 |
| --- | :---: | --- | --- |
| log_name | × | ログのキャラ名相当部分のテキストを指定します。 | `plugin` の `log_name` |
| mark | × | キャラ名相当部分とテキストの間の記号を指定できます。<br>※`log_name` を指定した場合のみ有効。 | `plugin` の `glink_mark` |

他、公式の `[glink]` タグと同じパラメータを指定できます。

**サンプルコード**
``` tyranoscript
[mc_glink text="選択肢１" log_name="選択" mark="≫"] ※他パラメータは省略
```

#### [mc_tcy]

mc_tcy で追加します。  
メッセージテキストに縦中横を入れます。  
フォントの種類によって対応文字数が変わります。

| パラメータ名 | 必須 | 説明 | 初期値 |
| --- | :---: | --- | --- |
| text | ○ | 縦中横で表示させる文字を指定します。 |  |

**サンプルコード**
``` tyranoscript
わあああああああ[mc_tcy text="!!"]みたいな。
```

</details>


### ログのHTMLタグ構成

<details open>
<summary>折り畳み</summary>

#### 通常テキスト

`<div>` タグのキャラ名部分は、`[chara_new]`で定義した`name` が無い場合は表示名がそのまま入ります。  
名前が無い場合は、 `no_name` が入ります。  

``` html
<div class="log akane">
	<b data-mark="：" class="backlog_chara_name あかね">あかね</b>
	<p class="log_text">
		<span class="backlog_text あかね">もしかして、ノベルゲームの開発に興味があるの？</span>
	</p>
</div>
```

#### mc_glin
``` html
<b class="backlog_chara_name glink" data-mark="≫">選択！</b><span class="backlog_text glink">選択肢１</span>
```
※backlog を使う場合
``` html
<div class="log glink">
	<b class="backlog_chara_name glink" data-mark="≫">選択！</b>
	<p class="log_text">
		<span class="backlog_text glink">選択肢１</span>
	</p>
</div>
```

</details>


### mc_ruby：（猫）milkcat（ねこの）さんの「カスタムルビプラグイン」との併用

- 併用する場合は**「カスタムルビプラグイン」が優先**になります。  
- `[mc_ruby]`タグを使う事でログにも入ります。  
- 「カスタムルビプラグイン」で追加されているパラメータも使えます。  
- `[endruby]` は使いません。あっても無視されます。  

**サンプルコード**
``` tyranoscript
[mc_ruby text="かんじ" x=14 scale=0.4]漢字
```


### mc_tcy：ptextなどで使う場合
`<tcy>` タグで囲ってください。

**サンプルコード**
``` tyranoscript
[ptext text="サンプルテキスト<tcy>!?</tcy>ですか<tcy>??</tcy>" vertical="true"]
※他パラメータは省略
```


## 注意点

スクリプトのエンジン本体を改造しています。  
同じ関数を変更しているプラグインとの併用はできません。  
動作確認ver以外のティラノスクリプトでは動作しない可能性があります。  

### 改造項目

| プラグイン名 | ファイル名 | 関数名 |
| ---- | --- | --- |
| backlog | kag.menu.js | tyrano.plugin.kag.menu.displayLog |
| mc_font | kag.js | tyrano.plugin.kag.pushBackLog |



## 動作確認

ティラノスクリプト v514 / v515beta3


## 免責

このプラグインを使用したことにより生じた損害・損失に対して制作者は一切責任を負いません。

## 利用規約

 - 改造・再配布は自由です。ただし、有償での再配布は禁止します。  
 改造後データの配布も同様にお願いします。
 - 利用報告・クレジット表記は任意です。
 - このプラグインはドネーションウェア（カンパウェア）です。  
 お役に立てましたら寄付にてご支援を頂ければ幸いです。開発・運営費用とさせて頂きます。  


## 製作者

name ： hororo  
site ： めも調 [https://memocho.no-tenki.me/](https://memocho.no-tenki.me/)  
mail ： ruru.amu@gmail.com  
twitter ： @hororo_memocho  


## 更新履歴
| 更新日 | Ver | 詳細 |
| ---- | --- | --- |
| 2022/06/27 | ver3.50 | 設計変更。機能を分離して単独で使えるように。v514/v515にて動作確認 |
| 2021/09/27 | ver3.11 | [nowait]瞬間表示が[endnowait]で止まらない不具合修正。TIPプラグイン4.05対応。 |
| 2021/02/18 | ver3.10 | [nowait]瞬間表示対応テスト版。[font]タグ等がセーブタイトルにも反映されてしまう不具合を修正。 |
| 2021/02/11 | ver3.02 | [mc_ruby][endruby]タグを追加。TIPプラグインv4.03との併用対応。v506eにて動作確認。 |
| 2020/09/21 | ver3.01 | TIPプラグインV4.00との併用対応。 |
| 2020/09/03 | ver3.00 | 設計変更。v504aにて動作確認。 |
| 2018/10/12 | ver2.05 | name_none=false で、[l]時にログがインデントされる不具合修正。v472dにて動作確認。 |
| 2018/03/24 | ver2.04 | [l]時にセーブタイトルが正しく取得出来ない不具合修正。v470_rc6bにて動作確認。 |
| 2017/10/24 | ver2.03 | ティラノv457g対応。グリフ表示方法変更に対応。 |
| 2017/08/20 | ver2.02 | セーブにメッセージが入らない件を修正。v456dにて動作確認。 |
| 2017/07/26 | ver2.01a | console.log削除し忘れ修正…。 |
| 2017/07/19 | ver2.01 | glink のログ表示を個別対応可能に、chara_name を class 指定するよう変更。ログHTMLの不要（？）なclass指定を削除。 |
| 2017/07/03 | ver2.00a | console.log削除し忘れ修正。init.ks整理。 |
| 2017/07/02 | ver2.00 | ティラノv455対応。 |
| 2016/08/10 | ver1.00 | 公開 |
