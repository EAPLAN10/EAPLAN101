/* =====================================================
   EA PLAN
   SUPABASE AUTH + PROFILE
===================================================== */

const A = '/public/assets/';

const SUPABASE_URL =
  'https://tcmhqeuwiofzfmrikowh.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_Tp5NB8fPzFCzjfGCKoeScQ_nhMkcYFO';

const supabase =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth:{
        autoRefreshToken:true,
        persistSession:true,
        detectSessionInUrl:true
      }
    }
  );

const app =
  document.querySelector('#app');


/* =====================================================
   NAVIGATION
===================================================== */

const nav = [
  ['home','⌂','Beranda'],
  ['planning','☷','Planning'],
  ['goals','◎','Goals'],
  ['journal','✎','Journal'],
  ['ideas','✦','Ideas'],
  ['projects','□','Projects'],
  ['journey','↗','Journey']
];


/* =====================================================
   STATE
===================================================== */

let state = {
  user:null,
  profile:null,
  selected:[],
  onStep:1,
  active:'home'
};


/* =====================================================
   GLOBAL BACKGROUND
===================================================== */

(function injectBackgroundStyles(){

  const style =
    document.createElement('style');

  style.textContent = `

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

      background:
        rgba(0,0,0,.12);

      pointer-events:none;
    }

    .ea-bg-page .authBox,
    .ea-bg-page .onboardBox{
      background:
        rgba(20,16,12,.72);

      backdrop-filter:blur(5px);
      -webkit-backdrop-filter:blur(5px);

      border:
        1px solid
        rgba(255,255,255,.10);
    }

    .ea-bg-page .appShell{
      background:
        transparent !important;
    }

    .ea-bg-page .main{
      background:
        transparent !important;
    }

    .ea-bg-page .card{
      background:
        rgba(20,16,12,.70);

      backdrop-filter:blur(5px);
      -webkit-backdrop-filter:blur(5px);
    }

    .ea-bg-page .side,
    .ea-bg-page .top,
    .ea-bg-page .mobileNav{
      background:
        rgba(15,12,10,.76);

      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
    }

    .authVisual{
      background-image:
        url("${A}splash.jpg") !important;

      background-size:cover !important;
      background-position:center !important;
      background-repeat:no-repeat !important;
    }

    .authMessage{
      margin-top:16px;
      padding:12px 14px;
      border-radius:12px;
      background:rgba(205,164,107,.10);
      border:1px solid rgba(205,164,107,.25);
      color:#ead8bc;
      font-size:13px;
      line-height:1.5;
    }

    .loadingScreen{
      position:fixed;
      inset:0;
      background:#090806;
      color:#ead8bc;
      display:grid;
      place-items:center;
      z-index:10000;
      font-size:12px;
      letter-spacing:3px;
    }

  `;

  document.head.appendChild(style);

})();


/* =====================================================
   LOAD SESSION
===================================================== */

async function loadSession(){

  try{

    const {
      data,
      error
    } =
      await supabase.auth.getSession();

    if(error){
      console.error(error);
      state.user = null;
      state.profile = null;
      return;
    }

    state.user =
      data?.session?.user || null;

    if(state.user){

      await loadProfile(
        state.user.id
      );

    }

  }catch(error){

    console.error(
      'Session error:',
      error
    );

    state.user = null;
    state.profile = null;

  }

}


/* =====================================================
   LOAD PROFILE
===================================================== */

async function loadProfile(userId){

  const {
    data,
    error
  } =
    await supabase
      .from('profiles')
      .select('*')
      .eq('id',userId)
      .maybeSingle();

  if(error){

    console.error(
      'Profile error:',
      error
    );

    state.profile = null;

    return;

  }

  state.profile = data || null;

}


/* =====================================================
   SPLASH
===================================================== */

async function splash(){

  app.innerHTML = `

    <div class="splash">

      <img
        class="bg"
        src="${A}splash.jpg"
        alt=""
      >

      <div class="content">

        <img
          class="logo"
          src="${A}logoea.png"
          alt="EA PLAN"
        >

        <div class="tag">
          YOUR PERSONALIZED PLANNING JOURNEY
        </div>

      </div>

    </div>

  `;

  await loadSession();

  setTimeout(()=>{

    const splashScreen =
      document.querySelector('.splash');

    if(splashScreen){

      splashScreen.classList.add('hide');

      setTimeout(()=>{

        if(state.user){

          dashboard();

        }else{

          welcome();

        }

      },700);

    }else{

      if(state.user){

        dashboard();

      }else{

        welcome();

      }

    }

  },3000);

}


/* =====================================================
   WELCOME
===================================================== */

