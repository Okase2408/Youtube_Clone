
(function () {
  var USER_KEY = "yt_demo_user";
  var UPLOADS_KEY = "yt_demo_uploads";

  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); }
    catch (e) { return null; }
  }
  function setUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
  function clearUser() { localStorage.removeItem(USER_KEY); }

  function getUploads() {
    try { return JSON.parse(localStorage.getItem(UPLOADS_KEY)) || []; }
    catch (e) { return []; }
  }
  function addUpload(video) {
    var list = getUploads();
    list.unshift(video);
    localStorage.setItem(UPLOADS_KEY, JSON.stringify(list));
  }
  function getUploadById(id) {
    var list = getUploads();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  window.YTAuth = {
    getUser: getUser, setUser: setUser, clearUser: clearUser,
    getUploads: getUploads, addUpload: addUpload, getUploadById: getUploadById
  };

  document.addEventListener("DOMContentLoaded", function () {
    wireSearch();
    wireCreate();
    wireProfile();
    if (/your-videos\.html$/.test(location.pathname)) renderUploads();
  });

  function wireSearch() {
    var input = document.querySelector(".search-section input");
    var btn = document.querySelector(".search-button");
    if (!input) return;

    function go() {
      var q = input.value.trim();
      if (!q) return;
      window.location.href = "search.html?q=" + encodeURIComponent(q);
    }
    if (btn) btn.addEventListener("click", go);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") go();
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q) input.value = q;
  }

  function wireCreate() {
    var btn = document.querySelector(".create");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (getUser()) {
        window.location.href = "create.html";
      } else {
        window.location.href = "signin.html?next=create.html";
      }
    });
  }

  function wireProfile() {
    var btn = document.querySelector(".profile");
    if (!btn) return;
    var user = getUser();

    if (user) {
      btn.innerHTML = '<span class="avatar-badge">' +
        escapeHtml(user.name.charAt(0).toUpperCase()) + "</span>";
      btn.title = "Signed in as " + user.name;
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!getUser()) {
        window.location.href = "signin.html";
        return;
      }
      toggleAccountMenu(btn);
    });
  }

  function toggleAccountMenu(anchorBtn) {
    var existing = document.getElementById("account-menu");
    if (existing) { existing.remove(); return; }

    var user = getUser();
    var menu = document.createElement("div");
    menu.id = "account-menu";
    menu.className = "account-menu";
    menu.innerHTML =
      '<p class="account-menu-name">' + escapeHtml(user.name) + "</p>" +
      (user.email ? '<p class="account-menu-email">' + escapeHtml(user.email) + "</p>" : "") +
      "<hr>" +
      '<button type="button" class="account-menu-item account-menu-signout">Sign out</button>';
    document.body.appendChild(menu);

    var rect = anchorBtn.getBoundingClientRect();
    menu.style.top = (rect.bottom + 10) + "px";
    menu.style.right = (window.innerWidth - rect.right) + "px";

    menu.querySelector(".account-menu-signout").addEventListener("click", function () {
      clearUser();
      window.location.reload();
    });

    setTimeout(function () {
      document.addEventListener("click", function closeOnce(ev) {
        if (!menu.contains(ev.target)) {
          menu.remove();
          document.removeEventListener("click", closeOnce);
        }
      });
    }, 0);
  }

  function renderUploads() {
    var uploads = getUploads();
    if (!uploads.length) return;
    var grid = document.querySelector(".video-grid");
    if (!grid) return;

    uploads.forEach(function (v) {
      var art = document.createElement("article");
      art.className = "video-card";
      art.innerHTML =
        '<a href="watch.html?v=' + encodeURIComponent(v.id) + '">' +
        '<img src="' + v.thumb + '" alt="Video thumbnail">' +
        "</a>" +
        "<h3>" + escapeHtml(v.title) + "</h3>" +
        "<p>Your Channel</p>" +
        "<p>0 views \u2022 Just now</p>";
      grid.insertBefore(art, grid.firstChild);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
