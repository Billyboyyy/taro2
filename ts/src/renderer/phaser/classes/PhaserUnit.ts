class PhaserUnit extends PhaserAnimatedEntity {

	scene: Phaser.Scene;
	sprite: Phaser.GameObjects.Sprite;
	label: Phaser.GameObjects.Text;
	chat: PhaserChatBubble;

	gameObject: Phaser.GameObjects.Container;
	attributes: PhaserAttributeBar[] = [];



	constructor (scene: Phaser.Scene,
				 entity: Unit) {

		super(scene, entity, `unit/${entity._stats.type}`);

		this.scene = scene;
		const translate = entity._translate;
		this.gameObject = scene.add.container(
			translate.x,
			translate.y,
			[ this.sprite ]
		);

		const label = this.label = scene.add.text(0, 0, 'cccccc');
		label.setOrigin(0.5);
		this.gameObject.add(label);

		//const attributes = this.attributes;

		Object.assign(this.evtListeners, {
			followListener: entity.on('follow', this.followListener, this),
			stopFollowListener: entity.on('stop-follow', this.stopFollowListener, this),
			updateLabelListener: entity.on('update-label', this.updateLabelListener, this),
			hideLabelListener: entity.on('hide-label', this.hideLabelListener, this),
			renderAttributesListener: entity.on('render-attributes', this.renderAttributesListener, this),
			updateAttributeListener: entity.on('update-attribute', this.updateAttributeListener, this),
			renderChatListener: entity.on('render-chat-bubble', this.renderChatListener, this),
		});
	}

	protected transform (data: {
		x: number;
		y: number;
		rotation: number
	}): void {
		this.gameObject.setPosition(data.x, data.y);
		this.sprite.rotation = data.rotation;
	}

	protected scale (data: {
		x: number;
		y: number
	}): void {
		this.sprite.setScale(data.x, data.y);
	}

	private followListener (): void {
		console.log('PhaserUnit follow', this.entity.id()); // TODO remove
		const camera = this.scene.cameras.main as Phaser.Cameras.Scene2D.Camera & {
				_follow: Phaser.GameObjects.GameObject
			};
		if (camera._follow === this.gameObject) {
			return;
		}
		camera.startFollow(this.gameObject, true, 0.05, 0.05);
	}

	private stopFollowListener (): void {
		console.log('PhaserUnit stop-follow', this.entity.id()); // TODO remove
		this.scene.cameras.main.stopFollow();
	}

	private updateLabelListener (config: {
		text? : string;
		bold?: boolean;
		color?: string;
	}): void {
		console.log('PhaserUnit update-label', this.entity.id()); // TODO remove
		const label = this.label;
		label.visible = true;

		label.setFontFamily('Verdana');
		label.setFontSize(16);
		label.setFontStyle(config.bold ? 'bold' : 'normal');
		label.setFill(config.color || '#fff');

		const strokeThickness = ige.game.data.settings
			.addStrokeToNameAndAttributes !== false ? 4 : 0;
		label.setStroke('#000', strokeThickness);

		label.setText(config.text || '');

		label.y = -25 -
					Math.max(this.sprite.displayHeight, this.sprite.displayWidth) / 2;
		label.setScale(1.25);
	}

	private hideLabelListener (): void {
		console.log('PhaserUnit hide-label', this.entity.id()); // TODO remove
		this.label.visible = false;
	}

	private renderAttributesListener (data: {
		attrs: AttributeData[]
	}): void {
		console.log('PhaserUnit render-attributes', data); // TODO remove
		const attributes = this.attributes;
		// release all existing attribute bars
		attributes.forEach((a) => {
			PhaserAttributeBar.release(a);
		});
		attributes.length = 0;
		// add attribute bars based on passed data
		data.attrs.forEach((ad) => {
			const a = PhaserAttributeBar.get(this);
			a.render(ad);
			attributes.push(a);
		});
	}

	private updateAttributeListener (data: {
		attr: AttributeData;
		shouldRender: boolean;
	}): void {
		console.log('PhaserUnit update-attribute', data); // TODO remove
		const attributes = this.attributes;
		let a: PhaserAttributeBar;
		let i = 0;
		for (; i < attributes.length; i++) {
			if (attributes[i].name === data.attr.type) {
				a = attributes[i];
				break;
			}
		}
		if (!data.shouldRender) {
			if (a) {
				PhaserAttributeBar.release(a);
				attributes.splice(i, 1);
			}
			return;
		}
		if (!a) {
			a = PhaserAttributeBar.get(this);
			attributes.push(a);
		}
		a.render(data.attr);
	}

	private renderChatListener (text): void {
		console.log('create-chat', text); // TODO remove
		if (this.chat) {
			this.chat.showMessage(text);
		} else {
			this.chat = new PhaserChatBubble(this.scene, text, this);
		}
	}

	protected destroy (): void {
		if (this.chat) this.chat.destroy();

		// release all instantiated attribute bars
		this.attributes.forEach((a) => {
			PhaserAttributeBar.release(a);
		});
		this.attributes.length = 0;
		this.attributes = null;

		this.label = null;
		this.sprite = null;

		Object.keys(this.evtListeners).forEach((key) => {
			this.entity.off(key, this.evtListeners[key]);
			delete this.evtListeners[key];
		});

		this.gameObject.destroy();

		this.gameObject = null;
		this.evtListeners = null;
		this.entity = null;
	}

	/*update (/*time: number, delta: number*//*): void {

		/*const unit = this.unit;
		const container = unit._pixiContainer;
		const texture = unit._pixiTexture;*/

	/*if (unit._destroyed || container._destroyed) {

			/*unit.off('follow', this.followListener);
			this.followListener = null;

			unit.off('stop-follow', this.stopFollowListener);
			this.stopFollowListener = null;

			unit.off('play-animation', this.playAnimationListener);
			this.playAnimationListener = null;

			unit.off('update-label', this.updateLabelListener);
			this.updateLabelListener = null;

			unit.off('hide-label', this.hideLabelListener);
			this.hideLabelListener = null;

			unit.off('render-attributes', this.renderAttributesListener);
			this.renderAttributesListener = null;

			unit.off('update-attribute', this.updateAttributeListener);
			this.updateAttributeListener = null;

			unit.off('render-chat-bubble', this.renderChatListener);
			this.renderChatListener = null;*/
	/*if (this.chat) this.chat.destroy();

			// release all instantiated attribute bars
			/*this.attributes.forEach((a) => {
				PhaserAttributeBar.release(a);
			});
			this.attributes.length = 0;
			this.attributes = null;*/

	//this.scene.events.off('update', this.update, this);

	/*this.label = null;
			this.sprite = null;

			this.destroy();

			return;
		}*/

	/*this.gameObject.x = container.x;
		this.gameObject.y = container.y;

		//if (this.chat) this.chat.update(this.x, this.y);

		const sprite = this.sprite;
		sprite.rotation = texture.rotation;

		const bounds = unit._bounds2d;
		const flip = unit._stats.flip;
		sprite.setDisplaySize(bounds.x, bounds.y);
		sprite.setFlip(flip % 2 === 1, flip > 1);*/
	//}
}

