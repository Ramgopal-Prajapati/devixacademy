/**
 * DeviX Academy - Native Web3Forms POST Helper, Visual Validation, Spam Protection
 * & Smart Post-Submit Form Reset on Browser Back / Reload
 */

(function () {
  "use strict";

  const SUBMIT_STORAGE_KEY = "devix_last_submitted_form";
  const SUBMIT_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour window for return-from-Web3Forms reset

  function safeStorageGet(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function safeStorageSet(key, val) {
    try {
      window.sessionStorage.setItem(key, val);
    } catch (_) {}
  }

  function safeStorageRemove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (_) {}
  }

  function getFormKey(form, idx) {
    const id = form.getAttribute("id");
    if (id) return `${window.location.pathname}#${id}`;
    return `${window.location.pathname}#form-${idx}`;
  }

  function initWeb3Forms() {
    const forms = Array.from(
      document.querySelectorAll('form[action*="web3forms.com"], form[data-web3form]')
    );
    if (!forms.length) return;

    const cfg = window.DEVIX_CONFIG?.web3forms || {};
    const configKey = (cfg.accessKey || "").trim();
    const configEndpoint = (cfg.endpoint || "").trim();
    const configFromName = (cfg.fromName || "").trim();

    let pendingSubmit = null;

    const syncConfigInputs = (form) => {
      if (configEndpoint) {
        form.setAttribute("action", configEndpoint);
      }
      if (!form.getAttribute("method")) {
        form.setAttribute("method", "POST");
      }

      const keyInput = form.querySelector('input[name="access_key"]');
      if (keyInput && configKey && configKey !== "YOUR_WEB3FORMS_ACCESS_KEY") {
        keyInput.value = configKey;
      }

      const fromInput = form.querySelector('input[name="from_name"]');
      if (fromInput && configFromName) {
        fromInput.value = configFromName;
      }
    };

    const clearUserInputs = (form) => {
      if (typeof form.reset === "function") {
        form.reset();
      }
      // Explicitly clear any bfcache/history-restored text values while preserving hidden fields
      form
        .querySelectorAll(
          'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea'
        )
        .forEach((field) => {
          field.value = field.defaultValue || "";
        });
      form.querySelectorAll("select").forEach((sel) => {
        sel.selectedIndex = 0;
      });
      form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((box) => {
        box.checked = Boolean(box.defaultChecked);
      });
      form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
      syncConfigInputs(form);
    };

    forms.forEach((form, idx) => {
      const formKey = getFormKey(form, idx);
      form.dataset.devixFormKey = formKey;
      syncConfigInputs(form);

      const statusEl = form.querySelector(".form-status-alert");
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "Submit";
      let resetTimer = null;

      // Clear invalid or previous confirmation messages cleanly when user edits a field
      const handleFieldEdit = (e) => {
        if (e.target.classList?.contains("is-invalid")) {
          e.target.classList.remove("is-invalid");
        }
        if (statusEl && statusEl.classList.contains("is-error") && form.checkValidity()) {
          statusEl.className = "form-status-alert";
          statusEl.textContent = "";
        } else if (statusEl && statusEl.classList.contains("is-success")) {
          statusEl.className = "form-status-alert";
          statusEl.textContent = "";
        }
      };
      form.addEventListener("input", handleFieldEdit);
      form.addEventListener("change", handleFieldEdit);

      // Mirror native HTML5 validation failures into DeviX red border styling
      form.addEventListener(
        "invalid",
        (e) => {
          pendingSubmit = null;
          const target = e.target;
          if (target && target.classList) {
            target.classList.add("is-invalid");
          }
          if (statusEl) {
            const labelEl = target?.id
              ? form.querySelector(`label[for="${target.id}"]`)
              : null;
            const fieldName = labelEl
              ? labelEl.textContent.replace("*", "").trim()
              : "highlighted required fields";
            statusEl.className = "form-status-alert is-visible is-error";
            statusEl.textContent = `Please complete "${fieldName}" properly before submitting.`;
          }
        },
        true
      );

      // Allow native HTML form POST directly to Web3Forms after honeypot & connection verification
      form.addEventListener("submit", (e) => {
        pendingSubmit = null;

        const botField = form.querySelector('input[name="botcheck"]');
        const isBot = botField
          ? botField.type === "checkbox" || botField.type === "radio"
            ? Boolean(botField.checked)
            : Boolean(botField.value && botField.value.trim() !== "")
          : false;

        if (isBot) {
          e.preventDefault();
          return;
        }

        const activeKey = (form.querySelector('input[name="access_key"]')?.value || "").trim();
        if (!activeKey || activeKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
          e.preventDefault();
          if (statusEl) {
            statusEl.className = "form-status-alert is-visible is-error";
            statusEl.textContent = "Web3Forms access key is missing in js/config.js.";
          }
          return;
        }

        if (typeof navigator !== "undefined" && navigator.onLine === false) {
          e.preventDefault();
          if (statusEl) {
            statusEl.className = "form-status-alert is-visible is-error";
            statusEl.textContent =
              "No internet connection detected. Your entered details are still saved below so you can try again once online.";
          }
          return;
        }

        form.querySelectorAll('input[type="email"], input[type="tel"]').forEach((inp) => {
          if (typeof inp.value === "string") {
            inp.value = inp.value.trim();
          }
        });
        form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));

        // Track that this form genuinely passed validation & initiated submission navigation
        pendingSubmit = { key: formKey, at: Date.now() };

        if (statusEl) {
          statusEl.className = "form-status-alert is-visible is-info";
          statusEl.textContent = "Submitting your form securely to DeviX Academy...";
        }

        if (submitBtn) {
          submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...`;
          clearTimeout(resetTimer);
          resetTimer = setTimeout(() => {
            submitBtn.innerHTML = originalBtnHTML;
          }, 6000);
        }
      });

      form._devixRestoreBtn = () => {
        clearTimeout(resetTimer);
        if (submitBtn) submitBtn.innerHTML = originalBtnHTML;
        if (statusEl && statusEl.classList.contains("is-info")) {
          statusEl.className = "form-status-alert";
          statusEl.textContent = "";
        }
      };

      form._devixResetSubmitted = () => {
        clearTimeout(resetTimer);
        clearUserInputs(form);
        if (submitBtn) submitBtn.innerHTML = originalBtnHTML;
        if (statusEl) {
          statusEl.className = "form-status-alert is-visible is-success";
          statusEl.textContent =
            "Thank you! Your previous form was submitted successfully and fields have been cleared.";
        }
      };
    });

    // Persist submitted marker ONLY when the browser actually leaves the page for Web3Forms POST
    window.addEventListener("pagehide", () => {
      if (pendingSubmit && Date.now() - pendingSubmit.at < 30000) {
        safeStorageSet(SUBMIT_STORAGE_KEY, JSON.stringify(pendingSubmit));
      }
      pendingSubmit = null;
    });

    // On return (bfcache Back button OR "Go back" navigation), reset ONLY if submitted cleanly while online
    const handleReturnState = () => {
      pendingSubmit = null;

      let submittedRecord = null;
      const raw = safeStorageGet(SUBMIT_STORAGE_KEY);
      if (raw) {
        try {
          submittedRecord = JSON.parse(raw);
        } catch (_) {
          submittedRecord = null;
        }
        safeStorageRemove(SUBMIT_STORAGE_KEY);
      }

      const isFreshSubmission =
        submittedRecord &&
        submittedRecord.key &&
        Date.now() - (submittedRecord.at || 0) < SUBMIT_MAX_AGE_MS &&
        (typeof navigator === "undefined" || navigator.onLine !== false);

      forms.forEach((form) => {
        if (isFreshSubmission && form.dataset.devixFormKey === submittedRecord.key) {
          form._devixResetSubmitted?.();
          // Guard against delayed browser history autofill restoration
          if (typeof window.requestAnimationFrame === "function") {
            window.requestAnimationFrame(() => form._devixResetSubmitted?.());
          }
        } else {
          form._devixRestoreBtn?.();
        }
      });
    };

    window.addEventListener("pageshow", handleReturnState);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWeb3Forms);
  } else {
    initWeb3Forms();
  }
})();
