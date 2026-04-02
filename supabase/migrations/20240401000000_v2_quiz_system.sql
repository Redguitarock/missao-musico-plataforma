-- Migration: Sistema de Quiz Híbrido V2 (Strict Relational)
-- Preservando tabelas antigas para read-only. Criando tabelas exclusivas v2.

-- 1. Quizzes e Versionamento
CREATE TABLE public.v2_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    professional_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    version INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Perguntas do Quiz
CREATE TABLE public.v2_quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.v2_quizzes(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'text')),
    text TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0
);

-- 3. Opções da Pergunta (Múltipla Escolha)
CREATE TABLE public.v2_quiz_question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.v2_quiz_questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    weight_key TEXT,
    weight_value INTEGER DEFAULT 0
);

-- 4. Perfis de Peso
CREATE TABLE public.v2_weight_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id INTEGER NOT NULL, -- Supondo integer se módulos na old eram assim, ou mude para uuid
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.v2_weight_profile_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.v2_weight_profiles(id) ON DELETE CASCADE,
    weight_key TEXT NOT NULL
);

-- 5. Relacionamento Quiz <-> Módulo
CREATE TABLE public.v2_module_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id INTEGER NOT NULL,
    quiz_id UUID REFERENCES public.v2_quizzes(id) ON DELETE CASCADE,
    quiz_version INTEGER NOT NULL DEFAULT 1,
    weight_profile_id UUID REFERENCES public.v2_weight_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Resposta do Usuário (Container do Quiz feito)
CREATE TABLE public.v2_user_quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_quiz_id UUID REFERENCES public.v2_module_quizzes(id) ON DELETE CASCADE,
    quiz_version INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Respostas por Pergunta (As Alternativas/Textos que o aluno preencheu)
CREATE TABLE public.v2_user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES public.v2_user_quiz_responses(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.v2_quiz_questions(id) ON DELETE CASCADE,
    option_id UUID REFERENCES public.v2_quiz_question_options(id) ON DELETE SET NULL,
    text_response TEXT,
    weight_applied JSONB -- Snapshot: { "ansiedade": 10 }
);

-- 8. Resultado Diagnóstico Consolidado do Caminho (Module)
CREATE TABLE public.v2_module_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.v2_diagnostic_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_result_id UUID REFERENCES public.v2_module_results(id) ON DELETE CASCADE,
    dominant_category TEXT,
    secondary_category TEXT,
    behavioral_profile TEXT,
    intensities JSONB,
    global_score INTEGER,
    short_term_trend TEXT CHECK (short_term_trend IN ('increase', 'decrease', 'stable')),
    long_term_trend TEXT CHECK (long_term_trend IN ('increase', 'decrease', 'stable'))
);

-- 9. Insights e Notes
CREATE TABLE public.v2_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id INTEGER,
    type TEXT CHECK (type IN ('pattern', 'alert', 'evolution')),
    description TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.v2_professional_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id INTEGER,
    content TEXT NOT NULL,
    tags JSONB,
    linked_insight_id UUID REFERENCES public.v2_insights(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) - habilitando para segurança básica
ALTER TABLE public.v2_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_quiz_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_weight_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_weight_profile_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_module_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_user_quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_module_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.v2_professional_notes ENABLE ROW LEVEL SECURITY;

-- Note: Políticas de RLS específicas (SELECT/INSERT) p/ profissionais e pacientes 
-- seriam adicionadas aqui, definindo que pacientes veem suas própias respostas.
