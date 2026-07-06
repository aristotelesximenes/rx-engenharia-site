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
    const number = document.body.dataset.whatsapp;
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
