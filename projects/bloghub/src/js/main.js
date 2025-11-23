 // BlogHub - Main JavaScript File

// Application state
const app = {
    currentView: 'dashboard',
    posts: [],
    users: [],
    
    // Initialize the application
    init() {
        console.log('BlogHub initialized! 🚀');
        // Show loading spinner
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) loadingDiv.classList.remove('hidden');
        // Load posts from JSON file
        this.loadPosts()
            .then(() => {
                // Hide loading spinner
                if (loadingDiv) loadingDiv.classList.add('hidden');
                this.setupEventListeners();
                this.render();
                // Initialize Quill editor for writing interface
                this.initQuillEditor();
            })
            .catch(err => {
                console.error('Error loading posts:', err);
                if (loadingDiv) loadingDiv.innerHTML = '<span style="color:red">Failed to load posts.</span>';
            });
    },
    // Initialize Quill editor and handle writing form
    initQuillEditor() {
        // Only run if write view exists
        const quillContainer = document.getElementById('quill-editor');
        if (!quillContainer) return;
        // Add Quill modules for image resize and drag-drop
        if (window.Quill) {
            // Register modules if available
            if (window.Quill.imports && !window.Quill.imports['modules/imageResize']) {
                // You can add Quill ImageResize and ImageDrop modules here if loaded
            }
        }
        const quill = new Quill('#quill-editor', {
            theme: 'snow',
            placeholder: 'Write your post content here...',
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                ],
                // imageResize: {}, // If you add the plugin
                // imageDrop: true // If you add the plugin
            }
        });

        // Handle form submission
        const writeForm = document.getElementById('write-form');
        writeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // Get form values
            const title = document.getElementById('post-title').value.trim();
            const subtitle = document.getElementById('post-subtitle').value.trim();
            const category = document.getElementById('post-category').value;
            const imageInput = document.getElementById('post-image');
            let imageUrl = '';
            // Handle image upload (use local preview for now)
            if (imageInput.files && imageInput.files[0]) {
                // Create a local URL for preview
                imageUrl = URL.createObjectURL(imageInput.files[0]);
            } else {
                imageUrl = 'https://source.unsplash.com/400x400/?blog,writing,nature';
            }
            // Get rich text content (HTML)
            const content = quill.root.innerHTML;
            // Create new post object
            const newPost = {
                id: Date.now(),
                title,
                content,
                subtitle,
                category,
                image: imageUrl,
                author: 'You',
                createdAt: new Date().toISOString(),
                likes: 0,
                comments: 0
            };
            // Add to app state
            app.posts.unshift(newPost);
            // Switch to dashboard and show new post
            document.querySelector('[data-view="dashboard"]').click();
            // Optionally reset form and editor
            writeForm.reset();
            quill.setContents([]);
        });
    },
    
    // Load some sample data
    // Load posts from data/posts.json
    async loadPosts() {
        // Fetch posts from JSON file
        try {
            const response = await fetch('data/posts.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const posts = await response.json();
            // Assign posts to app state
            this.posts = posts;
            console.log('Posts loaded:', this.posts);
        } catch (error) {
            throw error;
        }
    },
    

    // Set up event listeners for navigation/view switching
    setupEventListeners() {
        // Get all navigation buttons
        const navBtns = document.querySelectorAll('.nav-btn');
        // Get all views
        const views = document.querySelectorAll('.view');

        // Function to switch views
        const switchView = (viewName) => {
            // Hide all views
            views.forEach(view => {
                view.classList.remove('active');
            });
            // Show the selected view
            const activeView = document.getElementById(viewName + '-view');
            if (activeView) {
                activeView.classList.add('active');
            }
            // Update app state
            app.currentView = viewName;
        };

        // Add click event listeners to navigation buttons
        navBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove 'active' class from all nav buttons
                navBtns.forEach(b => b.classList.remove('active'));
                // Add 'active' class to the clicked button
                btn.classList.add('active');
                // Get the view to show from data-view attribute
                const viewName = btn.getAttribute('data-view');
                // Switch to the selected view
                switchView(viewName);
            });
        });
        // CATEGORY FILTERING
        // Get all category filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove 'active' from all filter buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add 'active' to clicked button
                btn.classList.add('active');
                // Get selected category
                const category = btn.getAttribute('data-category');
                // Filter posts
                let filteredPosts;
                if (category === 'all') {
                    filteredPosts = app.posts;
                } else {
                    // For demo, filter by title containing category (expand later)
                    filteredPosts = app.posts.filter(post => post.title.toLowerCase().includes(category.toLowerCase()));
                }
                // Render filtered posts
                app.renderPosts(filteredPosts);
            });
        });
        // SEARCH FUNCTIONALITY
        // Get the search input box
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                // Get the search query
                const query = searchInput.value.trim().toLowerCase();
                // Get currently selected category
                const activeCategoryBtn = document.querySelector('.filter-btn.active');
                let filteredPosts = app.posts;
                if (activeCategoryBtn) {
                    const category = activeCategoryBtn.getAttribute('data-category');
                    if (category !== 'all') {
                        // For demo, filter by title containing category
                        filteredPosts = filteredPosts.filter(post => post.title.toLowerCase().includes(category.toLowerCase()));
                    }
                }
                // Further filter by search query (title or content)
                if (query.length > 0) {
                    filteredPosts = filteredPosts.filter(post =>
                        post.title.toLowerCase().includes(query) ||
                        post.content.toLowerCase().includes(query)
                    );
                }
                // Render filtered posts
                app.renderPosts(filteredPosts);
            });
        }
        // By default, Dashboard view is shown (already active in HTML)
    },
    
    // Render the current view
    render() {
        console.log('Rendering view:', this.currentView);
        // Only render posts if dashboard is active
        if (this.currentView === 'dashboard') {
            this.renderPosts(this.posts);
        }
        // We'll expand this as we build more features
    },

    // Render posts in the dashboard
    renderPosts(posts) {
        // Get the posts container
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return;
        // Clear previous posts
        postsContainer.innerHTML = '';
        // If no posts, show 'no-posts' message
        const noPostsDiv = document.getElementById('no-posts');
        if (posts.length === 0) {
            if (noPostsDiv) noPostsDiv.classList.remove('hidden');
            return;
        } else {
            if (noPostsDiv) noPostsDiv.classList.add('hidden');
        }
        // Render each post as a square card with image, title, and subtitle
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post-card';
            // Use sample image if none provided
            const imgSrc = post.image || 'https://source.unsplash.com/400x400/?blog,writing,nature';
            // Use first 80 chars of subtitle or content
            const subtitle = post.subtitle || (post.content.length > 80 ? post.content.substring(0, 77) + '...' : post.content);
            postDiv.innerHTML = `
                <div class="post-thumb">
                    <img src="${imgSrc}" alt="Post Thumbnail" />
                </div>
                <div class="post-info">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-subtitle">${subtitle}</p>
                </div>
                <div class="post-meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(post.createdAt).toLocaleDateString()}</span>
                    <span><i class="fas fa-heart"></i> ${post.likes}</span>
                </div>
            `;
            // Make post card clickable to open full post in new tab
            postDiv.style.cursor = 'pointer';
            postDiv.addEventListener('click', function() {
                // Open full post in new tab
                const postWindow = window.open('', '_blank');
                postWindow.document.write(`
                    <html><head>
                        <title>${post.title} - BlogHub</title>
                        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'>
                        <link rel='stylesheet' href='src/css/style.css'>
                    </head><body style='background:#fff;color:#222;font-family:sans-serif;'>
                        <div style='max-width:800px;margin:2rem auto;padding:2rem;background:#fff;border-radius:2rem;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>
                            <h1 style='margin-bottom:0.5rem;'>${post.title}</h1>
                            <h3 style='color:#888;margin-top:0;'>${subtitle}</h3>
                            <div style='margin:1.5rem 0;'>
                                <img src='${imgSrc}' alt='Post Image' style='width:100%;max-height:350px;object-fit:cover;border-radius:1.5rem;'>
                            </div>
                            <div style='margin-bottom:1.5rem;'>
                                <span><i class='fas fa-user'></i> ${post.author}</span>
                                <span style='margin-left:1.5rem;'><i class='fas fa-calendar'></i> ${new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div style='font-size:1.1rem;line-height:1.7;'>${post.content}</div>
                        </div>
                    </body></html>
                `);
                postWindow.document.close();
            });
            postsContainer.appendChild(postDiv);
        });
    },
};

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Export app for debugging (you can type 'app' in browser console)
window.app = app;