window.addEventListener('scroll', function() {
    const serviceBoxes = document.querySelectorAll('.service-box');
    const triggerHeight = window.innerHeight * 0.85; 

    serviceBoxes.forEach(box => {
        const boxTop = box.getBoundingClientRect().top;
        if (boxTop < triggerHeight) {
            box.classList.add('scrolled');
        }
    });
});
