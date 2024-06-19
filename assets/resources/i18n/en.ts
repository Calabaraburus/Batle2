
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
            text: "Fritris is a world inhabited by beastfolk. Across its continents, amidst seas and towering mountains, they conduct their affairs, build kingdoms, fight for land, and trade. Life in Fritris proceeds in a steady rhythm until an extraordinary series of events disrupts this balance and pushes the entire civilization to the brink of disaster.\n\n" +
                "At the foot of ancient mountains, in the distant kingdom of Dalmyr, a band of mercenaries marches along a dusty rural road..."
        },
        ending: {
            name: "Ending",
            image: "rezkarEnding",
            text: "Seated on the dark, bloodstained throne, the new king gazed at the empty halls, the desolate streets, and the barren lands. Beside him, a sinister presence, now openly visible, rested a hand on Rezkar’s shoulder, chuckling with satisfaction. The darkness from the ancient relic had fully claimed its prize."
        },
    },
    levels: {
        lvl1: {
            num: "1",
            name: "First Skirmish",
            intro: "Rezkar, a mighty lizard mercenary, arrives with his band in a quiet village where they learn the residents suffer from frequent bandit raids. The village elder, not sparing any coins, quickly convinces the mercenaries to protect the settlement. At sunset, beneath blood-red clouds, a battle erupts as the mercenaries' steel meets the shadowy figures of the raiders.",
            ending: "When the last bandit falls, the grateful villagers invite the mercenaries to celebrate and raise frothy mugs in victory. During the festivities, a merchant approaches Rezkar, asking for an escort to Forkar. «Lately, there have been many rogues in the area; it seems some unknown force draws them here,» the merchant explains."
        },
        lvl2: {
            num: "2",
            name: "The Caravan",
            intro: "The road from the village to the port city of Forkar has grown perilous. The mercenaries agree to escort a merchant caravan through these dangerous lands.\n\n" +
                "Halfway through the journey, sensing a lucrative opportunity, a band of robbers ambushes them. Rezkar raises his hand, signaling his troops to take defensive positions.",
            ending: "The mercenaries chase the fleeing robbers into the forest, discovering their camp. Among the loot and weapons, they find a monk shackled to a stump.\n\n" +
                "«My name is Sholoh, and I am grateful for my liberation,» he says as a mercenary breaks his chains.\n\n" +
                "They take the monk with them to the city, where a ship and his brethren await him. After delivering the goods, the merchant hands a few coins to Rezkar and leaves contentedly.\n\n" +
                "«You saw how we deal with bandits!» Rezkar calls after the merchant, counting the coins.",
        },
        lvl3: {
            num: "3",
            name: "Vile Revenge",
            intro: "The stingy merchant is forced to pay the agreed amount in full before Rezkar releases him from his grip. Harboring a grudge, the merchant falsely accuses Rezkar of attacking caravans, successfully defaming him before the city council. Under the council's orders, city guards launch an assault on the mercenaries. The fight in the narrow city streets proves challenging...",
            ending: "The mercenaries fight their way towards the city gates but are eventually overwhelmed by the guards. Desperate and trapped, they don't know how to escape. Suddenly, Sholoh appears. «Follow me to my ship!» the monk says, pointing towards the port. The mercenaries fight their way to the harbor and board the ship, fleeing from the unjust and brutal wrath of the city guards."
        },
        lvl4: {
            num: "4",
            name: "Sea Battle",
            intro: "The mercenaries sail away on Sholoh's ship but find no solace. A frigate flying a black flag emerges from the horizon, rapidly closing in. Pirates soon board Rezkar's vessel.\n\n" +
                "«Damn it… Can’t we let our steel dry for a moment?» Rezkar curses, drawing his weapon.",
            ending: "Many warriors perish in the naval skirmish. The ship survives the battle and after a grueling voyage, docks at the city of Kronbri." +
                "The monks bid the mercenaries a warm farewell and head northwest towards the distant mountains. For Rezkar and his seasoned warriors, there is always work in the big city."
        },
        lvl5: {
            num: "5",
            name: "Treasures of Antiquity",
            intro: "At the first port tavern Rezkar visits, he learns that volunteers are being recruited for the local lord’s army. An unexpected threat looms over these lands; a massive horde has descended from the mountains, swiftly advancing towards the city, destroying everything in its path. Kronbri braces for a harsh siege. The authorities order Rezkar to lead a raid into the mountains to find the source of the invasion.\n\n" +
                "Soon, the mercenaries find themselves at the walls of an ancient monastery where the horde's leader hides. Rezkar senses a dark aura emanating from this place. Under the cover of darkness, the mercenaries infiltrate the monastery and launch a surprise attack on their enemies.",
            ingame: "Sholoh and his monks have also been trying to enter the monastery, their former home, for days. They seize the opportunity to slip inside as the mercenaries distract the guards...",
            ending: "The mercenaries catch their foes off guard and defeat them. To Rezkar's surprise, fighting continues inside the temple. The group enters to find the monks’ bodies. In the center of the hall stands the horde leader, gripping a sword buried to the hilt in Sholoh’s flesh. In turn, Sholoh clutches a chain around the leader's neck, pulling with such force it seems to hold the saint's entire purpose.\n\n" +
                "Rezkar notices the monk's lips moving, uttering a spell. Magic explodes between them, their bodies flung against the stone walls.\n\n" +
                "The mercenaries search the room and find a hidden passage, presumably used by the monks."
        },
        lvl6: {
            num: "6",
            name: "The Bridge",
            intro: "Rezkar continued serving the Lord, taking on the most dangerous missions. Gaining the Lord's favor, he rose to become one of Kronbri's generals. His fame grew, a dark but alluring aura surrounding him, making him a revered hero among soldiers and common folk alike. Each victory filled Rezkar with more power, and his army grew in size and strength.\n\n" +
                "Sensing his newfound power, the Lord became ambitious and sought to seize control of the entire kingdom of Dalmyr. He ordered an attack on the King’s garrison at the bridge leading to the capital.",
            ending: "Fighting on the narrow bridge, Rezkar felt an effortless power in his movements, mercilessly cutting down the defending soldiers. The bridge was captured.\n\n" +
                "In the camp on the opposite bank, within the Lord’s tent, a war council convened. Rezkar sat in a chair, studying a small dark seed within his amulet. He recalled the last time he saw the darkness in the crystal—it was when he took it from the lifeless hands of Sholoh, who had fought so desperately for this artifact in the gloomy mountain halls. Rezkar had kept it as a token of the monk's bravery."
        },
        lvl7: {
            num: "7",
            name: "The Grand Battle",
            intro: "«What is that?» the Lord asked, reaching for the amulet. In a swift motion, Rezkar’s blade ended his master’s life\n\n" +
                "«Don’t you dare,» was the last thought of the Lord. The attendees stood in stunned silence, captivated by Rezkar’s commanding presence.\n\n" +
                "...On a vast autumn field, Rezkar now faced the King’s fully deployed army. Commanding an entire army, he barely remembered his days as a mere mercenary.",
            ending: "The King’s forces retreated. The mixed scent of death and burning fields filled the air. Breathing in the bitter taste, Rezkar couldn’t help but smile, feeling a deep satisfaction. Though victorious, he realized he couldn’t stop until the King himself was dead."
        },
        lvl8: {
            num: "8",
            name: "The Breach in the Walls",
            intro: "Rezkar’s army gathered their forces around the ancient city of Myrdan—the kingdom’s capital. The walls, adorned with centuries-old carvings and frescoes, stood as a formidable barrier.\n\n" +
                "Rezkar felt his mind succumbing to the darkness and madness invoked by the amulet, yet from this darkness, he drew immense power. With a mighty strike, he channeled energy towards the city. The air vibrated, a wave of force shook the ground, and the once-monolithic walls crumbled, creating a massive breach. His troops charged in...",
            ending: "Like possessed beings, Rezkar’s soldiers swept through the streets, leaving destruction in their wake. Unfaltering and devoid of pity, Rezkar led the charge. \n\n" +
                "The battle raged until dawn. As the first rays of sunlight touched the desolate streets, Rezkar stood on the central square, surrounded by his warriors."
        },
        lvl9: {
            num: "9",
            name: "Last Hope",
            intro: "The remnants of Myrdan's garrison and armed citizens gathered at the far end of the square. A spark of hope and faith burned in their hearts, believing they could stand against Rezkar’s madness. With battle cries and prayers, they faced the enemy with courage. Despite being consumed by the amulet’s power, Rezkar felt a flicker of admiration for their bravery and resilience.",
            ending: "The once joyful square became a scene of tragedy. The dead city lay in ruins...\n\n" +
                "The battered remnants of Rezkar’s army advanced towards the King’s castle. Their numbers were few, but they were driven by triumph and fury."
        },
        lvl10: {
            num: "10",
            name: "Whose Crown?",
            intro: "In the heart of the fortress, under the ancient castle’s vaults, the final battle erupted. Rezkar, with his loyal warriors, clashed with the King’s personal guard. The clash of steel and cries of the wounded echoed through the halls.\n\n" +
                "The Ruler heared the approaching chaos and tightened his grip on his scepter. Ready to defend his throne to the last breath, he knew every moment could be decisive in this battle for the kingdom’s fate.",
            ending: "The exhausted but unyielding ruler met Rezkar face to face. Their blades clashed with a resounding clang. With each strike, Rezkar pressed the King back until his sword finally broke through and pierced the ruler's chest. The King fell to his knees, blood gushing from the wound. His scepter slipped from his weakening fingers, clattering against the marble tiles at Rezkar’s feet.\n\n" +
                "The halls of the castle resounded with triumphant shouts of «Victory!»"
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
