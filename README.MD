## Giga Fishing.

---

## First Time Installation & Updating Opcodes
- Opcodes only here https://github.com/tera-proxy/tera-data/tree/master/map.
- Move the defs folder into  your definition folder.
- Move or merge the protocol file in your opcodes folder.

---

## Commands
You can edit the delays in the config.json file via notepad once you enter `/8 gfish save`.

| Command  | Description | Additional Information
| ------------- | ------------- | ------------- |
| /8 gfish start | To enable the module. |  |
| /8 gfish gmmode `mode` | Action that we take if an gm spawns near us. | Mode can be exit, lobby, stop or nothing. Default is stop. |
| /8 gfish skipbaf | Skips BAF | |
| /8 gfish blacklist add `link` | Add the desired item to the blacklist for auto decompose or selling. | Blacklist means, that you don't want this fishes to be dismantled or sold. |
| /8 gfish blacklist remove `link` | Remove the desired item from the blacklist. | How to link is described in the note section. |
| /8 gfish blacklist reset | Reset your current blacklist. | In case you want to remove everything. |
| /8 gfish setrecipe | The last used recipe will be used for auto crafting. |  |
| /8 gfish selltonpc `range` | Sell fishes when your inventory is full to fishing merchant. | Maximum range between you and the npc is 6 meters. |
| /8 gfish filetmode bank `value` | Set the value to bank fish filets after filling your inventory. | Value range is 500 - 10000. You need at least one banker scroll in vip panel or inventory. |
| /8 gfish filetmode | Disable any interactions with filets. | Useful for switching different modes. |
| /8 gfish sellscroll | Sell fishes when your inventory is full. | You need traveling merchant scroll in your inventory and additional opcodes & defs. |
| /8 gfish autosalad | To enable auto using of fish salad. | Both craftable and event salad gets auto detected. |
| /8 gfish reloadconf | To reload your current configuration file. | In case you are editing something manually and you are still ingame. |
| /8 gfish save | To save your entered settings.  | Config file gets generates per character. |
| /8 gfish stats| Print current fishing statistic. | Fish level, total fishes and time per fish. |
| /8 gfish debug | Debug mode of the modules current function. | Shows you decision that bot takes. |

---

## Note
- If you want to use an special bait before another one make sure it's slot is lower than the slot from the other one.
- To add an item link into the chat just press ctrl and left mouse onto the desired item.
- This repo will only contain the opcodes for the Eu version, unless someone send them to me for other regions.

---

- If you need to log all client or server packets use [Packets Logger]

---

## Important Changes With The Latest Big Update
<details>
<summary>Changelog</summary>
- From now on this module will only work on Toolbox. Please don't ask for help in his discord tho.
<br>
- If you want to farm filet you need to use /8 gfish filetmode bank since there is no drop option anymore.
<br>
- The bot is crafting baits once instead of the max. amount. One time crafting equals 10 baits.
<br>
- There is no need to use the setbait command since they get autodetected now.
