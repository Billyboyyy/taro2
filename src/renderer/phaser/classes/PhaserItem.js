var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PhaserItem = /** @class */ (function (_super) {
    __extends(PhaserItem, _super);
    function PhaserItem(scene, entity) {
        var _this = _super.call(this, scene, entity, "item/".concat(entity._stats.itemTypeId)) || this;
        _this.sprite.visible = false;
        _this.gameObject = _this.sprite;
        var _a = entity._translate, x = _a.x, y = _a.y;
        _this.gameObject.setPosition(x, y);
        _this.inBackpack = false;
        _this.toggleRender(!_this.inBackpack);
        Object.assign(_this.evtListeners, {
            backpack: entity.on('backpack', _this.backpack, _this),
        });
        return _this;
    }
    PhaserItem.prototype.backpack = function (inBackpack) {
        //
        this.inBackpack = inBackpack;
        if (this.inBackpack) {
            this.hide();
        }
        else {
            this.show();
        }
        this.toggleRender(!this.inBackpack);
    };
    PhaserItem.prototype.destroy = function () {
        this.toggleRender(false);
        _super.prototype.destroy.call(this);
    };
    return PhaserItem;
}(PhaserAnimatedEntity));
//# sourceMappingURL=PhaserItem.js.map