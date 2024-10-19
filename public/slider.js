class ImageSlider {
    constructor(sliderElement) {
        this.sliderElement = sliderElement;
        this.slides = sliderElement.querySelector('.slides');
        this.totalSlides = sliderElement.querySelectorAll('.slide').length;
        this.slideIndex = 0;

        this.prevButton = sliderElement.querySelector('.prev');
        this.nextButton = sliderElement.querySelector('.next');

        this.prevButton.addEventListener('click', () => this.prevSlide());
        this.nextButton.addEventListener('click', () => this.nextSlide());

        this.startAutoSlide();
    }

    nextSlide() {
        this.slideIndex = (this.slideIndex + 1) % this.totalSlides;
        this.updateSlidePosition();
    }

    prevSlide() {
        this.slideIndex = (this.slideIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlidePosition();
    }

    updateSlidePosition() {
        const offset = this.slideIndex * -100;
        this.slides.style.transform = `translateX(${offset}%)`;
    }

    startAutoSlide() {
        setInterval(() => this.nextSlide(), 3000); // Slide every 3 seconds
    }
}

// Initialize sliders
document.querySelectorAll('.slider').forEach(sliderElement => {
    new ImageSlider(sliderElement);
});
