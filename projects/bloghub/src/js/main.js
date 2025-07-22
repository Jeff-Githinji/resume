 // BlogHub - Main JavaScript File

// Application state
const app = {
    currentView: 'dashboard',
    posts: [],
    users: [],
    
    // Initialize the application
    init() {
        console.log('BlogHub initialized! 🚀');
        this.loadSampleData();
        this.setupEventListeners();
        this.render();
    },
    
    // Load some sample data
    loadSampleData() {
        this.posts = [
            {
                id: 1,
                title: "Welcome to BlogHub!",
                content: "This is your first blog post. Start writing and sharing your thoughts!",
                author: "Admin",
                createdAt: new Date().toISOString(),
                likes: 5,
                comments: 2
            },
            {
                id: 2,
                title: "Getting Started Guide",
                content: "Learn how to use BlogHub to create amazing content and connect with other writers.",
                author: "BlogHub Team", 
                createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                likes: 12,
                comments: 7
            }
        ];
        
        console.log('Sample data loaded:', this.posts);
    },
    
    // Set up event listeners
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded - ready to add interactive features');
        });
    },
    
    // Render the current view
    render() {
        console.log('Rendering view:', this.currentView);
        // We'll expand this as we build more features
    }
};

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Export app for debugging (you can type 'app' in browser console)
window.app = app;
