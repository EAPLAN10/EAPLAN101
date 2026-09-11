const A='/public/assets/';
const app=document.querySelector('#app');

const nav=[
  ['home','⌂','Beranda'],
  ['planning','☷','Planning'],
  ['goals','◎','Goals'],
  ['journal','✎','Journal'],
  ['ideas','✦','Ideas'],
  ['projects','□','Projects'],
  ['journey','↗','Journey']
];

let state={
  user:JSON.parse(localStorage.getItem('ea_user')||'null'),
  selected:[],
  onStep:1,
  active:'home'
};

/* =========================================================
   EA PLAN BACKGROUND SYSTEM
   splash.jpg menjadi background dari Login/Register,
   Onboarding sampai Dashboard.
   Welcome tetap menggunakan splash.jpg secara full.
   ========================================================= */

(function injectBackgroundStyles(){

  const style=document.createElement('style');

  style.textContent=`

    .ea-bg-page{
      position:relative;
      min-height:100vh;
      overflow:hidden;
      isolation:isolate;
      color:white;
    }

    .ea-bg-page::before{
      content:"";
      position:fixed;
      inset:0;
      z-index:-2;
      background:
        linear-gradient(
          rgba(10,8,6,.58),
          rgba(10,8,6,.68)
        ),
        url("${A}splash.jpg")
        center center/cover
        no-repeat;
      transform:translateZ(0);
    }

    .ea-bg-page::after{
      content:"";
      position:fixed;
      inset:0;
      z-index:-1;
      background:rgba(0,0,0,.12);
      pointer-events:none;
    }

    .ea-bg-page .authBox,
    .ea-bg-page .onboardBox{
      background:rgba(20,16,12,.72);
      backdrop-filter:blur(5px);
      -webkit-backdrop-filter:blur(5px);
      border:1px solid rgba(255,255,255,.10);
    }

    .ea-bg-page .appShell{
      background:transparent !important;
    }

    .ea-bg-page .main{
      background:transparent !important;
    }

    .ea-bg-page .card{
      background:rgba(20,16,12,.70);
      backdrop-filter:blur(5px);
      -webkit-backdrop-filter:blur(5px);
    }

    .ea-bg-page .side,
    .ea-bg-page .top,
    .ea-bg-page .mobileNav{
      background:rgba(15,12,10,.76);
      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
    }

    /* Welcome tetap full dan jelas */

    .authVisual{
      background-image:url("${A}splash.jpg") !important;
      background-size:cover !important;
      background-position:center !important;
      background-repeat:no-repeat !important;
    }

  `;

  document.head.appendChild(style);

})();


/* =========================================================
   SPLASH
   ========================================================= */

function splash(){

  app.innerHTML=`

    <div class="splash">

      <img
        class="bg"
        src="${A}splash.jpg"
      >

      <div class="content">

        <img
          class="logo"
          src="${A}logoea.png"
        >

        <div class="word">
          EA PLAN
        </div>

        <div class="tag">
          YOUR PERSONALIZED PLANNING JOURNEY
        </div>

      </div>

    </div>

  `;

  setTimeout(()=>{

    if(state.user)
      dashboard();
    else
      welcome();

  },3000);

}


/* =========================================================
   WELCOME
   ========================================================= */

function welcome(){

  app.innerHTML=`

    <div class="authShell">

      <div class="authVisual">

        <img
          src="${A}splash.jpg"
        >

        <div class="visualText">

          <div class="ey">
            PLAN · CREATE · REFLECT · GROW
          </div>

          <h1>
            Rancang hidupmu.<br>
            Rawat perjalananmu.
          </h1>

          <p>
            Ruang untuk merencanakan langkah,
            menyimpan ide, menulis cerita,
            mengelola proyek, dan melihat
            pertumbuhan dari waktu ke waktu.
          </p>

        </div>

      </div>


      <div class="authPanel">

        <div class="authBox">

          <img
            class="miniLogo"
            src="${A}logoea.png"
          >

          <div class="brandText">
            EA PLAN
          </div>

          <h2>
            Mulai perjalananmu.
          </h2>

          <p class="sub">
            Satu langkah kecil hari ini dapat
            menjadi bagian dari karya besar esok hari.
          </p>

          <div class="form">

            <button
              class="goldBtn"
              onclick="register()"
            >
              Buat Akun
            </button>

            <button
              class="ghostBtn"
              onclick="login()"
            >
              Sudah punya akun? Masuk
            </button>

          </div>

          <p class="switch">
            Dengan melanjutkan, kamu menyetujui
            ruang privat dan publik EA PLAN yang
            akan dijelaskan saat akun dibuat.
          </p>

        </div>

      </div>

    </div>

  `;

}


