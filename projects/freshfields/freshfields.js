document.addEventListener('DOMContentLoaded', () => {
    let currentLocation = window.location.href;
    let links = document.querySelectorAll('.navbar nav ul li a');
    
    links.forEach(link => {
        if (link.href === currentLocation) {
            link.classList.add('active');
        }
    });

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            links.forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});





