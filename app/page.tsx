const youtubeUrl = "https://www.youtube.com/@hyakku_kuchihate";
const lineUrl = "https://store.line.me/stickershop/author/6197622/ja";

const activities = [
  {
    number: "01",
    label: "GAME VIDEO",
    title: "ゲーム実況",
    text: "笑ったり、驚いたり、たまに朽ち果てたり。ゲームの面白さを、ヒャックならではの目線で届けます。",
    color: "yellow",
    icon: "🎮",
  },
  {
    number: "02",
    label: "LINE STICKERS",
    title: "LINEスタンプ",
    text: "毎日の会話に、ちょっとした笑いと元気を。個性豊かなキャラクターたちが続々ニョキニョキ中です。",
    color: "pink",
    icon: "💬",
  },
  {
    number: "03",
    label: "NEXT IDEA",
    title: "次のたのしいこと",
    text: "動画とキャラクターから、新しい遊びへ。思いついた面白いことを、少しずつ形にしていきます。",
    color: "blue",
    icon: "🌱",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="ページの先頭へ">
          <img
            className="company-logo"
            src="/nyokinyoki-company-logo.png"
            alt="ニョキニョキカンパニー"
            width={84}
            height={84}
          />
        </a>
        <nav aria-label="メインメニュー">
          <a href="#about">わたしたち</a>
          <a href="#activity">やっていること</a>
          <a className="nav-contact" href="#links">作品を見る</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>●</span> NYOKI NYOKI COMPANY</p>
          <h1>あそびが、<br /><strong>ニョキニョキ。</strong></h1>
          <p className="lead">ゲームとキャラクターで、<br />毎日にちいさな「おもしろい」を。</p>
          <div className="hero-actions">
            <a className="button button-dark" href={youtubeUrl} target="_blank" rel="noreferrer">YouTubeを見る <span>↗</span></a>
            <a className="button button-light" href={lineUrl} target="_blank" rel="noreferrer">LINEスタンプを見る <span>↗</span></a>
          </div>
        </div>

        <div className="hero-stage" aria-label="ゲーム実況とLINEスタンプの活動紹介">
          <div className="sun" aria-hidden="true">✦</div>
          <div className="pixel pixel-one" aria-hidden="true" />
          <div className="pixel pixel-two" aria-hidden="true" />
          <a className="feature-card video-card" href={youtubeUrl} target="_blank" rel="noreferrer">
            <span className="card-tag">PLAY!</span>
            <span className="card-icon" aria-hidden="true">🎮</span>
            <span className="card-type">YOUTUBE CHANNEL</span>
            <strong>ヒャックの<br />朽ち果てチャンネル</strong>
            <span className="card-arrow">↗</span>
          </a>
          <a className="feature-card sticker-card" href={lineUrl} target="_blank" rel="noreferrer">
            <span className="card-tag">23 SERIES</span>
            <span className="faces" aria-hidden="true"><i>☺</i><i>☻</i><i>☺</i></span>
            <span className="card-type">LINE STICKERS</span>
            <strong>会話がはずむ<br />キャラクターたち</strong>
            <span className="card-arrow">↗</span>
          </a>
          <div className="mascot" aria-hidden="true"><span>•ᴗ•</span></div>
        </div>
      </section>

      <section className="ticker" aria-hidden="true">
        <div>PLAY! &nbsp; CREATE! &nbsp; GROW! &nbsp; PLAY! &nbsp; CREATE! &nbsp; GROW! &nbsp; PLAY! &nbsp; CREATE! &nbsp; GROW!</div>
      </section>

      <section className="about" id="about">
        <p className="section-kicker">ABOUT US</p>
        <div className="about-grid">
          <h2>「好き」から生まれたものを、<br /><span>たのしい形</span>に育てる会社。</h2>
          <div>
            <p>ニョキニョキカンパニーは、ゲーム実況とキャラクター制作を中心に活動する小さなクリエイティブカンパニーです。</p>
            <p>見た人がふっと笑えて、ちょっと元気になる。そんな作品を、今日もニョキニョキ育てています。</p>
          </div>
        </div>
      </section>

      <section className="activity" id="activity">
        <div className="section-heading">
          <div><p className="section-kicker">WHAT WE DO</p><h2>やっていること</h2></div>
          <p>好きなことを、しっかり楽しむ。<br />それがわたしたちのものづくりです。</p>
        </div>
        <div className="activity-grid">
          {activities.map((item) => (
            <article className={`activity-card ${item.color}`} key={item.title}>
              <div className="activity-top"><span>{item.number}</span><span>{item.label}</span></div>
              <div className="activity-icon" aria-hidden="true">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="links" id="links">
        <div className="links-copy">
          <p className="section-kicker">OUR CONTENTS</p>
          <h2>いま育っている<br />コンテンツ</h2>
          <p>動画やスタンプは、これからも増えていきます。<br />気になる場所からのぞいてみてください。</p>
        </div>
        <div className="link-list">
          <a href={youtubeUrl} target="_blank" rel="noreferrer"><span className="link-icon red">▶</span><span><small>GAME PLAY &amp; MORE</small><strong>ヒャックの朽ち果てチャンネル</strong></span><b>↗</b></a>
          <a href={lineUrl} target="_blank" rel="noreferrer"><span className="link-icon green">LINE</span><span><small>23 STICKER SERIES</small><strong>ニョキニョキカンパニー LINE STORE</strong></span><b>↗</b></a>
        </div>
      </section>

      <footer>
        <div className="footer-logo">
          <img
            src="/nyokinyoki-company-logo.png"
            alt="ニョキニョキカンパニー"
            width={132}
            height={132}
          />
        </div>
        <div className="footer-contact">
          <p>ゲームとキャラクターで、<br />毎日にちいさな「おもしろい」を。</p>
          <a href="mailto:nyokinyokicompany@gmail.com">
            <small>お問い合わせ</small>
            nyokinyokicompany@gmail.com
          </a>
        </div>
        <p className="copyright">© 2026 NYOKI NYOKI COMPANY</p>
      </footer>
    </main>
  );
}
