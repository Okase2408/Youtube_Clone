
(function () {
    var USER_KEY = "yt_demo_user";
    var UPLOADS_KEY = "yt_demo_uploads";

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY));
        } catch (e) {
            return null;
        }
    }

    function setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    function clearUser() {
        localStorage.removeItem(USER_KEY);
    }

    function getUploads() {
        try {
            return JSON.parse(localStorage.getItem(UPLOADS_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function addUpload(video) {
        var uploads = getUploads();
        uploads.unshift(video);
        localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads));
    }

    function getUploadById(id) {
        var uploads = getUploads();

        return uploads.find(function (video) {
            return video.id === id;
        }) || null;
    }

    window.YTAuth = {
        getUser: getUser,
        setUser: setUser,
        clearUser: clearUser,
        getUploads: getUploads,
        addUpload: addUpload,
        getUploadById: getUploadById
    };

    function esc(text) {
        return String(text).replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character];
        });
    }

    function hash(text) {
        var result = 2166136261;

        for (var i = 0; i < text.length; i++) {
            result ^= text.charCodeAt(i);
            result = Math.imul(result, 16777619);
        }

        result ^= result >>> 16;
        result = Math.imul(result, 2246822507);
        result ^= result >>> 13;
        result = Math.imul(result, 3266489909);
        result ^= result >>> 16;

        return result >>> 0;
    }

    function get(id) {
        var video = null;

        if (typeof VIDEOS !== "undefined") {
            video = VIDEOS[id];
        }

        return video || getUploadById(id);
    }

    function thumbSrc(id, video, tall) {
        if (video.thumb) {
            return video.thumb;
        }

        if (video.yt) {
            return "https://i.ytimg.com/vi/" + encodeURIComponent(video.yt) + "/hqdefault.jpg";
        }

        var width = tall ? 360 : 640;
        var height = tall ? 640 : 360;
        var title = encodeURIComponent(video.title || "Video");

        return "https://placehold.co/" + width + "x" + height + "?text=" + title;
    }

    function duration(id) {
        var number = hash(id + "d");

        var minutes = 3 + number % 16;
        var seconds = (number >>> 5) % 60;

        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    function avatarColor(name) {
        return "hsl(" + hash(name) % 360 + ",45%,38%)";
    }

    function avatar(video, className) {
        var name = video.channel || "User";
        var initial = video.initial || name.charAt(0);

        return '<span class="' + (className || "avatar") +
            '" style="background:' + avatarColor(name) + '">' +
            esc(initial) + "</span>";
    }

    var dots = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor">' +
        '<circle cx="12" cy="5" r="1.8"/>' +
        '<circle cx="12" cy="12" r="1.8"/>' +
        '<circle cx="12" cy="19" r="1.8"/>' +
        "</svg>";

    function link(id) {
        return "watch.html?v=" + encodeURIComponent(id);
    }

    function card(id) {
        var video = get(id);

        if (!video) {
            return "";
        }

        var videoLink = link(id);
        var thumbnail = thumbSrc(id, video);
        var videoDuration = duration(id);
        var channelAvatar = avatar(video);

        return `
            <article class="video-card" data-id="${esc(id)}">
                <a class="thumb" href="${videoLink}">
                    <img src="${thumbnail}" alt="${esc(video.title)}">
                    <span class="dur">${videoDuration}</span>
                </a>

                <div class="video-info">
                    ${channelAvatar}

                    <div class="meta">
                        <h3>
                            <a href="${videoLink}" title="${esc(video.title)}">
                                ${esc(video.title)}
                            </a>
                        </h3>

                        <p class="ch">${esc(video.channel)}</p>
                        <p>${esc(video.views || "0 views")} • ${esc(video.uploaded || "")}</p>
                    </div>

                    <button class="more" aria-label="More actions">
                        ${dots}
                    </button>
                </div>
            </article>
        `;
    }

    function short(id) {
        var video = get(id);

        if (!video) {
            return "";
        }

        var videoLink = link(id);
        var thumbnail = thumbSrc(id, video, true);

        return `
            <article class="short-card">
                <a class="thumb" href="${videoLink}">
                    <img loading="lazy" src="${thumbnail}" alt="${esc(video.title)}">
                </a>

                <h3>${esc(video.title)}</h3>
                <p>${esc(video.views || "0 views")}</p>
            </article>
        `;
    }

    function row(id, options) {
        var video = get(id);

        if (!video) {
            return "";
        }

        options = options || {};

        var videoLink = link(id);
        var thumbnail = thumbSrc(id, video);
        var videoDuration = duration(id);
        var details = "";

        if (options.small) {
            details = `
                <p>${esc(video.channel)}</p>
                <p>${esc(video.views || "0 views")} • ${esc(video.uploaded || "")}</p>
            `;
        } else {
            var date = options.watched || video.uploaded || "";

            details = `
                <p>${esc(video.views || "0 views")} • ${esc(date)}</p>

                <div class="by">
                    ${avatar(video)}
                    ${esc(video.channel)}
                </div>

                ${options.desc
                    ? '<p class="desc">' + esc(video.description || "") + "</p>"
                    : ""}
            `;
        }

        return `
            <article class="row-card${options.small ? " small" : ""}">
                <a class="thumb" href="${videoLink}">
                    <img loading="lazy" src="${thumbnail}" alt="${esc(video.title)}">
                    <span class="dur">${videoDuration}</span>
                </a>

                <div class="meta">
                    <h3>
                        <a href="${videoLink}">
                            ${esc(video.title)}
                        </a>
                    </h3>

                    ${details}
                </div>

                <button class="more" aria-label="More actions">
                    ${dots}
                </button>
            </article>
        `;
    }

    window.YT = {
        get: get,
        card: card,
        short: short,
        row: row,
        thumbSrc: thumbSrc,
        avatar: avatar,
        esc: esc,
        hash: hash
    };

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
                        watched: "Watched " + watchedTimes[index % watchedTimes.length]
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
        renderLists();
        wireSearch();
        wireCreate();
        wireProfile();
        wireMenu();
        wireChips();
        wireWelcome();
        wireWatch();

        if (/your-videos\.html$/.test(location.pathname)) {
            renderUploads();
        }
    });

    function wireMenu() {
        var button = document.querySelector(".menu-button");

        if (!button) {
            return;
        }

        var scrim = document.createElement("div");
        scrim.className = "scrim";
        document.body.appendChild(scrim);

        scrim.addEventListener("click", function () {
            document.body.classList.remove("drawer");
        });

        button.setAttribute("aria-label", "Menu");

        button.addEventListener("click", function () {
            if (window.innerWidth <= 800) {
                document.body.classList.toggle("drawer");
            } else {
                document.body.classList.toggle("mini");
                document.body.classList.toggle("mini-off");
            }
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
                window.location.href = "search.html?q=" + encodeURIComponent(query);
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

        var query = new URLSearchParams(location.search).get("q");

        if (query) {
            input.value = query;
        }
    }

    function wireCreate() {
        var button = document.querySelector(".create");

        if (!button) {
            return;
        }

        button.addEventListener("click", function () {
            if (getUser()) {
                location.href = "create.html";
            } else {
                location.href = "signin.html?next=create.html";
            }
        });
    }

    function wireProfile() {
        var button = document.querySelector(".profile");

        if (!button) {
            return;
        }

        var user = getUser();

        button.setAttribute("aria-label", "Account");

        if (user) {
            var initial = (user.name || "U").charAt(0).toUpperCase();

            button.innerHTML = '<span class="avatar-badge">' + esc(initial) + "</span>";
            button.title = "Signed in as " + user.name;
        }

        button.addEventListener("click", function (event) {
            event.stopPropagation();

            if (!getUser()) {
                location.href = "signin.html";
                return;
            }

            toggleAccountMenu(button);
        });
    }

    function toggleAccountMenu(button) {
        var existingMenu = document.getElementById("account-menu");

        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        var user = getUser();

        if (!user) {
            return;
        }

        var menu = document.createElement("div");
        menu.id = "account-menu";
        menu.className = "account-menu";

        menu.innerHTML =
            '<p class="account-menu-name">' + esc(user.name || "User") + "</p>" +
            (user.email
                ? '<p class="account-menu-email">' + esc(user.email) + "</p>"
                : "") +
            '<hr>' +
            '<a class="account-menu-item" href="channel.html">Your channel</a>' +
            '<a class="account-menu-item" href="your-videos.html">Your videos</a>' +
            '<hr>' +
            '<button type="button" class="account-menu-item account-menu-signout">Sign out</button>';

        document.body.appendChild(menu);

        var position = button.getBoundingClientRect();

        menu.style.top = position.bottom + 8 + "px";
        menu.style.right = window.innerWidth - position.right + "px";

        menu.querySelector(".account-menu-signout").addEventListener("click", function () {
            clearUser();
            location.href = "index.html";
        });

        setTimeout(function () {
            function closeMenu(event) {
                if (!menu.contains(event.target) && !button.contains(event.target)) {
                    menu.remove();
                    document.removeEventListener("click", closeMenu);
                }
            }

            document.addEventListener("click", closeMenu);
        }, 0);
    }

    function wireWelcome() {
        var element = document.getElementById("welcome");

        if (!element) {
            return;
        }

        var user = getUser();

        if (user) {
            element.innerHTML =
                '<div><h2>Welcome back, ' + esc(user.name) + '</h2>' +
                '<p>Fresh videos from your subscriptions and picks for today.</p></div>' +
                '<a class="btn-blue" href="subscriptions.html">Open subscriptions</a>';
        } else {
            element.innerHTML =
                '<div><h2>Welcome to YouTube</h2>' +
                '<p>Sign in to like videos, subscribe to channels and upload your own.</p></div>' +
                '<a class="btn-blue" href="signin.html">Sign in</a>';
        }
    }

    var CATS = {
        Technology: ["v07", "v08", "v11", "v44"],
        Education: ["v09", "v12", "v15", "v16"],
        Lifestyle: ["v10", "v13", "v14", "v01", "v03", "v06", "v04"]
    };

    function wireChips() {
        var chips = document.querySelectorAll(".chip[data-cat]");

        if (!chips.length) {
            return;
        }

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("active");
                });

                chip.classList.add("active");

                var category = chip.getAttribute("data-cat");
                var visibleVideos = 0;

                document.querySelectorAll(".video-card").forEach(function (videoCard) {
                    var id = videoCard.getAttribute("data-id");

                    var showVideo = category === "All" ||
                        (CATS[category] || []).indexOf(id) !== -1;

                    videoCard.style.display = showVideo ? "" : "none";

                    if (showVideo) {
                        visibleVideos++;
                    }
                });

                var shorts = document.querySelector(".shorts-block");

                if (shorts) {
                    shorts.style.display = category === "All" ? "" : "none";
                }

                var emptyMessage = document.getElementById("cat-empty");

                if (emptyMessage) {
                    emptyMessage.style.display = visibleVideos ? "none" : "";
                }
            });
        });
    }

    function wireWatch() {
        var layout = document.querySelector(".watch-layout");

        if (!layout) {
            return;
        }

        var videoId = new URLSearchParams(location.search).get("v");
        var video = get(videoId);

        if (!video && typeof DEFAULT_VIDEO_ID !== "undefined") {
            videoId = DEFAULT_VIDEO_ID;
            video = get(videoId);
        }

        if (!video) {
            return;
        }

        document.title = video.title + " - YouTube";

        var frame = document.getElementById("video-frame");

        if (frame && video.yt) {
            frame.src = "https://www.youtube.com/embed/" +
                encodeURIComponent(video.yt) + "?rel=0";
        }

        var title = document.getElementById("video-title");

        if (title) {
            title.textContent = video.title;
        }

        var channelAvatar = document.getElementById("channel-avatar");

        if (channelAvatar) {
            channelAvatar.textContent = video.initial ||
                (video.channel || "U").charAt(0);

            channelAvatar.style.background = avatarColor(video.channel || "User");
        }

        var channelName = document.getElementById("channel-name");

        if (channelName) {
            channelName.textContent = video.channel || "Unknown channel";
        }

        var channelSubs = document.getElementById("channel-subs");

        if (channelSubs) {
            channelSubs.textContent = video.subs || "";
        }

        var description = document.getElementById("video-description");

        if (description) {
            description.innerHTML =
                "<b>" + esc(video.views || "0 views") + "  " +
                esc(video.uploaded || "") + "</b><br>" +
                esc(video.description || "");
        }

        document.querySelectorAll("[data-toggle]").forEach(function (button) {
            button.addEventListener("click", function () {
                var isOn = button.classList.toggle("on");
                var type = button.getAttribute("data-toggle");

                if (type === "sub") {
                    button.textContent = isOn ? "Subscribed" : "Subscribe";
                }

                if (type === "like" && isOn) {
                    var dislike = document.querySelector('[data-toggle="dislike"]');

                    if (dislike) {
                        dislike.classList.remove("on");
                    }
                }

                if (type === "dislike" && isOn) {
                    var like = document.querySelector('[data-toggle="like"]');

                    if (like) {
                        like.classList.remove("on");
                    }
                }
            });
        });

        var nextVideos = [];

        if (typeof VIDEOS !== "undefined") {
            nextVideos = Object.keys(VIDEOS).filter(function (id) {
                return id !== videoId &&
                    id.charAt(0) === "v" &&
                    Number(id.slice(1)) <= 40;
            });
        }

        nextVideos.sort(function (a, b) {
            return hash(a + videoId) - hash(b + videoId);
        });

        nextVideos = nextVideos.slice(0, 12);

        var upNext = document.getElementById("up-next");

        if (upNext) {
            upNext.innerHTML = nextVideos.map(function (id) {
                return row(id, { small: true });
            }).join("");
        }

        var form = document.getElementById("comment-form");
        var commentList = document.getElementById("comment-list");
        var commentMe = document.getElementById("comment-me");
        var user = getUser();

        if (commentMe) {
            commentMe.textContent = user
                ? (user.name || "U").charAt(0).toUpperCase()
                : "?";
        }

        if (!form || !commentList) {
            return;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            var input = form.querySelector("input");

            if (!input) {
                return;
            }

            var text = input.value.trim();

            if (!text) {
                return;
            }

            var currentUser = getUser();

            if (!currentUser) {
                var currentPage = location.pathname.split("/").pop() + location.search;

                location.href = "signin.html?next=" +
                    encodeURIComponent(currentPage);

                return;
            }

            var comment = document.createElement("div");
            comment.className = "comment";

            var name = currentUser.name || "User";
            var initial = name.charAt(0).toUpperCase();

            comment.innerHTML =
                '<span class="comment-image" style="background:#8e24aa">' +
                esc(initial) + "</span>" +
                "<div><h4>" + esc(name) +
                "<span>just now</span></h4><p>" +
                esc(text) + "</p></div>";

            commentList.insertBefore(comment, commentList.firstChild);
            input.value = "";
        });
    }

    function renderUploads() {
        var grid = document.querySelector(".video-grid");

        if (!grid) {
            return;
        }

        var uploads = getUploads();

        var html = uploads.map(function (video) {
            return card(video.id);
        }).join("");

        if (html) {
            grid.insertAdjacentHTML("afterbegin", html);
        }
    }
})();
