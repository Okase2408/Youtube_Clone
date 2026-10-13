(function () {
  var USER_KEY = "yt_demo_user", UPLOADS_KEY = "yt_demo_uploads";

  function getUser() { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch (e) { return null; } }
  function setUser(u) { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
  function clearUser() { localStorage.removeItem(USER_KEY); }
  function getUploads() { try { return JSON.parse(localStorage.getItem(UPLOADS_KEY)) || []; } catch (e) { return []; } }
  function addUpload(v) { var l = getUploads(); l.unshift(v); localStorage.setItem(UPLOADS_KEY, JSON.stringify(l)); }
  function getUploadById(id) { return getUploads().filter(function (v) { return v.id === id; })[0] || null; }

  window.YTAuth = { getUser: getUser, setUser: setUser, clearUser: clearUser, getUploads: getUploads, addUpload: addUpload, getUploadById: getUploadById };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return h >>> 0; }
  function get(id) { return (typeof VIDEOS !== "undefined" && VIDEOS[id]) || getUploadById(id); }

  // ---------- unique generated thumbnails (one look per video) ----------
  function wrap(text, max, lines) {
    var words = text.replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu, "").trim().split(/\s+/), out = [], cur = "";
    words.forEach(function (w) {
      if ((cur + " " + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim();
    });
    if (cur) out.push(cur);
    if (out.length > lines) { out = out.slice(0, lines); out[lines - 1] = out[lines - 1].replace(/.{0,2}$/, "") + "…"; }
    return out;
  }
  function thumbSrc(id, v, tall) {
    if (v.thumb) return v.thumb;
    var h = hash(id), a = h % 360, b = (a + 35 + (h >> 4) % 70) % 360;
    var W = tall ? 360 : 640, H = tall ? 640 : 360, lines = wrap(v.title, tall ? 11 : 15, tall ? 5 : 4), fs = tall ? 46 : (lines.length > 3 ? 42 : 50);
    var shape = (h >> 7) % 3, sx = W * (0.55 + ((h >> 9) % 30) / 100), sy = H * (0.2 + ((h >> 11) % 40) / 100), r = Math.min(W, H) * (0.45 + ((h >> 13) % 25) / 100);
    var deco = shape === 0 ? '<circle cx="' + sx + '" cy="' + sy + '" r="' + r + '" fill="hsl(' + b + ',90%,60%)" opacity=".28"/>'
      : shape === 1 ? '<rect x="' + (sx - r) + '" y="' + (sy - r) + '" width="' + r * 1.6 + '" height="' + r * 1.6 + '" rx="28" transform="rotate(' + (h % 40 - 20) + ' ' + sx + ' ' + sy + ')" fill="hsl(' + b + ',90%,62%)" opacity=".26"/>'
      : '<polygon points="' + sx + ',' + (sy - r) + ' ' + (sx + r) + ',' + (sy + r * .8) + ' ' + (sx - r) + ',' + (sy + r * .8) + '" fill="hsl(' + b + ',90%,62%)" opacity=".26"/>';
    var y0 = (H - lines.length * fs * 1.12) / 2 + fs * .85;
    var txt = lines.map(function (l, i) { return '<text x="' + W * .07 + '" y="' + (y0 + i * fs * 1.12) + '" font-size="' + fs + '" font-weight="900" fill="#fff" font-family="Roboto,Arial,sans-serif" style="paint-order:stroke" stroke="rgba(0,0,0,.35)" stroke-width="6">' + esc(l) + '</text>'; }).join("");
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(' + a + ',75%,42%)"/><stop offset="1" stop-color="hsl(' + b + ',80%,20%)"/></linearGradient></defs><rect width="' + W + '" height="' + H + '" fill="url(#g)"/>' + deco + txt + '</svg>';
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }
  function duration(id) { var h = hash(id + "d"); return (3 + h % 16) + ":" + ("0" + (h >> 5) % 60).slice(-2); }
  function avatarColor(name) { return "hsl(" + hash(name) % 360 + ",45%,38%)"; }
  function avatar(v, cls) { return '<span class="' + (cls || "avatar") + '" style="background:' + avatarColor(v.channel) + '">' + esc(v.initial || v.channel.charAt(0)) + "</span>"; }
  var dots = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>';
  var link = function (id) { return "watch.html?v=" + encodeURIComponent(id); };

 function card(id) {
    var v = get(id);

    if (!v) {
        return "";
    }

    var videoLink = link(id);
    var thumbnail = thumbSrc(id, v);
    var videoDuration = duration(id);
    var channelAvatar = avatar(v);

    return `
        <article class="video-card" data-id="${id}">

            <a class="thumb" href="${videoLink}">
                <img src="${thumbnail}" alt="${esc(v.title)}">
                <span class="dur">${videoDuration}</span>
            </a>

            <div class="video-info">
                ${channelAvatar}

                <div class="meta">
                    <h3>
                        <a href="${videoLink}" title="${esc(v.title)}">
                            ${esc(v.title)}
                        </a>
                    </h3>

                    <p class="ch">${esc(v.channel)}</p>

                    <p>${esc(v.views)} • ${esc(v.uploaded)}</p>
                </div>

                <button class="more" aria-label="More actions">
                    ${dots}
                </button>
            </div>

        </article>
    `;
}
  function short(id) {
    var v = get(id);

    if (!v) {
        return "";
    }

    var videoLink = link(id);
    var thumbnail = thumbSrc(id, v, true);

    return `
        <article class="short-card">
            <a class="thumb" href="${videoLink}">
                <img loading="lazy" src="${thumbnail}" alt="${esc(v.title)}">
            </a>

            <h3>${esc(v.title)}</h3>
            <p>${esc(v.views)}</p>
        </article>
    `;
}
 
function row(id, opts) {
    var v = get(id);

    if (!v) {
        return "";
    }

    opts = opts || {};

    var videoLink = link(id);
    var thumbnail = thumbSrc(id, v);
    var videoDuration = duration(id);

    var videoDetails = "";

    if (opts.small) {
        videoDetails = `
            <p>${esc(v.channel)}</p>
            <p>${esc(v.views)} • ${esc(v.uploaded)}</p>
        `;
    } else {
        var uploadDate = opts.watched
            ? esc(opts.watched)
            : esc(v.uploaded);

        videoDetails = `
            <p>${esc(v.views)} • ${uploadDate}</p>

            <div class="by">
                ${avatar(v)}
                ${esc(v.channel)}
            </div>

            ${opts.desc
                ? `<p class="desc">${esc(v.description)}</p>`
                : ""}
        `;
    }

    return `
        <article class="row-card${opts.small ? " small" : ""}">
            <a class="thumb" href="${videoLink}">
                <img
                    loading="lazy"
                    src="${thumbnail}"
                    alt="${esc(v.title)}"
                >
                <span class="dur">${videoDuration}</span>
            </a>

            <div class="meta">
                <h3>
                    <a href="${videoLink}">
                        ${esc(v.title)}
                    </a>
                </h3>

                ${videoDetails}
            </div>

            <button class="more" aria-label="More actions">
                ${dots}
            </button>
        </article>
    `;
}

  window.YT = { get: get, card: card, short: short, row: row, thumbSrc: thumbSrc, avatar: avatar, esc: esc, hash: hash };

 
function renderLists() {
    var sections = document.querySelectorAll("[data-render]");

    sections.forEach(function (section) {
        var ids = (section.getAttribute("data-ids") || "")
            .split(",")
            .filter(Boolean);

        var type = section.getAttribute("data-render");

        var watchedTimes = [
            "10 minutes ago",
            "1 hour ago",
            "3 hours ago",
            "yesterday",
            "yesterday",
            "2 days ago"
        ];

        var html = ids.map(function (id, index) {
            if (type === "shorts") {
                return short(id);
            }

            if (type === "rows") {
                return row(id, {
                    watched: "Watched " + watchedTimes[index % 6]
                });
            }

            return card(id);
        }).join("");

        if (html) {
            section.innerHTML = html;
        } else {
            section.innerHTML = `
                <p class="empty">
                    <b>Nothing here yet</b>
                    Videos you add will show up on this page.
                </p>
            `;
        }
    });
}

  document.addEventListener("DOMContentLoaded", function () {
    renderLists(); wireSearch(); wireCreate(); wireProfile(); wireMenu(); wireChips(); wireWelcome(); wireWatch();
    if (/your-videos\.html$/.test(location.pathname)) renderUploads();
  });

  function wireMenu() {
    var b = document.querySelector(".menu-button"); if (!b) return;
    var scrim = document.createElement("div"); scrim.className = "scrim"; document.body.appendChild(scrim);
    scrim.addEventListener("click", function () { document.body.classList.remove("drawer"); });
    b.setAttribute("aria-label", "Menu");
    b.addEventListener("click", function () {
      if (window.innerWidth <= 800) document.body.classList.toggle("drawer");
      else { document.body.classList.toggle("mini"); document.body.classList.toggle("mini-off"); }
    });
  }

  
function wireSearch() {
    var input = document.querySelector(".search-section input");
    var button = document.querySelector(".search-button");

    if (!input) {
        return;
    }

    function searchVideos() {
        var query = input.value.trim();

        if (query) {
            window.location.href =
                "search.html?q=" + encodeURIComponent(query);
        }
    }

    if (button) {
        button.addEventListener("click", searchVideos);
        button.setAttribute("aria-label", "Search");
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchVideos();
        }
    });

    var searchQuery = new URLSearchParams(location.search).get("q");

    if (searchQuery) {
        input.value = searchQuery;
    }
}

  function wireCreate() {
    var btn = document.querySelector(".create"); if (!btn) return;
    btn.addEventListener("click", function () { location.href = getUser() ? "create.html" : "signin.html?next=create.html"; });
  }

  function wireProfile() {
    var btn = document.querySelector(".profile"); if (!btn) return;
    var user = getUser(); btn.setAttribute("aria-label", "Account");
    if (user) { btn.innerHTML = '<span class="avatar-badge">' + esc(user.name.charAt(0).toUpperCase()) + "</span>"; btn.title = "Signed in as " + user.name; }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!getUser()) { location.href = "signin.html"; return; }
      toggleAccountMenu(btn);
    });
  }

  function toggleAccountMenu(anchor) {
    var ex = document.getElementById("account-menu"); if (ex) { ex.remove(); return; }
    var user = getUser(), menu = document.createElement("div");
    menu.id = "account-menu"; menu.className = "account-menu";
    menu.innerHTML = '<p class="account-menu-name">' + esc(user.name) + "</p>" + (user.email ? '<p class="account-menu-email">' + esc(user.email) + "</p>" : "") +
      '<hr><a class="account-menu-item" href="channel.html">Your channel</a><a class="account-menu-item" href="your-videos.html">Your videos</a><hr><button type="button" class="account-menu-item account-menu-signout">Sign out</button>';
    document.body.appendChild(menu);
    var r = anchor.getBoundingClientRect(); menu.style.top = (r.bottom + 8) + "px"; menu.style.right = (window.innerWidth - r.right) + "px";
    menu.querySelector(".account-menu-signout").addEventListener("click", function () { clearUser(); location.href = "index.html"; });
    setTimeout(function () { document.addEventListener("click", function once(ev) { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener("click", once); } }); }, 0);
  }

  function wireWelcome() {
    var el = document.getElementById("welcome"); if (!el) return;
    var u = getUser();
    el.innerHTML = u
      ? '<div><h2>Welcome back, ' + esc(u.name) + '</h2><p>Fresh videos from your subscriptions and picks for today.</p></div><a class="btn-blue" href="subscriptions.html">Open subscriptions</a>'
      : '<div><h2>Welcome to YouTube</h2><p>Sign in to like videos, subscribe to channels and upload your own.</p></div><a class="btn-blue" href="signin.html">Sign in</a>';
  }

  var CATS = { Technology: ["v07", "v08", "v11", "v44"], Education: ["v09", "v12", "v15", "v16"], Lifestyle: ["v10", "v13", "v14", "v01", "v03", "v06", "v04"] };
  function wireChips() {
    var chips = document.querySelectorAll(".chip[data-cat]"); if (!chips.length) return;
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (x) { x.classList.remove("active"); }); c.classList.add("active");
        var cat = c.getAttribute("data-cat"), shown = 0;
        document.querySelectorAll(".video-card").forEach(function (card) {
          var ok = cat === "All" || (CATS[cat] || []).indexOf(card.getAttribute("data-id")) !== -1;
          card.style.display = ok ? "" : "none"; if (ok) shown++;
        });
        var sh = document.querySelector(".shorts-block"); if (sh) sh.style.display = cat === "All" ? "" : "none";
        var em = document.getElementById("cat-empty"); if (em) em.style.display = shown ? "none" : "";
      });
    });
  }

  function wireWatch() {
    var layout = document.querySelector(".watch-layout"); if (!layout) return;
    var id = new URLSearchParams(location.search).get("v"), v = get(id);
    if (!v) { id = DEFAULT_VIDEO_ID; v = get(id); }
    document.title = v.title + " - YouTube";
    document.getElementById("video-frame").src = "https://www.youtube.com/embed/" + v.yt + "?rel=0";
    document.getElementById("video-title").textContent = v.title;
    var ca = document.getElementById("channel-avatar"); ca.textContent = v.initial || v.channel.charAt(0); ca.style.background = avatarColor(v.channel);
    document.getElementById("channel-name").textContent = v.channel;
    document.getElementById("channel-subs").textContent = v.subs;
    document.getElementById("video-description").innerHTML = "<b>" + esc(v.views) + "  " + esc(v.uploaded) + "</b><br>" + esc(v.description);
    document.querySelectorAll("[data-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var on = b.classList.toggle("on"), t = b.getAttribute("data-toggle");
        if (t === "sub") b.textContent = on ? "Subscribed" : "Subscribe";
        if (t === "like") { var o = document.querySelector('[data-toggle="dislike"]'); if (on && o) o.classList.remove("on"); }
        if (t === "dislike") { var l = document.querySelector('[data-toggle="like"]'); if (on && l) l.classList.remove("on"); }
      });
    });
    var ids = Object.keys(VIDEOS).filter(function (k) { return k !== id && k.charAt(0) === "v" && +k.slice(1) <= 40; })
      .sort(function (a, b) { return hash(a + id) - hash(b + id); }).slice(0, 12);
    document.getElementById("up-next").innerHTML = ids.map(function (k) { return row(k, { small: true }); }).join("");
    var form = document.getElementById("comment-form"), list = document.getElementById("comment-list"), u = getUser();
    document.getElementById("comment-me").textContent = u ? u.name.charAt(0).toUpperCase() : "?";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = form.querySelector("input"), t = inp.value.trim(); if (!t) return;
      if (!getUser()) { location.href = "signin.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search); return; }
      var d = document.createElement("div"); d.className = "comment";
      d.innerHTML = '<span class="comment-image" style="background:#8e24aa">' + esc(getUser().name.charAt(0).toUpperCase()) + '</span><div><h4>' + esc(getUser().name) + '<span>just now</span></h4><p>' + esc(t) + "</p></div>";
      list.insertBefore(d, list.firstChild); inp.value = "";
    });
  }

  function renderUploads() {
    var grid = document.querySelector(".video-grid"); if (!grid) return;
    var html = getUploads().map(function (v) { return card(v.id); }).join("");
    if (html) grid.insertAdjacentHTML("afterbegin", html);
  }
})();
