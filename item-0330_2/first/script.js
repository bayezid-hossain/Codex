gsap.registerPlugin(ScrollTrigger);

const container = document.querySelector(".container");
const images = document.querySelectorAll(
  ".image-container img"
);
const statItems = document.querySelectorAll(".stat-item");
const statLabels = document.querySelectorAll(".stat-label");

gsap.to(images, {
  y: 0,
  opacity: 1,
  stagger: 0.2, // Stagger the animation of each image
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: container,
    start: "top center", // Animation starts when the top of the container hits the center of the viewport
    end: "bottom center", // Animation ends when the bottom of the container hits the center of the viewport
    scrub: 1, // Smoothly link animation progress to scroll progress
    // markers: true, // For debugging scroll trigger
    onEnter: () => {
      gsap.to(statItems, {
        x: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(statLabels, {
        x: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        overwrite: true,
      });
    },
    onEnterBack: () => {
      gsap.to(statItems, {
        x: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(statLabels, {
        x: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.7,
        ease: "power2.out",
        overwrite: true,
      });
    },
    onLeave: () => {
      gsap.to(statItems, {
        x: -50,
        opacity: 0,
        overwrite: true,
      });
      gsap.to(statLabels, {
        x: 50,
        opacity: 0,
        overwrite: true,
      });
    },
    onLeaveBack: () => {
      gsap.to(statItems, {
        x: -50,
        opacity: 0,
        overwrite: true,
      });
      gsap.to(statLabels, {
        x: 50,
        opacity: 0,
        overwrite: true,
      });
    },
  },
});
