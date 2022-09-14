const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "KONJLUU_PLAYER";

const player = $(".container");
const cd = $(".cd");
const heading = $(".dashboard__header h2");
const cdThumb = $(".img-music__thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "./assets/music/AnNutNhoThaGiacMo-SonTungMTP-4009508.mp3",
      image: "./assets/img/ab67616d0000b273d7004b0da78a8aefa965ca55.jpeg"
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./assets/music/ChungTaCuaHienTaiThienHiXHighFrequencyRemix-SonTungMTP-6893159.mp3",
      image: "./assets/img/d829f284d1ff3b75589941aaa1f69a4d.1000x1000x1.jpg"
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "./assets/music/ChungTaKhongThuocVeNhau-SonTungMTP-4528181.mp3",
      image: "./assets/img/folklore_hagr.jpeg"
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "./assets/music/ConMuaNgangQua-SonTungMTP-2944936.mp3",
      image: "./assets/img/Lover-Taylor.jpeg"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "./assets/music/KhongPhaiDangVuaDau-SonTungMTP-3753840.mp3",
      image: "./assets/img/Taylor_Swift_-_Folklore.png"
    },
    {
      name: "Damn",
      singer: "Raftaar x kr$na",
      path: "./assets/music/LacTroiDEYERemix-SonTungMTP-4727777.mp3",
      image: "./assets/img/Taylor_Swift_-_Red_(Taylor's_Version).png"
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "./assets/music/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3",
      image: "./assets/img/Taylor_Swift_-_Reputation.png"
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "./assets/music/TienLenVietNamOi-SonTungMTP-4003040.mp3",
      image: "./assets/img/Taylor_Swift_-_Speak_Now_World_Tour_-_Live.png"
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "./assets/music/TienLenVietNamOi-SonTungMTP-4003040.mp3",
      image: "./assets/img/Taylor_Swift_-_Taylor_Swift.png"
    }
  ],

  setConfig: function (key,value) {
    this.config[key] =value;
    localStorage.setItem(PlAYER_STORAGE_KEY,JSON.stringify(this.config));
  },

  render: function () {
    const htmls = this.songs.map((song, index)=> {
      return `
                <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                    <div class="thumb"
                                style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
              `;
    })
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },

  // Xu ly su kien
  handleEvents: function () {
    const cdWidth = cd.offsetWidth;

    //xử lý rotate
    const cdThumbAnimate = cdThumb.animate([
      {
        transform: 'rotate(360deg)'
      }
    ], {
      duration: 10000,
      interation: Infinity
    });
    cdThumbAnimate.pause();


    // xử lý phòng to thu nhỏ
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    }

    //xử lý khi clickPlay
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
    //khi song duoc play
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    }
    //khi song bi pause
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    }

    //Khi tiến độ song thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      }
    }

    //xu ly khi tua 
    progress.onchange = function (e) {
      const seekTime = audio.duration / 100 * e.target.value;
      audio.currentTime = seekTime;
    }

    //next song
    nextBtn.onclick = function(){
      if(app.isRandom){
        app.playRandomSong();
      }else{
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    }

    //prev song
    prevBtn.onclick = function(){
      if(app.isRandom){
        app.playRandomSong()
      }else{
        app.prevSong();
      }
      audio.play();
      app.render();
      app.scrollToActiveSong();
    }

    //xu ly bật/tắt random song
    randomBtn.onclick =function(){
      app.isRandom= !app.isRandom;
      app.setConfig('isRandom',app.isRandom)
      randomBtn.classList.toggle("active",app.isRandom);
    }

    // xu ly repeat song
    repeatBtn.onclick =function(e){
      app.isRepeat= !app.isRepeat;
      app.setConfig('isRepeat',app.isRepeat)
      repeatBtn.classList.toggle("active",app.isRepeat);
    }
    //xử lý audio ended 
    audio.onended= function(){
      if(app.isRepeat){
        audio.play();
      }else{
        nextBtn.click();
      }
    }

    //xử lý when click playlist
    playlist.onclick =function (e){
      const songNode=e.target.closest('.song:not(.active)');
      if(songNode || e.target.closest('.option')){
        //xử lý when click song
        if(songNode){
          // this.currentIndex= songNode.dataset.index;
          app.currentIndex= Number(songNode.getAttribute("data-index"));
          app.loadCurrentSong();
          app.render();
          audio.play();
        }
      }
    } 
  },

  scrollToActiveSong: function () {
    setTimeout(()=>{
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      })
    },500);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;

  },

  loadConfig: function () {
    this.isRandom= this.config.isRandom;
    this.isRepeat= this.config.isRepeat;

    // assign() => de gan.
    // Object.assign(this, this.config)
  },

  nextSong: function () {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if(this.currentIndex < 0 ){
      this.currentIndex = this.songs.length -1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do{
      newIndex= Math.floor(Math.random()* this.songs.length);
    }while(newIndex === this.currentIndex);

    this.currentIndex=newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    this.loadConfig();
    this.handleEvents();

    //dinh nghia cac thuoc tinh cho Object.
    this.defineProperties();
    this.loadCurrentSong();

    this.render();

    //Hien thi trang thai ban dau
    randomBtn.classList.toggle("active",app.isRandom);
    repeatBtn.classList.toggle("active",app.isRepeat);
  },


}

app.start();

