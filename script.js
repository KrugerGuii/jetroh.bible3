const level = document.querySelector('#bible-level')
const levelMessage = document.querySelector('.level-message')
const messages = [
  'Ainda estou conhecendo a Bíblia.',
  'Já conheço a Bíblia e quero me aprofundar mais.',
  'Quero estudar com profundidade, contexto e textos originais.'
]
if (level && levelMessage) {
  const updateLevelMessage = () => {
    const value = Number(level.value)
    const messageIndex = value < 34 ? 0 : value < 67 ? 1 : 2
    levelMessage.textContent = messages[messageIndex]
  }

  level.addEventListener('input', updateLevelMessage)
  updateLevelMessage()
}

const revealItems = document.querySelectorAll(
  '.hero-art, .waitlist-v2 .wl-parallax, .feature-row, .ai-row, .editorial-row, .faq-section > h2, .faq-list, .download-wrap, .waitlist-v2 .wl-feedback > h2, .waitlist-v2 .wl-lead, .waitlist-v2 .wl-feedback-card, .waitlist-v2 .wl-identity-card, .waitlist-v2 .wl-signup-cta, .help-form-intro, .help-contact-form'
)

revealItems.forEach((item) => item.classList.add('reveal-on-scroll'))

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -6% 0px'
  })

  revealItems.forEach((item) => revealObserver.observe(item))
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'))
}

const menuButton = document.querySelector('.menu-button')
const menuPanel = document.querySelector('.menu-panel')
if (menuButton && menuPanel) {
  const setMenuState = (open) => {
    menuPanel.classList.toggle('open', open)
    menuButton.setAttribute('aria-expanded', String(open))
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu')
    document.body.classList.toggle('menu-open', open)
  }

  menuButton.addEventListener('click', () => {
    setMenuState(!menuPanel.classList.contains('open'))
  })

  menuPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    setMenuState(false)
  }))

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false)
  })

}

document.querySelectorAll('.faq-item').forEach((item) => {
  const button = item.querySelector('.faq-question')
  if (!button) return

  button.addEventListener('click', () => {
    const willOpen = !item.classList.contains('is-open')

    document.querySelectorAll('.faq-item.is-open').forEach((other) => {
      if (other === item) return
      other.classList.remove('is-open')
      const otherButton = other.querySelector('.faq-question')
      if (otherButton) otherButton.setAttribute('aria-expanded', 'false')
    })

    item.classList.toggle('is-open', willOpen)
    button.setAttribute('aria-expanded', String(willOpen))
  })
})

const toTop = document.querySelector('.to-top')
if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

;(() => {
  const frame = document.querySelector('.waitlist-parallax')
  if (!frame) return

  let ticking = false

  const updateMobileParallax = () => {
    if (window.innerWidth > 700) {
      frame.style.removeProperty('--mobile-parallax-offset')
      ticking = false
      return
    }

    const rect = frame.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const centerDelta = (rect.top + rect.height / 2) - viewportHeight / 2
    const offset = Math.max(-70, Math.min(70, -centerDelta * 0.16))

    frame.style.setProperty('--mobile-parallax-offset', `${offset.toFixed(1)}px`)
    ticking = false
  }

  const requestUpdate = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(updateMobileParallax)
  }

  updateMobileParallax()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  window.addEventListener('orientationchange', requestUpdate)
})();

;(() => {
  const parallax = document.querySelector('.wl-parallax')
  if (!parallax || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  let ticking = false
  const update = () => {
    const rect = parallax.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    const center = rect.top + rect.height / 2
    const strength = window.innerWidth <= 700 ? 0.11 : 0.16
    const limit = window.innerWidth <= 700 ? 42 : 68
    const offset = Math.max(-limit, Math.min(limit, (vh / 2 - center) * strength))
    parallax.style.setProperty('--wl-parallax', `${offset.toFixed(1)}px`)
    ticking = false
  }
  const requestUpdate = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }
  update()
  window.addEventListener('scroll', requestUpdate, { passive:true })
  window.addEventListener('resize', requestUpdate)
  window.addEventListener('orientationchange', requestUpdate)
})();

