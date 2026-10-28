(function(){
  function initPCC(){
    // 1. Mobile drawer & dropdowns
    var ham = document.querySelector(".hamburger-mob");
    var navLinks = document.querySelector(".nav-links");
    if (ham && navLinks && !ham.dataset.bound) {
      ham.dataset.bound = "1";
      ham.addEventListener("click", function(){
        var open = navLinks.classList.toggle("open");
        navLinks.style.display = open ? "flex" : "";
      });
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