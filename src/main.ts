const currentPage = window.location.pathname.split('/').pop() || 'index.html';

const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

navLinks.forEach((link) => {
    const linkPage = link.getAttribute('href');

    if (linkPage === currentPage) {
        link.classList.add('active');
    }
});
