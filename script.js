// Init AOS
AOS.init({
  duration: 800,
  once: true
});

// Toggle hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Highlight navbar menu saat scroll ke section
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-item");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 70;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });

  // tampilkan tombol back to top
  const backToTop = document.getElementById("backToTop");
  if (window.pageYOffset > 400) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

// scroll ke atas kalau tombol back to top diklik
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
