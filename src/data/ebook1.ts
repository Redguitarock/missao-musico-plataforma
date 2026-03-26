export const EBOOK_MODULE_1 = {
  id: 'modulo-1-psicanalise',
  title: 'Módulo 1 — Introdução à Psicanálise para Músicos',
  lessons: [
    {
      id: 'aula-1-fundamentos',
      title: 'Fundamentos e Estruturas da Mente',
      moduleTitle: 'Introdução à Psicanálise para Músicos',
      blocks: [
        // ---------- PAGE 1 ----------
        { id: 'p1-s1', type: 'section', content: 'Introdução à Psicanálise para Músicos' },
        { id: 'p1-t1', type: 'text', content: 'A música e a psicanálise compartilham uma característica fundamental: ambas buscam dar voz ao que não pode ser facilmente expresso por palavras. O músico trabalha com sons, ritmos e harmonias para comunicar emoções e experiências que transcendem a linguagem verbal. O psicanalista, por sua vez, busca acessar e compreender o material inconsciente que se manifesta através de sonhos, atos falhos, sintomas e associações livres.' },
        { id: 'p1-t2', type: 'text', content: 'Esta introdução à psicanálise foi desenvolvida especificamente para músicos, estabelecendo pontes entre os conceitos psicanalíticos fundamentais e a experiência musical. Ao compreender como o inconsciente influencia sua criatividade, expressão e relacionamento com a música, você poderá não apenas superar bloqueios criativos, mas também enriquecer sua expressão artística e desenvolver uma relação mais profunda e autêntica com sua arte.' },

        // ---------- PAGE 2 ----------
        { id: 'p2-s1', type: 'section', content: 'Fundamentos da Psicanálise' },
        { id: 'p2-ss1', type: 'subsection', content: 'O Inconsciente: A Orquestra Invisível da Mente' },
        { id: 'p2-t1', type: 'text', content: 'O conceito central da psicanálise é o inconsciente — a parte da mente que opera fora da consciência imediata, mas que exerce profunda influência sobre nossos pensamentos, sentimentos e comportamentos. Para o músico, o inconsciente pode ser comparado a uma orquestra invisível que continua tocando mesmo quando não estamos conscientemente ouvindo.' },
        {
          id: 'p2-cg1', type: 'card_group', title: 'O Inconsciente Contém:', cards: [
            { text: 'Memórias reprimidas de experiências passadas' },
            { text: 'Desejos e impulsos que podem ser socialmente inaceitáveis' },
            { text: 'Conflitos internos não resolvidos' },
            { text: 'Material criativo ainda não acessado conscientemente' }
          ]
        },
        {
          id: 'p2-cg2', type: 'card_group', title: 'O Inconsciente se Revela Através de:', cards: [
            { text: 'Sonhos' },
            { text: 'Atos falhos (lapsos de linguagem)' },
            { text: 'Sintomas físicos e psicológicos' },
            { text: 'Associação livre (expressão espontânea de pensamentos)' }
          ]
        },
        { id: 'p2-h1', type: 'highlight', content: 'Relevância para músicos: O processo criativo musical frequentemente acessa material inconsciente. Muitos músicos relatam que suas melhores ideias surgem quando não estão conscientemente tentando criá-las — durante o sono, no chuveiro, ou em momentos de relaxamento. Compreender o inconsciente permite ao músico desenvolver técnicas para acessar este vasto reservatório criativo de forma mais consistente.' },

        // ---------- PAGE 3 ----------
        { id: 'p3-s1', type: 'section', content: 'A Estrutura da Mente: Id, Ego, Pré-consciente e Superego' },
        { id: 'p3-t1', type: 'text', content: 'Freud propôs que a mente humana é composta por três estruturas principais:' },
        {
          id: 'p3-circle', type: 'interactive_circle', items: [
            { id: 'id', title: 'Id', icon: 'local_fire_department', text: 'A parte primitiva e instintiva da personalidade que opera de acordo com o princípio do prazer, buscando gratificação imediata sem considerar realidade ou consequências. É a fonte da energia psíquica e dos impulsos criativos primários.' },
            { id: 'ego', title: 'Ego', icon: 'balance', text: 'A parte da personalidade que lida com a realidade, mediando entre os desejos do id e as restrições do mundo externo. O ego opera segundo o princípio da realidade, adiando a gratificação quando necessário.' },
            { id: 'superego', title: 'Superego', icon: 'gavel', text: 'A parte da personalidade que incorpora os valores e normas sociais, funcionando como uma consciência moral interna. O superego julga as ações e pensamentos do ego, gerando culpa quando suas expectativas não são atendidas.' },
            { id: 'pre', title: 'Pré-Consciente', icon: 'inventory_2', text: 'O pré-consciente é a camada da mente que contém material que não está atualmente na consciência, mas pode ser facilmente acessado quando necessário. Ele serve como uma ponte entre o consciente e o inconsciente.' }
          ]
        },
        { id: 'p3-h1', type: 'highlight', content: 'Relevância para músicos:' },
        { id: 'p3-t2', type: 'text', content: 'Esta estrutura tripartite se manifesta claramente na experiência musical:' },
        {
          id: 'p3-l1', type: 'list', items: [
            'O id representa o impulso criativo puro, a expressão emocional direta e espontânea',
            'O ego representa a habilidade técnica e o conhecimento musical que permite dar forma aos impulsos criativos',
            'O superego representa as vozes críticas internas, as expectativas percebidas e os padrões musicais internalizados'
          ]
        },
        { id: 'p3-t3', type: 'text', content: 'Os bloqueios criativos frequentemente surgem quando o superego é excessivamente crítico, inibindo a expressão espontânea do id antes mesmo que o ego possa dar-lhe forma técnica adequada.' },

        // ---------- MID-READING QUIZ ----------
        { id: 'p3-quiz', type: 'interactive_quiz', question: 'No seu último ensaio ou performance, qual "voz" falou mais alto na sua cabeça?', options: [
          { id: 'o1', label: 'O Id (Vontade pura de tocar o que vier à mente, improvisar sem regras).' },
          { id: 'o2', label: 'O Superego (Crítica constante: "Você errou aquela nota", "Não está perfeito").' },
          { id: 'o3', label: 'O Ego (Foco no processo: "Estou tocando o que repassei na prática").' }
        ]},

        // ---------- PAGE 4 ----------
        { id: 'p4-s1', type: 'section', content: 'Mecanismos de Defesa: Como a Mente se Protege' },
        { id: 'p4-t1', type: 'text', content: 'Os mecanismos de defesa são estratégias psicológicas inconscientes utilizadas pelo ego para proteger-se de ansiedade, conflitos internos e pensamentos ou sentimentos ameaçadores.' },
        {
          id: 'p4-nc1', type: 'numbered_cards', cards: [
            { title: 'Repressão', text: 'Empurrar pensamentos, memórias ou desejos perturbadores para o inconsciente.' },
            { title: 'Negação', text: 'Recusar-se a aceitar a realidade de uma situação perturbadora.' },
            { title: 'Projeção', text: 'Atribuir a outros os próprios pensamentos, sentimentos ou impulsos inaceitáveis.' },
            { title: 'Racionalização', text: 'Criar explicações lógicas para justificar comportamentos ou sentimentos inaceitáveis.' },
            { title: 'Sublimação', text: 'Transformar impulsos ou energias potencialmente problemáticas em atividades socialmente valorizadas, como arte, música ou trabalho.' }
          ]
        },
        { id: 'p4-h1', type: 'highlight', content: 'Relevância para músicos:' },
        { id: 'p4-t2', type: 'text', content: 'Os mecanismos de defesa influenciam profundamente a relação do músico com sua arte:' },
        {
          id: 'p4-l1', type: 'list', items: [
            'A repressão pode bloquear memórias emocionais que poderiam enriquecer a expressão musical',
            'A negação pode impedir o reconhecimento de limitações técnicas que precisam ser trabalhadas',
            'A projeção pode levar à atribuição de críticas excessivas a professores ou colegas',
            'A racionalização pode justificar a procrastinação ou evitação da prática',
            'A sublimação é o mecanismo mais construtivo, permitindo que energias emocionais intensas sejam canalizadas para a criação musical'
          ]
        },

        // ---------- PAGE 5 ----------
        { id: 'p5-s1', type: 'section', content: 'Conceitos Psicanalíticos Centrais para Músicos' },
        { id: 'p5-ss1', type: 'subsection', content: 'Sublimação: A Alquimia Psíquica da Criatividade' },
        { id: 'p5-t1', type: 'text', content: 'A sublimação é um dos conceitos mais relevantes para artistas e músicos. Trata-se do processo pelo qual impulsos primitivos (frequentemente de natureza sexual ou agressiva) são transformados em atividades socialmente valorizadas e culturalmente significativas.' },
        { id: 'p5-t2', type: 'text', content: 'Na sublimação, a energia psíquica é redirecionada de seu objetivo original para um novo objetivo não-sexual e socialmente aceito, sem perder sua intensidade emocional. Este mecanismo está no cerne da criatividade artística.' },
        { id: 'p5-ss2', type: 'subsection', content: 'Como funciona para músicos:' },
        {
          id: 'p5-flow1', type: 'flow_steps', steps: [
            { icon: 'heart_broken', title: 'Emoção Bruta', text: 'Sentimentos intensos de raiva, paixão, luto ou desejo' },
            { icon: 'psychology', title: 'Processo de Sublimação', text: 'Transformação psíquica da energia emocional' },
            { icon: 'music_note', title: 'Expressão Artística', text: 'Criação musical que preserva a intensidade emocional' }
          ]
        },
        { id: 'p5-t3', type: 'text', content: 'A sublimação bem-sucedida permite que o músico:' },
        {
          id: 'p5-l1', type: 'list', items: [
            'Expresse emoções intensas de forma socialmente valorizada',
            'Transforme experiências dolorosas em arte significativa',
            'Conecte-se com o público através de emoções universais',
            'Obtenha satisfação e reconhecimento através da expressão artística'
          ]
        },

        // ---------- PAGE 6 ----------
        { id: 'p6-s1', type: 'section', content: 'Transferência e Contratransferência: O Relacionamento com o Instrumento' },
        { id: 'p6-t1', type: 'text', content: 'Na psicanálise clássica, a transferência ocorre quando um paciente projeta sentimentos, atitudes e expectativas de relacionamentos anteriores (especialmente com figuras parentais) para o analista. A contratransferência refere-se às reações emocionais do analista ao paciente.' },
        {
          id: 'p6-cg1', type: 'card_group', cards: [
            {
              title: 'Transferência Musical',
              text: 'Os músicos frequentemente desenvolvem relações transferênciais com seus instrumentos, professores e com a própria música:',
              items: [
                'O instrumento pode se tornar um objeto transferencial que recebe projeções de relacionamentos significativos anteriores',
                'A relação com professores de música frequentemente recapitula dinâmicas parentais',
                'A música em si pode se tornar um "outro" com quem o músico mantém um relacionamento emocional complexo'
              ]
            },
            {
              title: 'Contratransferência Musical',
              text: 'As reações emocionais do músico ao seu instrumento, ao público ou à música que está interpretando podem revelar aspectos importantes de sua psique:',
              items: [
                'Frustração desproporcional com limitações técnicas',
                'Ansiedade excessiva ao tocar certas peças',
                'Sensação de traição quando o instrumento "não responde" como esperado',
                'Reações emocionais intensas a certos compositores ou estilos'
              ]
            }
          ]
        },
        { id: 'p6-note', type: 'note', content: 'Compreender estas dinâmicas transferênciais pode ajudar o músico a desenvolver uma relação mais consciente e saudável com seu instrumento e sua arte.' },

        // ---------- PAGE 7 ----------
        { id: 'p7-s1', type: 'section', content: 'O Instrumento como Objeto Transicional' },
        { id: 'p7-t1', type: 'text', content: 'Para muitos músicos, o instrumento musical transcende sua função prática e assume características de um objeto transicional.' },
        { id: 'p7-t2', type: 'text', content: 'Este conceito, desenvolvido pelo psicanalista D.W. Winnicott, refere-se a um objeto que a criança utiliza para lidar com a ansiedade da separação, funcionando como uma ponte entre o mundo interno e externo, entre a fantasia e a realidade, auxiliando na construção da identidade e na autonomia.' },
        { id: 'p7-t3', type: 'text', content: 'No universo musical, o instrumento pode carregar um investimento emocional profundo. Ele deixa de ser apenas uma ferramenta para a produção de som e se transforma em uma extensão do self, um confidente silencioso, um refúgio seguro ou até mesmo um substituto simbólico para figuras de apego primárias.' },
        {
          id: 'p7-cg1', type: 'card_group', cards: [
            { title: 'Extensão do Self', text: 'O instrumento se torna parte integrante da identidade do músico, um prolongamento de sua expressão.' },
            { title: 'Confidente Emocional', text: 'Um espaço seguro onde sentimentos complexos podem ser explorados e expressos sem julgamento.' },
            { title: 'Refúgio Simbólico', text: 'Oferece conforto e estabilidade, agindo como um porto seguro contra as pressões externas e internas.' },
            { title: 'Substituto de Apego', text: 'Pode preencher a lacuna de figuras importantes, especialmente em situações de perda ou ausência.' }
          ]
        },
        { id: 'p7-t3-5', type: 'text', content: 'Essa relação transferencial com o instrumento pode se manifestar de diversas formas, como um apego excessivo, ansiedade intensa de separação ou expectativas irrealistas sobre o que o instrumento deve proporcionar emocionalmente ao artista. Compreender essa dinâmica é crucial para um desenvolvimento musical e pessoal equilibrado.' },
        {
          id: 'p7-c1', type: 'case',
          title: 'Estudo de Caso Clínica: André, um violinista talentoso',
          description: 'André, um violinista talentoso, desenvolveu uma relação quase obsessiva com seu instrumento, praticando horas diárias e sentindo extrema ansiedade quando separado dele. Recusava-se a emprestar seu violino ou deixá-lo ser manuseado por luthiers, mesmo quando necessitava de reparos. Na análise, revelou-se que o violino havia se tornado um objeto transicional que simbolicamente substituía sua mãe, que faleceu precocemente, logo após lhe dar seu primeiro violino. O instrumento carregava um investimento emocional inconsciente muito além de seu valor musical ou material.'
        },
        { id: 'p7-t4', type: 'text', content: 'Reconhecer o instrumento como um objeto transicional permite ao músico explorar a profundidade de sua conexão com ele, identificando os significados simbólicos que carrega. Isso pode liberar o músico de dependências excessivas e ajudar a processar a dor associada à perda ou dano do instrumento, integrando essa relação de forma saudável na psique do artista.' },
        
        // ---------- PAGE 8 / 9 ----------
        { id: 'p9-s1', type: 'section', content: 'Resistência: Os Obstáculos Internos ao Desenvolvimento Musical' },
        { id: 'p9-t1', type: 'text', content: 'Na psicanálise, resistência refere-se às forças psíquicas que se opõem ao processo terapêutico e à revelação de material inconsciente. As resistências são mecanismos de defesa que protegem o ego de ansiedade, mas também impedem o crescimento e a mudança.' },
        { id: 'p9-ss1', type: 'subsection', content: 'Resistências musicais comuns' },
        {
          id: 'p9-icards', type: 'icon_cards', cards: [
            { icon: 'pending_actions', title: 'Procrastinação', text: 'Adiar constantemente a prática ou composição' },
            { icon: 'flight_takeoff', title: 'Perfeccionismo', text: 'Exigência paralisante que impede a conclusão de projetos' },
            { icon: 'error', title: 'Autossabotagem', text: 'Comportamentos que prejudicam o desempenho antes de apresentações importantes' },
            { icon: 'psychology', title: 'Racionalização', text: 'Justificativas para evitar enfrentar limitações técnicas' },
            { icon: 'warning', title: 'Evitação', text: 'Fuga de gêneros ou técnicas que provocam ansiedade' }
          ]
        },
        { id: 'p9-ss2', type: 'subsection', content: 'Superando resistências' },
        { id: 'p9-t2', type: 'text', content: 'Assim como na terapia psicanalítica, o primeiro passo para superar resistências musicais é reconhecê-las conscientemente. Ao identificar padrões de resistência, o músico pode desenvolver estratégias específicas para trabalhar através deles, em vez de ao redor deles.' },
        {
          id: 'p9-pie', type: 'pie_chart', segments: [
            { label: 'Procrastinação', percentage: 35, color: '#002636' },
            { label: 'Perfeccionismo', percentage: 25, color: '#00506E' },
            { label: 'Autossabotagem', percentage: 15, color: '#007AAB' },
            { label: 'Racionalização', percentage: 15, color: '#3DBEE5' },
            { label: 'Evitação', percentage: 10, color: '#8ADDFA' }
          ]
        },

        // ---------- PAGE 10 ----------
        { id: 'p10-s1', type: 'section', content: 'Trauma e Repetição: Padrões Recorrentes na Carreira Musical' },
        { id: 'p10-t1', type: 'text', content: 'Freud observou que pacientes frequentemente repetem experiências traumáticas em vez de lembrá-las — um fenômeno que chamou de "compulsão à repetição". Esta tendência inconsciente de recriar situações dolorosas representa uma tentativa da psique de dominar o trauma original.' },
        { id: 'p10-ss1', type: 'subsection', content: 'Repetição na vida musical:' },
        {
          id: 'p10-timeline1', type: 'timeline', steps: [
            { title: 'Abandono de Projetos', text: 'Repetidamente abandonar projetos no mesmo ponto de desenvolvimento' },
            { title: 'Conflitos Recorrentes', text: 'Padrões recorrentes de conflitos com colaboradores ou professores' },
            { title: 'Autossabotagem', text: 'Sabotar oportunidades de sucesso quando estão prestes a se concretizar' },
            { title: 'Reativação de Ansiedades', text: 'Buscar repetidamente situações de performance que reativam ansiedades antigas' }
          ]
        },
        { id: 'p10-ss2', type: 'subsection', content: 'Transformando a repetição:' },
        { id: 'p10-t2', type: 'text', content: 'A consciência destes padrões permite ao músico interromper ciclos destrutivos e transformar a energia da repetição em crescimento. Em vez de repetir inconscientemente, o músico pode trabalhar através das experiências traumáticas, integrando-as conscientemente em sua expressão artística.' },
        { id: 'p10-note1', type: 'note', variant: 'success', icon: 'check_circle', content: 'Quando reconhecidos e trabalhados conscientemente, os padrões de repetição podem se tornar fontes valiosas de material criativo e crescimento pessoal.' },

        // ---------- PAGE 11 ----------
        { id: 'p11-s1', type: 'section', content: 'Narcisismo e Vulnerabilidade: O Paradoxo da Performance' },
        { id: 'p11-t1', type: 'text', content: 'O narcisismo na teoria psicanalítica vai além do uso coloquial do termo. Refere-se ao investimento da energia psíquica (libido) no self, em contraste com o investimento em objetos externos. Um grau saudável de narcisismo é necessário para a autoestima e confiança.' },
        { id: 'p11-ss1', type: 'subsection', content: 'O paradoxo narcísico do músico:' },
        {
          id: 'p11-icirc1', type: 'interactive_circle', items: [
            { icon: 'star', title: 'Confiança no Palco', text: 'A performance musical requer confiança e presença (narcisismo saudável)' },
            { icon: 'favorite', title: 'Vulnerabilidade Emocional', text: 'Exige vulnerabilidade emocional e abertura (exposição do self)' },
            { icon: 'balance', title: 'Equilíbrio', text: 'O músico deve equilibrar autoafirmação com receptividade emocional' }
          ]
        },
        { id: 'p11-ss2', type: 'subsection', content: 'Feridas narcísicas:' },
        { id: 'p11-t2', type: 'text', content: 'Experiências de crítica severa, rejeição ou fracasso público podem criar "feridas narcísicas" — danos à autoimagem que podem levar a:' },
        {
          id: 'p11-l1', type: 'list', items: [
            'Medo paralisante de julgamento',
            'Perfeccionismo extremo',
            'Evitação de riscos criativos',
            'Necessidade excessiva de validação externa'
          ]
        },
        { id: 'p11-t3', type: 'text', content: 'Compreender a dinâmica do narcisismo permite ao músico desenvolver uma relação mais equilibrada com sua autoimagem artística, nem tão frágil que não suporte críticas, nem tão rígida que bloqueie a vulnerabilidade necessária para a expressão autêntica.' },

        // ---------- FINAL QUIZ (Interativo) ----------
        { id: 'p7-quiz', type: 'interactive_quiz', question: 'Após ler até aqui, como você enxerga a sua relação com o seu instrumento atualmente?', options: [
          { id: 'o1', label: 'Vejo o instrumento apenas como uma ferramenta técnica e de trabalho.' },
          { id: 'o2', label: 'Ele se tornou um confidente, quase uma extensão de quem eu sou.' },
          { id: 'o3', label: 'Minha relação é difícil, projeto muita frustração e perfeccionismo nele.' }
        ]}
      ]
    }
  ]
};
