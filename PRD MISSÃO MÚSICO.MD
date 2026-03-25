# 📘 DOCUMENTO MESTRE — MISSÃO MÚSICO

## 1. CONTEXTO GERAL DO PROJETO

Você está desenvolvendo uma plataforma SaaS chamada **Missão Músico**.

O objetivo da plataforma é fornecer uma jornada guiada de desenvolvimento psíquico e criativo para músicos, baseada em princípios de psicanálise aplicada à música.

A plataforma deve transformar conteúdos existentes (e-books) em uma experiência interativa, progressiva e orientada por diagnóstico.

IMPORTANTE:

* O projeto será desenvolvido por uma única pessoa
* Priorizar simplicidade, velocidade e clareza
* Evitar overengineering
* Estruturar tudo de forma escalável desde o início

---

## 2. OBJETIVO DO PRODUTO

Criar uma plataforma que:

* Oferece conteúdo estruturado em forma de jornada
* Mede o progresso do usuário
* Gera diagnósticos baseados em respostas
* Incentiva evolução contínua
* Monetiza via assinatura recorrente
* Permite expansão futura para especialistas parceiros

---

## 3. MODELO DE NEGÓCIO

### Planos:

#### 🟢 Plano Essencial

* Acesso completo aos módulos
* Conteúdo interativo
* Quiz ao final de cada módulo
* Diagnóstico automático

#### 🔵 Plano Acompanhamento

* Tudo do Essencial
* Acesso a lives semanais
* Conteúdos aprofundados
* Acesso à comunidade

#### 🔴 Plano Mentoria

* Tudo dos anteriores
* Sessões em grupo mensais
* Acesso a sessões individuais (pagas à parte)
* Benefícios exclusivos (ex: descontos em workshops)

---

## 4. ESTRUTURA DA PLATAFORMA

### 4.1 Landing Page (MVP)

* Headline clara
* Explicação do produto
* Botões:

  * Criar conta
  * Login

---

### 4.2 Área logada

#### Layout geral:

* Topbar:

  * Logo
  * Notificações (placeholder)
  * Menu do usuário

* Sidebar (colapsável):

  * Home
  * Jornada
  * Desafios
  * Progresso
  * Conteúdos (lives)
  * Perfil

---

## 5. EXPERIÊNCIA DO USUÁRIO

### Home:

* Continuar de onde parou
* Progresso geral (%)
* Próximo módulo recomendado
* Conteúdos recentes

---

### Jornada:

* Lista de módulos sequenciais
* Indicação visual de progresso
* Ordem recomendada obrigatória (guidance)

---

### Módulo:

Cada módulo deve conter:

* Conteúdo dividido em blocos
* Destaques visuais
* Caixas de reflexão
* Interações simples (expandir conteúdo)
* Perguntas ao longo do conteúdo
* Quiz ao final

---

## 6. SISTEMA DE QUIZ E DIAGNÓSTICO

### Requisitos:

* Cada módulo possui um quiz
* Respostas devem ser armazenadas
* Gerar um diagnóstico baseado nas respostas

### Diagnóstico deve:

* Identificar padrões (ex: bloqueio emocional)
* Apontar melhorias
* Sugerir próximos passos

---

### Diferenciação por plano:

* Essencial → diagnóstico automático
* Acompanhamento → diagnóstico + conteúdo aprofundado
* Mentoria → diagnóstico + acesso a especialista

---

## 7. SISTEMA DE CONTEÚDO

### Tipos:

* Módulos (conteúdo principal)
* Lives gravadas (YouTube não listado)
* Workshops (futuro)

---

## 8. SISTEMA DE SESSÕES (MENTORIA)

### Regras:

* Sessões NÃO são ilimitadas
* Sessões individuais são pagas separadamente
* Sessões em grupo incluídas no plano Mentoria

### MVP:

* Usar link externo (ex: calendário)
* Não construir sistema próprio inicialmente

---

## 9. ARQUITETURA TÉCNICA

### Stack obrigatória:

* Frontend: Next.js
* Backend: Supabase
* Banco: PostgreSQL (via Supabase)
* Auth: Supabase Auth
* Storage: Supabase Storage
* Pagamento: Stripe ou Mercado Pago

---

## 10. MODELAGEM DE DADOS (BASE)

Criar as seguintes tabelas:

* users
* plans
* subscriptions
* modules
* lessons
* user_progress
* quiz_questions
* quiz_answers
* diagnoses
* content_items (lives, workshops)

---

## 11. REGRAS DE NEGÓCIO

* Usuário só acessa conteúdo com assinatura ativa
* Progresso deve ser salvo automaticamente
* Jornada deve ser guiada (ordem recomendada)
* Diagnóstico deve ser exibido ao final do quiz
* Sistema deve sugerir upgrade de plano com base no resultado

---

## 12. UX/UI DIRETRIZES

* Interface simples e limpa
* Mobile-first
* Uma ação principal por tela
* Evitar excesso de informação
* Navegação intuitiva

---

## 13. ROADMAP DE DESENVOLVIMENTO

### Fase 1

* Autenticação
* Estrutura base
* Dashboard
* Módulos

### Fase 2

* Quiz
* Diagnóstico
* Progresso

### Fase 3

* Pagamento
* Controle de acesso

### Fase 4

* Conteúdo real
* Lives

---

## 14. ESCALABILIDADE FUTURA

Preparar para:

* Cadastro de especialistas
* Sistema de atendimento
* Comissão por sessões
* Marketplace interno

---

## 15. RESTRIÇÕES IMPORTANTES

* NÃO implementar features complexas inicialmente
* NÃO criar animações avançadas
* NÃO criar sistema de chat interno
* NÃO criar app mobile

---

## 16. OBJETIVO DA IA (ANTIGRAVITY)

A IA deve:

* Gerar arquitetura limpa e modular
* Criar tarefas organizadas por fase
* Sugerir melhorias sem aumentar complexidade
* Priorizar entrega funcional rápida (MVP)
* Garantir consistência entre frontend, backend e banco

---

## 17. FORMATO DE SAÍDA ESPERADO

A IA deve retornar:

1. Planejamento técnico detalhado
2. Lista de tarefas por etapa
3. Estrutura do banco de dados
4. Estrutura de pastas do projeto
5. Fluxos principais do sistema
6. Sugestões de melhorias incrementais

---

## 18. PRIORIDADE ABSOLUTA

* Produto funcional
* Simples
* Validável rapidamente

Evitar qualquer complexidade desnecessária.