;(() => {
  document.querySelectorAll('.waitlist-v2 .wl-card-block:not(.wl-likes)').forEach(block => {
    const input = block.querySelector('.wl-add-row input')
    const addButton = block.querySelector('.wl-add-row button')
    const tags = block.querySelector('.wl-added-tags')
    const counter = block.querySelector('small')
    if (!input || !addButton || !tags || !counter) return

    const updateCounter = () => {
      counter.textContent = `${document.querySelectorAll('.waitlist-v2 .wl-likes .wl-custom-chip').length} de 5 itens`
    }

    const addItem = () => {
      const value = input.value.trim()
      if (!value || document.querySelectorAll('.waitlist-v2 .wl-likes .wl-custom-chip').length >= 5) return
      const duplicate = [...document.querySelectorAll('.waitlist-v2 .wl-likes .wl-custom-chip')].some(tag => tag.dataset.value.toLowerCase() === value.toLowerCase())
      if (duplicate) return

      const tag = document.createElement('span')
      tag.className = 'wl-added-tag'
      tag.dataset.value = value
      tag.append(document.createTextNode(value))

      const remove = document.createElement('button')
      remove.type = 'button'
      remove.setAttribute('aria-label', `Remover ${value}`)
      remove.textContent = '×'
      remove.addEventListener('click', () => {
        tag.remove()
        updateCounter()
      })

      tag.appendChild(remove)

      const likesArena = document.querySelector('.waitlist-v2 .wl-likes .wl-chips')
      if (likesArena) {
        const custom = document.createElement('label')
        custom.className = 'wl-custom-chip'
        custom.dataset.value = value
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.name = 'gostou_personalizado'
        checkbox.value = value
        checkbox.checked = true
        const text = document.createElement('span')
        text.textContent = value
        const removeTop = document.createElement('button')
        removeTop.type = 'button'
        removeTop.className = 'wl-chip-remove'
        removeTop.setAttribute('aria-label', `Remover ${value}`)
        removeTop.textContent = '×'
        removeTop.addEventListener('pointerdown', e => e.stopPropagation())
        removeTop.addEventListener('click', e => {
          e.preventDefault(); e.stopPropagation(); custom.remove(); updateCounter();
          window.dispatchEvent(new CustomEvent('wl:chips-changed'))
        })
        custom.append(checkbox, text, removeTop)
        likesArena.appendChild(custom)
        window.dispatchEvent(new CustomEvent('wl:chips-changed'))
      } else {
        tags.appendChild(tag)
      }
      input.value = ''
      input.focus()
      updateCounter()
    }

    addButton.addEventListener('click', addItem)
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        addItem()
      }
    })
    updateCounter()
  })
})();

