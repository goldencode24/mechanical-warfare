const copterBase = prov(() => extend(HoverUnit, {
  draw(){
    Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
    Draw.rect(this.type.region, this.x, this.y, this.rotation - 90);
    this.drawWeapons();
    this.drawRotor();
    Draw.mixcol();
  },
  drawWeapons(){
    for(var i = 0; i <= 1; i++){
      var sign = Mathf.signs[i];
      var tra = this.rotation - 90;
      var trY = -this.type.weapon.getRecoil(this, (sign > 0)) + this.type.weaponOffsetY;
      var w = -sign * this.type.weapon.region.getWidth() * Draw.scl;
      var h = this.type.weapon.region.getHeight() * Draw.scl;
      Draw.rect(this.type.weapon.region,
        this.x + Angles.trnsx(tra, this.getWeapon().width * sign, trY),
        this.y + Angles.trnsy(tra, this.getWeapon().width * sign, trY),
        w, h, tra
      );
    }
  },
  drawRotor(){
    var offx = Angles.trnsx(this.rotation, this.type.rotorOffset(), this.type.rotorWidth());
    var offy = Angles.trnsy(this.rotation, this.type.rotorOffset(), this.type.rotorWidth());
    var rotorBladeRegion = Core.atlas.isFound(this.type.rotorBladeRegion()) ?
      this.type.rotorBladeRegion() : Core.atlas.find(modName + "-rotor-blade");
    var rotorTopRegion = Core.atlas.isFound(this.type.rotorTopRegion()) ?
      this.type.rotorTopRegion() : Core.atlas.find(modName + "-rotor-top");
    var width = rotorBladeRegion.getWidth() * this.type.rotorScale();
    var height = rotorBladeRegion.getHeight() * this.type.rotorScale();
    var rotorAngle = Time.time() * this.type.rotorSpeed() % 360;
    var rotorAngle2 = this.type.alternateRotor() ? 360 - (rotorAngle % 360) : 90 + rotorAngle;
    if(this.type.isTwinBlade()){
      for(var i = 0; i <= 1; i++){
        var sign = Mathf.signs[i];
        var twinOffX = offx * sign;
        var twinOffY = offy * sign;
        Draw.rect(rotorBladeRegion, this.x + twinOffX, this.y + twinOffY, width, height, rotorAngle);
        Draw.rect(rotorBladeRegion, this.x + twinOffX, this.y + twinOffY, width, height, 90 + rotorAngle);
        Draw.rect(rotorTopRegion, this.x + twinOffX, this.y + twinOffY);
      }
    }else{
      Draw.rect(rotorBladeRegion, this.x + offx, this.y + offy, width, height, rotorAngle);
      Draw.rect(rotorBladeRegion, this.x + offx, this.y + offy, width, height, 90 + rotorAngle);
      Draw.rect(rotorTopRegion, this.x + offx, this.y + offy);
    }
  },
}));

// Serpent
const serpentBullet = extend(BasicBulletType, {});
serpentBullet.width = 6;
serpentBullet.height = 8;
serpentBullet.speed = 7;
serpentBullet.lifetime = 19;
serpentBullet.damage = 4;
serpentBullet.shootEffect = Fx.shootSmall;
serpentBullet.smokeEffect = Fx.shootSmallSmoke;

const serpentWeapon = extendContent(Weapon, "serpent-gun", {
  
});
serpentWeapon.width = 10;
serpentWeapon.length = 5;
serpentWeapon.reload = 12;
serpentWeapon.alternate = true;
serpentWeapon.recoil = 2;
serpentWeapon.shake = 0;
serpentWeapon.inaccuracy = 3;
serpentWeapon.ejectEffect = Fx.shellEjectSmall;
serpentWeapon.shootSound = Sounds.shootSnap;
serpentWeapon.bullet = serpentBullet;

const serpentUnit = extendContent(UnitType, "serpent", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
  },
  rotorBladeRegion: function(){
    return typeof(this.bladeRegion) !== "undefined" ? this.bladeRegion : Core.atlas.find("error");
  },
  rotorTopRegion: function(){
    return typeof(this.topRegion) !== "undefined" ? this.topRegion : Core.atlas.find("error");
  },
  rotorScale: function(){
    return 1.4;
  },
  rotorSpeed: function(){
    return 15;
  },
  rotorOffset: function(){
    return 3;
  },
  rotorWidth: function(){
    return 0;
  },
  alternateRotor: function(){
    return true;
  },
  isTwinBlade: function(){
    return false;
  },
});
serpentUnit.weapon = serpentWeapon;
serpentUnit.create(copterBase);

const serpentFactory = extendContent(UnitFactory, "serpent-factory", {
  load(){
    this.region = Core.atlas.find(this.name);
    this.topRegion = Core.atlas.find("clear");
  },
  generateIcons: function(){
    return [this.region];
  }
});
serpentFactory.unitType = serpentUnit;
