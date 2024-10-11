document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.content-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    
    const image2 = document.querySelector('.image2');
    const button = document.querySelector('.button-container');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting || window.innerWidth < 991) {
                image2.classList.remove('fade-out');
                button.classList.remove('fade-out');
            } else {
                image2.classList.add('fade-out');
                button.classList.add('fade-out');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px'
    });

    observer.observe(image2);
});
document.addEventListener('DOMContentLoaded', function() {
    
    const image1 = document.querySelector('.image1');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting || window.innerWidth < 991) {
                
                image1.classList.remove('fade-out');
            } else {
                
                image1.classList.add('fade-out');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: ' 0px'
    });

    observer.observe(image1);
});

window.addEventListener('DOMContentLoaded', function() {
    var logo = document.querySelector('.navbar-brand');
  
    if (window.location.pathname !== "/home") {
      logo.classList.add('visible');
    }
  });
  
  window.addEventListener('scroll', function() {
    var logo = document.querySelector('.navbar-brand');
    var scrollPosition = window.scrollY || window.pageYOffset;
  
    if (window.location.pathname === "/home") {
      if (scrollPosition > 180) {
        logo.classList.add('visible');
      } else {
        logo.classList.remove('visible');
      }
    }
  });
