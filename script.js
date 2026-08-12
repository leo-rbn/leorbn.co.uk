  document.getElementById('year').textContent = new Date().getFullYear();

      const root = document.documentElement;
      const themeToggle = document.getElementById('theme-toggle');
      const brandLogo = document.getElementById('brand-logo');
      const favicon = document.getElementById('site-favicon');
      const shortcutFavicon = document.getElementById('site-favicon-shortcut');
      const interactivePills = document.querySelectorAll('.language-pill[data-language], .language-pill[data-skill]');
      const projectSection = document.getElementById('projects');
      const projectCards = document.querySelectorAll('.project-card[data-languages], .project-card[data-skills]');
      const timelineItems = document.querySelectorAll('.timeline-item');

      function applyTheme(theme, save = true) {
        root.setAttribute('data-theme', theme);
        if (save) localStorage.setItem('theme', theme);

        if (brandLogo) {
          brandLogo.src = theme === 'light' ? '/assets/logo-light.png' : '/assets/logo-dark.png';
        }

        const faviconHref = theme === 'light' ? '/assets/logo-light.png' : '/assets/logo-dark.png';
        if (favicon) {
          favicon.href = faviconHref;
        }
        if (shortcutFavicon) {
          shortcutFavicon.href = faviconHref;
        }

        if (themeToggle) {
          const label = themeToggle.querySelector('.theme-toggle-label');
          const icon = themeToggle.querySelector('.theme-toggle-icon');
          if (label) {
            label.textContent = theme === 'light' ? 'Dark mode' : 'Light mode';
          }
          if (icon) {
            icon.textContent = theme === 'light' ? '☾' : '☀';
          }
        }
      }

      function normalizeTerm(term) {
        return term.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9]+/g, '-');
      }

      function highlightProjectsForTerm(term, activePill = null) {
        const normalized = normalizeTerm(term);
        const matches = [];
        const timelineMatches = [];

        projectCards.forEach((card) => {
          const cardTerms = [card.dataset.languages || '', card.dataset.skills || '']
            .join(' ')
            .toLowerCase()
            .split(/\s*,\s*|\s+/)
            .map((value) => value.replace(/[^a-z0-9]+/g, '-'))
            .filter(Boolean);

          if (cardTerms.includes(normalized)) {
            matches.push(card);
          }
        });

        timelineItems.forEach((item) => {
          const itemTerms = [item.dataset.skill || item.dataset.skills || '', item.textContent || '']
            .join(' ')
            .toLowerCase()
            .split(/\s*,\s*|\s+/)
            .map((value) => value.replace(/[^a-z0-9]+/g, '-'))
            .filter(Boolean);

          if (itemTerms.includes(normalized)) {
            timelineMatches.push(item);
          }
        });

        interactivePills.forEach((pill) => pill.classList.remove('language-pill--glow'));
        projectCards.forEach((card) => card.classList.remove('project-card--glow'));
        timelineItems.forEach((item) => item.classList.remove('timeline-item--glow'));

        if (activePill) {
          activePill.classList.add('language-pill--glow');
          window.setTimeout(() => activePill.classList.remove('language-pill--glow'), 10000);
        }

        matches.forEach((card) => {
          card.classList.add('project-card--glow');
          window.setTimeout(() => card.classList.remove('project-card--glow'), 10000);
        });

        timelineMatches.forEach((item) => {
          item.classList.add('timeline-item--glow');
          window.setTimeout(() => item.classList.remove('timeline-item--glow'), 10000);
        });

        if (matches.length > 0 && projectSection) {
          projectSection.scrollIntoView({ block: 'start' });
        }
      }

      interactivePills.forEach((pill) => {
        pill.addEventListener('click', () => {
          const selectedTerm = pill.dataset.language || pill.dataset.skill;
          if (selectedTerm) {
            highlightProjectsForTerm(selectedTerm, pill);
          }
        });
      });

      // Determine initial theme: use system preference on load (ignore stored setting).
      (function initializeTheme() {
        let initialTheme = null;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          initialTheme = 'light';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          initialTheme = 'dark';
        } else {
          initialTheme = 'dark';
        }

        // Apply theme but do NOT overwrite the user's stored preference on initial automatic choice.
        applyTheme(initialTheme, false);
      })();

  
      if (themeToggle) {
        themeToggle.addEventListener('click', (event) => {
          event.preventDefault();
          const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
          applyTheme(nextTheme);
        });
      }

      const contactForm = document.getElementById('contact-form');
      const formStatus = document.getElementById('form-status');

      if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (event) => {
          event.preventDefault();
          const name = contactForm.elements.name.value.trim();
          const greeting = name ? name : 'friend';
          formStatus.textContent = `Thanks, ${greeting}! Your message is ready to send.`;
          contactForm.reset();
        });
      }