(function () {
  const setupView = document.getElementById("setupView");
  const downloadView = document.getElementById("downloadView");
  const setupForm = document.getElementById("setupForm");
  const formHint = document.getElementById("formHint");
  const progressCard = document.getElementById("progressCard");
  const errorCard = document.getElementById("errorCard");
  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  const openChat = document.getElementById("openChat");
  const collapsedChat = document.getElementById("collapsedChat");
  const loadingChat = document.getElementById("loadingChat");
  const agentButton = document.getElementById("agentButton");

  let progressTimer;
  let errorTimer;

  function setProgress(value) {
    const safeValue = Math.max(0, Math.min(100, Math.round(value)));
    progressFill.style.width = safeValue + "%";
    progressPercent.textContent = safeValue + "%";
  }

  function startDownload() {
    setupView.classList.add("is-hidden");
    downloadView.classList.remove("is-hidden");
    progressCard.classList.remove("is-hidden");
    errorCard.classList.add("is-hidden");
    setProgress(13);

    const start = performance.now();
    const duration = 4700;
    clearInterval(progressTimer);
    clearTimeout(errorTimer);

    progressTimer = setInterval(function () {
      const elapsed = performance.now() - start;
      const ratio = Math.min(1, elapsed / duration);
      // The recording holds at a low percentage first, then advances quickly.
      const eased = ratio < 0.17 ? ratio / 0.17 * 0.12 : 0.12 + ((ratio - 0.17) / 0.83) * 0.60;
      setProgress(13 + eased * 100);
      if (ratio >= 1) {
        clearInterval(progressTimer);
        setProgress(72);
      }
    }, 120);

    errorTimer = setTimeout(showError, 6900);
  }

  function showError() {
    clearInterval(progressTimer);
    setProgress(80);
    progressCard.classList.add("is-hidden");
    errorCard.classList.remove("is-hidden");
  }

  setupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const fields = Array.from(setupForm.querySelectorAll("input"));
    const hasEmptyField = fields.some(function (field) {
      return !field.value.trim();
    });

    if (hasEmptyField) {
      formHint.classList.add("visible");
      fields.find(function (field) {
        return !field.value.trim();
      }).focus();
      return;
    }

    formHint.classList.remove("visible");
    startDownload();
  });

  openChat.addEventListener("click", function (event) {
    if (event.target.closest("button") || event.target.closest(".chat-fab")) return;
    openChat.classList.add("is-hidden");
    collapsedChat.classList.remove("is-hidden");
  });

  collapsedChat.addEventListener("click", function () {
    openChat.classList.remove("is-hidden");
    collapsedChat.classList.add("is-hidden");
  });

  loadingChat.addEventListener("click", function () {
    loadingChat.classList.toggle("is-hidden");
  });

  agentButton.addEventListener("click", function () {
    agentButton.textContent = "Connecting you to a live agent...";
    agentButton.classList.add("agent-button-active");
  });

  // Optional preview URLs make it easy to inspect either recorded state:
  // index.html?demo=loading or index.html?demo=error
  const demoState = new URLSearchParams(window.location.search).get("demo");
  if (demoState === "loading" || demoState === "error") {
    startDownload();
    if (demoState === "error") {
      setTimeout(showError, 80);
    }
  }
})();