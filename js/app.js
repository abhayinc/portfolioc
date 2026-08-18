/**
 * Abhay Tank - Minimalist Portfolio Interaction Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initISTClock();
  fetchSanityProjects();
});

/**
 * Handles Light/Dark Theme Switching and Storage across multiple buttons (mobile & desktop)
 */
function initThemeToggle() {
  const themeButtons = document.querySelectorAll('.theme-toggle');
  if (themeButtons.length === 0) return;

  // Retrieve current preference or fallback to system settings
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  // Utility to update all toggle button texts
  const updateButtons = (theme) => {
    themeButtons.forEach(btn => {
      btn.textContent = `[mode: ${theme}]`;
    });
  };

  // Set initial state
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
    updateButtons('dark');
  } else {
    document.documentElement.classList.remove('dark');
    updateButtons('light');
  }

  // Handle toggling on click
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDarkNow = document.documentElement.classList.toggle('dark');
      const targetTheme = isDarkNow ? 'dark' : 'light';
      
      // Store user preference
      localStorage.setItem('theme', targetTheme);
      updateButtons(targetTheme);
    });
  });
}

/**
 * Live Clock that displays current time in IST (UTC+5:30)
 */
function initISTClock() {
  const timeElement = document.getElementById('ist-time');
  if (!timeElement) return;

  const updateClock = () => {
    const now = new Date();
    // Convert current time to UTC and offset to IST (UTC+5.5)
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcTime + (3600000 * 5.5));

    let hours = istTime.getHours();
    const minutes = String(istTime.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // 12-hour format conversion
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');

    timeElement.textContent = `${formattedHours}:${minutes} ${ampm}`;
  };

  updateClock();
  // Update every minute (60 seconds)
  setInterval(updateClock, 60000);
}

/**
 * Fetches projects from Sanity CMS and renders them dynamically
 */
async function fetchSanityProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  // IMPORTANT: Replace 'YOUR_PROJECT_ID' with your actual Sanity project ID
  const projectId = 'r9nz7epb';
  const dataset = 'production';
  // We resolve the image reference to an actual URL string
  const query = encodeURIComponent('*[_type == "project"] | order(order asc) { title, subtitle, description, websiteUrl, emoji, tags, speedTech, cmsManagement, resultBooking, "imageUrl": image.asset->url }');
  const url = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${query}`;

  try {
    if (projectId === 'YOUR_PROJECT_ID') {
       throw new Error('Placeholder project ID');
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch from Sanity');
    
    const data = await response.json();
    const projects = data.result;

    if (!projects || projects.length === 0) {
      container.innerHTML = `<div class="col-span-1 sm:col-span-2 py-10 text-center text-xs font-mono text-zinc-500">No projects found. Ensure you have added projects to your Sanity Studio and published them.</div>`;
      return;
    }

    container.innerHTML = projects.map(project => {
      const CardTag = project.websiteUrl ? 'a' : 'div';
      const cardProps = project.websiteUrl ? `href="${project.websiteUrl}" target="_blank" rel="noopener"` : '';

      return `
      <${CardTag} ${cardProps} class="block space-y-3 group/card cursor-pointer">
        <div class="overflow-hidden border border-zinc-200/60 dark:border-zinc-800/80 rounded-lg shadow-sm shadow-zinc-200/30 dark:shadow-none transition-all duration-500 group-hover/card:border-zinc-300 dark:group-hover/card:border-zinc-700/80 group-hover/card:shadow-md dark:group-hover/card:shadow-none">
          <div class="bg-zinc-100/60 dark:bg-zinc-900/60 border-b border-zinc-200/60 dark:border-zinc-800/80 px-3 py-1.5 flex items-center justify-between transition-colors duration-500 group-hover/card:bg-zinc-100 dark:group-hover/card:bg-zinc-800">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 transition-all duration-150 group-hover/card:bg-[#ff5f56] group-active/card:bg-[#e0443e]"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 transition-all duration-150 group-hover/card:bg-[#ffbd2e] group-active/card:bg-[#dfa123]"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 transition-all duration-150 group-hover/card:bg-[#27c93f] group-active/card:bg-[#1aab2e]"></span>
            </div>
            <span class="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 transition-colors group-hover/card:text-zinc-500 dark:group-hover/card:text-zinc-400">${project.websiteUrl ? new URL(project.websiteUrl).hostname.replace(/^www\\./, '') : 'Project'}</span>
          </div>
          <div class="bg-zinc-50/80 dark:bg-black/20 p-1">
            ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title} Preview" class="w-full aspect-video object-cover object-top rounded transition-transform duration-700 group-hover/card:scale-[1.01]" />` : `<div class="w-full aspect-video bg-zinc-100 dark:bg-zinc-900 rounded flex items-center justify-center text-xs text-zinc-400">No image</div>`}
          </div>
        </div>
        <div class="px-1.5 pt-3 pb-1 flex flex-col gap-2.5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-1.5">
                ${project.title || ''} <span class="text-sm select-none">${project.emoji || ''}</span>
              </h3>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">${project.subtitle || ''}</p>
            </div>
            ${project.websiteUrl ? `
              <span class="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-colors mt-1 group-hover/card:text-zinc-900 dark:group-hover/card:text-white">
                Visit
                <svg class="w-3 h-3 transform transition-all duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
              </span>
            ` : ''}
          </div>
          ${project.description ? `
            <p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              ${project.description}
            </p>
          ` : ''}
          ${project.tags && project.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1.5 pt-0.5">
              ${project.tags.map(tag => `
                <span class="text-[10px] font-medium tracking-tight bg-zinc-100 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded border border-zinc-200/50 dark:border-zinc-800/40">
                  ${tag}
                </span>
              `).join('')}
            </div>
          ` : ''}
          <div class="pt-2 mt-0.5 border-t border-zinc-100 dark:border-zinc-800/60 space-y-1.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>${project.speedTech || 'Instant Load Times • Optimized Tech'}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
              <span>${project.cmsManagement || 'Easy Package & Rate Updates • Sanity CMS'}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-[#f5c75d] shrink-0"></span>
              <span>${project.resultBooking || 'Direct Booking Flow • Zero Middleman Fees'}</span>
            </div>
          </div>
        </div>
      </${CardTag}>
      `;
    }).join('');
  } catch (error) {
    console.error('Sanity fetch error:', error);
    container.innerHTML = `<div class="col-span-1 sm:col-span-2 py-10 text-center text-xs font-mono text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg px-4">
      <p class="font-bold mb-2">Almost there! 🚀</p>
      <p>Please complete the Sanity initialization step to get your Project ID, then paste it into <code class="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">js/app.js</code> where it says <code>'YOUR_PROJECT_ID'</code>.</p>
    </div>`;
  }
}