/* =========================================================
   REGISTER / LOGIN
   ========================================================= */

function register(){
  auth('register');
}

function login(){
  auth('login');
}


function auth(mode){

  let reg=mode==='register';

  app.innerHTML=`

    <div
      class="authPanel ea-bg-page"
      style="min-height:100vh;color:white"
    >

      <div class="authBox">

        <img
          class="miniLogo"
          src="${A}logoea.png"
        >

        <div class="brandText">
          EA PLAN
        </div>

        <h2>
          ${reg
            ? 'Buat akun.'
            : 'Selamat datang kembali.'
          }
        </h2>

        <p class="sub">
          ${reg
            ? 'Buat ruang perjalanan pribadimu.'
            : 'Masuk untuk melanjutkan perjalananmu.'
          }
        </p>

        <form
          class="form"
          onsubmit="submitAuth(event,'${mode}')"
        >

          ${
            reg
            ?
            `
              <input
                class="input"
                id="name"
                placeholder="Nama"
                required
              >

              <input
                class="input"
                id="username"
                placeholder="Username"
                required
              >
            `
            :
            ''
          }

          <input
            class="input"
            id="email"
            type="email"
            placeholder="Email"
            required
          >

          <input
            class="input"
            id="password"
            type="password"
            placeholder="Password"
            minlength="6"
            required
          >

          <div
            id="err"
            class="error"
          ></div>

          <button class="goldBtn">
            ${reg ? 'Buat Akun' : 'Masuk'}
          </button>

        </form>

        <div class="switch">

          <button
            class="link"
            onclick="welcome()"
          >
            ← Kembali
          </button>

          ·

          <button
            class="link"
            onclick="forgot()"
          >
            Lupa password?
          </button>

        </div>

      </div>

    </div>

  `;

}


/* =========================================================
   AUTH SUBMIT
   ========================================================= */

function submitAuth(e,mode){

  e.preventDefault();

  if(mode==='register'){

    state.user={
      name:name.value,
      username:username.value,
      email:email.value
    };

    localStorage.setItem(
      'ea_user',
      JSON.stringify(state.user)
    );

    onboarding();

  }else{

    let u=JSON.parse(
      localStorage.getItem('ea_user')||'null'
    );

    if(!u || u.email!==email.value){

      err.textContent=
        'Demo: akun belum ditemukan. Silakan buat akun terlebih dahulu.';

      return;
    }

    state.user=u;

    dashboard();

  }

}


/* =========================================================
   FORGOT PASSWORD
   ========================================================= */

function forgot(){

  app.innerHTML=`

    <div
      class="authPanel ea-bg-page"
      style="min-height:100vh;color:white"
    >

      <div class="authBox">

        <img
          class="miniLogo"
          src="${A}logoea.png"
        >

        <div class="brandText">
          EA PLAN
        </div>

        <h2>
          Reset password.
        </h2>

        <p class="sub">
          Masukkan email untuk proses pemulihan akun.
          Email service akan disambungkan pada fase backend.
        </p>

        <form
          class="form"
          onsubmit="
            event.preventDefault();
            alert('Fitur email reset akan aktif setelah authentication backend disambungkan.');
            login()
          "
        >

          <input
            class="input"
            type="email"
            placeholder="Email"
            required
          >

          <button class="goldBtn">
            Kirim instruksi
          </button>

        </form>

      </div>

    </div>

  `;

}


