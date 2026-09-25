const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const menuIcon = document.getElementById('menuIcon');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('translate-x-full');
    navMenu.classList.toggle('translate-x-0');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-xmark');
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        navMenu.classList.remove('translate-x-full');
        navMenu.classList.add('translate-x-0');
    } else {
        navMenu.classList.add('translate-x-full');
        navMenu.classList.remove('translate-x-0');
    }
});