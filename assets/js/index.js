const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const menuIcon = document.getElementById('menuIcon');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-xmark');
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        navMenu.classList.remove('hidden');
    } else {
        navMenu.classList.add('hidden');
    }
});