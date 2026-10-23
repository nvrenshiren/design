/** Measured Transitions motion recipes, emitted by the Tailwind motion plugin.
 * Layout, states and theme styling are utilities authored in each component. */
export const transitionKeyframes = {
  "sc-tr-effects-drop-reveal": {
    "from": {
      "opacity": ".5",
      "clip-path": "inset(12% round var(--radius))"
    },
    "to": {
      "opacity": "1",
      "clip-path": "inset(0 round var(--radius))"
    }
  },
  "sc-tr-effects-heart-pop": {
    "0%": {
      "transform": "scale(1)"
    },
    "30%": {
      "transform": "scale(.82)"
    },
    "100%": {
      "transform": "scale(1)"
    }
  },
  "sc-tr-effects-heart-particle": {
    "0%": {
      "transform": "translate(0, 0) scale(.4)",
      "opacity": "0"
    },
    "20%": {
      "transform": "translate(calc(var(--particle-x) * .25), calc(var(--particle-y) * .25)) scale(1)",
      "opacity": "1"
    },
    "100%": {
      "transform": "translate(var(--particle-x), var(--particle-y)) scale(.4)",
      "opacity": "0"
    }
  },
  "sc-tr-effects-check-appear": {
    "from": {
      "opacity": ".35"
    },
    "to": {
      "opacity": "1"
    }
  },
  "sc-tr-effects-check-draw": {
    "from": {
      "stroke-dashoffset": "24"
    },
    "to": {
      "stroke-dashoffset": "0"
    }
  },
  "sc-tr-effects-switch-on": {
    "0%": {
      "translate": "0 0"
    },
    "55%": {
      "translate": "calc(100% - 1px) 0"
    },
    "80%,100%": {
      "translate": "calc(100% - 2px) 0"
    }
  },
  "sc-tr-effects-switch-off": {
    "0%": {
      "translate": "calc(100% - 2px) 0"
    },
    "55%": {
      "translate": "-1px 0"
    },
    "80%,100%": {
      "translate": "0 0"
    }
  },
  "sc-tr-effects-dissolve-text": {
    "from": {
      "opacity": "1",
      "filter": "blur(0)",
      "transform": "translateY(0)"
    },
    "to": {
      "opacity": "0",
      "filter": "blur(2px)",
      "transform": "translateY(12px)"
    }
  },
  "sc-tr-effects-dissolve-placeholder": {
    "from": {
      "opacity": ".9",
      "filter": "blur(2px)",
      "transform": "translateY(-12px)"
    },
    "to": {
      "opacity": "1",
      "filter": "blur(0)",
      "transform": "translateY(0)"
    }
  },
  "sc-tr-effects-dissolve-glow": {
    "0%,100%": {
      "opacity": "0"
    },
    "25%": {
      "opacity": ".4"
    }
  },
  "sc-tr-effects-error-reveal": {
    "from": {
      "opacity": "0"
    },
    "to": {
      "opacity": "1"
    }
  },
  "sc-tr-effects-error-shake": {
    "0%,100%": {
      "transform": "translateX(0)"
    },
    "28.57%": {
      "transform": "translateX(6px)"
    },
    "57.14%": {
      "transform": "translateX(-6px)"
    },
    "78.57%": {
      "transform": "translateX(4px)"
    }
  },
  "sc-tr-effects-error-shake-repeat": {
    "0%,100%": {
      "transform": "translateX(0)"
    },
    "28.57%": {
      "transform": "translateX(6px)"
    },
    "57.14%": {
      "transform": "translateX(-6px)"
    },
    "78.57%": {
      "transform": "translateX(4px)"
    }
  },
  "sc-tr-effects-pro-flow": {
    "0%,100%": {
      "background-position": "0% 0%,100% 50%,50% 100%"
    },
    "25%": {
      "background-position": "50% 0%,50% 100%,0% 50%"
    },
    "50%": {
      "background-position": "100% 50%,0% 0%,50% 0%"
    },
    "75%": {
      "background-position": "50% 100%,50% 0%,100% 50%"
    }
  },
  "sc-tr-effects-pro-orbit": {
    "from": {
      "transform": "rotate(0deg)"
    },
    "to": {
      "transform": "rotate(360deg)"
    }
  },
  "sc-tr-feedback-digit-in": {
    "from": {
      "opacity": "0",
      "transform": "translateY(8px)",
      "filter": "blur(2px)"
    },
    "to": {
      "opacity": "1",
      "transform": "translateY(0)",
      "filter": "blur(0)"
    }
  },
  "sc-tr-feedback-digit-out": {
    "from": {
      "opacity": "1",
      "transform": "translateY(0)",
      "filter": "blur(0)"
    },
    "to": {
      "opacity": "0",
      "transform": "translateY(-8px)",
      "filter": "blur(2px)"
    }
  },
  "sc-tr-feedback-badge-slide": {
    "from": {
      "transform": "translate(-8px, 12px)"
    },
    "to": {
      "transform": "translate(0)"
    }
  },
  "sc-tr-feedback-badge-scale": {
    "from": {
      "transform": "scale(0)",
      "filter": "blur(2px)"
    },
    "to": {
      "transform": "scale(1)",
      "filter": "blur(0)"
    }
  },
  "sc-tr-feedback-badge-opacity": {
    "from": {
      "opacity": "0"
    },
    "to": {
      "opacity": "1"
    }
  },
  "sc-tr-feedback-status-in": {
    "from": {
      "opacity": "0",
      "transform": "translateY(var(--feedback-swap-distance))",
      "filter": "blur(2px)"
    },
    "to": {
      "opacity": "1",
      "transform": "translateY(0)",
      "filter": "blur(0)"
    }
  },
  "sc-tr-feedback-status-out": {
    "from": {
      "opacity": "1",
      "transform": "translateY(0)",
      "filter": "blur(0)"
    },
    "to": {
      "opacity": "0",
      "transform": "translateY(calc(-1 * var(--feedback-swap-distance)))",
      "filter": "blur(2px)"
    }
  },
  "sc-tr-feedback-check-enter": {
    "from": {
      "transform": "rotate(80deg)",
      "opacity": "0",
      "filter": "blur(10px)"
    },
    "to": {
      "transform": "rotate(0)",
      "opacity": "1",
      "filter": "blur(0)"
    }
  },
  "sc-tr-feedback-check-bob": {
    "from": {
      "translate": "0 40px"
    },
    "to": {
      "translate": "0 0"
    }
  },
  "sc-tr-feedback-check-draw": {
    "from": {
      "stroke-dashoffset": "1"
    },
    "to": {
      "stroke-dashoffset": "0"
    }
  },
  "sc-tr-feedback-organic-sweep": {
    "from": {
      "transform": "translate(-36%, -36%)"
    },
    "to": {
      "transform": "translate(36%, 36%)"
    }
  },
  "sc-tr-feedback-skeleton-pulse": {
    "0%, 100%": {
      "opacity": "1"
    },
    "50%": {
      "opacity": ".5"
    }
  },
  "sc-tr-feedback-rise": {
    "from": {
      "opacity": "0",
      "transform": "translateY(12px)",
      "filter": "blur(3px)"
    },
    "to": {
      "opacity": "1",
      "transform": "translateY(0)",
      "filter": "blur(0)"
    }
  },
  "sc-tr-feedback-text-sweep": {
    "from": {
      "background-position": "100% 0"
    },
    "to": {
      "background-position": "0% 0"
    }
  },
  "sc-tr-feedback-morph-spin": {
    "to": {
      "transform": "rotate(360deg)"
    }
  },
  "sc-tr-feedback-morph-bob": {
    "0%": {
      "transform": "translateY(0) scale(1)"
    },
    "45%": {
      "transform": "translateY(-3px) scale(1.09)"
    },
    "to": {
      "transform": "translateY(0) scale(1)"
    }
  },
  "sc-tr-feedback-reel-spin": {
    "from": {
      "transform": "translateY(0)"
    },
    "to": {
      "transform": "translateY(calc(var(--feedback-digit) * -1.2em))"
    }
  },
  "sc-tr-feedback-gradient-drift": {
    "0%,100%": {
      "background-position": "0% 0%, 100% 100%, 0% 50%"
    },
    "25%": {
      "background-position": "100% 0%, 0% 100%, 50% 0%"
    },
    "50%": {
      "background-position": "100% 100%, 0% 0%, 100% 50%"
    },
    "75%": {
      "background-position": "0% 100%, 100% 0%, 50% 100%"
    }
  },
  "sc-tr-feedback-gradient-tone": {
    "0%,100%": {
      "filter": "saturate(1)"
    },
    "50%": {
      "filter": "saturate(1.25)"
    }
  },
  "sc-tr-feedback-word-in": {
    "from": {
      "opacity": "0",
      "filter": "blur(1px)"
    },
    "to": {
      "opacity": "1",
      "filter": "blur(0)"
    }
  },
  "sc-tr-feedback-dot-scan": {
    "0%,45%,100%": {
      "background": "var(--border)"
    },
    "15%": {
      "background": "var(--primary)"
    }
  },
  "sc-tr-feedback-dot-twinkle": {
    "0%,45%,100%": {
      "background": "var(--border)"
    },
    "15%": {
      "background": "var(--primary)"
    }
  },
  "sc-tr-feedback-dot-orbit": {
    "0%,45%,100%": {
      "background": "var(--border)"
    },
    "15%": {
      "background": "var(--primary)"
    }
  },
  "sc-tr-feedback-dot-pulse": {
    "0%,45%,100%": {
      "background": "var(--border)"
    },
    "15%": {
      "background": "var(--primary)"
    }
  },
  "sc-tr-feedback-image-dot": {
    "0%,100%": {
      "opacity": "0",
      "transform": "scale(0)"
    },
    "50%": {
      "opacity": "1",
      "transform": "scale(1)"
    }
  },
  "sc-tr-layout-menu-in": {
    "from": {
      "opacity": "0",
      "transform": "scale(.97)"
    },
    "to": {
      "opacity": "1",
      "transform": "scale(1)"
    }
  },
  "sc-tr-layout-menu-out": {
    "from": {
      "opacity": "1",
      "transform": "scale(1)"
    },
    "to": {
      "opacity": "0",
      "transform": "scale(.99)"
    }
  },
  "sc-tr-layout-modal-in": {
    "from": {
      "opacity": "0",
      "transform": "scale(.96)"
    },
    "to": {
      "opacity": "1",
      "transform": "scale(1)"
    }
  },
  "sc-tr-layout-modal-out": {
    "from": {
      "opacity": "1",
      "transform": "scale(1)"
    },
    "to": {
      "opacity": "0",
      "transform": "scale(.96)"
    }
  },
  "sc-tr-layout-tooltip-in": {
    "from": {
      "opacity": "0",
      "transform": "scale(.98)"
    },
    "to": {
      "opacity": "1",
      "transform": "scale(1)"
    }
  },
  "sc-tr-layout-tooltip-out": {
    "from": {
      "opacity": "1"
    },
    "to": {
      "opacity": "0"
    }
  },
  "sc-tr-layout-tooltip-travel": {
    "from": {
      "width": "var(--sc-tr-tip-from-width)",
      "transform": "translateX(calc(var(--sc-tr-tip-from-x) + (var(--sc-tr-tip-to-width) - var(--sc-tr-tip-from-width))/2))"
    },
    "to": {
      "width": "var(--sc-tr-tip-to-width)",
      "transform": "translateX(0)"
    }
  },
  "sc-tr-layout-morph-settle": {
    "0%,100%": {
      "translate": "0 0",
      "animation-timing-function": "cubic-bezier(.22,1,.36,1)"
    },
    "35%": {
      "translate": "5px 5px",
      "animation-timing-function": "cubic-bezier(.22,1,.36,1)"
    }
  },
  "sc-tr-layout-morph-in": {
    "from": {
      "width": "36px",
      "height": "36px",
      "border-radius": "50%"
    },
    "to": {
      "width": "208px",
      "height": "168px",
      "border-radius": "calc(var(--radius) - 2px)"
    }
  },
  "sc-tr-layout-morph-out": {
    "from": {
      "width": "208px",
      "height": "168px",
      "border-radius": "calc(var(--radius) - 2px)"
    },
    "to": {
      "width": "36px",
      "height": "36px",
      "border-radius": "50%"
    }
  },
  "sc-tr-layout-morph-item-in": {
    "from": {
      "transform": "translateX(40px) scale(.97)"
    },
    "to": {
      "transform": "translateX(0) scale(1)"
    }
  },
  "sc-tr-layout-morph-body-in": {
    "from": {
      "opacity": "0",
      "filter": "blur(2px)"
    },
    "to": {
      "opacity": "1",
      "filter": "blur(0)"
    }
  },
  "sc-tr-layout-morph-body-out": {
    "from": {
      "opacity": "1",
      "filter": "blur(0)"
    },
    "to": {
      "opacity": "0",
      "filter": "blur(2px)"
    }
  },
  "sc-tr-layout-banner-in": {
    "from": {
      "opacity": "0",
      "translate": "0 60px",
      "scale": ".97",
      "filter": "blur(2px)"
    },
    "to": {
      "opacity": "var(--sc-tr-banner-opacity,1)",
      "translate": "0 0",
      "scale": "1",
      "filter": "blur(calc(var(--sc-tr-banner-depth)*1px))"
    }
  },
  "sc-tr-layout-banner-out": {
    "from": {
      "opacity": "var(--sc-tr-banner-opacity,1)",
      "translate": "0 0",
      "scale": "1"
    },
    "to": {
      "opacity": "0",
      "translate": "0 -12px",
      "scale": "var(--sc-tr-banner-leave-scale,.94)"
    }
  },
  "sc-tr-layout-gooey-settle": {
    "0%,100%": {
      "translate": "0 0",
      "animation-timing-function": "cubic-bezier(.22,1,.36,1)"
    },
    "30%": {
      "translate": "0 5px",
      "animation-timing-function": "cubic-bezier(.22,1,.36,1)"
    }
  },
  "sc-pro-image-depth-open": {
    "0%": {
      "transform": "var(--sc-depth-from, translateZ(-70px))",
      "animation-timing-function": "cubic-bezier(.16, 1, .3, 1)"
    },
    "45%": {
      "transform": "translateZ(-28px)",
      "animation-timing-function": "cubic-bezier(.22, 1, .36, 1)"
    },
    "100%": {
      "transform": "translateZ(0)"
    }
  },
  "sc-pro-image-depth-close": {
    "0%": {
      "transform": "var(--sc-depth-from, translateZ(0))",
      "animation-timing-function": "cubic-bezier(.22, 1, .36, 1)"
    },
    "36%": {
      "transform": "translateZ(-28px)",
      "animation-timing-function": "cubic-bezier(.22, 1, .36, 1)"
    },
    "100%": {
      "transform": "translateZ(0)"
    }
  },
  "sc-pro-image-bend-open": {
    "0%": {
      "transform": "var(--sc-slice-from, translateY(0) skewY(0deg))",
      "animation-timing-function": "cubic-bezier(.22, 1, .36, 1)"
    },
    "16%": {
      "transform": "translateY(calc(var(--sc-image-bend) * var(--sc-slice-curve))) skewY(var(--sc-slice-angle))",
      "animation-timing-function": "cubic-bezier(.22, 1, .36, 1)"
    },
    "100%": {
      "transform": "translateY(0) skewY(0deg)"
    }
  },
  "sc-pro-image-bend-close": {
    "0%": {
      "transform": "var(--sc-slice-from, translateY(0) skewY(0deg))",
      "animation-timing-function": "cubic-bezier(.22, 1, .36, 1)"
    },
    "36%": {
      "transform": "translateY(calc(var(--sc-image-bend) * var(--sc-slice-curve) * .85)) skewY(var(--sc-slice-angle))",
      "animation-timing-function": "cubic-bezier(.22, 1, .36, 1)"
    },
    "100%": {
      "transform": "translateY(0) skewY(0deg)"
    }
  },
  "sc-tr-pro-smoke-material": {
    "0%": {
      "opacity": "1",
      "transform": "translateY(0) rotate(0)",
      "filter": "blur(0)"
    },
    "12%": {
      "opacity": ".952",
      "transform": "translateY(0) rotate(.45deg)",
      "filter": "blur(.6px)"
    },
    "20%": {
      "opacity": ".865",
      "transform": "translateY(.4px) rotate(.86deg)",
      "filter": "blur(1.4px)"
    },
    "36%": {
      "opacity": ".679",
      "transform": "translateY(2.9px) rotate(1.48deg)",
      "filter": "blur(3.7px)"
    },
    "58%": {
      "opacity": ".389",
      "transform": "translateY(11.2px) rotate(2.2deg)",
      "filter": "blur(6.8px)"
    },
    "95%": {
      "opacity": ".021",
      "transform": "translateY(29.7px) rotate(2.96deg)",
      "filter": "blur(10px)"
    },
    "100%": {
      "opacity": "0",
      "transform": "translateY(32.8px) rotate(3deg)",
      "filter": "blur(10px)"
    }
  },
  "sc-tr-pro-smoke-source": {
    "0%, 28%": {
      "opacity": "1"
    },
    "42%, 100%": {
      "opacity": "0"
    }
  },
  "sc-tr-pro-smoke-displace": {
    "0%": {
      "opacity": "0"
    },
    "28%, 100%": {
      "opacity": "1"
    }
  }
};

export default transitionKeyframes;
