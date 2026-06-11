// index.js – search, display, and interaction logic

$(document).ready(function() {
  const $resultContainer = $("#resultContainer");
  const $searchInput = $("#verbSearch");
  const $clearBtn = $("#clearBtn");

  function showResult(html) {
    $resultContainer.hide().html(html).fadeIn(250);
  }

  function performSearch() {
    const query = $searchInput.val().trim().toLowerCase();
    if (query === "") {
      showEmptyState();
      return;
    }

    const found = verbsData.find(verb => verb.present.toLowerCase() === query);
    if (found) {
      displayResult(found);
    } else {
      showNotFound(query);
    }
  }

  function displayResult(verb) {
    const html = `
      <div class="result-card p-4">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 class="mb-1 text-white"><i class="bi bi-translate"></i> ${verb.present} <span class="badge bg-white text-dark fs-6">verb</span></h2>
            <p class="text-muted mb-0">Present, past, past participle and Assamese meaning</p>
          </div>
          <span class="badge-assam"><i class="bi bi-globe"></i> অসমীয়া</span>
        </div>
        <div class="table-responsive mt-4">
          <table class="table verb-table table-bordered align-middle mb-0">
            <thead>
              <tr><th>Form</th><th>English</th><th>Assamese Meaning</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Present</strong></td><td>${verb.present}</td><td>${verb.assamese}</td></tr>
              <tr><td><strong>Past</strong></td><td>${verb.past}</td><td>${verb.assamese}</td></tr>
              <tr><td><strong>Past Participle</strong></td><td>${verb.pastParticiple}</td><td>${verb.assamese}</td></tr>
              ${verb.category ? `<tr><td><strong>Category</strong></td><td colspan="2">${verb.category || 'Regular Verbs'}</td></tr>` : ''}
            </tbody>
          </table>
        </div>
        <div class="mt-3 text-muted small">
          <i class="bi bi-info-circle"></i> Example: "I ${verb.present}", "He ${verb.past}", "It has been ${verb.pastParticiple}."
        </div>
      </div>
    `;
    showResult(html);
  }

  function showNotFound(query) {
    const html = `
      <div class="no-results">
        <i class="bi bi-exclamation-triangle-fill result-icon result-warning"></i>
        <h4 class="mt-3">“${escapeHtml(query)}” পোৱা নগ’ল</h4>
        <p class="mb-3">No verb found. Check spelling or try the base form (e.g., <strong>go, eat, write</strong>).</p>
        <button class="btn btn-outline-light mt-2" id="suggestBtn"><i class="bi bi-lightbulb-fill"></i> Show sample verbs</button>
      </div>
    `;
    showResult(html);
    $("#suggestBtn").on("click", () => {
      showResult(`
        <div class="no-results">
          <i class="bi bi-lightbulb-fill result-icon" style="color: #3bd2ff"></i>
          <h4 class="mt-3">Try these verbs</h4>
          <p class="mb-0">go, eat, write, become, understand, run, sing, build</p>
        </div>
      `);
    });
  }

  function showEmptyState() {
    showResult(`
      <div class="text-center py-5">
        <div class="hero-placeholder-icon">
          <i class="bi bi-search"></i>
        </div>
        <h4 class="mt-4">2000 verbs loaded</h4>
        <p class="mt-2 text-light-50 mb-0">Search by the present (base) form to view conjugations and Assamese meaning.</p>
      </div>
    `);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
      return m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;';
    });
  }

  $("#searchBtn").on("click", performSearch);
  $("#mobileSearchBtn").on("click", performSearch);
  $clearBtn.on("click", () => {
    $searchInput.val("").focus();
    showEmptyState();
  });

  $(".quick-tag").on("click", function() {
    $searchInput.val($(this).text());
    performSearch();
  });

  $searchInput.on("keypress", function(e) {
    if (e.which === 13) performSearch();
  });

  $searchInput.on("input", function() {
    if ($(this).val().trim()) {
      $clearBtn.removeClass("d-none");
    } else {
      $clearBtn.addClass("d-none");
    }
  });

  showEmptyState();
  $searchInput.focus();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // Service worker failed to register, app still works online.
    });
  }
});