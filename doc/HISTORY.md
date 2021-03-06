## 0.5.1

* makes worldFolder option optional

## 0.5.0

* improve ticks performance a bit
* add /summonMany
* load/save the seed
* takes worldFolder instead of regionFolder as option to load the world

## 0.4.0

* fix last problems with portal frame detection
* add effects and abilities
* add colors to chat function
* don't spawn in water
* implement portal creation (no teleporting yet)
* implement latency
* use prismarine-world 0.4.0 to implement loading/saving
* add player-list-text config option
* add everybody-op option

## 0.3.1

 * don't login if the client is already ended
 * make /attach use the selectors, fix UserError, check /tp has one target
 * create an entity.attach, and add a /pile command
 * improve tests
 * fix player.kick, add serv.quit(reason)
 * fix badges on npm

## 0.3.0

* sounds
* lot of use of destructuring in the code
* handle view distance properly
* entities : spawning, physics, some sounds
* block drops
* refactoring : serv/player/entity plugins together
* lot of new commands : 
/summon, /spawn, /spawnObject, /kill, /attach, /teleport (thanks @azastrael), /op, /deop, /ban-ip, /pardon-ip, /xp
* entity properties directly in player
* proper plugins handling
* behaviors
* player inventory (thanks @109C)
* tests using mineflayer
* unload chunks
* xp
* selectors
* ip ban (thanks @109C)
* improve /help command

## 0.2.0
*First functional release*

* Infinite worlds
* World generation (thanks @JWo1F!)
* World loading from anvil files
* Improved error handling
* Implement kicking and banning (thanks @demipixel!)
* Using ES6
* ModPE basic support (thanks @Creeplays!)
* Better commands, proper commands class instead of just IFS
* Enable compression!
* Multi-world support: overworld + nether (thanks @demipixel!)

## 0.1.0
*Initial release*

First version, basic functionalities