function welcome(){

  app.innerHTML = `

    <div class="authShell">

      <div class="authVisual">

        <img
          src="${A}splash.jpg"
          alt=""
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
            alt="EA PLAN"
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
            ruang privat dan publik EA PLAN
            yang akan dijelaskan saat akun dibuat.
          </p>

        </div>

      </div>

    </div>

  `;

}


/* =====================================================
   REGISTER
===================================================== */

function register(){

  auth('register');

}


/* =====================================================
   LOGIN
===================================================== */

function login(){

  auth('login');

}


/* =====================================================
   AUTH PAGE
===================================================== */

function auth(mode){

  const reg =
    mode === 'register';

  app.innerHTML = `

    <div
      class="authPanel ea-bg-page"
      style="min-height:100vh;color:white"
    >

      <div class="authBox">

        <img
          class="miniLogo"
          src="${A}logoea.png"
          alt="EA PLAN"
        >

        <div class="brandText">
          EA PLAN
        </div>

        <h2>

          ${
            reg
              ? 'Buat akun.'
              : 'Selamat datang kembali.'
          }

        </h2>

        <p class="sub">

          ${
            reg
              ? 'Buat ruang perjalanan pribadimu.'
              : 'Masuk untuk melanjutkan perjalananmu.'
          }

        </p>


        <form
          class="form"
          onsubmit="
            submitAuth(event,'${mode}')
          "
        >

          ${
            reg
              ? `

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
              : ''
          }


          <input
            class="input"
            id="email"
            type="email"
            placeholder="Email"
            autocomplete="email"
            required
          >


          <input
            class="input"
            id="password"
            type="password"
            placeholder="Password"
            minlength="6"
            autocomplete="${reg ? 'new-password' : 'current-password'}"
            required
          >


          <div
            id="err"
            class="error"
          ></div>


          <button
            class="goldBtn"
            id="authSubmit"
          >
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


/* =====================================================
   SUBMIT AUTH
===================================================== */

async function submitAuth(
  e,
  mode
){

  e.preventDefault();

  const button =
    document.querySelector('#authSubmit');

  const errorBox =
    document.querySelector('#err');

  if(button){

    button.disabled = true;
    button.textContent =
      mode === 'register'
        ? 'Membuat akun...'
        : 'Memeriksa...';

  }

  if(errorBox){

    errorBox.textContent = '';

  }


  const email =
    document
      .querySelector('#email')
      ?.value
      ?.trim()
      ?.toLowerCase();

  const password =
    document
      .querySelector('#password')
      ?.value;


  try{

    /* ==============================================
       REGISTER
    ============================================== */

    if(mode === 'register'){

      const name =
        document
          .querySelector('#name')
          ?.value
          ?.trim();

      const username =
        document
          .querySelector('#username')
          ?.value
          ?.trim()
          ?.toLowerCase();


      const {
        data,
        error
      } =
        await supabase.auth.signUp({

          email,
          password,

          options:{
            data:{
              name,
              username
            }
          }

        });


      if(error){

        throw error;

      }


      /*
        Jika email confirmation aktif,
        session biasanya belum tersedia.
      */

      if(!data.session){

        app.innerHTML = `

          <div
            class="authPanel ea-bg-page"
            style="min-height:100vh;color:white"
          >

            <div class="authBox">

              <img
                class="miniLogo"
                src="${A}logoea.png"
                alt="EA PLAN"
              >

              <div class="brandText">
                EA PLAN
              </div>

              <h2>
                Periksa emailmu.
              </h2>

              <p class="sub">
                Akun EA PLAN sudah dibuat.
                Silakan buka email konfirmasi
                dari Supabase, lalu kembali ke
                EA PLAN untuk masuk.
              </p>

              <div class="authMessage">

                Email:
                <strong>
                  ${escapeHtml(email)}
                </strong>

              </div>

              <div class="form">

                <button
                  class="goldBtn"
                  onclick="login()"
                >
                  Saya sudah konfirmasi
                </button>

                <button
                  class="ghostBtn"
                  onclick="welcome()"
                >
                  Kembali
                </button>

              </div>

            </div>

          </div>

        `;

        return;

      }


      state.user =
        data.user;

      await loadProfile(
        data.user.id
      );

      onboarding();

      return;

    }


    /* ==============================================
       LOGIN
    ============================================== */

    const {
      data,
      error
    } =
      await supabase.auth.signInWithPassword({

        email,
        password

      });


    if(error){

      throw error;

    }


    state.user =
      data.user;

    await loadProfile(
      data.user.id
    );


    dashboard();


  }catch(error){

    console.error(
      'Auth error:',
      error
    );

    if(errorBox){

      errorBox.textContent =
        readableAuthError(
          error
        );

    }

    if(button){

      button.disabled = false;

      button.textContent =
        mode === 'register'
          ? 'Buat Akun'
          : 'Masuk';

    }

  }

}


/* =====================================================
   AUTH ERROR
===================================================== */

