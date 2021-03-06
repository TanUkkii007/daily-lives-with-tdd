# テストのある日常

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


### 05. 期待する振る舞いを永続化しておき、資産を積み上げる。
console.logはいつまでも出しておくわけにはいかないよね。確かめ終わったら消すと思う。
でも今は正しい振る舞いをしていても、それが今後永久にそうとは限らない。苦労して確かめた結果だし、残しておいた方が、今後自分や他のメンバー、そしてアプリケーションのためにもいいだろう。

テストコードを書いたなら、永続化しよう。テストもプロダクションコードと一緒にバージョン管理して、コミットしておこう。

また開発時に想像していなかった入力やシチュエーションに出くわしたときに、バグが発見されることもある。
このときテストコードがあるかないかであなたの次の行動は変わってくる。

テストコードがない場合、あなたは過去にテストして自信をもっていた部分をもう一度疑いの目を向けるだろう。そしてまた過去に行ったテストを再現し始める。
テストコードがあれば、まずテストをもう一度実行する。そのテストが通っていたら、新しい入力に対してテストを追記するだけだ。
既存のテストが保証する範囲は気にしなくていい。こうして２度と同じ過ちを繰り返さないようになる。
どちらが速く賢いか、明らかじゃないかな。

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

### 07. テストコードが長くなりすぎるのなら、複数の処理に分ける

下のコードはNode.jsのutil.format関数のコードだ。format('Today is %d/%d/%d %s.', 2015, 3, 28, 'Sat')の結果は'Today is 2015/3/28 Sat.'になる。文字列を整形する関数だ。ただ少し長いので、何をやっているのかは把握しずらい。

```js
function format(f) {
    var formatRegExp = /%[sdj%]/g;
    if (typeof f !== 'string') {
      var objects = [];
      for (var i = 0; i < arguments.length; i++) {
        objects.push(String(arguments[i]));
      }
      return objects.join(' ');
    }

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x) {
      if (x === '%%') return '%';
      if (i >= len) return x;
      switch (x) {
        case '%s': return String(args[i++]);
        case '%d': return Number(args[i++]);
        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }
        default:
          return x;
      }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
      str += ' ' + x;
    }
    return str;
  }

```
format関数のテストを書くとこんな感じになる。format関数がやるべき処理が多いので、テストも多くなっている。


```
describe('07. format', function() {
  it('format("%s")は%sを文字列に置換する', function() {
    expect(format('%s', 'abc')).toBe('abc');
  });

  it('format(%d)は%dを数字に置換する', function() {
    expect(format('%d', 123)).toBe('123');
  });

  it('format("%d * %d * 1000 = %s")', function() {
    expect(format('%d * %d * 1000 = %s', 2, 3, '6e+3')).toBe('2 * 3 * 1000 = 6e+3');
  });

  it('format(%j)は%jをJSON形式に整形して置換する', function() {
    expect(format('%j', {array: [1,2,3]})).toBe(JSON.stringify({array: [1,2,3]}));
  });

  it('format(%j)は対象が循環参照を含む場合[Circular]となる', function() {
    var circular = {a: 1, b: 2};
    circular.ab = circular;
    expect(format('%j', circular)).toBe('[Circular]');
  });

  it('formatは置換するプレースホルダーがないと単にスペースで結合する', function() {
    expect(format(1,2,3)).toBe('1 2 3');
  });

  it('formatは置換引数が超過している場合、スペースで結合する', function() {
    expect(format('trafic light: %s', 'red', 'yellow', 'blue')).toBe('trafic light: red yellow blue');
  });

  it('formatは置換引数が足りない場合置換しない', function() {
    expect(format('trafic light: %s %s %s %s', 'red', 'yellow', 'blue')).toBe('trafic light: red yellow blue %s');
  });
});

```

配列の要素を空白で結合するconcat、%s, %d, %jに応じて整形をするformatWithを実装すれば、format関数は少しシンプルにできる。


```js
  function format(f) {
    var formatRegExp = /%[sdj%]/g;
    if (typeof f !== 'string') {
      return concat(arguments);
    }

    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(formatRegExp, function(x) {
      if (x === '%%') return '%';
      if (i >= len) return x;
      return formatWith(x, args[i++]);
    });

    if (i < len) {
      str += ' ' + concat(Array.prototype.slice.call(args, i));
    }

    return str;
  }

```

concatとformatWithはよくテストされているとしたら、format関数の確かめるべき振る舞いは減る。テストもシンプルになる。

```js
describe('format', function() {
    it('format("%j * %d = %s")', function() {
      expect(format('%j * %d = %s', {numer: 1, denom: 6}, 2, '1/3')).toBe('{"numer":1,"denom":6} * 2 = 1/3');
    });

    it('formatは置換するプレースホルダーがないと単にスペースで結合する', function() {
      expect(format(1,2,3)).toBe(concat([1,2,3]));
    });

    it('formatは置換引数が超過している場合、スペースで結合する', function() {
      expect(format('trafic light: %s', 'red', 'yellow', 'blue')).toBe('trafic light: red ' + concat(['yellow', 'blue']));
    });

    it('formatは置換引数が足りない場合置換しない', function() {
      expect(format('trafic light: %s %s %s %s', 'red', 'yellow', 'blue')).toBe('trafic light: red yellow blue %s');
    });
  });

```

テスト駆動開発ではプロダクションコードを書く前にテストを書く。いきなり複雑なテストは書きにくいから、自ずと機能と責任を分割するようになる。テストが設計を導くとはこういうことだね。


