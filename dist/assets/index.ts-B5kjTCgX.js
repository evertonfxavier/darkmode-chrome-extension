(function(){const a="nightowl-dark-mode-style";function c(e){const{brightness:o,contrast:t,sepia:r,grayscale:i}=e;return`
    html {
      filter: invert(1) hue-rotate(180deg) brightness(${o/100}) contrast(${t/100}) sepia(${r/100}) grayscale(${i/100}) !important;
      background-color: #1a1a2e !important;
    }

    /* Preserve images, videos, and media */
    img,
    picture,
    video,
    canvas,
    iframe,
    svg,
    [style*="background-image"],
    .emoji,
    [data-testid="tweetPhoto"],
    [class*="avatar"],
    [class*="Avatar"],
    [class*="logo"],
    [class*="Logo"],
    [class*="image"],
    [class*="Image"],
    [class*="icon"],
    [class*="Icon"]:not(i):not(span),
    [class*="thumbnail"],
    [class*="Thumbnail"],
    [class*="photo"],
    [class*="Photo"],
    [class*="poster"],
    [class*="Poster"],
    [class*="cover"],
    [class*="Cover"],
    [role="img"],
    figure img,
    article img {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Fix for background images in divs */
    [style*="background-image"]:not(html):not(body) {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Preserve specific elements that shouldn't be inverted */
    .nightowl-preserve,
    [data-nightowl-preserve] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Fix color pickers and similar controls */
    input[type="color"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Smooth transition */
    * {
      transition: background-color 0.1s ease, color 0.1s ease, filter 0.1s ease !important;
    }
  `}function n(e){const o=window.location.hostname;if(e.whitelistedDomains.includes(o)){s();return}if(!e.enabled){s();return}if(e.mode==="auto"){if(!window.matchMedia("(prefers-color-scheme: dark)").matches){s();return}}else if(e.mode==="light"){s();return}let t=document.getElementById(a);if(!t){t=document.createElement("style"),t.id=a,t.setAttribute("type","text/css");const r=document.head||document.documentElement;r.insertBefore(t,r.firstChild)}t.textContent=c(e)}function s(){const e=document.getElementById(a);e&&e.remove()}chrome.runtime.onMessage.addListener((e,o,t)=>(e.type==="UPDATE_SETTINGS"&&(n(e.settings),t({success:!0})),!0));chrome.storage.sync.get(["darkModeSettings"],e=>{e.darkModeSettings&&n(e.darkModeSettings)});window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{chrome.storage.sync.get(["darkModeSettings"],e=>{e.darkModeSettings&&e.darkModeSettings.mode==="auto"&&n(e.darkModeSettings)})});const d=new MutationObserver(()=>{const e=document.getElementById(a);e&&!document.head.contains(e)&&chrome.storage.sync.get(["darkModeSettings"],o=>{o.darkModeSettings&&n(o.darkModeSettings)})});d.observe(document.documentElement,{childList:!0,subtree:!0});
})()
