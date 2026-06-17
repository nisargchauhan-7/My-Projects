/* =========================
   GSAP SETUP
========================= */

gsap.registerPlugin(ScrollTrigger);

/* =========================
   LOADER ANIMATIONS
========================= */

window.addEventListener("load", () => {

    gsap.to(".loader", {

        opacity: 0,

        duration: 1,

        delay: 1.5,

        onComplete: () => {

            document.querySelector(".loader").style.display = "none";

        }

    });

});

/* =========================
   PREMIUM TEXT REVEAL
========================= */

gsap.from(".loader h1", {

    y: 80,

    opacity: 0,

    duration: 1.2,

    ease: "power4.out"

});

gsap.from(".loader p", {

    y: 30,

    opacity: 0,

    duration: 1,

    delay: 0.5

});

/* =========================
   LOADING LINE
========================= */

gsap.to(".loader-line", {

    width: 250,

    duration: 1.5,

    ease: "power2.inOut"

});

/* =========================
   HERO ANIMATIONS
========================= */

gsap.from(".hero-tag", {
    x: -100,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: "power3.out"
});

gsap.from(".hero h1", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    delay: 0.4,
    ease: "power3.out"
});

gsap.from(".hero h2", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.7,
    ease: "power3.out"
});

gsap.from(".hero h3", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.9,
    ease: "power3.out"
});

gsap.from(".hero-desc", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 1.1,
    ease: "power3.out"
});

gsap.from(".hero-btn", {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    delay: 1.3,
    ease: "back.out(1.7)"
});

gsap.from(".hero-right", {
    x: 100,
    opacity: 0,
    duration: 1.2,
    delay: 0.8,
    ease: "power3.out"
});

/* =========================
   PROJECT ANIMATIONS
========================= */

gsap.utils.toArray(".project-item").forEach((project) => {

    gsap.from(project, {

        y: 120,

        opacity: 0,

        duration: 1.2,

        ease: "power3.out",

        scrollTrigger: {

            trigger: project,

            start: "top 85%"

        }

    });

});

/* ===============================
   PROJECT IMAGE ZOOM ANIMATIONS
=============================== */

gsap.utils.toArray(".project-preview img").forEach((image) => {

    gsap.from(image, {

        scale: 1.2,

        opacity: 0,

        duration: 1.4,

        ease: "power3.out",

        scrollTrigger: {

            trigger: image,

            start: "top 85%"

        }

    });

});

/* =========================
   ABOUT ANIMATION
========================= */

gsap.utils.toArray(".about-card").forEach((card) => {

    gsap.from(card, {

        y: 100,

        opacity: 0,

        duration: 1,

        ease: "power3.out",

        scrollTrigger: {

            trigger: card,

            start: "top 85%"
        }
    });

});

/* =========================
   CONTACT ANIMATION
========================= */

gsap.from(".contact h2", {

    y: 100,

    opacity: 0,

    duration: 1,

    scrollTrigger: {
        trigger: ".contact",
        start: "top 80%"
    }

});

/* =========================
   CUSTOM CURSOR
========================= */

const cursor = document.querySelector(".cursor");

if (cursor) {

    document.addEventListener("mousemove", (e) => {

        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";

    });

}

/* =========================
   CARD HOVER ANIMATION
========================= */

document.querySelectorAll(".project-preview").forEach((project) => {

    project.addEventListener("mouseenter", () => {

        gsap.to(project, {
            scale: 1.02,
            duration: 0.3
        });

    });

    project.addEventListener("mouseleave", () => {

        gsap.to(project, {
            scale: 1,
            duration: 0.3
        });

    });

});

/* =========================
   NAVBAR ANIMATIONS
========================= */

gsap.from("nav", {

    y: -100,

    opacity: 0,

    duration: 1,

    ease: "power3.out"

});

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach((section) => {

        const sectionTop = section.offsetTop;

        const sectionHeight = section.clientHeight;

        if(window.scrollY >= sectionTop - 200){

            current = section.getAttribute("id");
        }

    });

    navLinks.forEach((link) => {

        link.classList.remove("active");

        if(
            link.getAttribute("href")
            === "#" + current
        ){
            link.classList.add("active");
        }

    });

});

document
.querySelector('nav a[href="#home"]')
.classList.add("active");

