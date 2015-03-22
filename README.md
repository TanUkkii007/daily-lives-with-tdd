# テストのある日常 (WIP)

## はじめに

ここではユニットテストがどのように開発の日常的な問題を解決するのか見て行くよ。

テストランナーには[Karma](http://karma-runner.github.io/0.12/index.html)、テストフレームワークは[Jasmine](http://jasmine.github.io/2.2/introduction.html)を使う。これらはもうほとんどセットアップしてあるから大丈夫。Node.jsをインストールして以下のコマンドを実行すれば準備完了だ。

```sh
$ git clone git@github.com:TanUkkii007/daily-lives-with-tdd.git
$ cd daily-lives-with-tdd
$ npm install
$ npm install -g gulp

```


さあテストを始めよう！

## まだ画面に表示させることできないし、とりあえずconsole.log()で確認しておくか

### 01. 期待する結果を瞬時に取得する

console.logやHTMLとして実行結果を出力して確認してもいいけど、テストで結果を確認する方が適切だ。コードの他の部分がバグってたりDBやサーバーその他もろもろがうまく動いていないときに、console.logやHTMLの出力は見れないよね。ただただconsole.logやHTMLの結果を見たいがためにそれらを修正するには時間がかかりすぎる。そこでユニットテストの出番だ。

例えば文字列の両端から空白を取り除くString#trimに相当する関数を実装したいとする。

```js
function trim(string) {
    if (string[0] === ' ') {
      string = string.slice(1);
    }
    if (string.endsWith(' ')) {
      string = string.slice(0, string.length - 1);
    }
    return string;
  }
```
これをテストコードにしてみよう。

```js
/* test/test01.js */

describe('01. trim(string)', function() {

  function trim(string) {
    if (string[0] === ' ') {
      string = string.slice(1);
    }
    if (string.endsWith(' ')) {
      string = string.slice(0, string.length - 1);
    }
    return string;
  }

  it('trim(string)はstringの両端の空白を取り除く', function() {
    expect(trim(' abcde ')).toBe('abcde');
  });

});

```
gulp testコマンドで実行しよう。

```sh
gulp test
```

次のような実行結果が得られる。

```
01. trim(string)
    ✓ trim(string)はstringの両端の空白を取り除く
    
Chrome 41.0.2272 (Mac OS X 10.9.5): Executed 1 of 1 SUCCESS (0.004 secs / 0.001 secs)
```

trim(' abcde ')の結果が'abcde'と等しいことをテストした。テストレポートにはただテストがパスしたことが伝えられている。console.logで出して目視で'abcde'になっているかを確認するよりいいよね。

describeブロックはテストの１つの大きなまとまりで、テストスイートと呼よばれている。describeブロックの中のitブロックはテストケースといって、ここに満たすべき振る舞いを書いておく。満たすべき振る舞いはいくつもあるだろうから、テストケースは複数あってもよい。テストスイートはテストケースの集合をグループ化しているんだ。

expect(expr).toBe(value)のtoBeはマッチャーといって、調べる式の値がどうなればよいかを宣言する。toBeの場合は単純に等しい（===）と成功となる。マッチャーは他にもたくさんある。[Jasmine](http://jasmine.github.io/2.2/introduction.html)のドキュメントを見るともう覚えられないぐらい載っているよ。


### 02.期待する振る舞いの失敗を分かりやすい形で取得する
実装に欠陥があったとき、console.logだと何がどう失敗しているのかはエラーでも起きてくれないと親切に説明してくれないよね。テストは教えてくれるよ。

test01のtrimには欠陥がある。そう複数の空白が取り除けないんだ。テストケースを追加してテストが失敗することを確認しよう。

```js
/* test/test02.js */

describe('02. trim(string)', function() {

  function trim(string) {
    if (string[0] === ' ') {
      string = string.slice(1);
    }
    if (string.endsWith(' ')) {
      string = string.slice(0, string.length - 1);
    }
    return string;
  }

  it('trim(string)はstringの両端の空白を取り除く', function() {
    expect(trim(' abcde ')).toBe('abcde');
  });

  it('trim(string)はstringの両端の複数の空白を取り除く', function() {
    expect(trim('   abcde   ')).toBe('abcde');
  });

});

```

実行結果

```
 ✓ trim(string)はstringの両端の空白を取り除く
 ✗ trim(string)はstringの両端の複数の空白を取り除く
	Expected '  abcde  ' to be 'abcde'.
```
追加したテストが失敗し、両端の空白が消しきれてないことが原因だと分かるだろう。


### 03. 複数の失敗から学ぶ
コードがエラーを吐くと、それ以降のコードは実行されないよね。console.logの結果はそれによって一部見れなくなってしまう。でもテストだとテストケースを分けておけば、テストケース内でエラーを吐いても次のテストケースはしっかり実行してくれる。

```js
/* test/test03.js */

describe('03. trim(string)', function() {

  function trim(string) {
    if (string[0] === ' ') {
      string = string.replace(/^\s+/, '');
    }
    if (string.endsWith(' ')) {
      string = strin.replace(/\s+$/, '');
    }
    return string;
  }

  it('trim(string)はstringの左端の複数の空白を取り除く', function() {
    expect(trim('   abcde')).toBe('abcde');
  });

  it('trim(string)はstringの右端の複数の空白を取り除く', function() {
    expect(trim('abcde   ')).toBe('abcde');
  });

  it('trim(string)はstringの両端の複数の空白を取り除く', function() {
    expect(trim('   abcde   ')).toBe('abcde');
  });

});

```
この例では右端に空白があった場合、if (string.endsWith(' '))のif文に入るのだけど、中でstringをstrinとタイプミスをしてしまっている。当然右端に空白のある２、３番目のテストケースはReferenceErrorでエラーを吐いて失敗する。でも右端に空白のない１番目のテストケースはしっかり実行されて成功している。

実行結果

```
	✓ trim(string)はstringの左端の複数の空白を取り除く
    ✗ trim(string)はstringの右端の複数の空白を取り除く
	ReferenceError: strin is not defined
    ✗ trim(string)はstringの両端の複数の空白を取り除く
	ReferenceError: strin is not defined
```
テストではテスト実行中にエラーがおきても途中で止まったりしない。すべてを実行し、エラーも含めてしっかり報告してくれる。


### 04. 複数の入力に対して期待する振る舞いを確かめる
console.logをアプリケーションのコード中に忍ばせても、複数の入力に対してそれを調べるのは本当に大変だ。入力は通信の結果かもしれないし、フォームの入力結果かもしれない。いちいち複数の入力パターンなんて調べてられないよね。

テストを書けばコードを書くことで簡単に複数の入力を与えることができる。test03のように、左端、右端、両端に空白をつけた文字列をtrimの引数に与えてマッチャーにかけるだけだ。


### 05. 期待する振る舞いを永続化しておく
console.logはいつまでも出しておくわけにはいかないよね。確かめ終わったら消すと思う。
でも今は正しい振る舞いをしていても、それが今後永久にそうとは限らない。苦労して確かめた結果だし、残しておいた方が、今後自分や他のメンバー、そしてアプリケーションのためにもいいだろう。

テストコードを書いたなら、永続化しよう。テストもプロダクションコードと一緒にバージョン管理して、コミットしておこう。


### 06. 期待する振る舞いを単体で確かめる
console.logはアプリケーションのコード中に書く。でもアプリケーションのコードは本当に複雑。特にフレームワークを使った場合はね。フレームワークが実行のライフサイクルを管理していたら、いつ実行されるのかも分からない。僕らはたった１つの機能を確かめたいだけなのに。

ユニットテストの場合はその機能単体を取り出してテストにかける。他の複雑なアプリケーションのコードなんて気にしなくていい。

テストからその機能単体を取り出す際にオススメの方法が、モジュールで管理することだ。[browserify](http://browserify.org/)というバンドラーの助けを借りよう。

trim.jsを作ってこの中にtrim関数を入れる。

```js
/* test/trim.js */

function trim(string) {
  return string.replace(/^\s+/, '').replace(/\s+$/, '');
}

module.exports = trim;
```

さあこれをテスト側から呼び出そう。

```js
/* test/test06.js */

describe('06. trim(string)', function() {

  var trim = require('./trim');

  it('trim(string)はstringの左端の複数の空白を取り除く', function() {
    expect(trim('   abcde')).toBe('abcde');
  });

  it('trim(string)はstringの右端の複数の空白を取り除く', function() {
    expect(trim('abcde   ')).toBe('abcde');
  });

  it('trim(string)はstringの両端の複数の空白を取り除く', function() {
    expect(trim('   abcde   ')).toBe('abcde');
  });

});

```

モジュール側ではmodule.exports = trimでtrimを公開し、呼び出し側ではvar trim = require('./trim')でtrimを読み込んでいる。アプリケーションのコード側からも同様にrequireすればtrimを使えるようになる。


## この関数、長すぎて何やってるか全然分かんない

### テストコードが長くなりすぎるのなら、複数の処理に分ける



## このモジュール使いたいんだけど、他の処理と密結合してて使えないよ

### 単体でテストしやすいように外部環境に依存させない

Ajaxによる通信や、ストレージへのアクセス、DOMへのアクセスなどを内部で行っているモジュールは、再利用性が非常に悪い。そのモジュールはサーバーが提供するAPIやストレージ上の特定のデータ、特定のDOM要素にが存在することを前提にしており、それら外部の環境に強く依存している。そのためほぼ同じ処理にもかかわらず環境や要求が少し変わっただけでも、再利用できない問題を抱えている。

このような設計に問題のあるモジュールは生まれやすい。なぜなら外部環境に依存させたほうが簡単に実装できるからね。

でも外部環境に依存すると簡単にできないものがある。それはユニットテストだ。なぜなら外部環境を用意するのにたくさんのコードを書かないといけないからね。




## このモジュール修正しなきゃいけないけど、これ使ってるの結構あるんだよなー。影響範囲全部調べるのか．．．

### テストを書いてあれば、修正によってどこまで壊れたか分かる

### 修正後にテストがすべて通っていれば、今までの機能は引き続き提供できている

## ○○さんが書いたこのコードに機能追加したいのだけど、ここいじっていいのかな？今日○○さん休みなんだけど．．．

### テストはコードが満たすべき振る舞いを語る

### 既存のテストに書き足すことによって、既存の機能をサポートしながら機能を追加できる


## 仕様変更だと？！

### 適切な粒度までモジュールを切り出していれば、いくつかは変更後でも使えるかもしれない

### 破壊的変更が既存のアプリケーションにどこまで影響を与えるのかを、テストの壊れ具合で確認できるので、自信をもって壊せる

### テストの変更が最小限で済むように、内部をテストしない

## やるべきことはやった

### テストは自信をもたらす

## あなたのプルリクエスト、テスト失敗してますよ

### 新規参入者にやさしく

## 作業の進捗どれぐらいですかね？

### テストの通り具合で進捗をはかる

## 今日やる作業何だっけ
