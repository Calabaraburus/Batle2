
const win = window as any;

export const languages = {
    languages: {
        ru: "Русский",
        ua: "Українська",
        en: "English"
    },
    label_text: {
        gamename: "LAND OF BEASTS",
        autorsname: "Authors",
        audioname: "Sounds\\Music",
        autorstxt: "Idea, design, programming, animations, effects, etc.\n\nA. and T. Natalchishin",
        audiotxt: "MattRuthSound\nMateusz_Chenc\ndermotte\nJoelAudio\nmarb7e\nlsprice\nMrOwn1\nSDLx\nThalamus_Lab\niainmccurdy\nInspectorJ\nbendodge\nzimbot\nCGEffex\nsteveygos93\nBenboncan\nERH\ndatasoundsample\nsandyrb\nhykenfreak\ntwisterman\nEminYILDIRIM\nhumanoide9000\nAshot Danielyan\nWilliam_King\nStudioKolomna\nGioeleFazzeri\nLesfm\nVitalii Korol\nSergePavkinMusic",
        editorcaption: "Game Engine",
        editortxt: "Cocos Creator",
        mapgeneratorcaption: "Map Generator",
        mapgeneratortxt: "Perilous shores (watabou)",
        music: "Music",
        sound: "Sound",
        language: "Language",
        startturnmsgplayer: "Your turn",
        startturnmsgenemy: "Enemy's turn",
        tapanywhere: "Tap the screen",
        reward: "Reward",
        selectreward: "Make a choice",
        description: "Description",
        exit: "Exit",
        replay: "Replay",
        win: "Victory",
        lose: "Defeat",
        continue: "Continue",
        start: "Start",
        settings: "Settings",
        about: "About the game",
        back: "Back",
        reset: "Reset game",
        resetCheckCaption: "Do you want to reset the game?",
        resetFinal: "Game data reset!",
        resetCheckCaution: "Resetting the game will result in loss of all progress. The game will need to be played again from the beginning. If you really want to reset, press the 'Reset game' button!"
    },
    tutor_text: {
        tutorial: "Tutorial",
        yourhero: "This is your hero",
        yourlife: "Your life",
        enemyhero: "Your opponent",
        yourarmy: "These tiles are your soldiers",
        enemyarmy: "Enemy's army",
        gameaim: "Objective of the game:\nDefeat the enemy by\nreducing their life to zero",
        gamehow: "How?\nYou need to bring your\nsoldiers to the enemy hero,\ndestroying adjacent tiles\nof the opponent vertically\nand horizontally",
        tap: "Tap on the tiles\nto destroy the enemy squad",
        crystalon: "The crystal signals an attack.At the end of the turn, the hero will take damage.\n\nThe more crystals lit,\nthe more damage dealt",
        totem: "Destroy a group of tiles\nnext to the totem.\nThis way, you can destroy\nother special tiles too",
        endtutor: "Defeat the opponent!",
        thisisyourcard: "Choose a magic card",
        applycard: "Select an enemy soldier\nfor a magic attack",
        aboutcard: "Hold the card to\nsee its description\n\nYou can view descriptions\nof the opponent's cards\nby clicking on their hero",
        endtutor2: "Now, finish the fight!"
    },
    scrolls: {
        intro: {
            name: "Introduction",
            image: "rezkarIntro",
            text: "Fritris is a world inhabited by beastmen. On different continents, among seas and high mountains, they go about their business, build kingdoms, fight for land, and trade. In general, everything goes its own way in the world of Fritris.\n\n" +
                "Until one day, an incredible chain of events broke the measured flow of life and put the entire civilization on the brink of a disastrous abyss.\n\n" +
                "At the foot of the ancient mountains, in the distant kingdom of Dalmyr, on the borderlands, along a dusty rural road, a squad of mercenaries was walking…"
        },
        ending: {
            name: "Ending",
            image: "rezkarEnding",
            text: "On the throne, dark and sticky with blood, sits the new king, looking at the empty halls of the palace, the empty streets of the city, the empty lands, and the emptiness within himself. And next to him, with a hand on Rezkar's shoulder, Evil was gleefully and contentedly chuckling, no longer hiding in the depths of an ancient wonderful artifact from the ruined monastery."
        },
    },
    levels: {
        lvl1: {
            num: "1",
            name: "First Skirmish",
            intro: "Rezkar, a mighty lizard mercenary, arrives with his squad in a quiet village where he learns that the villagers suffer from bandit raids. The village elder was generous with coins and quickly convinced the mercenaries to defend the settlement. At sunset, under blood-red clouds, a battle erupted, with the dark figures of the robbers meeting the steel of the mercenaries.",
            ending: "When the last robber fell, the grateful villagers invited them to celebrate and raise frothy mugs to victory. Over drinks, a merchant approached Rezkar and asked him to escort him to Forkar. 'Lately, there have been many ruffians in the area, it seems some unknown force is drawing them here,' said the merchant."
        },
        lvl2: {
            num: "2",
            name: "The Caravan",
            intro: "The road from the village to the port city of Forkar has been unsafe lately. The mercenary group takes on the task of escorting a merchant caravan through dangerous lands.\n\n" +
                "Halfway there, sensing a rich haul, a band of robbers ambushes them. Rezkar raises his hand, signaling the squad to take a defensive position.",
            ending: "The fleeing enemies were caught by the mercenaries in the forest near the bandits' camp. Among the items and weapons, a monk sat alone on a stump, shackled. 'My name is Sholok and I am grateful to you for my liberation,' he said as the mercenary broke his chains. They took the monk with them to the city, where his ship and fellow believers awaited him.\n\n" +
                "When the caravan delivered the cargo, the merchant handed a few coins to Rezkar and left satisfied. 'You saw how we dealt with the robbers!'— Rezkar shouted at the merchant as he counted the coins."
        },
        lvl3: {
            num: "3",
            name: "Vile Revenge",
            intro: "The stingy merchant had to pay the agreed amount in full before Rezkar released him from his strong grip. However, the merchant did not forget the humiliation and, seeking revenge, skillfully slandered the lizard before the City Council, accusing him of attacking caravans. The Council ordered the city guards to attack the mercenaries. The battle in the narrow streets of the city will be a tough trial...",
            ending: "The mercenaries tried to break through to the city gates, but the superior forces of the enemy pushed them back. Confused, the mercenaries did not know how to escape the trap. But then Sholok appeared: 'Follow me, to my ship!' he said, pointing towards the port. The squad fought their way to the port and climbed aboard the ship, finally escaping the unjust and brutal wrath of the guards."
        },
        lvl4: {
            num: "4",
            name: "Sea Battle",
            intro: "Sailing away on the ship, the mercenaries do not find the salvation they desired. Over the horizon, a frigate with a black flag rushed towards them. The pirates quickly caught up with Rezkar's ship and boarded it. 'Too many unexpected adventures lately. Steel doesn't have time to dry,' said the lizard, unsheathing his weapon.",
            ending: "Many warriors died in the sea battle, but the surviving ship finally docked. The city they arrived at was called Brisel. Warmly bidding farewell to the mercenaries, the monks continued on their way, heading northwest where mountain ranges rose in the distance. As for Rezkar's warriors, there was always good work to be found in such a large city."
        },
        lvl5: {
            num: "5",
            name: "Treasures of Antiquity",
            intro: "In the first port tavern he entered, Rezkar saw a recruitment drive for the local Lord's army. An unexpected threat loomed over these lands, as a huge horde descended from the mountains and quickly moved towards the city, destroying everything in its path. Brisel prepared for a heavy siege. Rezkar and his men were ordered by the authorities to raid the mountains and find the source of the invasion.\n\n" +
                "Soon, the mercenaries found themselves at the walls of an ancient monastery where the horde's leader was hiding. Rezkar immediately sensed a heavy aura emanating from this place. The squad infiltrated the walls under the cover of darkness and launched a surprise attack on the enemy...",
            ingame: "Rezkar was not the only one seeking to enter the monastery; Sholok and the monks had been nearby for days, hoping to enter their once home. They seized the moment when the mercenaries distracted the guards...",
            ending: "Caught off guard by the mercenaries, the enemy was defeated. However, to Rezkar's surprise, someone continued fighting inside the temple. Entering, the mercenaries saw the bodies of the monks, their recent companions. In the center of the hall stood the leader, his hand holding a sword, buried to the hilt in Sholok's flesh. Sholok, in turn, gripped a chain around the leader's neck, pulling with such force as if the object held all the meaning of his life. Rezkar noticed the monk's lips moving. The uttered spell exploded the air between them, and their bodies were thrown against the stone walls. Searching the room, the mercenaries found a hidden passage, apparently used by the monks."
        },
        lvl6: {
            num: "6",
            name: "The Bridge",
            intro: "Rezkar continued to work for the Lord, carrying out the most dangerous orders. Gaining favor, he became one of Brisel's generals. His fame grew, emanating a sinister but alluring aura, and he quickly became a renowned hero in the eyes of warriors and commoners alike. Every time he ended a battle with a decisive victory, the warrior felt more and more power within himself. His army also grew.\n\n" +
                "Sensing such power at his disposal, the Lord decided to seize control of the entire kingdom of Dulmir and ordered an attack on the King's garrison at the bridge on the road to the capital.",
            ending: "Fighting on the narrow bridge, Rezkar felt light in his movements and mercilessly cut down the soldiers defending the crossing. The bridge was captured. In the camp on the opposite bank, in the Lord's tent, a war council was in session. Rezkar sat in a chair, intently studying a small dark seed inside his amulet. He remembered the last time he saw darkness in the crystal when he took it from the lifeless hands of the monk who had fought so desperately for the artifact in the gloomy mountain halls. Rezkar decided to keep it in memory of Sholok's valor."
        },
        lvl7: {
            num: "7",
            name: "The Grand Battle",
            intro: "'What is this?' the Lord asked, reaching for the amulet. In the moment the chubby hand touched the item in Rezkar's palm, the former mercenary ended his lord's life with a swift sword strike. 'Do not dare,' was the only thought that flashed in his mind. The onlookers made no sound, frozen, captivated by the lizard's mighty will.\n\n" +
                "...And so, on the endless autumn field, Rezkar met the King's army, unfurling all its banners, not as a mercenary leader but as the commander of an entire army.",
            ending: "The King retreated. The mixed smell of death and burning fields filled the air. Inhaling its bitter taste deeply, Rezkar involuntarily smiled, feeling satisfaction from what had been accomplished. Although victory was his, he could not stop and knew it would only end with the King's demise."
        },
        lvl8: {
            num: "8",
            name: "The Breach in the Walls",
            intro: "Rezkar's army gathered its forces around the ancient city of Dalmyr — the kingdom's capital. The walls, adorned with centuries-old carvings and frescoes, rose before them, blocking the way. Rezkar felt his mind plunging into darkness and madness under the influence of the acquired relic. But in return, from this darkness, he drew fierce strength. With a mighty movement, the lizard struck the ground, directing energy towards the city. The air vibrated with power, a wave swept through the land, and the city trembled. The seemingly monolithic stone walls couldn't withstand it and collapsed, creating a massive breach. The troops charged in...",
            ending: "Rezkar's soldiers, as if possessed, moved through the city's streets, leaving only destruction behind. The former mercenary himself led the charge, knowing no fatigue or pity. The battle lasted until dawn, and as the first rays of sunlight illuminated the ravaged streets, Rezkar stood in the central square of Dalmyr, surrounded by his warriors."
        },
        lvl9: {
            num: "9",
            name: "Last Hope",
            intro: "The remnants of the garrison and armed residents of Dalmir gathered at the opposite edge of the square. In their hearts burned a spark of last hope and faith that even against Reskar's insane power, they had a chance. With battle cries and prayers, they bravely faced the enemy. Though Reskar, consumed by the power of the artifact, continued his path of destruction, the heroic spirit of Dalmir's defenders caused his heart to momentarily stir in the face of their steadfastness and courage.",
            ending: "The city square, once a place of joy and celebration, had become an arena of tragedy. A dead city... The last tattered remnants of Reskar's army moved toward the king's castle. There were too few of them left, they were covered in blood, sweat, and dirt, but filled with triumph and rage."
        },
        lvl10: {
            num: "10",
            name: "Whose Crown?",
            intro: "In the heart of the fortress, under the arches of the ancient castle, the final battle unfolded. Reskar, along with his loyal warriors, clashed with the great ruler's personal guard. The echoes of clashing steel and the groans of the wounded filled the halls. The ruler, hearing the approaching roar of the fight, gripped the staff of power more tightly, ready to defend his throne to the last breath. He knew that every moment could be decisive in this battle for the kingdom's fate.",
            ending: "The ruler, exhausted but resolute, faced Reskar. The blades clashed with a deafening clang. With each strike, Reskar pressed harder, until finally, his blade broke through the defense and plunged into the ruler's chest. The ruler fell to his knees, blood gushing from the wound. The staff fell from his weakened fingers and clattered across the marble tiles of the throne room, coming to rest at Reskar's feet. The halls of the castle shook with triumphant shouts – victory was achieved."
        },
        lvl_arena: {
            num: "...",
            name: "Arena",
            intro: "A fight of random fighters with various abilities in the arena.",
            ending: ""
        }
    },
    cards: {
        meteorRain: {
            name: "Meteor Rain",
            description: "Cracks spread across the sky, and burning fragments of cosmic origin begin to fall. Their impacts explode like fiery projectiles, leaving whirlwinds of dust and fire in their wake. \n\n Destroys 15 random enemy tiles."
        },
        champion: {
            name: "Champion",
            description: "Under the king's banner stands a legendary fighter, a warrior beyond measure, an embodiment of strength and destructive force. His name is a curse to enemies and sacred to allies. \n\n Replaces one random player tile with a Champion. Has 2 lives. Destroys 2 enemy tiles in front."
        },
        firewall: {
            name: "Firewall (Strong)",
            description: "The air thickens, filled with the pungent smell of sulfur, enveloping the space and igniting into an all-consuming wall of fire in an instant. \n\n Burns 7 tiles in an enemy column."
        },
        firewallLow: {
            name: "Firewall (Weak)",
            description: "The air thickens, filled with the pungent smell of sulfur, enveloping the space and igniting into an all-consuming wall of fire in an instant. \n\n Burns 3 tiles in an enemy column."
        },
        firewallMiddle: {
            name: "Firewall (Medium)",
            description: "The air thickens, filled with the pungent smell of sulfur, enveloping the space and igniting into an all-consuming wall of fire in an instant. \n\n Burns 5 tiles in an enemy column."
        },
        lightning: {
            name: "Lightning (Strong)",
            description: "The sky splits open with a blinding light. Lightning bolts, like sparkling daggers of the gods, tear through space with their relentless dance. \n\n Attacks the enemy field and destroys 11 random cells."
        },
        lightningLow: {
            name: "Lightning (Weak)",
            description: "The sky splits open with a blinding light. Lightning bolts, like sparkling daggers of the gods, tear through space with their relentless dance. \n\n Attacks the enemy field and destroys 5 random cells."
        },
        lightningMiddle: {
            name: "Lightning (Medium)",
            description: "The sky splits open with a blinding light. Lightning bolts, like sparkling daggers of the gods, tear through space with their relentless dance. \n\n Attacks the enemy field and destroys 8 random cells."
        },
        totem: {
            name: "Totem (Strong)",
            description: "A carved pillar rises on the hill, its surface adorned with mysterious runes. Like a guardian of ancient secrets, it gazes unshakably through the ages. \n\n Replaces 2 random player tiles with totems. Totems have 2 lives."
        },
        totemLow: {
            name: "Totem (Weak)",
            description: "A carved pillar rises on the hill, its surface adorned with mysterious runes. Like a guardian of ancient secrets, it gazes unshakably through the ages. \n\n Replaces 2 random player tiles with totems."
        },
        mine: {
            name: "Mine (Strong)",
            description: "The desert plain is deceptively calm, but a deadly trap lies within its heart. The ground suddenly erupts, spewing fire and the smell of metal. \n\n The mine is placed on the enemy field and explodes after the opponent's turn, destroying 5 enemy tiles."
        },
        mineLow: {
            name: "Mine (Weak)",
            description: "The desert plain is deceptively calm, but a deadly trap lies within its heart. The ground suddenly erupts, spewing fire and the smell of metal. \n\n The mine is placed on the enemy field and explodes after the opponent's turn, destroying 3 enemy tiles in the column."
        },
        meteorite: {
            name: "Meteorite (Strong)",
            description: "The heavens split as a fiery meteorite bursts into the atmosphere, leaving a sparkling trail and the anticipation of inevitable catastrophe. \n\n Destroys 9 enemy tiles."
        },
        meteoriteLow: {
            name: "Meteorite (Weak)",
            description: "The heavens split as a fiery meteorite bursts into the atmosphere, leaving a sparkling trail and the anticipation of inevitable catastrophe. \n\n Destroys 1 enemy tile."
        },
        meteoriteMiddle: {
            name: "Meteorite (Medium)",
            description: "The heavens split as a fiery meteorite bursts into the atmosphere, leaving a sparkling trail and the anticipation of inevitable catastrophe. \n\n Destroys 5 enemy tiles."
        },
        recruit: {
            name: "Recruit",
            description: "A fresh and determined recruit joins the battle. His potential is great, and he is ready to fend off the enemy. \n\n Replaces one random player tile with a Recruit. Destroys 1 enemy tile in front."
        },
        catapult: {
            name: "Ballista (Strong)",
            description: "On the hill stands a massive ballista, its wooden levers tense, ropes drawn taut, just a moment before deadly flight. \n\n Ballista replaces a tile on the player's field. Each time the opponent's turn ends, the ballista deducts 5 HP from the enemy hero."
        },
        catapultLow: {
            name: "Ballista (Weak)",
            description: "On the hill stands a massive ballista, its wooden levers tense, ropes drawn taut, just a moment before deadly flight. \n\n Ballista replaces a tile on the player's field. Each time the opponent's turn ends, the ballista deducts 3 HP from the enemy hero."
        },
        shaman: {
            name: "Shaman (Strong)",
            description: "The rhythmic beat of the drum and deep guttural chant summon the forces of nature and the shadows of ancient spirits. In the shaman's eyes reflects the boundless power of the forest, becoming an ingredient in his great healing essence. \n\n Shaman replaces a tile on the player's field. Each time the opponent's turn ends, the shaman increases the hero's health by 5 HP."
        },
        shamanLow: {
            name: "Shaman (Weak)",
            description: "The rhythmic beat of the drum and deep guttural chant summon the forces of nature and the shadows of ancient spirits. In the shaman's eyes reflects the boundless power of the forest, becoming an ingredient in his great healing essence. \n\n Shaman replaces a tile on the player's field. Each time the opponent's turn ends, the shaman increases the hero's health by 3 HP."
        },
        c_attack: {
            name: "Counterattack",
            description: "Those who were on the brink of death, who had lost all hope, suddenly find inspiration and, gathering the remnants of their strength, repel the enemy when the hero's majestic cry echoes between the ranks. \n\n Destroys 3 enemy tiles in 3 random columns."
        },
        worm: {
            name: "Worm (Strong)",
            description: "The ground trembles and cracks, an omen of impending doom. From the bottomless depths rises the Worm. It relentlessly devours the enemy's ranks. The cries and moans of the consumed enemies echo long underground, the temporary satisfaction of an eternally hungry beast. \n\n Destroys up to 8 enemy tiles one after another."
        },
        wormMiddle: {
            name: "Worm (Medium)",
            description: "The ground trembles and cracks, an omen of impending doom. From the bottomless depths rises the Worm. It relentlessly devours the enemy's ranks. The cries and moans of the consumed enemies echo long underground, the temporary satisfaction of an eternally hungry beast. \n\n Destroys up to 6 enemy tiles one after another."
        },
        wormLow: {
            name: "Worm (Weak)",
            description: "The ground trembles and cracks, an omen of impending doom. From the bottomless depths rises the Worm. It relentlessly devours the enemy's ranks. The cries and moans of the consumed enemies echo long underground, the temporary satisfaction of an eternally hungry beast. \n\n Destroys up to 4 enemy tiles one after another."
        },
        pike: {
            name: "God's Spear (Strong)",
            description: "A mighty weapon, radiating the bright light of divine energy. Its tip pierces through enemy ranks with unerring precision, leaving only ash in its wake. \n\n Destroys 9 enemy tiles forming the tip of the spear."
        },
        pikeLow: {
            name: "God's Spear (Weak)",
            description: "A mighty weapon, radiating the bright light of divine energy. Its tip pierces through enemy ranks with unerring precision, leaving only ash in its wake. \n\n Destroys 3 enemy tiles forming the tip of the spear."
        },
        pikeMiddle: {
            name: "God's Spear (Medium)",
            description: "A mighty weapon, radiating the bright light of divine energy. Its tip pierces through enemy ranks with unerring precision, leaving only ash in its wake. \n\n Destroys 5 enemy tiles forming the tip of the spear."
        },
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.en = languages;
