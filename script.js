let currentRole = null;

// ===== CREDENTIALS =====
const credentials = {
  user:    { email: 'usuario@empresa.com',   senha: '123456' },
  analyst: { email: 'analista@vigilancia.pr', senha: '123456' },
};

// ===== LOGIN FLOW =====
let pendingRole = null;

function showLogin(role) {
  pendingRole = role;
  document.getElementById('role-cards-step').style.display = 'none';
  const panel = document.getElementById('login-panel');
  panel.classList.add('visible');

  const isUser = role === 'user';
  document.getElementById('login-icon').textContent  = isUser ? '🏢' : '🔎';
  document.getElementById('login-title').textContent = isUser ? 'Usuário / Solicitante' : 'Analista Sanitário';
  document.getElementById('login-sub').textContent   = isUser ? 'Acesse o portal de envio' : 'Acesse o painel de controle';
  document.getElementById('hint-cred').textContent   = credentials[role].email + ' / ' + credentials[role].senha;
  document.getElementById('login-email').value = '';
  document.getElementById('login-senha').value = '';
  document.getElementById('login-error').textContent = '';
  document.getElementById('login-email').classList.remove('input-error');
  document.getElementById('login-senha').classList.remove('input-error');
  setTimeout(() => document.getElementById('login-email').focus(), 50);
}

function backToCards() {
  pendingRole = null;
  document.getElementById('login-panel').classList.remove('visible');
  document.getElementById('role-cards-step').style.display = '';
  document.getElementById('card-user').classList.remove('selected');
  document.getElementById('card-analyst').classList.remove('selected');
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  const err   = document.getElementById('login-error');
  const cred  = credentials[pendingRole];

  document.getElementById('login-email').classList.remove('input-error');
  document.getElementById('login-senha').classList.remove('input-error');
  err.textContent = '';

  if (!email || !senha) {
    err.textContent = 'Preencha e-mail e senha.';
    if (!email) document.getElementById('login-email').classList.add('input-error');
    if (!senha) document.getElementById('login-senha').classList.add('input-error');
    return;
  }
  if (email !== cred.email || senha !== cred.senha) {
    err.textContent = 'E-mail ou senha incorretos. Use as credenciais de demonstração.';
    document.getElementById('login-email').classList.add('input-error');
    document.getElementById('login-senha').classList.add('input-error');
    return;
  }
  setRole(pendingRole);
}

// ===== DATA =====
const processes = [
  { id: '#2026-00123', empresa: 'Restaurante Sabor Ltda', cnpj: '12.345.678/0001-90', status: 'Pendente', ia: 'Válida', data: '08/04/2026', analista: 'Dra. Carla M.', tipo: 'Alvará Sanitário', docs: {alvara:'ok', tecnico:'ok', licenca:'ok'}, obs: '' },
  { id: '#2026-00124', empresa: 'Mercado Bom Preço', cnpj: '98.765.432/0001-19', status: 'Em análise', ia: 'Válida', data: '09/04/2026', analista: 'Dr. Bruno R.', tipo: 'Renovação', docs: {alvara:'ok', tecnico:'warn', licenca:'ok'}, obs: 'Documento técnico com campo responsável incompleto.' },
  { id: '#2026-00125', empresa: 'Padaria Doce Pão', cnpj: '11.222.333/0001-81', status: 'Com erro', ia: 'Válida', data: '10/04/2026', analista: 'Dra. Carla M.', tipo: 'Novo', docs: {alvara:'err', tecnico:'ok', licenca:'ok'}, obs: 'Alvará anterior com data de validade expirada.' },
  { id: '#2026-00126', empresa: 'Clínica Saúde+', cnpj: '44.555.888/0001-28', status: 'Ag. correção', ia: 'Inválida', data: '11/04/2026', analista: 'Dr. Bruno R.', tipo: 'Renovação', docs: {alvara:'ok', tecnico:'err', licenca:'ok'}, obs: 'Responsável técnico não está cadastrado no CRM.' },
  { id: '#2026-00127', empresa: 'Farmácia Vida', cnpj: '77.888.999/0001-38', status: 'Aprovado', ia: 'Válida', data: '12/04/2026', analista: 'Dra. Carla M.', tipo: 'Alvará Sanitário', docs: {alvara:'ok', tecnico:'ok', licenca:'ok'}, obs: '' },
];

// ===== ROLE =====
function setRole(role) {
  currentRole = role;
  document.getElementById('role-switcher').style.display = 'none';
  const app = document.getElementById('app');
  app.classList.add('visible');
  renderApp();
}

function switchRole() {
  document.getElementById('role-switcher').style.display = '';
  const app = document.getElementById('app');
  app.classList.remove('visible');
  currentRole = null;
  pendingRole = null;
  document.getElementById('login-panel').classList.remove('visible');
  document.getElementById('role-cards-step').style.display = '';
  document.getElementById('card-user').classList.remove('selected');
  document.getElementById('card-analyst').classList.remove('selected');
}

function renderApp() {
  const isUser = currentRole === 'user';
  document.getElementById('header-sub').textContent = isUser ? 'Portal de Envio' : 'Dashboard do Analista';
  document.getElementById('header-info').textContent = isUser ? 'Portal do Solicitante' : 'Painel de Controle';
  document.getElementById('header-avatar').textContent = isUser ? 'US' : 'AN';
  document.getElementById('header-username').textContent = isUser ? 'João Solicitante' : 'Dra. Carla Mendes';
  document.getElementById('header-badge').textContent = isUser ? 'Solicitante' : 'Analista';
  document.getElementById('header-badge').className = 'header-role-badge ' + (isUser ? 'badge-user' : 'badge-analyst');
  renderSidebar();
  if(isUser) renderUserHome(); else renderAnalystDashboard();
}

// ===== SIDEBAR =====
function renderSidebar() {
  const isUser = currentRole === 'user';
  const items = isUser ? [
    { icon: iconHome, label: 'Início', page: 'user-home', active: true },
    { icon: iconSend, label: 'Novo Protocolo', page: 'user-new' },
    { icon: iconList, label: 'Meus Processos', page: 'user-processes' },
    { icon: iconBell, label: 'Notificações', page: 'user-notif', badge: () => (window._userNotifs||[]).filter(n=>!n.read).length || '' },
  ] : [
    { icon: iconHome, label: 'Dashboard', page: 'analyst-dashboard', active: true },
    { icon: iconList, label: 'Processos', page: 'analyst-processes', badge: '3' },
    { icon: iconCalendar, label: 'Vistorias', page: 'analyst-vistorias' },
    { icon: iconChart, label: 'Relatórios', page: 'analyst-reports' },
    { icon: iconGear, label: 'Configurações', page: 'analyst-config' },
  ];
  let html = `<div class="sidebar-section"><div class="sidebar-label">Menu</div>`;
  items.forEach(item => {
    const badgeVal = typeof item.badge === 'function' ? item.badge() : item.badge;
    html += `<button class="nav-item${item.active?' active':''}" data-page="${item.page}" onclick="navTo('${item.page}', this)">
      ${item.icon()} ${item.label}
      ${badgeVal?`<span class="nav-badge">${badgeVal}</span>`:''}
    </button>`;
  });
  html += '</div>';
  document.getElementById('sidebar').innerHTML = html;
}

