import './App.css';
//ReactのuseStateフックインポート
import { useState } from 'react';

//ヘッダー
function Header(props) {
  return <header>
    {/*ヘッダーをクリックしたら*/}
    <h1><a href="/" onClick={(event) => {
      //eventオブジェクトの初期イベント発生防止
      event.preventDefault();
      //onChangeMode関数呼び出し
      props.onChangeMode();
      //propsに指定されているtitle(="WEB")表示
    }}>{props.title}</a></h1>
  </header>
}
//ナビゲーター
function Nav(props) {
  //空の配列lisを生成
  const lis = []
  //for文を回してナビゲーターリストを順に表示
  for (let i = 0; i < props.topics.length; i++) {
    //topicsのi番目のオブジェクト取得
    let t = props.topics[i];
    //空の配列lisにリストを追加
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/' + t.id} onClick={event => {
        event.preventDefault();
        //属性から持ってきた値は文字列なので、数字に強制変換
        //target：イベントを発生させるオブジェクト（aタグ）
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
    </li>)
  }
  return <nav>
    <ol>
      {/*リスト配列内の全てのオブジェクトを表示*/}
      {lis}
    </ol>
  </nav>
}

//アーティクル
function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

//クリエイト
function Create(props) {
  return <article>
    <h2>Create</h2>
    {/*送信を押したら*/}
    <form onSubmit={event => {
      event.preventDefault();
      //form内の入力内容 
      const title = event.target.title.value;
      const body = event.target.body.value;
      //onCreate関数呼び出し
      props.onCreate(title, body);
    }}>
      {/*titleインプット*/}
      <p><input type="text" name="title" placeholder="title" /></p>
      {/*bodyインプット*/}
      <p><textarea name="body" placeholder="body"></textarea></p>
      {/*submitボタン*/}
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}

function Update(props) {
  //propsで得た値は変更できないので、state宣言して、既存内容を修正できるように
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    {/*Updateをクリックしたら、入力した内容がtitleとbody変数に格納*/}
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      //項目を追加するonUpdate関数にtitleとbodyを渡して呼び出し
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event => {
        //titleのstate更新
        setTitle(event.target.value);
      }} /></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event => {
        //bodyのstate更新
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}

function App() {
  //mode：①WELCOME ②READ ③CREATE ④UPDATE
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  //CREATEで生成されたオブジェクトのID指定
  const [nextId, setNextId] = useState(4);
  //topicsオブジェクトの配列
  const [topics, setTopics] = useState([
    { id: 1, title: 'HTML', body: 'HTML is ...' },
    { id: 2, title: 'CSS', body: 'CSS is ...' },
    { id: 3, title: 'JavaScript', body: 'JavaScript is ...' }
  ]);
  //コンテンツ
  let content = null;
  let contextControl = null;
  //modeがWELCOMEの場合
  if (mode === 'WELCOME') {
    //コンテンツ指定
    content = <Article title="Welcome" body="Hello, WEB"></Article>
    //modeがREADの場合
  } else if (mode === 'READ') {
    let title, body = null;
    //titleとbody指定
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    //content指定
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a href={'/update/' + id} onClick={event => {
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      {/*deleteボタン*/}
      <li><input type="button" value="Delete" onClick={() => {
        //空の配列
        const newTopics = []
        //for文を回して、削除しようとする項目のidと一致しない項目だけ配列に格納
        for (let i = 0; i < topics.length; i++) {
          if (topics[i].id !== id) {
            newTopics.push(topics[i]);
          }
        }
        //削除しようとした項目がなくなった新しい配列をセット
        setTopics(newTopics);
        //初期画面に戻る
        setMode('WELCOME');
      }} /></li>
    </>
    //modeがCREATEの場合
  } else if (mode === 'CREATE') {
    //コンテンツ指定
    content = <Create onCreate={(_title, _body) => {
      //新しいオブジェクト
      const newTopic = { id: nextId, title: _title, body: _body }
      //topicsを新しい配列にコピー（オブジェクトは項目を直接追加できない）
      const newTopics = [...topics]
      //配列のコピーに、新しいオブジェクトを追加
      newTopics.push(newTopic);
      //配列のコピーで既存の配列を代替
      setTopics(newTopics);
      //modeをREADに切り替え（生成したオブジェクトをすぐ確認するため）
      setMode('READ');
      //生成したオブジェクトのIDにnextIdを代入
      setId(nextId);
      //nextId + 1
      setNextId(nextId + 1);
    }}></Create>
    //modeがUPDATEの場合
  } else if (mode === 'UPDATE') {
    let title, body = null;
    //当該topicのtitleとbodyを取得
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    //コンテンツ指定
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      //既存のtopics配列のコピー配列
      const newTopics = [...topics]
      //修正したtopic
      const updatedTopic = { id: id, title: title, body: body }
      for (let i = 0; i < newTopics.length; i++) {
        //既存のtopicからIDが一致するtopicを探す
        if (newTopics[i].id === id) {
          //修正したtopicを探したtopicに代入
          newTopics[i] = updatedTopic;
          break;
        }
      }
      //topics配列をコピーに置き換え
      setTopics(newTopics);
      //修正した項目の内容表示
      setMode('READ');
    }}></Update>
  }

  return (
    <div>
      {/*ヘッダーのタイトル：WEB
      onChangeMode属性の関数：modeをWELCOMEに切り替え*/}
      <Header title="WEB" onChangeMode={() => {
        setMode('WELCOME');
      }}></Header>
      {/*topics属性にtopicsのstateを代入
      onChangeMode属性の関数：modeをREADに切り替え、_idをセット*/}
      <Nav topics={topics} onChangeMode={(_id) => {
        setMode('READ');
        setId(_id);
      }}></Nav>
      {/*コンテンツ表示*/}
      {content}

      <ul>
        <li><a href="/create" onClick={event => {
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {/*Update*/}
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
