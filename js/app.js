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
  const query = encodeURIComponent('*[_type == "project"] | order(order asc) { title, subtitle, description, websiteUrl, emoji, tags, "imageUrl": image.asset->url }');
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
        <div class="overflow-hidden rounded-lg transition-all duration-500" style="border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); box-shadow: 0 2px 20px rgba(0,0,0,0.2);" onmouseover="this.style.border='1px solid rgba(255,225,53,0.4)'; this.style.boxShadow='0 4px 30px rgba(0,0,0,0.3)';" onmouseout="this.style.border='1px solid rgba(255,255,255,0.15)'; this.style.boxShadow='0 2px 20px rgba(0,0,0,0.2)';">
          <div class="px-3 py-1.5 flex items-center justify-between" style="background: rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.10);">
            <div class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full transition-all duration-150 group-hover/card:bg-[#ff5f56]" style="background: rgba(255,255,255,0.25);"></span>
              <span class="w-1.5 h-1.5 rounded-full transition-all duration-150 group-hover/card:bg-[#ffbd2e]" style="background: rgba(255,255,255,0.25);"></span>
              <span class="w-1.5 h-1.5 rounded-full transition-all duration-150 group-hover/card:bg-[#27c93f]" style="background: rgba(255,255,255,0.25);"></span>
            </div>
            <span class="text-[9px] font-mono" style="color: rgba(255,255,255,0.35);">${project.websiteUrl ? new URL(project.websiteUrl).hostname.replace(/^www\./, '') : 'Project'}</span>
          </div>
          <div class="p-1" style="background: rgba(0,0,0,0.15);">
            ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title} Preview" class="w-full aspect-video object-cover object-top rounded transition-transform duration-700 group-hover/card:scale-[1.01]" />` : `<div class="w-full aspect-video rounded flex items-center justify-center text-xs" style="background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.3);">No image</div>`}
          </div>
        </div>
        <div class="px-1.5 pt-3 pb-1 flex flex-col gap-2.5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-base font-semibold tracking-tight flex items-center gap-1.5" style="color: #fff;">
                ${project.title || ''} <span class="text-sm select-none">${project.emoji || ''}</span>
              </h3>
              <p class="text-xs mt-0.5 font-medium" style="color: rgba(255,255,255,0.5);">${project.subtitle || ''}</p>
            </div>
            ${project.websiteUrl ? `
              <span class="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors group-hover/card:opacity-100" style="color: rgba(255,225,53,0.6);">
                Visit
                <svg class="w-3 h-3 transform transition-all duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>
              </span>
            ` : ''}
          </div>
          ${project.tags && project.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${project.tags.map(tag => `
                <span class="text-[10px] font-medium tracking-tight px-2 py-0.5 rounded" style="background: rgba(255,225,53,0.12); border: 1px solid rgba(255,225,53,0.25); color: rgba(255,225,53,0.85);">
                  ${tag}
                </span>
              `).join('')}
            </div>
          ` : ''}
          ${project.description ? `
            <p class="text-sm leading-relaxed font-light mt-1" style="color: rgba(255,255,255,0.58);">
              ${project.description}
            </p>
          ` : ''}
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