function readableAuthError(error){

  const message =
    error?.message || '';

  if(
    message
      .toLowerCase()
      .includes('invalid login credentials')
  ){

    return 'Email atau password salah.';

  }

  if(
    message
      .toLowerCase()
      .includes('email not confirmed')
  ){

    return 'Email belum dikonfirmasi. Silakan cek emailmu terlebih dahulu.';

  }

  if(
    message
      .toLowerCase()
      .includes('password')
  ){

    return message;

  }

  if(
    message
      .toLowerCase()
      .includes('already registered')
  ){

    return 'Email tersebut sudah terdaftar. Silakan masuk.';

  }

  return message ||
    'Terjadi kesalahan. Silakan coba lagi.';

}


/* =====================================================
   FORGOT PASSWORD
===================================================== */

async function forgot(){

  app.innerHTML = `

    <div
      class="authPanel ea-bg-page"
      style="min-height:100vh;color:white"
    >

      <div class="authBox">

        <img
          class="miniLogo"
          src="${A}logoea.png"
          alt="EA PLAN"
        >

        <div class="brandText">
          EA PLAN
        </div>

        <h2>
          Reset password.
        </h2>

        <p class="sub">
          Masukkan email untuk menerima
          instruksi pemulihan akun.
        </p>

        <form
          class="form"
          onsubmit="sendReset(event)"
        >

          <input
            class="input"
            id="resetEmail"
            type="email"
            placeholder="Email"
            required
          >

          <div
            id="resetErr"
            class="error"
          ></div>

          <button
            class="goldBtn"
          >
            Kirim instruksi
          </button>

        </form>

        <div class="switch">

          <button
            class="link"
            onclick="login()"
          >
            ← Kembali ke login
          </button>

        </div>

      </div>

    </div>

  `;

}


/* =====================================================
   SEND RESET
===================================================== */

async function sendReset(e){

  e.preventDefault();

  const email =
    document
      .querySelector('#resetEmail')
      ?.value
      ?.trim()
      ?.toLowerCase();

  const resetErr =
    document.querySelector('#resetErr');


  const {
    error
  } =
    await supabase.auth
      .resetPasswordForEmail(
        email,
        {
          redirectTo:
            window.location.origin
        }
      );


  if(error){

    if(resetErr){

      resetErr.textContent =
        error.message;

    }

    return;

  }


  app.innerHTML = `

    <div
      class="authPanel ea-bg-page"
      style="min-height:100vh;color:white"
    >

      <div class="authBox">

        <img
          class="miniLogo"
          src="${A}logoea.png"
          alt="EA PLAN"
        >

        <div class="brandText">
          EA PLAN
        </div>

        <h2>
          Instruksi dikirim.
        </h2>

        <p class="sub">
          Jika email tersebut terdaftar,
          Supabase akan mengirim instruksi
          pemulihan password.
        </p>

        <button
          class="goldBtn"
          onclick="login()"
        >
          Kembali ke Login
        </button>

      </div>

    </div>

  `;

}


/* =====================================================
   ONBOARDING
===================================================== */

function onboarding(){

  state.onStep = 1;

  renderOnboarding();

}


/* =====================================================
   RENDER ONBOARDING
===================================================== */