;(() => {
  const arena = document.querySelector('.waitlist-v2 .wl-likes .wl-chips')
  if (!arena) return
  let labels = [...arena.querySelectorAll('label')]
  if (!labels.length) return

  let bodies = []
  let active = null
  let lastTime = performance.now()
  let initialized = false
  const damping = .965
  const bounce = .62

  const sizeArena = () => ({ w: arena.clientWidth, h: arena.clientHeight })
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

  const placeBodies = () => {
    const { w, h } = sizeArena()
    bodies = labels.map((el, i) => {
      const width = el.offsetWidth
      const height = el.offsetHeight
      const cols = w < 300 ? 2 : (w < 430 ? 3 : 4)
      const col = i % cols
      const row = Math.floor(i / cols)
      const cellW = w / cols
      const rows = Math.ceil(labels.length / cols)
      const cellH = Math.max(42, h / rows)
      const jitterX = ((i * 37) % 17) - 8
      const jitterY = ((i * 23) % 13) - 6
      return {
        el, input:el.querySelector('input'),
        x:clamp(col * cellW + (cellW - width) / 2 + jitterX, 0, Math.max(0,w-width)),
        y:clamp(row * cellH + (cellH - height) / 2 + jitterY, 0, Math.max(0,h-height)),
        w:width,h:height,vx:((i%3)-1)*7,vy:-4-(i%4)*2
      }
    })
    initialized = true
  }

  const render = () => bodies.forEach(b => { b.el.style.transform = `translate3d(${b.x}px,${b.y}px,0)` })

  const resolveCollision = (a,b) => {
    const ax=a.x+a.w/2, ay=a.y+a.h/2, bx=b.x+b.w/2, by=b.y+b.h/2
    const overlapX=(a.w+b.w)/2-Math.abs(ax-bx)
    const overlapY=(a.h+b.h)/2-Math.abs(ay-by)
    if (overlapX<=0 || overlapY<=0) return
    if (overlapX < overlapY) {
      const dir=ax<bx?-1:1, push=overlapX/2+.15
      if (active?.body!==a) a.x+=dir*push
      if (active?.body!==b) b.x-=dir*push
      const av=a.vx,bv=b.vx
      if (active?.body!==a) a.vx=bv*bounce
      if (active?.body!==b) b.vx=av*bounce
    } else {
      const dir=ay<by?-1:1, push=overlapY/2+.15
      if (active?.body!==a) a.y+=dir*push
      if (active?.body!==b) b.y-=dir*push
      const av=a.vy,bv=b.vy
      if (active?.body!==a) a.vy=bv*bounce
      if (active?.body!==b) b.vy=av*bounce
    }
  }

  const tick = now => {
    if (!initialized) placeBodies()
    const dt=Math.min((now-lastTime)/1000,.025); lastTime=now
    const {w,h}=sizeArena()
    bodies.forEach(b => {
      if (active?.body===b) return
      b.vx *= damping; b.vy *= damping
      if (Math.abs(b.vx) < 1.2) b.vx = 0
      if (Math.abs(b.vy) < 1.2) b.vy = 0
      b.x += b.vx*dt; b.y += b.vy*dt
      if (b.x<0){b.x=0;b.vx=Math.abs(b.vx)*bounce}
      if (b.x+b.w>w){b.x=Math.max(0,w-b.w);b.vx=-Math.abs(b.vx)*bounce}
      if (b.y<0){b.y=0;b.vy=Math.abs(b.vy)*bounce}
      if (b.y+b.h>h){b.y=Math.max(0,h-b.h);b.vy=-Math.abs(b.vy)*bounce;b.vx*=.985}
    })
    for(let pass=0;pass<2;pass++) for(let i=0;i<bodies.length;i++) for(let j=i+1;j<bodies.length;j++) resolveCollision(bodies[i],bodies[j])
    bodies.forEach(b=>{b.x=clamp(b.x,0,Math.max(0,w-b.w));b.y=clamp(b.y,0,Math.max(0,h-b.h))})
    render(); requestAnimationFrame(tick)
  }

  const bindLabel = el => {
    el.addEventListener('click', e => e.preventDefault())
    el.addEventListener('pointerdown', e => {
      const body=bodies.find(b=>b.el===el); if(!body) return
      e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add('is-dragging')
      active={body,id:e.pointerId,startX:e.clientX,startY:e.clientY,offX:e.clientX-body.x,offY:e.clientY-body.y,lastX:e.clientX,lastY:e.clientY,lastT:performance.now(),moved:false}
      body.vx=body.vy=0
    })
    el.addEventListener('pointermove', e => {
      if(!active || active.id!==e.pointerId || active.body.el!==el) return
      const {w,h}=sizeArena(), now=performance.now(), d=Math.max(8,now-active.lastT)
      const nx=clamp(e.clientX-active.offX,0,Math.max(0,w-active.body.w)), ny=clamp(e.clientY-active.offY,0,Math.max(0,h-active.body.h))
      active.body.vx=(e.clientX-active.lastX)/d*1000; active.body.vy=(e.clientY-active.lastY)/d*1000
      active.body.x=nx; active.body.y=ny
      if(Math.hypot(e.clientX-active.startX,e.clientY-active.startY)>6) active.moved=true
      active.lastX=e.clientX;active.lastY=e.clientY;active.lastT=now
    })
    const release = e => {
      if(!active || active.id!==e.pointerId || active.body.el!==el) return
      if(!active.moved && active.body.input){active.body.input.checked=!active.body.input.checked;active.body.input.dispatchEvent(new Event('change',{bubbles:true}))}
      active.body.vx=clamp(active.body.vx,-900,900);active.body.vy=clamp(active.body.vy,-900,900)
      el.classList.remove('is-dragging');active=null
    }
    el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release)
  }

  labels.forEach(el => { el.dataset.physicsBound = '1'; bindLabel(el) })
  window.addEventListener('wl:chips-changed', () => {
    const previous = new Map(bodies.map(b => [b.el, b]))
    labels = [...arena.querySelectorAll('label')]
    labels.forEach(el => { if (!el.dataset.physicsBound) { el.dataset.physicsBound = '1'; bindLabel(el) } })
    const {w,h}=sizeArena()
    bodies = labels.map((el,i) => {
      const old = previous.get(el)
      if (old) return old
      const width=el.offsetWidth,height=el.offsetHeight
      return {el,input:el.querySelector('input'),x:clamp(w/2-width/2+(i%3-1)*28,0,Math.max(0,w-width)),y:clamp(h/2-height/2+(i%2?18:-18),0,Math.max(0,h-height)),w:width,h:height,vx:(i%2?55:-55),vy:(i%3-1)*28}
    })
  })

  window.addEventListener('resize',()=>{const old=bodies.map(b=>({x:b.x,y:b.y}));placeBodies(); if(old.length===bodies.length){const {w,h}=sizeArena();bodies.forEach((b,i)=>{b.x=clamp(old[i].x,0,Math.max(0,w-b.w));b.y=clamp(old[i].y,0,Math.max(0,h-b.h))})}})
  placeBodies();render();requestAnimationFrame(tick)

  // Entrada das tags: começam comprimidas e se espalham ao chegar na seção.
  let exploded = false
  const feedback = document.querySelector('.waitlist-v2 .wl-feedback')
  const compressTags = () => {
    if (exploded || !bodies.length) return
    const {w,h}=sizeArena()
    bodies.forEach((b,i)=>{
      b.x=clamp(w/2-b.w/2+((i%3)-1)*5,0,Math.max(0,w-b.w))
      b.y=clamp(h/2-b.h/2+((i%3)-1)*4,0,Math.max(0,h-b.h))
      b.vx=0;b.vy=0
    })
    render()
  }
  compressTags()
  if (feedback && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries=>{
      if (exploded || !entries.some(entry=>entry.isIntersecting)) return
      exploded=true
      const {w,h}=sizeArena()
      const cx=w/2,cy=h/2
      const mobile = w < 430
      bodies.forEach((b,i)=>{
        if (mobile) {
          const cols = w < 300 ? 2 : 3
          const rows = Math.ceil(bodies.length / cols)
          const col = i % cols
          const row = Math.floor(i / cols)
          const cellW = w / cols
          const cellH = h / rows
          const tx = clamp(col * cellW + (cellW - b.w) / 2, 0, Math.max(0, w - b.w))
          const ty = clamp(row * cellH + (cellH - b.h) / 2, 0, Math.max(0, h - b.h))
          b.x = tx
          b.y = ty
          const dx = (tx + b.w / 2) - cx
          const dy = (ty + b.h / 2) - cy
          const len = Math.hypot(dx, dy) || 1
          b.vx = dx / len * (65 + (i % 3) * 12)
          b.vy = dy / len * (45 + (i % 2) * 10)
        } else {
          const angle=(Math.PI*2*i)/Math.max(1,bodies.length)+(i%2?.16:-.16)
          const speed=190+(i%4)*28
          b.x=clamp(cx-b.w/2+Math.cos(angle)*8,0,Math.max(0,w-b.w))
          b.y=clamp(cy-b.h/2+Math.sin(angle)*8,0,Math.max(0,h-b.h))
          b.vx=Math.cos(angle)*speed
          b.vy=Math.sin(angle)*speed
        }
      })
      observer.disconnect()
    },{threshold:.28})
    observer.observe(feedback)
  } else {
    exploded=true
  }
})()

const introTextGroups = document.querySelectorAll('.hero-copy, .wl-hero-copy, .help-wrap')
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    introTextGroups.forEach((group) => group.classList.add('is-visible'))
  })
})

