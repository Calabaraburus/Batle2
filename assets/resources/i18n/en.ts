
const win = window as any;

export const languages = {
    label_text: {
        music: "Music",
        sound: "Sound"
    },
    levels: {
        lvl1: {
            num: "1",
            name: "First clash",
            intro: "Rezkar, a mighty mercenary, and his gang arrive at a quiet village, where they learn that the inhabitants of the settlement oppose the robbers. A jingling purse quickly convinces the mercenaries to stand up for the settlement. At sunset, under the blood-red clouds, the first clash broke out. The steel of the mercenaries met the dark figures of the robbers.",
            ending: "When the last robber fell, the village joyfully expresses its gratitude, raising foamy mugs in honor of the mercenaries.",
        },
        lvl2: {
            num: "2",
            name: "Caravan",
            intro: "From the village to the port city of Tarankol runs a road, lately not peaceful. A group of mercenaries undertakes to escort a merchant caravan through dangerous lands. Halfway there, a band of robbers attacks from ambush, sensing a rich prey. Rezkar raises his hand, sending a sign to the squad to take defense.",
            ending: "In the city where they delivered the cargo, they are met by a grateful merchant. He sprinkles a couple of coins into Rezkar’s hand and leaves satisfied. “How much more profitable it is to be a robber” - Rezkar thought.",
        },
        lvl3: {
            num: "3",
            name: "Wicked revenge",
            intro: "The powerful patron of the robbers, seeking revenge for his subordinates, skillfully slandered Rezkar before the city Council, putting forward sinister accusations of brutal crimes. Squads of guards surround the mercenaries by order of the Council. The battle in the narrow streets of the city will be a hard test…",
            ending: "The mercenaries fight their way to the port and capture a ship that was anchored, finally escaping from the unjust and cruel fury of the townspeople.",
        },
        lvl4: {
            num: "4",
            name: "Sea battle",
            intro: "Escaping on the ship, the mercenaries do not get the desired salvation. A glory-hungry captain-cutthroat is sent after Rezkar. Being an experienced sailor, he catches up with Rezkar’s ship and takes it by boarding. A storm of steel blades and exploding spells is about to break out.",
            ending: "A sea of blood is spilled on the deck, but the ship, surviving the battle, finally docks at the pier of a big city. In such a big city, there is always a place for good fighters.",
        },
        lvl5: {
            num: "5",
            name: "Treasures of antiquity",
            intro: "The city where the gang arrived was called Brae. In the first port tavern, where Rezkar looked in, there was an active recruitment of volunteers into the army of the local Lord. According to rumors, an expedition was being prepared for some artifact, an addition to the rich collection of the Lord. A few days later, the band of mercenaries found themselves under the walls of an ancient monastery high in the mountains, where a fierce battle broke out.",
            ending: "At the moment when the Lord’s chubby hand reached for the treasure, shining on Rezkar’s palm, the mercenary quickly swung his sword and broke the deal. Rezkar, mysteriously snorting, declared himself the new ruler of the mysterious thing.",
        },
        lvl6: {
            num: "6",
            name: "Bridge",
            intro: "A dark force lately tormented and eventually conquered Rezkar and his people. The thirst for power filled their souls and the army moved to the capital of the kingdom, the city of Dulmir. The only crossing over the turbulent deep waters of the mighty river separated the Mercenary from the direct road to the capital. The stone bridge, crowded with dense rows of enemies, turns into an arena of deadly confrontation.",
            ending: "Rezkar, fighting on the narrow passage, feels the heaviness of every movement, seeing how the dark water swirls below. “I would like to swim” - Rezkar thought, but he sent another enemy to swim.",
        },
        lvl7: {
            num: "7",
            name: "General battle",
            intro: "On the endless autumn field, Rezkar met the king’s army, unfolded in all its banners. The sun, shaded by the black clouds of war, did not want to shine, anticipating a mournful day. Feeling absolute invincibility in himself, Rezkar, like a mighty stream, threatening to wash away everything in his way, rushed with his band to the neat ranks of enemies.",
            ending: "The mixed smell of blood and burning fields fills the air, and the earth is soaked with suffering. Rezkar was not a farmer, so he fertilized the land as he could.",
        },
        lvl8: {
            num: "8",
            name: "Breach in the walls",
            intro: "The siege of Dulmir, an ancient city with high stone walls decorated with carvings and frescoes, has been going on for three months. Every day, more and more shaking blows of Rezkar’s siege machines. Every hour, the soldiers on the walls lose more and more comrades and hope. Every minute, the breach in the wall becomes wider and deeper. ",
            ending: "The impregnable walls of Dulmir fell along with the hopes of the defending inhabitants. The defenders were swept away. Rezkar’s troops poured into the city.",
        },
        lvl9: {
            num: "9",
            name: "Last hope",
            intro: "The townspeople, feeling that Rezkar brings doom to everything, took up arms in the last hope of defending themselves. The inhabitants of the capital, from young to old, mixed with the remnants of the royal army, met the Destroyer of life on the central city square. They were poorly armed and dressed, but full of determination and anger. They held in their hands scythes, forks, knives, axes, bows, spears, swords, shields, whatever was at hand. They shouted, prayed, cried, but furiously threw themselves into battle. They knew it was their last chance.",
            ending: "The city square, formerly a place of joy and fun, became an arena of tragedy. A dead city. The last ragged remnants of Rezkar’s army moved to the king’s castle. There were too few of them, they were covered with blood, sweat and dirt, but full of triumph and malice.",
        },
        lvl10: {
            num: "10",
            name: "Crown whose?",
            intro: "The final battle unfolds inside the castle, where Rezkar and the remnants of his comrades face the personal guard of the great ruler. The sounds of swords, the moans of the wounded fill the halls. The king, clinging to his throne, does not want to let it go without a fight.",
            ending: "On the throne, dark and sticky with blood, sits the new king, smiling at the empty halls of the palace, the empty streets of the city, the empty lands and the emptiness inside himself. And next to him, putting his hand on Rezkar’s shoulder, the Evil giggled happily and satisfied, no longer hiding in the depths of the ancient wonderful thing from the destroyed monastery.",
        },
        lvl_arena: {
            num: "...",
            name: "Arena",
            intro: "Fight random fighters with different abilities in the arena.",
            ending: "",
        }
    },
    cards: {
        firewall: {
            name: "Firewall (Strong)",
            description: "The air thickens, soaking up the pungent smell of sulfur, envelops the space and, in an instant, flares up with an all-consuming fire wall. <br/><br/> Burns 7 tiles in the enemy column.",
        },
        firewallLow: {
            name: "Firewall (Weak)",
            description: "The air thickens, soaking up the pungent smell of sulfur, envelops the space and, in an instant, flares up with an all-consuming fire wall. <br/><br/> Burns 3 tiles in the enemy column.",
        },
        firewallMiddle: {
            name: "Firewall (Average)",
            description: "The air thickens, soaking up the pungent smell of sulfur, envelops the space and, in an instant, flares up with an all-consuming fire wall. <br/><br/> Burns 5 tiles in the enemy column.",
        },
        lightning: {
            name: "Lightning (Strong)",
            description: "The sky is torn apart by dazzling light. Lightning, like sparkling daggers of the gods, tear the space with their merciless dance. <br/><br/> Attacks the enemy field and destroys 10 random cells.",
        },
        lightningLow: {
            name: "Lightning (Weak)",
            description: "The sky is torn apart by dazzling light. Lightning, like sparkling daggers of the gods, tear the space with their merciless dance. <br/><br/> Attacks the enemy field and destroys 5 random cells.",
        },
        lightningMiddle: {
            name: "Lightning (Average)",
            description: "The sky is torn apart by dazzling light. Lightning, like sparkling daggers of the gods, tear the space with their merciless dance. <br/><br/> Attacks the enemy field and destroys 8 random cells.",
        },
        totem: {
            name: "Totem (Strong)",
            description: "In the middle of the hill stands a carved pole, its surface is covered with mysterious runes. Like a guardian of ancient secrets, he looks steadfastly through the ages. <br/><br/> Replaces 2 random tiles of the player with totems. Totems have 2 lives.",
        },
        totemLow: {
            name: "Totem (Weak)",
            description: "In the middle of the hill stands a carved pole, its surface is covered with mysterious runes. Like a guardian of ancient secrets, he looks steadfastly through the ages. <br/><br/> Replaces 2 random tiles of the player with totems.",
        },
        mine: {
            name: "Mine (Strong)",
            description: "The desert plain is deceptively calm, but in its heart lies a deadly trap. The earth suddenly swells, throwing fire and metallic smell. <br/><br/> Mine is placed on the enemy field and explodes after the opponent’s turn, destroying 5 enemy tiles.",
        },
        mineLow: {
            name: "Mine (Weak)",
            description: "The desert plain is deceptively calm, but in its heart lies a deadly trap. The earth suddenly swells, throwing fire and metallic smell. <br/><br/> Mine is placed on the enemy field and explodes after the opponent’s turn, destroying 3 enemy tiles in the column.",
        },
        meteorite: {
            name: "Meteorite (Strong)",
            description: "The sky cracks, when a fiery meteorite breaks into the atmosphere, leaving behind a sparkling trail and anticipation of inevitable disaster. <br/><br/> Destroys 9 enemy tiles.",
        },
        meteoriteLow: {
            name: "Meteorite (Weak)",
            description: "The sky cracks, when a fiery meteorite breaks into the atmosphere, leaving behind a sparkling trail and anticipation of inevitable disaster. <br/><br/> Destroys an enemy tile",
        },
        meteoriteMiddle: {
            name: "Meteorite (Average)",
            description: "The sky cracks, when a fiery meteorite breaks into the atmosphere, leaving behind a sparkling trail and anticipation of inevitable disaster. <br/><br/> Destroys 5 enemy tiles.",
        },
        recruit: {
            name: "",
            description: "",
        },
        catapult: {
            name: "Ballista (Strong)",
            description: "On the hill towers a massive ballista, wooden levers are tense, ropes are stretched to the limit, just a moment before the deadly flight. <br/><br/> Ballista replaces a tile on the player’s field. Each time, at the end of the opponent’s turn, the ballista takes away 5 units of life from the enemy hero.",
        },
        catapultLow: {
            name: "Ballista (Weak)",
            description: "On the hill towers a massive ballista, wooden levers are tense, ropes are stretched to the limit, just a moment before the deadly flight. <br/><br/> Ballista replaces a tile on the player’s field. Each time, at the end of the opponent’s turn, the ballista takes away 3 units of life from the enemy hero.",
        },
        shaman: {
            name: "Shaman (Strong)",
            description: "The methodical beat of the drum and the deep throaty chant summon the forces of nature and the shadows of ancient spirits. In the eyes of the shaman, the boundless power of the forest is reflected and becomes an ingredient in his great healing essence. <br/><br/> Шаман заменяет плитку на поле игрока. Каждый раз, при завершении хода противника, шаман повышает на 5 ед. здоровье своего героя.",
        },
        shamanLow: {
            name: "Shaman (Weak)",
            description: "The methodical beat of the drum and the deep throaty chant summon the forces of nature and the shadows of ancient spirits. In the eyes of the shaman, the boundless power of the forest is reflected and becomes an ingredient in his great healing essence. <br/><br/> Шаман заменяет плитку на поле игрока. Каждый раз, при завершении хода противника, шаман повышает на 3 ед. здоровье своего героя.",
        },
        c_attack: {
            name: "Counterattack",
            description: "Those who were on the verge of death, who lost their last hope, suddenly get inspired and, gathering the remnants of their strength, repel the enemy, when a majestic cry of the Hero echoes between the rows. <br/><br/> In 4 random columns, 3 enemy tiles are destroyed.",
        },
        worm: {
            name: "Worm (Strong)",
            description: "The earth trembles and cracks, a harbinger of impending doom. From the bottomless depths, the Worm rises. It relentlessly devours the ranks of the enemy troops. The cries and groans of the consumed foes long resonate beneath the ground, the echo of a temporarily satiated, but eternally hungry beast. <br/><br/> Destroys up to 8 enemy tiles one by one.",
        },
        wormMiddle: {
            name: "Worm (Average)",
            description: "The earth trembles and cracks, a harbinger of impending doom. From the bottomless depths, the Worm rises. It relentlessly devours the ranks of the enemy troops. The cries and groans of the consumed foes long resonate beneath the ground, the echo of a temporarily satiated, but eternally hungry beast. <br/><br/> Destroys up to 6 enemy tiles one by one.",
        },
        wormLow: {
            name: "Worm (Weak)",
            description: "The earth trembles and cracks, a harbinger of impending doom. From the bottomless depths, the Worm rises. It relentlessly devours the ranks of the enemy troops. The cries and groans of the consumed foes long resonate beneath the ground, the echo of a temporarily satiated, but eternally hungry beast. <br/><br/> Destroys up to 4 enemy tiles one by one.",
        },
        pike: {
            name: "Spear of God (Strong)",
            description: "A mighty weapon, radiating bright light of divine energy. Its tip pierces the ranks of enemies with relentless accuracy, leaving behind only ashes. <br/><br/> Destroys 9 enemy tiles forming the spear tip",
        },
        pikeLow: {
            name: "Spear of God (Weak)",
            description: "A mighty weapon, radiating bright light of divine energy. Its tip pierces the ranks of enemies with relentless accuracy, leaving behind only ashes. <br/><br/> Destroys 5 enemy tiles forming the spear tip",
        },
        pikeMiddle: {
            name: "Spear of God (Average)",
            description: "A mighty weapon, radiating bright light of divine energy. Its tip pierces the ranks of enemies with relentless accuracy, leaving behind only ashes. <br/><br/> Destroys 3 enemy tiles forming the spear tip",
        },
        push: {
            name: "Onslaught",
            description: "The army is ready to attack, swords glitter, shields clash, and the eyes of the soldiers burn with the flame of determination. At this moment, the war horn sounds. <br/><br/> The rear enemy row is destroyed.",
        },
        berserk: {
            name: "Berserk (Strong)",
            description: "In the very center of the battle appears a warrior, wrapped in frenzy. In his eyes, a wild passion, and every his blow - unstoppable rage. <br/><br/> 2 berserkers randomly appear on the player's field, replacing 2 tiles. Attacks enemy tiles",
        },
        berserkLow: {
            name: "Berserk (Weak)",
            description: "In the very center of the battle appears a warrior, wrapped in frenzy. In his eyes, a wild passion, and every his blow - unstoppable rage. <br/><br/> 1 berserker randomly appears on the player's field, replacing a friendly tile. Attacks an enemy tile",
        },
        assassin: {
            name: "Assassin (Strong)",
            description: "Silently, invisible to the eye, he approaches the target, like a shadow in the dark of night, a harbinger of the inevitable. <br/><br/> The tile on the player’s field is replaced by an assassin. At the end of the opponent’s turn, the assassin destroys 2 random enemy tile.",
        },
        assassinLow: {
            name: "Assassin (Weak)",
            description: "Silently, invisible to the eye, he approaches the target, like a shadow in the dark of night, a harbinger of the inevitable. <br/><br/> The tile on the player’s field is replaced by an assassin. At the end of the opponent’s turn, the assassin destroys 1 random enemy tile.",
        },
        shield: {
            name: "Shield",
            description: "The soldiers line up in an armored position, displaying shields and bristling with spears, ready to repel any attack. <br/><br/> A group of identical tiles gets immunity until the next player’s turn.",
        },
        hammer: {
            name: "Hammer of God (Strong)",
            description: "On the arena of great battles rises the Hammer of God, its destructive blows explode with thunderclaps, and the earth breaks under the pressure of ancient power. <br/><br/> Destroys 9 enemy tiles forming the hammer.",
        },
        hammerLow: {
            name: "Hammer of God (Weak)",
            description: "On the arena of great battles rises the Hammer of God, its destructive blows explode with thunderclaps, and the earth breaks under the pressure of ancient power. <br/><br/> Destroys 3 enemy tiles forming the hammer.",
        },
        hammerMiddle: {
            name: "Hammer of God (Average)",
            description: "On the arena of great battles rises the Hammer of God, its destructive blows explode with thunderclaps, and the earth breaks under the pressure of ancient power. <br/><br/> Destroys 6 enemy tiles forming the hammer.",
        },
        maneuver: {
            name: "Maneuver",
            description: "Clouds of dust rise among the battlefield, the army swiftly reorganizes, like a living organism, obeying the invisible orders of an experienced commander. <br/><br/> Shuffles the field around the target tile.",
        },
        panic: {
            name: "Panic",
            description: "An incomprehensible fear gradually creeps among the enemy ranks. Screams of horror merge into a faceless mass, like a curse. At this moment, the troops lose the remnants of their resilience. <br/><br/> The tiles next to the target get the same type.",
        },
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
