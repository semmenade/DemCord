import definePlugin from "@utils/types";
export default definePlugin({
    name: "LazyImageLoader",
    description: "Only loads images when they scroll into view saving bandwidth and RAM",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
                    observer.unobserve(img);
                }
            });
        });
        document.querySelectorAll("img[loading='lazy']").forEach(img => observer.observe(img));
        (this as any)._observer = observer;
    },
    stop() { (this as any)._observer?.disconnect(); }
});