function navTo(page, btn) {
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const pages = {
    'user-home': renderUserHome,
    'user-new': renderUserNew,
    'user-processes': renderUserProcesses,
    'user-notif': renderUserNotif,
    'analyst-dashboard': renderAnalystDashboard,
    'analyst-processes': renderAnalystProcesses,
    'analyst-vistorias': renderAnalystVistorias,
    'analyst-reports': renderAnalystReports,
    'analyst-config': renderAnalystConfig,
  };
  if(pages[page]) pages[page]();
}

// ===== USER PAGES =====
function renderUserHome() {
  const c = document.getElementById('content');
  c.innerHTML = `
    <div class="page-header">
      <div class="page-title">Bem-vindo, João 👋</div>
      <div class="page-sub">Acompanhe seus processos e envie documentos para análise sanitária.</div>
    </div>
    <div class="metrics" style="grid-template-columns: repeat(3,1fr)">
      <div class="metric blue"><div class="metric-label">Total enviados</div><div class="metric-value">3</div><div class="metric-sub">desde jan/2026</div></div>
      <div class="metric amber"><div class="metric-label">Em análise</div><div class="metric-value">1</div><div class="metric-sub">aguardando revisão</div></div>
      <div class="metric green"><div class="metric-label">Aprovados</div><div class="metric-value">1</div><div class="metric-sub">documentos válidos</div></div>
    </div>
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">Meus Processos</div><div class="card-sub">Últimas atualizações</div></div>
        <button class="btn btn-primary btn-sm" onclick="navTo('user-new',null)">${iconSend()} Novo Protocolo</button>
      </div>
      <div class="card-body" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Protocolo</th><th>Tipo</th><th>Data</th><th>Status</th><th>Ação</th></tr></thead>
            <tbody>
              <tr>
                <td><code style="font-family:'DM Mono';font-size:12px;background:var(--gray-100);padding:2px 6px;border-radius:4px">#2026-00123</code></td>
                <td>Alvará Sanitário</td>
                <td>08/04/2026</td>
                <td><span class="badge badge-approved">✓ Aprovado</span></td>
                <td><button class="btn btn-ghost btn-sm" onclick="openProcessDetail(0)">Ver detalhes</button></td>
              </tr>
              <tr>
                <td><code style="font-family:'DM Mono';font-size:12px;background:var(--gray-100);padding:2px 6px;border-radius:4px">#2026-00125</code></td>
                <td>Novo processo</td>
                <td>10/04/2026</td>
                <td><span class="badge badge-error">✕ Com erro</span></td>
                <td><button class="btn btn-ghost btn-sm" onclick="openProcessDetail(2)">Corrigir</button></td>
              </tr>
              <tr>
                <td><code style="font-family:'DM Mono';font-size:12px;background:var(--gray-100);padding:2px 6px;border-radius:4px">#2026-00124</code></td>
                <td>Renovação</td>
                <td>09/04/2026</td>
                <td><span class="badge badge-analysis">⟳ Em análise</span></td>
                <td><button class="btn btn-ghost btn-sm" onclick="openProcessDetail(1)">Acompanhar</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div style="height:16px"></div>
    <div class="flag info">
      ${iconInfo()} <div><strong>Dica:</strong> Clique em <strong>Novo Protocolo</strong> para simular o envio completo de documentos com validação por IA.</div>
    </div>
  `;
}

function renderUserNew() {
  const c = document.getElementById('content');
  c.innerHTML = `
    <div class="page-header">
      <div class="page-title">Novo Protocolo</div>
      <div class="page-sub">Preencha os dados e envie os documentos para análise sanitária.</div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">${iconUser()} Dados do Solicitante</div></div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Nome da Empresa <span class="required">*</span></label><input class="form-input" placeholder="Ex: Restaurante Sabor Ltda" id="nome-empresa"></div>
          <div class="form-group"><label class="form-label">CNPJ <span class="required">*</span></label><input class="form-input" placeholder="00.000.000/0000-00" id="cnpj" oninput="maskCNPJ(this)"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Responsável Técnico <span class="required">*</span></label><input class="form-input" placeholder="Nome completo" id="resp-tec"></div>
          <div class="form-group"><label class="form-label">Tipo de Processo <span class="required">*</span></label>
            <select class="form-select" id="tipo-proc">
              <option value="">Selecione...</option>
              <option>Alvará Sanitário</option>
              <option>Renovação</option>
              <option>Novo processo</option>
              <option>Segunda via</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Telefone</label><input class="form-input" placeholder="(43) 99999-0000"></div>
          <div class="form-group"><label class="form-label">E-mail</label><input class="form-input" placeholder="empresa@email.com"></div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">${iconUpload()} Upload de Documentos</div></div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
        <div class="upload-zone" id="zone-alvara" onclick="handleUpload('alvara')">
          <input type="file" onchange="handleFileInput(event,'alvara')" accept=".pdf">
          <div class="upload-info">
            <div class="upload-icon doc">📄</div>
            <div><div class="upload-name">Alvará Anterior</div><div class="upload-hint">PDF, máx. 5MB</div></div>
          </div>
          <div><button class="btn btn-ghost btn-sm" type="button">${iconUpload()} Selecionar</button></div>
        </div>
        <div class="upload-zone" id="zone-tecnico" onclick="handleUpload('tecnico')">
          <input type="file" onchange="handleFileInput(event,'tecnico')" accept=".pdf">
          <div class="upload-info">
            <div class="upload-icon doc">📋</div>
            <div><div class="upload-name">Documento Técnico</div><div class="upload-hint">PDF, máx. 5MB</div></div>
          </div>
          <div><button class="btn btn-ghost btn-sm" type="button">${iconUpload()} Selecionar</button></div>
        </div>
        <div class="upload-zone" id="zone-licenca" onclick="handleUpload('licenca')">
          <input type="file" onchange="handleFileInput(event,'licenca')" accept=".pdf">
          <div class="upload-info">
            <div class="upload-icon doc">🏥</div>
            <div><div class="upload-name">Licença Sanitária</div><div class="upload-hint">PDF, máx. 5MB</div></div>
          </div>
          <div><button class="btn btn-ghost btn-sm" type="button">${iconUpload()} Selecionar</button></div>
        </div>
      </div>
    </div>

    <div class="card" id="ai-validation-card" style="margin-bottom:16px;display:none">
      <div class="card-header"><div class="card-title" style="display:flex;align-items:center;gap:6px">🤖 Validação Automática (IA) <span id="ai-loading" style="display:none"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></span></div></div>
      <div class="card-body" id="ai-results"></div>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">📍 Acompanhamento do Processo</div></div>
      <div class="card-body">
        <div class="track">
          <div class="track-step"><div class="track-circle active" id="tc1">1</div><div class="track-label">Enviado</div></div>
          <div class="track-line" id="tl1"></div>
          <div class="track-step"><div class="track-circle wait" id="tc2">2</div><div class="track-label">Em Análise</div></div>
          <div class="track-line" id="tl2"></div>
          <div class="track-step"><div class="track-circle wait" id="tc3">⚠</div><div class="track-label">Ag. Correção</div></div>
          <div class="track-line" id="tl3"></div>
          <div class="track-step"><div class="track-circle wait" id="tc4">📅</div><div class="track-label">Vistoria</div></div>
          <div class="track-line" id="tl4"></div>
          <div class="track-step"><div class="track-circle wait" id="tc5">✓</div><div class="track-label">Aprovado</div></div>
        </div>
      </div>
    </div>

    <div style="display:flex;gap:12px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="renderUserHome()">Cancelar</button>
      <button class="btn btn-primary" onclick="submitProcess()">${iconSend()} Enviar para Análise</button>
    </div>
  `;
  window._uploads = {};
}

