const isOpenToWork = true;

window.addEventListener("DOMContentLoaded", () => {
    const langSelect = document.getElementById("language-select");
    const defaultLang = getPreferredLanguage();
    
    addOpenToWorkIndicator();
    
    langSelect.value = defaultLang;
    setLanguage(defaultLang);
    
    langSelect.addEventListener("change", () => {
        const lang = langSelect.value;
        localStorage.setItem("lang", lang);
        setLanguage(lang);
    });
});

function getPreferredLanguage() {
    const supported = ["en", "lt", "de", "ru"];
    const saved = localStorage.getItem("lang");
    const browser = navigator.language.slice(0, 2).toLowerCase();
    
    return supported.includes(saved)
    ? saved
    : supported.includes(browser)
    ? browser
    : "en";
}

function setLanguage(lang) {
    const t = translations[lang];
    if (!t) return;
    
    setStaticText(t);
    renderJobExperience(t.jobs);
    renderEducation(t.education, t);
    
    const tooltipSpan = document.querySelector("#open-to-work-indicator .tooltip-text");
    if (tooltipSpan) {
        tooltipSpan.textContent = t.openToWorkText || "Open to work";
    }
}

function setStaticText(t) {
    document.getElementById("name").textContent = t.name;
    document.getElementById("about-title").textContent = t.aboutTitle;
    document.getElementById("about-text").textContent = t.aboutText;
    document.getElementById("education-title").textContent = t.educationTitle;
    document.getElementById("experience-title").textContent = t.experienceTitle;
    document.getElementById("portfolio-title").textContent = t.portfolioTitle;
    document.getElementById("contacts-title").textContent = t.contactsTitle;
}

function renderJobExperience(jobs) {
    const container = document.getElementById("experience-entries");
    container.innerHTML = "";
    
    for (const job of Object.values(jobs)) {
        const jobDiv = document.createElement("div");
        jobDiv.className = "job";
        
        jobDiv.innerHTML = `
      <div class="job-header">
        <a href="${job.url}" target="_blank" rel="noopener noreferrer" class="logo-link" tabindex="-1">
          <img src="images/jobs/${job.image || 'default.png'}" alt="${job.place}" class="company-logo" />
        </a>
        <div class="job-info">
          <div class="job-title">
            ${job.role} @ ${job.place}
            <span class="date-tag">${job.date}</span>
          </div>
        </div>
      </div>
      <ul class="responsibilities">
        ${job.bullets.map(b => `<li>${b}</li>`).join("")}
      </ul>
    `;
        
        container.appendChild(jobDiv);
    }
}

function renderEducation(educationList, t) {
    const container = document.getElementById("education");
    container.querySelectorAll(".edu-entry").forEach(e => e.remove());
    
    educationList.forEach(edu => {
        const eduDiv = document.createElement("div");
        eduDiv.className = "edu-entry";
        
        eduDiv.innerHTML = `
      <div class="job-header">
        <a href="${edu.url}" target="_blank" rel="noopener noreferrer" class="logo-link" tabindex="-1">
          <img src="images/edu/${edu.image || 'default.png'}" alt="${edu.place}" class="company-logo" />
        </a>
        <div class="job-info">
          <div class="job-title">
            ${edu.place}
            <span class="date-tag">${edu.date}</span>
          </div>
        </div>
      </div>
      <div class="education-details">
        ${edu.field ? `<div><span class="label">➜ ${t.fieldLabel || "Field"}:</span> ${edu.field}</div>` : ""}
        <div><span class="label">➜ ${t.levelLabel || "Level of Education"}:</span> ${edu.level}</div>
      </div>
    `;
        
        container.appendChild(eduDiv);
    });
}

function addOpenToWorkIndicator() {
    const dropdown = document.querySelector(".language-dropdown");
    if (!dropdown) return;
    
    let existing = document.getElementById("open-to-work-wrapper");
    if (existing) existing.remove();
    
    if (!isOpenToWork) return;
    
    const wrapper = document.createElement("a");
    wrapper.id = "open-to-work-wrapper";
    wrapper.target = "_blank";
    wrapper.rel = "noopener noreferrer";
    wrapper.style.textDecoration = "none";
    
    const indicator = document.createElement("div");
    indicator.id = "open-to-work-indicator";
    
    const lang = document.getElementById("language-select").value || getPreferredLanguage();
    const tooltipText = translations[lang]?.openToWorkText || "Open to work";
    
    const tooltipSpan = document.createElement("span");
    tooltipSpan.className = "tooltip-text";
    tooltipSpan.textContent = tooltipText;
    
    indicator.appendChild(tooltipSpan);
    wrapper.appendChild(indicator);
    
    dropdown.parentElement.insertBefore(wrapper, dropdown);
}