function renderOnboarding(){

  const steps = [
    'Fokus',
    'Tentangmu',
    'Target'
  ];

  let body;


  if(state.onStep === 1){

    body = `

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
              class="
                choice
                ${
                  state.selected.includes(x)
                    ? 'selected'
                    : ''
                }
              "
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

  }


  else if(state.onStep === 2){

    body = `

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

  }


  else{

    body = `

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


  app.innerHTML = `

    <div class="onboard ea-bg-page">

      <div class="onboardBox">

        <div class="brandText">
          EA PLAN
        </div>

        <div class="steps">

          ${
            steps
              .map((_,i)=>`

                <i
                  class="${
                    i + 1 <= state.onStep
                      ? 'active'
                      : ''
                  }"
                ></i>

              `)
              .join('')
          }

        </div>

        ${body}


        <div class="actions">

          ${
            state.onStep > 1
              ? `

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
              : ''
          }


          <button
            class="goldBtn"
            onclick="nextOnboard()"
          >

            ${
              state.onStep < 3
                ? 'Lanjut'
                : 'Masuk ke EA PLAN'
            }

          </button>

        </div>

      </div>

    </div>

  `;

}


/* =====================================================
   SELECT ONBOARDING
===================================================== */

function pick(x){

  state.selected =
    state.selected.includes(x)

      ? state.selected.filter(
          y => y !== x
        )

      : [
          ...state.selected,
          x
        ];

  renderOnboarding();

}


/* =====================================================
   NEXT ONBOARDING
===================================================== */

async function nextOnboard(){

  if(state.onStep < 3){

    state.onStep++;

    renderOnboarding();

    return;

  }

  dashboard();

}


/* =====================================================
   DASHBOARD
===================================================== */

function dashboard(){

  state.active = 'home';

  renderApp();

}


/* =====================================================
   RENDER APP
===================================================== */

function renderApp(){

  const n =
    nav.find(
      x => x[0] === state.active
    ) || nav[0];


  const content =
    state.active === 'home'
      ? home()
      : modulePage(
          n[1],
          n[2]
        );


  const displayName =
    state.profile?.name ||
    state.user?.user_metadata?.name ||
    state.user?.email?.split('@')[0] ||
    'KREATOR';


  app.innerHTML = `

    <div class="ea-bg-page">

      <div class="appShell">


        <aside class="side">

          <div class="sideBrand">

            <img
              src="${A}logoea.png"
              alt="EA PLAN"
            >

            <span>
              EA PLAN
            </span>

          </div>


          <nav class="nav">

            ${
              nav
                .map(x=>`

                  <button
                    class="${
                      x[0] === state.active
                        ? 'active'
                        : ''
                    }"
                    onclick="go('${x[0]}')"
                  >

                    ${x[1]}

                    &nbsp;&nbsp;

                    ${x[2]}

                  </button>

                `)
                .join('')
            }

          </nav>


          <button
            class="ghostBtn"
            style="
              width:100%;
              margin-top:24px;
            "
            onclick="logout()"
          >
            Keluar
          </button>

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


            <div
              class="avatar"
              title="${escapeHtml(displayName)}"
            >

              ${
                displayName
                  .slice(0,2)
                  .toUpperCase()
              }

            </div>

          </header>


          ${content}


        </main>


        <nav class="mobileNav">

          ${
            nav
              .slice(0,5)
              .map(x=>`

                <button
                  class="${
                    x[0] === state.active
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

              `)
              .join('')
          }


          <button
            onclick="logout()"
          >

            <b>
              ↪
            </b>

            Keluar

          </button>

        </nav>

      </div>

    </div>

  `;

}


/* =====================================================
   HOME
===================================================== */

function home(){

  const name =
    state.profile?.name ||
    state.user?.user_metadata?.name ||
    'KREATOR';


  return `

    <div class="grid">


      <article class="card wide">

        <div class="kicker">

          SELAMAT DATANG,
          ${escapeHtml(
            name.toUpperCase()
          )}

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

          “Setiap karya besar berawal dari satu
          langkah kecil yang terencana.”

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


      <article class="card full">

        <div class="kicker">
          AKUN
        </div>

        <p class="muted">

          ${escapeHtml(
            state.user?.email || ''
          )}

        </p>

        <button
          class="ghostBtn"
          onclick="logout()"
        >
          Keluar dari EA PLAN
        </button>

      </article>


    </div>

  `;

}


/* =====================================================
   MODULE PAGE
===================================================== */

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
            a === 'Planning'
              ? 'Susun langkah dengan sederhana.'

              : a === 'Goals'
                ? 'Ubah mimpi menjadi target yang terukur.'

                : a === 'Journal'
                  ? 'Tulis apa yang terjadi, dirasakan, dan dipelajari.'

                  : a === 'Ideas'
                    ? 'Tangkap ide sebelum hilang.'

                    : a === 'Projects'
                      ? 'Pecah karya besar menjadi tahapan kecil.'

                      : 'Lihat milestone dan pertumbuhanmu dari waktu ke waktu.'
          }

        </p>


        <div class="item">

          Modul ini sudah memiliki tempat
          di arsitektur EA PLAN.

          <br><br>

          CRUD + cloud database akan diaktifkan
          pada fase berikutnya.

        </div>

      </article>

    </div>

  `;

}


/* =====================================================
   NAVIGATION
===================================================== */

function go(id){

  state.active = id;

  renderApp();

}


/* =====================================================
   LOGOUT
===================================================== */

async function logout(){

  const {
    error
  } =
    await supabase.auth.signOut();

  if(error){

    console.error(
      'Logout error:',
      error
    );

    return;

  }

  state.user = null;
  state.profile = null;
  state.selected = [];

  welcome();

}


/* =====================================================
   AUTH STATE LISTENER
===================================================== */

supabase.auth.onAuthStateChange(
  async (event,session)=>{

    console.log(
      'Auth event:',
      event
    );

    if(session?.user){

      state.user =
        session.user;

      /*
        Jangan langsung mengganti
        halaman ketika user sedang
        berada di onboarding.
      */

      if(
        event === 'SIGNED_IN' &&
        !state.profile
      ){

        await loadProfile(
          session.user.id
        );

      }

    }

  }
);


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHtml(value){

  return String(value ?? '')
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );

}


/* =====================================================
   START
===================================================== */

splash();