function handleFileInput(e, type) {
  e.stopPropagation();
  const file = e.target.files[0];
  if(!file) return;
  processFile(file, type);
}

function handleUpload(type) { /* handled by input */ }

function processFile(file, type) {
  if(!window._uploads) window._uploads = {};
  window._uploads[type] = file;
  const zone = document.getElementById('zone-'+type);
  zone.classList.add('has-file');
  const info = zone.querySelector('.upload-info');
  info.innerHTML = `<div class="upload-icon ok">✓</div><div><div class="upload-name">${file.name}</div><div class="upload-hint">${(file.size/1024).toFixed(0)} KB</div></div>`;
  zone.querySelector('button').textContent = '✓ Enviado';
  runAIValidation();
}

function runAIValidation() {
  const card = document.getElementById('ai-validation-card');
  card.style.display = '';
  const loading = document.getElementById('ai-loading');
  const results = document.getElementById('ai-results');
  loading.style.display = '';
  results.innerHTML = '<div style="color:var(--gray-400);font-size:13px;padding:8px 0">Analisando documentos...</div>';
  setTimeout(() => {
    loading.style.display = 'none';
    const ups = window._uploads || {};
    let html = '';
    if(ups.alvara) html += `<div class="ai-item ok-item">${iconCheckGreen()} <div><strong>Alvará Anterior</strong> — Documento identificado e válido. Validade: 12/2026</div></div>`;
    else html += `<div class="ai-item warn">${iconWarn()} <div><strong>Alvará Anterior</strong> — Documento não enviado.</div></div>`;
    if(ups.tecnico) html += `<div class="ai-item warn">${iconWarn()} <div><strong>Documento Técnico</strong> — Campo "Responsável" está incompleto ou ilegível.</div></div>`;
    else html += `<div class="ai-item warn">${iconWarn()} <div><strong>Documento Técnico</strong> — Não enviado.</div></div>`;
    if(ups.licenca) html += `<div class="ai-item ok-item">${iconCheckGreen()} <div><strong>Licença Sanitária</strong> — Documento válido, sem inconsistências.</div></div>`;
    else html += `<div class="ai-item error-item">${iconX()} <div><strong>Licença Sanitária</strong> — Documento obrigatório não enviado.</div></div>`;
    const aiBox = document.createElement('div');
    aiBox.className = 'ai-box';
    aiBox.innerHTML = `<div class="ai-header">${iconAI()}<span class="ai-title">Resultado da IA</span></div>${html}`;
    results.innerHTML = '';
    results.appendChild(aiBox);
  }, 1800);
}

function submitProcess() {
  const nome = document.getElementById('nome-empresa')?.value;
  const cnpj = document.getElementById('cnpj')?.value;
  if(!nome || !cnpj) { showToast('Preencha os campos obrigatórios.', 'error-t'); return; }
  showToast('Protocolo enviado com sucesso! Número: #2026-00128', 'success');
  setTimeout(() => {
    ['tc1','tc2'].forEach(id => {
      const el = document.getElementById(id);
      if(el) { el.className = 'track-circle done'; }
    });
    const tl1 = document.getElementById('tl1');
    if(tl1) tl1.classList.add('done');
  }, 500);
}

