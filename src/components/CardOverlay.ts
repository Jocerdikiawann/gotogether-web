class CardOverlay extends google.maps.OverlayView {
    private title: string;
    private estimate: string;
    private destination: string;
    private location: string;
    private div?: HTMLElement;

    constructor(title: string, estimate: string, destination: string, location: string) {
        super()

        this.title = title
        this.estimate = estimate
        this.destination = destination
        this.location = location
    }

    onAdd(): void {
        this.div = document.createElement("div")
        this.div.style.borderStyle = "none"
        this.div.style.borderWidth = "1px"
        this.div.style.position = "absolute"

        const panes = this.getPanes()
        panes?.overlayLayer.appendChild(this.div)
    }

    draw(): void {
        const overlayProjection = this.getProjection()

        
    }

    onRemove(): void {

    }
}