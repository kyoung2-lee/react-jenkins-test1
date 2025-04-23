"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-unresolved
const exif_js_1 = __importDefault(require("exif-js"));
const ios_imagefile_megapixel_1 = __importDefault(require("@koba04/ios-imagefile-megapixel"));
class ProfileImageCreator {
    constructor(image, pixelCrop) {
        this.image = image;
        this.pixelCrop = pixelCrop;
        // canvasを処理する際の最大px幅
        this.CANVAS_MAXIMUM_WORKING_WIDTH = 640;
        // 最大幅設定後の、canvasの縦横のpx
        this.canvasWorkingWidth = 0;
        this.canvasWorkingHeight = 0;
    }
    create(width, height) {
        return new Promise((resolve) => {
            const callback = () => {
                const orient = exif_js_1.default.getTag(this, "Orientation");
                const aspect = this.CANVAS_MAXIMUM_WORKING_WIDTH / this.image.naturalWidth;
                this.canvasWorkingWidth = this.image.naturalWidth * aspect;
                this.canvasWorkingHeight = this.image.naturalHeight * aspect;
                const drawnMegaCanvas = this.drawMegaCanvas(aspect);
                const rotationAdjustedCanvas = this.drawRotationCanvas(drawnMegaCanvas, orient);
                const drawnCropcanvas = this.drawCropCanvas(rotationAdjustedCanvas, aspect, width, height);
                resolve(drawnCropcanvas.toDataURL("image/png").replace("data:image/png;base64,", ""));
            };
            exif_js_1.default.getData(this.image, callback);
        });
    }
    // Safariで大きすぎる画像をcanvasに描画できないため、
    // MegaPixImageで小さいCanvasを合成して生成する
    drawMegaCanvas(aspect) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx)
            throw new Error("Cannnot draw mega canvas.");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        new ios_imagefile_megapixel_1.default(this.image).render(canvas, { width: this.image.naturalWidth * aspect });
        return canvas;
    }
    // iOSの場合、縦の写真でも回転情報が付与されているため、
    // canvasに描画する時に回転してしまう。
    // cropする時に縦になっていないと正しく切り取れないため、EXIFの回転情報を無効にする
    drawRotationCanvas(megaCanvas, orient) {
        // ブラウザが画像の自動回転機能をサポートしていれば何もしない
        if (CSS.supports("image-orientation", "from-image")) {
            return megaCanvas;
        }
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx)
            throw new Error("Cannot draw rotation canvas.");
        switch (orient) {
            case 3: // 180度回転
                canvas.width = megaCanvas.width;
                canvas.height = megaCanvas.height;
                ctx.rotate(Math.PI);
                ctx.drawImage(megaCanvas, -megaCanvas.width, -megaCanvas.height);
                return canvas;
            case 6: // 左回りに90度 回転
                canvas.width = megaCanvas.height;
                canvas.height = megaCanvas.width;
                ctx.rotate(Math.PI * 0.5);
                ctx.drawImage(megaCanvas, 0, -megaCanvas.height);
                return canvas;
            case 8: // 右回りに90度回転
                canvas.width = megaCanvas.height;
                canvas.height = megaCanvas.width;
                ctx.rotate(-Math.PI * 0.5);
                ctx.drawImage(megaCanvas, -megaCanvas.width, 0);
                return canvas;
            default:
                // 回転情報がない場合は、そのまま返す
                return megaCanvas;
        }
    }
    drawCropCanvas(rotationCanvas, aspect, width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            throw new Error("Cannot draw crop canvas.");
        ctx.drawImage(rotationCanvas, this.adjustCanvasCoords(this.pixelCrop.x * aspect, "width"), this.adjustCanvasCoords(this.pixelCrop.y * aspect, "height"), this.adjustCanvasCoords(this.pixelCrop.width * aspect, "width"), this.adjustCanvasCoords(this.pixelCrop.height * aspect, "height"), 0, 0, canvas.width, canvas.height);
        return canvas;
    }
    /**
     * drawImageメソッド利用時に、コピー元の座標指定が実際の座標からはみ出していた場合、
     * 上手くコピーできない場合がある事象への対応
     */
    adjustCanvasCoords(pixelNum, type) {
        return type === "width"
            ? Math.min(Math.max(Math.floor(pixelNum), 0), this.canvasWorkingWidth)
            : Math.min(Math.max(Math.floor(pixelNum), 0), this.canvasWorkingHeight);
    }
}
exports.default = ProfileImageCreator;
//# sourceMappingURL=ProfileImageCreator.js.map