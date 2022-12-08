const PARALLAX_FACTOR = 1.2;

const calculateParallaxTransforms = (embla) => {
  const engine = embla.internalEngine();
  const scrollProgress = embla.scrollProgress();

  return embla.scrollSnapList().map((scrollSnap, index) => {
    if (!embla.slidesInView().includes(index)) return 0;
    let diffToTarget = scrollSnap - scrollProgress;

    if (engine.options.loop) {
      engine.slideLooper.loopPoints.forEach((loopItem) => {
        const target = loopItem.getTarget();
        if (index === loopItem.index && target !== 0) {
          const sign = Math.sign(target);
          if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
          if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
        }
      });
    }
    return diffToTarget * (-1 / PARALLAX_FACTOR) * 100;
  });
};

export const parallax = (embla) => {
  const slides = embla.slideNodes();
  const layers = slides.map((s) => s.querySelector(".embla__slide__parallax"));

  const applyParallaxStyles = () => {
    const parallaxTransforms = calculateParallaxTransforms(embla);
    parallaxTransforms.forEach((transform, index) => {
      layers[index].style.transform = `translateX(${transform}%)`;
    });
  };

  return applyParallaxStyles;
};
