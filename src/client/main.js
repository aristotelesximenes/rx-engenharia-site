const menuToggle = document.querySelector("[data-menu-toggle]");
const mainNav = document.querySelector("[data-main-nav]");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Abrir menu" : "Fechar menu");
    mainNav.classList.toggle("is-open", !expanded);
    document.body.classList.toggle("menu-open", !expanded);
  });

  mainNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      mainNav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || menuToggle.getAttribute("aria-expanded") !== "true") return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    mainNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.focus();
  });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const showcase = document.querySelector("[data-showcase]");
if (showcase) {
  const controls = [...showcase.querySelectorAll("[data-showcase-select]")];
  const image = showcase.querySelector("[data-showcase-image]");
  const title = showcase.querySelector("[data-showcase-title]");
  const location = showcase.querySelector("[data-showcase-location]");
  const link = showcase.querySelector("[data-showcase-link]");
  const counter = showcase.querySelector("[data-showcase-counter]");
  for (const control of controls) {
    control.addEventListener("click", () => {
      if (!image || !title || !location || !link || !counter) return;
      image.src = control.dataset.image;
      image.alt = control.dataset.alt;
      image.dataset.view = control.dataset.index;
      title.textContent = control.dataset.title;
      location.textContent = control.dataset.location;
      link.href = control.dataset.href;
      counter.textContent = `${control.dataset.index.padStart(2, "0")} / ${String(controls.length).padStart(2, "0")}`;
      controls.forEach((button) => button.setAttribute("aria-pressed", String(button === control)));
    });
  }
}

const filterForm = document.querySelector("[data-project-filters]");
const projectCards = [...document.querySelectorAll("[data-project-card]")];
const filterEmpty = document.querySelector("[data-filter-empty]");

function applyProjectFilters() {
  if (!filterForm || !projectCards.length) return;
  const data = new FormData(filterForm);
  const category = String(data.get("category") || "");
  const area = String(data.get("area") || "");
  const rooms = Number(data.get("rooms") || 0);
  const floors = Number(data.get("floors") || 0);
  const style = String(data.get("style") || "");
  let visible = 0;

  for (const card of projectCards) {
    const cardArea = Number(card.dataset.area || 0);
    const cardRooms = Number(card.dataset.rooms || 0);
    const cardFloors = Number(card.dataset.floors || 0);
    const matchesCategory = !category || card.dataset.category === category;
    const matchesArea =
      !area ||
      (area === "ate-80" && cardArea <= 80) ||
      (area === "81-120" && cardArea >= 81 && cardArea <= 120) ||
      (area === "121-180" && cardArea >= 121 && cardArea <= 180) ||
      (area === "181-mais" && cardArea > 180);
    const matchesRooms = !rooms || (rooms === 3 ? cardRooms >= 3 : cardRooms === rooms);
    const matchesFloors = !floors || (floors === 2 ? cardFloors >= 2 : cardFloors === floors);
    const matchesStyle = !style || card.dataset.style === style;
    const matches = matchesCategory && matchesArea && matchesRooms && matchesFloors && matchesStyle;
    card.hidden = !matches;
    if (matches) visible += 1;
  }

  if (filterEmpty) filterEmpty.hidden = visible > 0;
}

if (filterForm) {
  filterForm.addEventListener("change", applyProjectFilters);
  filterForm.addEventListener("reset", () => requestAnimationFrame(applyProjectFilters));
}

const contactForm = document.querySelector("[data-contact-form]");

const portfolioFilters = [...document.querySelectorAll("[data-portfolio-filter]")];
const portfolioCards = [...document.querySelectorAll("[data-portfolio-card]")];
const portfolioCount = document.querySelector("[data-portfolio-count]");
for (const button of portfolioFilters) {
  button.addEventListener("click", () => {
    const specialty = button.dataset.portfolioFilter;
    let visible = 0;
    for (const card of portfolioCards) {
      const matches = !specialty || card.dataset.disciplines.split(" ").includes(specialty);
      card.hidden = !matches;
      if (matches) visible += 1;
    }
    portfolioFilters.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
    if (portfolioCount) portfolioCount.textContent = `${visible} ${visible === 1 ? "projeto" : "projetos"}`;
  });
}

if (contactForm) {
  const requestedService = new URLSearchParams(window.location.search).get("servico");
  const serviceSelect = contactForm.querySelector('[name="servico"]');
  if (
    requestedService &&
    serviceSelect &&
    [...serviceSelect.options].some((option) => option.value === requestedService)
  ) {
    serviceSelect.value = requestedService;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const allowedNumbers = (document.body.dataset.whatsappAllowed || "").split(" ");
    const selectedNumber = String(data.get("canal") || "");
    const number = allowedNumbers.includes(selectedNumber) ? selectedNumber : document.body.dataset.whatsapp;
    const message = [
      "Olá, vim pelo site da RX Engenharia e Projetos.",
      "",
      `Nome: ${data.get("nome")}`,
      `WhatsApp: ${data.get("whatsapp")}`,
      `E-mail: ${data.get("email") || "não informado"}`,
      `Cidade/UF: ${data.get("cidade")}`,
      `Serviço: ${data.get("servico")}`,
      "",
      "Descrição da demanda:",
      String(data.get("demanda") || "").trim(),
    ].join("\n");
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    const status = contactForm.querySelector("[data-form-status]");
    if (status) status.textContent = "Abrindo o WhatsApp com sua mensagem...";
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

const revealTargets = document.querySelectorAll(
  ".service-card, .technical-service, .process-grid > li, .differential-grid > article, .team-card",
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 },
  );
  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    observer.observe(target);
  });
}
