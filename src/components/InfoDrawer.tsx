import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, TreePine, Calendar, Droplets, ShieldCheck, FileText, Phone, Mail, ExternalLink, Flame, ChevronDown } from 'lucide-react';

interface InfoDrawerProps {
  open: boolean;
  onClose: () => void;
}

type SectionKey = 'subsidios' | 'conaf' | 'preventas' | 'humedad' | null;

export function InfoDrawer({ open, onClose }: InfoDrawerProps) {
  const [expandedSection, setExpandedSection] = useState<SectionKey>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Reset expanded section when closing the drawer
  useEffect(() => {
    if (!open) {
      setExpandedSection(null);
    }
  }, [open]);

  const toggleSection = (section: SectionKey) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop Blur Overlay - Pure dim for high mobile performance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.45 }}
            onClick={onClose}
            className="fixed inset-0 z-[240] bg-black/50"
          />

          {/* Floating Card Sidebar - macOS/iOS Fluid Design with GPU Acceleration */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            style={{ willChange: 'transform' }}
            className="fixed top-0 left-0 bottom-0 z-[250] w-full max-w-sm p-4 flex flex-col outline-none"
          >
            <div className="h-full w-full bg-surface-container-lowest rounded-[32px] shadow-[0_24px_60px_rgba(0,0,0,0.25)] border border-outline-variant/20 flex flex-col overflow-hidden">
              
              {/* Header: Fully Integrated Clean Glass Layout */}
              <div className="relative shrink-0 px-6 pt-9 pb-7 border-b border-outline-variant/15 text-on-surface">
                <button
                  onClick={onClose}
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high/60 border border-outline-variant/10 hover:bg-surface-container-highest active:scale-90 transition-all cursor-pointer text-on-surface-variant"
                  aria-label="Cerrar"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 shadow-inner">
                    <Flame className="h-6 w-6 fill-current text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-black tracking-tight leading-none text-on-surface">Calor de Maule</h2>
                    <span className="text-[10px] text-on-surface-variant/60 tracking-wider font-semibold uppercase mt-1 block">Energía Limpia</span>
                  </div>
                </div>
                
                <p className="text-xs text-on-surface-variant leading-relaxed font-medium mt-1 pr-4">
                  Guía para un invierno seguro y eficiente en la Región del Maule. Fomentando la calefacción responsable.
                </p>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[9px] bg-primary/10 border border-primary/15 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-primary">
                    Socio Sustentable
                  </span>
                  <span className="text-[9px] text-on-surface-variant/40 font-mono">v1.0.0</span>
                </div>
              </div>

              {/* Scrollable Content - Bento-Style Expandable Accordions */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
                
                {/* 1. B2G Accordion (Blue/Slate Tinted Icon) */}
                <div className="bg-white/40 dark:bg-white/[0.01] border border-white/50 dark:border-neutral-800/30 rounded-2xl overflow-hidden transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <button
                    onClick={() => toggleSection('subsidios')}
                    className="w-full flex items-center justify-between p-4 text-left outline-none cursor-pointer group active:scale-[0.98] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 transition-colors group-hover:bg-blue-500/20">
                        <Building2 className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-xs font-bold text-on-surface">Apoyo y Subsidios Estatales</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${expandedSection === 'subsidios' ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ height: expandedSection === 'subsidios' ? 'auto' : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-outline-variant/10 space-y-3">
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        Acceda a los programas del Ministerio del Medio Ambiente para el recambio de tecnología y manténgase informado sobre la calidad del aire:
                      </p>
                      <div className="space-y-1.5">
                        <a
                          href="https://calefactores.mma.gob.cl/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-white/30 dark:border-neutral-800/20 hover:border-primary/40 transition-colors group active:scale-[0.97] duration-150"
                        >
                          <span className="text-[10px] font-bold text-on-surface truncate">Recambio de Calefactores</span>
                          <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 ml-1" />
                        </a>
                        
                        <a
                          href="https://mma.gob.cl/maule/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-white/30 dark:border-neutral-800/20 hover:border-primary/40 transition-colors group active:scale-[0.97] duration-150"
                        >
                          <span className="text-[10px] font-bold text-on-surface truncate">Portal SEREMI Medio Ambiente</span>
                          <ExternalLink className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 ml-1" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 2. CONAF Accordion (Emerald Green Tinted Icon) */}
                <div className="bg-white/40 dark:bg-white/[0.01] border border-white/50 dark:border-neutral-800/30 rounded-2xl overflow-hidden transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <button
                    onClick={() => toggleSection('conaf')}
                    className="w-full flex items-center justify-between p-4 text-left outline-none cursor-pointer group active:scale-[0.98] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 transition-colors group-hover:bg-emerald-500/20">
                        <TreePine className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-xs font-bold text-on-surface">Bosques Sostenibles y CONAF</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${expandedSection === 'conaf' ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ height: expandedSection === 'conaf' ? 'auto' : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-outline-variant/10 space-y-3">
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        Cuidamos los recursos del Maule. Toda la leña ofrecida en la plataforma cumple con altos estándares de conservación y trazabilidad ecológica:
                      </p>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5 text-xs text-on-surface bg-white/40 dark:bg-white/[0.02] p-2.5 rounded-xl border border-white/20 dark:border-neutral-850/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-[11px]">Manejo Forestal Autorizado</span>
                            <span className="text-[10px] text-on-surface-variant leading-relaxed block mt-0.5">
                              Procedencia regulada por la Corporación Nacional Forestal (CONAF) para la regeneración de ecosistemas.
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-on-surface bg-white/40 dark:bg-white/[0.02] p-2.5 rounded-xl border border-white/20 dark:border-neutral-850/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-[11px]">Comercio Justo Local</span>
                            <span className="text-[10px] text-on-surface-variant leading-relaxed block mt-0.5">
                              Trabajamos directamente con recolectores maulinos autorizados, combatiendo el comercio informal y la tala ilegal.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 3. Estacionalidad Accordion (Amber Warm Tinted Icon) */}
                <div className="bg-white/40 dark:bg-white/[0.01] border border-white/50 dark:border-neutral-800/30 rounded-2xl overflow-hidden transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <button
                    onClick={() => toggleSection('preventas')}
                    className="w-full flex items-center justify-between p-4 text-left outline-none cursor-pointer group active:scale-[0.98] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 transition-colors group-hover:bg-amber-500/20">
                        <Calendar className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-xs font-bold text-on-surface">Campaña Pre-Venta de Verano</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${expandedSection === 'preventas' ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ height: expandedSection === 'preventas' ? 'auto' : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-outline-variant/10 space-y-2">
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        Planifique antes de las bajas temperaturas y obtenga los mejores precios de la temporada:
                      </p>
                      <div className="p-3 rounded-xl bg-surface-container-low border border-white/20 dark:border-neutral-800/20 text-[10px] text-on-surface leading-relaxed shadow-sm">
                        <span className="font-bold text-primary block mb-0.5">Meses de Diciembre a Marzo</span>
                        Reservando su leña durante el verano, accede a tarifas de secado reducidas y asegura stock certificado, con despacho programado directo a su domicilio a partir de mayo.
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 4. Humedad Accordion (Water Blue/Sky Tinted Icon) */}
                <div className="bg-white/40 dark:bg-white/[0.01] border border-white/50 dark:border-neutral-800/30 rounded-2xl overflow-hidden transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <button
                    onClick={() => toggleSection('humedad')}
                    className="w-full flex items-center justify-between p-4 text-left outline-none cursor-pointer group active:scale-[0.98] transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 transition-colors group-hover:bg-sky-500/20">
                        <Droplets className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-xs font-bold text-on-surface">Garantía de Humedad (25%)</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform duration-300 ${expandedSection === 'humedad' ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ height: expandedSection === 'humedad' ? 'auto' : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-outline-variant/10 space-y-2.5">
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        Garantizamos leña de alta eficiencia energética y libre de multas:
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5 text-xs text-on-surface bg-white/40 dark:bg-white/[0.02] p-2.5 rounded-xl border border-white/20 dark:border-neutral-850/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                          <div className="w-6 h-6 rounded bg-sky-500/10 flex items-center justify-center text-sky-600 font-bold text-[10px] shrink-0 mt-0.5">
                            H₂O
                          </div>
                          <div>
                            <span className="font-bold block text-[11px]">Medición en la Entrega</span>
                            <span className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5 block">
                              Exija al despachador la medición de humedad con el xilómetro digital en su presencia antes de descargar el camión.
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 text-xs text-on-surface bg-white/40 dark:bg-white/[0.02] p-2.5 rounded-xl border border-white/20 dark:border-neutral-850/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                          <div className="w-6 h-6 rounded bg-sky-500/10 flex items-center justify-center text-sky-600 font-bold text-[10px] shrink-0 mt-0.5">
                            $0
                          </div>
                          <div>
                            <span className="font-bold block text-[11px]">Derecho a Devolución</span>
                            <span className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5 block">
                              Si el nivel supera el 25%, tiene total derecho a rechazar el despacho de forma inmediata sin costo alguno ni recargos.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* 5. Soporte y Legal */}
                <div className="pt-3 border-t border-outline-variant/10 space-y-2.5">
                  <div className="flex gap-2">
                    <a
                      href="tel:+56912345678"
                      className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-white/50 dark:border-neutral-800/30 hover:border-primary/40 transition-all active:scale-[0.97] duration-150 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    >
                      <Phone className="w-4 h-4 text-on-surface-variant mb-1" />
                      <span className="text-[10px] font-bold text-on-surface">Llamar Soporte</span>
                    </a>
                    
                    <a
                      href="mailto:soporte@calordemaule.cl"
                      className="flex-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-white/50 dark:border-neutral-800/30 hover:border-primary/40 transition-all active:scale-[0.97] duration-150 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    >
                      <Mail className="w-4 h-4 text-on-surface-variant mb-1" />
                      <span className="text-[10px] font-bold text-on-surface">Escribir Correo</span>
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      window.open('https://vercel.com/maule/macki', '_blank');
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-white/50 dark:border-neutral-800/30 hover:border-primary/40 text-xs font-semibold text-on-surface-variant hover:text-primary transition-all active:scale-[0.985] duration-200 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  >
                    <FileText className="w-4.5 h-4.5 shrink-0 text-on-surface-variant/70" />
                    <span>Términos y Condiciones</span>
                  </button>
                </div>

              </div>

              {/* Drawer Footer - Organic opacity layout */}
              <div className="shrink-0 p-4 border-t border-outline-variant/10 bg-white/10 dark:bg-black/10 flex flex-col items-center gap-1.5 text-center">
                <span className="text-[9px] text-on-surface-variant/40 font-bold tracking-wider uppercase font-mono">
                  v1.0.0 © Calor de Maule
                </span>
                <div className="flex gap-4 text-[9px] font-bold tracking-wider text-on-surface-variant/50">
                  <a href="#" className="hover:text-primary transition-colors opacity-60 hover:opacity-100 uppercase">Privacidad</a>
                  <a href="#" className="hover:text-primary transition-colors opacity-60 hover:opacity-100 uppercase">Sustentabilidad</a>
                  <a href="#" className="hover:text-primary transition-colors opacity-60 hover:opacity-100 uppercase">Ayuda</a>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
