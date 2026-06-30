/* ============================================================
   课程内容数据
   每个 lesson: { id, stage, nav, title, aphorism, html }
   html 中可用约定标记由 app.js 渲染（代码块用 <pre data-lang>）
   完整对应 learn-claude-code 的 20 个小节（s01 ~ s20）+ 1 开篇
   ============================================================ */

const LESSONS = [
  /* ---------- 0. 开篇 ---------- */
  {
    id: "intro",
    stage: "开始之前",
    nav: "Agent 是什么",
    title: "Agent 到底是什么？",
    aphorism: "Agent ＝ 模型（会思考的大脑）＋ Harness（能干活的身体）",
    hero: true,
    html: `
<p>你可能听过无数次「AI Agent」这个词，但它常常被讲得云里雾里。这套教程的目标只有一个：<strong>用最简单的方式，带你从 0 到 1 真正理解一个 Agent 是怎么造出来的。</strong></p>

<p>不需要你是 AI 专家。只要你写过一点代码、用过 ChatGPT 这类工具，就能跟下来。</p>

<div class="analogy">
  <div class="emoji">🧠</div>
  <div class="body">
    <h4>一句话先记住</h4>
    <p>智能（会感知、会推理、会决策的能力）来自<strong>模型</strong>本身——它是被训练出来的，不是被代码写出来的。我们要做的，是给这个聪明的大脑装上「手、眼、记忆和工作台」，让它能真正去干活。这套外部设施，就叫 <strong>Harness（载具）</strong>。</p>
  </div>
</div>

<h2><span class="ic">🚗</span>大脑 vs 载具</h2>
<p>打个比方：模型（比如 Claude、GPT）就像一个聪明绝顶但被关在小黑屋里的人——他能思考、能回答，但<strong>看不见外面、也碰不到任何东西</strong>。</p>
<ul>
  <li>给他一双眼睛 → 他能读文件、看报错（<strong>工具</strong>）</li>
  <li>给他一双手 → 他能写代码、跑命令（<strong>工具</strong>）</li>
  <li>给他一个本子 → 他能记住做过什么（<strong>记忆 / 上下文</strong>）</li>
  <li>给他规矩 → 危险操作要先问你（<strong>权限</strong>）</li>
</ul>
<p>这些「眼、手、本子、规矩」加在一起，就是 Harness。<strong>这套教程教的，就是怎么造这个 Harness。</strong></p>

<div class="callout key">
  <span class="t">🔑 关键认知</span>
  你不是在「编写智能」。智能在模型里已经有了。你是在<strong>给智能搭一个能干活的世界</strong>。这个世界搭得越好，模型就越能发挥。
</div>

<h2><span class="ic">⚠️</span>什么不是 Agent</h2>
<p>很多所谓的「Agent 平台」其实只是：用一堆 if-else 分支、节点连线、固定流程，把大模型的 API 调用串起来。这不是 Agent——这是<strong>一个有妄想症的脚本</strong>。真正的 Agent，是让模型自己决定下一步做什么，而不是你提前写死每一步。</p>

<h2><span class="ic">🗺️</span>这套教程怎么走</h2>
<p>我们会从<strong>最小的 Agent（一个循环 + 一个工具）</strong>开始，一步步加东西，每一章只加一个新机制。完整 <strong>20 课</strong>，对应素材仓库 <code>learn-claude-code</code> 的 s01 ~ s20：</p>
<ul>
  <li><strong>第一阶段 · 让它能动手</strong>：循环、工具、权限、钩子</li>
  <li><strong>第二阶段 · 让它会做复杂任务</strong>：计划、子 Agent、技能、压缩、记忆、提示词、错误恢复</li>
  <li><strong>第三阶段 · 让它长期可靠运转</strong>：任务系统、后台任务、定时调度</li>
  <li><strong>第四阶段 · 让它组队与扩展</strong>：团队、协议、自治、目录隔离、MCP、完整体</li>
</ul>
<p>每一章都有一句「口诀」帮你记住核心。准备好了吗？点下面开始 👇</p>

<div style="text-align:center; margin-top:40px;">
  <button class="cta" data-goto="loop">开始第一课 · 最小的 Agent →</button>
</div>
`
  },

  /* ---------- s01. Agent Loop ---------- */
  {
    id: "loop",
    stage: "第一阶段 · 让它能动手",
    nav: "1 · Agent 循环",
    title: "一个循环，就是一个 Agent",
    aphorism: "One loop & Bash is all you need — 一个工具 + 一个循环 = 一个 Agent",
    html: `
<h2><span class="ic">🤔</span>先看一个痛点</h2>
<p>你对 ChatGPT 说：「帮我看看当前目录有哪些文件」。它会回你一句 <code>ls</code> 命令——然后就停住了。它<strong>不会自己去跑</strong>，更不会看到结果后接着干。</p>
<p>于是你只能：手动跑一遍 → 把结果粘回去 → 它给下一条命令 → 你再跑 → 再粘回去……</p>
<p><strong>每一个来回，都是你在当「中间人」。</strong>把这个中间人的活儿自动化——这就是 Agent 的全部秘密。</p>

<h2><span class="ic">🔁</span>核心就是一个 while 循环</h2>
<p>整个 Agent 的灵魂，只有两个信号：</p>
<ul>
  <li>模型说「我要用工具」→ 帮它执行，把结果喂回去，<strong>继续循环</strong></li>
  <li>模型说「我做完了」→ <strong>退出循环</strong></li>
</ul>

<div class="analogy">
  <div class="emoji">🎮</div>
  <div class="body">
    <h4>像在玩接力</h4>
    <p>模型每说一句话，你就检查：它是想动手（调工具），还是想收尾（给答案）？想动手就帮它动手、把现场情况告诉它；想收尾就结束。如此往复，直到它说「搞定」。</p>
  </div>
</div>

<p>下面这个模拟器，把这个循环一步步演示给你看。<strong>点「下一步」</strong>，跟着走一遍——你会发现 Agent 真的没那么神秘：</p>

<div data-component="loop-sim"></div>

<h2><span class="ic">💻</span>翻译成代码</h2>
<p>把刚才的过程写成 Python，不到 20 行。这就是一个能跑的 Agent 内核：</p>

<pre data-lang="python" data-file="agent_loop.py">def agent_loop(messages):
    while True:
        # 1. 把对话和可用工具发给模型
        response = client.messages.create(
            model=MODEL, system=SYSTEM,
            messages=messages, tools=TOOLS,
        )
        # 2. 记下模型这一轮说了什么
        messages.append({"role": "assistant", "content": response.content})

        # 3. 模型没调工具？说明它做完了，退出
        if response.stop_reason != "tool_use":
            return

        # 4. 模型调了工具 → 逐个执行，收集结果
        results = []
        for block in response.content:
            if block.type == "tool_use":
                output = run_bash(block.input["command"])
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })
        # 5. 把工具结果喂回去，回到第 1 步继续
        messages.append({"role": "user", "content": results})</pre>

<div class="callout key">
  <span class="t">🔑 记住这件事</span>
  <strong>模型负责决策</strong>（要不要用工具、用哪个），<strong>代码只负责执行</strong>（跑一下、把结果递回去）。后面所有 19 章，都是在这个循环上「叠零件」，<strong>循环本身一个字都不用改</strong>。
</div>

<p>真实的 Claude Code 这部分有 1700 多行代码，但核心就是上面这 20 行。多出来的全是「保护机制」：重试、超时、流式处理……骨架完全一样。</p>
`
  },

  /* ---------- s02. Tool Use ---------- */
  {
    id: "tools",
    stage: "第一阶段 · 让它能动手",
    nav: "2 · 工具",
    title: "给它一双手：工具",
    aphorism: "加一个工具，只加一个 handler — 循环不用动，新工具注册进去就行",
    html: `
<h2><span class="ic">🔨</span>只有 bash 太憋屈</h2>
<p>上一章 Agent 只有一个 <code>bash</code> 工具。想读文件得拼 <code>cat path</code>，想写文件得拼 <code>echo "..." &gt; file</code>，想找文件得拼 <code>find</code>……</p>
<p>模型心里想的明明是「读这个文件」，却要翻译成一长串命令。<strong>多一层翻译，就多一分出错和浪费。</strong>不如直接给它一个叫 <code>read_file</code> 的工具。</p>

<h2><span class="ic">🗂️</span>工具的本质：一张「查找表」</h2>
<p>给 Agent 加工具，永远只做两件事：</p>
<ol>
  <li><strong>告诉模型有这个工具</strong>（名字 + 描述 + 参数），让它知道可以用</li>
  <li><strong>写一个函数实现它</strong>，并登记到一张「名字 → 函数」的表里</li>
</ol>

<pre data-lang="python" data-file="tools.py"># 告诉模型：你有这些工具可以用
TOOLS = [
    {"name": "bash",       "description": "运行 shell 命令"},
    {"name": "read_file",  "description": "读取文件内容"},
    {"name": "write_file", "description": "写入文件"},
    {"name": "edit_file",  "description": "替换文件里的文字"},
    {"name": "glob",       "description": "按模式查找文件"},
]

# 一张查找表：工具名字 → 真正执行的函数
TOOL_HANDLERS = {
    "bash":       run_bash,
    "read_file":  run_read,
    "write_file": run_write,
    "edit_file":  run_edit,
    "glob":       run_glob,
}</pre>

<p>那循环里要改什么？<strong>只改一行</strong>——原来写死的 <code>run_bash(...)</code>，换成查表：</p>

<pre data-lang="python" data-file="agent_loop.py"># 之前：output = run_bash(block.input["command"])
# 现在：根据工具名字，查表找到对应函数来执行
handler = TOOL_HANDLERS[block.name]
output  = handler(**block.input)</pre>

<div class="analogy">
  <div class="emoji">🧰</div>
  <div class="body">
    <h4>像往工具箱里加工具</h4>
    <p>工具箱（循环）的结构不变，你只是往里多放一把螺丝刀。模型看一眼工具箱，自己挑趁手的用。要加第 100 个工具？还是这两步——加描述、加函数。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 设计工具的诀窍</span>
  工具要<strong>原子化、好组合、描述清楚</strong>。描述写得好，模型才知道什么时候该用它。工具的描述，其实就是写给模型看的「说明书」。
</div>

<h2><span class="ic">⚡</span>一个彩蛋：并发</h2>
<p>模型有时会一口气要调好几个工具（比如同时读 3 个文件）。互不影响的工具可以<strong>同时跑</strong>，省时间；会互相干扰的（比如同时改同一个文件）就得排队。这就是「并发安全」的考量——但别担心，现在只要知道有这回事就行。</p>
`
  },

  /* ---------- s03. Permission ---------- */
  {
    id: "permission",
    stage: "第一阶段 · 让它能动手",
    nav: "3 · 权限",
    title: "立规矩：权限",
    aphorism: "工具执行前先做权限判断 — 先判断能不能做、要不要先问你",
    html: `
<h2><span class="ic">😱</span>放手之前先想想</h2>
<p>现在 Agent 能跑任意命令、能改任意文件了。爽是爽，但如果它一时「想多了」跑了个 <code>rm -rf</code> 把你文件删了呢？</p>
<p>我们需要在「模型决定要做」和「真正执行」之间，插一道<strong>关卡</strong>。</p>

<h2><span class="ic">🚦</span>三种处置：放行 / 询问 / 拒绝</h2>
<p>每当模型要调一个工具，先过一遍规则，得出三选一的结论：</p>
<ul>
  <li><strong>✅ 放行（allow）</strong>：安全操作，比如读文件、ls，直接执行</li>
  <li><strong>🟡 询问（ask）</strong>：有风险，比如写文件、删东西，<strong>先弹出来问你</strong>同不同意</li>
  <li><strong>⛔ 拒绝（deny）</strong>：明确危险，比如 <code>rm -rf /</code>，直接挡掉，连问都不问</li>
</ul>

<pre data-lang="python" data-file="permission.py">def check_permission(tool_name, tool_input):
    cmd = tool_input.get("command", "")

    # 黑名单：直接拒绝
    if any(bad in cmd for bad in ["rm -rf /", "shutdown", ":(){ :|:& };:"]):
        return "deny"

    # 只读操作：放行
    if tool_name in ("read_file", "glob") or cmd.startswith(("ls", "cat", "git status")):
        return "allow"

    # 其余有副作用的：问一下用户
    return "ask"

# 在执行工具之前调用它
decision = check_permission(block.name, block.input)
if decision == "deny":
    output = "Error: 该操作被安全策略拒绝"
elif decision == "ask" and not user_confirms(block):
    output = "用户拒绝了这次操作"
else:
    output = TOOL_HANDLERS[block.name](**block.input)</pre>

<div class="analogy">
  <div class="emoji">🏦</div>
  <div class="body">
    <h4>像银行的权限分级</h4>
    <p>查余额随便看（放行）；转账要输密码确认（询问）；给可疑账户转一大笔，系统直接冻结（拒绝）。Agent 的权限系统也是这个思路——<strong>能力越大的操作，关卡越严</strong>。</p>
  </div>
</div>

<div class="callout warn">
  <span class="t">⚠️ 为什么这一章很重要</span>
  权限是 <strong>Agent 安全的核心</strong>。一个能动手的 Agent，如果没有边界，就是个隐患。<strong>先划好边界，才敢给它自由。</strong>这也是「安全工程」和「Agent 工程」交汇的地方。
</div>
`
  },

  /* ---------- s04. Hooks ---------- */
  {
    id: "hooks",
    stage: "第一阶段 · 让它能动手",
    nav: "4 · 钩子",
    title: "留扩展口：钩子",
    aphorism: "挂在循环上，不写进循环里 — 在工具前后留插口，不改主循环也能扩展",
    html: `
<h2><span class="ic">🪝</span>想加点「附加动作」怎么办</h2>
<p>假设你想要：每次 Agent 写文件后，<strong>自动跑一下代码格式化</strong>；或者每次执行命令前，<strong>记一条日志</strong>。</p>
<p>你当然可以把这些逻辑塞进主循环里——但主循环会越来越臃肿，而且每加一个需求就要改核心代码，很危险。</p>

<h2><span class="ic">🔌</span>更好的办法：留「插口」</h2>
<p>在工具执行的<strong>前</strong>和<strong>后</strong>各留一个插口（叫 hook，钩子）。想加功能，就往插口上「挂」一个函数，<strong>完全不碰主循环</strong>。</p>

<pre data-lang="python" data-file="hooks.py"># 两个插口：工具执行前 / 执行后
PRE_HOOKS  = []   # 比如：记日志、拦截
POST_HOOKS = []   # 比如：自动格式化、通知

def run_tool_with_hooks(name, tool_input):
    # ── 执行前：跑所有 pre hook ──
    for hook in PRE_HOOKS:
        hook(name, tool_input)

    output = TOOL_HANDLERS[name](**tool_input)   # 真正执行

    # ── 执行后：跑所有 post hook ──
    for hook in POST_HOOKS:
        hook(name, tool_input, output)
    return output

# 想加功能？挂上去就行，主循环一个字不改
POST_HOOKS.append(lambda n, i, o: print(f"[日志] 调用了 {n}"))</pre>

<div class="analogy">
  <div class="emoji">🔱</div>
  <div class="body">
    <h4>像插线板</h4>
    <p>主循环是墙上的插座，永远不动。你想用什么电器（日志、格式化、告警），插上去就行；不用了拔掉。<strong>插座和电器解耦</strong>，互不影响。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 这是一种思维方式</span>
  「核心保持精简，能力靠挂载扩展」——这是优秀 Agent 架构的标志。你会发现真正的 Claude Code 有 <code>PreToolUse</code>、<code>PostToolUse</code>、<code>SessionStart</code> 等一整套钩子，原理就是这一章。
</div>
`
  },

  /* ---------- s05. TodoWrite ---------- */
  {
    id: "todo",
    stage: "第二阶段 · 让它会做复杂任务",
    nav: "5 · 先列计划",
    title: "先列计划，再动手",
    aphorism: "没有计划的 agent 走哪算哪 — 先列步骤再执行，完成率翻倍",
    html: `
<h2><span class="ic">🧭</span>复杂任务容易「跑偏」</h2>
<p>给 Agent 一个大任务，比如「给这个项目加上用户登录功能」。如果它上来就闷头写代码，很可能写到一半忘了还要改数据库、忘了要加测试……<strong>走哪算哪，最后一团乱。</strong></p>

<h2><span class="ic">📝</span>解决办法：先写一张待办清单</h2>
<p>让 Agent <strong>动手前先把任务拆成几步，列成 todo 清单</strong>，然后一项一项做、做完一项勾一项。这其实就是我们人类做复杂事情的方法。</p>

<pre data-lang="python" data-file="todo.py"># 给 Agent 一个 "写待办清单" 的工具
TOOLS.append({
    "name": "todo_write",
    "description": "把任务拆成步骤清单，并更新每一步的状态",
})

# 模型调用它时，传进来的就是一份结构化清单：
todos = [
    {"step": "设计 users 数据表",      "status": "completed"},
    {"step": "写注册 / 登录接口",       "status": "in_progress"},  # 正在做
    {"step": "加上密码加密",            "status": "pending"},
    {"step": "写单元测试",             "status": "pending"},
]</pre>

<p>清单会一直显示在对话里。模型每完成一步就更新状态，<strong>始终清楚「我做到哪了、还剩什么」</strong>，不会迷路。</p>

<div class="analogy">
  <div class="emoji">✅</div>
  <div class="body">
    <h4>像出门前列购物清单</h4>
    <p>不列清单去超市，回来总会忘买东西。列了清单，照着买、买一样划一样，既不漏也不乱。Agent 的 todo 清单作用一模一样——<strong>它是 Agent 的「外部记忆」和「导航地图」</strong>。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 一个反直觉的点</span>
  这张清单<strong>主要不是给你看的，是给模型自己看的</strong>。把计划写下来，模型在后续每一轮都能「重新看见」自己的目标，专注度和完成率都会明显提高。
</div>

<div class="callout">
  <span class="t">📌 和后面「任务系统」的区别</span>
  这里的 todo 清单是<strong>当前会话内</strong>的执行备忘，存在内存里，关掉就没了。第 12 课的「任务系统」会把它升级成<strong>存到磁盘、能跨会话、带依赖关系</strong>的正式任务图。
</div>
`
  },

  /* ---------- s06. Subagent ---------- */
  {
    id: "subagent",
    stage: "第二阶段 · 让它会做复杂任务",
    nav: "6 · 子 Agent",
    title: "大任务拆给「子 Agent」",
    aphorism: "大任务拆小，每个小任务干净的上下文 — 子 Agent 自己干活，只把结果带回来",
    html: `
<h2><span class="ic">🌊</span>对话太长会「淹没」模型</h2>
<p>模型每轮都要读完<strong>之前所有的对话</strong>。如果一个大任务里塞满了「搜索了 50 个文件、读了一堆内容」的细节，这些噪声会越堆越多，把真正重要的目标淹没，模型反而变笨、变慢、变贵。</p>

<h2><span class="ic">🧹</span>办法：派一个「子 Agent」去干脏活</h2>
<p>当主 Agent 遇到一个独立的子任务（比如「在整个项目里找出所有调用了旧 API 的地方」），它可以<strong>派生一个全新的子 Agent</strong>：</p>
<ul>
  <li>子 Agent 有<strong>自己干净的对话</strong>，从零开始</li>
  <li>它埋头把脏活累活干完（翻几十个文件）</li>
  <li>干完<strong>只把一句结论带回来</strong>，中间的一堆噪声留在它自己那儿</li>
</ul>

<pre data-lang="python" data-file="subagent.py">def run_subagent(task: str) -> str:
    # 关键：全新的、干净的 messages，不带主对话的任何包袱
    sub_messages = [{"role": "user", "content": task}]

    agent_loop(sub_messages)        # 子 Agent 跑自己的循环

    # 只返回最终结论，过程中的几十轮细节统统丢弃
    return final_text(sub_messages)

# 主 Agent 把它当成一个普通工具来用：
summary = run_subagent("找出所有调用了 old_api() 的文件，列个清单")
# 主对话里只多了这一句干净的 summary，没有一堆翻文件的噪声</pre>

<div class="analogy">
  <div class="emoji">👔</div>
  <div class="body">
    <h4>像老板派实习生</h4>
    <p>老板（主 Agent）说：「去把这个季度的报销单都核一遍。」实习生（子 Agent）抱着一堆单子去角落里算了三小时，回来只说一句：「核完了，有 2 张有问题。」老板桌面依然干净，<strong>只拿到了结论，没被一堆单据淹没</strong>。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 核心是「上下文隔离」</span>
  子 Agent 的价值不在于「并行」，而在于<strong>把噪声关在一个独立的房间里</strong>。主对话保持干净清爽，模型才能一直聚焦在真正的大目标上。
</div>
`
  },

  /* ---------- s07. Skill Loading ---------- */
  {
    id: "skills",
    stage: "第二阶段 · 让它会做复杂任务",
    nav: "7 · 技能按需加载",
    title: "技能：用到时再加载",
    aphorism: "用到时再加载，别全塞 prompt 里 — 技能先列目录，用到时再展开",
    html: `
<h2><span class="ic">📚</span>知识太多，不能一股脑全塞</h2>
<p>你想让 Agent 会很多专业活：会做 PPT、会处理 Excel、会画图、会按公司规范写文档……每一项都有一大篇说明书。</p>
<p>如果开局就把<strong>所有</strong>说明书塞进 prompt，模型还没干活，脑子就被塞满了——又贵又乱，大部分还用不上。</p>

<h2><span class="ic">🗃️</span>办法：先给「目录」，用到再「翻书」</h2>
<p>把每项技能写成一个文件夹，里面是详细说明。但一开始<strong>只给模型一个目录</strong>（每个技能一句话简介）。模型发现「这次需要做 PPT」时，<strong>才去加载</strong>那一份完整说明。</p>

<pre data-lang="python" data-file="skills.py"># 开局只注入一个轻量目录（每个技能一行）
SKILL_INDEX = """
可用技能（需要时用 load_skill 加载详细说明）：
- pptx  : 制作 PowerPoint 演示文稿
- xlsx  : 读写 Excel 表格
- chart : 生成数据图表
"""

# 模型决定用某个技能时，才加载它的完整说明书
def load_skill(name: str) -> str:
    return open(f"skills/{name}/SKILL.md").read()   # 几百行的详细指南

# 关键：通过 tool_result 注入，而不是塞进 system prompt</pre>

<div class="analogy">
  <div class="emoji">🍽️</div>
  <div class="body">
    <h4>像餐厅点菜</h4>
    <p>服务员不会把后厨所有食材搬到你桌上，而是给你一份<strong>菜单</strong>（目录）。你点了哪道菜，厨房才去做那道（加载技能）。既清爽，又能力无限——菜单上随时能加新菜。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 按需加载 = 又强又省</span>
  这个机制让 Agent 的能力<strong>可以无限扩展</strong>，却不会拖垮上下文。想加新本事？写个新技能文件夹，在目录里加一行就行。
</div>
`
  },

  /* ---------- s08. Context Compact ---------- */
  {
    id: "compact",
    stage: "第二阶段 · 让它会做复杂任务",
    nav: "8 · 上下文压缩",
    title: "上下文总会满：压缩",
    aphorism: "上下文总会满，要有办法腾地方 — 便宜的策略先跑，贵的后跑",
    html: `
<h2><span class="ic">📦</span>模型的「记忆」是有上限的</h2>
<p>模型每次能读的内容有上限（叫<strong>上下文窗口</strong>）。一个长任务聊着聊着，对话越堆越长，迟早会<strong>装不下</strong>。装满了怎么办？不能直接崩溃，也不能把任务丢了。</p>

<h2><span class="ic">🗜️</span>办法：分层压缩，腾出地方</h2>
<p>当对话快满时，就把前面的老内容「压一压」。原则是<strong>先用便宜的招，不够再上贵的招</strong>，由轻到重四层：</p>
<ul>
  <li><strong>① 剪枝</strong>：直接删掉明显没用的，比如超长的工具输出、重复内容</li>
  <li><strong>② 折叠</strong>：把一批旧的工具调用结果，折成一行「（已省略）」</li>
  <li><strong>③ 摘要</strong>：让模型把一段旧对话<strong>总结成几句话</strong></li>
  <li><strong>④ 重写</strong>：实在不行，把整个历史<strong>重写成一份精简的任务进度</strong></li>
</ul>

<pre data-lang="python" data-file="compact.py">def maybe_compact(messages):
    if token_count(messages) < LIMIT * 0.8:
        return messages          # 还没到 80%，不动

    # 先试便宜的：剪掉超长工具输出
    messages = prune_big_outputs(messages)
    if token_count(messages) < LIMIT * 0.8:
        return messages          # 剪一刀就够了，收工

    # 还不够，再上贵的：把早期对话压成一段摘要
    old, recent = messages[:-6], messages[-6:]
    summary = summarize(old)     # 调一次模型，让它总结前情
    return [{"role": "user", "content": f"【前情摘要】{summary}"}] + recent</pre>

<div class="analogy">
  <div class="emoji">🧳</div>
  <div class="body">
    <h4>像整理行李箱</h4>
    <p>箱子快塞不下时，你不会一上来就买新箱子（贵）。你先扔掉垃圾（剪枝），再把衣服卷起来塞紧（折叠），还不行就只带必需品（摘要）。<strong>能省事就别费劲</strong>——压缩也是这个顺序。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 为什么要分层</span>
  调模型做摘要是要花钱花时间的。<strong>能用一行代码剪掉的，就别去调模型</strong>。先便宜后贵，是上下文管理的基本功——它让一个会话理论上可以「无限」聊下去。
</div>

<div class="callout warn">
  <span class="t">⚠️ 但压缩会丢细节</span>
  摘要再好，也会丢掉原文里的某些细节。所以下一课要补一层<strong>「压不丢」的长期记忆</strong>。
</div>
`
  },

  /* ---------- s09. Memory ---------- */
  {
    id: "memory",
    stage: "第二阶段 · 让它会做复杂任务",
    nav: "9 · 长期记忆",
    title: "压缩会丢细节：长期记忆",
    aphorism: "压缩会丢细节，要有一层不丢的 — 文件仓库 + 索引 + 按需加载",
    html: `
<h2><span class="ic">🕳️</span>压缩的「后遗症」</h2>
<p>上一课的压缩能腾地方，但它是<strong>有损的</strong>——把十轮对话压成三句话，细节就丢了。而且一旦关掉会话，连摘要都没了。可有些东西，你希望它<strong>关机重开还记得</strong>：</p>
<ul>
  <li>「这个用户喜欢用中文回复」</li>
  <li>「这个项目用 4 个空格缩进，不用 Tab」</li>
  <li>「上次部署踩过的那个坑」</li>
</ul>

<h2><span class="ic">🧠</span>办法：把记忆写进文件，按需取回</h2>
<p>给 Agent 一个<strong>磁盘上的记忆仓库</strong>：每条重要的事写成一个文件，再维护一个<strong>索引</strong>（每条一行简介）。开局只读索引，用到哪条<strong>才把那条详情读回来</strong>——和第 7 课的技能加载一个套路。</p>

<pre data-lang="python" data-file="memory.py"># 开局只加载索引（很小，每条记忆一行）
MEMORY_INDEX = read("memory/INDEX.md")
# - user-prefers-chinese : 用户偏好中文交流
# - project-indent       : 本项目用 4 空格缩进
# - deploy-gotcha        : 部署需先跑数据库迁移

def remember(name, fact):                 # 写入一条长期记忆
    write(f"memory/{name}.md", fact)
    append("memory/INDEX.md", f"- {name}\\n")

def recall(name):                         # 用到时才取回详情
    return read(f"memory/{name}.md")</pre>

<p>关键是<strong>有取舍</strong>：值得长期记的才记（用户偏好、项目约定、踩过的坑），一次性的细节就让它随压缩过去——<strong>记住该记的，忘掉该忘的。</strong></p>

<div class="analogy">
  <div class="emoji">🗒️</div>
  <div class="body">
    <h4>像人的笔记本</h4>
    <p>你不会记得三年前某个周二午饭吃了什么（该忘的忘了），但会把朋友生日、银行卡密码记到本子上（该记的记下来）。要用时翻本子那一页（按需加载），而不是把整本书背下来。Agent 的长期记忆就是这本笔记。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 两层记忆，各司其职</span>
  <strong>压缩（第8课）= 短期记忆</strong>，负责在会话里腾地方；<strong>文件记忆（本课）= 长期记忆</strong>，负责跨压缩、跨会话留住真正重要的事。两者配合，Agent 才能既走得长，又越用越懂你。
</div>
`
  },

  /* ---------- s10. System Prompt ---------- */
  {
    id: "system",
    stage: "第二阶段 · 让它会做复杂任务",
    nav: "10 · 提示词组装",
    title: "系统提示词：运行时拼出来",
    aphorism: "prompt 是组装出来的，不是写死的 — 分段 + 按需拼接 + 缓存",
    html: `
<h2><span class="ic">📜</span>什么是「系统提示词」</h2>
<p>每次调模型，除了对话，还会带一段<strong>系统提示词（system prompt）</strong>——它告诉模型「你是谁、你能用哪些工具、有哪些规矩、现在几点、在什么目录」。它是 Agent 的「岗前说明」。</p>

<h2><span class="ic">🧱</span>痛点：写死的提示词不灵活</h2>
<p>如果把这一大段话写死成一个字符串，问题就来了：今天的日期变了、可用工具变了、加载了新技能、换了操作系统……每变一样，你都得手动改那一坨文字。又乱又容易错。</p>

<h2><span class="ic">🔧</span>办法：分成小段，每次运行时拼起来</h2>
<p>把系统提示词拆成<strong>一段一段</strong>（身份、环境、工具说明、安全规则、已加载技能……），每次调模型前，<strong>按当前情况动态拼装</strong>。变的部分自动更新，不变的部分还能缓存省钱。</p>

<pre data-lang="python" data-file="system_prompt.py">def assemble_system_prompt():
    parts = []
    parts.append(IDENTITY)                       # 固定：你是谁（可缓存）
    parts.append(SAFETY_RULES)                   # 固定：安全规则（可缓存）
    parts.append(f"当前时间：{now()}")            # 动态：每次都不同
    parts.append(f"工作目录：{cwd()}  系统：{os_name()}")
    parts.append(describe_tools(active_tools))   # 动态：当前启用了哪些工具
    if loaded_skills:
        parts.append(skill_index(loaded_skills)) # 动态：已加载的技能目录
    return "\\n\\n".join(parts)

# 主循环里每轮都重新组装，永远是最新状态
response = client.messages.create(
    system=assemble_system_prompt(), messages=messages, tools=active_tools,
)</pre>

<div class="analogy">
  <div class="emoji">🍱</div>
  <div class="body">
    <h4>像拼一份便当</h4>
    <p>便当不是一整块焊死的，而是一格一格拼出来的：米饭（固定）、今日例汤（每天换）、按你口味加的小菜（按需）。系统提示词也一样——<strong>固定的格子复用（缓存省钱），变化的格子每次现填</strong>。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 为什么固定段要单独放</span>
  模型 API 支持<strong>缓存</strong>：开头不变的内容可以被缓存住，下次少算一遍、少花一遍钱。所以把「固定段」放前面、「动态段」放后面，是省钱又提速的小技巧。
</div>
`
  },

  /* ---------- s11. Error Recovery ---------- */
  {
    id: "error",
    stage: "第二阶段 · 让它会做复杂任务",
    nav: "11 · 错误恢复",
    title: "错误不是终点，是重试的起点",
    aphorism: "错误不是结束，是重试的开始 — 分类故障，对症恢复",
    html: `
<h2><span class="ic">💥</span>真实世界里，报错是常态</h2>
<p>Agent 跑着跑着，突然来一句：</p>
<pre data-lang="python" data-file="error.log">Error: 529 overloaded   # 服务器过载</pre>
<p>一个不处理错误的 Agent，到这就<strong>直接崩了</strong>——不重试、不换招、不减负，像一辆一碰就熄火的车。但生产环境里 API 出错太常见了，Agent 必须能<strong>自己爬起来</strong>。</p>

<h2><span class="ic">🩹</span>三种最常见的故障，各有各的解法</h2>
<ul>
  <li><strong>① 输出被截断</strong>（话说一半 token 用完了）→ 提高输出额度，让它把话说完</li>
  <li><strong>② 上下文超限</strong>（压缩完还是太长）→ 触发第 8 课的压缩，把历史再压一压</li>
  <li><strong>③ 临时故障</strong>（429 限流 / 529 过载）→ 等一会儿重试，或换一个模型</li>
</ul>

<pre data-lang="python" data-file="error_recovery.py">def call_with_recovery(messages):
    for attempt in range(MAX_RETRIES):
        try:
            return client.messages.create(model=MODEL, messages=messages, tools=TOOLS)
        except Truncated:                  # ① 被截断
            raise_output_limit()           #    给更多输出额度
        except ContextTooLong:             # ② 上下文超限
            messages = maybe_compact(messages, force=True)   # 强制压缩
        except (RateLimited, Overloaded):  # ③ 限流 / 过载
            wait(backoff(attempt))         #    退避等待：1s, 2s, 4s...
            if attempt == LAST:
                switch_to_backup_model()   #    实在不行，换个模型
    raise RuntimeError("重试多次仍失败")</pre>

<div class="analogy">
  <div class="emoji">🚗</div>
  <div class="body">
    <h4>像老司机应对路况</h4>
    <p>前方堵车（限流），不会熄火不动，而是等等再走或绕路（重试/换模型）；后备箱太满（上下文超限），先扔掉用不上的（压缩）；话没说完（截断），深吸一口气再说完。<strong>遇到问题先分类，再对症下药</strong>，而不是一遇事就趴窝。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 韧性，是生产级 Agent 的分水岭</span>
  Demo 里的 Agent 一报错就停。能在真实环境长期工作的 Agent，必须把「出错—分类—恢复」做进主循环。<strong>会重试的 Agent，才敢交给它干真活。</strong>
</div>
`
  },

  /* ---------- s12. Task System ---------- */
  {
    id: "task",
    stage: "第三阶段 · 让它长期可靠运转",
    nav: "12 · 任务系统",
    title: "目标太大：拆成持久化任务",
    aphorism: "大目标拆成小任务，排好序，持久化 — 文件存储的任务图",
    html: `
<h2><span class="ic">🏗️</span>第 5 课的清单不够用了</h2>
<p>第 5 课的 todo 清单存在内存里，是<strong>当前会话</strong>的临时备忘。但一个真实项目「搭数据库 + 写 API + 加测试」可能要跨好几次会话，任务之间还有<strong>先后依赖</strong>：没建好数据库表，就没法写依赖它的 API。</p>
<p>如果 Agent 乱序开工——先写 API 写一半发现没有表，回头补；加测试又发现接口签名变了……<strong>盖房子不能先盖屋顶再打地基。</strong></p>

<h2><span class="ic">🗂️</span>办法：每个任务一个文件，带依赖关系</h2>
<p>把每个任务存成一个 JSON 文件（落在磁盘上，关机也不丢），并记录它<strong>被谁挡着（blockedBy）</strong>。Agent 每次只挑「没有被挡住」的任务来做。</p>

<pre data-lang="python" data-file="task_system.py"># 每个任务是磁盘上的一个 JSON 文件，跨会话持久化
# tasks/t1.json
{"id": "t1", "title": "建 users 数据表", "status": "done",    "blockedBy": []}
# tasks/t2.json
{"id": "t2", "title": "写登录 API",     "status": "todo",    "blockedBy": ["t1"]}
# tasks/t3.json
{"id": "t3", "title": "加接口测试",     "status": "todo",    "blockedBy": ["t2"]}

def next_runnable():
    for t in load_all_tasks():
        if t["status"] == "todo" and all(dep_done(d) for d in t["blockedBy"]):
            return t          # 只挑「拦路的都已完成」的任务
    return None</pre>

<div class="analogy">
  <div class="emoji">📋</div>
  <div class="body">
    <h4>像施工队的项目看板</h4>
    <p>工地上每项工程是一张卡片，钉在看板上（持久化）。卡片上写着「水电要在墙刷漆之前完成」（依赖）。工人不会乱抢活，而是挑那些<strong>前置工序已完成</strong>的卡片来干。任务系统就是给 Agent 的项目看板。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 它还是多 Agent 协作的地基</span>
  任务存成文件、带依赖关系，不只是为了不乱序——更是为了<strong>让多个 Agent 能看同一块看板、各自认领任务</strong>。第 17 课的「自治认领」就建立在这套任务系统上。
</div>

<p class="muted">注：任务依赖本质上构成一张有向无环图（DAG）。教学版只演示 <code>blockedBy</code> 检查，没做环检测，知道有这回事即可。</p>
`
  },

  /* ---------- s13. Background Tasks ---------- */
  {
    id: "background",
    stage: "第三阶段 · 让它长期可靠运转",
    nav: "13 · 后台任务",
    title: "慢操作丢后台，别干等",
    aphorism: "慢操作丢后台，agent 继续处理 — 后台跑，完成后注入通知",
    html: `
<h2><span class="ic">🧺</span>洗衣机的启示</h2>
<p>你把衣服丢进洗衣机、按下启动，然后<strong>该干嘛干嘛</strong>——做饭、回消息。30 分钟后它「滴滴」提醒你好了。你绝不会站在机器前干等半小时。</p>
<p>可 Agent 的 bash 工具默认就是「站着干等」：<code>pip install torch</code> 要跑 10 分钟，这 10 分钟里 Agent 卡在那等返回，啥也干不了——而模型是按用量计费的，<strong>空转就是烧钱</strong>。</p>

<h2><span class="ic">⏱️</span>快的等，慢的丢后台</h2>
<p>读文件是毫秒级，等就等了。但分钟级的慢操作（装依赖、跑构建、压测），应该<strong>丢到后台线程去跑</strong>，Agent 立刻拿回一个「任务已在后台运行」的回执，继续处理别的事。等它跑完，再把结果<strong>作为一条通知注入</strong>对话。</p>

<pre data-lang="python" data-file="background.py">def run_bash_maybe_background(command, background=False):
    if not background:
        return run_bash(command)              # 快操作：同步等结果

    # 慢操作：丢到后台线程，立刻返回回执
    task_id = new_id()
    def worker():
        out = run_bash(command)
        notify_queue.put((task_id, out))      # 跑完把结果塞进通知队列
    threading.Thread(target=worker, daemon=True).start()
    return f"已在后台启动（{task_id}），完成后会通知你"

# 主循环空闲时，检查有没有后台任务完成，有就注入对话
for task_id, out in drain(notify_queue):
    messages.append({"role": "user",
                     "content": f"[后台完成 {task_id}]\\n{out}"})</pre>

<div class="analogy">
  <div class="emoji">🍳</div>
  <div class="body">
    <h4>像一边炖汤一边炒菜</h4>
    <p>汤要炖一小时（慢操作），你不会守着锅，而是把火调小让它自己炖（后台），转身去炒别的菜（继续干活）。汤好了闻到香味（通知）再回来处理。<strong>慢的让它自己跑，手别闲着。</strong></p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 关键词：异步、不阻塞</span>
  后台任务让 Agent 从「一次只能干一件、还得干等」变成「慢活丢后台、自己接着忙」。这是迈向<strong>能长期、高效运转</strong>的 Agent 的一大步。
</div>
`
  },

  /* ---------- s14. Cron Scheduler ---------- */
  {
    id: "cron",
    stage: "第三阶段 · 让它长期可靠运转",
    nav: "14 · 定时调度",
    title: "定时调度：到点自己干",
    aphorism: "按时间表生产工作，调度与执行解耦 — 闹钟到点，自动触发",
    html: `
<h2><span class="ic">⏰</span>闹钟不需要你盯着</h2>
<p>你设好 7:00 的闹钟，然后安心睡觉。到点它自己响，不管你在睡、在洗澡、在做饭。<strong>它不需要你时时刻刻盯着才会响。</strong></p>
<p>上一课让 Agent 能把慢活丢后台，但所有事还是<strong>你说一句、它动一下</strong>。像「每天早上 9 点跑一遍测试」「每 30 分钟查一次 CI 状态」这种周期性的活，不该每次都要人来推。</p>

<h2><span class="ic">🔔</span>办法：一个独立的「闹钟线程」</h2>
<p>起一个独立线程当闹钟，<strong>每秒看一眼表</strong>：到点的任务就丢进一个队列。Agent 一空闲，就从队列里取出来执行。<strong>「判断时间」和「执行任务」分开</strong>，互不耽误。</p>

<pre data-lang="python" data-file="cron.py">SCHEDULE = [
    {"cron": "0 9 * * *",   "task": "跑全部测试并报告"},     # 每天 9:00
    {"cron": "*/30 * * * *", "task": "检查 CI 状态"},         # 每 30 分钟
]

def scheduler_thread():            # 独立的「闹钟」线程
    while True:
        now = current_time()
        for job in SCHEDULE:
            if cron_match(job["cron"], now):
                cron_queue.put(job["task"])   # 到点，把任务塞进队列
        sleep(1)                              # 每秒检查一次

# 主循环空闲时，从队列取出到期任务，当成一条新指令来执行
for task in drain(cron_queue):
    messages.append({"role": "user", "content": task})</pre>

<div class="analogy">
  <div class="emoji">📅</div>
  <div class="body">
    <h4>像家里的定时电饭煲</h4>
    <p>晚上设好「早上 6:30 开始煮」，你就睡了。电饭煲内部有个计时器（调度线程）盯着时间，到点自动启动加热（执行）。<strong>计时和煮饭是两套机构</strong>，配合起来你早上就有热粥喝。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 从「被动响应」到「主动产出」</span>
  有了定时调度，Agent 不再只是「你问我答」的工具，而能<strong>按时间表自己产生工作</strong>。这是迈向「自主 Agent」的关键一跳。
</div>
`
  },

  /* ---------- s15. Agent Teams ---------- */
  {
    id: "teams",
    stage: "第四阶段 · 让它组队与扩展",
    nav: "15 · 多 Agent 团队",
    title: "一个搞不定？组个团队",
    aphorism: "一个搞不定，组队来 — 文件收件箱 + 队友线程",
    html: `
<h2><span class="ic">👥</span>有些活，单个 Agent 扛不住</h2>
<p>「重构整个后端」涉及认证、数据库、API 路由、测试。单个 Agent 在改 API 时，认证模块的细节早就被挤出上下文了——<strong>一个脑子的注意力，盖不住所有模块。</strong></p>
<p>第 6 课的子 Agent 是「办完即走」的临时工。但这种大工程，需要的是<strong>能长期分工、还能互相通气的队友</strong>。</p>

<h2><span class="ic">📬</span>办法：给每人一个「文件收件箱」</h2>
<p>设一个<strong>消息总线</strong>：每个队友对应一个收件箱文件。要找谁，就往谁的收件箱里写一条消息；队友（一个独立线程）忙完手头活，回来<strong>查收件箱</strong>、把新消息读进自己的对话。像发邮件一样<strong>异步协作</strong>，不用同时在线。</p>

<pre data-lang="python" data-file="teams.py"># 消息总线：每个 Agent 一个收件箱文件（JSONL）
def send(to, content):
    append_line(f"inbox/{to}.jsonl", {"from": me, "content": content})

def check_inbox():
    return read_new_lines(f"inbox/{me}.jsonl")    # 忙完回来查收

# Lead 启动队友线程，每人跑自己的 agent_loop
def spawn_teammate(name, role):
    threading.Thread(target=lambda: agent_loop(
        [{"role": "user", "content": role}], name=name), daemon=True).start()

spawn_teammate("alice", "你负责认证模块")
spawn_teammate("bob",   "你负责数据库层")
# Lead 收到队友消息后，注入自己的 history 一起决策</pre>

<div class="analogy">
  <div class="emoji">🏢</div>
  <div class="body">
    <h4>像一个远程团队用 Slack</h4>
    <p>同事不必同时在线。你给某人发条消息（投收件箱），他忙完手上的事再回（查收件箱）。各人干各人的活，靠消息把进度串起来。多 Agent 团队，就是把这套搬给了 AI。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 子 Agent vs 团队</span>
  <strong>子 Agent</strong>（第6课）= 派出去办一件事就回，不通信；<strong>团队</strong>（本课）= 长期存在、能互相收发消息的队友。规模上去了，就需要团队。
</div>
`
  },

  /* ---------- s16. Team Protocols ---------- */
  {
    id: "protocols",
    stage: "第四阶段 · 让它组队与扩展",
    nav: "16 · 协作协议",
    title: "队友之间，要有约定",
    aphorism: "队友之间要有约定 — 请求-回复模式，驱动协商",
    html: `
<h2><span class="ic">🤝</span>能发消息，还不够</h2>
<p>上一课队友能互发消息了，但协调是<strong>松散</strong>的：发出去不知道对方收没收、办没办。两个场景立刻暴露问题：</p>
<ul>
  <li><strong>关机</strong>：Lead 想让 Alice 停工。直接杀掉线程，Alice 写了一半的文件就烂在磁盘上了。</li>
  <li><strong>计划审批</strong>：Bob 要重构认证（高风险），应该先把计划交给 Lead 过目、批准了再动手。</li>
</ul>

<h2><span class="ic">📐</span>办法：约定「请求—回复」握手</h2>
<p>这两个场景结构其实一样：<strong>一方发请求，另一方给回复，靠同一个 ID 关联，并有状态可追踪</strong>（pending 待处理 → approved 通过 / rejected 驳回）。这就是「协议」——把口头默契变成结构化握手。</p>

<pre data-lang="python" data-file="protocols.py">def request(to, kind, payload):
    rid = new_id()
    send(to, {"type": "request", "id": rid, "kind": kind, "payload": payload})
    return rid                         # 凭这个 id 等回复

def reply(rid, to, decision):          # decision: "approved" / "rejected" / "done"
    send(to, {"type": "reply", "id": rid, "decision": decision})

# 场景一：优雅关机（先确认收尾，再退出）
rid = request("alice", "shutdown", {})
wait_reply(rid)                        # 等 Alice 保存好文件、回一个 done

# 场景二：计划审批（批准了才动手）
rid = request("lead", "approve_plan", {"plan": my_plan})
if wait_reply(rid).decision == "approved":
    execute(my_plan)</pre>

<div class="analogy">
  <div class="emoji">✋</div>
  <div class="body">
    <h4>像公司的审批流程</h4>
    <p>你想报销，不能直接从金库拿钱，而是提交申请单（请求）→ 主管签字「同意/驳回」（回复）→ 单号全程可查（状态机）。下班也要先交接好工作再走（优雅关机）。<strong>有流程，协作才不出乱子。</strong></p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 协议 = 结构化的握手</span>
  从「我喊一嗓子」升级到「请求有编号、回复有状态、动作可追踪」。一旦多个 Agent 要做高风险或需要协商的事，协议就是<strong>防止它们各行其是</strong>的安全带。
</div>
`
  },

  /* ---------- s17. Autonomous Agents ---------- */
  {
    id: "autonomous",
    stage: "第四阶段 · 让它组队与扩展",
    nav: "17 · 自治认领",
    title: "自己看板，自己认领",
    aphorism: "自己看板，自己认领 — 空闲时轮询，有活就干",
    html: `
<h2><span class="ic">🙋</span>Lead 一个个派活，累死也不扩展</h2>
<p>上一课队友能通信、能握手了，但还是<strong>等 Lead 分配任务</strong>。看板上有 10 个未认领的任务，Lead 就得手动 assign 10 次。队友一多，Lead 立刻成了瓶颈。</p>

<h2><span class="ic">🔄</span>办法：队友空闲时自己去看板抢活</h2>
<p>结合第 12 课的任务系统：让每个队友在<strong>空闲时每隔几秒轮询一次任务看板</strong>，发现没人认领、且依赖都已就绪的任务，就<strong>自己认领（claim）下来干</strong>，干完再找下一个。Lead 彻底不用操心派活。</p>

<pre data-lang="python" data-file="autonomous.py">def idle_poll():                       # 队友空闲时进入这个循环
    while alive:
        task = scan_unclaimed_tasks()  # 扫看板：找没人领、依赖已就绪的任务
        if task:
            if claim(task, by=me):     # 抢单（原子操作，防两人抢同一个）
                run_task(task)         # 抢到就干
                mark_done(task)
        else:
            sleep(5)                   # 暂时没活，歇 5 秒再看

# 队友生命周期：启动 → 自治认领干活 → 收到关机请求后优雅退出</pre>

<div class="analogy">
  <div class="emoji">🛵</div>
  <div class="body">
    <h4>像外卖骑手抢单</h4>
    <p>平台不会有个调度员盯着给每个骑手派单。骑手们看着抢单大厅（任务看板），谁有空谁抢，抢到就送，送完再抢下一单。<strong>去中心化，自组织，人越多越能扛</strong>。自治 Agent 就是这个模式。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 从「被指挥」到「自组织」</span>
  自治认领让团队<strong>能横向扩展</strong>：加更多队友，吞吐就更高，而 Lead 的负担不变。注意「抢单」必须是<strong>原子操作</strong>，否则两个队友会抢到同一个任务、撞车。
</div>
`
  },

  /* ---------- s18. Worktree Isolation ---------- */
  {
    id: "worktree",
    stage: "第四阶段 · 让它组队与扩展",
    nav: "18 · 目录隔离",
    title: "各干各的目录，互不干扰",
    aphorism: "各干各的目录，互不干扰 — 任务管目标，worktree 管目录",
    html: `
<h2><span class="ic">💢</span>同一个目录里，队友会「打架」</h2>
<p>上一课 Alice 和 Bob 都在<strong>同一个目录</strong>里干活。Alice 改 <code>config.py</code>，Bob 也改 <code>config.py</code>——两人互相覆盖，最后谁的改动都不对，还分不清哪行是谁写的、没法干净回滚。</p>
<p>前面几课解决了「谁干什么」（任务系统）、「怎么通信」（消息+协议），但没解决——<strong>「在哪干」</strong>。</p>

<h2><span class="ic">🌳</span>办法：每个 Agent 一个独立工作目录</h2>
<p>用 Git 的 <strong>worktree</strong>：从同一个仓库，给每个 Agent 切出一个<strong>独立的工作目录</strong>。Alice 在自己的目录里随便改，Bob 在自己的目录里随便改，<strong>井水不犯河水</strong>，最后各自提交、再统一合并。任务管「目标」，worktree 管「在哪个目录」，两者按 Agent/任务 ID 绑定。</p>

<pre data-lang="python" data-file="worktree.py">def assign_worktree(agent, task):
    path = f"worktrees/{agent}-{task['id']}"
    git(f"worktree add {path} -b {agent}/{task['id']}")  # 切出独立目录+分支
    return path

# 每个 Agent 只在自己的目录里读写，互不踩踏
alice_dir = assign_worktree("alice", auth_task)   # worktrees/alice-t7
bob_dir   = assign_worktree("bob",   ui_task)     # worktrees/bob-t8
# 各自改各自的 config.py，完全独立

# 干完，分别合并回主分支（冲突在这一步才集中处理）
git("merge alice/t7"); git("merge bob/t8")</pre>

<div class="analogy">
  <div class="emoji">📑</div>
  <div class="body">
    <h4>像协作文档的「副本」</h4>
    <p>十个人同时在一个文件里乱改会乱套。更稳的做法：每人拿一份副本各改各的，最后由一个人合并。Git worktree 就是给每个 Agent 发一份<strong>独立又能合回去</strong>的工作副本。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 隔离 = 并行的前提</span>
  想让多个 Agent <strong>真正并行改代码</strong>而不互相破坏，目录隔离是必备条件。冲突不是不存在，而是被推迟到「合并」这一可控的环节集中解决。
</div>
`
  },

  /* ---------- s19. MCP ---------- */
  {
    id: "mcp",
    stage: "第四阶段 · 让它组队与扩展",
    nav: "19 · MCP 外接工具",
    title: "外接工具：标准协议",
    aphorism: "外接工具，标准协议 — 发现、组装、调用，不管工具谁写的",
    html: `
<h2><span class="ic">🔌</span>每接一个外部服务都重写，太累</h2>
<p>到目前为止，Agent 的工具全是你<strong>手写</strong>的——bash、read、write、task……现在你想接公司的 Jira（查 issue）、自建的部署系统（触发 deploy）、团队的 Notion（搜文档）。难道每接一个，都要从头写一套工具代码？</p>

<h2><span class="ic">🧩</span>办法：定一个「通用插头」标准（MCP）</h2>
<p><strong>MCP（Model Context Protocol）</strong>就是这样一个标准协议：外部服务只要按这个标准「自报家门」，Agent 就能自动<strong>发现</strong>它提供哪些工具、把这些工具<strong>组装</strong>进自己的工具表、像调本地工具一样<strong>调用</strong>它——完全不用关心那个服务是用什么语言写的。</p>

<pre data-lang="python" data-file="mcp.py"># 1. 发现：问每个 MCP 服务「你提供哪些工具？」
def discover(server):
    return server.list_tools()      # 比如 jira 返回 [create_issue, search_issue]

# 2. 组装：把外部工具并进 Agent 自己的工具表
for server in MCP_SERVERS:                       # jira / deploy / notion
    for tool in discover(server):
        TOOLS.append(tool.schema)                # 模型就「看见」了这个工具
        TOOL_HANDLERS[tool.name] = server.call   # 调用时转发给对应服务

# 3. 调用：和调本地工具一模一样，循环代码完全不用改
#    模型说要用 jira.create_issue → 查表 → 转发给 Jira 服务</pre>

<div class="analogy">
  <div class="emoji">🔋</div>
  <div class="body">
    <h4>像 USB / Type-C 接口</h4>
    <p>有了统一接口，鼠标、硬盘、键盘——谁家造的都能插上就用，电脑不用为每个设备装一套专用插座。MCP 就是 Agent 世界的 USB：<strong>外部能力即插即用，谁写的都能接</strong>。</p>
  </div>
</div>

<div class="callout key">
  <span class="t">🔑 为什么 MCP 很关键</span>
  它把 Agent 的能力从「作者手写的那几样」彻底打开成<strong>一个开放生态</strong>：任何团队都能把自己的服务包成 MCP，让所有 Agent 直接用。这正是 Agent 能接入真实世界系统的标准入口。
</div>
`
  },

  /* ---------- s20. Comprehensive ---------- */
  {
    id: "full",
    stage: "第四阶段 · 让它组队与扩展",
    nav: "20 · 完整体 & 总结",
    title: "合体：完整的 Agent",
    aphorism: "机制很多，循环一个 — 前 19 章的机制，回到同一个 while True",
    html: `
<h2><span class="ic">🧩</span>把所有零件装回那个循环</h2>
<p>恭喜你走到这里！回头看，我们做的事其实非常清晰：<strong>从一个 20 行的循环出发，每一章往上挂一个零件。</strong>现在把它们装回去，就是一个完整的 Agent：</p>

<pre data-lang="python" data-file="full_agent.py">def agent(messages):
    while True:
        deliver_background_and_cron(messages)      # 🧺⏰ 后台/定时结果注入 (13,14)
        messages = recover(lambda: maybe_compact(messages))  # 🗜️💥 压缩+错误恢复 (8,11)
        system   = assemble_system_prompt()        # 🧠 运行时组装提示词 (10)
        response = client.messages.create(
            model=MODEL, system=system,
            messages=messages, tools=ALL_TOOLS,    # 🔨工具 📚技能 🔌MCP (2,7,19)
        )
        messages.append({"role": "assistant", "content": response.content})

        if response.stop_reason != "tool_use":     # 🔁 这一行从没变过 (1)
            return

        results = []
        for block in response.content:
            if block.type == "tool_use":
                if check_permission(block) == "deny":   # 🚦 权限 (3)
                    output = "被拒绝"
                else:
                    run_pre_hooks(block)                # 🪝 钩子 (4)
                    output = dispatch(block)            # 含 子Agent/任务/团队 (6,12,15)
                    run_post_hooks(block, output)
                results.append(tool_result(block, output))
        messages.append({"role": "user", "content": results})</pre>

<p>看到了吗？<strong>那个 <code>while</code> 循环、那句 <code>stop_reason</code> 判断，从第 1 课到现在一个字都没改。</strong>20 章加的所有能力——工具、权限、钩子、计划、子 Agent、技能、压缩、记忆、提示词、错误恢复、任务、后台、定时、团队、协议、自治、隔离、MCP——全都是挂在它周围的 Harness。</p>

<div class="callout key">
  <span class="t">🔑 整套教程的核心</span>
  <strong>Agent ＝ 模型（智能） ＋ Harness（机制）。</strong>智能来自模型，你管不着也不用管。你的工作，是把 Harness 造好。Harness 造得越好，模型就越能大显身手。
</div>

<h2><span class="ic">🗺️</span>20 章速查表</h2>
<div class="recap">
  <div class="recap-col">
    <h4>一 · 让它能动手</h4>
    <ol>
      <li>循环：一个 while 就是一个 Agent</li>
      <li>工具：加工具只加一个 handler</li>
      <li>权限：执行前先判断</li>
      <li>钩子：挂在循环上不写进去</li>
    </ol>
    <h4>二 · 让它会做复杂任务</h4>
    <ol start="5">
      <li>计划：先列清单再动手</li>
      <li>子 Agent：上下文隔离</li>
      <li>技能：用到时再加载</li>
      <li>压缩：满了就分层腾地方</li>
      <li>记忆：压不丢的长期层</li>
      <li>提示词：运行时组装</li>
      <li>错误恢复：分类后重试</li>
    </ol>
  </div>
  <div class="recap-col">
    <h4>三 · 让它长期运转</h4>
    <ol start="12">
      <li>任务系统：持久化任务图</li>
      <li>后台任务：慢活丢后台</li>
      <li>定时调度：到点自己干</li>
    </ol>
    <h4>四 · 让它组队与扩展</h4>
    <ol start="15">
      <li>团队：文件收件箱</li>
      <li>协议：请求-回复握手</li>
      <li>自治：自己看板自己领</li>
      <li>隔离：各用各的目录</li>
      <li>MCP：外接工具标准协议</li>
      <li>完整体：全部归到一个循环</li>
    </ol>
  </div>
</div>

<h2><span class="ic">🌍</span>这套模式能用在任何地方</h2>
<p>我们用「写代码的 Agent」当例子，但这套循环是通用的。换掉工具和知识，它就能干别的：</p>
<ul>
  <li>🏥 医疗 Agent ＝ 模型 ＋ 文献检索 ＋ 病历系统 ＋ 诊疗规范</li>
  <li>🌾 农业 Agent ＝ 模型 ＋ 土壤气象数据 ＋ 灌溉控制 ＋ 作物知识</li>
  <li>🏨 酒店 Agent ＝ 模型 ＋ 预订系统 ＋ 客户渠道 ＋ 设施 API</li>
</ul>
<p><strong>循环不变，变的只是工具、知识和权限。</strong>你学会的，是适用于任何领域的 Agent 工程通用原则。</p>

<h2><span class="ic">🎓</span>你已经从 0 到 1 了</h2>
<p>现在，当别人再聊起「AI Agent」，你不仅知道它是什么，更知道它<strong>是怎么一砖一瓦造出来的</strong>。从一个循环开始，你已经看懂了整座大厦的全部 20 层。</p>

<div class="analogy">
  <div class="emoji">🚀</div>
  <div class="body">
    <h4>下一步</h4>
    <p>想动手跑真代码？去看本教程的素材来源 <code>learn-claude-code</code> 仓库，s01 ~ s20 每一章都有可运行的 Python（配上 API Key 就能跑）。把这里学到的概念，对照真实代码再走一遍，理解会更深。</p>
  </div>
</div>

<div style="text-align:center; margin-top:40px;">
  <button class="cta" data-goto="intro">↺ 回到开头再看一遍</button>
</div>
`
  }
];