## このモジュール使いたいんだけど、他の処理と密結合してて使えないよ

### 08. 単体でテストしやすいように、外部環境に依存したり副作用を生まないドメインを増やす

Ajaxによる通信や、ストレージへのアクセス、DOMへのアクセスなどを内部で行っているモジュールは、再利用性が非常に悪い。そのモジュールはサーバーが提供するAPIやストレージ上の特定のデータ、特定のDOM要素にが存在することを前提にしており、それら外部の環境に強く依存している。そのためほぼ同じ処理にもかかわらず環境や要求が少し変わっただけでも、再利用できない問題を抱えている。

さらにこれら外部環境の状態に変更を加えることもできる。この状態にアプリケーションが依存しすぎると、アプリケーションはとってもスケールしにくくなる。

このような設計に問題のあるモジュールは生まれやすい。なぜなら外部環境に依存させたり副作用を発生させたほうが簡単に実装できるからね。

でも外部環境に依存すると簡単にできないものがある。それはユニットテストだ。なぜなら外部環境を用意するのにたくさんのコードを書かないといけないからね。

テスト駆動開発ではプロダクションコードを書く前にテストを書くから、自ずと外部環境への依存や副作用を減らすようになる。これもまたテストが設計を導く例だね。


## このモジュール修正しなきゃいけないけど、これ使ってるの結構あるんだよなー。影響範囲全部調べるのか．．．


### 09. テストを書いてあれば、修正によってどこまで壊れたか分かる

### 10. 修正後にテストが通っている機能は、今まで通り引き続き提供できている

## ○○さんが書いたこのコードを修正したいのだけど、ここいじっていいのかな？今日○○さん休みなんだけど．．．

### 11. コードを属人化させない


これらまとめて解説しよう。
+ テストを書いてあれば、修正によってどこまで壊れたか分かる
+ 修正後にテストが通っている機能は、今まで通り引き続き提供できている
+ コードを属人化させない

すでに多くのテストが書いてあるunderscore.jsを例に使おう。underscore.jsのリポジトリをクローンしてきて。

```sh
$ git clone git@github.com:jashkenas/underscore.git

```
test/index.htmlを開くと、テストが実行される（[ここ](http://underscorejs.org/test/)でも見れるよ）。1419個もテストあるんだね。

さて、underscore.jsに変更を加えようと思う。each関数の中の一見あまり影響なさそうな１行をコメントアウトしよう。

```js
_.each = _.forEach = function(obj, iteratee, context) {
    //optimizeCbを通す意味がよく分からないのでコメントアウト
    //iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };
```

この状態でテストを実行してみると、８個のテストが失敗している。実はこの１行は重要だったことが分かる。コメントアウトすることによってunderscore.jsを壊したんだ。

```
1411 assertions of 1419 passed, 8 failed.
```
さあもうテストの利点は分かったよね。テストはアプリケーションが大きくなる（そして開発チームも大きくなる）と不可欠になる。

+ テストを書いてあれば、修正によってどこまで壊れたか分かる。
アプリケーションが大きく複雑になると修正による影響を把握しずらくなる。テストを自動化しておけば修正の影響範囲を瞬時に把握できる。

+ 修正後にテストが通っている機能は、今まで通り引き続き提供できている。
逆に修正してもテストが通っているものは、今まで通りの機能を提供できているということ。なので修正後に安心して壊れている部分に集中できる。

+ コードを属人化させない。
他の人が書いたコードは把握しずらい。自分が書いたコードも１週間後には忘れている。そしていつか必ず他人のコードを自分が担当することになる。
時に障害などで緊急にその時はやってくるかもしれない。
コードの意図は誰もが非同期につかめた方がいい。
すでに担当者がチームにいないなんてこともある。開発の責任を果たすためにも、テストコードを書こう。



## 仕様変更だと？！

### 12. 変わらなきゃいけないときはいつか必ず来る
未熟な企画、プロダクトのピボット、技術的な問題のためにアプリケーションの構造を大幅に変えないといけないときがある。当初の想定のまま開発が進むことはめったにない。じゃあ、いかに変更に耐えられる設計にするかが重要になる。

テストを書いていると、仕様変更の際にテストコードが無駄になるとか、仕様変更が多すぎるからテスト書かない方がいいとか書けないとかいう言い訳を聞く。だが重要なことは変更に対するリカバリーを早く、安全に、低コストで行えるようにしておくことで、変更に対しての不安を取り除き前向きになれるようにしておくことだ。

テストがあると変更に直面したときに前向きになれる。underscore.jsを変更した例を思い出そう。もしその変更を貫き通すのであれば、８個の失敗しているテストを何らかの方法で解決すべきということがわかっている。

変化に対するテストの利点をまとめよう。

+ 変わらなければならない時は、自信をもってズバっと壊せる。前述したように影響範囲がすぐつかめるからね。そして破壊的変更の後にアプリケーションを動く状態に戻すまでの道のりが、テストの壊れ具合で示されているから、目の前にやるべきことが見えている状態になる。これで気持ちが前向きになる。

+ 適切な粒度までモジュールを疎結合に切り出していれば、変更の影響は連鎖的に広がらないので、部分的な修正に集中できる。ユニットテストによってモジュールが疎結合になっていれば、生き残るモジュールが増えるし、あれもこれも直さなきゃってことにはなりにくくなっているはず。

ただしテストの変更が最小限で済むように、インターフェースだけをテストして、内部をテストしないように。

## やるべきことはやった

### 13. テストは自信をもたらす

これが一番大切。
