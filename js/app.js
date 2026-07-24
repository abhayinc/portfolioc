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
  const query = encodeURIComponent('*[_type == "project"] | order(order asc) { title, subtitle, description, websiteUrl, emoji, "imageUrl": image.asset->url }');
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

    container.innerHTML = projects.map(project => `
      <div class="space-y-3">
        <div class="overflow-hidden border border-zinc-100 dark:border-zinc-800/80 rounded-lg transition-all duration-300">
          <div class="bg-zinc-50/60 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-800/80 px-3 py-1.5 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
            </div>
            <span class="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">${project.websiteUrl ? new URL(project.websiteUrl).hostname : 'Project'}</span>
          </div>
          <div class="bg-zinc-50/20 dark:bg-black/10 p-1">
            ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title} Preview" class="w-full aspect-video object-cover object-top rounded" />` : `<div class="w-full aspect-video bg-zinc-100 dark:bg-zinc-900 rounded flex items-center justify-center text-xs text-zinc-400">No image</div>`}
          </div>
        </div>
        <div class="px-1.5 space-y-2">
          <div class="flex flex-col gap-1 text-sm sm:text-base">
            <h3 class="font-medium text-zinc-950 dark:text-zinc-100 flex items-center gap-1.5">${project.title || ''} <span class="text-xs text-zinc-400 select-none">${project.emoji || ''}</span></h3>
            <span class="text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500">${project.subtitle || ''}</span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            ${project.description || ''}
          </p>
          <div class="text-[11px] font-mono flex items-center gap-2 pt-0.5">
            ${project.websiteUrl ? `<a href="${project.websiteUrl}" target="_blank" rel="noopener" class="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors hover:underline">${new URL(project.websiteUrl).hostname} ↗</a>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Sanity fetch error:', error);
    container.innerHTML = `<div class="col-span-1 sm:col-span-2 py-10 text-center text-xs font-mono text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-lg px-4">
      <p class="font-bold mb-2">Almost there! 🚀</p>
      <p>Please complete the Sanity initialization step to get your Project ID, then paste it into <code class="bg-red-100 dark:bg-red-900/50 px-1 py-0.5 rounded">js/app.js</code> where it says <code>'YOUR_PROJECT_ID'</code>.</p>
    </div>`;
  }
}
