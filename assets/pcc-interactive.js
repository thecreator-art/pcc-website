(function(){
  function initPCC(){
    // 1. Mobile drawer. A modal keeps focus and touch input inside the menu.
    var ham = document.querySelector(".hamburger-mob");
    var navLinks = document.querySelector(".nav-links");
    if (ham && navLinks && !ham.dataset.bound) {
      ham.dataset.bound = "1";
      ham.setAttribute("aria-label", "Open menu");
      ham.setAttribute("aria-expanded", "false");
      ham.setAttribute("aria-controls", "pcc-mobile-menu");
      var menu = document.createElement("dialog");
      menu.id = "pcc-mobile-menu";
      menu.className = "pcc-menu";
      menu.setAttribute("aria-label", "Mobile navigation");
      menu.innerHTML = '<div class="pcc-menu-head"><a href="/" aria-label="Post Construction Cleaners home"><img src="/pcc-logo.png" alt="Post Construction Cleaners" width="160" height="80"></a><button class="pcc-menu-close" type="button" aria-label="Close menu" autofocus>×</button></div><nav class="pcc-menu-links" aria-label="Main navigation"></nav><div class="pcc-menu-foot"><a class="pcc-menu-quote" href="/#quote">Get a Free Quote <span aria-hidden="true">↗</span></a><a class="pcc-menu-phone" href="tel:2133103848">(213) 310-3848</a><p>Los Angeles &amp; surrounding communities</p></div>';
      var mobileLinks = menu.querySelector(".pcc-menu-links");
      navLinks.querySelectorAll(":scope > .nav-item").forEach(function(item){
        var submenu = item.querySelector(".dropdown");
        if (submenu) {
          var group = document.createElement("details");
          var summary = document.createElement("summary");
          summary.textContent = item.querySelector("span").textContent.trim();
          group.appendChild(summary);
          var sub = document.createElement("div");
          sub.className = "pcc-menu-sub";
          submenu.querySelectorAll("a").forEach(function(link){ sub.appendChild(link.cloneNode(true)); });
          group.appendChild(sub);
          mobileLinks.appendChild(group);
        } else {
          var link = item.querySelector("a");
          if (link) mobileLinks.appendChild(link.cloneNode(true));
        }
      });
      menu.querySelectorAll("a").forEach(function(link){
        if (link.pathname.replace(/\/$/, "") === location.pathname.replace(/\/$/, "") && !link.hash && link.protocol !== "tel:") link.setAttribute("aria-current", "page");
      });
      document.body.appendChild(menu);
      var scrollY = 0;
      var closeTimer;
      var closing = false;
      var savedBodyStyle;
      function finishClose(){
        clearTimeout(closeTimer);
        menu.close();
        Object.keys(savedBodyStyle).forEach(function(key){ document.body.style[key] = savedBodyStyle[key]; });
        document.documentElement.classList.remove("pcc-menu-active");
        window.scrollTo({top: scrollY, behavior: "instant"});
        ham.setAttribute("aria-expanded", "false");
        ham.focus({preventScroll: true});
        closing = false;
      }
      function closeMenu(immediate){
        if (!menu.open || closing) return;
        closing = true;
        menu.classList.remove("is-open");
        if (immediate || matchMedia("(prefers-reduced-motion: reduce)").matches) finishClose();
        else closeTimer = setTimeout(finishClose, 320);
      }
      ham.addEventListener("click", function(){
        if (menu.open) return;
        scrollY = window.scrollY;
        savedBodyStyle = {position: document.body.style.position, top: document.body.style.top, width: document.body.style.width, overflow: document.body.style.overflow};
        document.body.style.position = "fixed";
        document.body.style.top = -scrollY + "px";
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
        document.documentElement.classList.add("pcc-menu-active");
        ham.setAttribute("aria-expanded", "true");
        menu.showModal();
        menu.scrollTop = 0;
        requestAnimationFrame(function(){ requestAnimationFrame(function(){ if (menu.open && !closing) menu.classList.add("is-open"); }); });
      });
      menu.querySelector(".pcc-menu-close").addEventListener("click", function(){ closeMenu(false); });
      menu.addEventListener("cancel", function(event){ event.preventDefault(); closeMenu(false); });
      menu.addEventListener("click", function(event){
        if (event.target === menu) {
          var rect = menu.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right) closeMenu(false);
        }
        if (event.target.closest("a")) closeMenu(true);
      });
      matchMedia("(min-width: 1101px)").addEventListener("change", function(event){ if (event.matches) closeMenu(true); });
      window.addEventListener("pagehide", function(){ closeMenu(true); });
    }
    // 2. Sticky Quote Toggle
    var sqBtn = document.querySelector(".sticky-quote-toggle");
    var sqPanel = document.querySelector(".sticky-quote-panel");
    if (sqBtn && sqPanel && !sqBtn.dataset.bound) {
      sqBtn.dataset.bound = "1";
      var isOpen = false;
      sqBtn.addEventListener("click", function(){
        isOpen = !isOpen;
        sqPanel.style.right = isOpen ? "0px" : "-340px";
        sqBtn.style.right = isOpen ? "340px" : "0px";
      });
    }
    // 3. Lead forms -> GHL webhook
    document.querySelectorAll("form").forEach(function(form){
      if (form.dataset.bound) return;
      form.dataset.bound = "1";
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var btn = form.querySelector("button[type='submit']");
        if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
        var fd = new FormData(form);
        var payload = {
          firstName: fd.get("firstName") || "",
          lastName: fd.get("lastName") || "",
          phone: fd.get("phone") || "",
          email: fd.get("email") || "",
          address: fd.get("address") || "",
          service: fd.get("service") || ""
        };
        fetch("https://services.leadconnectorhq.com/hooks/d28hmFslBr6UCesUM8Mw/webhook-trigger/0a13bd9d-7586-4742-809f-189288d27fbc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).catch(function(){}).finally(function(){
          form.innerHTML = "<div style='padding:28px 16px;text-align:center'><h3 style='font-size:20px;font-weight:900;margin-bottom:8px'>Quote Request Received!</h3><p style='font-size:14px;opacity:0.85'>Thank you! Hanniel and the Post Construction Cleaners dispatch team will contact you within 2 hours, or call us now at (213) 310-3848.</p></div>";
        });
      });
    });
    // 4. Table data-label helper
    document.querySelectorAll("table").forEach(function(t){
      var h = [].map.call(t.querySelectorAll("thead th, tr:first-child th"), function(x){ return x.textContent.trim(); });
      if (!h.length) return;
      t.querySelectorAll("tbody tr").forEach(function(r){
        [].forEach.call(r.children, function(c, i){
          if (c.tagName === "TD" && !c.hasAttribute("data-label") && h[i]) c.setAttribute("data-label", h[i]);
        });
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initPCC);
  else initPCC();
})();
