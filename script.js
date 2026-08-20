const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const navigationLinks = navigation.querySelectorAll("a");

const setMenuState = (isOpen) => {
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.querySelector(".sr-only").textContent = isOpen
    ? "Close navigation"
    : "Open navigation";
  navigation.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
};

menuButton.addEventListener("click", () => {
  setMenuState(menuButton.getAttribute("aria-expanded") !== "true");
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
    menuButton.focus();
  }
});

window.addEventListener(
  "scroll",
  () => header.classList.toggle("is-scrolled", window.scrollY > 24),
  { passive: true }
);

const activateTab = (tabs, panels, selectedTab, focusTab = false) => {
  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isSelected = panel.id === selectedTab.getAttribute("aria-controls");
    panel.hidden = !isSelected;
    panel.classList.toggle("is-active", isSelected);
  });

  if (focusTab) {
    selectedTab.focus();
  }
};

const wireTabs = (tabSelector, panelSelector) => {
  const tabs = [...document.querySelectorAll(tabSelector)];
  const panels = [...document.querySelectorAll(panelSelector)];

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tabs, panels, tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      activateTab(tabs, panels, tabs[nextIndex], true);
    });
  });
};

wireTabs(".stage-tab", ".stage-panel");
wireTabs(".persona-tab", ".persona-panel");

const filterButtons = document.querySelectorAll(".filter-button");
const capabilityCards = document.querySelectorAll(".capability-card");
const capabilityRegion = document.querySelector(".capability-grid");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const isSelected = item === button;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    capabilityCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const isVisible =
        selectedFilter === "all" || categories.includes(selectedFilter);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    capabilityRegion.setAttribute(
      "aria-label",
      `${visibleCount} product capabilities shown`
    );
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
