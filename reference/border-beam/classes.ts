/** The three painted layers remain pseudo-elements + one decorative bloom.
 * Static geometry/state use actual Tailwind utilities; measured gradients are tokens.
 */
export const beamClasses = {
  root: [
    'bb:relative bb:rounded-(--bb-radius) bb:overflow-hidden bb:data-[beam-size=pulse-outside]:overflow-visible bb:data-[beam-size=pulse-outside]:isolate bb:data-[beam-size=pulse-inner]:isolate',
    'bb:data-[active]:[animation:var(--bb-active-animation)] bb:data-[fading]:[animation:var(--bb-fade-animation)]',
    'bb:data-[paused]:[animation-play-state:paused]! bb:motion-reduce:animate-none!',
    "bb:before:content-[''] bb:before:hidden bb:data-[active]:before:block bb:data-[fading]:before:block",
    'bb:before:absolute bb:before:inset-0 bb:before:rounded-(--bb-core-radius) bb:before:pointer-events-none bb:before:z-1 bb:data-[beam-size=pulse-outside]:before:-inset-[10px] bb:data-[beam-size=pulse-outside]:before:-z-1',
    'bb:before:[background:var(--bb-core-background)] bb:before:[box-shadow:var(--bb-core-shadow)] bb:before:[clip-path:var(--bb-core-clip)]',
    'bb:before:[mask-image:var(--bb-core-mask)] bb:before:[mask-composite:var(--bb-core-composite)]',
    'bb:before:[-webkit-mask-image:var(--bb-core-mask)] bb:before:[-webkit-mask-composite:var(--bb-core-webkit-composite)]',
    'bb:before:[opacity:var(--bb-core-opacity)] bb:before:[filter:var(--bb-core-filter)] bb:data-[beam-size=pulse-outside]:before:[transform:scale(.95,.9)]',
    'bb:before:[animation:var(--bb-core-animation)] bb:data-[beam-size=pulse-outside]:before:will-change-[opacity,filter] bb:data-[beam-size=pulse-inner]:before:will-change-[opacity,filter]',
    'bb:data-[paused]:before:[animation-play-state:paused]! bb:motion-reduce:before:animate-none!',
    "bb:after:content-[''] bb:after:hidden bb:data-[active]:after:block bb:data-[fading]:after:block",
    'bb:after:absolute bb:after:inset-0 bb:after:rounded-(--bb-stroke-radius) bb:after:p-(--bb-border-width) bb:after:pointer-events-none bb:after:z-2',
    'bb:after:[clip-path:var(--bb-clip)] bb:after:[background:var(--bb-stroke-background)]',
    'bb:after:[mask:var(--bb-stroke-mask)] bb:after:[mask-composite:var(--bb-stroke-composite)]',
    'bb:after:[-webkit-mask:var(--bb-stroke-mask)] bb:after:[-webkit-mask-composite:var(--bb-stroke-webkit-composite)]',
    'bb:after:[opacity:var(--bb-stroke-opacity)] bb:after:[filter:var(--bb-stroke-filter)] bb:after:[animation:var(--bb-stroke-animation)]',
    'bb:data-[beam-size=pulse-outside]:after:will-change-[opacity,filter] bb:data-[beam-size=pulse-inner]:after:will-change-[opacity,filter] bb:data-[paused]:after:[animation-play-state:paused]! bb:motion-reduce:after:animate-none!',
  ].join(' '),
  bloom: [
    'bb:hidden bb:in-[[data-active]]:block bb:in-[[data-fading]]:block bb:absolute bb:inset-0 bb:in-[[data-beam-size=pulse-outside]]:-inset-[30px]',
    'bb:rounded-(--bb-bloom-radius) bb:p-(--bb-border-width) bb:in-[[data-beam-size=line]]:p-0 bb:in-[[data-beam-size=pulse-outside]]:p-0 bb:pointer-events-none bb:z-3 bb:in-[[data-beam-size=pulse-outside]]:-z-1',
    'bb:[clip-path:var(--bb-bloom-clip)] bb:[background:var(--bb-bloom-background)] bb:[mask:var(--bb-bloom-mask)] bb:[mask-composite:var(--bb-bloom-composite)]',
    'bb:[-webkit-mask:var(--bb-bloom-mask)] bb:[-webkit-mask-composite:var(--bb-bloom-webkit-composite)]',
    'bb:[opacity:var(--bb-bloom-opacity)] bb:[filter:var(--bb-bloom-filter)] bb:in-[[data-beam-size=pulse-outside]]:[transform:scale(.95,.9)] bb:[animation:var(--bb-bloom-animation)]',
    'bb:in-[[data-beam-size=pulse-outside]]:will-change-transform bb:in-[[data-beam-size=pulse-inner]]:will-change-[opacity] bb:in-[[data-paused]]:[animation-play-state:paused]! bb:motion-reduce:animate-none!',
  ].join(' '),
};
