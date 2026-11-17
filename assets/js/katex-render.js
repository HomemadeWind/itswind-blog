const katexRender = document.getElementById("katex-render");

if (katexRender) {
  katexRender.addEventListener("load", () => {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
        { left: "$", right: "$", display: false },
      ],
    });
  });
}
