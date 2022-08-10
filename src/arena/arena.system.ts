import { BattleDataConfig } from "src/types/arena.config";

export class BattleSystem {
  data: BattleDataConfig

  constructor(Pokemon, Opponent) {
    this.data = this.battle(Pokemon, Opponent);
  }

  battle(Pokemon, Opponent) {
    const log = [];

    let PokemonHp = Pokemon.attributes.hp.valueOf();
    let OpponentHp = Opponent.attributes.hp.valueOf();

    let PokemonTurn = Pokemon.attributes.speed > Opponent.attributes.speed;
    let OpponentTurn = !PokemonTurn;

    while (PokemonHp > 0 && OpponentHp > 0) {
      const attacker = PokemonTurn ? Pokemon : Opponent;
      const defender = PokemonTurn ? Opponent : Pokemon;

      const attack = attacker.attributes.attack;
      const spAttack = attacker.attributes.spAttack;

      const defense = defender.attributes.defense;
      const spDefense = defender.attributes.spDefense;

      const finalAttack = attack > spAttack ? attack : spAttack;
      const finalDefense = finalAttack === attack ? defense : spDefense;

      const damage = this.finalDamage(finalAttack, finalDefense);
      const { critical, finalDamage } = damage

      let defenderHp = PokemonTurn ? OpponentHp : PokemonHp;
      const preDamageHp = defenderHp.valueOf()

      if (PokemonTurn) {
        OpponentHp -= finalDamage;
      } else {
        PokemonHp -= finalDamage;
      }

      PokemonTurn = !PokemonTurn;
      OpponentTurn = !OpponentTurn;

      log.push(this.format(attacker, defender, preDamageHp, critical, finalDamage));
    }

    const win = OpponentHp <= 0;

    return {
      pokemon: Pokemon.id,
      opponent: Opponent.id,
      log: log,
      win: win,
    };
  }

  format(attacker, defender, defenderhp, critical, finalDamage) {
    const attackerName = attacker.name;
    const defenderName = defender.name;

    const result = {
      attacker: attackerName,
      atk: attacker.atk,
      defender: defenderName,
      def: defender.def,
      hp: defenderhp,
      critical: critical,
      damage: finalDamage,
    };

    return result;
  }

  finalDamage(atk, def) {
    let damage = atk;

    const isCritical = Math.floor(this.randomNumber(1, 10)) === 10
    damage = isCritical ? damage * 2 : damage

    const finalDamage = damage / (this.randomNumber(2, 3) + (def / 100));
    const parsedDamage = Math.trunc(finalDamage)

    return {
      critical: isCritical,
      finalDamage: parsedDamage
    };
  }

  randomNumber(min, max) {
    return Math.random() * (max - min) + min
  }
}
