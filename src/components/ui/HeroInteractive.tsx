'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function HeroInteractive() {
  const containerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [scrollY, setScrollY] = useState(0)
  
  // Track Scroll for Parallax and Zoom Out Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Canvas Logic for Continuous Neurological Connections + Notes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const particles: Particle[] = []
    
    // Mouse config (raio maior, movimento suave p/ paz)
    const mouse = { x: -1000, y: -1000, radius: 250 }

    const updateCanvasSize = () => {
      if (!containerRef.current) return
      canvas.width = containerRef.current.clientWidth
      canvas.height = containerRef.current.clientHeight
      init()
    }

    class Particle {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      density: number
      char: string
      color: string

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.baseX = x
        this.baseY = y
        this.size = Math.random() * 2 + 1
        this.density = (Math.random() * 10) + 1 // Densidade menor para fluidez
        const musicalChars = ['♪', '♫', '♬', '•', '∘', '•']
        this.char = musicalChars[Math.floor(Math.random() * musicalChars.length)]
        
        // Colors from theme: primary, secondary, and bright teal
        const colors = ['#006a62', '#81f3e5', '#8ef4e9', 'rgba(255,255,255,0.7)']
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        if (this.char === '•' || this.char === '∘') {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.closePath()
          ctx.fill()
        } else {
          ctx.font = `${this.size * 5}px Arial`
          ctx.globalAlpha = 0.6
          ctx.fillText(this.char, this.x, this.y)
          ctx.globalAlpha = 1
        }
      }

      update() {
        // Movimento ambiente lento constante
        this.baseX += Math.sin(Date.now() * 0.001 + this.density) * 0.2
        this.baseY += Math.cos(Date.now() * 0.001 + this.density) * 0.2

        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        let forceDirectionX = dx / distance
        let forceDirectionY = dy / distance
        let maxDistance = mouse.radius
        let force = (maxDistance - distance) / maxDistance
        
        // Atração suave (efeito paz ao invés de repelir abruptamente)
        let directionX = forceDirectionX * force * (this.density * 0.15)
        let directionY = forceDirectionY * force * (this.density * 0.15)

        if (distance < mouse.radius) {
          // Atrai levemente em direção ao mouse
          this.x += directionX
          this.y += directionY
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX
            this.x -= dx / 50
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY
            this.y -= dy / 50
          }
        }
      }
    }

    const init = () => {
      particles.length = 0
      // Aumentando número de pontos para que as conexões estejam "sempre ligadas"
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 6000)
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width
        let y = Math.random() * canvas.height
        particles.push(new Particle(x, y))
      }
    }

    const connect = () => {
      let opacityValue = 1
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x
          let dy = particles[a].y - particles[b].y
          let distance = dx * dx + dy * dy

          // Distância mínima maior para rede neural constante
          if (distance < (canvas.width / 5) * (canvas.height / 5)) {
            opacityValue = 1 - (distance / 40000)
            if (!ctx) continue
            // Linhas constantes e mais visíveis perto
            ctx.strokeStyle = `rgba(129, 243, 229, ${opacityValue * 0.3})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }
      connect()
      animationFrameId = requestAnimationFrame(animate)
    }

    updateCanvasSize()
    animate()
    window.addEventListener('resize', updateCanvasSize)

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return
      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = e.touches[0].clientX - rect.left
      mouse.y = e.touches[0].clientY - rect.top
    }
    
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    if (containerRef.current) {
       containerRef.current.addEventListener('mousemove', handleMouseMove)
       containerRef.current.addEventListener('mouseleave', handleMouseLeave)
       containerRef.current.addEventListener('touchmove', handleTouchMove)
       containerRef.current.addEventListener('touchstart', handleTouchMove)
       containerRef.current.addEventListener('touchend', handleMouseLeave)
    }

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      if (containerRef.current) {
         containerRef.current.removeEventListener('mousemove', handleMouseMove)
         containerRef.current.removeEventListener('mouseleave', handleMouseLeave)
         containerRef.current.removeEventListener('touchmove', handleTouchMove)
         containerRef.current.removeEventListener('touchstart', handleTouchMove)
         containerRef.current.removeEventListener('touchend', handleMouseLeave)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Parallax Values
  const zoomScaleImage = Math.max(0.7, 1 - scrollY * 0.0005)
  const translateYImage = scrollY * 0.2
  const translateYText = scrollY * 0.1

  return (
    <header 
      ref={containerRef}
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-screen md:min-h-[90vh] flex items-center overflow-hidden bg-[#00151d]"
    >
      {/* Camada 0: Fundo Escuro com Degradê caindo para a escuridão absoluta da "surface" */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00151d] via-[#0D2A35]/30 to-surface z-0 pointer-events-none" />

      {/* Camada 1: Efeito Interativo de Conexões Neurais sob tudo */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[1] pointer-events-auto mix-blend-screen opacity-70"
      />

      {/* Camada 2: Conteúdo via Grid + Textos */}
      <div className="max-w-7xl mx-auto px-6 relative z-[3] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Texto e CTA (Com leve parallax translateY) */}
          <div style={{ transform: `translateY(${translateYText}px)` }} className="transition-transform duration-75 ease-out">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-[#81f3e5]/20 text-[#81f3e5] text-xs md:text-sm font-bold tracking-wider mb-6 backdrop-blur-md shadow-sm">
              MÉTODO PSICANALÍTICO
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold text-white tracking-tighter leading-[1.1] mb-6">
              Desbloqueie sua mente para <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81f3e5] to-[#26A69A]">criar sem limites</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300/90 leading-relaxed mb-10 max-w-xl font-light">
              Um método que une psicanálise e música para ajudar você a superar bloqueios emocionais e evoluir artisticamente com clareza e propósito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cadastro" className="bg-[#26A69A] text-white px-8 py-4 rounded-xl text-lg font-bold text-center transition-all hover:bg-[#81f3e5] hover:text-[#005049] hover:scale-105 active:scale-95 shadow-xl shadow-[#26A69A]/30">
                Começar minha transformação
              </Link>
            </div>
          </div>

          {/* Camada 3: Imagem da Mente mesclada + Animação de Zoom e Parallax (Desativado no Mobile para não quebrar leitura) */}
          <div className="hidden lg:flex relative h-[400px] md:h-[600px] items-center justify-center pointer-events-none mt-10 md:mt-0">
             <div 
                className="w-full h-full absolute inset-0 transition-transform duration-75 ease-out flex items-center justify-center"
                style={{ transform: `scale(${zoomScaleImage}) translateY(${translateYImage}px)` }}
             >
                <img
                  alt="Mente Cérebro Conexões Música"
                  // o mix-blend-screen + drop-shadow dá a sensação de png que emana a luz das linhas
                  className="max-w-[120%] h-auto md:w-full md:h-full object-contain mix-blend-screen drop-shadow-[0_0_50px_rgba(38,166,154,0.15)] opacity-90"
                  src="/Hero%20imagem.png"
                />
             </div>
          </div>
          
        </div>
      </div>
      
      {/* Camada Final: Degradê de transição para unir a Hero com o restante claro/cinza da plataforma */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-surface to-transparent z-[5] pointer-events-none" />
    </header>
  )
}
