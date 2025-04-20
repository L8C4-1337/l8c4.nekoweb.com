const playlist = [
      {
        title: "Dreamy - Etherane [Hello Charlotte]",
        url: "https://files.catbox.moe/5zytr0.mp3"
      },
      {
        title: "Gnossenie no 1 - Etherane [Hello Charlotte]",
        url: "https://files.catbox.moe/h29vub.mp3"
      },
      {
        title: "My First SlaveCard - Etherane [Hello Charlotte]",
        url: "https://files.catbox.moe/6ntlb3.mp3"
      },
      {
        title: "Death Music - Nikita Kryukov [Milk Outside a Bag of Milk Outside a Bag of Milk]",
        url: "https://files.catbox.moe/nt2m95.mp3"
      },
      {
        title: "Sleepy - Nikita Kryukov [Milk Outside a Bag of Milk Outside a Bag of Milk]",
        url: "https://files.catbox.moe/848y1t.mp3"
      },
      {
        title: "Choose - Nikita Kryukov [Milk Outside a Bag of Milk Outside a Bag of Milk]",
        url: "https://files.catbox.moe/eu4dyp.mp3"
      },
      {
        title: "Tired Of Life - Etherane [Tomorrow Won't Come For Those Without []]",
        url: "https://files.catbox.moe/s8u20y.mp3"
      },
      {
        title: "Song of the forgotten cities - motijan [q.u.q.]",
        url: "https://files.catbox.moe/9fr57u.mp3"
      },
      {
        title: "Corridors - motijan [q.u.q.]]",
        url: "https://files.catbox.moe/z0jgl9.mp3"
      },
      {
        title: "Barracks Settlement - Kikiyama [Yume Nikki]",
        url: "https://files.catbox.moe/hi1l1y.mp3"
      },
      {
        title: "Lake Corridor - Kikiyama [Yume Nikki]",
        url: "https://files.catbox.moe/n242st.mp3"
      }
    ];

    let currentIndex = Math.floor(Math.random() * 11);;
    const audio = document.getElementById("audio");
    const title = document.getElementById("song-title");
    const playPause = document.getElementById("play-pause");
    const next = document.getElementById("next");
    const prev = document.getElementById("prev");
    const progress = document.getElementById("progress");
    const progressFilled = document.getElementById("progress-filled");
    const currentTimeEl = document.getElementById("current-time");
    const durationEl = document.getElementById("duration");
    const volume = document.getElementById("volume");

    function loadSong(index) {
      const song = playlist[index];
      audio.src = song.url;
      title.textContent = song.title;
      audio.load();
    }

    function formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    function updateProgress() {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFilled.style.width = percent + "%";
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationEl.textContent = formatTime(audio.duration);
    }

    playPause.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        playPause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-icon lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>';
      } else {
        audio.pause();
        playPause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
      }
    });

    next.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % playlist.length;
      loadSong(currentIndex);
      audio.play();
      playPause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-icon lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>';
    });

    prev.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      loadSong(currentIndex);
      audio.play();
      playPause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
    });

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", () => {
      next.click();
    });

    progress.addEventListener("click", (e) => {
      const width = progress.clientWidth;
      const clickX = e.offsetX;
      const duration = audio.duration;
      audio.currentTime = (clickX / width) * duration;
    });
    // Initial setup
    loadSong(currentIndex);