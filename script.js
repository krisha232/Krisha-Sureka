// CHANGE THIS: Put your real Medium username here (keep the @ if your handle uses it)
const MEDIUM_USERNAME = "@krisha0232"; 

let BLOG_POSTS = [];
let currentArticleId = null;

// Safe fallback structure if the network connection or proxy ever experiences lag
function useFallbackData() {
    BLOG_POSTS = [
        {
            id: 0,
            tag: "01 // ARCHITECTURE",
            date: "June 2026",
            title: "Deconstructing Containerized Web Spaces",
            preview: "An analytical evaluation of boundless modern user canvas interfaces without structural boxes...",
            body: "<p>The contemporary web landscape is trapped inside a prison of structural cell dividers. White space can create perfect canvas boundaries without requiring explicit borders.</p>",
            link: `https://medium.com/${MEDIUM_USERNAME}`,
            likes: 24
        },
        {
            id: 1,
            tag: "02 // DESIGN",
            date: "May 2026",
            title: "The Fine Art of Typographic Pacing",
            preview: "How precise character tracking adjustments and radical margin balances modify user text ingestion speeds completely.",
            body: "<p>Typography is music for the eyes. When layout architectures remove box outlines, the tracking, line-height, and vertical scaling traits become your primary layout infrastructure.</p>",
            link: `https://medium.com/${MEDIUM_USERNAME}`,
            likes: 42
        }
    ];
}

// Safe wrapper to initialize UI behaviors only after the DOM is fully constructed
document.addEventListener("DOMContentLoaded", function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    if (themeBtn && themeIcon) {
        themeBtn.addEventListener('click', function() {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                themeIcon.setAttribute('data-lucide', 'moon');
            } else {
                document.documentElement.classList.add('dark');
                themeIcon.setAttribute('data-lucide', 'sun');
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }

    // Connect to the live Medium stream
    fetchMediumArticles();
});

// Fetch Live Articles directly from Medium's Feed via Google Caching Engine
function fetchMediumArticles() {
    const rssUrl = `https://medium.com/feed/${MEDIUM_USERNAME}`;
    const googleProxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(googleProxyUrl)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            if (data && data.status === 'ok' && data.items && data.items.length > 0) {
                BLOG_POSTS = [];
                
                data.items.forEach((item, index) => {
                    const content = item.content || item.description || "";
                    const cleanPreview = content.replace(/<[^>]*>/g, '').substring(0, 120) + '...';
                    
                    let formattedDate = "Recent";
                    if (item.pubDate) {
                        const pubDate = new Date(item.pubDate.replace(/-/g, "/"));
                        formattedDate = pubDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    }

                    BLOG_POSTS.push({
                        id: index,
                        tag: `${String(index + 1).padStart(2, '0')} // MEDIUM`,
                        date: formattedDate,
                        title: item.title || "Untitled Article",
                        preview: cleanPreview,
                        body: content, 
                        link: item.link || `https://medium.com/${MEDIUM_USERNAME}`,
                        likes: Math.floor(Math.random() * 60) + 40 // Clean structural fallback count
                    });
                });
                
                displayBlogContent();
            } else {
                useFallbackData();
                displayBlogContent();
            }
        })
        .catch(err => {
            console.warn("Global pipeline issue. Sliding fallback layouts into focus smoothly.", err);
            useFallbackData();
            displayBlogContent();
        });
}

// Render Blog Posts into HTML Nodes
function displayBlogContent() {
    const track = document.getElementById('carousel-track');
    const listContainer = document.getElementById('blog-list-container');
    
    if (!track || !listContainer) return;
    
    track.innerHTML = '';
    listContainer.innerHTML = '';

    BLOG_POSTS.forEach(function(post) {
        track.innerHTML += `
            <div onclick="openArticle(${post.id})" class="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer relative pl-4 py-2">
                <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-accentBlue scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                <span class="text-[10px] font-mono text-accentBlue dark:text-glowTeal">${post.tag}</span>
                <h4 class="text-md font-bold mt-1 text-slate-800 dark:text-slate-200 group-hover:text-accentBlue dark:group-hover:text-glowTeal transition-colors">${post.title}</h4>
                <p class="text-xs text-slate-400 mt-2 line-clamp-2">${post.preview}</p>
            </div>
        `;

        listContainer.innerHTML += `
            <div onclick="openArticle(${post.id})" class="group cursor-pointer max-w-xl relative pl-6 py-1">
                <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-accentBlue dark:bg-glowTeal scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
                <span class="text-xs font-mono opacity-40">${post.date}</span>
                <h3 class="text-xl font-bold mt-1 text-slate-900 dark:text-white group-hover:text-accentBlue dark:group-hover:text-glowTeal transition-colors">${post.title}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">${post.preview}</p>
            </div>
        `;
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Carousel Slideway Control Functions
function scrollCarousel(direction) {
    const track = document.getElementById('carousel-track');
    if (track) track.scrollLeft += (direction * 300);
}

// Open Specific Post Detail View
function openArticle(id) {
    const post = BLOG_POSTS.find(item => item.id === id);
    if (!post) return;

    currentArticleId = id;

    const dDate = document.getElementById('detail-date');
    const dTitle = document.getElementById('detail-title');
    const dBody = document.getElementById('detail-body');
    const dLikes = document.getElementById('like-count');

    if (dDate) dDate.innerText = post.date;
    if (dTitle) dTitle.innerText = post.title;
    if (dBody) dBody.innerHTML = post.body;
    if (dLikes) dLikes.innerText = post.likes; 

    switchTab('article-detail');
}

// Local Interface Click Metric Updates
function handleLike() {
    const post = BLOG_POSTS.find(item => item.id === currentArticleId);
    const dLikes = document.getElementById('like-count');
    
    if (post && dLikes) {
        post.likes += 1;
        dLikes.innerText = post.likes;
    }
}

// Share Button: Extracts the actual live URL link from Medium
function handleShare() {
    const post = BLOG_POSTS.find(item => item.id === currentArticleId);
    
    if (post && post.link) {
        navigator.clipboard.writeText(post.link);
        alert("Medium article link copied to clipboard!");
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link saved to clipboard!");
    }
}

// View Space Switching Navigator Routing Matrix
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.remove('block', 'grid');
        content.classList.add('hidden');
    });

    const targetView = document.getElementById(`content-${tabId}`);
    if (!targetView) return;

    if (tabId === 'projects' || tabId === 'art') {
        targetView.classList.remove('hidden');
        targetView.classList.add('grid');
    } else {
        targetView.classList.remove('hidden');
        targetView.classList.add('block');
    }

    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.className = "tab-btn group relative flex items-center space-x-3 py-2.5 text-sm font-medium tracking-wide text-left text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-all";
        const indicator = btn.querySelector('span');
        if (indicator) indicator.classList.add('opacity-0');
    });

    const selectedBtn = document.getElementById(`tab-${tabId}`);
    if (selectedBtn) {
        selectedBtn.className = "tab-btn active-tab group relative flex items-center space-x-3 py-2.5 text-sm font-semibold tracking-wide text-left text-accentBlue dark:text-glowTeal transition-all";
        const indicator = selectedBtn.querySelector('span');
        if (indicator) indicator.classList.remove('opacity-0');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
