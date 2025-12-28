const cardLink = "https://kennycha.github.io/wedding-card/";
const weddingDate = "2026-03-07T11:00:00+09:00";
const galleryImages = [
  "./images/image00.jpeg",
  "./images/image01.jpeg",
  "./images/image02.jpeg",
  "./images/image03.jpeg",
  "./images/image04.jpeg",
  "./images/image05.jpeg",
  "./images/image06.jpeg",
  "./images/image07.jpeg",
  "./images/image08.jpeg",
  "./images/image09.jpeg",
  "./images/image10.jpeg",
  "./images/image11.jpeg",
  "./images/image12.jpeg",
  "./images/image13.jpeg",
  "./images/image14.jpeg",
  "./images/image15.jpeg",
  "./images/image16.jpeg",
  "./images/image17.jpeg",
  "./images/image18.jpeg",
  "./images/image19.jpeg",
  "./images/image20.jpeg",
  "./images/image21.jpeg",
  "./images/image22.jpeg",
  "./images/image23.jpeg",
];

const accounts = [
  {
    label: "신랑 측",
    name: "차상구",
    bank: "우리은행",
    number: "760-07-017886",
  },
  {
    label: "신부 측",
    name: "권영락",
    bank: "국민은행",
    number: "071-24-0230-571",
  },
];

const contacts = [
  { role: "신랑", name: "차영부", phone: "010-2829-2179" },
  { role: "신부", name: "권혜원", phone: "010-4534-0626" },
];

let currentImageIndex = 0;

const copyText = async (text, message) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch (err) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showToast(message);
    } catch (e) {
      alert(message);
    }
    document.body.removeChild(textarea);
  }
};

const showToast = (message) => {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 14px 24px;
    border-radius: 50px;
    font-size: 14px;
    z-index: 10000;
    animation: toastSlide 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastSlideOut 0.3s ease";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
};

const renderGallery = () => {
  const slider = document.getElementById("gallerySlider");
  if (!slider) return;

  // 데스크톱 마우스 드래그 지원
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let clickAllowed = true;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    clickAllowed = true;
    slider.classList.add("dragging");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mouseup", (e) => {
    const wasDown = isDown;
    isDown = false;
    slider.classList.remove("dragging");

    // 클릭 처리 (드래그가 아닌 경우)
    if (wasDown && clickAllowed) {
      const slide = e.target.closest(".slide");
      if (slide) {
        const index = parseInt(slide.getAttribute("data-index"));
        if (!isNaN(index)) {
          openLightbox(index);
        }
      }
    }
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = x - startX;
    if (Math.abs(walk) > 5) {
      clickAllowed = false;
    }
    slider.scrollLeft = scrollLeft - walk;
  });

  // 갤러리 이미지 렌더링
  galleryImages.forEach((src, idx) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.setAttribute("data-index", idx);

    const img = document.createElement("img");
    img.src = src;
    img.alt = `우리 사진 ${idx + 1}`;
    img.loading = "lazy";
    img.draggable = false;

    slide.appendChild(img);
    slider.appendChild(slide);
  });
};

const openLightbox = (index) => {
  currentImageIndex = index;
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");

  if (!lightbox || !lightboxImage) return;

  lightboxImage.src = galleryImages[index];
  lightboxImage.alt = `우리 사진 ${index + 1}`;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  lightbox.classList.remove("active");
  document.body.style.overflow = "";
};

const navigateLightbox = (direction) => {
  if (direction === "prev") {
    currentImageIndex =
      (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  } else {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  }

  const lightboxImage = document.getElementById("lightboxImage");
  if (lightboxImage) {
    lightboxImage.src = galleryImages[currentImageIndex];
    lightboxImage.alt = `우리 사진 ${currentImageIndex + 1}`;
  }
};

const renderAccounts = () => {
  const list = document.getElementById("accountList");
  if (!list) return;

  accounts.forEach((account) => {
    const item = document.createElement("div");
    item.className = "account-item";

    const text = document.createElement("div");
    text.className = "account-text";
    text.innerHTML = `
      <span class="label">${account.label}</span>
      <strong>${account.name}</strong>
      <span class="value">${account.bank} ${account.number}</span>
    `;

    const button = document.createElement("button");
    button.className = "copy-btn";
    button.textContent = "복사";
    button.addEventListener("click", () => {
      copyText(
        `${account.bank} ${account.number}`,
        "계좌번호가 복사되었습니다."
      );
    });

    item.append(text, button);
    list.appendChild(item);
  });
};

const renderContacts = () => {
  const list = document.getElementById("contactList");
  if (!list) return;

  contacts.forEach((contact) => {
    const card = document.createElement("div");
    card.className = "contact-card";

    const label = document.createElement("p");
    label.className = "label";
    label.textContent = contact.role;

    const value = document.createElement("p");
    value.className = "value";
    value.textContent = `${contact.name} · ${contact.phone}`;

    const callBtn = document.createElement("button");
    callBtn.className = "call-btn";
    callBtn.textContent = "전화";
    callBtn.addEventListener("click", () => {
      window.location.href = `tel:${contact.phone.replace(/-/g, "")}`;
    });

    value.appendChild(callBtn);
    card.append(label, value);
    list.appendChild(card);
  });
};

const updateDday = () => {
  const target = new Date(weddingDate);
  const now = new Date();

  // 시간을 00:00:00으로 설정하여 날짜만 비교
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const el = document.getElementById("ddayDisplay");
  if (!el) return;

  if (diffDays > 0) {
    el.textContent = `D-${diffDays}`;
  } else if (diffDays === 0) {
    el.textContent = "오늘입니다";
  } else {
    const daysPassed = Math.abs(diffDays);
    if (daysPassed === 1) {
      el.textContent = "어제입니다";
    } else {
      el.textContent = "축하해 주셔서 감사합니다";
    }
  }
};

const wireActions = () => {
  const copyBtn = document.getElementById("copyLink");
  const copyAddressBtn = document.getElementById("copyAddress");
  const lightbox = document.getElementById("lightbox");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      copyText(cardLink, "링크가 복사되었습니다.");
    });
  }

  // Lightbox 이벤트
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateLightbox("prev");
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateLightbox("next");
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // 키보드 네비게이션
  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox || !lightbox.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      navigateLightbox("prev");
    } else if (e.key === "ArrowRight") {
      navigateLightbox("next");
    }
  });
};

// CSS 애니메이션 추가
const addToastStyles = () => {
  if (document.getElementById("toast-styles")) return;

  const style = document.createElement("style");
  style.id = "toast-styles";
  style.textContent = `
    @keyframes toastSlide {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    @keyframes toastSlideOut {
      from {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      to {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
    }
  `;
  document.head.appendChild(style);
};

document.addEventListener("DOMContentLoaded", () => {
  addToastStyles();
  renderGallery();
  renderAccounts();
  renderContacts();
  wireActions();
  updateDday();

  // D-Day 업데이트를 매일 자정에 실행
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      updateDday();
    }
  }, 60000); // 1분마다 체크
});