function renderUserProcesses() {
  const c = document.getElementById('content');
  c.innerHTML = `
    <div class="page-header"><div class="page-title">Meus Processos</div><div class="page-sub">Histórico completo de solicitações.</div></div>
    <div class="card">
      <div class="card-body" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Protocolo</th><th>Empresa</th><th>Tipo</th><th>Data</th><th>Status</th><th>IA</th><th>Ação</th></tr></thead>
            <tbody>
              ${processes.map((p,i)=>`<tr>
                <td><code style="font-family:'DM Mono';font-size:12px;background:var(--gray-100);padding:2px 6px;border-radius:4px">${p.id}</code></td>
                <td>${p.empresa}</td><td>${p.tipo}</td><td>${p.data}</td>
                <td>${statusBadge(p.status)}</td>
                <td>${p.ia==='Válida'?'<span class="chip chip-valid">✓ Válida</span>':'<span class="chip chip-invalid">✕ Inválida</span>'}</td>
                <td><button class="btn btn-ghost btn-sm" onclick="openProcessDetail(${i})">Ver</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderUserNotif() {
  const c = document.getElementById('content');
  const notifs = window._userNotifs || [
    {id:1, icon:'✅', title:'Processo aprovado', msg:'Processo #2026-00123 (Restaurante Sabor Ltda) foi aprovado. Seu alvará está disponível.', time:'08/04/2026 14:22', type:'success', read:true, proto:'#2026-00123'},
    {id:2, icon:'⚠️', title:'Correção necessária', msg:'Processo #2026-00125: Alvará anterior com data de validade expirada. Faça a correção para prosseguir.', time:'10/04/2026 09:15', type:'warn', read:false, proto:'#2026-00125'},
    {id:3, icon:'🔍', title:'Processo em análise', msg:'Seu protocolo #2026-00124 foi recebido e está em análise pelo analista Dr. Bruno R.', time:'09/04/2026 11:03', type:'info', read:true, proto:'#2026-00124'},
    {id:4, icon:'📅', title:'Vistoria agendada', msg:'Uma vistoria foi agendada para o processo #2026-00126 em 22/04/2026 às 10:30. Certifique-se de que o local esteja disponível.', time:'11/04/2026 16:45', type:'info', read:false, proto:'#2026-00126'},
  ];
  window._userNotifs = notifs;
  const unread = notifs.filter(n=>!n.read).length;

  c.innerHTML = `
    <div class="page-header" style="display:flex;align-items:flex-start;justify-content:space-between">
      <div>
        <div class="page-title">Notificações ${unread>0?`<span style="font-size:14px;background:var(--red);color:white;border-radius:20px;padding:2px 9px;vertical-align:middle">${unread}</span>`:''}</div>
        <div class="page-sub">Atualizações sobre seus processos enviadas pela equipe de análise.</div>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="markAllRead()">Marcar todas como lidas</button>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:16px" id="notif-filters">
      <button class="btn btn-primary btn-sm" onclick="filterNotifs('all',this)" style="border-radius:20px">Todas</button>
      <button class="btn btn-ghost btn-sm" onclick="filterNotifs('unread',this)" style="border-radius:20px">Não lidas</button>
      <button class="btn btn-ghost btn-sm" onclick="filterNotifs('success',this)" style="border-radius:20px">✅ Aprovadas</button>
      <button class="btn btn-ghost btn-sm" onclick="filterNotifs('warn',this)" style="border-radius:20px">⚠️ Correções</button>
      <button class="btn btn-ghost btn-sm" onclick="filterNotifs('info',this)" style="border-radius:20px">🔍 Informativas</button>
    </div>

    <div id="notif-list" style="display:flex;flex-direction:column;gap:10px">
      ${notifs.map(n => renderNotifCard(n)).join('')}
    </div>

    <div style="margin-top:20px">
      <div class="card">
        <div class="card-header"><div class="card-title">📧 Preferências de Notificação</div></div>
        <div class="card-body">
          <div style="display:flex;flex-direction:column;gap:12px">
            ${[
              {label:'Processo aprovado', sub:'Receber e-mail quando um processo for aprovado', checked:true},
              {label:'Correção necessária', sub:'Receber e-mail quando for solicitada uma correção', checked:true},
              {label:'Processo em análise', sub:'Receber e-mail quando o analista iniciar a revisão', checked:false},
              {label:'Vistoria agendada', sub:'Receber e-mail quando uma vistoria for marcada', checked:true},
            ].map((pref,i)=>`
              <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--gray-100)">
                <div>
                  <div style="font-size:13px;font-weight:500">${pref.label}</div>
                  <div style="font-size:12px;color:var(--gray-500)">${pref.sub}</div>
                </div>
                <label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer">
                  <input type="checkbox" ${pref.checked?'checked':''} onchange="showToast('Preferência salva!','success')"
                    style="opacity:0;width:0;height:0;position:absolute">
                  <span id="toggle-${i}" style="position:absolute;inset:0;background:${pref.checked?'var(--green)':'var(--gray-300)'};border-radius:22px;transition:background 0.2s"
                    onclick="togglePref(this,${i})">
                    <span style="position:absolute;top:3px;left:${pref.checked?'21px':'3px'};width:16px;height:16px;background:white;border-radius:50%;transition:left 0.2s;display:block" id="thumb-${i}"></span>
                  </span>
                </label>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:16px">
            <label class="form-label">E-mail para notificações</label>
            <div style="display:flex;gap:8px">
              <input class="form-input" value="empresa@email.com" id="notif-email" style="flex:1">
              <button class="btn btn-primary" onclick="showToast('E-mail atualizado!','success')">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderNotifCard(n) {
  const bg = n.read ? 'var(--gray-50)' : 'white';
  const border = n.read ? 'var(--gray-200)' : (n.type==='success'?'#6ee7b7':n.type==='warn'?'#fcd34d':'#93c5fd');
  const dot = n.read ? '' : `<span style="width:8px;height:8px;border-radius:50%;background:var(--blue);flex-shrink:0;margin-top:4px"></span>`;
  return `<div id="notif-${n.id}" data-type="${n.type}" data-read="${n.read}"
    style="background:${bg};border:1px solid ${border};border-left:4px solid ${border};border-radius:var(--radius-lg);padding:14px 16px;display:flex;gap:12px;align-items:flex-start;transition:all 0.2s">
    <span style="font-size:22px;flex-shrink:0">${n.icon}</span>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
        <span style="font-size:13px;font-weight:600">${n.title}</span>
        ${dot}
        <span style="font-size:11px;color:var(--gray-400);margin-left:auto">${n.time}</span>
      </div>
      <div style="font-size:13px;color:var(--gray-600);line-height:1.5">${n.msg}</div>
      <div style="margin-top:8px;display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="openProcessFromNotif('${n.proto}')">Ver processo</button>
        ${!n.read?`<button class="btn btn-ghost btn-sm" onclick="markOneRead(${n.id})">Marcar como lida</button>`:''}
      </div>
    </div>
  </div>`;
}

function markAllRead() {
  (window._userNotifs||[]).forEach(n=>n.read=true);
  showToast('Todas as notificações marcadas como lidas.','success');
  renderUserNotif();
  updateNotifBadge();
}

function markOneRead(id) {
  const n = (window._userNotifs||[]).find(x=>x.id===id);
  if(n) n.read=true;
  renderUserNotif();
  updateNotifBadge();
}

function filterNotifs(type, btn) {
  document.querySelectorAll('#notif-filters button').forEach(b=>{b.className='btn btn-ghost btn-sm';b.style.borderRadius='20px';});
  btn.className='btn btn-primary btn-sm'; btn.style.borderRadius='20px';
  document.querySelectorAll('#notif-list > div').forEach(el=>{
    if(type==='all') el.style.display='';
    else if(type==='unread') el.style.display=(el.dataset.read==='false')?'':'none';
    else el.style.display=(el.dataset.type===type)?'':'none';
  });
}

function togglePref(el, i) {
  const thumb = document.getElementById('thumb-'+i);
  const isOn = thumb.style.left === '21px';
  el.style.background = isOn ? 'var(--gray-300)' : 'var(--green)';
  thumb.style.left = isOn ? '3px' : '21px';
  showToast('Preferência salva!','success');
}

function openProcessFromNotif(proto) {
  const idx = processes.findIndex(p=>p.id===proto);
  if(idx>=0) openProcessDetail(idx);
}

function updateNotifBadge() {
  const unread = (window._userNotifs||[]).filter(n=>!n.read).length;
  const badge = document.querySelector('.nav-item[data-page="user-notif"] .nav-badge');
  if(badge) badge.textContent = unread > 0 ? unread : '';
}

function pushUserNotif(notif) {
  if(!window._userNotifs) window._userNotifs = [];
  window._userNotifs.unshift(notif);
}

// ===== ANALYST PAGES =====
function renderAnalystDashboard() {
  const c = document.getElementById('content');
  c.innerHTML = `
    <div class="page-header"><div class="page-title">Dashboard do Analista</div><div class="page-sub">Visão geral dos processos em andamento.</div></div>
    <div class="metrics">
      <div class="metric amber"><div class="metric-label">⏳ Pendentes</div><div class="metric-value">23</div><div class="metric-sub">aguardando análise</div></div>
      <div class="metric blue"><div class="metric-label">🔍 Em análise</div><div class="metric-value">12</div><div class="metric-sub">em revisão ativa</div></div>
      <div class="metric green"><div class="metric-label">✓ Aprovados</div><div class="metric-value">45</div><div class="metric-sub">este mês</div></div>
      <div class="metric red"><div class="metric-label">⚠ Com erro</div><div class="metric-value">8</div><div class="metric-sub">requerem correção</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">Taxa de aprovação</div></div>
        <div class="card-body">
          <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:12px">
            <span style="font-size:32px;font-weight:700;color:var(--green)">73%</span>
            <span style="font-size:13px;color:var(--gray-500)">dos processos aprovados</span>
          </div>
          <div class="progress-bar"><div class="progress-fill green" style="width:73%"></div></div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:8px">Meta mensal: 80%</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Tempo médio de análise</div></div>
        <div class="card-body">
          <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:12px">
            <span style="font-size:32px;font-weight:700;color:var(--blue)">3.2</span>
            <span style="font-size:13px;color:var(--gray-500)">dias úteis</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:64%"></div></div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:8px">Meta: abaixo de 5 dias</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div><div class="card-title">Processos Recentes</div></div>
        <button class="btn btn-ghost btn-sm" onclick="navTo('analyst-processes',null)">Ver todos</button>
      </div>
      <div class="card-body" style="padding:0"><div class="table-wrap">
        <table>
          <thead><tr><th>Protocolo</th><th>Empresa</th><th>CNPJ</th><th>Status</th><th>Validação IA</th><th>Ação</th></tr></thead>
          <tbody>
            ${processes.map((p,i)=>`<tr>
              <td><code style="font-family:'DM Mono';font-size:12px;background:var(--gray-100);padding:2px 6px;border-radius:4px">${p.id}</code></td>
              <td>${p.empresa}</td><td style="color:var(--gray-500);font-size:12px">${p.cnpj}</td>
              <td>${statusBadge(p.status)}</td>
              <td>${p.ia==='Válida'?'<span class="chip chip-valid">✓ Válida</span>':'<span class="chip chip-invalid">✕ Inválida</span>'}</td>
              <td><button class="btn btn-primary btn-sm" onclick="openAnalystModal(${i})">Abrir</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div></div>
    </div>
  `;
}

function renderAnalystProcesses() {
  const c = document.getElementById('content');
  c.innerHTML = `
    <div class="page-header"><div class="page-title">Lista de Processos</div></div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-body" style="display:flex;gap:12px;align-items:center">
        <input class="form-input" style="max-width:280px" placeholder="🔍 Buscar empresa, CNPJ ou protocolo..." oninput="filterTable(this.value)">
        <select class="form-select" style="max-width:180px" onchange="filterTable(null,this.value)">
          <option value="">Todos os status</option>
          <option>Pendente</option><option>Em análise</option><option>Aprovado</option><option>Com erro</option><option>Ag. correção</option>
        </select>
      </div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0"><div class="table-wrap">
        <table id="processes-table">
          <thead><tr><th>Protocolo</th><th>Empresa</th><th>CNPJ</th><th>Tipo</th><th>Data</th><th>Status</th><th>IA</th><th>Analista</th><th>Ação</th></tr></thead>
          <tbody id="ptbody">
            ${processes.map((p,i)=>`<tr data-empresa="${p.empresa.toLowerCase()}" data-id="${p.id}" data-status="${p.status}">
              <td><code style="font-family:'DM Mono';font-size:12px;background:var(--gray-100);padding:2px 6px;border-radius:4px">${p.id}</code></td>
              <td>${p.empresa}</td><td style="color:var(--gray-500);font-size:12px">${p.cnpj}</td>
              <td style="font-size:12px">${p.tipo}</td><td style="font-size:12px">${p.data}</td>
              <td>${statusBadge(p.status)}</td>
              <td>${p.ia==='Válida'?'<span class="chip chip-valid">✓</span>':'<span class="chip chip-invalid">✕</span>'}</td>
              <td style="font-size:12px;color:var(--gray-500)">${p.analista}</td>
              <td><button class="btn btn-primary btn-sm" onclick="openAnalystModal(${i})">Abrir</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div></div>
    </div>
  `;
}

function filterTable(search, statusFilter) {
  const rows = document.querySelectorAll('#ptbody tr');
  rows.forEach(r => {
    const empresa = r.dataset.empresa || '';
    const id = r.dataset.id || '';
    const status = r.dataset.status || '';
    let show = true;
    if(search != null && search.length > 0) show = empresa.includes(search.toLowerCase()) || id.includes(search.toLowerCase());
    if(statusFilter && statusFilter.length > 0) show = show && status === statusFilter;
    r.style.display = show ? '' : 'none';
  });
}

function renderAnalystVistorias() {
  const c = document.getElementById('content');
  c.innerHTML = `
    <div class="page-header"><div class="page-title">Vistorias Agendadas</div></div>
    <div class="card">
      <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
        ${[
          {data:'15/04/2026', hora:'09:00', empresa:'Restaurante Sabor Ltda', end:'Rua das Flores, 123', analista:'Dra. Carla M.'},
          {data:'17/04/2026', hora:'14:00', empresa:'Farmácia Vida', end:'Av. Brasil, 456', analista:'Dr. Bruno R.'},
          {data:'22/04/2026', hora:'10:30', empresa:'Clínica Saúde+', end:'Rua São Paulo, 789', analista:'Dra. Carla M.'},
        ].map(v=>`<div class="card" style="border:none;background:var(--gray-50);padding:14px 16px;display:flex;align-items:center;gap:16px">
          <div style="text-align:center;background:var(--blue);color:white;border-radius:8px;padding:8px 12px;min-width:54px">
            <div style="font-size:18px;font-weight:700">${v.data.split('/')[0]}</div>
            <div style="font-size:10px;opacity:0.8">${['','Jan','Fev','Mar','Abr','Mai'][parseInt(v.data.split('/')[1])]}</div>
          </div>
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${v.empresa}</div>
            <div style="font-size:12px;color:var(--gray-500)">${v.end} · ${v.hora} · ${v.analista}</div>
          </div>
          <button class="btn btn-ghost btn-sm">Ver detalhes</button>
        </div>`).join('')}
      </div>
    </div>
  `;
}

function renderAnalystReports() {
  const c = document.getElementById('content');
  const byStatus = {
    Aprovado: processes.filter(p=>p.status==='Aprovado').length,
    Pendente: processes.filter(p=>p.status==='Pendente').length,
    'Em análise': processes.filter(p=>p.status==='Em análise').length,
    'Com erro': processes.filter(p=>p.status==='Com erro').length,
    'Ag. correção': processes.filter(p=>p.status==='Ag. correção').length,
  };
  const total = processes.length;

  c.innerHTML = `
    <div class="page-header" style="display:flex;align-items:flex-start;justify-content:space-between">
      <div>
        <div class="page-title">Relatórios</div>
        <div class="page-sub">Análise consolidada dos processos sanitários — Abril 2026.</div>
      </div>
      <div style="display:flex;gap:8px">
        <select class="form-select" style="width:160px" onchange="showToast('Período atualizado!','success')">
          <option>Abril 2026</option><option>Março 2026</option><option>Fevereiro 2026</option><option>Jan–Abr 2026</option>
        </select>
        <button class="btn btn-primary" onclick="exportReport()">⬇ Exportar PDF</button>
      </div>
    </div>

    <div class="metrics" style="margin-bottom:20px">
      <div class="metric blue"><div class="metric-label">📋 Total de processos</div><div class="metric-value">${total + 83}</div><div class="metric-sub">em 2026</div></div>
      <div class="metric green"><div class="metric-label">✓ Taxa de aprovação</div><div class="metric-value">73%</div><div class="metric-sub">meta: 80%</div></div>
      <div class="metric amber"><div class="metric-label">⏱ Tempo médio</div><div class="metric-value">3.2d</div><div class="metric-sub">meta: ≤5 dias</div></div>
      <div class="metric red"><div class="metric-label">⚠ Taxa de erro</div><div class="metric-value">18%</div><div class="metric-sub">doc. rejeitados</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">Processos por status</div><div class="card-sub">Distribuição atual</div></div>
        <div class="card-body">
          <canvas id="chart-status" height="200"></canvas>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px" id="status-legend"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Processos por mês</div><div class="card-sub">Jan–Abr 2026</div></div>
        <div class="card-body">
          <canvas id="chart-monthly" height="200"></canvas>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">Documentos mais rejeitados</div></div>
        <div class="card-body">
          ${[
            {doc:'Alvará Anterior', pct:48, color:'var(--red)'},
            {doc:'Documento Técnico', pct:31, color:'var(--amber)'},
            {doc:'Licença Sanitária', pct:21, color:'var(--blue)'},
          ].map(d=>`
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px">
                <span>${d.doc}</span><span style="font-weight:600;color:${d.color}">${d.pct}%</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width:${d.pct}%;background:${d.color}"></div></div>
            </div>
          `).join('')}
          <div class="flag warn" style="margin-top:8px;font-size:12px">${iconWarn()} Validade expirada é a causa mais frequente de rejeição do Alvará Anterior.</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">Desempenho por analista</div></div>
        <div class="card-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Analista</th><th>Processos</th><th>Aprovados</th><th>T. Médio</th></tr></thead>
              <tbody>
                <tr><td>Dra. Carla M.</td><td>31</td><td><span style="color:var(--green);font-weight:600">26</span></td><td>2.8d</td></tr>
                <tr><td>Dr. Bruno R.</td><td>24</td><td><span style="color:var(--green);font-weight:600">18</span></td><td>3.9d</td></tr>
                <tr><td>Dr. Marcos T.</td><td>17</td><td><span style="color:var(--green);font-weight:600">11</span></td><td>4.1d</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">Histórico de processos por empresa</div></div>
      <div class="card-body" style="padding:0">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Empresa</th><th>CNPJ</th><th>Total enviados</th><th>Aprovados</th><th>Reprovados</th><th>Último envio</th><th>Status atual</th></tr></thead>
            <tbody>
              ${processes.map(p=>`<tr>
                <td style="font-weight:500">${p.empresa}</td>
                <td style="font-size:12px;color:var(--gray-500)">${p.cnpj}</td>
                <td>1</td>
                <td style="color:var(--green);font-weight:600">${p.status==='Aprovado'?1:0}</td>
                <td style="color:var(--red);font-weight:600">${p.status==='Com erro'?1:0}</td>
                <td style="font-size:12px">${p.data}</td>
                <td>${statusBadge(p.status)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => drawReportCharts(byStatus), 50);
}

function drawReportCharts(byStatus) {
  const canvas1 = document.getElementById('chart-status');
  if(!canvas1) return;
  const ctx1 = canvas1.getContext('2d');
  const labels = Object.keys(byStatus);
  const values = Object.values(byStatus);
  const colors = ['#0e9f6e','#c27803','#1a56db','#e02424','#6b7280'];
  const total = values.reduce((a,b)=>a+b,0)||1;
  let startAngle = -Math.PI/2;
  const cx = canvas1.width/2, cy = canvas1.height/2, r = Math.min(cx,cy)-20, ir = r*0.55;
  ctx1.clearRect(0,0,canvas1.width,canvas1.height);
  values.forEach((v,i)=>{
    const slice = (v/total)*Math.PI*2;
    ctx1.beginPath(); ctx1.moveTo(cx,cy); ctx1.arc(cx,cy,r,startAngle,startAngle+slice);
    ctx1.closePath(); ctx1.fillStyle=colors[i]; ctx1.fill();
    startAngle+=slice;
  });
  ctx1.beginPath(); ctx1.arc(cx,cy,ir,0,Math.PI*2);
  ctx1.fillStyle='white'; ctx1.fill();
  ctx1.fillStyle='#111827'; ctx1.font='bold 18px DM Sans,sans-serif'; ctx1.textAlign='center'; ctx1.textBaseline='middle';
  ctx1.fillText(total, cx, cy-8);
  ctx1.font='11px DM Sans,sans-serif'; ctx1.fillStyle='#6b7280';
  ctx1.fillText('processos', cx, cy+10);
  const leg = document.getElementById('status-legend');
  if(leg) leg.innerHTML = labels.map((l,i)=>`<span style="display:flex;align-items:center;gap:5px;font-size:12px"><span style="width:10px;height:10px;border-radius:2px;background:${colors[i]};display:inline-block"></span>${l}: <strong>${values[i]}</strong></span>`).join('');

  const canvas2 = document.getElementById('chart-monthly');
  if(!canvas2) return;
  const ctx2 = canvas2.getContext('2d');
  const months = ['Jan','Fev','Mar','Abr'];
  const data = [18,22,26,22];
  const approved = [14,17,20,16];
  const w = canvas2.width, h = canvas2.height;
  const pad = {t:10,b:28,l:30,r:10};
  const bw = (w-pad.l-pad.r)/months.length;
  const maxV = Math.max(...data)+5;
  ctx2.clearRect(0,0,w,h);
  [0,0.25,0.5,0.75,1].forEach(f=>{
    const y = pad.t + (h-pad.t-pad.b)*(1-f);
    ctx2.strokeStyle='#e5e7eb'; ctx2.lineWidth=0.5;
    ctx2.beginPath(); ctx2.moveTo(pad.l,y); ctx2.lineTo(w-pad.r,y); ctx2.stroke();
    if(f>0){ctx2.fillStyle='#6b7280';ctx2.font='10px DM Sans,sans-serif';ctx2.textAlign='right';ctx2.fillText(Math.round(f*maxV),pad.l-4,y+4);}
  });
  data.forEach((v,i)=>{
    const x = pad.l + i*bw + bw*0.1;
    const bwidth = bw*0.35;
    const barH = (v/maxV)*(h-pad.t-pad.b);
    const barH2 = (approved[i]/maxV)*(h-pad.t-pad.b);
    const y = pad.t + (h-pad.t-pad.b) - barH;
    const y2 = pad.t + (h-pad.t-pad.b) - barH2;
    ctx2.fillStyle='#bfdbfe'; ctx2.beginPath(); ctx2.roundRect(x,y,bwidth,barH,3); ctx2.fill();
    ctx2.fillStyle='#0e9f6e'; ctx2.beginPath(); ctx2.roundRect(x+bwidth+3,y2,bwidth,barH2,3); ctx2.fill();
    ctx2.fillStyle='#374151'; ctx2.font='11px DM Sans,sans-serif'; ctx2.textAlign='center';
    ctx2.fillText(months[i], x+bwidth, h-pad.b+14);
  });
  const leg2 = canvas2.parentElement;
  if(!leg2.querySelector('.chart-leg')){
    const l=document.createElement('div');l.className='chart-leg';
    l.style.cssText='display:flex;gap:16px;margin-top:8px;font-size:12px;color:#6b7280';
    l.innerHTML='<span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:#bfdbfe;display:inline-block"></span>Total</span><span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;border-radius:2px;background:#0e9f6e;display:inline-block"></span>Aprovados</span>';
    leg2.appendChild(l);
  }
}

function exportReport() {
  showToast('Relatório gerado e enviado ao seu e-mail!','success');
}

function renderAnalystConfig() {
  const c = document.getElementById('content');
  c.innerHTML = `
    <div class="page-header"><div class="page-title">Configurações</div></div>
    <div class="card">
      <div class="card-header"><div class="card-title">Perfil do Analista</div></div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group"><label class="form-label">Nome completo</label><input class="form-input" value="Dra. Carla Mendes"></div>
          <div class="form-group"><label class="form-label">CRF / Registro</label><input class="form-input" value="CRF-PR 12345"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">E-mail institucional</label><input class="form-input" value="carla.mendes@vigilancia.pr.gov.br"></div>
          <div class="form-group"><label class="form-label">Setor</label><input class="form-input" value="Vigilância Sanitária – Norte"></div>
        </div>
        <button class="btn btn-primary" onclick="showToast('Configurações salvas!','success')">Salvar alterações</button>
      </div>
    </div>
  `;
}

// ===== MODALS =====
function openProcessDetail(idx) {
  const p = processes[idx];
  const m = document.getElementById('modal-inner');
  m.innerHTML = `
    <div class="modal-header">
      <div class="modal-title">Detalhes — ${p.id}</div>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="detail-panel">
        <div>
          <div class="detail-label">Informações do Processo</div>
          <div class="detail-row"><span class="detail-key">Empresa</span><span class="detail-val">${p.empresa}</span></div>
          <div class="detail-row"><span class="detail-key">CNPJ</span><span class="detail-val">${p.cnpj}</span></div>
          <div class="detail-row"><span class="detail-key">Tipo</span><span class="detail-val">${p.tipo}</span></div>
          <div class="detail-row"><span class="detail-key">Data de envio</span><span class="detail-val">${p.data}</span></div>
          <div class="detail-row"><span class="detail-key">Status</span><span class="detail-val">${statusBadge(p.status)}</span></div>
        </div>
        <div>
          <div class="detail-label">Documentos Enviados</div>
          <div class="detail-row"><span class="detail-key">Alvará Anterior</span><span class="detail-val">${docChip(p.docs.alvara)}</span></div>
          <div class="detail-row"><span class="detail-key">Doc. Técnico</span><span class="detail-val">${docChip(p.docs.tecnico)}</span></div>
          <div class="detail-row"><span class="detail-key">Licença Sanitária</span><span class="detail-val">${docChip(p.docs.licenca)}</span></div>
          <div class="detail-row"><span class="detail-key">Validação IA</span><span class="detail-val">${p.ia==='Válida'?'<span class="chip chip-valid">✓ Válida</span>':'<span class="chip chip-invalid">✕ Inválida</span>'}</span></div>
        </div>
      </div>
      ${p.obs?`<div style="margin-top:16px"><div class="detail-label">Observações do Analista</div><div class="flag warn" style="margin-top:8px">${iconWarn()} ${p.obs}</div></div>`:''}
      <div style="margin-top:16px">
        <div class="detail-label">Acompanhamento</div>
        <div class="track" style="margin:12px 0">
          <div class="track-step"><div class="track-circle done">✓</div><div class="track-label">Enviado</div></div>
          <div class="track-line done"></div>
          <div class="track-step"><div class="track-circle ${p.status==='Em análise'?'active':p.status==='Pendente'?'wait':'done'}">2</div><div class="track-label">Em Análise</div></div>
          <div class="track-line ${['Ag. correção','Aprovado'].includes(p.status)?'done':''}"></div>
          <div class="track-step"><div class="track-circle ${p.status==='Ag. correção'?'alert':p.status==='Aprovado'?'done':'wait'}">⚠</div><div class="track-label">Correção</div></div>
          <div class="track-line ${p.status==='Aprovado'?'done':''}"></div>
          <div class="track-step"><div class="track-circle wait">📅</div><div class="track-label">Vistoria</div></div>
          <div class="track-line ${p.status==='Aprovado'?'done':''}"></div>
          <div class="track-step"><div class="track-circle ${p.status==='Aprovado'?'done':'wait'}">✓</div><div class="track-label">Aprovado</div></div>
        </div>
      </div>
    </div>
    <div class="modal-footer"><button class="btn btn-ghost" onclick="closeModal()">Fechar</button></div>
  `;
  openModal();
}

function openAnalystModal(idx) {
  const p = processes[idx];
  const m = document.getElementById('modal-inner');
  m.innerHTML = `
    <div class="modal-header">
      <div class="modal-title">Analisar Processo — ${p.id}</div>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="detail-panel">
        <div>
          <div class="detail-label">Processo</div>
          <div class="detail-row"><span class="detail-key">Empresa</span><span class="detail-val">${p.empresa}</span></div>
          <div class="detail-row"><span class="detail-key">CNPJ</span><span class="detail-val">${p.cnpj}</span></div>
          <div class="detail-row"><span class="detail-key">Tipo</span><span class="detail-val">${p.tipo}</span></div>
          <div class="detail-row"><span class="detail-key">Data</span><span class="detail-val">${p.data}</span></div>
          <div class="detail-row"><span class="detail-key">Status</span><span class="detail-val">${statusBadge(p.status)}</span></div>
        </div>
        <div>
          <div class="detail-label">Documentos</div>
          <div class="detail-row"><span class="detail-key">Alvará Anterior</span><span class="detail-val">${docChip(p.docs.alvara)}</span></div>
          <div class="detail-row"><span class="detail-key">Doc. Técnico</span><span class="detail-val">${docChip(p.docs.tecnico)}</span></div>
          <div class="detail-row"><span class="detail-key">Licença Sanitária</span><span class="detail-val">${docChip(p.docs.licenca)}</span></div>
        </div>
      </div>
      <div style="margin-top:16px">
        <div class="detail-label">Resultado da Validação (IA)</div>
        <div class="flag ${p.ia==='Válida'?'success':'warn'}" style="margin-top:8px">
          ${p.ia==='Válida'?iconCheckGreen()+' Todos os documentos estão de acordo com os requisitos.':iconWarn()+' ' +p.obs}
        </div>
      </div>
      <div style="margin-top:16px">
        <div class="detail-label">Observações do Analista</div>
        <textarea id="obs-input" rows="3" placeholder="Digite suas observações...">${p.obs}</textarea>
      </div>
    </div>
    <div class="modal-footer" style="flex-wrap:wrap;gap:8px">
      <button class="btn btn-success" onclick="analystAction('approve',${idx})">${iconCheck()} Aprovar</button>
      <button class="btn btn-ghost" onclick="analystAction('correction',${idx})">${iconWarn()} Solicitar correção</button>
      <button class="btn btn-ghost" onclick="analystAction('vistoria',${idx})">📅 Agendar vistoria</button>
      <button class="btn btn-danger" onclick="analystAction('reject',${idx})">Reprovar</button>
      <button class="btn btn-ghost" onclick="closeModal()" style="margin-left:auto">Cancelar</button>
    </div>
  `;
  openModal();
}

function analystAction(action, idx) {
  const obs = document.getElementById('obs-input')?.value || '';
  processes[idx].obs = obs;
  const p = processes[idx];
  const now = new Date();
  const ts = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`;

  const notifMap = {
    approve: {
      icon:'✅', title:'Processo aprovado',
      msg:`Processo ${p.id} (${p.empresa}) foi aprovado pela analista Dra. Carla Mendes. Seu alvará sanitário está disponível.`,
      type:'success', status:'Aprovado',
      toast:'Processo aprovado! Notificação enviada à empresa.'
    },
    correction: {
      icon:'⚠️', title:'Correção necessária',
      msg:`Processo ${p.id}: Foi solicitada uma correção. Motivo: ${obs||'Documentação incompleta. Verifique os itens apontados.'}`,
      type:'warn', status:'Ag. correção',
      toast:'Correção solicitada. Empresa notificada.'
    },
    vistoria: {
      icon:'📅', title:'Vistoria agendada',
      msg:`Uma vistoria foi agendada para o processo ${p.id} (${p.empresa}). Aguarde a confirmação de data e horário.`,
      type:'info', status:'Em análise',
      toast:'Vistoria agendada. Empresa notificada.'
    },
    reject: {
      icon:'❌', title:'Processo reprovado',
      msg:`Processo ${p.id} foi reprovado. Motivo: ${obs||'Documentação não atende aos requisitos sanitários vigentes.'}`,
      type:'warn', status:'Com erro',
      toast:'Processo reprovado. Empresa notificada.'
    },
  };

  const act = notifMap[action];
  if(act) {
    processes[idx].status = act.status;
    const newNotif = {
      id: Date.now(), icon: act.icon, title: act.title,
      msg: act.msg, time: ts, type: act.type, read: false, proto: p.id
    };
    pushUserNotif(newNotif);
    showToast(act.toast, 'success');
  }
  closeModal();
  renderAnalystDashboard();
}

function openModal() { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }

// ===== HELPERS =====
function statusBadge(s) {
  const map = { 'Pendente': 'badge-pending', 'Em análise': 'badge-analysis', 'Aprovado': 'badge-approved', 'Com erro': 'badge-error', 'Ag. correção': 'badge-wait' };
  return `<span class="badge ${map[s]||''}">${s}</span>`;
}
function docChip(v) {
  if(v==='ok') return '<span class="chip chip-valid">✓ OK</span>';
  if(v==='warn') return '<span style="color:var(--amber);font-size:12px;font-weight:500">⚠ Atenção</span>';
  return '<span class="chip chip-invalid">✕ Erro</span>';
}

function showToast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3500);
}

function maskCNPJ(input) {
  let v = input.value.replace(/\D/g,'');
  v = v.replace(/^(\d{2})(\d)/,'$1.$2');
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/,'$1.$2.$3');
  v = v.replace(/\.(\d{3})(\d)/,'.$1/$2');
  v = v.replace(/(\d{4})(\d)/,'$1-$2');
  input.value = v;
}

// ===== ICONS =====
function iconHome() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h4a1 1 0 001-1v-3h2v3a1 1 0 001 1h4a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>`; }
function iconSend() { return `<svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>`; }
function iconList() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>`; }
function iconBell() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>`; }
function iconCalendar() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>`; }
function iconChart() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>`; }
function iconGear() { return `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>`; }
function iconUpload() { return `<svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>`; }
function iconUser() { return `<svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>`; }
function iconCheck() { return `<svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`; }
function iconCheckGreen() { return `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style="color:var(--green)"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`; }
function iconWarn() { return `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style="color:var(--amber)"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`; }
function iconX() { return `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style="color:var(--red)"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`; }
function iconInfo() { return `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`; }
function iconAI() { return `<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style="color:#5b21b6"><path d="M13 7H7v6h6V7z"/><path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd"/></svg>`; }

// Close modal on overlay click
document.getElementById('modal').addEventListener('click', function(e) {
  if(e.target === this) closeModal();
});