/* =========================================================
   ONBOARDING
   ========================================================= */

function onboarding(){

  state.onStep=1;

  renderOnboarding();

}


function renderOnboarding(){

  let steps=[
    'Fokus',
    'Tentangmu',
    'Target'
  ];

  let body;

  if(state.onStep===1){

    body=`

      <div class="kicker">
        LANGKAH 1
      </div>

      <h2>
        Apa yang ingin kamu kembangkan?
      </h2>

      <p class="sub">
        Pilih yang paling dekat dengan perjalananmu.
        Kamu bisa memilih lebih dari satu.
      </p>

      <div class="choices">

        ${
          [
            'Karya',
            'Bisnis',
            'Karier',
            'Pendidikan',
            'Kehidupan',
            'Kreativitas'
          ]
          .map(x=>`

            <button
              class="choice ${
                state.selected.includes(x)
                ? 'selected'
                : ''
              }"
              onclick="pick('${x}')"
            >

              ${
                state.selected.includes(x)
                ? '✓ '
                : '○ '
              }

              ${x}

            </button>

          `)
          .join('')
        }

      </div>

    `;

  }else if(state.onStep===2){

    body=`

      <div class="kicker">
        LANGKAH 2
      </div>

      <h2>
        Ceritakan sedikit tentangmu.
      </h2>

      <p class="sub">
        Bagian ini opsional.
        Profil dapat kamu ubah nanti.
      </p>

      <textarea
        class="input"
        id="bio"
        rows="6"
        placeholder="Apa yang sedang kamu perjuangkan atau bangun?"
      ></textarea>

    `;

  }else{

    body=`

      <div class="kicker">
        LANGKAH 3
      </div>

      <h2>
        Apa target utamamu?
      </h2>

      <p class="sub">
        Kita mulai dari satu target
        yang benar-benar berarti.
      </p>

      <input
        class="input"
        id="firstGoal"
        placeholder="Contoh: menyelesaikan karya pertama saya"
      >

    `;

  }


  app.innerHTML=`

    <div class="onboard ea-bg-page">

      <div class="onboardBox">

        <div class="brandText">
          EA PLAN
        </div>

        <div class="steps">

          ${
            steps.map((_,i)=>`

              <i
                class="${
                  i+1<=state.onStep
                  ? 'active'
                  : ''
                }"
              ></i>

            `).join('')
          }

        </div>

        ${body}

        <div class="actions">

          ${
            state.onStep>1
            ?
            `
              <button
                class="ghostBtn"
                onclick="
                  state.onStep--;
                  renderOnboarding()
                "
              >
                Kembali
              </button>
            `
            :
            ''
          }

          <button
            class="goldBtn"
            onclick="nextOnboard()"
          >
            ${
              state.onStep<3
              ? 'Lanjut'
              : 'Masuk ke EA PLAN'
            }
          </button>

        </div>

      </div>

    </div>

  `;

}


function pick(x){

  state.selected=
    state.selected.includes(x)
    ?
    state.selected.filter(y=>y!==x)
    :
    [...state.selected,x];

  renderOnboarding();

}


function nextOnboard(){

  if(state.onStep<3){

    state.onStep++;

    renderOnboarding();

  }else{

    dashboard();

  }

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function dashboard(){

  state.active='home';

  renderApp();

}


function renderApp(){

  let n=
    nav.find(
      x=>x[0]===state.active
    )||nav[0];

  let content=
    state.active==='home'
    ? home()
    : modulePage(n[1],n[2]);


  app.innerHTML=`

    <div class="ea-bg-page">

      <div class="appShell">

        <aside class="side">

          <div class="sideBrand">

            <img
              src="${A}logoea.png"
            >

            <span>
              EA PLAN
            </span>

          </div>


          <nav class="nav">

            ${
              nav.map(x=>`

                <button
                  class="${
                    x[0]===state.active
                    ? 'active'
                    : ''
                  }"
                  onclick="go('${x[0]}')"
                >

                  ${x[1]}
                  &nbsp;&nbsp;
                  ${x[2]}

                </button>

              `).join('')
            }

          </nav>

        </aside>


        <main class="main">

          <header class="top">

            <div>

              <div class="kicker">
                RUANG PERJALANAN
              </div>

              <h2>
                ${n[2]}
              </h2>

            </div>


            <div class="avatar">

              ${
                (state.user?.name||'EA')
                .slice(0,2)
                .toUpperCase()
              }

            </div>

          </header>

          ${content}

        </main>


        <nav class="mobileNav">

          ${
            nav.slice(0,5).map(x=>`

              <button
                class="${
                  x[0]===state.active
                  ? 'active'
                  : ''
                }"
                onclick="go('${x[0]}')"
              >

                <b>
                  ${x[1]}
                </b>

                ${x[2]}

              </button>

            `).join('')
          }

        </nav>

      </div>

    </div>

  `;

}