/* =========================
   SPOTLIGHT
========================= */

const spotlight = document.querySelector(".spotlight");

document.addEventListener("mousemove", (e) => {

    spotlight.style.left = e.clientX + "px";
    spotlight.style.top = e.clientY + "px";

});

/* =========================
   GSAP Parallax Animation
========================= */

gsap.utils.toArray(".project-preview img").forEach((image) => {

    gsap.to(image, {

        y: -80,

        ease: "none",

        scrollTrigger: {

            trigger: image,

            start: "top bottom",

            end: "bottom top",

            scrub: true

        }

    });

});

const button = document.querySelector(".hero-btn");

/* =========================
   Magnetic Effect
========================= */

button.addEventListener("mousemove", (e) => {

    const rect = button.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {

        x: x * 0.3,
        y: y * 0.3,

        duration: 0.4,

        ease: "power2.out"

    });

});

button.addEventListener("mouseleave", () => {

    gsap.to(button, {

        x: 0,
        y: 0,

        duration: 0.5,

        ease: "elastic.out(1,0.4)"

    });

});

/* =========================
   FLOATING BACKGROUND
========================= */

gsap.to(".mesh-1",{

    x:150,
    y:100,

    duration:12,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"

});

gsap.to(".mesh-2",{

    x:-150,
    y:-80,

    duration:15,

    repeat:-1,

    yoyo:true,

    ease:"sine.inOut"

});

/* =========================
   SECTION REVEAL
========================= */

gsap.utils.toArray(".reveal").forEach((section)=>{

    gsap.to(section,{

        y:0,

        opacity:1,

        duration:1.3,

        ease:"power3.out",

        scrollTrigger:{
            trigger:section,
            start:"top 80%"
        }

    });

});

/* =========================
   Hovar Animation
========================= */

gsap.utils.toArray(".project-item").forEach((project)=>{

    project.addEventListener("mouseenter",()=>{

        gsap.to(project,{

            y:-10,
            duration:0.4

        });

    });

    project.addEventListener("mouseleave",()=>{

        gsap.to(project,{

            y:0,
            duration:0.4

        });

    });

});

/* =========================
   MARQUEE ANIMATION
========================= */

gsap.to(".marquee-track",{

    xPercent:-50,

    duration:25,

    ease:"none",

    repeat:-1

});

/* =========================
   MAGNETIC BUTTON
========================= */

const magneticButtons =
    document.querySelectorAll(".magnetic");

magneticButtons.forEach((button) => {

    button.addEventListener("mousemove", (e) => {

        const rect =
            button.getBoundingClientRect();

        const x =
            e.clientX -
            rect.left -
            rect.width / 2;

        const y =
            e.clientY -
            rect.top -
            rect.height / 2;

        gsap.to(button, {

            x: x * 0.3,
            y: y * 0.3,

            duration: 0.4,

            ease: "power2.out"

        });

    });

    button.addEventListener("mouseleave", () => {

        gsap.to(button, {

            x: 0,
            y: 0,

            duration: 0.5,

            ease: "elastic.out(1,0.3)"

        });

    });

});

/* =========================
   Skill Animation
========================= */

gsap.utils.toArray(".skill-card").forEach((card) => {

    gsap.from(card, {

        y: 100,

        opacity: 0,

        duration: 1,

        ease: "power3.out",

        scrollTrigger: {

            trigger: card,

            start: "top 85%"
        }

    });

});

/* =========================
   Timeline Animation
========================= */

gsap.utils.toArray(".timeline-item").forEach((item) => {

    gsap.from(item, {

        y: 100,

        opacity: 0,

        duration: 1,

        ease: "power3.out",

        scrollTrigger: {

            trigger: item,

            start: "top 85%"
        }

    });

});

/* =========================
   Footer Animation
========================= */

const footer = document.querySelector(".footer");

if (footer) {

    gsap.from(footer,{
        y:100,
        opacity:0,
        duration:1,
        scrollTrigger:{
            trigger:footer,
            start:"top 85%"
        }
    });

}

/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.querySelector(".menu-toggle");

const mobileNav = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {

    mobileNav.classList.toggle("active");

});

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        mobileNav.classList.remove("active");

    });

});

console.log("Portfolio Loaded Successfully 🚀");