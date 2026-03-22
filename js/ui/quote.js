export function createQuoteController() {
  const quoteEl = document.getElementById("quote");

  if (!quoteEl) {
    throw new Error("Quote element #quote is missing");
  }

  function pulse() {
    quoteEl.animate(
      [
        { opacity: 1, filter: "brightness(1)" },
        { opacity: 1, filter: "brightness(1.18)" },
        { opacity: 1, filter: "brightness(1)" }
      ],
      {
        duration: 1500,
        easing: "ease-out"
      }
    );
  }

  return {
    pulse,
    element: quoteEl
  };
}