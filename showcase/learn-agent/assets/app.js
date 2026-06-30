/* ============================================================
   app.js — 渲染、导航、进度、代码高亮、循环模拟器
   纯原生 JS，无依赖，file:// 直接打开即可运行
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "agent101_progress";
  let current = 0;

  /* ---------- 进度存储 ---------- */
  function getDone() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function markDone(id) {
    const done = getDone();
    if (done.indexOf(id) === -1) {
      done.push(id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); }
      catch (e) { /* 隐私模式 / 受限环境下静默降级，不影响学习 */ }
    }
  }

  /* ---------- 极简语法高亮 ---------- */
  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const PY_KW = ["def","return","if","else","elif","for","while","in","not","and","or","import","from","class","lambda","True","False","None","with","as","try","except"];
  const PY_BUILTIN = ["print","len","open","range","str","int","dict","list","any","all","append"];

  // 每生成一个 span 就立刻换成「私有区占位字符」，后续 数字/关键字 高亮便绝不会
  // 误伤已生成的 HTML（比如属性里的 class=）。最后再一次性还原。
  function highlight(code) {
    const slots = [];
    const stash = function (html) {
      slots.push(html);
      return String.fromCharCode(0xE000 + slots.length - 1); // 单字符、非 \w、不含数字
    };

    let s = escapeHtml(code);

    // 1) 注释
    s = s.replace(/#[^\n]*/g, function (m) { return stash('<span class="tok-com">' + m + '</span>'); });
    // 2) 字符串（已转义，只剩裸引号）
    s = s.replace(/"[^"\n]*"|'[^'\n]*'/g, function (m) { return stash('<span class="tok-str">' + m + '</span>'); });
    // 3) 数字
    s = s.replace(/\b\d+\.?\d*\b/g, function (m) { return stash('<span class="tok-num">' + m + '</span>'); });
    // 4) def 后的函数名
    s = s.replace(/\bdef\s+([A-Za-z_]\w*)/g, function (m, name) {
      return stash('<span class="tok-kw">def</span>') + " " + stash('<span class="tok-fn">' + name + '</span>');
    });
    // 5) 函数 / 方法调用
    s = s.replace(/\b([A-Za-z_]\w*)(\s*\()/g, function (m, name, paren) {
      if (PY_KW.indexOf(name) !== -1) return m;
      const cls = PY_BUILTIN.indexOf(name) !== -1 ? "tok-builtin" : "tok-fn";
      return stash('<span class="' + cls + '">' + name + '</span>') + paren;
    });
    // 6) 关键字
    PY_KW.forEach(function (kw) {
      s = s.replace(new RegExp("\\b" + kw + "\\b", "g"), function (m) {
        return stash('<span class="tok-kw">' + m + '</span>');
      });
    });

    // 7) 还原占位字符
    return s.replace(new RegExp("[\\uE000-\\uF8FF]", "g"), function (c) {
      return slots[c.charCodeAt(0) - 0xE000];
    });
  }

  /* ---------- 把 <pre data-lang> 渲染成漂亮代码块 ---------- */
  function renderCodeBlocks(container) {
    container.querySelectorAll("pre[data-lang]").forEach(function (pre) {
      const code = pre.textContent;
      const file = pre.getAttribute("data-file") || "code.py";
      const wrap = document.createElement("div");
      wrap.className = "code-block";
      wrap.innerHTML =
        '<div class="code-head">' +
          '<span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>' +
          '<span class="fname">' + file + '</span>' +
        '</div>' +
        '<pre><code>' + highlight(code) + '</code></pre>';
      pre.replaceWith(wrap);
    });
  }

  /* ---------- 循环模拟器 ---------- */
  // 预编排剧本：演示「列出当前目录的 Python 文件」
  const SIM_SCRIPT = [
    { node: 0, lines: [["user", "用户", "列出当前目录里所有 Python 文件"]],
      note: "① 用户提出请求，作为第一条消息" },
    { node: 1, lines: [["sys", "→", "把对话 + 可用工具发给模型……"]],
      note: "② 消息送进模型" },
    { node: 1, lines: [["llm", "模型", '我需要用工具。调用 bash：<span class="hl">ls *.py</span>']],
      note: "③ 模型回复：它想调用工具（stop_reason = tool_use）" },
    { node: 2, lines: [["tool", "执行", "$ ls *.py"]],
      note: "④ 检测到 tool_use → 帮它执行命令" },
    { node: 2, lines: [["tool", "结果", "app.py  loop.py  tools.py"]],
      note: "⑤ 拿到工具输出" },
    { node: 1, lines: [["sys", "↩", "把结果喂回模型，回到第 ② 步继续循环"]],
      note: "⑥ 工具结果作为新消息，循环继续" },
    { node: 1, lines: [["llm", "模型", "当前目录有 3 个 Python 文件：app.py、loop.py、tools.py。"]],
      note: "⑦ 模型这次直接给答案，没调用工具（stop_reason ≠ tool_use）" },
    { node: 0, lines: [["sys", "✓", "模型没有再调用工具 → 退出循环，任务完成！"]],
      note: "⑧ 循环结束 ✅" }
  ];

  function buildSimulator() {
    const el = document.createElement("div");
    el.className = "sim";
    el.innerHTML =
      '<div class="sim-title">🔁 亲手走一遍 Agent 循环</div>' +
      '<div class="sim-sub">点「下一步」，看消息如何在「用户 → 模型 → 工具」之间流动，直到模型说「做完了」。</div>' +
      '<div class="sim-stage">' +
        '<div class="sim-node" data-n="0"><div class="ne">🙋</div><div class="nl">用户</div></div>' +
        '<div class="sim-arrow">→</div>' +
        '<div class="sim-node" data-n="1"><div class="ne">🧠</div><div class="nl">模型 (LLM)</div></div>' +
        '<div class="sim-arrow">→</div>' +
        '<div class="sim-node" data-n="2"><div class="ne">⚙️</div><div class="nl">工具执行</div></div>' +
      '</div>' +
      '<div class="sim-screen" data-screen></div>' +
      '<div class="sim-controls">' +
        '<button class="sim-btn" data-next>下一步 →</button>' +
        '<button class="sim-btn ghost" data-reset>重来</button>' +
        '<span class="sim-step-label" data-step></span>' +
      '</div>';

    let step = -1;
    const screen = el.querySelector("[data-screen]");
    const stepLabel = el.querySelector("[data-step]");
    const nextBtn = el.querySelector("[data-next]");
    const nodes = el.querySelectorAll(".sim-node");
    const arrows = el.querySelectorAll(".sim-arrow");

    function setActive(n) {
      nodes.forEach(function (nd) { nd.classList.toggle("active", +nd.dataset.n === n); });
      arrows.forEach(function (a, i) { a.classList.toggle("active", i < n); });
    }

    function render() {
      if (step < 0) {
        screen.innerHTML = '<div style="color:var(--text-mute)">点「下一步」开始演示 ↓</div>';
        setActive(0);
        stepLabel.textContent = "";
        nextBtn.disabled = false;
        nextBtn.textContent = "下一步 →";
        return;
      }
      screen.innerHTML = "";
      for (let i = 0; i <= step; i++) {
        SIM_SCRIPT[i].lines.forEach(function (parts, j) {
          const role = parts[0], label = parts[1], txt = parts[2];
          const line = document.createElement("div");
          line.className = "sim-line";
          line.style.animationDelay = (i === step ? j * 0.1 : 0) + "s";
          line.innerHTML = '<span class="role ' + role + '">' + label + '</span><span class="txt">' + txt + '</span>';
          screen.appendChild(line);
        });
      }
      const cur = SIM_SCRIPT[step];
      setActive(cur.node);
      stepLabel.textContent = cur.note;
      nextBtn.disabled = step >= SIM_SCRIPT.length - 1;
      nextBtn.textContent = step >= SIM_SCRIPT.length - 1 ? "完成 ✓" : "下一步 →";
    }

    nextBtn.addEventListener("click", function () {
      if (step < SIM_SCRIPT.length - 1) { step++; render(); }
    });
    el.querySelector("[data-reset]").addEventListener("click", function () { step = -1; render(); });

    render();
    return el;
  }

  /* ---------- 渲染单个 lesson ---------- */
  function renderLesson(idx) {
    current = idx;
    const lesson = LESSONS[idx];
    const main = document.getElementById("content");

    let header;
    if (lesson.hero) {
      header =
        '<div class="hero">' +
          '<span class="eyebrow">// 从 0 到 1 理解 AI Agent</span>' +
          '<h1>把 <span class="g">AI Agent</span><br>拆开给你看</h1>' +
          '<p class="lead">不讲玄学，不堆术语。从一个 20 行的循环开始，一步步看懂一个真正的 Agent 是怎么造出来的。</p>' +
          '<div class="formula">' +
            'Agent <span class="plus">=</span> <span class="model">模型</span> <span class="plus">+</span> <span class="harness">Harness</span><br>' +
            '<span style="font-size:13px;color:var(--text-mute)">（会思考的大脑）&nbsp;&nbsp;（能干活的身体）</span>' +
          '</div>' +
          '<div class="hero-stats">' +
            '<div class="hero-stat"><div class="n">20</div><div class="l">课时</div></div>' +
            '<div class="hero-stat"><div class="n">20</div><div class="l">行核心代码</div></div>' +
            '<div class="hero-stat"><div class="n">0→1</div><div class="l">完整理解</div></div>' +
          '</div>' +
        '</div>';
    } else {
      header =
        '<div class="lesson-meta">' +
          '<span class="chip stage">' + lesson.stage + '</span>' +
          '<span class="chip">第 ' + idx + ' 课 / 共 ' + (LESSONS.length - 1) + ' 课</span>' +
        '</div>' +
        '<h1>' + lesson.title + '</h1>' +
        '<div class="aphorism">💡 <span class="q">' + lesson.aphorism + '</span></div>';
    }

    main.innerHTML = '<div class="lesson">' + header + lesson.html + '</div>';

    renderCodeBlocks(main);

    main.querySelectorAll("[data-component='loop-sim']").forEach(function (slot) {
      slot.replaceWith(buildSimulator());
    });

    // 底部上一课 / 下一课
    const navWrap = document.createElement("div");
    navWrap.className = "lesson-nav";
    const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
    navWrap.innerHTML =
      '<a class="prev ' + (prev ? "" : "disabled") + '" ' + (prev ? 'data-goto="' + prev.id + '"' : "") + '>' +
        '<div class="dir">← 上一课</div><div class="ttl">' + (prev ? prev.nav : "") + '</div></a>' +
      '<a class="next ' + (next ? "" : "disabled") + '" ' + (next ? 'data-goto="' + next.id + '"' : "") + '>' +
        '<div class="dir">下一课 →</div><div class="ttl">' + (next ? next.nav : "") + '</div></a>';
    main.querySelector(".lesson").appendChild(navWrap);

    markDone(lesson.id);
    updateSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeSidebarMobile();
  }

  /* ---------- 侧边栏 ---------- */
  function buildSidebar() {
    const nav = document.getElementById("nav");
    let html = "";
    let lastStage = null;
    LESSONS.forEach(function (l, i) {
      if (l.stage !== lastStage) {
        html += '<div class="nav-group-title">' + l.stage + '</div>';
        lastStage = l.stage;
      }
      html +=
        '<div class="nav-item" data-idx="' + i + '" data-id="' + l.id + '">' +
          '<span class="nav-num">' + (i === 0 ? "★" : i) + '</span>' +
          '<span>' + l.nav + '</span>' +
        '</div>';
    });
    nav.innerHTML = html;
    nav.querySelectorAll(".nav-item").forEach(function (item) {
      item.addEventListener("click", function () { renderLesson(+item.dataset.idx); });
    });
  }

  function updateSidebar() {
    const done = getDone();
    document.querySelectorAll(".nav-item").forEach(function (item) {
      const idx = +item.dataset.idx;
      item.classList.toggle("active", idx === current);
      item.classList.toggle("done", done.indexOf(item.dataset.id) !== -1 && idx !== current);
    });
    const pct = Math.round((done.length / LESSONS.length) * 100);
    document.getElementById("progressFill").style.width = pct + "%";
    document.getElementById("progressLabel").textContent =
      "已学习 " + done.length + " / " + LESSONS.length + " 课 · " + pct + "%";
  }

  /* ---------- 移动端菜单 ---------- */
  function closeSidebarMobile() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");
  }

  /* ---------- 全局点击：data-goto 跳转 ---------- */
  document.addEventListener("click", function (e) {
    const goto = e.target.closest("[data-goto]");
    if (goto) {
      const id = goto.getAttribute("data-goto");
      const idx = LESSONS.findIndex(function (l) { return l.id === id; });
      if (idx >= 0) renderLesson(idx);
    }
  });

  /* ---------- 初始化 ---------- */
  function init() {
    buildSidebar();
    renderLesson(0);

    document.getElementById("menuToggle").addEventListener("click", function () {
      document.getElementById("sidebar").classList.toggle("open");
      document.getElementById("overlay").classList.toggle("show");
    });
    document.getElementById("overlay").addEventListener("click", closeSidebarMobile);
    document.querySelector(".brand").addEventListener("click", function () { renderLesson(0); });

    document.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight" && current < LESSONS.length - 1) renderLesson(current + 1);
      if (e.key === "ArrowLeft" && current > 0) renderLesson(current - 1);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