/* =========================================================
   HOME
   ========================================================= */

function home(){

  return `

    <div class="grid">

      <article class="card wide">

        <div class="kicker">
          SELAMAT DATANG,
          ${
            (state.user?.name||'KREATOR')
            .toUpperCase()
          }
        </div>

        <h1
          style="
            font:500 42px Georgia,serif;
            margin:12px 0
          "
        >
          Rancang hidupmu.<br>
          Rawat perjalananmu.
        </h1>

        <p class="muted">
          “Setiap karya besar berawal dari
          satu langkah kecil yang terencana.”
        </p>

      </article>


      <article class="card">

        <div class="kicker">
          PROGRESS
        </div>

        <div class="metric">
          0%
        </div>

        <div class="progress">
          <i style="width:0"></i>
        </div>

        <span class="muted">
          Belum ada target terselesaikan.
        </span>

      </article>


      <article class="card">

        <div class="kicker">
          TARGET AKTIF
        </div>

        <div class="metric">
          0
        </div>

        <span class="muted">
          Mulai dari satu target utama.
        </span>

      </article>


      <article class="card">

        <div class="kicker">
          PROJECTS
        </div>

        <div class="metric">
          0
        </div>

        <span class="muted">
          Ruang karya akan tumbuh di sini.
        </span>

      </article>


      <article class="card">

        <div class="kicker">
          JOURNAL
        </div>

        <div class="metric">
          0
        </div>

        <span class="muted">
          Catatan perjalananmu.
        </span>

      </article>


      <article class="card full">

        <h3>
          Langkah hari ini
        </h3>

        <div class="item">
          ○ Tentukan satu prioritas utama
        </div>

        <div class="item">
          ○ Kerjakan tanpa menunggu semuanya sempurna
        </div>

        <div class="item">
          ○ Tulis satu hal yang kamu pelajari
        </div>

      </article>

    </div>

  `;

}


/* =========================================================
   MODULE PAGE
   ========================================================= */

function modulePage(a,b){

  return `

    <div class="grid">

      <article class="card full">

        <div class="kicker">
          EA PLAN
        </div>

        <h1
          style="
            font:500 40px Georgia,serif
          "
        >
          ${b}
        </h1>

        <p class="muted">

          ${
            a==='Planning'
            ? 'Susun langkah dengan sederhana.'
            : a==='Goals'
            ? 'Ubah mimpi menjadi target yang terukur.'
            : a==='Journal'
            ? 'Tulis apa yang terjadi, dirasakan, dan dipelajari.'
            : a==='Ideas'
            ? 'Tangkap ide sebelum hilang.'
            : a==='Projects'
            ? 'Pecah karya besar menjadi tahapan kecil.'
            : 'Lihat milestone dan pertumbuhanmu dari waktu ke waktu.'
          }

        </p>

        <div class="item">
          Modul ini sudah memiliki tempat di
          arsitektur production EA PLAN.
          CRUD + cloud database akan diaktifkan
          pada fase berikutnya.
        </div>

      </article>

    </div>

  `;

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function go(id){

  state.active=id;

  renderApp();

}


/* =========================================================
   START APP
   ========================================================= */

splash();
