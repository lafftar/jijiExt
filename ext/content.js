(() => {
  const BUTTON_ID = "jiji-whatsapp-button";
  const PHONE_SELECTOR = "a.qa-show-contact[href^='tel:']";
  const INSERTION_SELECTOR = ".b-start-chat";
  let CLICKED = false;

  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) {
      return null;
    }

    const cleaned = phone.replace(/\D/g, "");

    if (!cleaned) {
      return null;
    }

    if (cleaned.startsWith("234")) {
      return `+${cleaned}`;
    }

    if (cleaned.startsWith("0")) {
      return `+234${cleaned.substring(1)}`;
    }

    return `+234${cleaned}`;
  };

  const findPhoneNumber = () => {
    // if (!CLICKED) {
    //   try{
    //     document.querySelector('qa-show-contact').click();
    //     CLICKED = true
    //   } catch {
    //     console.error('could not click contact button')
    //   }
    // }
    const phoneLink = document.querySelector(PHONE_SELECTOR);
    if (!phoneLink) {
      return null;
    }

    const tel = phoneLink.getAttribute("href") || "";
    const telMatch = tel.match(/^tel:(.+)$/i);
    const raw = telMatch ? telMatch[1] : phoneLink.textContent;
    return raw ? raw.trim() : null;
  };

  const createWhatsAppButton = (phoneNumber) => {
    const button = document.createElement("a");
    button.id = BUTTON_ID;
    button.className = "jiji-whatsapp-button";
    button.textContent = "Text on WhatsApp";
    button.href = `https://wa.me/${phoneNumber}`;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    return button;
  };

  const insertButton = (button) => {
    const container = document.querySelector(INSERTION_SELECTOR);
    if (!container) {
      return false;
    }

    if (document.getElementById(BUTTON_ID)) {
      return true;
    }

    container.insertAdjacentElement("afterend", button);
    return true;
  };

  const ensureButton = () => {
    console.log('in ensure button')
    const rawPhone = findPhoneNumber();
    console.log(`found phone: ${rawPhone}`)
    const formatted = formatPhoneForWhatsApp(rawPhone);
    console.log(`formatted phone: ${formatted}`)

    if (!formatted) {
      return false;
    }

    if (document.getElementById(BUTTON_ID)) {
      return true;
    }

    const button = createWhatsAppButton(formatted);
    return insertButton(button);
  };

  const observer = new MutationObserver(() => {
    ensureButton();
  });

  const startObserver = () => {
    if (!document.body) {
      return;
    }

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      ensureButton();
      startObserver();
    });
  } else {
    ensureButton();
    startObserver();
  }
})();
