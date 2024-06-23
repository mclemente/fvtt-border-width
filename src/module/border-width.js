Hooks.once("i18nInit", async function () {
	game.settings.register("border-width", "width", {
		name: "Width",
		hint: "BORDER_WIDTH.Settings.width.Hint",
		scope: "world",
		config: true,
		type: new foundry.data.fields.NumberField({
			required: true,
			initial: CONFIG.Canvas.objectBorderThickness,
			nullable: false,
			min: 1,
			max: CONFIG.Canvas.objectBorderThickness * 6,
			step: 1,
			integer: true,
			positive: true
		}),
		onChange: refreshTokens,
	});

	game.settings.register("border-width", "zoomScaling", {
		name: "BORDER_WIDTH.Settings.zoomScaling.Name",
		hint: "BORDER_WIDTH.Settings.zoomScaling.Hint",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
		onChange: refreshTokens,
	});
});

function refreshTokens() {
	canvas.tokens.placeables.filter((t) => t.controlled).forEach((t) => refreshBorder(t));
}

function refreshBorder(token) {
	let thickness = game.settings.get("border-width", "width");
	if (game.settings.get("border-width", "zoomScaling")) {
		thickness /= Math.min(1, canvas.stage.scale.x);
	}
	token.border.clear();
	token.border.lineStyle({width: thickness, color: 0x000000, alignment: 0.75, join: PIXI.LINE_JOIN.ROUND});
	token.border.drawShape(token.shape);
	token.border.lineStyle({width: thickness / 2, color: 0xFFFFFF, alignment: 1, join: PIXI.LINE_JOIN.ROUND});
	token.border.drawShape(token.shape);
}

Hooks.on("refreshToken", (token, flags) => {
	if (!flags.refreshBorder) refreshBorder(token);
});

Hooks.on("canvasPan", refreshTokens);
