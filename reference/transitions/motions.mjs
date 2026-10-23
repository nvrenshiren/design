// CSS3 keyframes are data consumed by the Tailwind build plugin.
export const referenceMotions = {
  "t-input-shake": {
    "0%": {
      "transform": "translateX(0)",
      "animation-timing-function": "var(--shake-ease)"
    },
    "28.57%": {
      "transform": "translateX(var(--shake-distance))",
      "animation-timing-function": "var(--shake-ease)"
    },
    "57.14%": {
      "transform": "translateX(calc(var(--shake-distance) * -1))",
      "animation-timing-function": "var(--shake-ease)"
    },
    "78.57%": {
      "transform": "translateX(var(--shake-overshoot))",
      "animation-timing-function": "var(--shake-ease)"
    },
    "100%": {
      "transform": "translateX(0)"
    }
  },
  "t-like-pop": {
    "0%": {
      "transform": "scale(1)"
    },
    "30%": {
      "transform": "scale(0.82)"
    },
    "100%": {
      "transform": "scale(1)"
    }
  },
  "t-like-burst": {
    "0%": {
      "opacity": "0",
      "transform": "translate(0, 0) scale(0.4)"
    },
    "20%": {
      "opacity": "1",
      "transform": "translate(calc(var(--px) * 0.25), calc(var(--py) * 0.25)) scale(1)"
    },
    "100%": {
      "opacity": "0",
      "transform": "translate(var(--px), var(--py)) scale(var(--p-end-scale, 0.6))"
    }
  },
  "t-badge-slide-in": {
    "from": {
      "transform": "translate(var(--badge-offset-x), var(--badge-offset-y))"
    },
    "to": {
      "transform": "translate(0, 0)"
    }
  },
  "t-digit-pop-in": {
    "0%": {
      "transform": "translate( calc(var(--digit-distance) * var(--digit-dir-x)), calc(var(--digit-distance) * var(--digit-dir-y)) )",
      "opacity": "0",
      "filter": "blur(var(--digit-blur))"
    },
    "100%": {
      "transform": "translate(0, 0)",
      "opacity": "1",
      "filter": "blur(0)"
    }
  },
  "t-shimmer": {
    "0%": {
      "background-position": "100% 0"
    },
    "100%": {
      "background-position": "0% 0"
    }
  },
  "t-skel-pulse": {
    "0%, 100%": {
      "opacity": "1"
    },
    "50%": {
      "opacity": "var(--pulse-min)"
    }
  },
  "t-check-fade": {
    "from": {
      "opacity": "0"
    },
    "to": {
      "opacity": "1"
    }
  },
  "t-check-rotate": {
    "from": {
      "transform": "rotate(var(--check-rotate-from))"
    },
    "to": {
      "transform": "rotate(0deg)"
    }
  },
  "t-check-blur": {
    "from": {
      "filter": "blur(var(--check-blur-from))"
    },
    "to": {
      "filter": "blur(0)"
    }
  },
  "t-check-bob": {
    "from": {
      "translate": "0 var(--check-y-amount)"
    },
    "to": {
      "translate": "0 0"
    }
  },
  "t-check-draw": {
    "to": {
      "stroke-dashoffset": "0"
    }
  },
  "t-toggle-on": {
    "0%": {
      "translate": "0 0"
    },
    "55%": {
      "translate": "calc(var(--toggle-travel) + var(--toggle-ov1)) 0"
    },
    "80%": {
      "translate": "calc(var(--toggle-travel) - var(--toggle-ov2)) 0"
    },
    "100%": {
      "translate": "var(--toggle-travel) 0"
    }
  },
  "t-toggle-off": {
    "0%": {
      "translate": "var(--toggle-travel) 0"
    },
    "55%": {
      "translate": "calc(0px - var(--toggle-ov1)) 0"
    },
    "80%": {
      "translate": "var(--toggle-ov2) 0"
    },
    "100%": {
      "translate": "0 0"
    }
  }
};
